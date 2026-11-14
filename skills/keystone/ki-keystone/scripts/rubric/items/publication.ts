import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { KeystoneContext } from '../contexts/keystone.ts'

export const RUBRIC = createRubricPublicationFamily<KeystoneContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standard-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication']
)
