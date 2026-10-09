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
    },
    {
      code: 'RUN-4',
      title: 'threads park tangents, link records and keep checkouts current',
      description:
        'A coordinating thread parks passing side topics as dated one-line items under its checkpoint Open questions, cites and links every record, checkpoint, Initiative and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push.',
      sources: ['standards-background-runs.md'],
      judgment: {
        scope:
          'Coordinating-thread transcripts, status lines, reports, project recaps and checkpoints the owner selects for review.',
        prompt:
          "Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, checkpoint, Initiative or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered?",
        outcomes: ['conforming', 'park or home tangents', 'fix references', 'refresh checkouts', 'escalate to owner'],
        guidance:
          'Move tangents into checkpoint Open questions or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it.'
      }
    },
    {
      code: 'RUN-5',
      title: 'threads report answerably and refresh their guidance',
      description:
        "A coordinating thread tags each needs item mnemonically with plain context, a recommendation and links, asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work, and re-reads this skill's thread guidance at bootstrap, before each checkpoint update and whenever the skill has changed, noting the revision read in its checkpoint.",
      sources: ['standards-background-runs.md'],
      judgment: {
        scope:
          'Coordinating-thread transcripts, reports, summaries, decisions logs and checkpoints the owner selects for review.',
        prompt:
          "Could the owner answer each needs item cold by its tag, were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched, and does the checkpoint's noted ki-delegation revision match the skill's latest change?",
        outcomes: ['conforming', 'retag needs items', 'log decisions', 'refresh guidance', 'escalate to owner'],
        guidance:
          'Give each needs item a mnemonic tag, plain context, a recommendation and links; record missing decisions before further launches; and re-read the thread guidance, update the noted revision and tell the owner what changed.'
      }
    }
  ]
}
