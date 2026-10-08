import { execFileSync } from 'node:child_process'
import { lstatSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

export const HOOK_DIRECTORY = '.githooks'
export const PRE_COMMIT_HOOK = '.githooks/pre-commit'
export const HOOK_BINDING = `git config core.hooksPath ${HOOK_DIRECTORY}`

export type HooksRubricContext = {
  hook1: readonly AuditOutcome[]
  hook2: readonly AuditOutcome[]
}

const git = (target: string, args: readonly string[]): string | undefined => {
  try {
    return execFileSync('git', ['-C', target, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return undefined
  }
}

const one = (outcome: AuditOutcome): readonly AuditOutcome[] => [outcome]

// Existence only: what the hook runs belongs to the shape skill that knows the toolchain.
const existence = (target: string): readonly AuditOutcome[] => {
  let state: ReturnType<typeof lstatSync> | undefined
  try {
    state = lstatSync(join(target, PRE_COMMIT_HOOK))
  } catch {
    state = undefined
  }
  if (!state)
    return one({
      status: 'VIOLATION',
      message: `no committed ${PRE_COMMIT_HOOK} gate; the repository's checks run only when remembered`,
      subject: PRE_COMMIT_HOOK
    })
  if (!state.isFile() || state.isSymbolicLink())
    return one({
      status: 'VIOLATION',
      message: `${PRE_COMMIT_HOOK} is not a safe regular file`,
      subject: PRE_COMMIT_HOOK
    })
  const staged = git(target, ['ls-files', '--stage', '--', PRE_COMMIT_HOOK])
  if (!staged)
    return one({ status: 'VIOLATION', message: `${PRE_COMMIT_HOOK} is not tracked`, subject: PRE_COMMIT_HOOK })
  if (!staged.startsWith('100755 '))
    return one({
      status: 'VIOLATION',
      message: `${PRE_COMMIT_HOOK} is tracked without executable mode; run \`git update-index --chmod=+x ${PRE_COMMIT_HOOK}\``,
      subject: PRE_COMMIT_HOOK
    })
  return one({ status: 'PASS', message: `${PRE_COMMIT_HOOK} is tracked and executable`, subject: PRE_COMMIT_HOOK })
}

// The binding lives in each clone's Git configuration, so CI without one has nothing to bind.
const binding = (
  target: string,
  hookPresent: boolean,
  environment: Readonly<Record<string, string | undefined>>
): readonly AuditOutcome[] => {
  if (!hookPresent) return one({ status: 'NOT_APPLICABLE', message: `no committed ${PRE_COMMIT_HOOK} to bind` })
  const value = git(target, ['config', '--get', 'core.hooksPath'])
  if (value && resolve(target, value) === resolve(target, HOOK_DIRECTORY))
    return one({ status: 'PASS', message: `core.hooksPath resolves to ${HOOK_DIRECTORY}` })
  if (!value && environment.CI)
    return one({ status: 'NOT_APPLICABLE', message: 'CI checkout carries no local hook binding' })
  return one({
    status: 'VIOLATION',
    message: `core.hooksPath is ${value ? JSON.stringify(value) : 'unset'}, so the committed gate never runs; run \`${HOOK_BINDING}\``,
    subject: '.git/config'
  })
}

export const hookEvidence = (
  target: string,
  environment: Readonly<Record<string, string | undefined>> = process.env
): HooksRubricContext => {
  const hook1 = existence(target)
  return { hook1, hook2: binding(target, hook1[0]?.status === 'PASS', environment) }
}
