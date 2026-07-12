#!/usr/bin/env bun
/**
 * ki-bootstrap — BOOT-9: audit a target repo's vendored `.ki-meta/skills/` set
 * against what it *should* be.
 *
 * The mechanical `.ki-meta/bin/ki-audit` self-check runs standalone (no harness, no
 * skills installed) — but it has no way to re-derive the expected set, since the
 * `implies:` graph lives in the harness's SKILL.md frontmatter, not anywhere copied
 * into the target. So this check runs from the harness side, the same way
 * re-bootstrapping already does: it resolves the expected set the same way
 * `bootstrap.ts` does (baseline ∪ declared `[ki-*]` tables ∪ the transitive
 * `implies:` closure, restricted to skills that actually carry a checker) and diffs
 * it against the target's `.ki-meta/skills/*` directories. Any drift — stale config,
 * an upstream skill add/remove, a partial re-vendor — surfaces as a WARN rather than
 * silently going unnoticed; `bun skills/ki-bootstrap/scripts/bootstrap.ts <target>`
 * fixes it by re-vendoring.
 *
 * Usage: bun audit.ts [target-repo] [--json]   (read-only)
 *   --json   emit the shared CHK-004 finding wrapper instead of prose, so the
 *            aggregate renders BOOT-9 structured alongside every other checker.
 * Every repo — the harness included — vendors its own DECLARED coverage (the `.ki-config.toml`
 * `[ki-*]` tables + baseline + implies closure), so `ki:audit` fans out over exactly the
 * skills that govern it. Vendoring is always coverage-scoped; `--all` is a linking concept
 * only (the harness authoring hub links every skill), never a vendoring one (ADR-KI-HARNESS-007).
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { checkerScript, resolveSet } from './resolve.ts'

// Unified severity ladder — shared by every KI checker (enforcement-framework §2).
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
// area is the rubric code (references/audit-rubric.md); ref is its reference-doc
// pointer; file names the path a file-scoped finding concerns. ref/file are optional
// and ride into --json for the aggregate to render (CHK-004/009/010).
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
const ORDER: Level[] = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS']
const ICON: Record<Level, string> = { FAIL: '❌', WARN: '⚠️ ', POLISH: '✨', ADVISORY: '🧭', INFO: 'ℹ️ ', NA: '⊘ ', PASS: '✅' }
const findings: Finding[] = []
const add = (level: Level, area: string, msg: string, ref?: string, file?: string) => findings.push({ level, area, msg, ref, file })

const RUBRIC = 'references/audit-rubric.md'

const argv = process.argv.slice(2)
const target = resolve(argv.find((a) => !a.startsWith('--')) ?? '.')
const vendoredRoot = join(target, '.ki-meta', 'skills')

// ── report ────────────────────────────────────────────────────────────────────
// Shared emit harness — copy verbatim across KI checkers (enforcement-framework §2/§5).
function emit(items: Finding[], tgt: string, concern: string, title: string, footer: string): never {
  const a = process.argv.slice(2)
  const json = a.includes('--json')
  const ri = a.indexOf('--report')
  const report = ri !== -1
  const reportDir = report && a[ri + 1] && !a[ri + 1].startsWith('-') ? a[ri + 1] : join(tgt, '.ki-meta', 'audits')

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
    if (summary.warn > 0)
      console.log('→ to address: run /ki-bootstrap CONFORM   (re-vendor: bun skills/ki-bootstrap/scripts/bootstrap.ts <target>)')
    if (report) console.log(`report → ${join(reportDir, `${concern}.{md,json}`)}`)
    console.log('')
  }
  process.exit(summary.fail ? 1 : 0)
}

const emitBootstrap = (): never => emit(findings, target, 'bootstrap', `Bootstrap vendored-set audit  (${target})`, '')

if (!existsSync(vendoredRoot)) {
  add('NA', 'BOOT-9', 'no .ki-meta/skills/ — nothing to check (not yet bootstrapped)', RUBRIC, '.ki-meta/skills/')
  emitBootstrap()
}

// Only skills with a discoverable checker are ever vendored (vendorSkill() in
// bootstrap.ts is a no-op for skills without one), so restrict the expectation to those.
const expected = resolveSet(target, false, []).filter((s) => checkerScript(s) !== null)
const actual = readdirSync(vendoredRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

const missing = expected.filter((s) => !actual.includes(s))
const extra = actual.filter((s) => !expected.includes(s))

if (missing.length === 0 && extra.length === 0) {
  add(
    'PASS',
    'BOOT-9',
    `.ki-meta/skills/ matches the expected resolved set (${expected.length} skill${expected.length === 1 ? '' : 's'})`,
    RUBRIC,
    '.ki-meta/skills/'
  )
}

if (missing.length)
  add(
    'WARN',
    'BOOT-9',
    `missing from .ki-meta/skills/: ${missing.join(', ')} — re-run \`bun skills/ki-bootstrap/scripts/bootstrap.ts ${target}\``,
    RUBRIC,
    '.ki-meta/skills/'
  )
if (extra.length)
  add(
    'WARN',
    'BOOT-9',
    `vendored but no longer expected: ${extra.join(', ')} — a dropped table or upstream implies change; re-bootstrap to prune`,
    RUBRIC,
    '.ki-meta/skills/'
  )

// Drift here is always conformable by re-vendoring (WARN, never FAIL) — mirrors BOOT-1.
emitBootstrap()
