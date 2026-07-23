import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const PATTERN_J1: RubricItem<ChezmoiContext> = {
  code: 'PATTERN-J1',
  title: 'app-mutated config pattern choice',
  description: 'Pattern A, Pattern B, or Pattern C is chosen correctly for each app-mutated configuration file.',
  sources: ['standards.md'],
  judgment: {
    prompt:
      'For each app-mutated configuration file, does the selected pattern match its template ownership, required native lifecycle visibility, and app-owned scope?'
  }
}

export const PATTERN_J2: RubricItem<ChezmoiContext> = {
  code: 'PATTERN-J2',
  title: 'native fragment-binding boundary',
  description:
    'Every Pattern C binding declares its ownership, removal, and adoption boundaries without importing secrets or undeclared application state.',
  sources: ['standards.md'],
  judgment: {
    prompt:
      'Does every native fragment binding state its canonical source, target, selector, ownership and removal policy, and explicit safe-adoption boundary?'
  }
}

export const PATTERN = [PATTERN_J1, PATTERN_J2] as const
