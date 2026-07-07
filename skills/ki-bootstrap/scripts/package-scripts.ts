/**
 * Shared package.json / .gitignore helpers for ki-bootstrap's linkers.
 *
 * Scripts are added by text splice (never JSON.parse -> JSON.stringify), so untouched parts
 * of package.json — formatting, key order, whether an array is inlined or multi-line — are
 * never rewritten as a side effect. An existing entry for the same key is never overwritten
 * (a repo may have deliberately customized the command).
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

export function readText(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

export function hasScript(pkgText: string, name: string): boolean {
  try {
    const pkg = JSON.parse(pkgText) as { scripts?: Record<string, unknown> }
    return !!pkg.scripts && name in pkg.scripts
  } catch {
    return false
  }
}

export function gitignoresPath(gitignore: string, path: string): boolean {
  const pattern = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`)
  return gitignore.split(/\r?\n/).some((l) => pattern.test(l.trim()))
}

// Splice one or more `"key": "command"` entries into package.json's "scripts" block.
export function ensureScripts(target: string, additions: Array<[string, string]>, dryRun: boolean): void {
  const pkgPath = join(target, 'package.json')
  if (!existsSync(pkgPath)) return

  const pkgText = readFileSync(pkgPath, 'utf8')
  let pkg: { scripts?: Record<string, string> }
  try {
    pkg = JSON.parse(pkgText)
  } catch {
    console.log(`${YELLOW}skip  ${RESET}package.json ${DIM}(not valid JSON — leaving scripts untouched)${RESET}`)
    return
  }

  const pending = additions.filter(([key]) => !pkg.scripts?.[key])
  if (pending.length === 0) return

  for (const [key, command] of pending) console.log(`${GREEN}script${RESET} ${key} -> ${DIM}${command}${RESET}`)
  if (dryRun) return

  const scriptsMatch = pkgText.match(/^([ \t]*)"scripts"\s*:\s*\{([\s\S]*?)\n([ \t]*)\}/m)
  if (!scriptsMatch) {
    console.log(`${YELLOW}skip  ${RESET}package.json ${DIM}(no "scripts" block to extend — add one by hand first)${RESET}`)
    return
  }
  const [whole, , body, closeIndent] = scriptsMatch
  const entryIndent = `${closeIndent}  `
  const trimmedBody = body.replace(/,\s*$/, '')
  const newLines = pending.map(([key, command]) => `${entryIndent}"${key}": ${JSON.stringify(command)}`).join(',\n')
  const rebuilt = `${scriptsMatch[1]}"scripts": {${trimmedBody ? `${trimmedBody},\n` : '\n'}${newLines}\n${closeIndent}}`
  writeFileSync(pkgPath, pkgText.replace(whole, rebuilt))
}

// Single-script convenience wrapper.
export function ensureScript(target: string, key: string, command: string, dryRun: boolean): void {
  ensureScripts(target, [[key, command]], dryRun)
}
