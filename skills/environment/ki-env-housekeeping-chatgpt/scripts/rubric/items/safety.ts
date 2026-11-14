import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'

export const STATE = {
  code: 'STATE',
  title: 'ChatGPT and Codex session housekeeping safety',
  standard: '../SKILL.md',
  description: 'Provider-specific inventory, provenance, and source-mutation boundaries.',
  selectContext: (context) => context,
  items: [
    {
      code: 'STATE-1',
      title: 'discovery is physical and content-minimised',
      description:
        'Discovery accepts one configured physical store, enumerates only recognised non-symlinked record paths, and returns provenance without decoded conversation content.',
      sources: ['../SKILL.md#chatgpt-session-acquisition'],
      judgment: judgment(
        'Does the runtime evidence prove path containment, opaque handling, and content-minimised discovery?'
      )
    },
    {
      code: 'STATE-2',
      title: 'source mutation is unavailable during acquisition',
      description:
        'The provider exposes only discover, list, read, and checkpoint; KI staging and any later archive/delete decision remain separate.',
      sources: ['../SKILL.md#chatgpt-session-acquisition'],
      judgment: judgment('Does the provider preserve its no-decrypt, no-write, no-delete boundary?')
    },
    {
      code: 'STATE-3',
      title: 'Codex inventory is exact and content-minimised',
      description:
        'Codex inventory matches one physical repository exactly, includes active and archived roots and complete descendants, and excludes transcript content.',
      sources: ['standards-codex-state.md#repository-identity', 'standards-codex-state.md#inventory'],
      judgment: judgment(
        'Does the Codex provider prove exact repository identity and complete, content-minimised inventory?'
      )
    },
    {
      code: 'STATE-4',
      title: 'Codex deletion is explicitly reviewed and fail-closed',
      description:
        'Permanent deletion requires a reviewed artifact, exact selection, destructive confirmation, complete revalidation, and partial-execution reporting.',
      sources: ['standards-codex-state.md#deletion'],
      judgment: judgment('Does Codex deletion preserve the reviewed selection and every pre-delete safety gate?')
    }
  ]
} satisfies RubricFamily<HousekeepingRubricContext, HousekeepingRubricContext>
