import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createWorkFolderAliasSession, type WorkFolderAliasRubricContext } from '../contexts/alias.ts'
import { ALIAS } from './alias.ts'
import { RUBRIC } from './publication.ts'

export default {
  contract: 1,
  name: 'ki-work-folder',
  concern: 'the deprecated work-folder alias',
  createSession: createWorkFolderAliasSession,
  families: [RUBRIC, ALIAS]
} satisfies SkillRubricDefinition<WorkFolderAliasRubricContext>
