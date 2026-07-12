#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-website (Eleventy + Tailwind site-build) standard.
 *
 * This is an honest normalize-only conform: almost everything audit.ts flags is
 * template/layout/config authoring, which is judgment and can never be safely
 * guessed. Only two findings are unambiguous, reversible, canonical-value fixes,
 * so those are the whole of what this script writes. Everything else is surfaced
 * as a printed manual TODO — never mutated.
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # print the plan, mutate nothing
 *
 * Fixes (unambiguous + reversible only):
 *   - `.ki-config.toml` [ki-website] opt-in table (config `--init` finding): when
 *     the marker table is absent, APPENDS the canonical bare table — the exact
 *     block `audit.ts --init` emits. This table takes no per-repo keys, so the
 *     value is fully determined; no judgment is involved.
 *   - `.gitignore` dist entry (dist finding): ensures the build output is ignored.
 *     In the site/ workspace layout, a misplaced root `/dist` entry is rewritten to
 *     `/site/dist`; a missing entry is appended (`site/dist` for the site/ layout,
 *     `dist` for a flat layout). The correct value is derived from the detected
 *     layout, so it is not a guess.
 *
 * Deliberately NEVER touches (judgment → printed manual TODOs, mirroring audit.ts's
 * categories):
 *   - layout — moving a flat eleventy.config.* under site/, creating missing
 *     src/ subtrees (_data, _includes/layouts, _includes/partials, assets/css).
 *   - stack — adding/removing @11ty/eleventy, astro/next, tsx.
 *   - tailwind — deleting a stray tailwind.config.*, authoring main.css /
 *     tokens.css (@import "tailwindcss", ./tokens.css, @theme inline).
 *   - config — the eleventy.config.* patterns (portable-dist URL transform,
 *     addDataExtension('ts'/'json5'), the eleventy.before Tailwind hook,
 *     addWatchTarget).
 *   - seo — authoring the seo-meta partial.
 *   - scripts — the ki:site:* script family (build/dev/clean/dev:css/dev:serve).
 *   - dist — wrangler.jsonc assets.directory (owned by ki-website-cloudflare).
 *   - any stray/unknown key under [ki-website] (validate-down) — removal is the
 *     operator's call, never auto-deleted.
 *
 * Kept in lockstep with audit.ts (copied, not imported, per the composition-only
 * rule so the script stays valid standalone): CONFIG_NAMES, the site-root
 * detection, KI_SECTION / the canonical [ki-website] block, and the .gitignore
 * dist regexes.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error (target path missing); findings/fixes never fail the run.
 */

