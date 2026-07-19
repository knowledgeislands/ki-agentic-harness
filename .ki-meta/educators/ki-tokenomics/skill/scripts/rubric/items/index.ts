import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { TokenomicsRubricContext } from '../contexts/tokenomics.ts'
import { BUDG } from './budgets.ts'
import { COMP } from './composition.ts'
import { CFG } from './config.ts'
import { MCP } from './mcp.ts'
import { RUN } from './runtime.ts'
import { SURF } from './surface.ts'
import { TOOL } from './tooling.ts'

/** Catalogue wiring only; each semantic family owns its rules and ordered collection. */
export const KI_TOKENOMICS_RUBRIC: RubricDefinition<TokenomicsRubricContext> = {
  name: 'ki-tokenomics',
  concern: 'tokenomics',
  families: [
    defineRubricFamily({
      code: 'COMP',
      title: 'Composition and attribution',
      description: 'Layer composition and attribution.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: COMP as never
    }),
    defineRubricFamily({
      code: 'SURF',
      title: 'Standing-surface inventory',
      description: 'Standing context inventory.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: SURF as never
    }),
    defineRubricFamily({
      code: 'MCP',
      title: 'MCP tool surface',
      description: 'MCP standing context.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: MCP as never
    }),
    defineRubricFamily({
      code: 'BUDG',
      title: 'Budgets',
      description: 'Budget evidence and review.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: BUDG as never
    }),
    defineRubricFamily({
      code: 'RUN',
      title: 'Runtime levers',
      description: 'Runtime token-cost levers.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: RUN as never
    }),
    defineRubricFamily({
      code: 'TOOL',
      title: 'Compression tooling',
      description: 'Context compression tooling.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: TOOL as never
    }),
    defineRubricFamily({
      code: 'CFG',
      title: 'Configuration table',
      description: 'Tokenomics configuration table.',
      standard: 'standards.md',
      selectContext: (context: TokenomicsRubricContext) => context,
      items: CFG as never
    })
  ]
}
export const KI_TOKENOMICS_FAMILY_CODES = ['COMP', 'SURF', 'MCP', 'BUDG', 'RUN', 'TOOL', 'CFG'] as const
