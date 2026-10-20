import { execFileSync } from 'node:child_process'
import { lstatSync } from 'node:fs'
import { isAbsolute, join, normalize } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

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

/**
 * Runs each declared check from the repository root, without a shell, and reports it against the artefact and every
 * source, so that a focused `--staged` audit sees the finding whichever of them is staged. The program must be one of
 * the repository's own regular files: the audit runs no command a repository did not commit.
 */
export const inspectAssembled = (root: string, value: unknown): readonly AuditOutcome[] => {
  const declarations = parseAssembled(value)
  if (typeof declarations === 'string')
    return [{ status: 'VIOLATION', message: `.ki.toml ${declarations}.`, subject: '.ki.toml' }]
  return declarations.flatMap(({ artifact, sources, check }): AuditOutcome[] => {
    const subjects = [artifact, ...sources]
    const each = (status: AuditOutcome['status'], message: string): AuditOutcome[] =>
      subjects.map((subject) => ({ status, message, subject }))
    const [program = '', ...args] = check
    if (!isRegularFile(join(root, program)))
      return each('VIOLATION', `the assembly check ${program} is not a committed regular file in the repository`)
    try {
      execFileSync(join(root, program), args, {
        cwd: root,
        stdio: ['ignore', 'ignore', 'pipe'],
        timeout: CHECK_TIMEOUT_MS
      })
      return each('PASS', `${artifact} matches its sources under \`${check.join(' ')}\``)
    } catch (error) {
      const stderr = (error as { stderr?: Buffer }).stderr?.toString().trim()
      return each(
        'VIOLATION',
        `${artifact} does not match its sources under \`${check.join(' ')}\`; reassemble it and stage the result${
          stderr ? `\n    ${stderr.split('\n').slice(0, 5).join('\n    ')}` : ''
        }`
      )
    }
  })
}
