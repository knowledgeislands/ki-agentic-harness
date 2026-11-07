import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { PackagesContext } from '../contexts/packages.ts'

export const RUBRIC = createRubricPublicationFamily<PackagesContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
