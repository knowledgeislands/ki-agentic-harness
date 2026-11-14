import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createDesignSession, type DesignContext } from '../contexts/design.ts'
import { DESIGN } from './design.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-design',
  concern: 'how a design is shaped',
  createSession: createDesignSession,
  families: [RUBRIC, DESIGN]
} satisfies SkillRubricDefinition<DesignContext>
