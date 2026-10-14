<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — coordinating threads

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-pmo --write`.

Line-by-line criteria for auditing ki-pmo. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [PMO — Coordinating threads](#pmo--coordinating-threads)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## PMO — Coordinating threads

→ [standard](standards-pmo.md)

The master and Project thread checkpoints a repository shows, and the responsiveness, reporting and currency of the threads behind them.

- **PMO-1 [M] — the master checkpoint belongs to the Capital** — A territory Capital, a repository whose declared `capital` is itself, holds the master thread checkpoint `+/_CHECKPOINTS/_state-of-play.md` labelled `Master: state-of-play`, and no other repository holds one. (standards-pmo.md#territory-master-thread)
  - _Remediation:_ diagnostic — Open the master thread in the Capital so it creates `_state-of-play.md` there, and remove a master checkpoint from any repository that is not its own capital through an explicit `ki-checkpoint` REMOVE.
- **PMO-2 [M] — Project thread checkpoints resolve in the registry** — Each `<initiative>.<project>.md` checkpoint's label ends in `: <project>`, and on a Capital its Project and Initiative resolve in the `Streams/Projects/` and `Streams/Initiatives/` registry. (standards-pmo.md#project-threads)
  - _Remediation:_ diagnostic — Rename the checkpoint or correct its label through an explicit `ki-checkpoint` UPDATE, or register the Project or Initiative under the `ki-work` registry standard.
- **PMO-3 [M] — active Project threads are within the cap** — At most three or four Project thread checkpoints are active at once, plus the master thread. (standards-pmo.md#territory-master-thread)
  - _Remediation:_ diagnostic — Have the master thread close or queue Project threads until the active list is within the cap, removing a closed checkpoint through an explicit `ki-checkpoint` REMOVE.
- **PMO-4 [J] — coordinators stay responsive and threads stay current** — A coordinating thread never does substantive work itself, sends every unit of work to a detached background agent and treats an owner message as steering rather than a stop; each turn makes at most five tool calls with reads limited to the checkpoint, `ki agent status`, one report and one short file and writes limited to the checkpoint, the decisions log and a brief, waits only through a detached waiter or monitor, answers owner messages within one short turn and reports drift in one line; each territory Capital has one master thread at `_state-of-play.md` doing project management only, keeping the Project-thread queue within its cap and seeding each checkpoint and opener; a project thread works only its Project, follows the bootstrap, keeps its checkpoint current and records approvals before launching. (standards-pmo.md#coordinator-responsiveness, standards-pmo.md#project-threads)
  - _Evidence scope:_ Coordinating-thread transcripts, project checkpoints, decisions logs and recaps the owner selects for review.
  - _Review prompt:_ Did the coordinator keep within five tool calls a turn, delegate rather than analyse, draft, edit, test or wait in the foreground, answer owner messages within one short turn and stop work only on an express, named instruction, does the territory master thread stay on project management with active Project threads within the cap and a prepared checkpoint and opener for each, and does each project thread work through background agents from a current checkpoint?
  - _Outcomes:_ conforming; delegate longer work; escalate to owner
  - _Conforming guidance:_ Move longer coordinator work into background agents and note the drift in the checkpoint; escalate to the master thread when a direction touches more than one Project.
- **PMO-5 [J] — threads park tangents, link records and keep checkouts current** — A coordinating thread parks passing side topics as dated one-line items under its checkpoint Open questions, cites and links every record, checkpoint, Initiative and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push. (standards-pmo.md#thread-working-rules)
  - _Evidence scope:_ Coordinating-thread transcripts, status lines, reports, recaps and checkpoints the owner selects for review.
  - _Review prompt:_ Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, checkpoint, Initiative or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered?
  - _Outcomes:_ conforming; park or home tangents; fix references; refresh checkouts; escalate to owner
  - _Conforming guidance:_ Move tangents into checkpoint Open questions or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it.
- **PMO-6 [J] — threads report in the three forms, recap since the mark and refresh their guidance** — A coordinating thread asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work, opens every Summary, recap and full summary with the shared H1 banner naming the thread, its Project and Initiative, the window and its state, keeps the sections at H2 and each query at H3 under the `ki-delegation` owner report, never points an owner-facing report back to an earlier one, gives a full summary of the whole thread on request with every owner decision linked under Decided and every open query in full, ends at a resting point with a Summary whose banner says it is resting or what it waits on, keeps its one owner-struck mark in its checkpoint Current state and gives recaps since that mark that carry every open item forward across marks, and re-reads this standard at bootstrap, before each checkpoint update and whenever the skill has changed, noting the revision read as `ki-pmo read at <revision>`. (standards-pmo.md#coordinating-thread-practices, standards-pmo.md#report-forms, standards-pmo.md#thread-working-rules)
  - _Evidence scope:_ Coordinating-thread transcripts, summaries, recaps, decisions logs and checkpoints the owner selects for review.
  - _Review prompt:_ Were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched, does every Summary, recap and full summary open with an H1 banner giving thread, Project and Initiative links, window and state, with the owner report's sections at H2 and queries at H3 and no pointer back to an earlier report, does a full summary list every owner decision since the thread began with a link to each and restate every open query in full, does a resting or waiting thread's last message say so, does the checkpoint hold one mark in the standard form that only the owner moved, does each recap cover the window since that mark with outstanding work in full whenever it arose, and does the checkpoint's noted ki-pmo revision match the skill's latest change?
  - _Outcomes:_ conforming; log decisions; add the banner; restore the mark; refresh guidance; escalate to owner
  - _Conforming guidance:_ Record missing decisions before further launches; open each Summary, recap and full summary with the H1 banner at the shared heading levels, restate anything that said see earlier, add the linked Decided list and the missing open queries to a full summary, and end a resting point with a Summary that states the wait; restore the mark line in Current state and recap from it; and re-read this standard, update the noted revision and tell the owner what changed.
