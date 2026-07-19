import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
export const EXPAND_1: RubricItem<RoadmapContext> = { code: 'EXPAND-1', title: 'conservative expansion', description: 'EXPAND conserves every open item exactly once and preserves its horizon and prose.', sources: ['standards.md'], judgment: { prompt: 'Review expansion conservation against the source roadmap.' } }
export const EXPAND = [EXPAND_1] as const
