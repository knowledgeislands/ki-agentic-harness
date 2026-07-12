#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-housekeeping memory area — applies the small set
 * of audit.ts findings that are unambiguous and reversible, and prints everything
 * that needs a human call as a manual TODO. This is an honest normalize-only
 * conform: the memory format is mostly authored prose, so only two finding classes
 * can be mechanically repaired without guessing.
 *
 * Scope: the Claude Code auto-memory store for a single target repo (default cwd),
 * resolved exactly as audit.ts does (~/.claude/projects/<slug>/memory, slug = the
 * repo's absolute path with every "/" and "." replaced by "-"). The slug rule, the
 * frontmatter parser, the four valid metadata.type values, and the index-line regex
 * are kept in lockstep with audit.ts — same source of truth, copied rather than
 * imported so each script stays valid standalone per the composition-only rule.
 *
 *   bun scripts/conform.ts [path]        # default: cwd
 *   bun scripts/conform.ts --memory-dir <dir>   # point at an explicit store
 *   --dry-run                             # print the plan, mutate nothing
 *
 * Fixes (unambiguous + reversible only):
 *   - IDX-3 — a memory/*.md file present on disk with no entry in MEMORY.md gets one
 *     APPENDED to the end of the index (hook drawn from its `description`
 *     frontmatter). Existing entries and their order are never touched; a manual
 *     TODO is printed for each so the operator can move it to its correct semantic
 *     position (DOC-6 — index order is judgment, never guessed).
 *   - FM-2 — when a file's `name:` field is missing from or disagrees with an
 *     existing frontmatter block, it is set to the filename slug (the standard
 *     requires `name` == filename minus `.md`). Frontmatter is never created from
 *     scratch (that is FM-1 — see below).
 *
 * Deliberately NEVER touches (judgment → manual TODOs, never guessed):
 *   - IDX-1 (MEMORY.md missing entirely) — authoring a whole index is judgment.
 *   - IDX-2 (index entry points to a missing file) — could be a rename or a delete;
 *     removing the line vs restoring the file is a human call.
 *   - IDX-4 (index line over 150 chars), IDX-5 (malformed headroom:learn markers),
 *     IDX-6 (cross-repo learn-block captures) — shortening/pruning is judgment.
 *   - FM-1 (no frontmatter block), FM-3 (description missing/empty), FM-4
 *     (metadata.type absent/invalid), FM-5 (duplicate name) — all authoring calls;
 *     no value can be mechanically derived.
 *   - Where within the index an appended entry belongs — printed as a manual TODO.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error; findings and fixes never fail the run.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const VALID_TYPES = new Set(['user', 'feedback', 'project', 'reference'])
const INDEX_ENTRY_RE = /^-\s*\[.+\]\(.+\.md\)/
const INDEX_LINK_RE = /\]\(([^)]+\.md)\)/

function slugifyRepoPath(absPath: string): string {
  return absPath.replace(/[/.]/g, '-')
}

function resolveMemoryDir(repoArg: string | undefined): string {
  const repoAbs = resolve(repoArg ?? process.cwd())
  const slug = slugifyRepoPath(repoAbs)
  return join(homedir(), '.claude', 'projects', slug, 'memory')
}

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const lines = match[1].split('\n')
  const out: Record<string, unknown> = {}
  let currentKey: string | null = null
  for (const line of lines) {
    const topLevel = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (topLevel) {
      currentKey = topLevel[1]
      const value = topLevel[2].trim()
      out[currentKey] = value === '' ? {} : value.replace(/^["']|["']$/g, '')
      continue
    }
    const nested = line.match(/^\s+([a-zA-Z_]+):\s*(.*)$/)
    if (nested && currentKey && typeof out[currentKey] === 'object') {
      ;(out[currentKey] as Record<string, string>)[nested[1]] = nested[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return out
}

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const memDirIdx = argv.indexOf('--memory-dir')
  const memDirArg = memDirIdx !== -1 ? argv[memDirIdx + 1] : undefined
  const repoArg = argv.find((a, i) => !a.startsWith('-') && argv[i - 1] !== '--memory-dir')
  const memoryDir = memDirArg ? resolve(memDirArg) : resolveMemoryDir(repoArg)

  let dirExists = true
  try {
    await stat(memoryDir)
  } catch {
    dirExists = false
  }
  if (!dirExists) {
    // Mirrors audit.ts DIR-1 NA: no store for this repo yet is not a failure.
    console.log(paint(C.dim, `no memory/ directory for this repo yet — nothing to conform: ${memoryDir}`))
    return
  }

  console.log(paint(C.dim, `target: ${memoryDir}${dryRun ? '   (dry run)' : ''}\n`))

  const entries = await readdir(memoryDir)
  const mdFiles = entries.filter((f) => f.endsWith('.md'))
  const indexFile = 'MEMORY.md'
  const hasIndex = mdFiles.includes(indexFile)
  const memoryFiles = mdFiles.filter((f) => f !== indexFile).sort()

  const manualTodos: string[] = []

  // ── a) FM-2: name field repair (existing frontmatter only) ──
  console.log(paint(C.cyan, 'frontmatter name field'))
  let fmFixes = 0
  for (const file of memoryFiles) {
    const filePath = join(memoryDir, file)
    const content = await readFile(filePath, 'utf8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) {
      manualTodos.push(`${file}: FM-1 — no frontmatter block; author one by hand (name, description, metadata.type)`)
      continue
    }

    const fm = parseFrontmatter(content)
    const expectedName = file.replace(/\.md$/, '')
    const fmBlock = fmMatch[1]
    const currentName = fm && typeof fm.name === 'string' ? fm.name : undefined

    if (currentName === expectedName) {
      // FM-2 already satisfied — nothing to do for the name field.
    } else if (currentName === undefined) {
      const newBlock = `name: ${expectedName}\n${fmBlock}`
      const newContent = content.replace(fmMatch[0], `---\n${newBlock}\n---`)
      console.log(`  ${paint(C.green, 'fix')}   ${file} — add name: ${expectedName}`)
      if (!dryRun) await writeFile(filePath, newContent)
      fmFixes++
    } else {
      const newBlock = fmBlock.replace(/^name:\s*.+$/m, `name: ${expectedName}`)
      const newContent = content.replace(fmMatch[0], `---\n${newBlock}\n---`)
      console.log(`  ${paint(C.green, 'fix')}   ${file} — name '${currentName}' → '${expectedName}'`)
      if (!dryRun) await writeFile(filePath, newContent)
      fmFixes++
    }

    // Surface the judgment-only frontmatter defects; never guessed here.
    if (!fm || typeof fm.description !== 'string' || fm.description.trim().length === 0) {
      manualTodos.push(`${file}: FM-3 — description missing/empty; write a specific one-line summary by hand`)
    }
    const metadata = fm && typeof fm.metadata === 'object' ? (fm.metadata as Record<string, string>) : undefined
    const type = metadata?.type
    if (!type || !VALID_TYPES.has(type)) {
      manualTodos.push(`${file}: FM-4 — metadata.type is '${type ?? '(missing)'}'; set one of ${[...VALID_TYPES].join(', ')} by hand`)
    }
  }
  if (fmFixes === 0) console.log(`  ${paint(C.dim, 'nothing to fix')}`)

  // ── b) IDX-3: append memory files missing from the index ──
  console.log(`\n${paint(C.cyan, `index entries (${indexFile})`)}`)
  if (!hasIndex) {
    manualTodos.push(`${indexFile}: IDX-1 — index file missing entirely; author it by hand`)
    console.log(`  ${paint(C.dim, 'no index file — see manual TODOs')}`)
  } else {
    const indexPath = join(memoryDir, indexFile)
    let indexContent = await readFile(indexPath, 'utf8')

    const indexedFiles = new Set<string>()
    for (const line of indexContent.split('\n')) {
      if (!INDEX_ENTRY_RE.test(line)) continue
      const linkMatch = line.match(INDEX_LINK_RE)
      if (linkMatch) indexedFiles.add(linkMatch[1])
    }

    let appended = 0
    const appendLines: string[] = []
    for (const file of memoryFiles) {
      if (indexedFiles.has(file)) continue
      const fm = parseFrontmatter(await readFile(join(memoryDir, file), 'utf8'))
      const title = fm && typeof fm.name === 'string' && fm.name.length > 0 ? fm.name : file.replace(/\.md$/, '')
      const hook =
        fm && typeof fm.description === 'string' && fm.description.trim().length > 0 ? fm.description.trim() : '(no description — see file)'
      appendLines.push(`- [${title}](${file}) — ${hook}`)
      manualTodos.push(`${indexFile}: move the appended entry for ${file} to its correct semantic position (DOC-6)`)
      console.log(`  ${paint(C.green, 'append')} ${file} — ${hook}`)
      appended++
    }
    if (appended === 0) {
      console.log(`  ${paint(C.dim, 'nothing to append')}`)
    } else if (!dryRun) {
      indexContent = `${indexContent.replace(/\n*$/, '\n')}${appendLines.join('\n')}\n`
      await writeFile(indexPath, indexContent)
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(
    `  - Everything else audit.ts flags (IDX-2 dangling entries, IDX-4/5/6, FM-5 duplicate names, DOC-1..6 content doctrine) is prose/judgment.`
  )
  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun skills/ki-housekeeping/scripts/audit.ts` (or `ki:housekeeping:audit`) to confirm findings clear.')}`
  )
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
