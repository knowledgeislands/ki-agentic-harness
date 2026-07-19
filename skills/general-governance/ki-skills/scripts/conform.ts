#!/usr/bin/env bun
/** Mechanical CONFORM entry point for the structured ki-skills rubric. */

import { resolve } from 'node:path'
import { type CheckerEvaluationSubject, checkerJsonl, runChecker } from './lib/checker.ts'
import type { KiSkillsRubricContext } from './rubric/contexts/contexts.ts'
import { createKiSkillsSubjects } from './rubric/contexts/subjects.ts'
import { KI_SKILLS_RUBRIC, KI_SKILLS_SUBJECT_FAMILIES } from './rubric/items/index.ts'

const argv = process.argv.slice(2)
const target = argv.find((argument) => !argument.startsWith('-')) ?? '.'
const reportTarget = resolve(target)
const scope = createKiSkillsSubjects({
  mode: 'conform',
  roots: [target],
  reportTarget,
  dryRun: argv.includes('--dry-run')
})
const subjects: CheckerEvaluationSubject<KiSkillsRubricContext>[] = scope.subjects.map(({ scope, context, subject }) => ({
  familyCodes: KI_SKILLS_SUBJECT_FAMILIES[scope],
  context,
  ...(subject ? { subject } : {})
}))

const result = runChecker({
  mode: 'conform',
  concern: 'skills',
  target: reportTarget,
  rubric: KI_SKILLS_RUBRIC,
  subjects
})

scope.persist()
process.stdout.write(checkerJsonl(result.records))
process.exit(result.exitCode)
