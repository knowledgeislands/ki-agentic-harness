#!/usr/bin/env bun
/**
 * Mechanical auditor for the COMMON engineering layer of a Knowledge Islands
 * TypeScript/Bun repo.
 *
 *   bun scripts/audit-engineering.ts <repo-path>      # or: node after a build
 *
 * Checks the shared toolchain the `knowledgeislands-engineering` skill codifies —
 * package.json metadata, the mise.toml toolchain pin (node + bun, bun matched to
 * packageManager, CI via mise-action) + the lint:* / deps:* script families, the
 * `bun test` trap, tsconfig.json + biome.json, and the capability conditionals
 * (tests, compiled build + the cli-chmod rule, env) that fire only when the repo opts in.
 * It is deliberately PERMISSIVE about additive repo-specific scripts, and it does
 * NOT judge anything artifact-specific (an MCP's coverage-excludes, bin, tool
 * surface) — that is the artifact skill's checker (e.g. audit-mcp.ts), run after
 * this one. See references/audit-rubric.md for the judgment half.
 *
 * Output is grouped pass/warn/fail; exit code is non-zero iff any FAIL.
 * No dependencies — Node/Bun builtins only; no cross-skill imports.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

// Unified severity ladder — shared by every KI checker (enforcement-framework §2).
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'SKIP' | 'PASS'
type Finding = { level: Level; area: string; msg: string }
const ORDER: Level[] = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'SKIP', 'PASS']
const ICON: Record<Level, string> = { FAIL: '❌', WARN: '⚠️ ', POLISH: '✨', ADVISORY: '🧭', INFO: 'ℹ️ ', SKIP: '⊘', PASS: '✅' }
const findings: Finding[] = []
const add = (level: Level, area: string, msg: string) => findings.push({ level, area, msg })

const repo = process.argv[2]
if (!repo || !existsSync(repo)) {
  console.error('usage: audit-engineering.ts <repo-path>   (path must exist)')
  process.exit(2)
}
const at = (...p: string[]) => join(repo, ...p)
const has = (...p: string[]) => existsSync(at(...p))
const isDir = (...p: string[]) => has(...p) && statSync(at(...p)).isDirectory()
const read = (...p: string[]): string => {
  try {
    return readFileSync(at(...p), 'utf8')
  } catch {
    return ''
  }
}

let pkg: Record<string, unknown> = {}
try {
  pkg = JSON.parse(read('package.json'))
} catch {
  add('FAIL', 'package', 'package.json missing or unparseable')
}
const scripts = (pkg.scripts ?? {}) as Record<string, string>
const name = String(pkg.name ?? basename(repo))

// ── core: package.json metadata ───────────────────────────────────────────────
pkg.type === 'module' ? add('PASS', 'package', 'type = "module"') : add('FAIL', 'package', `type should be "module", got ${JSON.stringify(pkg.type)}`)
String(pkg.packageManager ?? '').startsWith('bun@')
  ? add('PASS', 'package', `packageManager = ${pkg.packageManager}`)
  : add('FAIL', 'package', `packageManager should be bun@…, got ${JSON.stringify(pkg.packageManager)}`)
const nodeEngine = String((pkg.engines as Record<string, string> | undefined)?.node ?? '')
const nodeOk = (() => {
  const m = nodeEngine.match(/>=\s*(\d+)/)
  return m ? Number(m[1]) >= 22 : false
})()
add(nodeOk ? 'PASS' : 'FAIL', 'package', nodeOk ? `engines.node = ${nodeEngine}` : `engines.node should be >=22, got ${JSON.stringify(nodeEngine)}`)

// ── core: mise.toml toolchain pin ─────────────────────────────────────────────
// Root mise.toml pins the actual node + bun (mise puts them on PATH on `cd`; CI
// installs them via jdx/mise-action). The pinned bun MUST equal packageManager's
// bun — the standing drift pair. node is pinned exactly here (engines is a floor).
const mise = read('mise.toml')
if (!mise) add('FAIL', 'mise', 'mise.toml missing (root toolchain pin: [tools] node + bun)')
else {
  const miseNode = mise.match(/^\s*node\s*=\s*["']([^"']+)["']/m)?.[1]
  const miseBun = mise.match(/^\s*bun\s*=\s*["']([^"']+)["']/m)?.[1]
  miseNode ? add('PASS', 'mise', `mise.toml pins node = ${miseNode}`) : add('FAIL', 'mise', 'mise.toml must pin node under [tools]')
  if (!miseBun) add('FAIL', 'mise', 'mise.toml must pin bun under [tools]')
  else {
    const pmBun = String(pkg.packageManager ?? '').match(/^bun@(.+)$/)?.[1]
    pmBun && pmBun !== miseBun
      ? add('FAIL', 'mise', `mise.toml bun (${miseBun}) must match packageManager bun (${pmBun})`)
      : add('PASS', 'mise', `mise.toml pins bun = ${miseBun}${pmBun ? ' (matches packageManager)' : ''}`)
  }
}
// legacy single-tool pin files shadow mise.toml — warn (redundant, can diverge)
const strayPins = ['.node-version', '.nvmrc', '.bun-version'].filter((f) => has(f))
strayPins.length
  ? add('WARN', 'mise', `legacy pin file(s) beside mise.toml: ${strayPins.join(', ')} — remove; mise.toml is the single toolchain pin`)
  : add('PASS', 'mise', 'no legacy pin files (.node-version / .nvmrc / .bun-version)')

// ── core (when the repo has CI): the common CI shape ──────────────────────────
// CI installs the toolchain from mise.toml and runs the common gate steps on every
// push/PR. The Markdown gate (lint:md:check) is load-bearing: without it, prose-wrap
// drift lands on main undetected (lint:md self-heals with --write locally). The
// test:smoke step is the MCP delta — asserted by audit-mcp.ts, not here.
if (has('.github', 'workflows', 'ci.yml')) {
  const ci = read('.github', 'workflows', 'ci.yml')
  const usesMise = /mise-action/.test(ci)
  usesMise ? add('PASS', 'ci', 'ci.yml installs the toolchain via jdx/mise-action') : add('FAIL', 'ci', 'ci.yml must install the toolchain via jdx/mise-action (reads mise.toml)')
  const hard = ci.match(/\b(bun|node)-version\s*:/)
  if (hard) add('FAIL', 'ci', `ci.yml hardcodes ${hard[1]}-version — remove it; the version comes from mise.toml`)
  const runsStep = (s: string) => ci.includes(`bun run ${s}`)
  for (const step of ['lint:check', 'lint:types', 'lint:md:check']) {
    runsStep(step) ? add('PASS', 'ci', `ci.yml runs ${step}`) : add('FAIL', 'ci', `ci.yml must run "bun run ${step}" — the common CI shape (lint:md:check is the Markdown gate)`)
  }
  if (scripts['test:coverage']) runsStep('test:coverage') ? add('PASS', 'ci', 'ci.yml runs test:coverage') : add('WARN', 'ci', 'ci.yml should run "bun run test:coverage" (tests capability)')
} else {
  add('SKIP', 'ci', 'no .github/workflows/ci.yml — not applicable')
}

// ── core: the required script families (exact-match) ──────────────────────────
const CANON: Record<string, string> = {
  'lint:check': 'bunx @biomejs/biome check',
  'lint:fix': 'bunx @biomejs/biome check --write --unsafe',
  'lint:format': 'bunx @biomejs/biome format --write',
  'lint:md': 'bunx prettier --write "**/*.md" --ignore-path .gitignore && bunx markdownlint-cli2',
  'lint:md:check': 'bunx prettier --check "**/*.md" --ignore-path .gitignore && bunx markdownlint-cli2',
  'lint:package': 'bunx syncpack format',
  'lint:types': 'tsc --noEmit',
  'deps:missing': "bunx depcheck --json | bunx node-jq --sort-keys '.' | bunx node-jq '.missing | keys | .[]' | xargs bun add -D",
  'deps:unused': "bunx depcheck --json | bunx node-jq --sort-keys '.' | bunx node-jq '.devDependencies[]' | xargs bun remove",
  'deps:update': 'bun update --latest'
}
for (const [k, v] of Object.entries(CANON)) {
  if (!scripts[k]) add('FAIL', 'scripts', `script "${k}" missing (required ${k.split(':')[0]}:* family)`)
  else if (scripts[k] === v) add('PASS', 'scripts', `${k} matches canonical`)
  else add('FAIL', 'scripts', `${k} diverges from canonical\n        want: ${v}\n        got:  ${scripts[k]}`)
}
// clean (removes node_modules; may also remove dist) + prepare = husky
scripts.clean?.includes('node_modules')
  ? add('PASS', 'scripts', `clean = ${JSON.stringify(scripts.clean)}`)
  : add('FAIL', 'scripts', 'clean must remove node_modules (e.g. "rm -rf {dist,node_modules}")')
