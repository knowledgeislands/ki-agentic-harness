import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'
import { BIN } from './bin.ts'
import { CHEZMOI } from './chezmoi.ts'
import { CONFIG } from './config.ts'
import { ETIQ } from './etiquette.ts'
import { GIT } from './git.ts'
import { LAYER } from './layer.ts'
import { PATTERN } from './pattern.ts'
import { SYNC } from './sync.ts'

export const KI_DOTFILES_CHEZMOI_RUBRIC: RubricDefinition<ChezmoiContext> = {
  name: 'ki-dotfiles-chezmoi',
  concern: 'dotfiles-chezmoi',
  families: [
    defineRubricFamily({
      code: 'CHEZMOI',
      title: 'chezmoi repository shape',
      description: 'Required repository-shape files and template support.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: CHEZMOI
    }),
    defineRubricFamily({
      code: 'BIN',
      title: 'bin source naming',
      description: 'Chezmoi source-attribute naming for direct bin files.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: BIN
    }),
    defineRubricFamily({
      code: 'GIT',
      title: 'Git hygiene',
      description: 'Stray lock files that block Git operations.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: GIT
    }),
    defineRubricFamily({
      code: 'PATTERN',
      title: 'app-mutated configuration',
      description: 'Judgment criteria for Pattern A, Pattern B, and Pattern C selection.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: PATTERN
    }),
    defineRubricFamily({
      code: 'CONFIG',
      title: 'configuration editing',
      description: 'Judgment criteria for format-preserving Pattern A and Pattern C editors.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: CONFIG
    }),
    defineRubricFamily({
      code: 'LAYER',
      title: 'instruction layering',
      description: 'Judgment criteria for repository, user, and memory guidance.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: LAYER
    }),
    defineRubricFamily({
      code: 'ETIQ',
      title: 'audit etiquette',
      description: 'Judgment criteria for reporting before change.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: ETIQ
    }),
    defineRubricFamily({
      code: 'SYNC',
      title: 'standard synchronisation',
      description: 'Judgment criteria for keeping the standard and implementation aligned.',
      standard: 'standards.md',
      selectContext: (context: ChezmoiContext) => context,
      items: SYNC
    })
  ]
}

export const KI_DOTFILES_CHEZMOI_FAMILY_CODES = ['CHEZMOI', 'BIN', 'GIT', 'PATTERN', 'CONFIG', 'LAYER', 'ETIQ', 'SYNC'] as const
