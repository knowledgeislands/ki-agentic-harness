import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
import { mechanical } from './common.ts'
export const PROFILE_1 = mechanical(
  'PROFILE-1',
  'profile structure',
  'A non-KB repository has a root `ROADMAP.md`; `docs/roadmap/` selects the thematic profile, otherwise simple. Missing roots or incomplete thematic structure fail.'
)
export const PROFILE_2: RubricItem<RoadmapContext> = {
  code: 'PROFILE-2',
  title: 'simple-profile suitability',
  description: 'Simple remains appropriate only while the work is understandable without theme isolation or execution plans.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review whether the simple profile remains appropriate for the repository work.' }
}
export const PROFILE = [PROFILE_1, PROFILE_2] as const
