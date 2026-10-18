---
id: KI-HARNESS-GOV-175
area: GOV
title: Delegation run events
project: ways-of-working
component: governance
kind: deliver
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 0ae39eaca092303a2ae5e481b078a221f955e1d2
created_at: 2026-10-13T13:53:25Z
updated_at: 2026-10-18T07:10:00Z
---

# Delegation Run Events

## Goal

The `ki-delegation` background-run standard names the events of a run that warrant the owner's attention and the one milestone status line an agent may write, states that `ki agent wait --next` and `ki agent watch` return failed, blocked and needs-owner events as well as finishes, and keeps the coordinating thread out of any delivery path, so that the launcher, every coordinator and every background agent share one vocabulary before any notification channel exists.

## Context

Knowledge Islands Principal owns the notification strategy for delegated work, record `KI-PRINCIPAL-ECO-012` in its Streams roadmap under the [ways-of-working](https://github.com/knowledgeislands/ki-principal/blob/main/Streams/Projects/ways-of-working/ways-of-working.md) Project. Kris adopted the strategy on 2026-10-13, in his words "ADOPT adopt KI-PRINCIPAL-ECO-012 to draft through ki-next; hand phase 1 to tools-ki and the harness now", with the home decision "HOME (a) keep KI-PRINCIPAL-ECO-012 in ki-principal; hand deliveries to each repository": the strategy stays in the Capital and each delivery is handed to the repository that owns it. This record is the phase 1 handoff for the vocabulary and the progress-protocol wording; the sibling handoff for the mechanics is in `tools-ki`, record `KI-TOOL-KI-CLI-123`. Kris adopted both handoffs on 2026-10-13: "RECV-ADOPT - Adopt KI-TOOL-KI-CLI-123 and KI-HARNESS-GOV-175 draft next deliver; tools-ki first." The `tools-ki` record therefore comes first in order and this record depends on it. The harness owns this record's priority, plan and acceptance.

Today the standard's Run packet, Run queue and Monitoring sections describe the status line, a waiter that "blocks until the next agent finishes, prints that agent's name and last status (or that it exited without `DONE`), and marks it seen", and a monitor that prints one status line per interval. The progress protocol appears only as a column in the packet table and in the text the launcher appends; there is no event vocabulary, no milestone line and no statement of what a coordinator should expect back from the waiter beyond a finish. The strategy's phase 1 adds exactly that and nothing about channels: the interim chat-only preference stands and becomes event-based.

The run that produced the strategy also showed why the vocabulary matters now: twice on 2026-10-13 the waiter returned an older finish rather than the newest, because the launcher orders agents by name rather than by what happened. The mechanics are `tools-ki`'s to fix; the standard's part is to say what the waiter returns and in what order.

## Boundary

- In scope: the five event kinds and the run-level close, each with its derivation rule; the milestone line form in the progress protocol and in the run-prompt skeleton; what the waiter and the monitor return; the coordinator reading events at its next turn and never waiting or relaying in the foreground; the privacy rule for anything derived from a packet, stated once so later phases inherit it; the skill's sources note.
- Merged from KI-HARNESS-GOV-184 on 2026-10-14: the working-area mark rule, with its Goal, Boundary, Steps and open questions carried into Discussion below. The `ki-delegation` part lands in the same standard edit as the event vocabulary; the `ki-diagrams` part is a second Step of this record.
- Widened on 2026-10-15 (HEADING-LASTING): a mechanical `ki-pmo` rubric check that a saved report's first non-blank line is the report's `#` heading, or, for a report saved as a record with front matter, that the front matter comes first and the `#` heading is the first non-blank line after it; and one `ki-delegation` `assets/run-prompt.md` footer line saying so. Kris widened the record in these words: "Widen KI-HARNESS-GOV-175 to add a mechanical ki-pmo rubric check that a saved report's first non-blank line is the # heading (or that record's front matter, then the heading) and one ki-delegation run-prompt.md footer line saying so; no new record."
- Widened on 2026-10-16 (HARNESS-FOLLOW-ONS): the four wording follow-ons the delivered `tools-ki` mechanics need, carried as requirements 7 to 10. Kris widened the record in these words, taking option a) in the tools-burndown thread: "The next ki-agentic-harness session folds the four wording follow-ons (run events, ki-delegation flags, the coordinator-reminder Codex check, unique agent names) into KI-HARNESS-GOV-175 and lands them together." The four land in one delivery with requirements 1 to 6.
- Out of scope: the notifier, channels, receipts, quiet hours, Telegram, Slack and the Observatory, which are phases 2 to 4 of the strategy; the owner-facing side of the vocabulary, which moves to `ki-pmo` once the PMO extraction pilot creates that skill; any change to the owner report shape Kris set on 2026-10-13: "standardise owner reports through the ways-of-working process. Three sections in order: 1 What has been done (outcomes, material failures, corrections, limitations); 2 What is in progress ...; 3 Outstanding queries, each headed '<stable tag> - <plain title>'".

