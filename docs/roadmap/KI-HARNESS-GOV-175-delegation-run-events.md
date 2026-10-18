---
id: KI-HARNESS-GOV-175
area: GOV
title: Delegation run events
project: ways-of-working
component: governance
kind: deliver
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 0ae39eaca092303a2ae5e481b078a221f955e1d2
created_at: 2026-10-13T13:53:25Z
updated_at: 2026-10-18T09:02:41Z
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
- Split out on 18 October 2026 (MARK-RULE-SPLIT): the working-area mark rule, merged from KI-HARNESS-GOV-184 on 2026-10-14, moved to its own triage record, [KI-HARNESS-GOV-214](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-214-working-area-marks.md), with its scope, history and open field-name questions. Kris answered in these words: "MARK-RULE-SPLIT a) - split the mark rule into its own harness record; KI-HARNESS-GOV-175 to Awaiting review."
- Widened on 2026-10-15 (HEADING-LASTING): a mechanical `ki-coordination` rubric check that a saved report's first non-blank line is the report's `#` heading, or, for a report saved as a record with front matter, that the front matter comes first and the `#` heading is the first non-blank line after it; and one `ki-delegation` `assets/run-prompt.md` footer line saying so. Kris widened the record in these words: "Widen KI-HARNESS-GOV-175 to add a mechanical ki-coordination rubric check that a saved report's first non-blank line is the # heading (or that record's front matter, then the heading) and one ki-delegation run-prompt.md footer line saying so; no new record."
- Widened on 2026-10-16 (HARNESS-FOLLOW-ONS): the four wording follow-ons the delivered `tools-ki` mechanics need, carried as requirements 7 to 10. Kris widened the record in these words, taking option a) in the tools-burndown thread: "The next ki-agentic-harness session folds the four wording follow-ons (run events, ki-delegation flags, the coordinator-reminder Codex check, unique agent names) into KI-HARNESS-GOV-175 and lands them together." The four land in one delivery with requirements 1 to 6.
- Out of scope: the notifier, channels, receipts, quiet hours, Telegram, Slack and the Observatory, which are phases 2 to 4 of the strategy; the owner-facing side of the vocabulary, which moves to `ki-coordination` once the PMO extraction pilot creates that skill; any change to the owner report shape Kris set on 2026-10-13: "standardise owner reports through the ways-of-working process. Three sections in order: 1 What has been done (outcomes, material failures, corrections, limitations); 2 What is in progress ...; 3 Outstanding queries, each headed '<stable tag> - <plain title>'".

## Requirements

1. Vocabulary: `progress` (a milestone line only), `done` (`DONE` written and the report present), `failed` (an exit without `DONE`, or a report that says the work failed), `blocked` (a gate that cannot open, a held agent whose predecessor failed, or a status line that says blocked), `needs-owner` (one per outstanding-query tag in an owner report) and the run-level `all finished`, each with the derivation rule the launcher implements.
2. Milestone line: the optional progress-protocol form `HH:MM TZ - milestone: <text>` marks meaningful progress; every other status line stays local. The run-prompt skeleton and the launcher's appended text carry the same wording.
3. Waiter and monitor: `wait --next` returns the next unseen event in the order it happened and marks that event seen; `watch` shows events as they appear and still ends `ALL FINISHED`. The Run queue and Monitoring sections say so in place of the finish-only wording.
4. Coordinator out of the path: a coordinator reads events at its next turn and re-arms the waiter; it never waits, polls or relays in the foreground. This restates Coordinator responsiveness rather than adding a rule.
5. Privacy: anything derived from a packet carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.
6. Report heading: a `ki-coordination` rubric item, COORD-12, reads every `*.report.md` in each `+/_WORK/<id>/` folder, and for the tolerance window each `+/_THREADS/<run>/` folder, and flags one whose first non-blank line is not a `#` heading, skipping a leading front-matter block first; the regenerated `rubric.md` lists it. `assets/run-prompt.md` gains one footer line: the report's first non-blank line is its `#` heading, after front matter if the report has any. COORD-10 now holds the coordinating-checkpoint role check that [KI-HARNESS-GOV-199](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-199-thread-identity-role-native-sessions.md) delivered, and COORD-11 went to the recommendation-confidence check under KI-HARNESS-GOV-207, so this item takes COORD-12, the next free number on 18 October 2026.
7. Run events wording: the event vocabulary and the `milestone:`, `blocked:` and `failed:` status lines quote the protocol sentence the launcher now appends, as the proposed text: "For a milestone the coordinator should hear about, write the line as 'HH:MM <zone> - milestone: <text>'; when you are blocked or the work has failed, as 'HH:MM <zone> - blocked: <text>' or 'HH:MM <zone> - failed: <text>'." This settles the open question on a fixed `blocked` form.
8. Inbox idiom: the `ki agent decide <run> --log <inbox>` idiom for writing to a thread's inbox, described in `ki-coordination`'s messages surface and anywhere `ki-delegation` names it, is retired in favour of `ki agent send`.
9. Coordinator reminder: `hooks/coordinator-reminder.sh` drops its own Codex terminal check, because the `KI_AGENT_RUN` marker the launcher now sets on both runtimes makes it unnecessary; the hook test follows.
10. Unique names: the run-packet table states that an agent's name is unique within a run.

