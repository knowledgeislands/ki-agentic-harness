import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { HomebrewTapRubricContext } from '../contexts/homebrew-tap.ts'

export const RUBRIC = createRubricPublicationFamily<HomebrewTapRubricContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