import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const CONFIG_NAMES = ['eleventy.config.ts', 'eleventy.config.js', 'eleventy.config.mjs', 'eleventy.config.cjs']
const KI_SECTION = 'ki-website'
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: presence of this table opts the repo into the
# Eleventy + Tailwind site-build standard. It takes no per-repo keys today.
[${KI_SECTION}]
`

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── entry ──
function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (!existsSync(target) || !statSync(target).isDirectory()) {
    console.error(paint(C.red, `target path not found (or not a directory): ${target}`))
    process.exit(1)
    return
  }

  const at = (...p: string[]) => join(target, ...p)
  const has = (...p: string[]) => existsSync(at(...p))
  const read = (...p: string[]): string => {
    try {
      return readFileSync(at(...p), 'utf8')
    } catch {
      return ''
    }
  }

  // ── locate the site root: flat (repo root) or site/ subfolder ──
  const flatCfg = CONFIG_NAMES.find((f) => has(f))
  const siteCfg = CONFIG_NAMES.find((f) => has('site', f))
  const siteRoot = flatCfg ? '' : siteCfg ? 'site' : ''
  const layoutKnown = Boolean(flatCfg || siteCfg)

  console.log(
    paint(
      C.dim,
      `target: ${target}   ${layoutKnown ? (siteRoot ? 'site/ subfolder layout' : 'flat layout') : 'layout undetermined'}${dryRun ? '   (dry run)' : ''}\n`
    )
  )

  const manualTodos: string[] = []

  // ── a) .ki-config.toml [ki-website] opt-in table ──
  console.log(paint(C.cyan, '.ki-config.toml [ki-website] table'))
  const kiPath = at('.ki-config.toml')
  const ki = read('.ki-config.toml')
  const kiTable = new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(ki)
  if (kiTable) {
    console.log(`  ${paint(C.dim, 'already present')}`)
    // validate-down: unknown keys are the operator's call, not auto-removed.
    const body = ki.split(new RegExp(`^\\[${KI_SECTION}\\]`, 'm'))[1]?.split(/^\[/m)[0] ?? ''
    for (const m of body.matchAll(/^\s*([A-Za-z0-9_-]+)\s*=/gm)) {
      manualTodos.push(`.ki-config.toml: unknown key under [${KI_SECTION}]: ${m[1]} — this table takes no keys today; remove by hand`)
    }
  } else {
    const newKi = ki ? `${ki.replace(/\n*$/, '\n')}\n${KI_DEFAULT}` : KI_DEFAULT
    console.log(`  ${paint(C.green, 'fix')}   append the canonical [${KI_SECTION}] opt-in table`)
    if (!dryRun) writeFileSync(kiPath, newKi)
  }

  // ── b) .gitignore dist entry ──
  console.log(`\n${paint(C.cyan, '.gitignore dist entry')}`)
  const gitignorePath = at('.gitignore')
  const gitignore = read('.gitignore')
  // In the site/ layout the correct entry ignores site/dist; a flat layout ignores dist.
  const distCorrect = siteRoot ? /^\s*\/?site\/dist\/?\s*$/m.test(gitignore) : /^\s*\/?dist\/?\s*$/m.test(gitignore)
  const distRootMisplaced = siteRoot !== '' && /^\s*\/dist\/?\s*$/m.test(gitignore)
  if (distCorrect) {
    console.log(`  ${paint(C.dim, 'already correct')}`)
  } else if (!layoutKnown) {
    // No eleventy.config.* — the layout is undetermined, so the correct entry is
    // not derivable. Defer rather than guess.
    manualTodos.push('.gitignore: no eleventy.config.* found — cannot derive the correct dist ignore; add it once the site layout exists')
    console.log(`  ${paint(C.dim, 'layout undetermined — deferred')}`)
  } else if (distRootMisplaced) {
    // site/ layout but the ignore points at root /dist — rewrite to /site/dist.
    const newGi = gitignore.replace(/^(\s*)\/dist(\/?)(\s*)$/m, '$1/site/dist$2$3')
    console.log(`  ${paint(C.green, 'fix')}   rewrite misplaced /dist → /site/dist (site/ layout)`)
    if (!dryRun) writeFileSync(gitignorePath, newGi)
  } else {
    const entry = siteRoot ? 'site/dist' : 'dist'
    const newGi = gitignore ? `${gitignore.replace(/\n*$/, '\n')}${entry}\n` : `${entry}\n`
    console.log(`  ${paint(C.green, 'fix')}   append '${entry}' (build output should not be committed)`)
    if (!dryRun) writeFileSync(gitignorePath, newGi)
  }

  // ── judgment items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none from the auto-fixable set')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(
    `  - Everything else audit.ts flags is authoring/config judgment and is never auto-fixed: layout (move flat eleventy.config.* under site/, create missing src/ subtrees), stack (@11ty/eleventy, drop astro/next/tsx), tailwind (remove stray tailwind.config.*, author main.css/tokens.css), config (portable-dist transform, addDataExtension, eleventy.before Tailwind hook, addWatchTarget), seo (seo-meta partial), scripts (ki:site:* family), and wrangler assets.directory (ki-website-cloudflare).`
  )
  console.log(
    `\n${paint(C.dim, 'mechanical layer applied — re-run `bun scripts/audit.ts .` (or `ki:website:audit`) to confirm findings clear.')}`
  )
}

main()
