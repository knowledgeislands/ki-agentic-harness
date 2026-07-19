import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const SYNC_1: RubricItem<ChezmoiContext> = {
  code: 'SYNC-1',
  title: 'standard and rubric synchronisation',
  description: 'The standard, structured rubric, and mechanical behaviour remain aligned when the standard changes.',
  sources: ['standards.md'],
  judgment: { prompt: 'Do the standard, structured rubric items, and mechanical behaviour still agree?' }
}

export const SYNC = [SYNC_1] as const
