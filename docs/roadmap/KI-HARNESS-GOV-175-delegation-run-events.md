---
id: KI-HARNESS-GOV-175
area: GOV
title: Delegation run events
project: ways-of-working
component: governance
kind: deliver
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T13:53:25Z
updated_at: 2026-10-14T13:43:59Z
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
- Out of scope: the notifier, channels, receipts, quiet hours, Telegram, Slack and the Observatory, which are phases 2 to 4 of the strategy; the owner-facing side of the vocabulary, which moves to `ki-pmo` once the PMO extraction pilot creates that skill; any change to the owner report shape Kris set on 2026-10-13: "standardise owner reports through the ways-of-working process. Three sections in order: 1 What has been done (outcomes, material failures, corrections, limitations); 2 What is in progress ...; 3 Outstanding queries, each headed '<stable tag> - <plain title>'".

## Requirements

1. Vocabulary: `progress` (a milestone line only), `done` (`DONE` written and the report present), `failed` (an exit without `DONE`, or a report that says the work failed), `blocked` (a gate that cannot open, a held agent whose predecessor failed, or a status line that says blocked), `needs-owner` (one per outstanding-query tag in an owner report) and the run-level `all finished`, each with the derivation rule the launcher implements.
2. Milestone line: the optional progress-protocol form `HH:MM TZ - milestone: <text>` marks meaningful progress; every other status line stays local. The run-prompt skeleton and the launcher's appended text carry the same wording.
3. Waiter and monitor: `wait --next` returns the next unseen event in the order it happened and marks that event seen; `watch` shows events as they appear and still ends `ALL FINISHED`. The Run queue and Monitoring sections say so in place of the finish-only wording.
4. Coordinator out of the path: a coordinator reads events at its next turn and re-arms the waiter; it never waits, polls or relays in the foreground. This restates Coordinator responsiveness rather than adding a rule.
5. Privacy: anything derived from a packet carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.

## Current state

Adopted to `next` as a draft and not yet planned. The `ki-delegation` background-run standard describes a finish-only waiter and a status-line monitor, with no event vocabulary and no milestone line. This record waits for `KI-TOOL-KI-CLI-123` in `tools-ki` to be planned first, and `ki-plan` shapes the plan below before this record becomes Ready.

## Steps

- [ ] Shape this record through `ki-plan` against requirements 1 to 5, once the `tools-ki` mechanics are planned; no delivery step is planned yet.
- [ ] Plan the working-area mark rule merged from KI-HARNESS-GOV-184 as its own Steps in the same plan: settle the sidecar and front-matter field names, add the rule to the `ki-delegation` and `ki-diagrams` standards and rubrics, write the receipt fields in the `ki-diagrams` exporter, and reword the two SKILL.md summaries.

## Files touched

Not yet determined. The plan is expected to name `skills/governance/ki-delegation/references/standards-background-runs.md`, the skill's `SKILL.md` and `references/sources.md`, and the run-prompt skeleton.

## Verify

Not yet set. The plan names the exact gates; at minimum the `ki-skills` and `ki-authoring` audits on the skill and the repository test suite.

## Dependencies / blocks

- `tools-ki` delivers the mechanics: the events log, the derivation, the sequenced waiter and monitor and the milestone line in the appended progress protocol. Durable documentation: [the tools-ki README](https://github.com/knowledgeislands/tools-ki/blob/main/README.md), which describes `ki agent`. This record depends on that delivery: Kris set the order on 2026-10-13 as "tools-ki first", so `KI-TOOL-KI-CLI-123` in `tools-ki` is planned and delivered before this record, and the wording is written against the mechanics as they land. The dependency crosses repositories, so it lives here rather than in `blocked_by`, which names records in this repository only.
- Knowledge Islands Principal owns the strategy, its phase plan and the owner decisions behind it; this record delivers phase 1 wording only.
- The PMO extraction pilot in Knowledge Islands Principal will move the thread material of this standard into `ki-pmo`; the event vocabulary stays with the run mechanics in `ki-delegation`, and the owner-facing side follows the move when it happens.

## Documentation impact

### Decision Records

Not yet assessed; `ki-plan` states whether the event vocabulary needs a Decision Record or follows the strategy's existing decisions.

### Specifications

Not yet assessed; `ki-plan` states whether a behaviour-level contract changes.

### Guides

Not yet assessed; `ki-plan` states whether human guidance changes.

### Roadmap

Phases 2 to 4 of the notification strategy are later records in their owning repositories; this record adds none of them.

## Discussion

### Where the wording lives

The Run packet table gains the events log beside the status, pid, log and report files; the Run queue's waiter paragraph and the Monitoring section describe events rather than finishes; the Prompt shape or the skeleton carries the milestone line. Keeping the vocabulary with the run mechanics means the PMO extraction pilot moves thread practice without taking the event definitions with it.

### Detecting failure and outstanding queries

The strategy named "the report's Failed part" and "each Needs tag", from the report shape the owner report replaced. The owner report gives each outstanding query a heading `<tag> - <title>`, so `needs-owner` derives from those headings; material failures sit inside "What has been done" with no fixed marker, so `failed` needs a signal the standard can name, most simply the agent's final status line. Settle the rule here so the launcher implements one definition.

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

- Whether a `blocked` status line needs a fixed form mirroring the milestone line, so that derivation does not rely on free text.
- Whether the five kinds belong in the standard's body or in a short table the launcher's help can mirror verbatim.
