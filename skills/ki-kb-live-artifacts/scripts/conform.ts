#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-kb-live-artifacts standard — an honest
 * normalize-only conform. Most of this domain's findings are judgment (rendering
 * Markdown to HTML, choosing active-vs-archived, deleting an orphaned render),
 * so this script fixes only the two unambiguous, reversible gaps and prints the
 * rest as manual TODOs — never guessing a render or a deletion.
 *
 * Scope: a single base (default cwd), matching the house conform shape
 * (`bun conform.ts .` / `ki:kb-live-artifacts:conform`). The index-note name,
 * artifacts-dir default, the `.md`/`.html` pairing rule, and the frontmatter
 * parser are kept in lockstep with audit.ts (copied, not imported, so each
 * script stays valid standalone per the composition-only rule).
 *
 *   bun scripts/conform.ts [base-path]   # default: cwd
 *   --dry-run                            # print the plan, mutate nothing
 *
 * Fixes (unambiguous + reversible only):
 *   - LA-S-1 (index note absent): when artifact sources exist but the
 *     `Live Artifacts.md` index is missing, CREATES a stub index listing every
 *     source found. Each entry carries a placeholder description and a manual
 *     TODO to write the real one-line description (LA-J-1 is judgment).
 *   - Index entries (supports LA-J-1): a source `.md` present on disk but not
 *     mentioned in an EXISTING index gets an entry APPENDED to the end — existing
 *     entries and their order are never touched. A manual TODO is printed for
 *     each appended entry so the operator can position it and write its blurb.
 *   - LA-F-2 (`renders` missing): when a source `.md` HAS a frontmatter block but
 *     no `renders` field, appends `renders: html` — the only render type in the
 *     model, derivable from the `.md`/`.html` pairing convention. Frontmatter is
 *     never created from scratch.
 *
 * Deliberately NEVER touches (judgment → manual TODOs):
 *   - LA-S-2 (`.md` with no `.html`) — rendering Markdown to HTML is a generate
 *     step this skill does not perform; flagged as needing a render.
 *   - LA-S-3 (orphaned `.html`) — delete the stale render or author the missing
 *     source is a human call requiring confirmation; never auto-deleted.
 *   - LA-S-4 (stale pair) — regenerating the HTML is a render step, not scripted.
 *   - LA-F-1 (`status` missing/invalid) — active-vs-archived is a judgment, not
 *     derivable; never defaulted.
 *   - Frontmatter block missing entirely — authoring a whole block is judgment.
 *   - LA-J-1..4 — index accuracy, source authority, archive rationale, name
 *     stability are all reader judgment.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error (base path not a directory); findings/fixes never fail
 * the run.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const INDEX_NOTE = 'Live Artifacts.md'
const DEFAULT_ARTIFACTS_DIR = 'Admin/Operations/Live Artifacts'

const isDir = (p: string): boolean => existsSync(p) && statSync(p).isDirectory()
const isFile = (p: string): boolean => existsSync(p) && statSync(p).isFile()

function parseFrontmatter(text: string): Record<string, string> | null {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const block = text.slice(3, end)
  const out: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()
    if (key && val) out[key] = val
  }
  return out
}

function listDir(dir: string): string[] {
  if (!isDir(dir)) return []
  return readdirSync(dir).map((n) => join(dir, n))
}

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── entry ──
function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const base = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (!isDir(base)) {
    console.error(paint(C.red, `error: not a directory: ${base}`))
    process.exit(1)
    return
  }

  const artifactsDir = join(base, DEFAULT_ARTIFACTS_DIR)
  console.log(paint(C.dim, `target: ${DEFAULT_ARTIFACTS_DIR}/${dryRun ? '   (dry run)' : ''}\n`))

  if (!isDir(artifactsDir)) {
    console.log(paint(C.dim, `${DEFAULT_ARTIFACTS_DIR}/ not found — no live artifacts to conform.`))
    return
  }

  const entries = listDir(artifactsDir)
  const mdFiles = entries.filter((p) => extname(p) === '.md' && !p.endsWith(`/${INDEX_NOTE}`)).sort()

  const manualTodos: string[] = []

  // ── a) renders frontmatter repair ──
  console.log(paint(C.cyan, 'renders frontmatter'))
  let fmFixes = 0
  for (const mdPath of mdFiles) {
    const rel = mdPath.replace(`${base}/`, '')
    const content = readFileSync(mdPath, 'utf8')
    const fm = parseFrontmatter(content)
    if (!fm) continue // no frontmatter block — authoring one is judgment, not scripted

    if (!fm.renders) {
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!fmMatch) continue
      const newBlock = `---\n${fmMatch[1]}\nrenders: html\n---`
      const newContent = content.replace(fmMatch[0], newBlock)
      console.log(`  ${paint(C.green, 'fix')}   ${rel} — add renders: html`)
      if (!dryRun) writeFileSync(mdPath, newContent)
      fmFixes++
    }
    if (!fm.status) manualTodos.push(`${rel}: LA-F-1 — add 'status' (active | archived); active-vs-archived is a human call`)
  }
  if (fmFixes === 0) console.log(`  ${paint(C.dim, 'nothing to fix')}`)

  // ── b) index note: create if absent, else append unlisted sources ──
  console.log(`\n${paint(C.cyan, `index note (${INDEX_NOTE})`)}`)
  const indexPath = join(artifactsDir, INDEX_NOTE)
  const entryLine = (stem: string, file: string): string => `- [${stem}](${basename(file)}) — _(description — see manual TODO)_`

  if (mdFiles.length === 0) {
    console.log(`  ${paint(C.dim, 'no artifact sources — nothing to index')}`)
  } else if (!isFile(indexPath)) {
    const lines = mdFiles.map((p) => entryLine(basename(p, '.md'), p))
    const stub = `# Live Artifacts\n\nOperational documents reflecting the current state of the island. Each row is a \`.md\`/\`.html\` pair.\n\n${lines.join('\n')}\n`
    console.log(`  ${paint(C.green, 'create')} ${INDEX_NOTE} — stub listing ${mdFiles.length} source(s)`)
    if (!dryRun) writeFileSync(indexPath, stub)
    for (const p of mdFiles) manualTodos.push(`${INDEX_NOTE}: write the one-line description for ${basename(p, '.md')} (LA-J-1)`)
  } else {
    const indexContent = readFileSync(indexPath, 'utf8')
    const appendLines: string[] = []
    for (const p of mdFiles) {
      const stem = basename(p, '.md')
      if (indexContent.includes(basename(p)) || indexContent.includes(stem)) continue
      appendLines.push(entryLine(stem, p))
      manualTodos.push(`${INDEX_NOTE}: position the appended entry for ${stem} and write its one-line description (LA-J-1)`)
      console.log(`  ${paint(C.green, 'append')} ${stem}`)
    }
    if (appendLines.length === 0) {
      console.log(`  ${paint(C.dim, 'every source already listed')}`)
    } else if (!dryRun) {
      writeFileSync(indexPath, `${indexContent.replace(/\n*$/, '\n')}${appendLines.join('\n')}\n`)
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(`  - LA-S-2 (unpublished .md), LA-S-3 (orphaned .html), LA-S-4 (stale pair) all need a render or a`)
  console.log('    confirmed delete — this skill does not render Markdown to HTML or delete files. See audit output.')
  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts` (or `ki:kb-live-artifacts:audit`) to confirm findings clear.')}`
  )
}

main()
