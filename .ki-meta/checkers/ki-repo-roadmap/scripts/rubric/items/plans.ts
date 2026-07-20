import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
import { mechanical } from './common.ts'

export const PLAN_1 = mechanical(
  'PLAN-1',
  'plan placement and shape',
  'Plans use the canonical thematic path, stable theme code and serial, required frontmatter, and matching filename and ID.'
)
export const PLAN_2 = mechanical(
  'PLAN-2',
  'plan roadmap linkage',
  '`roadmap:` is a qualified locator in the same theme and resolves to a Blocking or Next item; that item carries exactly one matching local plan reference.',
  'FAIL',
  true
)
export const PLAN_3 = mechanical(
  'PLAN-3',
  'plan dependencies',
  'Dependencies use canonical plan identifiers, exist, are reverse-consistent, and acyclic; an in-progress or acceptance plan has no non-done blocker.'
)
export const PLAN_4: RubricItem<RoadmapContext> = {
  code: 'PLAN-4',
  title: 'ready plan content',
  description: 'In-progress and acceptance plans have concrete Steps, checkable Verify, honest Current state, and minimal Files touched.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review active plan content for concrete, checkable execution detail.' }
}
export const PLAN_5: RubricItem<RoadmapContext> = {
  code: 'PLAN-5',
  title: 'honest plan status',
  description: 'In-progress status reflects live work; acceptance status reflects verified work awaiting explicit user acceptance.',
  sources: ['standards.md'],
  judgment: { prompt: 'Review whether the active plan status honestly reflects live work or manual acceptance.' }
}
export const PLAN = [PLAN_1, PLAN_2, PLAN_3, PLAN_4, PLAN_5] as const