## Current state

Requirements 1 to 10 have landed, planned on 18 October 2026 against the delivered `tools-ki` mechanics of KI-TOOL-KI-CLI-123, read at `src/core/agent/events.ts` and `runs.ts`: the event kinds, their derivation, the waiter's `waitedKinds` and the protocol sentence are the launcher's as written. The working-area mark rule merged from KI-HARNESS-GOV-184 was split out to [KI-HARNESS-GOV-214](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-214-working-area-marks.md) on 18 October 2026 and is not part of this delivery.

## Steps

- [x] Shape this record against requirements 1 to 5 and the delivered `tools-ki` mechanics: a Run events subsection in the background-run standard with the event table, the status forms, the run-level close and the privacy rule; the Run packet table naming `events.seen` and dropping the retired `seen` list; the Waiter bullet and Monitoring section describing events; the Reference launcher naming `send`, the derivation and `KI_AGENT_RUN`; the SKILL summary and the sources note.
- [x] Split the working-area mark rule merged from KI-HARNESS-GOV-184 out to [KI-HARNESS-GOV-214](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-214-working-area-marks.md), carrying its open field-name questions, on the owner's MARK-RULE-SPLIT a) answer.
- [x] Plan the HEADING-LASTING widening as its own Steps: the COORD-12 rubric item with boundary tests, at WARN, `rubric.md` regenerated through `ki dev skill rubric ki-coordination --write`, and the run-report source line, regenerated into `assets/run-prompt.md`.
- [x] Plan the HARNESS-FOLLOW-ONS widening as its own Steps, landing with the rest: the run-events and status-line wording quoting the launcher's protocol sentence (requirement 7); the `--log` inbox idiom replaced by `ki agent send` in `ki-coordination` (requirement 8; `ki-delegation` never named it); the Codex terminal check removed from `hooks/coordinator-reminder.sh`, with its test, `hooks/README.md` and the `ki-coordination` hook paragraph following (requirement 9); and the unique-name rule beside the run-packet table (requirement 10).

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`, `SKILL.md`, `references/sources.md`, `assets/run-prompt.md` (generated)
- `skills/change-management/ki-coordination/references/standards-coordination.md`, `references/rubric.md` (generated), `scripts/rubric/contexts/coordination.ts`, `coordination.test.ts`, `scripts/rubric/items/threads.ts`
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`
- this record

## Verify

`bun run test`, `bunx tsc --noEmit`, `ki dev skill rubric ki-coordination` and `ki repo audit --skill ki-delegation`, `--skill ki-coordination`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap`, run sequentially. The COORD-12 tests carry a fixture report that opens with a frame and fails and one that opens with front matter then the heading and passes.

## Dependencies / blocks

- `tools-ki` delivers the mechanics: the events log, the derivation, the sequenced waiter and monitor and the milestone line in the appended progress protocol. Durable documentation: [the tools-ki README](https://github.com/knowledgeislands/tools-ki/blob/main/README.md), which describes `ki agent`. This record depends on that delivery: Kris set the order on 2026-10-13 as "tools-ki first", so `KI-TOOL-KI-CLI-123` in `tools-ki` is planned and delivered before this record, and the wording is written against the mechanics as they land. The dependency crosses repositories, so it lives here rather than in `blocked_by`, which names records in this repository only.
- Knowledge Islands Principal owns the strategy, its phase plan and the owner decisions behind it; this record delivers phase 1 wording only.
- The PMO extraction pilot in Knowledge Islands Principal will move the thread material of this standard into `ki-coordination`; the event vocabulary stays with the run mechanics in `ki-delegation`, and the owner-facing side follows the move when it happens.

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

### Delivered

The approved boundary from baseline `0ae39eaca092303a2ae5e481b078a221f955e1d2`, requirements 1 to 10: the event vocabulary, milestone, blocked and failed status lines, the waiter and monitor wording, the coordinator out of the delivery path and the privacy rule in the `ki-delegation` background-run standard; COORD-12 at WARN with its run-prompt footer line; the `ki agent send` inbox idiom; the reduced coordinator-reminder hook; and the unique-name rule. The working-area mark rule left the boundary for [KI-HARNESS-GOV-214](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-214-working-area-marks.md) on 18 October 2026. Nothing is released.

### Change Summary

- The background-run standard's new Run events subsection names the seven kinds the launcher derives, with the derivation `tools-ki` implements in `src/core/agent/events.ts`; it quotes the launcher's protocol sentence verbatim from `composePrompt` in `runs.ts`, says every other status line stays local, gives the run-level `ALL FINISHED` and states the privacy rule. The Waiter bullet names the four kinds `wait --next` returns, matching `waitedKinds`, and the Monitoring section the events `watch` prints.
- The Run packet table names `events.seen` and drops the `seen` list the launcher no longer writes; the unique-name rule follows the table, matching the launcher's refusal of a name that has already run and its `--relaunch` attempt.
- `ki-coordination`'s messages surface names `ki agent send <run> <line>` in place of `decide --log`; no `ki-delegation` text named the old idiom.
- `hooks/coordinator-reminder.sh` keeps only the run marker and the print-mode ceiling, since `runtimes.ts` sets `KI_AGENT_RUN` for both adapters; the terminal tests and the `ps` wrapper went from the hook test, and `hooks/README.md` and the `ki-coordination` hook paragraph follow.
- COORD-12 flags any work report whose first non-blank line is not its `#` heading, after front matter if it has any, at WARN, because 14 reports in other work's folders in ki-principal open with a lint directive or a frame; the run-report source gains the matching line, regenerated into `assets/run-prompt.md`, and `rubric.md` is regenerated. The remediation inventory test counts the new diagnostic criterion.

