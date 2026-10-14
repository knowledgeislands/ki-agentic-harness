<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — delegation packets and background runs

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-delegation --write`.

Line-by-line criteria for auditing ki-delegation. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [PACKET — delegation packets](#packet--delegation-packets)
- [RUN — background runs](#run--background-runs)

## PACKET — delegation packets

→ [standard](standards-delegation-packets.md)

Opted-in durable delegation-packet structure and governance quality.

- **PACKET-1 [M + J] — durable packet structure and governance quality** — An opted-in durable delegation packet in either roadmap adapter has the exact brief structure; its worker scope, authority, isolation, escalation, return contract, and verification gates are fit for the high-risk handoff. (standards-delegation-packets.md)
  - _Remediation:_ guarded — Supply the missing packet evidence or revise the worker brief only through the planner with the relevant delegation authority.
  - _Evidence scope:_ Every opted-in durable delegation packet, its activation rationale, worker briefs, and referenced approved governing work record.
  - _Review prompt:_ Does the work need a durable packet rather than ordinary runtime delegation, and are the worker inputs, scope, authority, isolation, locked decisions, escalation boundaries, return contract, and verification gates appropriate for that high-risk handoff?
  - _Outcomes:_ conforming; revise packet; escalate to planner
  - _Conforming guidance:_ Use a packet only when its durable authority and audit evidence add value beyond the runtime brief. Record a packet revision only after the responsible authority chooses the worker scope, isolation, locked decisions, escalation boundary, return evidence, and verification gate; leave worker selection, model choice, scheduling, and integration to the active process and runtime.

## RUN — background runs

→ [standard](standards-background-runs.md)

Shipped authority footers and the quality of background-run prompts and reports.

- **RUN-1 [M] — authority footers grant exactly their tier** — Each shipped authority footer exists, carries the shared prohibitions, includes every grant of its tier and below, and grants nothing above it. (standards-background-runs.md)
  - _Remediation:_ diagnostic — Restore the footer wording in the canonical harness skill so each tier grants exactly what the standard lists.
- **RUN-2 [J] — run prompts are cold-agent ready and authority-bounded** — A background-run prompt cites the owner decision that authorises it in the owner's words and date, has numbered steps, a verification step and a report path, forbids background subagents and ending while waiting, and ends with the lowest sufficient authority footer. (standards-background-runs.md)
  - _Evidence scope:_ Background-run prompts, decisions logs and run reports the delegating owner selects for review.
  - _Review prompt:_ Does each prompt cite a real owner decision by its words and date, name every remote call it relies on, use the lowest sufficient authority tier, and give a detached agent with no hidden context enough to finish, verify and report?
  - _Outcomes:_ conforming; revise prompt; escalate to owner
  - _Conforming guidance:_ Revise a prompt only within the authority its cited decision grants; escalate to the owner when the work needs a higher tier or a decision that does not exist yet.
- **RUN-3 [J] — run records are tracked and consolidated** — A run's decisions log and agent reports live in the owning repository's tracked `+/_THREADS/<run>/` folder and are committed as the thread goes, each owner decision is logged before the work it authorises launches, in-force decisions are consolidated into a Decision Record, skill or checkpoint rather than living only in the run directory, and a prompt or record describes a decision by the owner's words and date, never by its number. (standards-background-runs.md)
  - _Evidence scope:_ Thread folders, decisions logs, run directories and run prompts the owner selects for review.
  - _Review prompt:_ Is every decision logged in the tracked thread folder before its work launched, does anything durable exist only in the run directory, and does any prompt or record cite a decision by number alone?
  - _Outcomes:_ conforming; consolidate decisions; log decisions; escalate to owner
  - _Conforming guidance:_ Consolidate in-force decisions into their durable owner, record missing decisions before further launches, and replace a bare decision number with the owner's words and the date; escalate when the durable owner is unclear.
- **RUN-4 [J] — reports take the owner-report shape** — Every agent report and thread Summary is an owner report opening with the `ki-pmo` heading frame in its own text block, the thread type, report form and issued time in its top border, the label centred and the mark below, and the plain `Project · Initiative · <window> · <state>` line beneath it, a saved file keeping one `# <label> · <form> at <local time>` line above the frame and a report written before 2026-10-14 keeping its earlier heading, with the sections `## Done`, `## In Progress` and `## Queries` in that order, each query under a stable Needs tag, never a number, with **Context**, **Query** and **Options**, the options lettered a), b) and so on with no bullet and a) always marked `(recommended)`, a query written before 2026-10-14 keeping its Summary, Need from you and Recommendation, ending in one copyable reply block whose entries are each stacked, the tag alone on its line, a blank line, then the option a) instruction written out in full rather than a menu of the options, an entry the owner answers with a bare letter being accepted, separated by a blank line, `---` and a blank line, with a placeholder only where the owner alone can supply the value, that is a suggestion and not approval, and no output style, proxy shaping block or communication level shortens it. (standards-background-runs.md)
  - _Evidence scope:_ Background-agent reports and coordinating-thread Summaries the owner selects for review.
  - _Review prompt:_ Does each report open with the `ki-pmo` heading frame and its Project, Initiative, window and state line, or an earlier heading if written before 2026-10-14, and carry the three owner-report sections in order with routine open matters kept out of the queries, could the owner answer each query cold by a tag that kept its meaning until resolved from its Context, Query and lettered Options with a) marked recommended, or from Summary, Need from you and Recommendation if written before 2026-10-14, and send back the reply block as it stands because each entry stacks its tag over the option a) instruction in full and not the options, or answer with a bare letter, and was any section, query or reply block shortened by a style or level?
  - _Outcomes:_ conforming; reshape the report; retag queries; escalate to owner
  - _Conforming guidance:_ Restore the heading frame with its Project, Initiative, window and state line, the three owner-report sections and the reply block in full, stack each reply-block entry as its tag, a blank line and the option a) instruction in full in place of a one-line menu, and give each query a stable mnemonic tag, a Context, a one-sentence Query, lettered Options with a) marked recommended and no bullets, and links.
