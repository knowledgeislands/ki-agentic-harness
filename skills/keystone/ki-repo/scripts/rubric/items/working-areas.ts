import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RepoRubricContext } from '../contexts/contexts.ts'

export const WORK_J1: RubricItem<RepoRubricContext> = {
  code: 'WORK-J1',
  title: 'working-area direction and lifecycle',
  description:
    'Optional +/ and -/ working areas distinguish inbound from outbound material, and any _HANDOFFS contents have a clear adoption, follow-up, or closure route.',
  sources: ['standards.md'],
  judgment: {
    prompt:
      'Where +/ or -/ exists, review that it is working material rather than a shadow canonical store, and that each handoff has an identifiable receiving owner and next route.'
  }
}

export const WORK = [WORK_J1] as const
