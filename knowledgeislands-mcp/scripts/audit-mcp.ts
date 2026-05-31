#!/usr/bin/env bun
/**
 * Mechanical auditor for a workspace MCP repo.
 *
 *   bun scripts/audit-mcp.ts <repo-path>        # or: node after a build
 *
 * Checks the STRUCTURAL / TOOLING layer of the standard the `knowledgeislands-mcp`
 * skill codifies — layout, package.json, tsconfig/vitest/biome, .env.example, the
 * shared utils helpers, and known drift (a `bun test` script, a dangling cli
 * chmod). It deliberately does NOT judge tool-naming quality, layer purity, or the
 * security invariants — those need a human/agent read of the code (see
 * references/audit-checklist.md). Output is grouped pass/warn/fail; exit code is
 * non-zero if any FAIL.
 *
 * No dependencies — Node/Bun builtins only.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

type Level = 'PASS' | 'WARN' | 'FAIL'
const findings: { level: Level; area: string; msg: string }[] = []
const add = (level: Level, area: string, msg: string) => findings.push({ level, area, msg })

const repo = process.argv[2]
if (!repo || !existsSync(repo)) {
  console.error('usage: audit-mcp.ts <repo-path>   (path must exist)')
  process.exit(2)
}
const at = (...p: string[]) => join(repo, ...p)
const has = (...p: string[]) => existsSync(at(...p))
const read = (...p: string[]): string => {
  try {
    return readFileSync(at(...p), 'utf8')
  } catch {
    return ''
  }
}
const isDir = (...p: string[]) => has(...p) && statSync(at(...p)).isDirectory()

// ── layout ──────────────────────────────────────────────────────────────────
for (const d of ['config', 'mcp-server', 'tools', 'main', 'utils']) {
  isDir('src', d) ? add('PASS', 'layout', `src/${d}/ present`) : add('FAIL', 'layout', `src/${d}/ missing`)
}
const hasCli = isDir('src', 'cli')
if (hasCli) {
  for (const f of ['cli.ts', 'index.ts']) {
    has('src', 'cli', f) ? add('PASS', 'layout', `src/cli/${f} present`) : add('FAIL', 'layout', `src/cli/ exists but src/cli/${f} missing`)
  }
}

// top-level config files
for (const f of ['tsconfig.json', 'tsconfig.build.json', 'biome.json', 'README.md', 'CLAUDE.md']) {
  has(f) ? add('PASS', 'files', `${f} present`) : add('FAIL', 'files', `${f} missing`)
}
has('ROADMAP.md') ? add('PASS', 'files', 'ROADMAP.md present') : add('WARN', 'files', 'ROADMAP.md missing (most repos have one)')
const envExample = ['.env.example', '.env.development.example'].find((f) => has(f))
envExample ? add('PASS', 'files', `${envExample} present`) : add('FAIL', 'files', '.env(.development).example missing')

// vitest config (ts or js)
const vitestFile = ['vitest.config.ts', 'vitest.config.js', 'vitest.config.mts'].find((f) => has(f))
vitestFile ? add('PASS', 'files', `${vitestFile} present`) : add('FAIL', 'files', 'vitest.config.* missing')

// ── package.json ──────────────────────────────────────────────────────────────
let pkg: Record<string, unknown> = {}
try {
  pkg = JSON.parse(read('package.json'))
} catch {
  add('FAIL', 'package', 'package.json missing or unparseable')
}
const scripts = (pkg.scripts ?? {}) as Record<string, string>
const name = String(pkg.name ?? basename(repo))

const eq = (area: string, key: string, actual: unknown, want: unknown) =>
  actual === want ? add('PASS', area, `${key} = ${JSON.stringify(want)}`) : add('FAIL', area, `${key} should be ${JSON.stringify(want)}, got ${JSON.stringify(actual)}`)

eq('package', 'type', pkg.type, 'module')
eq('package', 'main', pkg.main, 'dist/mcp-server/index.js')
String(pkg.packageManager ?? '').startsWith('bun@')
  ? add('PASS', 'package', `packageManager = ${pkg.packageManager}`)
  : add('FAIL', 'package', `packageManager should be bun@…, got ${JSON.stringify(pkg.packageManager)}`)
const nodeEngine = String((pkg.engines as Record<string, string> | undefined)?.node ?? '')
// parse the floor major version from a range like ">=22" / ">= 22.0.0" and require ≥ 22
// (a literal 2[2-9] pattern would silently reject node 30+, so read the number instead)
const nodeOk = (() => {
  const m = nodeEngine.match(/>=\s*(\d+)/)
  return m ? Number(m[1]) >= 22 : false
})()
add(nodeOk ? 'PASS' : 'FAIL', 'package', nodeOk ? `engines.node = ${nodeEngine}` : `engines.node should be >=22, got ${JSON.stringify(nodeEngine)}`)
Array.isArray(pkg.files) && (pkg.files as string[]).includes('dist') ? add('PASS', 'package', 'files includes "dist"') : add('FAIL', 'package', 'files should include "dist"')

const bin = (pkg.bin ?? {}) as Record<string, string>
Object.values(bin).includes('dist/mcp-server/index.js') ? add('PASS', 'package', 'bin → dist/mcp-server/index.js') : add('FAIL', 'package', 'bin must map to dist/mcp-server/index.js')

const exp = (pkg.exports ?? {}) as Record<string, unknown>
for (const k of ['.', './config', './package.json']) {
  exp[k] !== undefined ? add('PASS', 'package', `exports has "${k}"`) : add('FAIL', 'package', `exports missing "${k}"`)
}

// scripts
const wantScripts: Record<string, string> = {
  test: 'vitest run',
  build: 'tsc -p tsconfig.build.json',
  'lint:types': 'tsc --noEmit'
}
for (const [k, v] of Object.entries(wantScripts)) {
  if (!scripts[k]) add('FAIL', 'scripts', `script "${k}" missing`)
  else if (k === 'build' ? scripts[k].startsWith(v) : scripts[k] === v) add('PASS', 'scripts', `${k} = ${JSON.stringify(scripts[k])}`)
  else add('FAIL', 'scripts', `${k} should be ${JSON.stringify(v)}, got ${JSON.stringify(scripts[k])}`)
}
for (const k of ['test:coverage', 'test:watch', 'lint:check', 'server:mcp:dev', 'server:mcp:inspect', 'server:mcp:start', 'clean']) {
  scripts[k] ? add('PASS', 'scripts', `${k} present`) : add('WARN', 'scripts', `standard script "${k}" missing`)
}
// the `bun test` trap
const bunTest = Object.entries(scripts).filter(([, v]) => /\bbun test\b/.test(v))
bunTest.length
  ? add('FAIL', 'scripts', `uses "bun test" (Bun's runner, not vitest) in: ${bunTest.map(([k]) => k).join(', ')}`)
  : add('PASS', 'scripts', 'no "bun test" (vitest invoked via "bun run test")')
// dev scripts must set NODE_ENV=development
for (const k of ['server:mcp:dev', 'server:mcp:inspect']) {
  if (scripts[k] && !scripts[k].includes('NODE_ENV=development')) add('WARN', 'scripts', `${k} should set NODE_ENV=development`)
}
// dangling / missing cli chmod
const buildScript = scripts.build ?? ''
const buildChmodsCli = /chmod \+x[^&]*dist\/cli\/cli\.js/.test(buildScript)
if (buildChmodsCli && !hasCli) add('FAIL', 'scripts', 'build chmods dist/cli/cli.js but src/cli/ does not exist (drift)')
if (hasCli && !buildChmodsCli) add('WARN', 'scripts', 'src/cli/ exists but build does not chmod +x dist/cli/cli.js')

// ── shared utils helpers ──────────────────────────────────────────────────────
for (const f of ['access-level.ts', 'annotations.ts', 'audit-log.ts']) {
  has('src', 'utils', f) ? add('PASS', 'utils', `utils/${f} present`) : add('FAIL', 'utils', `shared utils/${f} missing`)
}

// ── config/index.ts surface ───────────────────────────────────────────────────
const cfg = read('src', 'config', 'index.ts')
if (cfg) {
  ;/export\s+(async\s+)?function\s+loadConfig|export\s+const\s+loadConfig/.test(cfg)
    ? add('PASS', 'config', 'config exports loadConfig')
    : add('FAIL', 'config', 'config/index.ts does not export loadConfig')
  cfg.includes('process.loadEnvFile') ? add('PASS', 'config', 'loadConfig uses process.loadEnvFile (Node .env parity)') : add('WARN', 'config', 'config/index.ts has no process.loadEnvFile call')
  for (const sym of ['ACCESS_LEVELS', 'ACCESS_LEVEL_RANK', 'AuditLogMode']) {
    cfg.includes(sym) ? add('PASS', 'config', `config references ${sym}`) : add('WARN', 'config', `config missing ${sym}`)
  }
}

// ── ambient env reads outside config/ ─────────────────────────────────────────
const offenders: string[] = []
const walk = (dir: string) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'config') continue
      walk(full)
    } else if (e.name.endsWith('.ts') && !e.name.endsWith('.test.ts')) {
      // Match a real `process.env` read, not one inside a comment — doc comments that
      // merely *mention* process.env (e.g. "nothing reads process.env here") are not reads.
      const hit = readFileSync(full, 'utf8')
        .split('\n')
        .some((ln) => {
          const i = ln.indexOf('process.env')
          if (i === -1) return false
          const trimmed = ln.trimStart()
          if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return false
          return !ln.slice(0, i).includes('//') // an inline `// … process.env` comment
        })
      if (hit) offenders.push(full.replace(`${repo}/`, ''))
    }
  }
}
if (isDir('src')) walk(at('src'))
offenders.length ? add('WARN', 'config', `process.env read outside config/ (verify each is intentional): ${offenders.join(', ')}`) : add('PASS', 'config', 'no process.env reads outside config/')

// ── vitest coverage thresholds ────────────────────────────────────────────────
if (vitestFile) {
  const vc = read(vitestFile)
  const covOk = /lines:\s*100/.test(vc) && /branches:\s*100/.test(vc) && /functions:\s*100/.test(vc) && /statements:\s*100/.test(vc)
  add(covOk ? 'PASS' : 'WARN', 'vitest', covOk ? 'coverage thresholds 100% on all four metrics' : 'coverage thresholds are not visibly 100/100/100/100')
  for (const ex of ['mcp-server/index.ts', 'tools/**/index.ts', 'utils/annotations.ts']) {
    vc.includes(ex) ? add('PASS', 'vitest', `coverage excludes ${ex}`) : add('WARN', 'vitest', `coverage should exclude ${ex}`)
  }
}

