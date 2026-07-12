#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-homebrew-tap standard — an honest normalize-only
 * conform. This skill WRAPS Homebrew's external standard rather than inventing a
 * house one, so almost every divergence a tap can carry is either authoring
 * (write a `desc`/`url`/`sha256`, add a README row) or is delegated to `brew`
 * (`brew style`/`brew audit --strict`). Neither is a safe, reversible string
 * rewrite. The ONE unambiguous fix this script makes is the config marker:
 *
 *   - CONFIG — when `.ki-config.toml` exists but carries no `[ki-homebrew-tap]`
 *     table, APPEND the keyless opt-in marker block (the same block
 *     `audit.ts --init` prints). Existing content is never rewritten.
 *
 * Everything else audit.ts flags is surfaced as a printed manual TODO, never
 * guessed:
 *   - TAP-FIELDS (missing `desc`/`homepage`/`url`/`sha256`/`license`/`def install`/
 *     `test do`), TAP-CLASS, TAP-DESC-STYLE (shorten / de-article — recapitalising
 *     is judgment), TAP-URL-VERSIONED (repoint at a tagged tarball + recompute
 *     `sha256`), TAP-README (author the formulae-table row) — all authoring.
 *   - TAP-BREW — delegated to `brew` itself; run `brew style` / `brew audit
 *     --strict` locally and fix by hand. Never scripted here.
 *   - `.ki-config.toml` missing entirely — authoring the repo's config is
 *     `ki-repo`'s job, not a mechanical fill-in.
 *
 * Scope: a single target tap (default cwd), matching the house conform shape.
 * The Formula-dir constant, config constants/marker, the per-formula field/desc/
 * url regexes, and the `[ki-homebrew-tap]` parser are COPIED from audit.ts (same
 * source of truth, kept in lockstep rather than imported so each script stays
 * valid standalone per the composition-only rule).
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # print the plan, mutate nothing
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error (no `Formula/` — the target is not a tap); findings and
 * fixes never fail the run.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// ── kept in lockstep with audit.ts ──
const FORMULA_DIR = 'Formula'
const README = 'README.md'
const KI_CONFIG = '.ki-config.toml'
const KI_SECTION = 'ki-homebrew-tap'

// The default marker block: a keyless opt-in table. Presence is the whole config.
const KI_DEFAULT = `# Opt this repo into the ki-homebrew-tap standard (a Knowledge Islands Homebrew tap).
# Keyless marker: presence is the whole config. The tap shape is fixed by Homebrew
# (Formula/*.rb, formulae named for the tools they install), so there is nothing to tune.
[${KI_SECTION}]
`

// Per-formula field probes — mirror audit.ts's TAP-FIELDS array.
const FIELD_PROBES: Array<[string, RegExp]> = [
  ['desc', /^\s*desc\s+"/m],
  ['homepage', /^\s*homepage\s+"/m],
  ['url', /^\s*url\s+"/m],
  ['sha256', /^\s*sha256\s+"/m],
  ['license', /^\s*license\s+/m],
  ['install method', /^\s*def\s+install\b/m],
  ['test do', /^\s*test\s+do\b/m]
]
const CLASS_RE = /^\s*class\s+[A-Z][A-Za-z0-9]*\s+<\s+Formula\b/m
const DESC_RE = /^\s*desc\s+"([^"]*)"/m
const URL_RE = /^\s*url\s+"([^"]*)"/m
const VERSIONED_URL_RE = /\/archive\/refs\/tags\/|\/releases\/download\//

// True when `.ki-config.toml` carries a `[ki-homebrew-tap]` table (comment-stripped,
// like audit.ts's parseKiTap) — presence is the whole opt-in.
function hasKiTap(text: string): boolean {
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (line === '') continue
    const header = line.match(/^\[(.+)\]$/)
    if (header && (header[1] as string).trim() === KI_SECTION) return true
  }
  return false
}

const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