## Requirements

1. Vocabulary: `progress` (a milestone line only), `done` (`DONE` written and the report present), `failed` (an exit without `DONE`, or a report that says the work failed), `blocked` (a gate that cannot open, a held agent whose predecessor failed, or a status line that says blocked), `needs-owner` (one per outstanding-query tag in an owner report) and the run-level `all finished`, each with the derivation rule the launcher implements.
2. Milestone line: the optional progress-protocol form `HH:MM TZ - milestone: <text>` marks meaningful progress; every other status line stays local. The run-prompt skeleton and the launcher's appended text carry the same wording.
3. Waiter and monitor: `wait --next` returns the next unseen event in the order it happened and marks that event seen; `watch` shows events as they appear and still ends `ALL FINISHED`. The Run queue and Monitoring sections say so in place of the finish-only wording.
4. Coordinator out of the path: a coordinator reads events at its next turn and re-arms the waiter; it never waits, polls or relays in the foreground. This restates Coordinator responsiveness rather than adding a rule.
5. Privacy: anything derived from a packet carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.
6. Report heading: a `ki-pmo` rubric item, PMO-12, reads every `*.report.md` in each `+/_WORK/<id>/` folder, and for the tolerance window each `+/_THREADS/<run>/` folder, and flags one whose first non-blank line is not a `#` heading, skipping a leading front-matter block first; the regenerated `rubric.md` lists it. `assets/run-prompt.md` gains one footer line: the report's first non-blank line is its `#` heading, after front matter if the report has any. PMO-10 now holds the coordinating-checkpoint role check that [KI-HARNESS-GOV-199](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-199-thread-identity-role-native-sessions.md) delivered, and PMO-11 went to the recommendation-confidence check under KI-HARNESS-GOV-207, so this item takes PMO-12, the next free number on 18 October 2026.
7. Run events wording: the event vocabulary and the `milestone:`, `blocked:` and `failed:` status lines quote the protocol sentence the launcher now appends, as the proposed text: "For a milestone the coordinator should hear about, write the line as 'HH:MM <zone> - milestone: <text>'; when you are blocked or the work has failed, as 'HH:MM <zone> - blocked: <text>' or 'HH:MM <zone> - failed: <text>'." This settles the open question on a fixed `blocked` form.
8. Inbox idiom: the `ki agent decide <run> --log <inbox>` idiom for writing to a thread's inbox, described in `ki-pmo`'s messages surface and anywhere `ki-delegation` names it, is retired in favour of `ki agent send`.
9. Coordinator reminder: `hooks/coordinator-reminder.sh` drops its own Codex terminal check, because the `KI_AGENT_RUN` marker the launcher now sets on both runtimes makes it unnecessary; the hook test follows.
10. Unique names: the run-packet table states that an agent's name is unique within a run.

## Current state

Requirements 1 to 10 have landed, planned on 18 October 2026 against the delivered `tools-ki` mechanics of KI-TOOL-KI-CLI-123, read at `src/core/agent/events.ts` and `runs.ts`: the event kinds, their derivation, the waiter's `waitedKinds` and the protocol sentence are the launcher's as written. The working-area mark rule merged from KI-HARNESS-GOV-184 is not built: its sidecar and field names are still open questions below, and its `ki-diagrams` exporter change is a separate delivery, so the record stays in progress until the owner settles them or splits the rule out.

## Steps

