import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { BindingChezMoiContext } from '../contexts/binding-chezmoi.ts'

export const RUBRIC = createRubricPublicationFamily<BindingChezMoiContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
