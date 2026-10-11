import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createDesignSession, type DesignRubricContext } from '../contexts/design.ts'
import { DSYS } from './design.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-design-system',
  concern: 'repository design-system knowledge',
  createSession: createDesignSession,
  families: [RUBRIC, DSYS]
} satisfies SkillRubricDefinition<DesignRubricContext>