scripts.prepare === 'husky' ? add('PASS', 'scripts', 'prepare = "husky"') : add('WARN', 'scripts', `prepare should be "husky", got ${JSON.stringify(scripts.prepare)}`)

// ── core: the `bun test` trap ─────────────────────────────────────────────────
const bunTest = Object.entries(scripts).filter(([, v]) => /\bbun test\b/.test(v))
bunTest.length ? add('FAIL', 'scripts', `uses "bun test" (Bun's runner, not vitest) in: ${bunTest.map(([k]) => k).join(', ')}`) : add('PASS', 'scripts', 'no "bun test" anywhere')

// ── core: tsconfig.json (universal invariants only; richer base is profiled) ──
// tsconfig may carry // comments (the website's does), so check by regex on text,
// not JSON.parse. Only the invariants ALL repos share are core; the fuller shared
// base (es2024, verbatimModuleSyntax, the noImplicit* family, vitest/globals types)
// is checked under the compiled-build capability below.
const ts = read('tsconfig.json')
if (!ts) add('FAIL', 'tsconfig', 'tsconfig.json missing')
else {
  const tsCore: [string, RegExp][] = [
    ['strict: true', /"strict"\s*:\s*true/],
    ['module: nodenext', /"module"\s*:\s*"nodenext"/i],
    ['moduleResolution: nodenext', /"moduleResolution"\s*:\s*"nodenext"/i],
    ['noEmit: true', /"noEmit"\s*:\s*true/],
    ['isolatedModules: true', /"isolatedModules"\s*:\s*true/],
    ['esModuleInterop: true', /"esModuleInterop"\s*:\s*true/],
    ['skipLibCheck: true', /"skipLibCheck"\s*:\s*true/]
  ]
  for (const [label, re] of tsCore) re.test(ts) ? add('PASS', 'tsconfig', label) : add('FAIL', 'tsconfig', `tsconfig.json missing universal invariant: ${label}`)
}

