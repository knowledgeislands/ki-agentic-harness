import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { inspectStagedDiagramReceipts } from '../../shared/staged-diagram-receipts.ts'

const HOOK = '.githooks/pre-commit'

export type HarnessGateContext = {
  hook: readonly AuditOutcome[]
  receipts: readonly AuditOutcome[]
}

const SKILL_FLAG = /--skill[=\s]+ki-repo-harness(?![\w-])/

const stagedAudit = (line: string): boolean =>
  /\bki repo audit\b/.test(line) && /(^|\s)--staged\b/.test(line) && !/(^|\s)--(fix|write)\b/.test(line)

/** The focused staged ki-repo-harness audit, run directly or through the canonical `quiet_audit` helper. */
const runsFocusedAudit = (lines: readonly string[]): boolean => {
  if (lines.some((line) => stagedAudit(line) && SKILL_FLAG.test(line))) return true
  const audits = lines.filter((line) => /\bki repo audit\b/.test(line))
  return (
    lines.some((line) => /^quiet_audit\(\)\s*\{/.test(line)) &&
    audits.length > 0 &&
    audits.every(stagedAudit) &&
    lines.some((line) => /^quiet_audit\s/.test(line) && SKILL_FLAG.test(line))
  )
}

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
  return runsFocusedAudit(lines)
    ? {
        hook: [
          {
            status: 'PASS',
            message: `${HOOK} runs the focused ki-repo-harness audit check-only on staged content.`,
            subject: HOOK
          }
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

/** The canonical focused hook audits receipt bytes from the index, independent of working files. */
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
