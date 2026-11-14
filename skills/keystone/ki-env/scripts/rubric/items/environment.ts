import { judgment, type RubricFamily, type RubricItem } from '../../shared/rubric.ts'
import type { EnvironmentContext } from '../contexts/environment.ts'

const ENV_1: RubricItem<EnvironmentContext> = {
  code: 'ENV-1',
  title: "each environment concern reaches its family's lead",
  description:
    "Tools and access, limits, and the state agent hosts leave are each governed through their family's portable lead, never through a runtime skill alone.",
  sources: ['standard-environment.md#41-what-the-guild-covers'],
  judgment: judgment("Does each environment concern the repository governs reach its family's lead?")
}

const ENV_2: RubricItem<EnvironmentContext> = {
  code: 'ENV-2',
  title: "each runtime skill adds only its host's delta",
  description:
    "A rule that holds for every runtime sits with the family's lead, and a runtime skill holds only what is true of its own agent host.",
  sources: ['standard-environment.md#42-families'],
  judgment: judgment(
    "Does any runtime skill restate a rule its family's lead holds, or does the lead hold a rule true of only one runtime?"
  )
}

export const ENV: RubricFamily<EnvironmentContext, EnvironmentContext> = {
  code: 'ENV',
  title: 'Environment families',
  description:
    "Each environment concern reaches its family's lead, and each runtime skill adds only its agent host's delta.",
  standard: 'standard-environment.md',
  selectContext: (context) => context,
  items: [ENV_1, ENV_2]
}
