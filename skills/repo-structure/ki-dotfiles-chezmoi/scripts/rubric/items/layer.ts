import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const LAYER_J1: RubricItem<ChezmoiContext> = {
  code: 'LAYER-J1',
  title: 'agent-instruction layering',
  description: 'CLAUDE.md-style guidance is placed at the correct repo, user, or persistent-memory layer.',
  sources: ['standards.md'],
  judgment: { prompt: 'Does each piece of CLAUDE.md-style guidance sit at the correct repo-local, user-level, or persistent-memory layer?' }
}

export const LAYER = [LAYER_J1] as const
