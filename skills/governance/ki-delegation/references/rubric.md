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

Shipped authority footers and the quality of background-run prompts.

- **RUN-1 [M] — authority footers grant exactly their tier** — Each shipped authority footer exists, carries the shared prohibitions, includes every grant of its tier and below, and grants nothing above it. (standards-background-runs.md)
  - _Remediation:_ diagnostic — Restore the footer wording in the canonical harness skill so each tier grants exactly what the standard lists.
- **RUN-2 [J] — run prompts are cold-agent ready and authority-bounded** — A background-run prompt cites the numbered owner decision that authorises it, has numbered steps, a verification step and a report path, forbids background subagents and ending while waiting, and ends with the lowest sufficient authority footer. (standards-background-runs.md)
  - _Evidence scope:_ Background-run prompts, decisions logs and run reports the delegating owner selects for review.
  - _Review prompt:_ Does each prompt cite a real numbered decision, name every remote call it relies on, use the lowest sufficient authority tier, and give a detached agent with no hidden context enough to finish, verify and report?
  - _Outcomes:_ conforming; revise prompt; escalate to owner
  - _Conforming guidance:_ Revise a prompt only within the authority its cited decision grants; escalate to the owner when the work needs a higher tier or a decision that does not exist yet.
- **RUN-3 [J] — coordinators stay responsive and project threads stay current** — A coordinating thread does only quick one-step checks and short bookkeeping itself and hands longer work to background agents; a project thread follows the bootstrap, keeps its checkpoint current, records approvals before launching, and consolidates in-force decisions out of the run directory. (standards-background-runs.md)
  - _Evidence scope:_ Coordinating-thread transcripts, project checkpoints, decisions logs and project recaps the owner selects for review.
  - _Review prompt:_ Did the coordinator avoid blocking the owner, does each project thread work through background agents from a current checkpoint, and does anything durable exist only in the run directory?
  - _Outcomes:_ conforming; delegate longer work; consolidate decisions; escalate to owner
  - _Conforming guidance:_ Move longer coordinator work into background agents, and consolidate in-force decisions into a Decision Record, skill or checkpoint; escalate to the master thread when a direction touches more than one Project.
- **RUN-4 [J] — threads park tangents, link records and keep checkouts current** — A coordinating thread parks passing side topics as dated one-line items under its checkpoint Open questions, cites and links every record, checkpoint, Initiative and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push. (standards-background-runs.md)
  - _Evidence scope:_ Coordinating-thread transcripts, status lines, reports, project recaps and checkpoints the owner selects for review.
  - _Review prompt:_ Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, checkpoint, Initiative or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered?
  - _Outcomes:_ conforming; park or home tangents; fix references; refresh checkouts; escalate to owner
  - _Conforming guidance:_ Move tangents into checkpoint Open questions or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it.
- **RUN-5 [J] — threads report answerably and refresh their guidance** — A coordinating thread tags each needs item mnemonically with plain context, a recommendation and links, asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work, and re-reads this skill's thread guidance at bootstrap, before each checkpoint update and whenever the skill has changed, noting the revision read in its checkpoint. (standards-background-runs.md)
  - _Evidence scope:_ Coordinating-thread transcripts, reports, summaries, decisions logs and checkpoints the owner selects for review.
  - _Review prompt:_ Could the owner answer each needs item cold by its tag, were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched, and does the checkpoint's noted ki-delegation revision match the skill's latest change?
  - _Outcomes:_ conforming; retag needs items; log decisions; refresh guidance; escalate to owner
  - _Conforming guidance:_ Give each needs item a mnemonic tag, plain context, a recommendation and links; record missing decisions before further launches; and re-read the thread guidance, update the noted revision and tell the owner what changed.
