import type { RubricItem } from '../lib/rubric/rubric.ts'

export const LONG_1: RubricItem = {
  code: 'LONG-1',
  title: 'volatile facts have a refresh path',
  description: 'A skill with time-sensitive facts resolves them at runtime or records sources and a refresh path.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do volatile facts resolve at runtime or have a tracked source list and refresh path?' }
}

export const LONG_2: RubricItem = {
  code: 'LONG-2',
  title: 'the refresh path has a cadence',
  description: 'A skill that has a refresh path declares an appropriate cadence and schedules it when supported.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Does the refresh path have an appropriate declared cadence and scheduled execution where supported?' }
}

export const LONG_3: RubricItem = {
  code: 'LONG-3',
  title: 'the declared refresh cadence is being met',
  description: 'A skill source list remains within its declared review cadence and grace period.',
  sources: ['COMMUNITY']
}

export const LONG_4: RubricItem = {
  code: 'LONG-4',
  title: 'the refresh marker is present and coherent',
  description: 'A sources file has a parseable and coherent refresh class and cadence marker.',
  sources: ['COMMUNITY']
}

export const LONGEVITY: readonly RubricItem[] = [LONG_1, LONG_2, LONG_3, LONG_4]
