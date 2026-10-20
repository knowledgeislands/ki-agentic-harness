import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const HOOK = '.githooks/pre-commit'
const SKILL_FLAG = /--skill[=\s]+ki-repo-specifications(?![\w-])/

const stagedAudit = (line: string): boolean =>
  /\bki repo audit\b/.test(line) && /(^|\s)--staged\b/.test(line) && !/(^|\s)--(fix|write)\b/.test(line)

/** The focused staged ki-repo-specifications audit, run directly or through the canonical `quiet_audit` helper. */
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

/** What a Specifications repository commit gate runs; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text. */
export const inspectCommitGate = (root: string): readonly AuditOutcome[] => {
  const directory = join(root, '.githooks')
  const path = join(root, HOOK)
  if (!existsSync(path))
    return existsSync(directory) && lstatSync(directory).isSymbolicLink()
      ? [
          {
            status: 'VIOLATION',
            message: 'The .githooks directory is a symbolic link, not committed source.',
            subject: '.githooks'
          }
        ]
      : [{ status: 'NOT_APPLICABLE', message: 'No committed .githooks/pre-commit; ki-repo HOOK-1 owns its existence.' }]
  const metadata = lstatSync(path)
  if (!metadata.isFile() || metadata.isSymbolicLink() || lstatSync(directory).isSymbolicLink())
    return [{ status: 'VIOLATION', message: `${HOOK} is not a safe regular file.`, subject: HOOK }]
  const lines = readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
  if (lines.some((line) => /\bki repo conform\b/.test(line)))
    return [
      { status: 'VIOLATION', message: `${HOOK} runs \`ki repo conform\`; the gate must be check-only.`, subject: HOOK }
    ]
  const missing = ([['`ki repo audit --skill ki-repo-specifications --staged`', runsFocusedAudit(lines)]] as const)
    .filter(([, present]) => !present)
    .map(([name]) => name)
  return missing.length === 0
    ? [
        {
          status: 'PASS',
          message: `${HOOK} runs the focused ki-repo-specifications audit check-only on staged content.`,
          subject: HOOK
        }
      ]
    : [{ status: 'VIOLATION', message: `${HOOK} does not run ${missing.join(' or ')} check-only.`, subject: HOOK }]
}
