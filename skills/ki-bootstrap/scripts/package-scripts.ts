/**
 * Shared `.gitignore` helpers for ki-bootstrap's linkers.
 *
 * The linkers create relative symlinks under `.claude/skills/` / `.claude/agents/`
 * and keep those generated paths gitignored; these helpers are the gitignore side.
 * ki-bootstrap writes no `package.json` — the `ki:*` convenience keys are
 * ki-engineering's to wire, as sugar over the vendored `.ki-meta/bin/*` wrappers.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

export function readText(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

export function gitignoresPath(gitignore: string, path: string): boolean {
  const pattern = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`)
  return gitignore.split(/\r?\n/).some((l) => pattern.test(l.trim()))
}

// Append a generated-links ignore for `path` (e.g. `.claude/skills`) if the .gitignore
// does not already cover it. Writes the trailing-slash form the checker (gitignoresPath)
// recognises, so a natural leading-slash guess never leaves BOOT-3/8 unsatisfied. Creates
// .gitignore if absent; leaves existing content untouched otherwise.
export function ensureGitignore(target: string, path: string, dryRun: boolean): void {
  const gitignorePath = join(target, '.gitignore')
  const existing = readText(gitignorePath)
  if (gitignoresPath(existing, path)) return
  const line = `${path}/`
  console.log(`${GREEN}ignore${RESET} ${line} ${DIM}(generated links)${RESET}`)
  if (dryRun) return
  const lead = existing === '' ? '' : existing.endsWith('\n') ? '\n' : '\n\n'
  writeFileSync(gitignorePath, `${existing}${lead}# Generated project-local links (ki-bootstrap) — never committed\n${line}\n`)
}