// ── core: biome.json (shared FIELDS, not byte-identical — files globs vary) ───
const biome = read('biome.json')
if (!biome) add('FAIL', 'biome', 'biome.json missing')
else {
  const fields: [string, RegExp][] = [
    ['formatter lineWidth 200', /"lineWidth"\s*:\s*200/],
    ['formatter indentWidth 2', /"indentWidth"\s*:\s*2/],
    ['js quoteStyle single', /"quoteStyle"\s*:\s*"single"/],
    ['js semicolons asNeeded', /"semicolons"\s*:\s*"asNeeded"/],
    ['js trailingCommas none', /"trailingCommas"\s*:\s*"none"/],
    ['linter preset recommended', /"recommended"|"preset"\s*:\s*"recommended"/],
    ['noExplicitAny off', /"noExplicitAny"\s*:\s*"off"/],
    ['organizeImports on', /"organizeImports"\s*:\s*"on"/]
  ]
  for (const [label, re] of fields) re.test(biome) ? add('PASS', 'biome', label) : add('WARN', 'biome', `biome.json: expected ${label}`)
}

// ── core: .prettierrc.json (backs lint:md — Markdown only) ────────────────────
const prettier = read('.prettierrc.json')
if (!prettier) add('FAIL', 'prettier', '.prettierrc.json missing (Prettier backs lint:md)')
else {
  const pfields: [string, RegExp][] = [
    ['proseWrap always', /"proseWrap"\s*:\s*"always"/],
    ['printWidth 140', /"printWidth"\s*:\s*140/],
    ['semi false', /"semi"\s*:\s*false/],
    ['singleQuote true', /"singleQuote"\s*:\s*true/],
    ['trailingComma none', /"trailingComma"\s*:\s*"none"/],
    ['*.md markdown override', /"parser"\s*:\s*"markdown"/]
  ]
  for (const [label, re] of pfields) re.test(prettier) ? add('PASS', 'prettier', label) : add('WARN', 'prettier', `.prettierrc.json: expected ${label}`)
}

