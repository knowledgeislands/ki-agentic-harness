import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const ETIQ_J1: RubricItem<ChezmoiContext> = {
  code: 'ETIQ-J1',
  title: 'audit etiquette',
  description: 'Audits report a file, concise problem, and options before any change is applied.',
  sources: ['standards.md'],
  judgment: { prompt: 'Were findings reported with a file, concise problem statement, and options before a change was applied?' }
}

export const ETIQ = [ETIQ_J1] as const
