import { execFileSync } from 'node:child_process'
import { type Dirent, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import type {
  ConformWrite,
  RubricContextOptions,
  RubricPublicationContext,
  RubricSession
} from '../../shared/rubric.ts'

const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', '.ki', '.agents', '.claude'])
const RECOGNISED_PREFIXES = ['executable_', 'symlink_', 'private_', 'readonly_', 'dot_', 'create_', 'modify_'] as const
const IGNORE_CONTENT =
  '# Files/directories chezmoi should never manage.\n# Add repository-specific ignore patterns deliberately.\n'

export type RepositoryState = 'absent' | 'physical' | 'unsafe'
export type IgnoreState = 'missing' | 'physical' | 'unsafe'

export type ChezmoiShapeContext = {
  repository: string
  repositoryState: RepositoryState
  applicable: boolean
  ignoreState: IgnoreState
  hasTemplateFiles: boolean
  hasTemplateSupport: boolean
  requestIgnoreCreate?: () => void
}

export type BinEntry = {
  name: string
  physical: boolean
}

export type BinContext = {
  repository: string
  repositoryState: RepositoryState
  applicable: boolean
  entries: readonly BinEntry[] | null
}

export type GitContext = {
  repository: string
  repositoryState: RepositoryState
  applicable: boolean
  locks: readonly string[] | null
  /** Whether any `.githooks` path exists. */
  hookDirectory: boolean
  /** The effective `core.hooksPath`, or `null` when unset. */
  hooksPath: string | null
}

export type ScriptHeader = {
  /** Source path relative to the repository root. */
  path: string
  /** Header parts the opening comment block lacks, in header order. */
  missing: readonly HeaderPart[]
}

export type HeaderPart = 'first line' | 'description' | 'Runs' | 'Created'

export type HeaderContext = {
  repository: string
  repositoryState: RepositoryState
  applicable: boolean
  scripts: readonly ScriptHeader[]
}

export type ReviewContext = {
  repository: string
  applicable: boolean
}

export type ChezmoiRubricContext = {
  rubric: RubricPublicationContext
  shape: ChezmoiShapeContext
  bin: BinContext
  git: GitContext
  header: HeaderContext
  review: ReviewContext
}

const pathState = (path: string): 'missing' | 'file' | 'directory' | 'unsafe' => {
  try {
    const state = lstatSync(path)
    if (state.isSymbolicLink()) return 'unsafe'
    if (state.isFile()) return 'file'
    if (state.isDirectory()) return 'directory'
    return 'unsafe'
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'missing' : 'unsafe'
  }
}

const walkPhysicalFiles = (
  directory: string,
  onFile: (path: string) => void,
  skip: (name: string) => boolean
): void => {
  let entries: Dirent[]
  try {
    entries = readdirSync(directory, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (skip(entry.name)) continue
    const path = join(directory, entry.name)
    const state = pathState(path)
    if (state === 'directory') walkPhysicalFiles(path, onFile, skip)
    else if (state === 'file') onFile(path)
  }
}

const repositoryState = (repository: string): RepositoryState => {
  const state = pathState(repository)
  if (state === 'missing') return 'absent'
  return state === 'directory' ? 'physical' : 'unsafe'
}

const hasDeclaration = (repository: string, state: RepositoryState): boolean => {
  if (state !== 'physical' || pathState(join(repository, '.ki.toml')) !== 'file') return false
  try {
    const document = Bun.TOML.parse(readFileSync(join(repository, '.ki.toml'), 'utf8')) as Record<string, unknown>
    const skills = document.skills
    const table =
      skills && typeof skills === 'object' && !Array.isArray(skills)
        ? (skills as Record<string, unknown>)['ki-repo-dotfiles-chezmoi']
        : undefined
    return Boolean(table && typeof table === 'object' && !Array.isArray(table))
  } catch {
    return false
  }
}

const inspectTemplates = (repository: string, state: RepositoryState): { files: boolean; support: boolean } => {
  if (state !== 'physical') return { files: false, support: false }
  let files = false
  walkPhysicalFiles(
    repository,
    (path) => {
      if (path.endsWith('.tmpl')) files = true
    },
    (name) => SKIP_DIRECTORIES.has(name)
  )
  return {
    files,
    support:
      pathState(join(repository, '.chezmoidata')) === 'directory' ||
      pathState(join(repository, '.chezmoitemplates')) === 'directory'
  }
}

const inspectBin = (repository: string, state: RepositoryState): readonly BinEntry[] | null => {
  if (state !== 'physical' || pathState(join(repository, 'bin')) !== 'directory') return null
  let entries: string[]
  try {
    entries = readdirSync(join(repository, 'bin'))
  } catch {
    return []
  }
  return entries
    .flatMap((name): BinEntry[] => {
      const state = pathState(join(repository, 'bin', name))
      if (state === 'directory') return []
      return [{ name, physical: state === 'file' }]
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

const inspectGitLocks = (repository: string, state: RepositoryState): readonly string[] | null => {
  const git = join(repository, '.git')
  if (state !== 'physical' || pathState(git) !== 'directory') return null
  const locks: string[] = []
  for (const candidate of ['index.lock', 'HEAD.lock', 'config.lock', 'packed-refs.lock'])
    if (pathState(join(git, candidate)) === 'file') locks.push(`.git/${candidate}`)
  if (pathState(join(git, 'refs')) === 'directory')
    walkPhysicalFiles(
      join(git, 'refs'),
      (path) => {
        if (path.endsWith('.lock')) locks.push(relative(repository, path))
      },
      () => false
    )
  return locks.sort()
}

// A chezmoi source declares no commit gate: its manual gate lives in AGENTS.md, so GIT-2 reads only that no
// committed hook directory and no effective `core.hooksPath` binding remain.
const inspectHook = (repository: string, state: RepositoryState): Pick<GitContext, 'hookDirectory' | 'hooksPath'> => {
  if (state !== 'physical') return { hookDirectory: false, hooksPath: null }
  let hooksPath: string | null = null
  try {
    hooksPath =
      execFileSync('git', ['-C', repository, 'config', '--get', 'core.hooksPath'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim() || null
  } catch {
    // Unset, or not a Git checkout: no binding to report.
  }
  return { hookDirectory: pathState(join(repository, '.githooks')) !== 'missing', hooksPath }
}

const SCRIPT_EXTENSIONS = ['.sh', '.zsh', '.bash', '.mjs', '.js', '.ts', '.py'] as const
const SOURCE_PREFIXES =
  /^(?:(?:executable|private|readonly|empty|encrypted|exact|external|remove|create|modify|symlink|literal)_|run_(?:once_|onchange_)?(?:before_|after_)?)+/
// Tests and loader-sourced shell fragments are described by their suite or loader, not a header.
const HEADER_EXCLUDED_TARGETS = new Set(['tests', '.zprofile.d', '.zsh'])
const HEADER_LABEL = /^(Usage|Runs|Created):/

/** The target-side name of one source path segment, with chezmoi's attribute prefixes removed. */
const targetSegment = (segment: string): string => {
  const name = segment.replace(/\.tmpl$/, '').replace(SOURCE_PREFIXES, '')
  return name.startsWith('dot_') ? `.${name.slice(4)}` : name
}

const inHeaderScope = (path: string): boolean => {
  const segments = path.split('/')
  if (segments.some((segment) => HEADER_EXCLUDED_TARGETS.has(targetSegment(segment)))) return false
  const leaf = segments.at(-1) ?? ''
  if (/(?:^|_)executable_/.test(leaf) || leaf.startsWith('run_')) return true
  const target = leaf.replace(/\.tmpl$/, '')
  return SCRIPT_EXTENSIONS.some((extension) => target.endsWith(extension))
}

/** Which header parts the opening comment block lacks, after any shebang and template directives. */
export const missingHeaderParts = (text: string): readonly HeaderPart[] => {
  const lines = text.split(/\r?\n/)
  const directive = /^\s*(?:\{\{.*\}\}\s*)?$/
  let index = 0
  // A template directive may precede the shebang, which a rendered target then opens with.
  while (index < lines.length && directive.test(lines[index] ?? '')) index++
  if (lines[index]?.startsWith('#!')) index++
  while (index < lines.length && directive.test(lines[index] ?? '')) index++
  const block: string[] = []
  for (; index < lines.length; index++) {
    const match = /^\s*(?:#(?!!)|\/\/)\s?(.*)$/.exec(lines[index] ?? '')
    if (!match) break
    block.push((match[1] ?? '').trim())
  }
  const [first = '', ...rest] = block
  const labels = new Set(rest.flatMap((line) => HEADER_LABEL.exec(line)?.[1] ?? []))
  const missing: HeaderPart[] = []
  if (!/^\S.* - \S/.test(first)) missing.push('first line')
  if (!rest.some((line) => line && !HEADER_LABEL.test(line))) missing.push('description')
  if (!labels.has('Runs')) missing.push('Runs')
  if (!labels.has('Created')) missing.push('Created')
  return missing
}

const inspectHeaders = (repository: string, state: RepositoryState): readonly ScriptHeader[] => {
  if (state !== 'physical') return []
  const scripts: ScriptHeader[] = []
  walkPhysicalFiles(
    repository,
    (path) => {
      const source = relative(repository, path)
      if (!inHeaderScope(source)) return
      scripts.push({ path: source, missing: missingHeaderParts(readFileSync(path, 'utf8')) })
    },
    (name) => SKIP_DIRECTORIES.has(name)
  )
  return scripts.sort((left, right) => left.path.localeCompare(right.path))
}

export const hasRecognisedPrefix = (name: string): boolean =>
  RECOGNISED_PREFIXES.some((prefix) => name.startsWith(prefix))

export const createChezmoiSession = ({
  mode,
  repository,
  publication
}: RubricContextOptions): RubricSession<ChezmoiRubricContext> => {
  const root = resolve(repository)
  const state = repositoryState(root)
  const applicable = hasDeclaration(root, state)
  const ignorePath = join(root, '.chezmoiignore')
  const rawIgnoreState = pathState(ignorePath)
  const ignoreState: IgnoreState =
    rawIgnoreState === 'missing' ? 'missing' : rawIgnoreState === 'file' ? 'physical' : 'unsafe'
  let ignoreRequested = false
  const templates = inspectTemplates(root, state)
  const shape: ChezmoiShapeContext = {
    repository: root,
    repositoryState: state,
    applicable,
    ignoreState,
    hasTemplateFiles: templates.files,
    hasTemplateSupport: templates.support,
    ...(mode === 'conform' && applicable && state === 'physical' && ignoreState === 'missing'
      ? {
          requestIgnoreCreate: () => {
            ignoreRequested = true
          }
        }
      : {})
  }
  const context: ChezmoiRubricContext = {
    rubric: { publication },
    shape,
    bin: { repository: root, repositoryState: state, applicable, entries: inspectBin(root, state) },
    git: {
      repository: root,
      repositoryState: state,
      applicable,
      locks: inspectGitLocks(root, state),
      ...inspectHook(root, state)
    },
    header: {
      repository: root,
      repositoryState: state,
      applicable,
      scripts: applicable ? inspectHeaders(root, state) : []
    },
    review: { repository: root, applicable }
  }
  return {
    subjects: [
      {
        families: ['CHEZMOI', 'BIN', 'GIT', 'HEADER', 'PATTERN', 'CONFIG', 'LAYER', 'SHELL', 'ETIQ', 'SYNC'],
        context: () => context,
        subject: root
      },
      { families: ['RUBRIC'], context: () => context, subject: root }
    ],
    proposal: () => {
      const writes: ConformWrite[] = []
      if (ignoreRequested) writes.push({ path: '.chezmoiignore', content: IGNORE_CONTENT, create: true })
      return { writes }
    }
  }
}
