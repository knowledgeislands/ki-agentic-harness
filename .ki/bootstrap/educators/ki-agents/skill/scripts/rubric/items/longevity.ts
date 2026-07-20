const LONGEVITY_ITEMS = [
  {
    code: 'LONG-1',
    title: 'Volatile fact handling',
    description: 'Volatile facts are resolved at runtime or covered by a refresh path.',
    sources: ['standards.md#12-longevity', 'BP', 'HOUSE'],
    judgment: {
      prompt:
        'Volatile facts (model IDs, tool names, note paths, dated specifics) are resolved at runtime (read the live KB, prefer `model: inherit`) or covered by a refresh path — prefer grounding-at-runtime over baked-in facts.'
    }
  }
] as const

export const LONG_1 = LONGEVITY_ITEMS[0]
export const LONGEVITY = [LONG_1] as const
