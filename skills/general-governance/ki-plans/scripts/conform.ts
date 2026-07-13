#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-plans standard — an honest normalize-only conform.
 * It fixes only the subset of audit.ts's findings that are unambiguous and
 * reversible, and prints everything that needs a human call as a manual TODO.
 * The plans standard is deliberately light on auto-fixable structure (most of what
 * audit.ts flags is authoring or dependency-graph judgment), so the automatic layer
 * is small by design and the TODO list carries the rest.
 *
 * Scope: a single target repo (default cwd), matching the house conform shape
 * (`bun scripts/conform.ts .` / `ki:plans:conform`). KB detection, the plans-dir
 * resolution, the filename regex, the required-field set, the status vocabulary,
 * and the index id-extraction regex are all kept in lockstep with audit.ts (copied
 * rather than imported so each script stays valid standalone, per the
 * composition-only rule).
 *
 *   bun scripts/conform.ts [path]   # default: cwd → docs/plans
 *   --dry-run                       # print the plan, mutate nothing
 *   --json                          # emit the shared finding wrapper instead of prose
 *
 * Fixes (unambiguous, reversible only):
 *   - Missing `id` frontmatter field: when the YAML block exists but has no `id`,
 *     fills it from the filename's <NNN> (the derivable, authoritative source).
 *   - Stray `phase` field: the standard forbids it (phasing lives in ROADMAP.md);
 *     the line is removed.
 *   - README index rows (IDX): a plan file on disk with no row in the index table
 *     gets one APPENDED after the last existing table row — the derivable
 *     `| [NNN](theme/NNN-slug.md) | theme | title | status | blocks |`. Existing
 *     rows and their order are never touched; a manual TODO is printed for each so
 *     the operator can move it to reading order and rebuild the dependency graph.
 *
 * Deliberately NEVER touches (judgment → manual TODOs):
 *   - A missing frontmatter block, or missing `title` / `status` / `roadmap`
 *     (authoring), an invalid `status` value, or an `id` that mismatches the
 *     filename (which to trust is a human call — rename the file or fix the field).
 *   - Placement errors (stray `.md` at the plans root, malformed filenames).
 *   - Dependency-graph edits — missing/dangling `blocks`/`blocked-by` references,
 *     absent reverse links, cycles, and the README dependency-graph block. Never
 *     guessed here even though CONFORM's prose mentions them.
 *   - A dangling index row (a row with no matching file) — deleting it could lose
 *     hand-written context; surfaced as a TODO.
 *   - Everything ADVISORY: near-horizon, the quality bar, the zombie check.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error (plans dir not found); findings/fixes never fail the run.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const FILENAME_RE = /^(\d{3,})-[a-z0-9-]+\.md$/
const REQUIRED_FIELDS = ['id', 'title', 'status', 'roadmap', 'blocks', 'blocked-by']
const VALID_STATUS = new Set(['open', 'in-progress', 'done'])
const PLANS_DIR = 'docs/plans'

// Reference-doc pointers — kept in lockstep with audit.ts (same criterion → same
// (area, ref)). Format criteria cite references/plan-format.md; the planning
// methodology (the judgment layer) is prose in SKILL.md.
const FORMAT_REF = 'references/plan-format.md'
const METHOD_REF = 'SKILL.md'

// Collect-then-emit harness mirroring audit.ts. Each action records a finding on the
// shared ladder; `say` prints the human line only outside --json, so a direct run
// streams prose while the aggregate consumes the wrapper. Action → level:
// written/scaffolded/overwritten/fixed → POLISH, already-canonical/no-op → PASS,
// still-failing → FAIL, judgment/manual-TODO → ADVISORY.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
const findings: Finding[] = []
const rec = (level: Level, area: string, msg: string, ref?: string, file?: string): void => {
  findings.push({ level, area, msg, ref, file })
}
const jsonMode = process.argv.includes('--json')
const say = (line: string): void => {
  if (!jsonMode) console.log(line)
}
// Lowercased ladder-keyed summary + wrapper — the shape the aggregate consumes (matches audit.ts).
function emitJson(target: string): void {
  if (!jsonMode) return
  const n = (l: Level): number => findings.filter((f) => f.level === l).length
  const summary = {
    fail: n('FAIL'),
    warn: n('WARN'),
    polish: n('POLISH'),
    advisory: n('ADVISORY'),
    info: n('INFO'),
    na: n('NA'),
    pass: n('PASS')
  }
  process.stdout.write(JSON.stringify({ concern: 'plans', target, generatedAt: new Date().toISOString(), summary, findings }))
}

async function findKiConfig(startDir: string): Promise<string | null> {
  let dir = resolve(startDir)
  for (let i = 0; i < 20; i++) {
    const candidate = join(dir, '.ki-config.toml')
    try {
      await stat(candidate)
      return candidate
    } catch {
      const parent = dirname(dir)
      if (parent === dir) return null
      dir = parent
    }
  }
  return null
}