### Verification

- `bun run test` passes, 1247 tests at delivery; `bunx tsc --noEmit` passes; `ki dev skill rubric ki-coordination` verifies; `ki repo audit --skill ki-delegation`, `--skill ki-coordination`, `--skill ki-work-roadmap` and `--skill ki-work-folder` pass; `--skill ki-skills` passes with the three existing LONG-3 warnings KI-HARNESS-GOV-194 tracks; `--skill ki-authoring` passes once the older KI-HARNESS-GOV-189 fragment is repointed in its own commit.
- Re-run on 18 October 2026 after the split, with KI-HARNESS-GOV-212 and KI-HARNESS-GOV-213 landed: `bun run test` passes, 1253 tests; `bunx tsc --noEmit` passes; `ki dev skill rubric ki-coordination` verifies and `ki dev skill rubric ki-delegation` verifies once RUN-4's source drops the leading space in its `› <run name>` code span, which the Markdown fixer strips from the generated `rubric.md`, committed on its own; `ki repo audit --skill ki-delegation`, `--skill ki-coordination`, `--skill ki-repo`, `--skill ki-work-folder`, `--skill ki-authoring` and `--skill ki-work-roadmap` pass; `--skill ki-skills` has no failure and the same three LONG-3 warnings.

### Outstanding concerns

- COORD-12 stays WARN until the older work folders are pruned; its promotion to FAIL is [KI-HARNESS-GOV-215](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-215-pmo-12-to-fail.md), on hold until then.
- The owner-facing side of the event vocabulary moves to `ki-coordination` only as the PMO extraction continues; phases 2 to 4 of the notification strategy belong to their owning repositories.

### Post-change review

Reviewer: pending; this record awaits an independent review before acceptance.

### Mini recap

`ki-delegation` now names the events of a run and the status lines that raise them, matching the `tools-ki` launcher; `ki-coordination` warns on a work report that does not open with its heading.

## Discussion

### Where the wording lives

The Run packet table gains the events log beside the status, pid, log and report files; the Run queue's waiter paragraph and the Monitoring section describe events rather than finishes; the Prompt shape or the skeleton carries the milestone line. Keeping the vocabulary with the run mechanics means the PMO extraction pilot moves thread practice without taking the event definitions with it.

### Detecting failure and outstanding queries

The strategy named "the report's Failed part" and "each Needs tag", from the report shape the owner report replaced. The owner report gives each outstanding query a heading `<tag> - <title>`, so `needs-owner` derives from those headings; material failures sit inside "Done" with no fixed marker, so `failed` needs a signal the standard can name, most simply the agent's final status line. Settle the rule here so the launcher implements one definition.

### Mark rule split out

The working-area mark rule merged from KI-HARNESS-GOV-184 on 14 October 2026 moved on 18 October 2026 to [KI-HARNESS-GOV-214](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-214-working-area-marks.md), which carries its Goal, Boundary, owner decisions, Steps, forms and the open field-name questions for the owner.

### COORD-12 level

Kris settled COORD-12's level on 18 October 2026 in these words: "PMO12-LEVEL a) - COORD-12 stays WARN, a leading lint directive still fails it, promote to FAIL once folders are pruned." COORD-12 therefore lands at WARN; a report that opens with a lint directive such as `<!-- markdownlint-disable -->` before its heading still fails the check, with no exemption; and the promotion to FAIL is [KI-HARNESS-GOV-215](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-215-pmo-12-to-fail.md), held until no report COORD-12 reads opens with anything but its heading.

### Open questions

- Whether a `blocked` status line needs a fixed form mirroring the milestone line: the launcher's protocol sentence now gives one, `HH:MM <zone> - blocked: <text>`, which requirement 7 adopts.
- Whether the five kinds belong in the standard's body or in a short table the launcher's help can mirror verbatim.
