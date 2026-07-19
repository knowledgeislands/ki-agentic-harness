import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'

export const SYNC_1: RubricItem<AuthoringRubricContext> = {
  code: 'SYNC-1',
  title: 'conventions, rubric, and source record agree',
  description: 'The convention references, this rubric, and `sources.md` agree; when a convention moves, all three move together.',
  sources: ['sources.md'],
  judgment: { prompt: 'Do the convention references, rubric publication, and source record agree?' }
}

export const SYNC = [SYNC_1] as const
