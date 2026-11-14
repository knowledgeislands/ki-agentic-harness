import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createPackagesSession, type PackagesContext } from '../contexts/packages.ts'
import { CONFIG } from './config.ts'
import { PKG } from './package.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-repo-packages',
  concern: 'Knowledge Islands package repository shape',
  createSession: createPackagesSession,
  families: [CONFIG, PKG, RUBRIC]
} satisfies SkillRubricDefinition<PackagesContext>
