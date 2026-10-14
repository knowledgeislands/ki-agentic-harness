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
        'Every agent report and thread Summary is an owner report opening with the heading `# <label> · <form> at <local time>` and the plain `Project · Initiative · <window> · <state>` line beneath it, a report written before 2026-10-14 keeping its earlier heading, with the sections `## Done`, `## In Progress` and `## Queries` in that order, each query under a stable Needs tag, never a number, with **Context**, **Query** and **Options**, the options lettered a), b) and so on with no bullet and a) always marked `(recommended)`, a query written before 2026-10-14 keeping its Summary, Need from you and Recommendation, ending in one copyable reply block whose entries are each stacked, the tag alone on its line, a blank line, then the option a) instruction written out in full rather than a menu of the options, an entry the owner answers with a bare letter being accepted, separated by a blank line, `---` and a blank line, with a placeholder only where the owner alone can supply the value, that is a suggestion and not approval, and no output style, proxy shaping block or communication level shortens it.',
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Background-agent reports and coordinating-thread Summaries the owner selects for review.',
        prompt:
          'Does each report open with the `<label> · <form> at <local time>` heading and its Project, Initiative, window and state line, or an earlier heading if written before 2026-10-14, and carry the three owner-report sections in order with routine open matters kept out of the queries, could the owner answer each query cold by a tag that kept its meaning until resolved from its Context, Query and lettered Options with a) marked recommended, or from Summary, Need from you and Recommendation if written before 2026-10-14, and send back the reply block as it stands because each entry stacks its tag over the option a) instruction in full and not the options, or answer with a bare letter, and was any section, query or reply block shortened by a style or level?',
        outcomes: ['conforming', 'reshape the report', 'retag queries', 'escalate to owner'],
        guidance:
          'Restore the report heading with its Project, Initiative, window and state line, the three owner-report sections and the reply block in full, stack each reply-block entry as its tag, a blank line and the option a) instruction in full in place of a one-line menu, and give each query a stable mnemonic tag, a Context, a one-sentence Query, lettered Options with a) marked recommended and no bullets, and links.'
      }
    }
  ]
}
