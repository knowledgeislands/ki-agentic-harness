#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-website (Eleventy + Tailwind site-build) standard.
 *
 * This is an honest normalize-only conform: almost everything audit.ts flags is
 * template/layout/config authoring, which is judgment and can never be safely
 * guessed. Only two findings are unambiguous, reversible, canonical-value fixes,
 * so those are the whole of what this script writes. Everything else is surfaced
 * as an ADVISORY manual TODO — never mutated.
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # print the plan, mutate nothing
 *
 * Fixes (unambiguous + reversible only):
 *   - `.ki-config.toml` [ki-website] opt-in table (WEB-41): when the marker table
 *     is absent, APPENDS the canonical bare table — the exact block `audit.ts
 *     --educate` emits. This table takes no per-repo keys, so the value is fully
 *     determined; no judgment is involved.
 *   - `.gitignore` dist entry (WEB-33): ensures the build output is ignored. In the
 *     site/ workspace layout, a misplaced root `/dist` entry is rewritten to
 *     `/site/dist`; a missing entry is appended (`site/dist` for the site/ layout,
 *     `dist` for a flat layout). The correct value is derived from the detected
 *     layout, so it is not a guess.
 *
 * Deliberately NEVER touches (judgment → ADVISORY manual TODOs, mirroring audit.ts's
 * categories): layout (WEB-6/WEB-9), stack (WEB-1/2/3), tailwind (WEB-18/19/20),
 * config (WEB-12/13/14/15/16), seo (WEB-26), scripts (WEB-30/31/32), wrangler
 * assets.directory (WEB-36, owned by ki-website-cloudflare), and any stray key under
 * [ki-website] (WEB-42 validate-down) — removal is the operator's call.
 *
 * It emits the canonical checker-reporter JSONL: each action becomes a typed finding on
 * the shared ladder (file written/overwritten/fixed → POLISH, already-canonical → PASS).
 * `--dry-run` alone governs writing.
 *
 * Kept in lockstep with audit.ts (copied, not imported, per the composition-only
 * rule so the script stays valid standalone): CONFIG_NAMES, the site-root
 * detection, KI_SECTION / the canonical [ki-website] block, the rubric codes, and
 * the .gitignore dist regexes.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error (target path missing); findings/fixes never fail the run.
 */

import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// ── kept in lockstep with audit.ts ──
const CONFIG_NAMES = ['eleventy.config.ts', 'eleventy.config.js', 'eleventy.config.mjs', 'eleventy.config.cjs']
const KI_SECTION = 'ki-website'
const KI_DEFAULT = `# ${KI_SECTION} — opt-in marker: presence of this table opts the repo into the
# Eleventy + Tailwind site-build standard. It takes no per-repo keys today.
[${KI_SECTION}]
`
const STD = 'references/standards.md'
const RUBRIC = 'references/rubric.md'
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')

const findings: CheckerFinding[] = []
const rec = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')

// ── entry ──
function main() {
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  if (!existsSync(target) || !statSync(target).isDirectory()) {
    rec('FAIL', 'WEB-6', `target path is not a directory: ${target}`, `${STD} §2`)
    emitCheckerReporter({ mode: 'conform', concern: 'website', target, findings })
    process.exit(checkerReporterExitCode(findings))
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

  // ── a) .ki-config.toml [ki-website] opt-in table (WEB-41) ──
  const kiPath = at('.ki-config.toml')
  const ki = read('.ki-config.toml')
  const kiTable = new RegExp(`^\\[${KI_SECTION}\\]`, 'm').test(ki)
  if (kiTable) {
    rec('PASS', 'WEB-41', `[${KI_SECTION}] table already present`, `${STD} §2`, '.ki-config.toml')
    // validate-down (WEB-42): unknown keys are the operator's call, not auto-removed.
    const body = ki.split(new RegExp(`^\\[${KI_SECTION}\\]`, 'm'))[1]?.split(/^\[/m)[0] ?? ''
    for (const m of body.matchAll(/^\s*([A-Za-z0-9_-]+)\s*=/gm)) {
      rec(
        'ADVISORY',
        'WEB-42',
        `unknown key under [${KI_SECTION}]: ${m[1]} — this table takes no keys today; remove by hand`,
        `${STD} §2`,
        '.ki-config.toml'
      )
    }
  } else {
    const newKi = ki ? `${ki.replace(/\n*$/, '\n')}\n${KI_DEFAULT}` : KI_DEFAULT
    rec('POLISH', 'WEB-41', `appended the canonical [${KI_SECTION}] opt-in table`, `${STD} §2`, '.ki-config.toml')
    if (!dryRun) writeFileSync(kiPath, newKi)
  }

  // ── b) .gitignore dist entry (WEB-33) ──
  const gitignorePath = at('.gitignore')
  const gitignore = read('.gitignore')
  // In the site/ layout the correct entry ignores site/dist; a flat layout ignores dist.
  const distCorrect = siteRoot ? /^\s*\/?site\/dist\/?\s*$/m.test(gitignore) : /^\s*\/?dist\/?\s*$/m.test(gitignore)
  const distRootMisplaced = siteRoot !== '' && /^\s*\/dist\/?\s*$/m.test(gitignore)
  if (distCorrect) {
    rec('PASS', 'WEB-33', `${siteRoot ? 'site/dist/' : 'dist/'} already correctly gitignored`, `${STD} §9`, '.gitignore')
  } else if (!layoutKnown) {
    // No eleventy.config.* — the layout is undetermined, so the correct entry is
    // not derivable. Defer rather than guess.
    rec(
      'ADVISORY',
      'WEB-33',
      'no eleventy.config.* found — cannot derive the correct dist ignore; add it once the site layout exists',
      `${STD} §9`,
      '.gitignore'
    )
  } else if (distRootMisplaced) {
    // site/ layout but the ignore points at root /dist — rewrite to /site/dist.
    const newGi = gitignore.replace(/^(\s*)\/dist(\/?)(\s*)$/m, '$1/site/dist$2$3')
    rec('POLISH', 'WEB-33', 'rewrote misplaced /dist → /site/dist (site/ layout)', `${STD} §9`, '.gitignore')
    if (!dryRun) writeFileSync(gitignorePath, newGi)
  } else {
    const entry = siteRoot ? 'site/dist' : 'dist'
    const newGi = gitignore ? `${gitignore.replace(/\n*$/, '\n')}${entry}\n` : `${entry}\n`
    rec('POLISH', 'WEB-33', `appended '${entry}' (build output should not be committed)`, `${STD} §9`, '.gitignore')
    if (!dryRun) writeFileSync(gitignorePath, newGi)
  }

  findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'website', target, findings })
  process.exitCode = checkerReporterExitCode(findings)
}

main()