- [x] Shape this record against requirements 1 to 5 and the delivered `tools-ki` mechanics: a Run events subsection in the background-run standard with the event table, the status forms, the run-level close and the privacy rule; the Run packet table naming `events.seen` and dropping the retired `seen` list; the Waiter bullet and Monitoring section describing events; the Reference launcher naming `send`, the derivation and `KI_AGENT_RUN`; the SKILL summary and the sources note.
- [ ] Plan the working-area mark rule merged from KI-HARNESS-GOV-184 as its own Steps in the same plan: settle the sidecar and front-matter field names, add the rule to the `ki-delegation` and `ki-diagrams` standards and rubrics, write the receipt fields in the `ki-diagrams` exporter, and reword the two SKILL.md summaries. Waiting on the owner, MARK-RULE-SPLIT in the roadmap-next report.
- [x] Plan the HEADING-LASTING widening as its own Steps: the PMO-12 rubric item with boundary tests, at WARN, `rubric.md` regenerated through `ki dev skill rubric ki-pmo --write`, and the run-report source line, regenerated into `assets/run-prompt.md`.
- [x] Plan the HARNESS-FOLLOW-ONS widening as its own Steps, landing with the rest: the run-events and status-line wording quoting the launcher's protocol sentence (requirement 7); the `--log` inbox idiom replaced by `ki agent send` in `ki-pmo` (requirement 8; `ki-delegation` never named it); the Codex terminal check removed from `hooks/coordinator-reminder.sh`, with its test, `hooks/README.md` and the `ki-pmo` hook paragraph following (requirement 9); and the unique-name rule beside the run-packet table (requirement 10).

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`, `SKILL.md`, `references/sources.md`, `assets/run-prompt.md` (generated)
- `skills/change-management/ki-pmo/references/standards-pmo.md`, `references/rubric.md` (generated), `scripts/rubric/contexts/pmo.ts`, `pmo.test.ts`, `scripts/rubric/items/threads.ts`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- this record

## Verify

`bun run test`, `bunx tsc --noEmit`, `ki dev skill rubric ki-pmo` and `ki repo audit --skill ki-delegation`, `--skill ki-pmo`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap`, run sequentially. The PMO-12 tests carry a fixture report that opens with a frame and fails and one that opens with front matter then the heading and passes.

## Dependencies / blocks

