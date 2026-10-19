import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const HOOK = '.githooks/pre-commit'

export type HarnessGateContext = {
  hook: readonly AuditOutcome[]
}

const runsHarnessAudit = (line: string): boolean =>
  /\bki repo audit\b/.test(line) &&
  /--skill[=\s]+ki-repo-harness\b/.test(line) &&
  /(^|\s)--staged\b/.test(line) &&
  !/(^|\s)--(fix|write)\b/.test(line)

/** What a harness commit gate runs; `ki-repo` HOOK-1 owns whether the hook exists. */
export const inspectCommitGate = (root: string): HarnessGateContext => {
  const directory = join(root, '.githooks')
  const path = join(root, HOOK)
  if (!existsSync(path)) {
    const linked = existsSync(directory) && lstatSync(directory).isSymbolicLink()
    return {
      hook: [
        linked
          ? {
              status: 'VIOLATION',
              message: 'The .githooks directory is a symbolic link, not committed source.',
              subject: '.githooks'
            }
          : {
              status: 'NOT_APPLICABLE',
              message: 'No committed .githooks/pre-commit; ki-repo HOOK-1 owns its existence.'
            }
      ]
    }
  }
  const metadata = lstatSync(path)
  if (!metadata.isFile() || metadata.isSymbolicLink() || lstatSync(directory).isSymbolicLink())
    return { hook: [{ status: 'VIOLATION', message: `${HOOK} is not a safe regular file.`, subject: HOOK }] }
  const lines = readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('#'))
  if (lines.some((line) => /\bki repo conform\b/.test(line)))
    return {
      hook: [
        {
          status: 'VIOLATION',
          message: `${HOOK} runs \`ki repo conform\`; the gate must be check-only.`,
          subject: HOOK
        }
      ]
    }
  return lines.some(runsHarnessAudit)
    ? {
        hook: [
          { status: 'PASS', message: `${HOOK} runs the harness audit check-only on staged content.`, subject: HOOK }
        ]
      }
    : {
        hook: [
          {
            status: 'VIOLATION',
            message: `${HOOK} does not run \`ki repo audit --skill ki-repo-harness --staged\` check-only.`,
            subject: HOOK
          }
        ]
      }
}
