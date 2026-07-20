const LONGEVITY_ITEMS = [
  {
    code: 'LONG-1',
    title: 'Refresh path',
    description: 'The ki-harness skill carries REFRESH and a dated source review record.',
    sources: ['standards.md'],
    judgment: { prompt: 'Review the ki-harness REFRESH procedure and sources.md cadence for a usable current refresh path.' }
  }
] as const
export const LONG_1 = LONGEVITY_ITEMS[0]
export const LONGEVITY = [LONG_1] as const
