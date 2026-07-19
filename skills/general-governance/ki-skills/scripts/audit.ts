#!/usr/bin/env bun
// Audit Agent Skills against the mechanical half of the codified ki-skills rubric.
//
// Usage:
//   bun scripts/audit.ts [path ...]
//   bun scripts/audit.ts <skill> --footprint
//   bun scripts/audit.ts skills --refresh-status

import { resolve } from 'node:path'
import { type CheckerEvaluationSubject, checkerJsonl, runChecker } from './lib/checker.ts'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/items/index.ts'

const rawArgv = process.argv.slice(2)
if (rawArgv.includes('-h') || rawArgv.includes('--help')) {
  process.stdout.write(`Usage: bun scripts/audit.ts [target ...] [options]

Audit Agent Skills against the mechanical aspects of the ki-skills rubric.

Options:
  --footprint       Include the optional token-footprint measurements.
  --refresh-status  Report source-refresh status.
  -h, --help        Show this help and exit.
`)
  process.exit(0)
}
const roots = rawArgv.filter((argument) => !argument.startsWith('-'))
const reportTarget = resolve('.')
const scope = createKiSkillsSubjects({
  mode: 'audit',
  roots,
  reportTarget,
  footprint: rawArgv.includes('--footprint'),
  refreshStatus: rawArgv.includes('--refresh-status')
})
const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
  familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
  context,
  ...(subject ? { subject } : {})
}))

const result = runChecker({
  mode: 'audit',
  concern: 'skills',
  target: reportTarget,
  rubric: KI_SKILLS_RUBRIC,
  subjects
})

process.stdout.write(checkerJsonl(result.records))
process.exit(result.exitCode)