async function detectKbMode(baseDir: string): Promise<boolean> {
  const configPath = await findKiConfig(baseDir)
  if (!configPath) return false
  const content = await readFile(configPath, 'utf8')
  return /^\s*repo_type\s*=\s*["']kb["']/m.test(content)
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

// Resolve the plans dir: a repo root (has docs/plans) or the plans dir itself.
async function resolvePlansDir(target: string): Promise<string> {
  const nested = join(target, PLANS_DIR)
  if (await exists(nested)) return nested
  return target
}

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

interface PlanRow {
  id: string
  theme: string
  file: string // e.g. seo/004-json-ld.md
  title: string
  status: string
  blocks: string
}

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (await detectKbMode(target)) {
    rec(
      'PASS',
      'scope',
      'KB repo (repo_type = "kb") — planning is a stream proposal Checklist (ki-kb-streams); no docs/plans/ to conform',
      METHOD_REF
    )
    say(paint(C.cyan, 'KB repo (repo_type = "kb")'))
    say(`  ${paint(C.dim, 'planning is a stream proposal Checklist (ki-kb-streams) — no docs/plans/ to conform.')}`)
    emitJson(target)
    process.exit(0)
    return
  }

  const plansDir = await resolvePlansDir(target)
  if (!(await exists(plansDir))) {
    console.error(paint(C.red, `plans directory not found: ${plansDir}`))
    process.exit(1)
    return
  }

  say(paint(C.dim, `target: ${plansDir}${dryRun ? '   (dry run)' : ''}\n`))

  // A manual TODO both prints for a human and records an ADVISORY finding (judgment,
  // not scripted) — file-scoped where it names a path (mirrors audit.ts's file/ref).
  const manualTodos: string[] = []
  const todo = (area: string, msg: string, ref: string, file?: string): void => {
    manualTodos.push(file ? `${file}: ${msg}` : msg)
    rec('ADVISORY', area, msg, ref, file)
  }
  const dirEntries = await readdir(plansDir, { withFileTypes: true })

  // Stray .md directly under the plans root (other than README.md) — placement judgment.
  for (const e of dirEntries) {
    if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md') {
      todo('PLACE', 'plan files must live in a theme folder (docs/plans/<theme>/) — move it by hand', FORMAT_REF, e.name)
    }
  }

  // ── a) per-file frontmatter normalisation ──
  say(paint(C.cyan, 'frontmatter'))
  let fmFixes = 0
  const plans: PlanRow[] = []

  for (const dir of dirEntries.filter((e) => e.isDirectory())) {
    const theme = dir.name
    const themeDir = join(plansDir, theme)
    const names = (await readdir(themeDir)).sort()
    for (const name of names) {
      if (!name.endsWith('.md') || name === 'README.md') continue
      const rel = `${theme}/${name}`
      const fnMatch = FILENAME_RE.exec(name)
      if (!fnMatch) {
        todo('PLACE', 'filename must be <NNN>-<slug>.md — rename by hand', FORMAT_REF, rel)
        continue
      }
      const fileId = fnMatch[1] as string
      const filePath = join(themeDir, name)
      let content = await readFile(filePath, 'utf8')

      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!fmMatch) {
        todo('FM', 'no frontmatter block — author one by hand (id, title, status, roadmap, blocks, blocked-by)', FORMAT_REF, rel)
        continue
      }

      let fmText = fmMatch[1] as string
      let changed = false

      // Parse fields (same shape as audit.ts).
      const fm: Record<string, string> = {}
      for (const line of fmText.split('\n')) {
        const m = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
        if (m) fm[m[1] as string] = (m[2] as string).trim().replace(/^['"]|['"]$/g, '')
      }

      // Fix: remove a forbidden `phase` field.
      if ('phase' in fm) {
        fmText = fmText
          .split('\n')
          .filter((l) => !/^phase:\s*/.test(l))
          .join('\n')
        rec('POLISH', 'FM', "removed forbidden 'phase' field", FORMAT_REF, rel)
        say(`  ${paint(C.green, 'fix')}   ${rel} — remove forbidden 'phase' field`)
        changed = true
      }

      // Fix: fill a missing `id` from the filename (derivable, authoritative).
      if (!('id' in fm)) {
        fmText = `id: '${fileId}'\n${fmText}`
        rec('POLISH', 'FM', `added id: '${fileId}' (from filename)`, FORMAT_REF, rel)
        say(`  ${paint(C.green, 'fix')}   ${rel} — add id: '${fileId}' (from filename)`)
        fm.id = fileId
        changed = true
      }

      // Remaining frontmatter issues → manual TODOs (never guessed).
      for (const f of REQUIRED_FIELDS) {
        if (!(f in fm)) todo('FM', `frontmatter missing '${f}' — fill it by hand`, FORMAT_REF, rel)
      }
      if (fm.id && /^\d{3,}$/.test(fm.id) && fm.id !== fileId) {
        todo('FM', `frontmatter id '${fm.id}' ≠ filename id '${fileId}' — rename file or fix field (human call)`, FORMAT_REF, rel)
      }
      if (fm.status && !VALID_STATUS.has(fm.status)) {
        todo('FM', `status '${fm.status}' not one of open | in-progress | done — correct by hand`, FORMAT_REF, rel)
      }

      if (changed) {
        content = content.replace(fmMatch[0], `---\n${fmText}\n---`)
        if (!dryRun) await writeFile(filePath, content)
        fmFixes++
      }

      const id = fm.id && /^\d{3,}$/.test(fm.id) ? fm.id : fileId
      const title = fm.title ?? '(title unknown — see file)'
      const status = fm.status ?? 'open'
      const blocks = fm.blocks && fm.blocks !== '' ? fm.blocks : '—'
      plans.push({ id, theme, file: rel, title, status, blocks })
    }
  }
  if (fmFixes === 0) {
    rec('PASS', 'FM', 'frontmatter already conforms — nothing to fix', FORMAT_REF)
    say(`  ${paint(C.dim, 'nothing to fix')}`)
  }

  // ── b) append missing README index rows ──
  say(`\n${paint(C.cyan, 'index rows (README.md)')}`)
  const readmePath = join(plansDir, 'README.md')
  if (!(await exists(readmePath))) {
    todo('IDX', 'index missing entirely — author it by hand (table + dependency graph)', FORMAT_REF, 'README.md')
    say(`  ${paint(C.dim, 'no README.md — see manual TODOs')}`)
  } else {
    let readme = await readFile(readmePath, 'utf8')
    const lines = readme.split('\n')

    // Indexed ids (same extraction as audit.ts).
    const indexedIds = new Set<string>()
    for (const line of lines) {
      if (!/^\s*\|/.test(line)) continue
      if (/^\s*\|\s*-+\s*\|/.test(line)) continue
      const idMatch = line.match(/\[(\d{3,})\]|\((?:[a-z0-9-]+\/)?(\d{3,})-/)
      if (idMatch) indexedIds.add((idMatch[1] || idMatch[2]) as string)
    }

    // Dangling rows (row with no file) → judgment TODO, never deleted.
    const planIds = new Set(plans.map((p) => p.id))
    for (const indexedId of indexedIds) {
      if (!planIds.has(indexedId)) {
        todo('IDX', `row for plan ${indexedId} has no matching file — remove or restore the file by hand`, FORMAT_REF, 'README.md')
      }
    }

    const missing = plans.filter((p) => !indexedIds.has(p.id))
    if (missing.length === 0) {
      rec('PASS', 'IDX', 'index already lists every plan — nothing to append', FORMAT_REF)
      say(`  ${paint(C.dim, 'nothing to append')}`)
    } else {
      // Find the last table data row to append after.
      let lastRow = -1
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*\|/.test(lines[i] as string)) lastRow = i
      }
      if (lastRow === -1) {
        todo('IDX', 'no index table found — add the rows by hand', FORMAT_REF, 'README.md')
        say(`  ${paint(C.dim, 'no table found — see manual TODOs')}`)
      } else {
        const newRows: string[] = []
        for (const p of missing) {
          const row = `| [${p.id}](${p.file}) | ${p.theme} | ${p.title} | ${p.status} | ${p.blocks} |`
          newRows.push(row)
          rec(
            'POLISH',
            'IDX',
            `appended index row for plan ${p.id} (${p.title})${dryRun ? ' — dry-run, not written' : ''}`,
            FORMAT_REF,
            'README.md'
          )
          todo('IDX', `move the appended row for plan ${p.id} into reading order and rebuild the dependency graph`, FORMAT_REF, 'README.md')
          say(`  ${paint(C.green, 'append')} ${p.id} — ${p.title}`)
        }
        lines.splice(lastRow + 1, 0, ...newRows)
        readme = lines.join('\n')
        if (!dryRun) await writeFile(readmePath, readme)
      }
    }
  }

  // ── judgment items — never guessed, always surfaced ──
  say(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    say(`  ${paint(C.dim, 'none')}`)
  } else {
    for (const line of manualTodos) say(`  - ${line}`)
  }
  rec(
    'ADVISORY',
    'DEP',
    'dependency integrity (missing/dangling refs, reverse links, cycles) and the README dependency graph are dependency-graph edits — resolve by hand',
    FORMAT_REF
  )
  rec('ADVISORY', 'judgment', 'near-horizon, the quality bar, and the zombie check are read-and-assess, never scripted', METHOD_REF)
  say(
    `  - Dependency integrity (missing/dangling refs, reverse links, cycles) and the README dependency graph are dependency-graph edits — resolve by hand.`
  )
  say(`  - ADVISORY checks (near-horizon, the quality bar, the zombie check) are read-and-assess, never scripted.`)
  say(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts docs/plans` (or `ki:plans:audit`) to confirm findings clear.')}`
  )
  emitJson(target)
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
