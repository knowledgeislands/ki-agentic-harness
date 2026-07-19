import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { SpecificationsContext } from '../contexts/specifications.ts'
export const SYNC_1: RubricItem<SpecificationsContext> = { code: 'SYNC-1', title: 'knowledge-chain synchronisation', description: 'The standard, rubric, checker, tests, and source review agree.', sources: ['standards.md'], judgment: { prompt: 'Do the standard, rubric, checker, tests, and source review agree?' } }
export const SYNC = [SYNC_1] as const
