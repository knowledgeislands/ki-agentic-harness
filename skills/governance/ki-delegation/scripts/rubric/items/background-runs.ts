import type { RubricFamily } from '../../shared/rubric.ts'
import type { DelegationRubricContext } from '../types.ts'

export const RUN: RubricFamily<DelegationRubricContext, DelegationRubricContext['footers']> = {
  code: 'RUN',
  title: 'background runs',
  description: 'Shipped authority footers and the quality of background-run prompts.',
  standard: 'standards-background-runs.md',
  selectContext: (context) => context.footers,
  items: [
    {
      code: 'RUN-1',
      title: 'authority footers grant exactly their tier',
      description:
        'Each shipped authority footer exists, carries the shared prohibitions, includes every grant of its tier and below, and grants nothing above it.',
      sources: ['standards-background-runs.md'],
      mechanical: {
        level: 'FAIL',
        remediation: {
          class: 'diagnostic',
          guidance:
            'Restore the footer wording in the canonical harness skill so each tier grants exactly what the standard lists.'
        },
        audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
      }
    },
    {
      code: 'RUN-2',
      title: 'run prompts are cold-agent ready and authority-bounded',
      description:
        'A background-run prompt cites the numbered owner decision that authorises it, has numbered steps, a verification step and a report path, forbids background subagents and ending while waiting, and ends with the lowest sufficient authority footer.',
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Background-run prompts, decisions logs and run reports the delegating owner selects for review.',
        prompt:
          'Does each prompt cite a real numbered decision, name every remote call it relies on, use the lowest sufficient authority tier, and give a detached agent with no hidden context enough to finish, verify and report?',
        outcomes: ['conforming', 'revise prompt', 'escalate to owner'],
        guidance:
          'Revise a prompt only within the authority its cited decision grants; escalate to the owner when the work needs a higher tier or a decision that does not exist yet.'
      }
    },
    {
      code: 'RUN-3',
      title: 'coordinators stay responsive and project threads stay current',
      description:
        'A coordinating thread does only quick one-step checks and short bookkeeping itself and hands longer work to background agents; a project thread follows the bootstrap, keeps its checkpoint current, records approvals before launching, and consolidates in-force decisions out of the run directory.',
      sources: ['standards-background-runs.md'],
      judgment: {
        scope:
          'Coordinating-thread transcripts, project checkpoints, decisions logs and project recaps the owner selects for review.',
        prompt:
          'Did the coordinator avoid blocking the owner, does each project thread work through background agents from a current checkpoint, and does anything durable exist only in the run directory?',
        outcomes: ['conforming', 'delegate longer work', 'consolidate decisions', 'escalate to owner'],
        guidance:
          'Move longer coordinator work into background agents, and consolidate in-force decisions into a Decision Record, skill or checkpoint; escalate to the master thread when a direction touches more than one Project.'
      }
    }
  ]
}
