#!/usr/bin/env bun
import { relative, resolve } from 'node:path'
import { educateSkill } from './vendored/ki-bootstrap/educator.ts'

const SKILL = 'ki-skills'
const argv = process.argv.slice(2)

if (argv.includes('-h') || argv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/educate.ts [target-repo] [--dry-run] [--verbose]

Refresh only ki-skills under the target repository's .ki-meta/checkers and
.ki-meta/educators directories. Aggregate runners remain owned by ki-bootstrap.

Options:
  --dry-run   Report the planned payload without writing it.
  --verbose   List each copied payload unit.
  -h, --help  Show this help and exit.
`)
  process.exit(0)
}

let targetArgument: string | undefined
let dryRun = false
let verbose = false
for (const argument of argv) {
  if (argument === '--dry-run') dryRun = true
  else if (argument === '--verbose') verbose = true
  else if (argument.startsWith('-')) throw new Error(`unsupported option: ${argument}`)
  else if (targetArgument) throw new Error(`unexpected argument: ${argument}`)
  else targetArgument = argument
}

const plan = educateSkill({
  skill: SKILL,
  source: resolve(import.meta.dirname, '..'),
  target: resolve(targetArgument ?? '.'),
  dryRun
})

if (verbose) {
  for (const unit of plan.units) process.stdout.write(`${dryRun ? 'would copy' : 'copied'} ${relative(plan.target, unit.destination)}\n`)
}
process.stdout.write(`${dryRun ? 'EDUCATE dry run' : 'EDUCATE complete'} — ${SKILL}\n`)
