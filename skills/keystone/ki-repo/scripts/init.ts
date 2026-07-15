#!/usr/bin/env bun
/**
 * ki-repo INIT — the mechanical half (ADR-KI-HARNESS-SKILLS-001 / -007). A thin
 * delegator: it execs the ki-bootstrap chain engine with this skill as an explicit
 * `--seed`, so running this file bootstraps ki-repo — plus everything it `implies:`
 * — into the target repo, satisfying the self-sufficiency contract
 * (vendored script copies + HELP snapshots + the four `.ki-meta/bin/` wrappers;
 * no `package.json` — that is ki-engineering's). Delegating by subprocess is
 * composition — running a sibling in sequence — not a cross-skill import, so the
 * skill stays valid standalone (ADR-KI-HARNESS-SKILLS-004).
 *
 *   bun scripts/init.ts <target-repo> [--ref <ref>] [--dry-run]
 *   bun scripts/init.ts <target-repo> --scaffold-config-only [--dry-run]
 *
 * Remote transport (documented follow-on, per ki-bootstrap's engine): the same run
 * reached from a raw GitHub URL, pinned to a ref.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL = 'ki-repo'
const KI_CONFIG = '.ki-config.toml'
const KI_REPO_DEFAULT = `[ki-repo]
visibility = "private"   # "public" | "private" — must match the repo's actual GitHub visibility
license = "MIT"          # SPDX id the LICENSE, package.json, and GitHub must match; default MIT. Use "UNLICENSED" for proprietary. Pick one at https://choosealicense.com/

# Per-repo check overrides — true = enforce, false = don't. Omit any check to take
# the org default; a repo that fully conforms needs nothing here.
# [ki-repo.checks]
# branch-protection = true   # default off — protect \`main\` on this repo
# wiki = false               # default on  — allow this repo's Wiki
`
const KI_AUTHORING_DEFAULT = `# The authoring standard (Markdown/TOML house style) is baseline — every KI repo is
# governed by it. Declared explicitly, not assumed; its presence is the compliance marker.
[ki-authoring]
`

const declaresRootTable = (text: string, table: string): boolean =>
  text.split(/\r?\n/).some((raw) => raw.replace(/#.*$/, '').trim() === `[${table}]`)

function appendMissingConfig(target: string, dryRun: boolean): void {
  const path = join(target, KI_CONFIG)
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : ''
  const blocks = [
    !declaresRootTable(existing, SKILL) ? KI_REPO_DEFAULT : '',
    !declaresRootTable(existing, 'ki-authoring') ? KI_AUTHORING_DEFAULT : ''
  ].filter(Boolean)
  if (blocks.length === 0) {
    console.log(`${KI_CONFIG}: required root markers already present`)
    return
  }
  const separator = existing.length === 0 ? '' : existing.endsWith('\n\n') ? '' : existing.endsWith('\n') ? '\n' : '\n\n'
  const next = `${existing}${separator}${blocks.join('\n')}`
  const labels = blocks.map((block) => (block === KI_REPO_DEFAULT ? '[ki-repo]' : '[ki-authoring]')).join(', ')
  console.log(`${dryRun ? 'would append' : 'appended'} ${KI_CONFIG}: ${labels}`)
  if (!dryRun) writeFileSync(path, next)
}

const argv = process.argv.slice(2)
if (argv.includes('--scaffold-config-only')) {
  const target = resolve(argv.find((arg) => !arg.startsWith('-')) ?? '.')
  appendMissingConfig(target, argv.includes('--dry-run'))
  process.exit(0)
}

const engine = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'ki-bootstrap', 'scripts', 'bootstrap.ts')
execFileSync('bun', [engine, ...argv, '--seed', SKILL], { stdio: 'inherit' })
