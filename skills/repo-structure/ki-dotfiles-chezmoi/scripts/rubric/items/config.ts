import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { ChezmoiContext } from '../contexts/chezmoi.ts'

export const CONFIG_J1: RubricItem<ChezmoiContext> = {
  code: 'CONFIG-J1',
  title: 'format-preserving editor selection',
  description: 'Every Pattern A writer uses an appropriate format-preserving edit API with safe absent-file and invalid-input behaviour.',
  sources: ['standards.md'],
  judgment: {
    prompt:
      'Do Pattern A writers use a format-appropriate edit API, define absent-file and path behaviour, fail closed, and demonstrate syntax preservation and idempotence?'
  }
}

export const CONFIG = [CONFIG_J1] as const