async function isDir(p: string): Promise<boolean> {
  try {
    return (await stat(p)).isDirectory()
  } catch {
    return false
  }
}

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  const formulaDir = join(target, FORMULA_DIR)
  if (!(await isDir(formulaDir))) {
    console.error(paint(C.red, `no ${FORMULA_DIR}/ directory at ${target} — not a Homebrew tap; nothing to conform`))
    process.exit(1)
    return
  }

  console.log(paint(C.dim, `target: ${target}${dryRun ? '   (dry run)' : ''}\n`))

  const formulae = (await readdir(formulaDir)).filter((n) => n.endsWith('.rb')).sort()
  const manualTodos: string[] = []

  // README, read once for the TAP-README manual TODOs.
  const readmePath = join(target, README)
  let readme: string | null = null
  try {
    readme = await readFile(readmePath, 'utf8')
  } catch {
    manualTodos.push(`${README}: absent — author a formulae table so each formula is discoverable (TAP-README)`)
  }

  // ── a) config marker — the one mechanical, reversible fix ──
  console.log(paint(C.cyan, `config marker ([${KI_SECTION}] in ${KI_CONFIG})`))
  const configPath = join(target, KI_CONFIG)
  let configText: string | null = null
  try {
    configText = await readFile(configPath, 'utf8')
  } catch {
    configText = null
  }
  let configFixes = 0
  if (configText === null) {
    manualTodos.push(`${KI_CONFIG}: absent — author the repo config (that is ki-repo's job), then re-run to add the marker`)
    console.log(`  ${paint(C.dim, `no ${KI_CONFIG} — see manual TODOs`)}`)
  } else if (hasKiTap(configText)) {
    console.log(`  ${paint(C.dim, 'nothing to fix')}`)
  } else {
    const newText = `${configText.replace(/\n*$/, '\n')}\n${KI_DEFAULT}`
    console.log(`  ${paint(C.green, 'fix')}   ${KI_CONFIG} — append the keyless [${KI_SECTION}] marker`)
    if (!dryRun) await writeFile(configPath, newText)
    configFixes++
  }

  // ── b) formula-shape divergences — authoring / brew-delegated → manual TODOs ──
  console.log(`\n${paint(C.cyan, 'formula shape (authoring / brew — not scripted)')}`)
  for (const file of formulae) {
    const where = `${FORMULA_DIR}/${file}`
    const text = await readFile(join(formulaDir, file), 'utf8')
    const name = file.replace(/\.rb$/, '')

    if (!CLASS_RE.test(text)) manualTodos.push(`${where}: no \`class <Camel> < Formula\` declaration (TAP-CLASS) — author by hand`)
    for (const [label, re] of FIELD_PROBES)
      if (!re.test(text)) manualTodos.push(`${where}: missing \`${label}\` (TAP-FIELDS) — author by hand`)

    const descM = text.match(DESC_RE)
    if (descM) {
      const desc = descM[1] as string
      if (desc.length > 80) manualTodos.push(`${where}: \`desc\` is ${desc.length} chars (TAP-DESC-STYLE, ≤ 80) — shorten by hand`)
      if (/^(A|An|The)\s/.test(desc))
        manualTodos.push(`${where}: \`desc\` starts with an article (TAP-DESC-STYLE) — de-article + recapitalise by hand`)
    }

    const urlM = text.match(URL_RE)
    if (urlM && !VERSIONED_URL_RE.test(urlM[1] as string))
      manualTodos.push(`${where}: \`url\` is not a tagged-release tarball (TAP-URL-VERSIONED) — repoint + recompute sha256 by hand`)

    if (readme !== null && !readme.includes(name))
      manualTodos.push(`${where}: formula "${name}" not in ${README} (TAP-README) — add its formulae-table row by hand`)
  }

  // ── judgment / delegated items — never guessed, always surfaced ──
  console.log(`\n${paint(C.cyan, 'manual TODOs (judgment / brew-delegated — not scripted)')}`)
  if (manualTodos.length === 0) {
    console.log(`  ${paint(C.dim, 'none')}`)
  } else {
    for (const todo of manualTodos) console.log(`  - ${todo}`)
  }
  console.log(
    `  - TAP-BREW: run \`brew style\` + \`brew audit --strict\` per formula locally and fix by hand — Homebrew's audit is delegated, never scripted here.`
  )
  console.log(
    `\n${paint(C.dim, `${configFixes} mechanical fix(es) applied${dryRun ? ' (dry run — nothing written)' : ''} — re-run \`bun scripts/audit.ts\` (or \`ki:homebrew-tap:audit\`) to confirm findings clear.`)}`
  )
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