// ── registered tool names ─────────────────────────────────────────────────────
const toolNames: string[] = []
if (isDir('src', 'tools')) {
  const tw = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory()) tw(full)
      else if (e.name.endsWith('.ts')) {
        const src = readFileSync(full, 'utf8')
        // Tools register via `server.registerTool('name', …)` OR via a local alias
        // (`const register = server.registerTool` then `register('name', …)`). Learn the
        // file's alias idents, then match calls of registerTool or any of them.
        const callers = new Set(['registerTool'])
        for (const m of src.matchAll(/(?:const|let)\s+(\w+)\s*=\s*(?:[\w.]+\.)?registerTool\b/g)) callers.add(m[1])
        const callRe = new RegExp(`\\b(?:${[...callers].join('|')})\\(\\s*['"]([a-z0-9_]+)['"]`, 'g')
        for (const m of src.matchAll(callRe)) toolNames.push(m[1])
      }
    }
  }
  tw(at('src', 'tools'))
}
if (toolNames.length) {
  // <app>_<resource>_<action> is 3 segments; metadata/lifecycle tools may drop the
  // resource segment (m365_about, *_auth_start) → 2 segments is also valid. Require
  // ≥2 segments so those documented names don't false-WARN; flag only 1-segment names.
  const bad = toolNames.filter((n) => !/^[a-z0-9]+(_[a-z0-9]+){1,}$/.test(n))
  add('PASS', 'tools', `registered tools (${toolNames.length}): ${toolNames.sort().join(', ')}`)
  bad.length
    ? add('WARN', 'tools', `names not matching <app>_<resource>_<action> (or _<action> for metadata): ${bad.join(', ')}`)
    : add('PASS', 'tools', 'all tool names look like <app>_<resource>_<action>')
} else {
  add('WARN', 'tools', 'no registerTool(...) calls found — verify tool registration')
}

