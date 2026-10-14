import type { RubricFamily } from '../../shared/rubric.ts'
import type { DelegationRubricContext } from '../types.ts'

export const RUN: RubricFamily<DelegationRubricContext, DelegationRubricContext['footers']> = {
  code: 'RUN',
  title: 'background runs',
  description: 'Shipped authority footers and the quality of background-run prompts and reports.',
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
        "A background-run prompt cites the owner decision that authorises it in the owner's words and date, has numbered steps, a verification step and a report path, forbids background subagents and ending while waiting, and ends with the lowest sufficient authority footer.",
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Background-run prompts, decisions logs and run reports the delegating owner selects for review.',
        prompt:
          'Does each prompt cite a real owner decision by its words and date, name every remote call it relies on, use the lowest sufficient authority tier, and give a detached agent with no hidden context enough to finish, verify and report?',
        outcomes: ['conforming', 'revise prompt', 'escalate to owner'],
        guidance:
          'Revise a prompt only within the authority its cited decision grants; escalate to the owner when the work needs a higher tier or a decision that does not exist yet.'
      }
    },
    {
      code: 'RUN-3',
      title: 'run records are tracked and consolidated',
      description:
        "A run's decisions log and agent reports live in the owning repository's tracked `+/_THREADS/<run>/` folder and are committed as the thread goes, each owner decision is logged before the work it authorises launches, in-force decisions are consolidated into a Decision Record, skill or checkpoint rather than living only in the run directory, and a prompt or record describes a decision by the owner's words and date, never by its number.",
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Thread folders, decisions logs, run directories and run prompts the owner selects for review.',
        prompt:
          'Is every decision logged in the tracked thread folder before its work launched, does anything durable exist only in the run directory, and does any prompt or record cite a decision by number alone?',
        outcomes: ['conforming', 'consolidate decisions', 'log decisions', 'escalate to owner'],
        guidance:
          "Consolidate in-force decisions into their durable owner, record missing decisions before further launches, and replace a bare decision number with the owner's words and the date; escalate when the durable owner is unclear."
      }
    },
    {
      code: 'RUN-4',
      title: 'reports take the owner-report shape',
      description:
        'Every agent report and thread Summary is an owner report with what has been done, what is in progress and outstanding queries in that order, each query under a stable Needs tag, never a number, with Summary, Need from you and Recommendation, ending in one copyable reply block whose lines are each prefilled with the recommended instruction rather than a menu of the options, with a placeholder only where the owner alone can supply the value, that is a suggestion and not approval, and no output style, proxy shaping block or communication level shortens it.',
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Background-agent reports and coordinating-thread Summaries the owner selects for review.',
        prompt:
          'Does each report carry the three owner-report sections in order with routine open matters kept out of the queries, could the owner answer each query cold by a tag that kept its meaning until resolved and send back the reply block as it stands because each line carries the recommended instruction and not the options, and was any section, query or reply block shortened by a style or level?',
        outcomes: ['conforming', 'reshape the report', 'retag queries', 'escalate to owner'],
        guidance:
          'Restore the three owner-report sections and the reply block in full, prefill each reply-block line with the recommended instruction in place of a menu, and give each query a stable mnemonic tag, a Summary, a Need from you, a Recommendation and links.'
      }
    }
  ]
}
