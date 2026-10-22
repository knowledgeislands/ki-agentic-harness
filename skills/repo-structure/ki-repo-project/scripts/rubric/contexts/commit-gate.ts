import { lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

const HOOK = '.githooks/pre-commit'
const focused = /(?:^|\s)--skill(?:=|\s+)ki-repo(?=\s|$)/
const staged = (line: string): boolean => /(?:^|\s)--staged(?=\s|$)/.test(line)

/** Project owns the delegated content; ki-repo owns hook existence, binding and exact canonical text. */
export const inspectProjectGate = (root: string): readonly AuditOutcome[] => {
  const outcome = (status: AuditOutcome['status'], message: string): readonly AuditOutcome[] => [
    { status, message, subject: HOOK }
  ]
  try {
    const configPath = join(root, '.ki.toml')
    const file = lstatSync(configPath)
    if (!file.isFile() || file.isSymbolicLink()) throw new Error('unsafe configuration')
    const config = Bun.TOML.parse(readFileSync(configPath, 'utf8')) as {
      skills?: { 'ki-repo'?: { primary_shape?: unknown } }
    }
    if (config.skills?.['ki-repo']?.primary_shape !== 'ki-repo-project')
      return outcome(
        'NOT_APPLICABLE',
        'The general Project is not the primary shape; its selected shape owns the gate.'
      )
  } catch {
    return outcome('NOT_APPLICABLE', 'ki-repo owns missing, unsafe or unresolved primary-shape configuration.')
  }
  let text: string
  try {
    const directory = lstatSync(join(root, '.githooks'))
    if (!directory.isDirectory() || directory.isSymbolicLink())
      return outcome('VIOLATION', 'Project gate directory must be a real directory.')
    const file = lstatSync(join(root, HOOK))
    if (!file.isFile() || file.isSymbolicLink()) return outcome('VIOLATION', 'Project gate must be a regular file.')
    text = readFileSync(join(root, HOOK), 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return outcome('NOT_APPLICABLE', 'No Project pre-commit; ki-repo HOOK-1 owns its existence.')
    return outcome('VIOLATION', 'Project gate could not be read safely.')
  }
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
  const audits = lines.filter((line) => /\bki repo audit\b/.test(line))
  const direct = audits.some((line) => staged(line) && focused.test(line))
  const helper =
    lines.includes('quiet_audit() {') &&
    audits.length > 0 &&
    audits.every(staged) &&
    lines.some((line) => line.startsWith('quiet_audit ') && focused.test(line))
  const mutation = lines.some((line) => /\bki repo conform\b|(?:^|\s)--(?:write|fix)(?=\s|$)/.test(line))
  return !mutation && audits.every(staged) && (direct || helper)
    ? outcome('PASS', 'Project gate runs the focused staged ki-repo audit, check-only.')
    : outcome('VIOLATION', 'Project gate must run ki repo audit --skill ki-repo --staged, check-only.')
}
