import { BOUNDARY_INSTALL } from './boundaries.ts'

export const PRE_COMMIT_COMMANDS = ['bunx lint-staged || exit 1', 'bunx syncpack format --check || exit 1'] as const

export const COMMIT_MSG_COMMAND = 'bunx commitlint --edit "$1" || exit 1'

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

const commandLine = (line: string): boolean =>
  /^\s*bunx\s+(?:lint-staged|syncpack\s+format\s+--check|commitlint\s+--edit\b).*$/.test(line)

const normalise = (source: string, required: readonly string[]): string => {
  const retained = source
    .split(/\r?\n/)
    .filter((line) => !commandLine(line))
    .join('\n')
    .trim()
  return `${required.join('\n')}${retained ? `\n\n${retained}` : ''}\n`
}

export const normalisePreCommit = (source: string): string => normalise(source, PRE_COMMIT_COMMANDS)

export const normaliseCommitMessage = (source: string): string => normalise(source, [COMMIT_MSG_COMMAND])

export const hasPreCommitBaseline = (source: string): boolean =>
  source.startsWith(`${PRE_COMMIT_COMMANDS.join('\n')}\n`)

export const hasCommitMessageBaseline = (source: string): boolean => source.startsWith(`${COMMIT_MSG_COMMAND}\n`)

// Committed hook stubs outside `node_modules`: bound through a relative `core.hooksPath`,
// they resolve in every working tree and refuse a commit whose gate tooling is absent.
export const HOOK_STUB_DIRECTORY = '.githooks'
export const HOOK_STUBS = ['pre-commit', 'commit-msg'] as const
export const HOOK_STUB_BINDING = `git config core.hooksPath ${HOOK_STUB_DIRECTORY}`

/** Accepted `prepare` forms: plain Husky first, then the stub binding where both stubs are committed. */
export const acceptedPrepares = (boundaryInstallRoot: boolean, stubsCommitted: boolean): string[] => {
  const boundary = boundaryInstallRoot ? ` && ${BOUNDARY_INSTALL}` : ''
  return [`husky${boundary}`, ...(stubsCommitted ? [`husky && ${HOOK_STUB_BINDING}${boundary}`] : [])]
}
