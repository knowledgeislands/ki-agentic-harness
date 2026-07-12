#!/usr/bin/env bun
/**
 * Mechanical auditor for the Knowledge Islands plans standard.
 *
 *   bun scripts/audit.ts <plans-dir>      (default: docs/plans)
 *
 * Plans are a code-repo instrument. In a KB (`repo_type = "kb"` in .ki-config.toml)
 * there is no docs/plans/ — planning is a stream proposal's Checklist (ki-kb-streams);
 * the checker reports that and exits 0.
 *
 * Mechanical half: frontmatter conformance, theme-subdir placement, README index
 * sync, and blocks/blocked-by dependency integrity (existence, reverse links, cycles).
 * Judgment half: roadmap-link near-horizon compliance, the quality bar, and the
 * zombie check are surfaced as ADVISORY — a reader must assess them.
 *
 * Output is grouped by severity; exit code is non-zero iff any FAIL.
 * No dependencies — Node/Bun builtins only; no cross-skill imports.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

// Unified severity ladder — shared by every KI checker (enforcement-framework §2).
// area is the criterion code; ref its reference-doc pointer; file the plan path a
// file-scoped finding concerns (cited-finding standard — matches ki-authoring).
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
const ORDER: Level[] = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS']
const ICON: Record<Level, string> = { FAIL: '❌', WARN: '⚠️ ', POLISH: '✨', ADVISORY: '🧭', INFO: 'ℹ️ ', NA: '⊘', PASS: '✅' }
const findings: Finding[] = []
const add = (level: Level, area: string, msg: string, ref?: string, file?: string) => findings.push({ level, area, msg, ref, file })

// Reference-doc pointers: the plan format (frontmatter, placement, index, deps) is
// owned by references/plan-format.md; the planning methodology (near-horizon, quality
// bar, zombie check) is prose in SKILL.md. ki-plans has no separate audit-rubric.md.
const FORMAT_REF = 'references/plan-format.md'
const METHOD_REF = 'SKILL.md'

// The uniform invocation passes the REPO ROOT (`.`); audit <repo>/docs/plans. Legacy:
// an arg that is itself the plans dir (basename "plans") is used directly.
const rawTarget = process.argv[2] ?? '.'
const underDocs = resolve(rawTarget, 'docs/plans')
const target = existsSync(underDocs) ? underDocs : resolve(rawTarget)
if (!existsSync(target)) {
  console.error(`usage: audit.ts [repo-or-plans-dir]   (path must exist; got ${rawTarget})`)
  process.exit(2)
}
// Applicability gate: a repo with no docs/plans/ (and whose arg isn't itself a plans dir)
// has no plans — emit a single NA and stop, rather than scanning the repo root (which
// would flag ROADMAP.md / CLAUDE.md as misplaced plan files).
if (!existsSync(underDocs) && basename(target) !== 'plans') {
  add('NA', 'scope', 'no docs/plans/ — repo has no plans (or planning is a stream proposal Checklist, governed by ki-kb-streams)')
  emit(findings, target, 'plans', `Plans audit — ${rawTarget}`, '')
}

// ── KB detection: walk up for .ki-config.toml, honour repo_type = "kb" ──────────
function findKiConfig(startDir: string): string | null {
  let dir = resolve(startDir)
  for (;;) {
    const candidate = join(dir, '.ki-config.toml')
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}
const kiConfig = findKiConfig(target)
if (kiConfig) {
  const cfg = readFileSync(kiConfig, 'utf8')
  if (/^\s*repo_type\s*=\s*["']kb["']/m.test(cfg)) {
    add(
      'INFO',
      'scope',
      'KB repo (repo_type = "kb") — planning is a stream proposal Checklist, governed by ki-kb-streams. No docs/plans/ audit.'
    )
    emit(findings, target, 'plans', `Plans audit — ${rawTarget}`, '')
  }
}

// ── discover plan files: docs/plans/<theme>/<NNN>-<slug>.md ─────────────────────
const FILENAME_RE = /^(\d{3,})-[a-z0-9-]+\.md$/
const REQUIRED_FIELDS = ['id', 'title', 'status', 'roadmap', 'blocks', 'blocked-by']
const VALID_STATUS = new Set(['open', 'in-progress', 'done'])

interface Plan {
  id: string
  file: string // display path relative to target, e.g. seo/004-json-ld.md
  theme: string
  fm: Record<string, string>
  blocks: string[]
  blockedBy: string[]
}

const entries = readdirSync(target, { withFileTypes: true })

// A stray .md directly under the plans dir (other than README.md) is misplaced.
for (const e of entries) {
  if (e.isFile() && e.name.endsWith('.md') && e.name !== 'README.md') {
    add('FAIL', 'PLACE', `plan files must live in a theme folder — docs/plans/<theme>/${e.name}, not the plans root`, FORMAT_REF, e.name)
  }
}

const idsFromValue = (v: string | undefined): string[] => (v && v.trim() !== '—' ? Array.from(v.matchAll(/\d{3,}/g)).map((m) => m[0]) : [])

const plans: Plan[] = []
const seenIds = new Map<string, string>() // id → first file that used it

for (const dir of entries.filter((e) => e.isDirectory())) {
  const theme = dir.name
  const themeDir = join(target, theme)
  for (const name of readdirSync(themeDir).sort()) {
    if (!name.endsWith('.md') || name === 'README.md') continue
    const rel = `${theme}/${name}`
    const fnMatch = FILENAME_RE.exec(name)
    if (!fnMatch) {
      add('FAIL', 'PLACE', 'filename must be <NNN>-<slug>.md (3+ digit id, lowercase-kebab slug)', FORMAT_REF, rel)
      continue
    }
    const fileId = fnMatch[1]
    const content = readFileSync(join(themeDir, name), 'utf8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) {
      add('FAIL', 'FM', 'missing YAML frontmatter', FORMAT_REF, rel)
      continue
    }
    const fm: Record<string, string> = {}
    for (const line of fmMatch[1].split('\n')) {
      const m = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
      if (m) fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '')
    }

    // FM-1: required fields present
    for (const f of REQUIRED_FIELDS) {
      if (!(f in fm)) add('FAIL', 'FM', `frontmatter missing '${f}'`, FORMAT_REF, rel)
    }
    // FM-4: no phase field
    if ('phase' in fm) add('FAIL', 'FM', "'phase' field is not allowed — phasing lives in ROADMAP.md", FORMAT_REF, rel)
    // FM-2: status vocabulary
    if (fm.status && !VALID_STATUS.has(fm.status)) {
      add('FAIL', 'FM', `status '${fm.status}' not one of open | in-progress | done`, FORMAT_REF, rel)
    }
    // FM-3: id format + filename agreement
    if (fm.id && !/^\d{3,}$/.test(fm.id)) add('FAIL', 'FM', `id '${fm.id}' must be a zero-padded 3+ digit string`, FORMAT_REF, rel)
    if (fm.id && fm.id !== fileId) add('FAIL', 'FM', `frontmatter id '${fm.id}' does not match filename id '${fileId}'`, FORMAT_REF, rel)
    // FM-5: global id uniqueness
    const id = fm.id || fileId
    if (seenIds.has(id)) add('FAIL', 'FM', `id ${id} already used by ${seenIds.get(id)} (ids are global across themes)`, FORMAT_REF, rel)
    else seenIds.set(id, rel)
    // roadmap link presence is FM-1 (required); its validity is judgment (ADVISORY below)
    if (fm.roadmap === '')
      add('WARN', 'ROADMAP', '\'roadmap\' is empty — every plan names the ROADMAP "Next" item it executes', FORMAT_REF, rel)

    plans.push({ id, file: rel, theme, fm, blocks: idsFromValue(fm.blocks), blockedBy: idsFromValue(fm['blocked-by']) })
  }
}

// ── README index sync ──────────────────────────────────────────────────────────
const readmePath = join(target, 'README.md')
const hasIndex = existsSync(readmePath)
if (!hasIndex) add('FAIL', 'IDX', 'not found in the plans directory', FORMAT_REF, 'README.md')
const readme = hasIndex ? readFileSync(readmePath, 'utf8') : ''

const indexedIds = new Set<string>()
for (const line of readme.split('\n')) {
  if (!/^\s*\|/.test(line)) continue
  if (/^\s*\|\s*-+\s*\|/.test(line)) continue // separator
  // A data row's first cell carries a plan id, linked `[NNN](theme/NNN-slug.md)` or bare.
  const idMatch = line.match(/\[(\d{3,})\]|\((?:[a-z0-9-]+\/)?(\d{3,})-/)
  if (idMatch) indexedIds.add(idMatch[1] || idMatch[2])
}

const planIds = new Set(plans.map((p) => p.id))
for (const p of plans) {
  if (hasIndex && !indexedIds.has(p.id)) add('FAIL', 'IDX', `no row in README.md for plan ${p.id}`, FORMAT_REF, p.file)
}
for (const indexedId of indexedIds) {
  if (!planIds.has(indexedId)) add('FAIL', 'IDX', `row for plan ${indexedId} has no matching plan file`, FORMAT_REF, 'README.md')
}

// ── dependency integrity: existence, reverse links, cycles ─────────────────────
const byId = new Map(plans.map((p) => [p.id, p]))
for (const p of plans) {
  for (const dep of [...p.blocks, ...p.blockedBy]) {
    if (!byId.has(dep)) add('FAIL', 'DEP', `references plan ${dep}, which does not exist`, FORMAT_REF, p.file)
  }
  // reverse-link consistency
  for (const b of p.blocks) {
    const other = byId.get(b)
    if (other && !other.blockedBy.includes(p.id)) add('WARN', 'DEP', `${p.file}: blocks ${b}, but ${b} does not list ${p.id} in blocked-by`)
  }
  for (const b of p.blockedBy) {
    const other = byId.get(b)
    if (other && !other.blocks.includes(p.id)) add('WARN', 'DEP', `${p.file}: blocked-by ${b}, but ${b} does not list ${p.id} in blocks`)
  }
}
// cycle detection over the blocked-by graph
const WHITE = 0
const GREY = 1
const BLACK = 2
const colour = new Map<string, number>(plans.map((p) => [p.id, WHITE]))
let cycleReported = false
const visit = (id: string, stack: string[]): void => {
  colour.set(id, GREY)
  for (const dep of byId.get(id)?.blockedBy ?? []) {
    if (!byId.has(dep)) continue
    if (colour.get(dep) === GREY && !cycleReported) {
      add('FAIL', 'DEP', `dependency cycle: ${[...stack, id, dep].join(' → ')}`)
      cycleReported = true
    } else if (colour.get(dep) === WHITE) visit(dep, [...stack, id])
  }
  colour.set(id, BLACK)
}
for (const p of plans) if (colour.get(p.id) === WHITE) visit(p.id, [])

// ── judgment surface (ADVISORY) ────────────────────────────────────────────────
if (plans.length) {
  add(
    'ADVISORY',
    'near-horizon',
    'roadmap [J]: each plan\'s `roadmap:` item should be a current ROADMAP "Next" entry — plans are for the near horizon only.',
    METHOD_REF
  )
  add('ADVISORY', 'quality', 'quality-bar [J]: Steps concrete, Verify checkable, Current state honest, Files touched minimal.', METHOD_REF)
  const wip = plans.filter((p) => p.fm.status === 'in-progress')
  if (wip.length)
    add(
      'ADVISORY',
      'zombie',
      `zombie [J]: ${wip.length} plan(s) in-progress — confirm each has recent commits; a stalled plan should be advanced or closed.`,
      METHOD_REF
    )
}

if (findings.every((f) => f.level === 'INFO' || f.level === 'NA')) {
  add('PASS', 'plans', `${plans.length} plan(s) across ${entries.filter((e) => e.isDirectory()).length} theme(s), ${rawTarget}`)
}

// ── report ─────────────────────────────────────────────────────────────────────
// Shared emit harness — copy verbatim across KI checkers (enforcement-framework §2/§5).
function emit(items: Finding[], tgt: string, concern: string, title: string, footer: string): never {
  const argv = process.argv.slice(2)
  const json = argv.includes('--json')
  const ri = argv.indexOf('--report')
  const report = ri !== -1
  const reportDir = report && argv[ri + 1] && !argv[ri + 1].startsWith('-') ? argv[ri + 1] : join(tgt, '.ki-meta', 'audits')

  const n = (l: Level): number => items.filter((f) => f.level === l).length
  const summary = {
    fail: n('FAIL'),
    warn: n('WARN'),
    polish: n('POLISH'),
    advisory: n('ADVISORY'),
    info: n('INFO'),
    na: n('NA'),
    pass: n('PASS')
  }
  const tally = `FAIL=${summary.fail} WARN=${summary.warn} POLISH=${summary.polish} PASS=${summary.pass} ADVISORY=${summary.advisory} NA=${summary.na}`
  const stamp = new Date().toISOString()

  if (report) {
    mkdirSync(reportDir, { recursive: true })
    const body = ORDER.flatMap((l) => {
      const rows = items.filter((f) => f.level === l)
      return rows.length
        ? [
            '',
            `## ${ICON[l]} ${l} (${rows.length})`,
            ...rows.map((r) => `- [${r.area}]${r.file ? ` ${r.file}` : ''} ${r.msg}${r.ref ? ` (${r.ref})` : ''}`)
          ]
        : []
    })
    writeFileSync(join(reportDir, `${concern}.md`), [`# ${concern} audit — ${tgt}`, '', `_${stamp}_`, '', tally, ...body, ''].join('\n'))
    writeFileSync(
      join(reportDir, `${concern}.json`),
      `${JSON.stringify({ concern, target: tgt, generatedAt: stamp, summary, findings: items }, null, 2)}\n`
    )
  }

  if (json) {
    process.stdout.write(`${JSON.stringify({ concern, target: tgt, generatedAt: stamp, summary, findings: items }, null, 2)}\n`)
  } else {
    console.log(`\n${title}\n${'─'.repeat(60)}`)
    for (const l of ORDER) {
      const rows = items.filter((f) => f.level === l)
      if (!rows.length) continue
      console.log(`\n${ICON[l]} ${l} (${rows.length})`)
      for (const r of rows) console.log(`   [${r.area}]${r.file ? ` ${r.file}` : ''} ${r.msg}${r.ref ? ` (${r.ref})` : ''}`)
    }
    console.log(`\n${'─'.repeat(60)}\n${tally}`)
    if (footer) console.log(footer)
    if (summary.fail + summary.warn + summary.polish > 0) console.log('→ to address: run /ki-plans CONFORM')
    if (report) console.log(`report → ${join(reportDir, `${concern}.{md,json}`)}`)
    console.log('')
  }
  process.exit(summary.fail ? 1 : 0)
}

emit(
  findings,
  target,
  'plans',
  `Plans audit — ${rawTarget}`,
  'Judgment criteria ([J]) are surfaced as ADVISORY — a reviewer must assess them by reading the plans and ROADMAP.'
)
