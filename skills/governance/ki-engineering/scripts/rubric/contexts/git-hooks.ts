import { BOUNDARY_INSTALL } from './boundaries.ts'

// Committed hooks outside `node_modules`: bound through a relative `core.hooksPath`, they
// resolve in every working tree and refuse a commit whose gate tooling is absent.
export const HOOK_DIRECTORY = '.githooks'
export const PRE_COMMIT_HOOK = '.githooks/pre-commit'
export const COMMIT_MSG_HOOK = '.githooks/commit-msg'
export const HOOKS = [PRE_COMMIT_HOOK, COMMIT_MSG_HOOK] as const
export const HOOK_BINDING = `git config core.hooksPath ${HOOK_DIRECTORY}`

// The frame puts `node_modules/.bin` on PATH, so the content calls each tool without `bunx`.
export const PRE_COMMIT_COMMANDS = ['lint-staged || exit 1', 'syncpack format --check || exit 1'] as const

/** The quiet lint-staged form a repository may choose, silent on success under the quiet-tools rule. */
const QUIET_PRE_COMMIT_COMMANDS = ['lint-staged --quiet || exit 1', PRE_COMMIT_COMMANDS[1]] as const

export const COMMIT_MSG_COMMAND = 'commitlint --edit "$1" || exit 1'

/** The package-less `ki-git` binding (`KI-TOOL-KI-CLI-161`), which a package-backed hook may also use. */
const CHECK_MESSAGE_COMMAND = 'ki git check-message "$1" || exit 1'

export const COMMITLINT_CONFIGURATION = `export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-enum': [2, 'always', ['chore', 'docs', 'feat', 'fix', 'refactor', 'test']]
  }
}
`

const PATH_LINE = /^\s*(?:export\s+)?PATH="\$root\/node_modules\/\.bin:\$PATH"\s*$/

const contentLine = (line: string): boolean =>
  /^\s*(?:bunx\s+)?(?:lint-staged\b|syncpack\s+format\s+--check\b|commitlint\s+--edit\b)/.test(line)

/** Splits a hook after its `node_modules/.bin` PATH step; undefined when the frame is absent. */
const splitFrame = (source: string): { frame: string[]; content: string[] } | undefined => {
  const lines = source.split(/\r?\n/)
  const path = lines.findIndex((line) => PATH_LINE.test(line))
  if (path < 0) return undefined
  const start = lines[path + 1]?.trim() === 'export PATH' ? path + 2 : path + 1
  return { frame: lines.slice(0, start), content: lines.slice(start) }
}

const commands = (lines: readonly string[]): string[] =>
  lines.map((line) => line.trim()).filter((line) => line && !line.startsWith('#'))

const delegatesToHusky = (source: string): boolean =>
  commands(source.split(/\r?\n/)).some((line) => line.includes('.husky/'))

const startsWith = (source: string, accepted: readonly (readonly string[])[]): boolean => {
  const split = splitFrame(source)
  if (!split) return false
  const content = commands(split.content)
  return accepted.some((required) => required.every((command, index) => content[index] === command))
}

export const hasPreCommitBaseline = (source: string): boolean =>
  startsWith(source, [PRE_COMMIT_COMMANDS, QUIET_PRE_COMMIT_COMMANDS])

export const hasCommitMessageBaseline = (source: string): boolean =>
  startsWith(source, [[COMMIT_MSG_COMMAND], [CHECK_MESSAGE_COMMAND]])

// CONFORM repairs the content after the frame and keeps every other line. It leaves a hook
// without the frame, or one still delegating to `.husky/`, for hook composition to rewrite.
const normalise = (source: string, required: readonly string[]): string | undefined => {
  const split = splitFrame(source)
  if (!split || delegatesToHusky(source)) return undefined
  const retained = split.content
    .filter((line) => !contentLine(line))
    .join('\n')
    .trim()
  return `${[...split.frame, ...required].join('\n')}${retained ? `\n${retained}` : ''}\n`
}

const quietLintStaged = (source: string): boolean => /^\s*(?:bunx\s+)?lint-staged\s+--quiet\b/m.test(source)

/** Repairs the pre-commit content, keeping lint-staged quiet where the repository already chose `--quiet`. */
export const normalisePreCommit = (source: string): string | undefined =>
  normalise(source, quietLintStaged(source) ? QUIET_PRE_COMMIT_COMMANDS : PRE_COMMIT_COMMANDS)

export const normaliseCommitMessage = (source: string): string | undefined =>
  hasCommitMessageBaseline(source) ? source : normalise(source, [COMMIT_MSG_COMMAND])

// Until the hooks rollout raises SCR-11 to failure, content still in `.husky/` warns rather than fails.
const LEGACY_PRE_COMMIT = PRE_COMMIT_COMMANDS.map((command) => `bunx ${command}`)
const LEGACY_QUIET_PRE_COMMIT = QUIET_PRE_COMMIT_COMMANDS.map((command) => `bunx ${command}`)

export const hasLegacyPreCommitBaseline = (source: string): boolean =>
  [LEGACY_PRE_COMMIT, LEGACY_QUIET_PRE_COMMIT].some((required) => source.startsWith(`${required.join('\n')}\n`))

export const hasLegacyCommitMessageBaseline = (source: string): boolean =>
  source.startsWith(`bunx ${COMMIT_MSG_COMMAND}\n`)

/** The one accepted `prepare`: the hook binding, then the boundary install where that root exists. */
export const acceptedPrepare = (boundaryInstallRoot: boolean): string =>
  `${HOOK_BINDING}${boundaryInstallRoot ? ` && ${BOUNDARY_INSTALL}` : ''}`

/** The retired Husky forms, which CONFORM keeps only until both committed hooks exist. */
export const legacyPrepares = (boundaryInstallRoot: boolean): string[] => {
  const boundary = boundaryInstallRoot ? ` && ${BOUNDARY_INSTALL}` : ''
  return [`husky${boundary}`, `husky && ${HOOK_BINDING}${boundary}`]
}
