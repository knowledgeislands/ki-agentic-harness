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
        "A run's brief, decisions log and agent reports live in the tracked work folder `+/_WORK/<id>/` of the work that launched it, the brief as `briefs/<name>.md` until its report is received, a thread folder `+/_THREADS/<run>/` being read for the tolerance window, and are committed at each send, each owner decision is logged before the work it authorises launches, in-force decisions are consolidated into a Decision Record, skill or the work file rather than living only in the run directory, at each mark the coordinator deletes by explicit path every report whose queries are all answered and whose outcome has a durable home and every brief whose report it has, while Git history holds the rest, and a prompt or record describes a decision by the owner's words and date, never by its number.",
      sources: ['standards-background-runs.md'],
      judgment: {
        scope: 'Work folders, decisions logs, run directories and run prompts the owner selects for review.',
        prompt:
          'Is every decision logged in the tracked work folder before its work launched, does anything durable exist only in the run directory, does the work folder hold only its closed list after each mark, with the answered and homed reports and the received briefs deleted by explicit path, and does any prompt or record cite a decision by number alone?',
        outcomes: [
          'conforming',
          'consolidate decisions',
          'log decisions',
          'prune the work folder',
          'escalate to owner'
        ],
        guidance:
          "Consolidate in-force decisions into their durable owner, record missing decisions before further launches, and replace a bare decision number with the owner's words and the date, and delete by explicit path each report whose queries are answered and whose outcome is homed and each brief whose report is in, keeping one whose home is unclear; escalate when the durable owner is unclear."
      }
    },
    {
      code: 'RUN-4',
      title: 'reports take the owner-report shape',
      description:
        "Every agent report and coordinator Summary is an owner report opening with the `ki-pmo` report heading, one `#` heading of the work's title with its theme and Project linked, a run report adding `› <run name>` and the form `Run report`, then the bold glyph form line and one rule, with the sections `## Done`, `## In Progress` and `## Queries` in that order, each query under a stable Needs tag, never a number, with **Context**, **Query** and **Options**, the options lettered a), b) and so on with no bullet and a) always marked `(recommended, confidence <level> - <reason>)`, closing with the glyph banner of the work's state and no reply block, the owner answering in speech, and no output style, proxy shaping block or communication level shortens it; a report written before 18 October 2026 keeps its earlier heading, footer frame and reply block.",
      sources: ['../../../change-management/ki-pmo/references/standards-pmo.md#owner-report'],
      judgment: {
        scope: 'Background-agent reports and coordinator Summaries the owner selects for review.',
        prompt:
          'Does each report open with the `ki-pmo` report heading and its glyph form line, carry the three owner-report sections in order with routine open matters kept out of the queries, let the owner answer each query cold by a tag that kept its meaning until resolved from its Context, Query and lettered Options with a) marked recommended with its confidence, close with the glyph banner and no reply block, or keep its earlier shape if written before 18 October 2026, and was any section, query or banner shortened by a style or level?',
        outcomes: ['conforming', 'reshape the report', 'retag queries', 'escalate to owner'],
        guidance:
          'Restore the report heading and its glyph form line, the three owner-report sections and the glyph banner in full, remove any reply block from a report written under the work model, and give each query a stable mnemonic tag, a Context, a one-sentence Query, lettered Options with a) marked recommended and no bullets, and links.'
      }
    }
  ]
}
