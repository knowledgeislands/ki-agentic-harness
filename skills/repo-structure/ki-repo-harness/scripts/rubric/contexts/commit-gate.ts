import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { inspectStagedDiagramReceipts } from '../../shared/staged-diagram-receipts.ts'

const HOOK = '.githooks/pre-commit'

export type HarnessGateContext = {
  hook: readonly AuditOutcome[]
  receipts: readonly AuditOutcome[]
}

/** A line that audits, conforms, repairs or rewrites: none belongs at commit time; the full audit runs in CI. */
const heavy = (line: string): boolean =>
  /\bki repo (?:audit|conform|repair)\b|(?:^|\s)--(?:fix|write)(?=\s|$)|\bquiet_audit\b/.test(line)

/** What a harness commit gate runs; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text. */
const inspectHook = (root: string): Pick<HarnessGateContext, 'hook'> => {
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
    .filter((line) => line !== '' && !line.startsWith('#'))
  const offending = lines.find(heavy)
  return offending === undefined
    ? {
        hook: [
          {
            status: 'PASS',
            message: `${HOOK} runs only check-only staged lints; the full audit runs in CI.`,
            subject: HOOK
          }
        ]
      }
    : {
        hook: [
          {
            status: 'VIOLATION',
            message: `${HOOK} runs \`${offending}\`; the gate is check-only and runs no audit, conform, repair or fix.`,
            subject: HOOK
          }
        ]
      }
}

/** Receipt bytes are read from the index, independent of working files; in CI the index is the commit. */
export const inspectCommitGate = (root: string): HarnessGateContext => {
  const snapshot = inspectStagedDiagramReceipts(root)
  const receipts: AuditOutcome[] = !snapshot.applicable
    ? [{ status: 'NOT_APPLICABLE', message: 'The staged repository does not declare ki-diagrams.' }]
    : snapshot.findings.length === 0
      ? snapshot.subjects.map((subject) => ({
          status: 'PASS',
          message: 'Staged diagram viewer receipts match their source and viewer bytes.',
          subject
        }))
      : snapshot.subjects.map((subject) => ({ status: 'VIOLATION', message: snapshot.findings.join('; '), subject }))
  return { ...inspectHook(root), receipts }
}
