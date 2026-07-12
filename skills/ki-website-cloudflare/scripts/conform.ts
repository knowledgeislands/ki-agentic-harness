#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-website-cloudflare hosting standard.
 *
 * This is an honest normalize-only conform: almost everything the auditor
 * (audit.ts) flags is a JUDGMENT call — the site name, the pinned
 * compatibility_date, where dist/ actually lives, which custom domains the site
 * answers on, whether a Pages deploy should migrate — none of which a script may
 * guess. So this fixer touches only the handful of findings that are unambiguous
 * and reversible, and PRINTS everything else as a manual TODO drawn from the
 * audit's own categories.
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # print the plan, mutate nothing
 *
 * Target detection (wrangler-config collection, the assets/main split, the
 * ki-config opt-in table, the deploy/preview script keys) is COPIED from
 * audit.ts, never imported — the composition-only rule keeps each script valid
 * standalone. Kept in lockstep with audit.ts (same source of truth).
 *
 * Fixes (unambiguous + reversible only):
 *   - .gitignore: append `dist/` and/or `.wrangler/` when missing (§2/§4 seam).
 *   - package.json: add a missing site deploy script key — value DERIVED from the
 *     discovered site-config directory (`bunx wrangler deploy`, prefixed
 *     `cd <dir> && …` for a subfolder layout), never invented.
 *   - wrangler.jsonc/.json: insert the canonical `observability: { enabled: true }`
 *     field when absent (§3 — always-true, house-canonical).
 *
 * Deliberately NEVER touches (judgment → manual TODOs):
 *   - The site `name`, the `compatibility_date` value, `assets.directory` — all
 *     site-specific values a script cannot know (§3/§2).
 *   - `routes` / `custom_domain` — the site's real domains (§3).
 *   - A `wrangler pages deploy` migration — a model change, not a field edit (§1).
 *   - The `ki:site:preview` / `ki:site:clean` scripts — preview chains
 *     `ki-website`'s build (a cross-skill reference), clean's exact rm form is a
 *     style call (§4).
 *   - Authoring a whole wrangler config, or the [ki-website-cloudflare] opt-in
 *     table, from scratch — opting a repo into the hosting standard is a decision.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error; findings/fixes never fail the run.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const KI_SECTION = 'ki-website-cloudflare'
const WRANGLER_NAMES = ['wrangler.jsonc', 'wrangler.json', 'wrangler.toml']
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.wrangler']
const hasAssets = (t: string) => /"assets"\s*:/.test(t) || /\[assets\]|assets\s*=/.test(t)
const hasMain = (t: string) => /"main"\s*:/.test(t) || /^\s*main\s*=/m.test(t)
const hasObservability = (t: string) =>
  /"observability"\s*:\s*\{[\s\S]*?"enabled"\s*:\s*true/.test(t) || /\[observability\][\s\S]*?enabled\s*=\s*true/.test(t)

type Cfg = { rel: string; text: string }

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

async function tryRead(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return null
  }
}

// ── collect wrangler configs: repo root + one level of subdirs (copied from audit.ts) ──
async function collectConfigs(target: string): Promise<Cfg[]> {
  const configs: Cfg[] = []
  const collectFrom = async (subdir: string) => {
    for (const n of WRANGLER_NAMES) {
      const rel = subdir ? join(subdir, n) : n
      const text = await tryRead(join(target, rel))
      if (text !== null) configs.push({ rel, text })
    }
  }
  await collectFrom('')
  let dirents: import('node:fs').Dirent[] = []
  try {
    dirents = await readdir(target, { withFileTypes: true })
  } catch {
    dirents = []
  }
  for (const e of dirents) {
    if (!e.isDirectory() || SKIP_DIRS.includes(e.name)) continue
    await collectFrom(e.name)
  }
  return configs
}