// ── capability detection ──────────────────────────────────────────────────────
const vitestFile = ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mts'].find((f) => has(f))
const hasTests = Boolean(vitestFile) || Boolean(scripts.test)
const buildScript = scripts.build ?? ''
const hasBuild = has('tsconfig.build.json') || /\btsc\b/.test(buildScript)
const hasCli = isDir('src', 'cli')
const envExample = ['.env.example', '.env.development.example'].find((f) => has(f))
const usesLoadEnv = (() => {
  const cfg = read('src', 'config', 'index.ts')
  return cfg.includes('process.loadEnvFile')
})()
const hasEnv = Boolean(envExample) || usesLoadEnv

// ── capability: tests ─────────────────────────────────────────────────────────
if (hasTests) {
  const wantTest: Record<string, string> = { test: 'vitest run', 'test:coverage': 'vitest run --coverage', 'test:watch': 'vitest' }
  for (const [k, v] of Object.entries(wantTest)) {
    if (!scripts[k]) add('WARN', 'tests', `test capability: script "${k}" missing (expected ${JSON.stringify(v)})`)
    else scripts[k] === v ? add('PASS', 'tests', `${k} = ${JSON.stringify(v)}`) : add('FAIL', 'tests', `${k} should be ${JSON.stringify(v)}, got ${JSON.stringify(scripts[k])}`)
  }
  if (vitestFile) {
    const vc = read(vitestFile)
    const covOk = /lines:\s*100/.test(vc) && /branches:\s*100/.test(vc) && /functions:\s*100/.test(vc) && /statements:\s*100/.test(vc)
    add(covOk ? 'PASS' : 'FAIL', 'tests', covOk ? 'coverage thresholds 100% on all four metrics' : 'coverage thresholds must be 100/100/100/100 (lines/functions/branches/statements)')
    const excludesTest = /exclude\s*:/.test(vc) && /\*\*\/\*\.test\.ts/.test(vc)
    add(excludesTest ? 'PASS' : 'WARN', 'tests', excludesTest ? 'coverage excludes src/**/*.test.ts' : 'coverage should exclude src/**/*.test.ts (other excludes are artifact-specific)')
  } else {
    add('WARN', 'tests', 'a test script is present but no vitest.config.* — confirm the runner is vitest')
  }
} else {
  add('SKIP', 'tests', 'no test capability (no vitest.config / test script) — not applicable')
}

