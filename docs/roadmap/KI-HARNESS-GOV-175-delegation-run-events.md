---
id: KI-HARNESS-GOV-175
area: GOV
title: Delegation run events
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T13:53:25Z
updated_at: 2026-10-13T13:53:25Z
---

# Delegation Run Events

## Goal

The `ki-delegation` background-run standard names the events of a run that warrant the owner's attention and the one milestone status line an agent may write, states that `ki agent wait --next` and `ki agent watch` return failed, blocked and needs-owner events as well as finishes, and keeps the coordinating thread out of any delivery path, so that the launcher, every coordinator and every background agent share one vocabulary before any notification channel exists.

## Context

Knowledge Islands Principal owns the notification strategy for delegated work, record `KI-PRINCIPAL-ECO-012` in its Streams roadmap under the [ways-of-working](https://github.com/knowledgeislands/ki-principal/blob/main/Streams/Projects/ways-of-working/ways-of-working.md) Project. Kris adopted it on 2026-10-13 as `ADOPT` in Decision 17 of the `ways-of-working` run, with `HOME` (a): the strategy stays in the Capital and each delivery is handed to the repository that owns it. This record is the phase 1 handoff for the vocabulary and the progress-protocol wording; the sibling handoff for the mechanics is in `tools-ki`. The harness owns this record's priority, plan and acceptance.

Today the standard's Run packet, Run queue and Monitoring sections describe the status line, a waiter that "blocks until the next agent finishes, prints that agent's name and last status (or that it exited without `DONE`), and marks it seen", and a monitor that prints one status line per interval. The progress protocol appears only as a column in the packet table and in the text the launcher appends; there is no event vocabulary, no milestone line and no statement of what a coordinator should expect back from the waiter beyond a finish. The strategy's phase 1 adds exactly that and nothing about channels: the interim chat-only preference stands and becomes event-based.

The run that produced the strategy also showed why the vocabulary matters now: twice on 2026-10-13 the waiter returned an older finish rather than the newest, because the launcher orders agents by name rather than by what happened. The mechanics are `tools-ki`'s to fix; the standard's part is to say what the waiter returns and in what order.

## Boundary

- In scope: the five event kinds and the run-level close, each with its derivation rule; the milestone line form in the progress protocol and in the run-prompt skeleton; what the waiter and the monitor return; the coordinator reading events at its next turn and never waiting or relaying in the foreground; the privacy rule for anything derived from a packet, stated once so later phases inherit it; the skill's sources note.
- Out of scope: the notifier, channels, receipts, quiet hours, Telegram, Slack and the Observatory, which are phases 2 to 4 of the strategy; the owner-facing side of the vocabulary, which moves to `ki-pmo` once the PMO extraction pilot creates that skill; any change to the owner report shape set on 2026-10-13 as Decision 14 of the `ways-of-working` run.

## Requirements

1. Vocabulary: `progress` (a milestone line only), `done` (`DONE` written and the report present), `failed` (an exit without `DONE`, or a report that says the work failed), `blocked` (a gate that cannot open, a held agent whose predecessor failed, or a status line that says blocked), `needs-owner` (one per outstanding-query tag in an owner report) and the run-level `all finished`, each with the derivation rule the launcher implements.
2. Milestone line: the optional progress-protocol form `HH:MM TZ - milestone: <text>` marks meaningful progress; every other status line stays local. The run-prompt skeleton and the launcher's appended text carry the same wording.
3. Waiter and monitor: `wait --next` returns the next unseen event in the order it happened and marks that event seen; `watch` shows events as they appear and still ends `ALL FINISHED`. The Run queue and Monitoring sections say so in place of the finish-only wording.
4. Coordinator out of the path: a coordinator reads events at its next turn and re-arms the waiter; it never waits, polls or relays in the foreground. This restates Coordinator responsiveness rather than adding a rule.
5. Privacy: anything derived from a packet carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.

## Dependencies / blocks

- `tools-ki` delivers the mechanics: the events log, the derivation, the sequenced waiter and monitor and the milestone line in the appended progress protocol. Durable documentation: [the tools-ki README](https://github.com/knowledgeislands/tools-ki/blob/main/README.md), which describes `ki agent`. The wording can land before or after the mechanics, so this is a sequencing preference and `blocked_by` is empty.
- Knowledge Islands Principal owns the strategy, its phase plan and the owner decisions behind it; this record delivers phase 1 wording only.
- The PMO extraction pilot in Knowledge Islands Principal will move the thread material of this standard into `ki-pmo`; the event vocabulary stays with the run mechanics in `ki-delegation`, and the owner-facing side follows the move when it happens.

## Discussion

### Where the wording lives

The Run packet table gains the events log beside the status, pid, log and report files; the Run queue's waiter paragraph and the Monitoring section describe events rather than finishes; the Prompt shape or the skeleton carries the milestone line. Keeping the vocabulary with the run mechanics means the PMO extraction pilot moves thread practice without taking the event definitions with it.

### Detecting failure and outstanding queries

The strategy named "the report's Failed part" and "each Needs tag", from the report shape the owner report replaced. The owner report gives each outstanding query a heading `<tag> - <title>`, so `needs-owner` derives from those headings; material failures sit inside "What has been done" with no fixed marker, so `failed` needs a signal the standard can name, most simply the agent's final status line. Settle the rule here so the launcher implements one definition.

### Open questions

- Whether a `blocked` status line needs a fixed form mirroring the milestone line, so that derivation does not rely on free text.
- Whether the five kinds belong in the standard's body or in a short table the launcher's help can mirror verbatim.
