import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ChezmoiRubricContext } from '../contexts/chezmoi.ts'

export const RUBRIC = createRubricPublicationFamily<ChezmoiRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