// ── capability: compiled build + the cli-chmod rule ───────────────────────────
if (hasBuild) {
  buildScript.startsWith('tsc -p tsconfig.build.json')
    ? add('PASS', 'build', 'build = tsc -p tsconfig.build.json')
    : add('FAIL', 'build', `build should start with "tsc -p tsconfig.build.json", got ${JSON.stringify(buildScript)}`)
  Array.isArray(pkg.files) && (pkg.files as string[]).includes('dist') ? add('PASS', 'build', 'files includes "dist"') : add('FAIL', 'build', 'files should include "dist"')
  // tsconfig.build.json shape
  const tb = read('tsconfig.build.json')
  if (!tb) add('FAIL', 'build', 'compiled build but tsconfig.build.json missing')
  else {
    const tbChecks: [string, RegExp][] = [
      ['extends ./tsconfig.json', /"extends"\s*:\s*"\.\/tsconfig\.json"/],
      ['noEmit: false', /"noEmit"\s*:\s*false/],
      ['declaration: true', /"declaration"\s*:\s*true/],
      ['outDir ./dist', /"outDir"\s*:\s*"\.\/dist"/],
      ['noUncheckedIndexedAccess: true', /"noUncheckedIndexedAccess"\s*:\s*true/],
      ['excludes **/*.test.ts', /\*\*\/\*\.test\.ts/]
    ]
    for (const [label, re] of tbChecks) re.test(tb) ? add('PASS', 'build', `tsconfig.build.json ${label}`) : add('WARN', 'build', `tsconfig.build.json: expected ${label}`)
  }
  // the richer shared base lives in the compiled-TS profile — WARN, not FAIL
  const tsBase: [string, RegExp][] = [
    ['target es2024', /"target"\s*:\s*"es2024"/i],
    ['verbatimModuleSyntax: true', /"verbatimModuleSyntax"\s*:\s*true/],
    ['noUnusedLocals: true', /"noUnusedLocals"\s*:\s*true/]
  ]
  for (const [label, re] of tsBase) re.test(ts) ? add('PASS', 'build', `tsconfig.json (shared base) ${label}`) : add('WARN', 'build', `tsconfig.json (shared base) should set ${label}`)
  // CLI chmod rule: build chmods EXACTLY dist/cli/cli.js iff src/cli/, and nothing else.
  const chmodTargets = [...buildScript.matchAll(/chmod\s+\+x\s+([^&|;]+)/g)].flatMap((m) => m[1].trim().split(/\s+/)).filter(Boolean)
  const allowed = hasCli ? ['dist/cli/cli.js'] : []
  const unexpected = chmodTargets.filter((t) => !allowed.includes(t))
  const missing = allowed.filter((t) => !chmodTargets.includes(t))
  if (unexpected.length) add('FAIL', 'build', `build chmods unexpected target(s): ${unexpected.join(', ')} — chmod only dist/cli/cli.js (iff src/cli/), never the server bin`)
  if (missing.length) add('WARN', 'build', `src/cli/ exists but build does not chmod +x ${missing.join(', ')}`)
  if (!unexpected.length && !missing.length) add('PASS', 'build', hasCli ? 'build chmods exactly dist/cli/cli.js' : 'build chmods nothing (no src/cli/) — correct')
} else {
  add('SKIP', 'build', 'no compiled-tsc build capability — not applicable')
}

// ── capability: env config ────────────────────────────────────────────────────
if (hasEnv) {
  envExample ? add('PASS', 'env', `${envExample} present`) : add('WARN', 'env', 'loads env (process.loadEnvFile) but no .env*.example template committed')
  // NODE_ENV=development must appear only in dev/inspect scripts
  const devKeys = (k: string) => /:(dev|inspect)\b/.test(k) || k.endsWith(':dev') || k.endsWith(':inspect')
  const leaks = Object.entries(scripts).filter(([k, v]) => v.includes('NODE_ENV=development') && !devKeys(k))
  leaks.length ? add('FAIL', 'env', `NODE_ENV=development outside a dev/inspect script: ${leaks.map(([k]) => k).join(', ')}`) : add('PASS', 'env', 'NODE_ENV=development only in dev/inspect scripts')
} else {
  add('SKIP', 'env', 'no env capability — not applicable')
}