// ── structured output: structuredContent should be paired with a declared outputSchema ──
if (isDir('src', 'tools')) {
  let usesStructured = false
  let declaresOutputSchema = false
  const sw = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory()) sw(full)
      else if (e.name.endsWith('.ts') && !e.name.endsWith('.test.ts')) {
        const src = readFileSync(full, 'utf8')
        if (/\bstructuredContent\b/.test(src)) usesStructured = true
        if (/\boutputSchema\b/.test(src)) declaresOutputSchema = true
      }
    }
  }
  sw(at('src', 'tools'))
  if (usesStructured && !declaresOutputSchema) add('WARN', 'tools', 'tools return structuredContent but no outputSchema is declared — pair them (spec 2025-06-18) so clients can validate')
  else if (usesStructured) add('PASS', 'tools', 'structuredContent paired with a declared outputSchema')
}

// ── report ────────────────────────────────────────────────────────────────────
const icon = { PASS: '✅', WARN: '⚠️ ', FAIL: '❌' } as const
const order: Level[] = ['FAIL', 'WARN', 'PASS']
console.log(`\nMCP standards audit — ${name}  (${repo})\n${'─'.repeat(60)}`)
for (const lvl of order) {
  const rows = findings.filter((f) => f.level === lvl)
  if (!rows.length) continue
  console.log(`\n${icon[lvl]} ${lvl} (${rows.length})`)
  for (const r of rows) console.log(`   [${r.area}] ${r.msg}`)
}
const fails = findings.filter((f) => f.level === 'FAIL').length
const warns = findings.filter((f) => f.level === 'WARN').length
console.log(`\n${'─'.repeat(60)}\n${fails} fail · ${warns} warn · ${findings.length - fails - warns} pass`)
console.log('Mechanical layer only — now run the semantic pass in references/audit-checklist.md.\n')
process.exit(fails ? 1 : 0)