// Insert the canonical observability field before the outermost closing brace.
// Returns the new text, or null if it could not be placed safely.
function addObservability(text: string): string | null {
  if (hasObservability(text)) return null
  const lastBrace = text.lastIndexOf('}')
  if (lastBrace === -1) return null
  const head = text.slice(0, lastBrace).replace(/\s*$/, '')
  const tail = text.slice(lastBrace)
  if (!head) return null
  const needComma = !head.endsWith('{') && !head.endsWith(',')
  const insertion = `${needComma ? ',' : ''}\n  // Persist Workers logs in the dashboard (Workers & Pages → <name> → Logs).\n  "observability": { "enabled": true }\n`
  return head + insertion + tail
}

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  try {
    await stat(target)
  } catch {
    console.error(paint(C.red, `target path not found: ${target}`))
    process.exit(1)
    return
  }

  const configs = await collectConfigs(target)
  const ki = (await tryRead(join(target, '.ki-config.toml'))) ?? ''
  const kiTable = new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(ki)

  console.log(paint(C.dim, `target: ${target}${dryRun ? '   (dry run)' : ''}\n`))

  // ── not-hosted short-circuit (mirrors audit.ts) ──
  if (!configs.length && !kiTable) {
    console.log(
      paint(C.yellow, 'no wrangler config and no [ki-website-cloudflare] table — repo is not Cloudflare-hosted; nothing to conform')
    )
    process.exit(0)
    return
  }

  const siteCfgs = configs.filter((c) => hasAssets(c.text))
  const companions = configs.filter((c) => !hasAssets(c.text) && hasMain(c.text))
  const site = siteCfgs[0]

  const manualTodos: string[] = []

  // ── a) wrangler config: canonical observability field ──
  console.log(paint(C.cyan, 'wrangler config (observability)'))
  if (!site) {
    console.log(`  ${paint(C.dim, 'no site Worker config (assets block) found — see manual TODOs')}`)
    manualTodos.push(
      '§1 — no site wrangler config with an "assets" block; author one by hand (name, compatibility_date, assets.directory, routes)'
    )
  } else if (!/\.jsonc?$/.test(site.rel)) {
    console.log(`  ${paint(C.dim, `site config ${site.rel} is TOML — observability edit left to a human`)}`)
    if (!hasObservability(site.text)) manualTodos.push(`${site.rel}: §3 — add observability.enabled = true by hand (TOML config)`)
  } else if (hasObservability(site.text)) {
    console.log(`  ${paint(C.dim, 'observability already enabled')}`)
  } else {
    const updated = addObservability(site.text)
    if (updated === null) {
      manualTodos.push(`${site.rel}: §3 — add "observability": { "enabled": true } by hand (could not place it safely)`)
      console.log(`  ${paint(C.yellow, 'skip')}  ${site.rel} — could not place observability field safely; see TODO`)
    } else {
      console.log(`  ${paint(C.green, 'fix')}   ${site.rel} — add observability.enabled = true`)
      if (!dryRun) await writeFile(join(target, site.rel), updated)
    }
  }

  // ── b) .gitignore: dist/ + .wrangler/ ──
  console.log(`\n${paint(C.cyan, '.gitignore seam')}`)
  const gitignorePath = join(target, '.gitignore')
  const gitignore = (await tryRead(gitignorePath)) ?? ''
  const distIgnored = /^\s*\/?dist\/?\s*$/m.test(gitignore)
  const wranglerIgnored = /\.wrangler/.test(gitignore)
  const toAppend: string[] = []
  if (!distIgnored) toAppend.push('dist/')
  if (!wranglerIgnored) toAppend.push('.wrangler/')
  if (toAppend.length === 0) {
    console.log(`  ${paint(C.dim, 'dist/ and .wrangler/ already ignored')}`)
  } else {
    for (const entry of toAppend) console.log(`  ${paint(C.green, 'append')} .gitignore — ${entry}`)
    if (!dryRun) {
      const base = gitignore === '' ? '' : gitignore.replace(/\n*$/, '\n')
      await writeFile(gitignorePath, `${base}${toAppend.join('\n')}\n`)
    }
  }

  // ── c) package.json: derived site deploy script ──
  console.log(`\n${paint(C.cyan, 'package.json deploy script')}`)
  const pkgRaw = await tryRead(join(target, 'package.json'))
  let pkg: { scripts?: Record<string, string> } | null = null
  try {
    pkg = pkgRaw ? (JSON.parse(pkgRaw) as { scripts?: Record<string, string> }) : null
  } catch {
    pkg = null
  }
  if (!pkgRaw || pkg === null) {
    console.log(`  ${paint(C.dim, 'no parseable package.json — deploy script left to a human')}`)
  } else {
    const scripts = pkg.scripts ?? {}
    const deployKey = scripts['ki:site:deploy'] ? 'ki:site:deploy' : scripts.deploy ? 'deploy' : ''
    const deployOk = deployKey !== '' && /wrangler\s+deploy/.test(scripts[deployKey] ?? '')
    if (deployOk) {
      console.log(`  ${paint(C.dim, `deploy script already present: ${deployKey}`)}`)
    } else if (deployKey !== '') {
      // a key exists but does not run wrangler deploy — never silently rewrite it
      manualTodos.push(`package.json: §4 — script "${deployKey}" exists but does not run \`wrangler deploy\`; fix it by hand`)
      console.log(`  ${paint(C.yellow, 'skip')}  "${deployKey}" present but not \`wrangler deploy\` — see TODO`)
    } else if (!site) {
      manualTodos.push('package.json: §4 — add a deploy script running `wrangler deploy` (needs a site config first)')
      console.log(`  ${paint(C.dim, 'no site config to derive a deploy script from — see TODO')}`)
    } else {
      // Derive from the discovered site-config directory.
      const siteDir = dirname(site.rel)
      const flat = siteDir === '.' || siteDir === ''
      const key = flat ? 'deploy' : 'ki:site:deploy'
      const value = flat ? 'bunx wrangler deploy' : `cd ${siteDir} && bunx wrangler deploy`
      console.log(`  ${paint(C.green, 'add')}    package.json scripts["${key}"] = "${value}"`)
      if (!dryRun) {
        const nextScripts = { ...scripts, [key]: value }
        const nextPkg = { ...pkg, scripts: nextScripts }
        // Preserve trailing newline convention.
        await writeFile(join(target, 'package.json'), `${JSON.stringify(nextPkg, null, 2)}\n`)
      }
    }
  }

  // ── companions: noted, never touched ──
  if (companions.length) {
    console.log(`\n${paint(C.cyan, 'boundaries')}`)
    console.log(
      `  ${paint(C.dim, `companion Worker(s) left untouched (route to cloudflare/wrangler): ${companions.map((c) => c.rel).join(', ')}`)}`
    )
  }

  // ── judgment items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none from this run')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(
    `  - Site-specific values audit.ts flags — name, compatibility_date, assets.directory, custom_domain routes — are judgment; set them by hand.`
  )
  console.log(
    '  - A `wrangler pages deploy` (§1), the ki:site:preview/clean scripts (§4), and the [ki-website-cloudflare] opt-in table are never auto-authored.'
  )

  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts` (or `ki:website-cloudflare:audit`) to confirm findings clear.')}`
  )
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