// ── core: .ki-config.toml [knowledgeislands-engineering] table ────────────────
const ki = read('.ki-config.toml')
if (!ki) add('WARN', 'ki-config', '.ki-config.toml missing (knowledgeislands-repo owns the contract)')
else if (!/^\[knowledgeislands-engineering\]/m.test(ki)) {
  add('WARN', 'ki-config', 'no [knowledgeislands-engineering] table — add it to mark this repo as governed by the engineering standard')
} else {
  add('PASS', 'ki-config', '[knowledgeislands-engineering] table present')
  // validate-down: keys directly under the table must be known (none defined yet;
  // the only allowed sub-structure is a [knowledgeislands-engineering.checks] table)
  const body = ki.split(/^\[knowledgeislands-engineering\]/m)[1]?.split(/^\[/m)[0] ?? ''
  const KNOWN = new Set<string>([]) // no top-level options yet
  for (const m of body.matchAll(/^\s*([A-Za-z0-9_-]+)\s*=/gm)) {
    KNOWN.has(m[1]) ? add('PASS', 'ki-config', `known key ${m[1]}`) : add('WARN', 'ki-config', `unknown key under [knowledgeislands-engineering]: ${m[1]} (validate-down)`)
  }
}

// ── report ────────────────────────────────────────────────────────────────────
// Shared emit harness — copy verbatim across KI checkers (enforcement-framework §2/§5).
// Renders the painted table by default, JSON on `--json`, and writes the latest
// report under <target>/.ki-meta/audits/<concern>.{md,json} on `--report [dir]`.
function emit(items: Finding[], target: string, concern: string, title: string, footer: string): never {
  const argv = process.argv.slice(2)
  const json = argv.includes('--json')
  const ri = argv.indexOf('--report')
  const report = ri !== -1
  const reportDir = report && argv[ri + 1] && !argv[ri + 1].startsWith('-') ? argv[ri + 1] : join(target, '.ki-meta', 'audits')

  const n = (l: Level): number => items.filter((f) => f.level === l).length
  const summary = { fail: n('FAIL'), warn: n('WARN'), polish: n('POLISH'), advisory: n('ADVISORY'), info: n('INFO'), skip: n('SKIP'), pass: n('PASS') }
  const tally = `${summary.fail} fail · ${summary.warn} warn · ${summary.polish} polish · ${summary.pass} pass  ·  ${summary.advisory} advisory · ${summary.skip} skip`
  const stamp = new Date().toISOString()

  if (report) {
    mkdirSync(reportDir, { recursive: true })
    const body = ORDER.flatMap((l) => {
      const rows = items.filter((f) => f.level === l)
      return rows.length ? ['', `## ${ICON[l]} ${l} (${rows.length})`, ...rows.map((r) => `- [${r.area}] ${r.msg}`)] : []
    })
    writeFileSync(join(reportDir, `${concern}.md`), [`# ${concern} audit — ${target}`, '', `_${stamp}_`, '', tally, ...body, ''].join('\n'))
    writeFileSync(join(reportDir, `${concern}.json`), `${JSON.stringify({ concern, target, generatedAt: stamp, summary, findings: items }, null, 2)}\n`)
  }

  if (json) {
    process.stdout.write(`${JSON.stringify({ concern, target, generatedAt: stamp, summary, findings: items }, null, 2)}\n`)
  } else {
    console.log(`\n${title}\n${'─'.repeat(60)}`)
    for (const l of ORDER) {
      const rows = items.filter((f) => f.level === l)
      if (!rows.length) continue
      console.log(`\n${ICON[l]} ${l} (${rows.length})`)
      for (const r of rows) console.log(`   [${r.area}] ${r.msg}`)
    }
    console.log(`\n${'─'.repeat(60)}\n${tally}`)
    if (footer) console.log(footer)
    if (report) console.log(`report → ${join(reportDir, `${concern}.{md,json}`)}`)
    console.log('')
  }
  process.exit(summary.fail ? 1 : 0)
}

add('INFO', 'scope', 'engineering common layer — compose with the artifact-skill audit for full coverage')
add('ADVISORY', 'judgment', 'mechanical layer only — apply the [J] criteria in references/audit-rubric.md by reading')

emit(findings, repo, 'engineering', `Engineering standard audit — ${name}  (${repo})`, 'Common layer only — run the artifact skill audit too (e.g. audit-mcp.ts for an MCP repo).')
