import { execFileSync } from 'node:child_process'
import { copyFileSync, lstatSync, mkdirSync, mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { checkoutIndex } from './indexed-checkout.ts'

/**
 * One artefact a repository assembles from its sources and commits, with the repository's own check that the
 * committed artefact still matches them, declared as `[[skills.ki-repo-tools.assembled]]` in `.ki.toml`.
 */
export type AssembledDeclaration = {
  readonly artifact: string
  readonly sources: readonly string[]
  readonly check: readonly string[]
}

export type AssembledToolsContext = {
  readonly applicable: boolean
  /** Runs each declared check once; empty when nothing is declared. */
  readonly inspect: () => readonly AuditOutcome[]
}

const CHECK_TIMEOUT_MS = 60_000

// A repository-relative path that stays inside the repository.
const relativePath = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length > 0 &&
  !isAbsolute(value) &&
  !normalize(value).startsWith('..') &&
  !value.includes('\0')

const isRegularFile = (path: string): boolean => {
  try {
    const metadata = lstatSync(path)
    return metadata.isFile() && !metadata.isSymbolicLink()
  } catch {
    return false
  }
}

/** Validates the declaration down, or names the first thing wrong with it. */
export const parseAssembled = (value: unknown): readonly AssembledDeclaration[] | string => {
  if (value === undefined) return []
  if (!Array.isArray(value)) return 'assembled must be an array of tables'
  const declarations: AssembledDeclaration[] = []
  for (const [index, entry] of value.entries()) {
    const where = `assembled[${index}]`
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return `${where} must be a table`
    const { artifact, sources, check, ...rest } = entry as Record<string, unknown>
    const extra = Object.keys(rest)
    if (extra.length > 0) return `${where} has unknown keys: ${extra.join(', ')}`
    if (!relativePath(artifact)) return `${where}.artifact must be a repository-relative path`
    if (!Array.isArray(sources) || sources.length === 0 || !sources.every(relativePath))
      return `${where}.sources must be a non-empty array of repository-relative paths`
    if (
      !Array.isArray(check) ||
      check.length === 0 ||
      !check.every((argument) => typeof argument === 'string') ||
      !relativePath(check[0])
    )
      return `${where}.check must be an argument array whose program is a repository-relative path`
    declarations.push({ artifact, sources, check: check as string[] })
  }
  return declarations
}

/** The physical target must stay inside the repository, including through parent-directory symlinks. */
const contained = (root: string, path: string): boolean => {
  try {
    const child = relative(realpathSync(root), realpathSync(join(root, path)))
    return child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child)
  } catch {
    return false
  }
}

const git = (root: string, args: readonly string[], env: NodeJS.ProcessEnv = process.env): string =>
  execFileSync('git', ['-C', root, ...args], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: CHECK_TIMEOUT_MS,
    killSignal: 'SIGKILL'
  })

const indexedMode = (root: string, path: string, env: NodeJS.ProcessEnv): string | undefined => {
  const entries = git(root, ['ls-files', '--stage', '-z', '--', path], env).split('\0').filter(Boolean)
  if (entries.length !== 1) return undefined
  const [metadata, name] = (entries[0] ?? '').split('\t')
  const [mode, , stage] = (metadata ?? '').split(' ')
  return name === path && stage === '0' ? mode : undefined
}

const inspectDeclaration = (
  root: string,
  snapshot: string,
  env: NodeJS.ProcessEnv,
  { artifact, sources, check }: AssembledDeclaration
): AuditOutcome[] => {
  const [declaredProgram = '', ...args] = check
  const program = normalize(declaredProgram)
  // Changing the declaration or checker must also expose a mismatch to the staged-path filter.
  const subjects = [...new Set([artifact, ...sources, '.ki.toml', program])]
  const each = (status: AuditOutcome['status'], message: string): AuditOutcome[] =>
    subjects.map((subject) => ({ status, message, subject }))
  if (
    indexedMode(root, program, env) !== '100755' ||
    !contained(root, program) ||
    !isRegularFile(join(root, program)) ||
    !contained(snapshot, program) ||
    !isRegularFile(join(snapshot, program))
  )
    return each(
      'VIOLATION',
      `the assembly check ${program} must be a git-tracked executable regular file contained in the repository`
    )
  if ([artifact, ...sources].some((path) => !contained(snapshot, path)))
    return each('VIOLATION', `${artifact} and its sources must be present inside the indexed repository`)
  try {
    // Git's hook environment must not redirect a checker back to the original worktree or index.
    const checkEnvironment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))
    execFileSync(join(snapshot, program), args, {
      cwd: snapshot,
      env: checkEnvironment,
      stdio: ['ignore', 'ignore', 'pipe'],
      timeout: CHECK_TIMEOUT_MS,
      killSignal: 'SIGKILL'
    })
    return each('PASS', `${artifact} matches its indexed sources under \`${check.join(' ')}\``)
  } catch (error) {
    const stderr = (error as { stderr?: Buffer }).stderr?.toString().trim()
    return each(
      'VIOLATION',
      `${artifact} does not match its indexed sources under \`${check.join(' ')}\`; reassemble it and stage the result${
        stderr ? `\n    ${stderr.split('\n').slice(0, 5).join('\n    ')}` : ''
      }`
    )
  }
}

/**
 * Freeze the current Git index, then read the declaration and execute its tracked checker in a disposable checkout
 * of that index. Neither unstaged checker edits nor matching unstaged artefacts can conceal a staged mismatch.
 * Working-tree declarations are used only to diagnose an untracked configuration, never as execution authority.
 */
export const inspectAssembled = (root: string, workingDeclaration: unknown): readonly AuditOutcome[] => {
  const violation = (message: string): readonly AuditOutcome[] => [
    { status: 'VIOLATION', message, subject: '.ki.toml' }
  ]
  const temporary = mkdtempSync(join(tmpdir(), 'ki-assembled-'))
  try {
    const index = join(temporary, 'index')
    try {
      copyFileSync(resolve(root, git(root, ['rev-parse', '--git-path', 'index']).trim()), index)
    } catch {
      return workingDeclaration === undefined
        ? []
        : violation('Stage .ki.toml and the assembly check in a Git repository before auditing assembly.')
    }
    const env = { ...process.env, GIT_INDEX_FILE: index }
    const mode = indexedMode(root, '.ki.toml', env)
    if (!mode)
      return workingDeclaration === undefined
        ? []
        : violation('The assembly declaration must be read from a tracked .ki.toml in the index.')
    if (mode !== '100644' && mode !== '100755') return violation('Indexed .ki.toml must be a regular file.')
    let value: unknown
    try {
      const config = Bun.TOML.parse(git(root, ['show', ':0:.ki.toml'], env)) as {
        skills?: { 'ki-repo-tools'?: { assembled?: unknown } }
      }
      value = config.skills?.['ki-repo-tools']?.assembled
    } catch {
      return violation('Indexed .ki.toml must be valid TOML before auditing assembly.')
    }
    const declarations = parseAssembled(value)
    if (typeof declarations === 'string') return violation(`.ki.toml ${declarations}.`)
    if (declarations.length === 0) return []
    const snapshot = join(temporary, 'repository')
    mkdirSync(snapshot)
    checkoutIndex(root, snapshot, env)
    return declarations.flatMap((declaration) => inspectDeclaration(root, snapshot, env, declaration))
  } catch {
    return violation(
      'The assembly check could not read a complete, resolved Git index; resolve and stage the files, then audit again.'
    )
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
}
