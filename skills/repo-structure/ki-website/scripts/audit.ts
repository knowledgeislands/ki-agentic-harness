#!/usr/bin/env bun
/**
 * Mechanical auditor for a Knowledge Islands 11ty website repo.
 *
 *   bun scripts/audit.ts <repo-path>        # or: node --experimental-strip-types
 *   bun scripts/audit.ts --educate             # print the default [ki-website] block
 *
 * Checks the SITE-BUILD DELTA of the standard the `ki-website` skill
 * codifies — the Eleventy/Nunjucks/Tailwind site that compiles to a portable dist/. It does
 * NOT check the common toolchain (aggregate/scoped audit wiring, direct code-tool execution,
 * tsconfig/biome, or the type-check) — that is the `ki-engineering` layer; run audit.ts first. Nor does it
 * check serving the dist/ — that is `ki-website-cloudflare`; run
 * audit.ts too if the site is deployed. The judgment items (tokens drive
 * the palette, _data is the single source of structure, SEO wired into base.njk) need a read
 * of the code — see references/rubric.md.
 *
 * Each typed mechanical finding carries its rubric code, reference-doc pointer, and — when
 * file-scoped — its path. The canonical checker reporter owns the JSONL output and summary.
 *
 * Output is canonical checker-reporter JSONL; exit non-zero if any mechanical FAIL. No npm
 * dependencies — only Node/Bun builtins and the local vendored reporter payload.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const findings: CheckerFinding[] = []
const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })

// Reference-doc pointers (the `(reference.md)` citation each finding carries).
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const std = (section: string): string => `${STD} ${section}`
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')

// `.ki-config.toml` is a shared per-repo file; this skill owns the
// [ki-website] table. The table header is the opt-in marker and
// the whole of it — there are no per-repo keys today, so `--educate` emits a bare table
// (validate-down warns on any key found under it).
const KI_SECTION = 'ki-website'
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: presence of this table opts the repo into the
# Eleventy + Tailwind site-build standard. It takes no per-repo keys today.
[${KI_SECTION}]
`
if (process.argv.slice(2).includes('--educate')) {
  process.stdout.write(KI_DEFAULT)
  process.exit(0)
}

const repo = process.argv[2] ? resolve(process.argv[2]) : ''
if (!repo || !existsSync(repo) || !statSync(repo).isDirectory()) {
  add('FAIL', 'WEB-6', `target path is not a directory: ${repo || '(missing)'}`, std('§2'))
  emitCheckerReporter({ mode: 'audit', concern: 'website', target: repo || '(missing)', findings })
  process.exit(checkerReporterExitCode(findings))
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
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML
const parseToml = (text: string): { document: Record<string, unknown> | null; malformed: boolean } => {
  try {
    return { document: TOML.parse(text) as Record<string, unknown>, malformed: false }
  } catch {
    return { document: null, malformed: true }
  }
}
const asTable = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

// Applicability is declaration OR structure. With neither signal, this is not a
// website target and the checker must stop before site-layout failures.
const kiText = read('.ki-config.toml')
const parsedKiWebsite = parseToml(kiText)
const kiWebsiteTable = asTable(parsedKiWebsite.document?.[KI_SECTION])
const declaresWebsite = kiWebsiteTable !== null
const hasWebsiteStructure = CONFIG_NAMES.some((f) => has(f) || has('site', f))
if (!declaresWebsite && !parsedKiWebsite.malformed && !hasWebsiteStructure) {
  add('NA', 'WEB-41', 'ki-website not applicable: no [ki-website] declaration or Eleventy config structural marker', std('§2'))
  findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'website', target: repo, findings })
  process.exit(checkerReporterExitCode(findings))
}

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
const cfgPath = cfgName ? siteAt(cfgName) : ''

if (!cfgName) {
  add('FAIL', 'WEB-6', 'no eleventy.config.{ts,js,mjs,cjs} at repo root or site/ — not an Eleventy site', std('§2'))
} else if (layout === 'flat') {
  // Standard §2: every house site is a monorepo, never flat — the site is its own site/ workspace.
  add(
    'WARN',
    'WEB-6',
    `${cfgName} present at repo root (flat layout) — standard §2 requires the site/ workspace; move it under site/`,
    std('§2'),
    cfgName
  )
} else {
  add('PASS', 'WEB-6', `${siteRoot}/${cfgName} present (${layout} layout)`, std('§2'), cfgPath)
}
has('ROADMAP.md') ? add('PASS', 'WEB-7', 'ROADMAP.md present', std('§2'), 'ROADMAP.md') : add('WARN', 'WEB-7', 'no ROADMAP.md', std('§2'))

// ── package.json ──────────────────────────────────────────────────────────────
let pkg: Record<string, unknown> = {}
try {
  pkg = JSON.parse(read('package.json'))
} catch {
  add('FAIL', 'WEB-39', 'package.json missing or unparseable', std('§2'), 'package.json')
}
const deps = { ...((pkg.dependencies as object) ?? {}), ...((pkg.devDependencies as object) ?? {}) } as Record<string, string>
const scripts = (pkg.scripts ?? {}) as Record<string, string>

// ── stack ───────────────────────────────────────────────────────────────────
deps['@11ty/eleventy']
  ? add('PASS', 'WEB-1', `@11ty/eleventy ${deps['@11ty/eleventy']}`, std('§1'), 'package.json')
  : add('FAIL', 'WEB-1', '@11ty/eleventy not a dependency', std('§1'), 'package.json')
for (const f of ['astro', 'next']) {
  if (deps[f]) add('WARN', 'WEB-2', `${f} present — this skill governs Eleventy sites, not ${f}`, std('§1'), 'package.json')
}
// tsx is the legacy TS runner (5g-emerge); native Bun / Node (type stripping stable/unflagged) is the standard.
const usesTsx = deps.tsx !== undefined || Object.values(scripts).some((s) => /tsx\/esm|--import\s+tsx/.test(s))
usesTsx
  ? add('WARN', 'WEB-3', 'tsx detected (legacy TS runner) — run TS natively on Bun / Node', std('§1'), 'package.json')
  : add('PASS', 'WEB-3', 'no tsx (TS runs natively)', std('§1'), 'package.json')

// ── Tailwind: config-less ─────────────────────────────────────────────────────
const TW_CONFIGS = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.cjs', 'tailwind.config.mjs']
const strayTw = TW_CONFIGS.filter((f) => has(f) || (siteRoot && has(siteRoot, f)))
strayTw.length
  ? add('FAIL', 'WEB-18', `config-less Tailwind 4 expected, found ${strayTw.join(', ')}`, std('§5'), strayTw.join(', '))
  : add('PASS', 'WEB-18', 'no tailwind.config.* (config-less Tailwind 4)', std('§5'))

deps['@tailwindcss/cli']
  ? add('PASS', 'WEB-40', `@tailwindcss/cli ${deps['@tailwindcss/cli']}`, std('§5'), 'package.json')
  : add('WARN', 'WEB-40', '@tailwindcss/cli not a dependency', std('§5'), 'package.json')

const mainCssPath = siteAt('src', 'assets', 'css', 'main.css')
const mainCss = read(siteAt('src', 'assets', 'css', 'main.css'))
if (mainCss) {
  const importsTw = /@import\s+["']tailwindcss["']/.test(mainCss)
  add(
    importsTw ? 'PASS' : 'FAIL',
    'WEB-19',
    importsTw ? 'main.css imports "tailwindcss"' : 'main.css does not @import "tailwindcss"',
    std('§5'),
    mainCssPath
  )
  const importsTokens = /@import\s+["']\.\/tokens\.css["']/.test(mainCss)
  add(
    importsTokens ? 'PASS' : 'WARN',
    'WEB-19',
    importsTokens ? 'main.css imports tokens.css' : 'main.css does not import ./tokens.css (design tokens expected alongside)',
    std('§5'),
    mainCssPath
  )
} else {
  add('FAIL', 'WEB-19', 'main.css missing', std('§5'), mainCssPath)
}

const tokensCssPath = siteAt('src', 'assets', 'css', 'tokens.css')
const tokensCss = read(siteAt('src', 'assets', 'css', 'tokens.css'))
if (tokensCss) {
  const themeInline = /@theme\s+inline/.test(tokensCss)
  add(
    themeInline ? 'PASS' : 'WARN',
    'WEB-20',
    themeInline ? 'tokens.css exposes vars via @theme inline' : 'tokens.css present but no @theme inline (tokens not exposed to utilities)',
    std('§5'),
    tokensCssPath
  )
} else {
  add('WARN', 'WEB-20', 'tokens.css missing (no design-token layer)', std('§5'), tokensCssPath)
}

// ── src/ layout ───────────────────────────────────────────────────────────────
for (const d of ['_data', '_includes/layouts', '_includes/partials', 'assets/css']) {
  const dir = siteAt('src', ...d.split('/'))
  isDir(siteAt('src', ...d.split('/')))
    ? add('PASS', 'WEB-9', `src/${d}/ present`, std('§2'), dir)
    : add('FAIL', 'WEB-9', `src/${d}/ missing`, std('§2'), dir)
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
hasSeoMeta
  ? add('PASS', 'WEB-26', 'seo-meta partial present', std('§7'), partialsDir)
  : add('WARN', 'WEB-26', 'no seo-meta partial under _includes/partials/ (SEO meta tags)', std('§7'), partialsDir)

// ── eleventy.config patterns ──────────────────────────────────────────────────
const cfg = cfgName ? read(siteAt(cfgName)) : ''
if (cfg) {
  const hasRelTransform = /toRelativeOutputUrl|explicit-index-links/.test(cfg) || (/addTransform/.test(cfg) && /\brelative\(/.test(cfg))
  add(
    hasRelTransform ? 'PASS' : 'FAIL',
    'WEB-12',
    hasRelTransform ? 'portable-dist/ URL transform present' : 'no absolute→relative URL transform (dist/ will not be portable)',
    std('§4'),
    cfgPath
  )

  const hasTsData = /addDataExtension\(\s*["']ts["']/.test(cfg)
  add(
    hasTsData ? 'PASS' : 'FAIL',
    'WEB-13',
    hasTsData ? "addDataExtension('ts') registered" : "no addDataExtension('ts') (TypeScript data files)",
    std('§4'),
    cfgPath
  )

  const hasJson5Data = /addDataExtension\(\s*["']json5["']/.test(cfg)
  add(
    hasJson5Data ? 'PASS' : 'WARN',
    'WEB-14',
    hasJson5Data ? "addDataExtension('json5') registered" : "no addDataExtension('json5')",
    std('§4'),
    cfgPath
  )

  const hasTwHook = /on\(\s*["']eleventy\.before["']/.test(cfg) && /tailwindcss/.test(cfg)
  add(
    hasTwHook ? 'PASS' : 'WARN',
    'WEB-15',
    hasTwHook ? 'Tailwind compiled via eleventy.before hook' : 'no eleventy.before hook invoking the Tailwind CLI',
    std('§4'),
    cfgPath
  )

  const hasWatch = /addWatchTarget/.test(cfg)
  add(
    hasWatch ? 'PASS' : 'WARN',
    'WEB-16',
    hasWatch ? 'addWatchTarget present (dev reload on CSS)' : 'no addWatchTarget for the compiled CSS',
    std('§4'),
    cfgPath
  )
}

// ── scripts (ki:site: prefix per the naming law; bare lifecycle idiom for build/clean) ──
const script = (base: string) => scripts[`ki:site:${base}`] ?? scripts[`ki:${base}`] ?? scripts[base]
const build = script('build')
build && /eleventy/.test(build)
  ? add('PASS', 'WEB-30', 'build script invokes Eleventy', std('§8'), 'package.json')
  : add('FAIL', 'WEB-30', 'no build script invoking Eleventy (ki:site:build)', std('§8'), 'package.json')
const dev = script('dev')
dev && /concurrently/.test(dev)
  ? add('PASS', 'WEB-30', 'dev script runs Tailwind watch + Eleventy serve (concurrently)', std('§8'), 'package.json')
  : add('WARN', 'WEB-30', 'no concurrently dev script (ki:site:dev)', std('§8'), 'package.json')
script('clean')
  ? add('PASS', 'WEB-32', 'clean script present', std('§8'), 'package.json')
  : add('WARN', 'WEB-32', 'no ki:site:clean script', std('§8'), 'package.json')
// the concurrently dev script fans out to a Tailwind watcher + an Eleventy server
if (dev && /concurrently/.test(dev)) {
  for (const sub of ['dev:css', 'dev:serve']) {
    script(sub)
      ? add('PASS', 'WEB-31', `ki:site:${sub} present (dev fan-out)`, std('§8'), 'package.json')
      : add('WARN', 'WEB-31', `ki:site:${sub} missing — the concurrently dev script fans out to it`, std('§8'), 'package.json')
  }
}

// ── dist/ gitignored ──────────────────────────────────────────────────────────
// Standard (§9): dist/ lives at site/dist/ (inside the workspace), so the correct
// gitignore entry from the repo root is `site/dist` or `/site/dist`.
// A root-level `/dist` entry means the output was (incorrectly) at $root/dist/.
const gitignore = read('.gitignore')
const distCorrect = siteRoot
  ? // site/ subfolder layout: must ignore site/dist, not root dist
    /^\s*\/?site\/dist\/?\s*$/m.test(gitignore)
  : // flat layout: dist at repo root is fine
    /^\s*\/?dist\/?\s*$/m.test(gitignore)
const distRootMisplaced = siteRoot && /^\s*\/dist\/?\s*$/m.test(gitignore)
add(
  distCorrect ? 'PASS' : distRootMisplaced ? 'FAIL' : 'WARN',
  'WEB-33',
  distCorrect
    ? `${siteRoot ? 'site/dist/' : 'dist/'} is correctly gitignored`
    : distRootMisplaced
      ? 'gitignore has /dist (repo root) but site/ layout puts output at site/dist/ — update to /site/dist'
      : `${siteRoot ? 'site/dist/' : 'dist/'} not found in .gitignore (build output should not be committed)`,
  std('§9'),
  '.gitignore'
)

// ── wrangler.jsonc: assets.directory must be dist, not ../dist ────────────────
// In the site/ subfolder layout, wrangler.jsonc lives at site/wrangler.jsonc and
// must point at `dist` (relative to site/). `../dist` means output is at $root/dist/.
if (siteRoot) {
  const wranglerPath = has(siteRoot, 'wrangler.jsonc') ? siteAt('wrangler.jsonc') : siteAt('wrangler.json')
  const wrangler = read(siteRoot, 'wrangler.jsonc') || read(siteRoot, 'wrangler.json')
  if (wrangler) {
    const assetsDir = /"directory"\s*:\s*"([^"]+)"/.exec(wrangler)?.[1]
    if (assetsDir === undefined) {
      add('WARN', 'WEB-36', 'wrangler.jsonc present but no assets.directory found', std('§9'), wranglerPath)
    } else if (assetsDir === 'dist' || assetsDir === './dist') {
      add('PASS', 'WEB-36', `wrangler.jsonc assets.directory = "${assetsDir}" (correct — site/dist/)`, std('§9'), wranglerPath)
    } else if (assetsDir === '../dist') {
      add(
        'FAIL',
        'WEB-36',
        'wrangler.jsonc assets.directory = "../dist" (points to $root/dist/ — change to "dist")',
        std('§9'),
        wranglerPath
      )
    } else {
      add('WARN', 'WEB-36', `wrangler.jsonc assets.directory = "${assetsDir}" (unexpected value)`, std('§9'), wranglerPath)
    }
  }
}

// ── .ki-config.toml opt-in table ──────────────────────────────────────────────
add(
  kiWebsiteTable ? 'PASS' : 'WARN',
  'WEB-41',
  kiWebsiteTable
    ? `[${KI_SECTION}] table present in .ki-config.toml`
    : `no [${KI_SECTION}] table in .ki-config.toml (run --educate to scaffold it)`,
  std('§2'),
  '.ki-config.toml'
)
if (kiWebsiteTable) {
  // This table is a bare marker — validate-down: any key under it is a typo or a
  // stale option, never a recognised setting.
  for (const key of Object.keys(kiWebsiteTable)) {
    add(
      'WARN',
      'WEB-42',
      `unknown key under [${KI_SECTION}]: ${key} (validate-down — this table takes no keys today)`,
      std('§2'),
      '.ki-config.toml'
    )
  }
}

findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'website', target: repo, findings })
process.exit(checkerReporterExitCode(findings))
