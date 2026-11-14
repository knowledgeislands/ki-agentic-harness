import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const HOOK = '.githooks/pre-commit'
/** A line that audits, conforms, repairs or rewrites: none belongs at commit time; the full audit runs in CI. */
const heavy = (line: string): boolean =>
  /\bki repo (?:audit|conform|repair)\b|(?:^|\s)--(?:fix|write)(?=\s|$)|\bquiet_audit\b/.test(line)

// A staged listing piped to `ruby -wc`, which checks syntax with warnings and never rewrites.
const checksStagedRuby = (line: string): boolean => /\bgit diff --cached\b/.test(line) && /\bruby -wc\b/.test(line)

/** What a Homebrew tap commit gate runs; `ki-repo` HOOK-1 owns whether the hook exists and HOOK-4 its canonical text. */
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
  const offending = lines.find(heavy)
  if (offending !== undefined)
    return [
      {
        status: 'VIOLATION',
        message: `${HOOK} runs \`${offending}\`; the gate is check-only and runs no audit, conform, repair or fix.`,
        subject: HOOK
      }
    ]
  return lines.some(checksStagedRuby)
    ? [
        {
          status: 'PASS',
          message: `${HOOK} runs ruby -wc over the staged Ruby and only check-only staged lints; the full audit runs in CI.`,
          subject: HOOK
        }
      ]
    : [{ status: 'VIOLATION', message: `${HOOK} does not run \`ruby -wc\` over the staged Ruby.`, subject: HOOK }]
}
