import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
import { mechanical } from './common.ts'

export const ROAD_1 = mechanical(
  'ROAD-1',
  'roadmap structure',
  'Every authored roadmap has one H1 and the five horizons exactly once, in canonical order.'
)
export const ROAD_2: RubricItem<RoadmapContext> = {
  code: 'ROAD-2',
  title: 'honest horizon placement',
  description: 'Items sit in honest horizons; Waiting-for items name their external condition; speculative Future work says `(candidate)`.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review horizon placement, waiting conditions, and Future candidate marking.' }
}
export const ROAD_3: RubricItem<RoadmapContext> = {
  code: 'ROAD-3',
  title: 'open finite work',
  description: 'Roadmaps are open-only and contain finite work rather than continuous practice.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review that roadmap items are finite open work, not completed work or ongoing practice.' }
}
export const ROAD_4 = mechanical(
  'ROAD-4',
  'canonical horizon blurbs',
  'Every horizon heading is followed immediately by its exact canonical blurb; CONFORM inserts a missing blurb without removing existing authored content.',
  'FAIL',
  true
)
export const ROAD_5: RubricItem<RoadmapContext> = {
  code: 'ROAD-5',
  title: 'promotion and readiness',
  description:
    'Horizon placement and transitions meet the readiness contract; only Blocking or Next work receives a plan, and CONFORM never chooses a move.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review each horizon transition against its readiness contract.' }
}
export const ROAD = [ROAD_1, ROAD_2, ROAD_3, ROAD_4, ROAD_5] as const