- `tools-ki` delivers the mechanics: the events log, the derivation, the sequenced waiter and monitor and the milestone line in the appended progress protocol. Durable documentation: [the tools-ki README](https://github.com/knowledgeislands/tools-ki/blob/main/README.md), which describes `ki agent`. This record depends on that delivery: Kris set the order on 2026-10-13 as "tools-ki first", so `KI-TOOL-KI-CLI-123` in `tools-ki` is planned and delivered before this record, and the wording is written against the mechanics as they land. The dependency crosses repositories, so it lives here rather than in `blocked_by`, which names records in this repository only.
- Knowledge Islands Principal owns the strategy, its phase plan and the owner decisions behind it; this record delivers phase 1 wording only.
- The PMO extraction pilot in Knowledge Islands Principal will move the thread material of this standard into `ki-pmo`; the event vocabulary stays with the run mechanics in `ki-delegation`, and the owner-facing side follows the move when it happens.

## Documentation impact

### Decision Records

None: the vocabulary follows the strategy's existing decisions, Kris's ADOPT, HOME and RECV-ADOPT of 2026-10-13, quoted in the standard and its sources note.

### Specifications

None: the background-run standard is the contract and changes in place, and the launcher's behaviour is `tools-ki`'s.

### Guides

None: the `tools-ki` README describes `ki agent`, and its `wait`, `watch` and `send` help already matches.

### Roadmap

Phases 2 to 4 of the notification strategy are later records in their owning repositories; this record adds none of them.

## Review

Evidence for requirements 1 to 10 from the roadmap-next run, 18 October 2026; the record stays in progress for the mark rule:

- The background-run standard's new Run events subsection names the seven kinds the launcher derives, with the derivation `tools-ki` implements in `src/core/agent/events.ts`; it quotes the launcher's protocol sentence verbatim from `composePrompt` in `runs.ts`, says every other status line stays local, gives the run-level `ALL FINISHED` and states the privacy rule. The Waiter bullet names the four kinds `wait --next` returns, matching `waitedKinds`, and the Monitoring section the events `watch` prints.
- The Run packet table names `events.seen` and drops the `seen` list the launcher no longer writes; the unique-name rule follows the table, matching the launcher's refusal of a name that has already run and its `--relaunch` attempt.
- `ki-pmo`'s messages surface names `ki agent send <run> <line>` in place of `decide --log`; no `ki-delegation` text named the old idiom.
- `hooks/coordinator-reminder.sh` keeps only the run marker and the print-mode ceiling, since `runtimes.ts` sets `KI_AGENT_RUN` for both adapters; the terminal tests and the `ps` wrapper went from the hook test, and `hooks/README.md` and the `ki-pmo` hook paragraph follow.
- PMO-12 flags any work report whose first non-blank line is not its `#` heading, after front matter if it has any, at WARN, because 14 reports in other work's folders in ki-principal open with a lint directive or a frame; the run-report source gains the matching line, regenerated into `assets/run-prompt.md`, and `rubric.md` is regenerated. The remediation inventory test counts the new diagnostic criterion.
- `bun run test` passes, 1247 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric ki-pmo` verifies; `ki repo audit --skill ki-delegation`, `--skill ki-pmo`, `--skill ki-work-roadmap` and `--skill ki-checkpoint` pass; `--skill ki-skills` passes with the three existing LONG-3 warnings KI-HARNESS-GOV-194 tracks; `--skill ki-authoring` passes once the older KI-HARNESS-GOV-189 fragment is repointed in its own commit.

## Discussion

### Where the wording lives

The Run packet table gains the events log beside the status, pid, log and report files; the Run queue's waiter paragraph and the Monitoring section describe events rather than finishes; the Prompt shape or the skeleton carries the milestone line. Keeping the vocabulary with the run mechanics means the PMO extraction pilot moves thread practice without taking the event definitions with it.

### Detecting failure and outstanding queries

The strategy named "the report's Failed part" and "each Needs tag", from the report shape the owner report replaced. The owner report gives each outstanding query a heading `<tag> - <title>`, so `needs-owner` derives from those headings; material failures sit inside "Done" with no fixed marker, so `failed` needs a signal the standard can name, most simply the agent's final status line. Settle the rule here so the launcher implements one definition.

### Merged from KI-HARNESS-GOV-184 on 2026-10-14

Kris approved merging KI-HARNESS-GOV-184 into this record on 14 October 2026 in the state-of-play thread's roadmap census ('RC-ALL: approve all; ways-of-working applies the harness part'), because both records edit the `ki-delegation` background-run standard under the ways-of-working Project and one plan serves them. Its scope and decisions, carried as written:

**Goal.** Every file an agent or a session writes into a repository's `+/` working area says who wrote it and when: the thread it belongs to, the background run and agent or the interactive session that wrote it, and the time. A later reader, agent or owner, can tell at a glance whether a working file is current, whose it is, and which run to ask before moving or deleting it.

**Owner decisions.** Kris confirmed the rule on 2026-10-14, in these words: "MARK-RULE - yes, that reading; capture as a harness deliver record at next." In the same answer set Kris chose how to tidy the scratch that prompted it: "DIAGRAMS-TIDY - (b) delete scratch and rebuild the stale HTML after the push; keep +/diagrams/ visible." The rebuilt `skill-graph` and `skill-map` folders under this repository's `+/diagrams/` carry a `mark.toml` sidecar written by the `mark-tidy` run as a hand-made early application of the rule.

**Boundary.**

- `ki-delegation`: the background-run standard gains the mark rule as a rule on what a run writes into a working area, naming the fields (thread, run and agent or session, time), the Markdown front-matter form and the sidecar form for a folder, and saying that a coordinating thread or an interactive session marks its own working files the same way. The rubric gains the matching criterion and `rubric.md` is regenerated.
- `ki-diagrams`: the diagrams standard's working-folder rule under `+/diagrams/<slug>/` names the sidecar and its fields, and the delivery receipt the exporter or the finalize step writes beside the HTML gains the same fields. The rubric gains the matching criterion and `rubric.md` is regenerated.
- The two skills' SKILL.md summaries are reworded only where they list what the standards cover.
- Not the `+/README.md` text in adopting repositories, which `ki-repo` owns; not Git tracking of `+/`; not a tidy-up tool that acts on marks, which is a later record if wanted; not any checkpoint, decisions log or Project note.

**Steps carried.** Settle the sidecar's name and field names and the front-matter field names, checking the two hand-written `mark.toml` files against the choice; add the rule to the `ki-delegation` standard and rubric; add the sidecar and receipt fields to the `ki-diagrams` standard and rubric; make the exporter or finalize wrapper write the fields into the delivery receipt, with a boundary test; reword the two SKILL.md summaries. Files: `skills/governance/ki-delegation/references/standards-background-runs.md`, `rubric.md` and `SKILL.md`; `skills/governance/ki-diagrams/references/standards-diagrams.md`, `rubric.md`, `SKILL.md`, and `scripts/export-svg.ts` with its test if the receipt fields are written there. Verify: `ki repo audit --skill ki-diagrams` and `ki dev skill rubric ki-diagrams` join this record's gates, and a diagram rebuilt by the documented route leaves a sidecar and a receipt naming the thread, the run and agent or session, and the time.

**Forms.** Markdown carries the mark in front matter; a folder of non-Markdown output carries one small sidecar at its root (the hand-written example is `mark.toml` with `thread`, `run`, `agent`, `written_at` and `rebuilt_from`); the `ki-diagrams` receipt carries the same fields. A mark is not provenance for committed work, which Git carries, and says nothing about retention.

**Open questions carried.** Whether a coordinating thread working interactively writes `session` where a background run writes `run` and `agent`, or one `writer` field covers both; and whether the sidecar is TOML or a front-matter-only Markdown file.

### Open questions

- Whether a `blocked` status line needs a fixed form mirroring the milestone line: the launcher's protocol sentence now gives one, `HH:MM <zone> - blocked: <text>`, which requirement 7 adopts.
- Whether the five kinds belong in the standard's body or in a short table the launcher's help can mirror verbatim.
