import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'

export const HANDOFF_1: RubricItem<RoadmapContext> = {
  code: 'HANDOFF-1',
  title: 'handoff review',
  description:
    'Where +/_HANDOFFS or -/_HANDOFFS exists, review incoming adoption and outgoing receiving-repository progress without inferring or changing remote state.',
  sources: ['standards.md'],
  judgment: {
    prompt:
      'Inspect the handoff areas: identify any inbound material that needs a local roadmap decision and any outbound material needing follow-up or closure; report proposals only.'
  }
}

export const HANDOFF = [HANDOFF_1] as const
