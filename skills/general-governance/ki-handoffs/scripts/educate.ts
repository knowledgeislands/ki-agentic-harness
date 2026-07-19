#!/usr/bin/env bun
/**
 * ki-handoffs EDUCATE — the mechanical half (ADR-KI-HARNESS-SKILLS-001 / -007). A thin
 * delegator: it execs the ki-bootstrap chain engine with this skill as an explicit
 * `--seed`, so running this file bootstraps ki-handoffs — plus everything it `implies:`
 * and the baseline — into the target repo, satisfying the self-sufficiency contract
 * (vendored script copies + HELP snapshots + the four `.ki-meta/bin/` wrappers;
 * no `package.json` — that is ki-engineering's). Delegating by subprocess is
 * composition — running a sibling in sequence — not a cross-skill import, so the
 * skill stays valid standalone (ADR-KI-HARNESS-SKILLS-004).
 *
 *   bun scripts/educate.ts <target-repo> [--ref <ref>] [--dry-run]
 *
 * Remote transport (documented follow-on, per ki-bootstrap's engine): the same run
 * reached from a raw GitHub URL, pinned to a ref.
 */
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL = 'ki-handoffs'
const engine = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'ki-bootstrap', 'scripts', 'lib', 'repo-bootstrap.ts')
const arguments_ = process.argv.slice(2)

if (arguments_.some((argument) => argument === '-h' || argument === '--help')) {
  process.stdout.write(`Usage: bun scripts/educate.ts [target-repo] [options]

Bootstrap ki-handoffs and its declared governance dependencies into a repository.

Options:
  --ref <ref>    Resolve harness sources at a specific Git ref.
  --dry-run      Report changes without writing them.
  -h, --help     Show this help and exit.
`)
  process.exit(0)
}

execFileSync('bun', [engine, ...arguments_, '--seed', SKILL], { stdio: 'inherit' })
