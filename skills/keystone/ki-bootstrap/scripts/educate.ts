#!/usr/bin/env bun
import { educateRepository } from './internal/repo-bootstrap/repo-bootstrap.ts'

const argv = process.argv.slice(2)

if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/educate.ts [target-repo] [--ref <ref>] [--dry-run] [--verbose]

Rebuild the repository's complete governed skill set, aggregate runners,
manifest, and runtime payloads from this ki-bootstrap source.

Options:
  --ref <ref>  Record the harness revision being applied.
  --dry-run    Report the complete bootstrap plan without writing it.
  --verbose    Report per-payload activity.
  -h, --help   Show this help and exit.
`)
  process.exit(0)
}

educateRepository(argv)
