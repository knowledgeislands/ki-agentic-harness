#!/usr/bin/env bun
/**
 * ki-decision-records EDUCATE — the mechanical half (ADR-KI-HARNESS-SKILLS-001 / -007). A thin
 * delegator: it execs the ki-bootstrap chain engine with this skill as an explicit
 * `--seed`, so running this file bootstraps ki-decision-records — plus everything it `implies:`
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

const SKILL = 'ki-decision-records'
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/educate.ts <target-repo> [options]

Educate a repository with ki-decision-records and its governance chain.

Options:
  --ref <ref>   Use a pinned harness revision.
  --dry-run     Report generated changes without writing them.
  -h, --help    Show this help and exit.
`)
  process.exit(0)
}

const engine = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'keystone',
  'ki-bootstrap',
  'scripts',
  'lib',
  'repo-bootstrap.ts'
)
execFileSync('bun', [engine, ...process.argv.slice(2), '--seed', SKILL], { stdio: 'inherit' })
