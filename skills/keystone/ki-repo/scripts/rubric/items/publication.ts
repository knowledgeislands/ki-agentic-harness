import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { RepoRubricContext } from '../contexts/repository.ts'

export const RUBRIC = createRubricPublicationFamily<RepoRubricContext>(
  ({ rubric }) => rubric,
  '../../ki-skills/references/standard-rubric-authoring.md',
  ['../../ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
