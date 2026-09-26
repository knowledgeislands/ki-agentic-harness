import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { PaperclipCoordinationContext } from '../contexts/coordination.ts'

const STANDARD = 'standards-agent-coordination-paperclip.md'

export const COORD: RubricFamily<PaperclipCoordinationContext, PaperclipCoordinationContext> = {
  code: 'COORD',
  title: 'KI–Paperclip coordination',
  description: 'Repository authority, identity separation, work linkage, workspace isolation, and evidence return.',
  standard: STANDARD,
  selectContext: (context) => context,
  items: [
    {
      code: 'COORD-1',
      title: 'Repository authority',
      description: 'Paperclip coordinates execution without becoming durable KI knowledge or work authority.',
      sources: [`${STANDARD}#position-and-authority`, `${STANDARD}#knowledge-boundary`],
      judgment: judgment(
        'Does the arrangement keep durable knowledge, work lifecycle, acceptance, and repository authority in the owning KI repositories?'
      )
    },
    {
      code: 'COORD-2',
      title: 'Distinct execution identities',
      description: 'Agent role, run or session, workspace, and worker remain distinct identities.',
      sources: [`${STANDARD}#identity-model`],
      judgment: judgment(
        'Does the arrangement distinguish the durable agent role from each run or session, workspace, and worker?'
      )
    },
    {
      code: 'COORD-3',
      title: 'Task-to-work linkage',
      description: 'Each Paperclip task has an unambiguous governing KI work relationship and independent lifecycle.',
      sources: [`${STANDARD}#task-to-work-relationship`],
      judgment: judgment(
        'Does each task identify at most one governing KI work item, preserve repository and baseline context, and avoid treating Paperclip completion as KI acceptance?'
      )
    },
    {
      code: 'COORD-4',
      title: 'Workspace isolation',
      description:
        'Every mutating run uses an isolated writable workspace under a safe Paperclip-owned root and an explicit baseline.',
      sources: [`${STANDARD}#workspace-model`],
      judgment: judgment(
        'Does every mutating run use its own writable checkout under a collision-safe Paperclip-owned root outside the repository and Git common directory, with explicit repository and baseline evidence?'
      )
    },
    {
      code: 'COORD-5',
      title: 'Direct interaction and control-plane boundary',
      description: 'Direct sessions remain valid and Paperclip API mechanics stay with Paperclip’s own skill.',
      sources: [`${STANDARD}#interaction-and-skill-composition`],
      judgment: judgment(
        'Can a human address an agent directly while control-plane operations remain governed by Paperclip’s official skill and existing authority?'
      )
    },
    {
      code: 'COORD-6',
      title: 'Evidence return',
      description: 'Coordination, repository, KI lifecycle, and durable-learning evidence are reconciled explicitly.',
      sources: [`${STANDARD}#evidence-and-completion`],
      judgment: judgment(
        'Does completion reconcile Paperclip task evidence, repository evidence, the KI work record, and durable knowledge promotion without converting unavailable evidence into a pass?'
      )
    }
  ]
}
