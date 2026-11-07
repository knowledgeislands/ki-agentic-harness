import type { SkillRubricDefinition } from '../../shared/rubric.ts'
import { createExchangeDynamicsSession, type ExchangeDynamicsContext } from '../contexts/exchange-dynamics.ts'
import { ANALYSIS } from './analysis.ts'
import { CONFIG } from './configuration.ts'
import { RUBRIC } from './publication.ts'
import { RENDER } from './rendering.ts'
import { SAFE } from './safeguards.ts'

export default {
  contract: 1,
  name: 'ki-exchange-dynamics',
  concern: 'Exchange dynamics analysis and rendering',
  createSession: createExchangeDynamicsSession,
  families: [CONFIG, ANALYSIS, SAFE, RENDER, RUBRIC]
} satisfies SkillRubricDefinition<ExchangeDynamicsContext>
