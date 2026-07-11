#!/usr/bin/env bun
// Vendored by ki-bootstrap. Runs each vendored skill checker under ../skills/ in
// sequence for the given verb — no package.json required.
// Usage: bun .ki-meta/bin/aggregate.ts <audit|conform|init|help>
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('usage: aggregate.ts <audit|conform|init|help>')
  process.exit(2)
}
const binDir = dirname(fileURLToPath(import.meta.url))
if (verb === 'init' || verb === 'help') {
  // init: the local re-sync prompt (re-run the remote chain at the manifest's ref).
  // help: the vendored HELP snapshots. Both exec the sibling wrapper.
  execFileSync(join(binDir, verb === 'init' ? 'ki-init' : 'ki-help'), process.argv.slice(3), { stdio: 'inherit' })
  process.exit(0)
}
// Vendored copies are named by verb (audit.ts / conform.ts) — the skill dir already
// carries the identity.
const pattern = verb === 'audit' ? /^(audit|lint)\.ts$/ : verb === 'conform' ? /^conform\.ts$/ : null
if (!pattern) process.exit(0)
const skillsDir = join(binDir, '..', 'skills')
if (!existsSync(skillsDir)) process.exit(0)
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

// Unified severity ladder — most audit-*.ts/lint-*.ts checkers normalize findings to
// { level, area, msg } and, under --json, wrap them as
// { concern, target, generatedAt, summary, findings }. A couple of outliers (e.g.
// ki-housekeeping) emit a bare findings array with { id, severity: <0-6>, message }
// instead — SEV_BY_NUM and the field fallbacks below absorb that variant too.
const ICON: Record<string, string> = { FAIL: '❌', WARN: '⚠️ ', POLISH: '✨', ADVISORY: '🧭', INFO: 'ℹ️ ', NA: '⊘', PASS: '✅' }
const SEV_BY_NUM = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS']
const RECAP_LEVELS = ['FAIL', 'WARN', 'ADVISORY']
let failed = 0
const recap: { skill: string; level: string; code: string; msg: string }[] = []
const unstructured: string[] = []
for (const skill of skills) {
  const dir = join(skillsDir, skill)
  const script = readdirSync(dir).find((f) => pattern.test(f))
  if (!script) continue
  const key = 'ki:' + skill.replace(/^ki-/, '') + ':' + verb
  console.log('\n\x1b[36m==> ' + key + '\x1b[0m')
  const scriptPath = join(dir, script)
  if (verb !== 'audit') {
    const res = spawnSync('bun', [scriptPath, '.'], { stdio: 'inherit' })
    if ((res.status ?? 0) !== 0) failed++
    continue
  }
  const res = spawnSync('bun', [scriptPath, '.', '--json'], { encoding: 'utf8' })
  let parsed: unknown = null
  try {
    parsed = JSON.parse(res.stdout ?? '')
  } catch {
    parsed = null
  }
  const findingsArr = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { findings?: unknown })?.findings)
      ? (parsed as { findings: unknown[] }).findings
      : null
  if (!findingsArr) {
    // no --json support (or a crash, or a shape we don't recognise) — fall back to
    // this checker's native display.
    process.stdout.write(res.stdout ?? '')
    process.stderr.write(res.stderr ?? '')
    unstructured.push(skill)
  } else {
    const counts: Record<string, number> = {}
    for (const item of findingsArr) {
      const raw = item as Record<string, unknown>
      const level =
        typeof raw.level === 'string'
          ? raw.level.toUpperCase()
          : typeof raw.severity === 'number'
            ? SEV_BY_NUM[raw.severity] ?? 'INFO'
            : typeof raw.severity === 'string'
              ? raw.severity.toUpperCase()
              : 'INFO'
      const area = String(raw.area ?? raw.criterion ?? raw.check ?? raw.id ?? '?')
      const msg = String(raw.msg ?? raw.message ?? '')
      const icon = ICON[level] ?? ''
      console.log('  ' + icon + ' ' + level.toLowerCase() + ' \x1b[2m[' + area + ']\x1b[0m ' + msg)
      counts[level] = (counts[level] ?? 0) + 1
      if (RECAP_LEVELS.includes(level)) recap.push({ skill, level, code: area, msg })
    }
    const wrapperSummary = !Array.isArray(parsed) ? (parsed as { summary?: Record<string, number> })?.summary : null
    const s = wrapperSummary ?? {
      fail: counts.FAIL ?? 0,
      warn: counts.WARN ?? 0,
      advisory: counts.ADVISORY ?? 0,
      polish: counts.POLISH ?? 0,
      pass: counts.PASS ?? 0
    }
    console.log(
      '  \x1b[2msummary: FAIL=' +
        (s.fail ?? 0) +
        ' WARN=' +
        (s.warn ?? 0) +
        ' ADVISORY=' +
        (s.advisory ?? 0) +
        ' POLISH=' +
        (s.polish ?? 0) +
        ' PASS=' +
        (s.pass ?? 0) +
        '\x1b[0m'
    )
  }
  if ((res.status ?? 0) !== 0) failed++
}
if (verb === 'audit') {
  console.log('\n\x1b[36m==> recap\x1b[0m')
  if (recap.length === 0) {
    console.log('  \x1b[32mno FAIL / WARN / ADVISORY hits across audited skills\x1b[0m')
  } else {
    for (const level of RECAP_LEVELS) {
      for (const h of recap.filter((r) => r.level === level)) {
        console.log('  ' + ICON[level] + ' ' + level.padEnd(8) + ' ' + h.skill.padEnd(24) + ' [' + h.code + '] ' + h.msg.split('\n')[0])
      }
    }
    const count = (l: string) => recap.filter((r) => r.level === l).length
    console.log('  \x1b[2mtotals: FAIL=' + count('FAIL') + ' WARN=' + count('WARN') + ' ADVISORY=' + count('ADVISORY') + '\x1b[0m')
  }
  if (unstructured.length) {
    console.log('  \x1b[2m(no structured output — see native output above for: ' + unstructured.join(', ') + ')\x1b[0m')
  }
}
process.exit(failed > 0 ? 1 : 0)
