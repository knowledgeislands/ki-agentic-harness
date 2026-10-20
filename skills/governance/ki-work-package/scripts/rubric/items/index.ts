import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createWorkPackageSession, type WorkPackageRubricContext } from '../contexts/work-package.ts'
import { BOUNDARY } from './boundary.ts'
import { CONFIG } from './configuration.ts'
import { FOLDER } from './folder.ts'
import { LIFECYCLE } from './lifecycle.ts'
import { RUBRIC } from './publication.ts'
import { RECORD } from './records.ts'
import { STRUCTURE } from './structure.ts'

export default {
  contract: 1,
  name: 'ki-work-package',
  concern: 'portable work packages',
  createSession: createWorkPackageSession,
  families: [RUBRIC, CONFIG, STRUCTURE, RECORD, LIFECYCLE, FOLDER, BOUNDARY]
} satisfies SkillRubricDefinition<WorkPackageRubricContext>
