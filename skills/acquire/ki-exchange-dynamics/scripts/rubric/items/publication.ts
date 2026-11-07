import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import type { ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'

export const RUBRIC = createRubricPublicationFamily<ExchangeDynamicsContext>(
  ({ rubric }) => rubric,
  '../../../keystone/ki-skills/references/standards-rubric-authoring.md',
  ['../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication']
)
