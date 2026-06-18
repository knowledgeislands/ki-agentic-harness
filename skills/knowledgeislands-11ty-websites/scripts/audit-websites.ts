#!/usr/bin/env bun
/**
 * Mechanical auditor for a Knowledge Islands 11ty website repo.
 *
 *   bun scripts/audit-websites.ts <repo-path>        # or: node --experimental-strip-types
 *
 * Checks the SITE-BUILD DELTA of the standard the `knowledgeislands-11ty-websites` skill
 * codifies — the Eleventy/Nunjucks/Tailwind site that compiles to a portable dist/. It does
 * NOT check the common toolchain (Bun, the lint and deps script families, tsconfig/biome, the
 * type-check) — that is the `knowledgeislands-engineering` layer; run audit-engineering.ts first. Nor does it
 * check serving the dist/ — that is `knowledgeislands-cloudflare-hosting`; run
 * audit-cloudflare-hosting.ts too if the site is deployed. The judgment items (tokens drive
 * the palette, _data is the single source of structure, SEO wired into base.njk) need a read
 * of the code — see references/audit-rubric.md.
 *
 * Output is grouped pass/warn/fail; exit non-zero if any FAIL. No dependencies — Node/Bun builtins only.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

type Level = 'PASS' | 'WARN' | 'FAIL'
const findings: { level: Level; area: string; msg: string }[] = []
const add = (level: Level, area: string, msg: string) => findings.push({ level, area, msg })

const repo = process.argv[2]
if (!repo || !existsSync(repo)) {
  console.error('usage: audit-websites.ts <repo-path>   (path must exist)')
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
const CONFIG_NAMES = ['eleventy.config.ts', 'eleventy.config.js', 'eleventy.config.mjs', 'eleventy.config.cjs']

// ── locate the site root: flat (repo root) or site/ subfolder ─────────────────
const flatCfg = CONFIG_NAMES.find((f) => has(f))
const siteCfg = CONFIG_NAMES.find((f) => has('site', f))
let siteRoot = '' // relative to repo
let cfgName = ''
let layout = ''
if (flatCfg) {
  siteRoot = ''
  cfgName = flatCfg
  layout = 'flat'
} else if (siteCfg) {
  siteRoot = 'site'
  cfgName = siteCfg
  layout = 'site/ subfolder'
}
const siteAt = (...p: string[]) => (siteRoot ? join(siteRoot, ...p) : join(...p))

if (!cfgName) {
  add('FAIL', 'layout', 'no eleventy.config.{ts,js,mjs,cjs} at repo root or site/ — not an Eleventy site')
} else {
  add('PASS', 'layout', `${siteRoot ? `${siteRoot}/` : ''}${cfgName} present (${layout} layout)`)
}

// ── package.json ──────────────────────────────────────────────────────────────
let pkg: Record<string, unknown> = {}
try {
  pkg = JSON.parse(read('package.json'))
} catch {
  add('FAIL', 'package', 'package.json missing or unparseable')
}
const deps = { ...((pkg.dependencies as object) ?? {}), ...((pkg.devDependencies as object) ?? {}) } as Record<string, string>
const scripts = (pkg.scripts ?? {}) as Record<string, string>
const name = String(pkg.name ?? basename(repo))

// ── stack ───────────────────────────────────────────────────────────────────
deps['@11ty/eleventy'] ? add('PASS', 'stack', `@11ty/eleventy ${deps['@11ty/eleventy']}`) : add('FAIL', 'stack', '@11ty/eleventy not a dependency')
for (const f of ['astro', 'next']) {
  if (deps[f]) add('WARN', 'stack', `${f} present — this skill governs Eleventy sites, not ${f}`)
}
// tsx is the legacy TS runner (5g-emerge); native Bun / Node (type stripping stable/unflagged) is the standard.
const usesTsx = deps.tsx !== undefined || Object.values(scripts).some((s) => /tsx\/esm|--import\s+tsx/.test(s))
usesTsx ? add('WARN', 'stack', 'tsx detected (legacy TS runner) — run TS natively on Bun / Node') : add('PASS', 'stack', 'no tsx (TS runs natively)')

// ── Tailwind: config-less ─────────────────────────────────────────────────────
const TW_CONFIGS = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs', 'tailwind.config.mjs']
const strayTw = TW_CONFIGS.filter((f) => has(f) || (siteRoot && has(siteRoot, f)))
strayTw.length ? add('FAIL', 'tailwind', `config-less Tailwind 4 expected, found ${strayTw.join(', ')}`) : add('PASS', 'tailwind', 'no tailwind.config.* (config-less Tailwind 4)')

deps['@tailwindcss/cli'] ? add('PASS', 'tailwind', `@tailwindcss/cli ${deps['@tailwindcss/cli']}`) : add('WARN', 'tailwind', '@tailwindcss/cli not a dependency')

const mainCss = read(siteAt('src', 'assets', 'css', 'main.css'))
if (mainCss) {
  const importsTw = /@import\s+["']tailwindcss["']/.test(mainCss)
  add(importsTw ? 'PASS' : 'FAIL', 'tailwind', importsTw ? 'main.css imports "tailwindcss"' : 'main.css does not @import "tailwindcss"')
  const importsTokens = /@import\s+["']\.\/tokens\.css["']/.test(mainCss)
  add(importsTokens ? 'PASS' : 'WARN', 'tailwind', importsTokens ? 'main.css imports tokens.css' : 'main.css does not import ./tokens.css (design tokens expected alongside)')
} else {
  add('FAIL', 'tailwind', `${siteAt('src/assets/css/main.css')} missing`)
}

const tokensCss = read(siteAt('src', 'assets', 'css', 'tokens.css'))
if (tokensCss) {
  const themeInline = /@theme\s+inline/.test(tokensCss)
  add(themeInline ? 'PASS' : 'WARN', 'tailwind', themeInline ? 'tokens.css exposes vars via @theme inline' : 'tokens.css present but no @theme inline (tokens not exposed to utilities)')
} else {
  add('WARN', 'tailwind', `${siteAt('src/assets/css/tokens.css')} missing (no design-token layer)`)
}

// ── src/ layout ───────────────────────────────────────────────────────────────
for (const d of ['_data', '_includes/layouts', '_includes/partials', 'assets/css']) {
  isDir(siteAt('src', ...d.split('/'))) ? add('PASS', 'layout', `src/${d}/ present`) : add('FAIL', 'layout', `src/${d}/ missing`)
}

// seo-meta partial (any extension)
const partialsDir = siteAt('src', '_includes', 'partials')
let hasSeoMeta = false
if (isDir(partialsDir)) {
  const tryWalk = (dir: string) => {
    for (const e of readdirSync(at(dir), { withFileTypes: true })) {
      if (e.isDirectory()) tryWalk(join(dir, e.name))
      else if (/seo-meta/i.test(e.name)) hasSeoMeta = true
    }
  }
  tryWalk(partialsDir)
}
hasSeoMeta ? add('PASS', 'seo', 'seo-meta partial present') : add('WARN', 'seo', 'no seo-meta partial under _includes/partials/ (SEO meta tags)')

// ── eleventy.config patterns ──────────────────────────────────────────────────
const cfg = cfgName ? read(siteAt(cfgName)) : ''
if (cfg) {
  const hasRelTransform = /toRelativeOutputUrl|explicit-index-links/.test(cfg) || (/addTransform/.test(cfg) && /\brelative\(/.test(cfg))
  add(hasRelTransform ? 'PASS' : 'FAIL', 'config', hasRelTransform ? 'portable-dist/ URL transform present' : 'no absolute→relative URL transform (dist/ will not be portable)')

  const hasTsData = /addDataExtension\(\s*["']ts["']/.test(cfg)
  add(hasTsData ? 'PASS' : 'FAIL', 'config', hasTsData ? "addDataExtension('ts') registered" : "no addDataExtension('ts') (TypeScript data files)")

  const hasJson5Data = /addDataExtension\(\s*["']json5["']/.test(cfg)
  add(hasJson5Data ? 'PASS' : 'WARN', 'config', hasJson5Data ? "addDataExtension('json5') registered" : "no addDataExtension('json5')")

  const hasTwHook = /on\(\s*["']eleventy\.before["']/.test(cfg) && /tailwindcss/.test(cfg)
  add(hasTwHook ? 'PASS' : 'WARN', 'config', hasTwHook ? 'Tailwind compiled via eleventy.before hook' : 'no eleventy.before hook invoking the Tailwind CLI')

  const hasWatch = /addWatchTarget/.test(cfg)
  add(hasWatch ? 'PASS' : 'WARN', 'config', hasWatch ? 'addWatchTarget present (dev reload on CSS)' : 'no addWatchTarget for the compiled CSS')
}

// ── scripts (accept site: prefix or unprefixed, per layout) ───────────────────
const script = (base: string) => scripts[`site:${base}`] ?? scripts[base]
const build = script('build')
build && /eleventy/.test(build) ? add('PASS', 'scripts', 'build script invokes Eleventy') : add('FAIL', 'scripts', 'no build script invoking Eleventy ((site:)build)')
const dev = script('dev')
dev && /concurrently/.test(dev) ? add('PASS', 'scripts', 'dev script runs Tailwind watch + Eleventy serve (concurrently)') : add('WARN', 'scripts', 'no concurrently dev script ((site:)dev)')
script('clean') ? add('PASS', 'scripts', 'clean script present') : add('WARN', 'scripts', 'no (site:)clean script')

// ── dist/ gitignored ──────────────────────────────────────────────────────────
const gitignore = read('.gitignore')
const distIgnored = /^\s*\/?dist\/?\s*$/m.test(gitignore)
add(distIgnored ? 'PASS' : 'WARN', 'dist', distIgnored ? 'dist/ is gitignored' : 'dist/ does not appear in .gitignore (build output should not be committed)')

// ── .ki-config.toml opt-in table ──────────────────────────────────────────────
const ki = read('.ki-config.toml')
const kiTable = ki.includes('[knowledgeislands-11ty-websites]')
add(
  kiTable ? 'PASS' : 'WARN',
  'config',
  kiTable ? '[knowledgeislands-11ty-websites] table present in .ki-config.toml' : 'no [knowledgeislands-11ty-websites] table in .ki-config.toml (add it to opt in)'
)

// ── report ────────────────────────────────────────────────────────────────────
const icon = { PASS: '✅', WARN: '⚠️ ', FAIL: '❌' } as const
const order: Level[] = ['FAIL', 'WARN', 'PASS']
console.log(`\n11ty website audit — ${name}  (${repo})\n${'─'.repeat(60)}`)
for (const lvl of order) {
  const rows = findings.filter((f) => f.level === lvl)
  if (!rows.length) continue
  console.log(`\n${icon[lvl]} ${lvl} (${rows.length})`)
  for (const r of rows) console.log(`   [${r.area}] ${r.msg}`)
}
const fails = findings.filter((f) => f.level === 'FAIL').length
const warns = findings.filter((f) => f.level === 'WARN').length
console.log(`\n${'─'.repeat(60)}\n${fails} fail · ${warns} warn · ${findings.length - fails - warns} pass`)
console.log('Site-build delta only — also run audit-engineering.ts (toolchain) + audit-cloudflare-hosting.ts (if deployed) + the rubric judgment pass.\n')
process.exit(fails ? 1 : 0)
