import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const PATTERN_J1: RubricItem<ChezmoiContext> = {
  code: 'PATTERN-J1',
  title: 'app-mutated config pattern choice',
  description: 'Pattern A or Pattern B is chosen correctly for each app-mutated configuration file.',
  sources: ['standards.md'],
  judgment: {
    prompt: 'For each app-mutated configuration file, was Pattern A or Pattern B selected using the ≥90%-app-owned decision rule?'
  }
}

export const PATTERN = [PATTERN_J1] as const
