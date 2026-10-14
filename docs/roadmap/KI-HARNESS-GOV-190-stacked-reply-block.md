---
id: KI-HARNESS-GOV-190
area: GOV
title: stacked reply block
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: done
blocks: []
blocked_by: []
baseline_ref: b8d92be9fc7f11950d82142a076d7a8d39d7a8bd
created_at: 2026-10-14T16:30:53Z
updated_at: 2026-10-14T16:33:39Z
---

# Stack Each Reply-Block Query on Its Own Lines

## Goal

The copyable reply block at the end of an owner report lays each query out as its Needs tag alone on one line, a blank line, then the recommended instruction, with a `---` separator between queries, so that the owner can read and edit a long instruction without one dense line per query.

## Context

The reply block was set by Kris on 2026-10-13 as one fenced `text` block holding every actionable query's tag and recommended instruction, and corrected on 2026-10-14 to carry the recommended instruction and never a menu: "the proposed copy block is including all the options, rather than the recommended option." Since the linking rule took hold, each line now carries record links and several references, and a single line per query has become hard to read. Kris asked on 2026-10-14 in the ways-of-working thread, in these words: "Can we see the way that the default copy block is? So it's easier to use it. There's often quite a lot of detail now on per line." He gave the stacked form as the target.

The rule is owned by `ki-delegation`'s Reporting section. `ki-pmo`'s standard, the `ki-coordinator` output style, the coordinator-reminder hook line, the RUN-4 and PMO-6 rubric items and the banner test restate or assert it.

## Boundary

- In scope: the reply-block rule in `ki-delegation`'s standard and Needs-tags section; its restatements in `ki-pmo`'s standard, the output style, the hook line and its test, the RUN-4 and PMO-6 rubric items and their generated rubrics, `scripts/banner.test.ts`, and any example of the one-line form in skill sources, references or `docs/`.
- Out of scope: KI-HARNESS-GOV-187 and KI-HARNESS-GOV-188, which are awaiting review and untouched; any `tools-ki` change; any checkpoint, `Admin`, `Pillars` or `Resources`.

## Requirements

1. The reply block stays one `text` code block containing every query. Each query is the tag alone on its own line, a blank line, then the recommended instruction without a `<tag> - ` prefix; between queries a blank line, `---` and a blank line; no `---` after the last query; a report with no queries keeps `No reply needed.`
2. Everything else in the reply-block rule stands: one entry per query in the same tags and order, the instruction ready to send as it stands, never a menu, an angle-bracket placeholder only where the owner alone can supply a value, a suggestion and not approval.
3. The owner's side still works: a returned reply pairs a tag line with the instruction paragraph that follows it, and a bare "TAG do it" reply still names its query.
4. `ki-pmo`'s standard, the output style, the hook line and its test, RUN-4, PMO-6, the generated rubrics and the banner test say the same thing, and no example of the one-line form remains.
5. `bun run test`, `bunx tsc --noEmit`, the skill-graph check, the hook tests and the focused audits for `ki-delegation`, `ki-pmo`, `ki-skills` and `ki-work-roadmap` pass on the combined result.

## Current state

Delivered on harness `main` from baseline `b8d92be9` as one commit after the ledger advance, with every gate passing. Closed as done under the brief's "close it if verified".

## Steps

- [x] Rewrite the reply-block and Needs-tags rules in `ki-delegation`'s standard and sources.
- [x] Restate in `ki-pmo`'s standard including the full summary and the DEFAULTS query, the output style, the hook line, its test and the banner test.
- [x] Reword RUN-4 and PMO-6 and regenerate both rubrics; search for and replace any remaining one-line example.
- [x] Run the gates; commit by explicit path; pull with rebase and push fast-forward.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`.
- `skills/change-management/ki-pmo/references/standards-pmo.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/threads.ts`, `scripts/banner.test.ts`.
- `output-styles/ki-coordinator.md`, `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`.

## Verify

- `bun run test`, `bunx tsc --noEmit`, `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`, `bun test hooks/coordinator-reminder.test.ts`.
- `ki repo audit --skill ki-delegation`, `ki-pmo`, `ki-skills`, `ki-work-roadmap`.
- A search across the harness for the `<tag> - <recommended instruction>` form finds only this record.

## Dependencies / blocks

- KI-HARNESS-GOV-187 and KI-HARNESS-GOV-188 touch the same standards and are awaiting review; this record edits only the reply-block wording and leaves their records alone.

## Documentation impact

### Decision Records

None.

### Specifications

None. HARN-012 and HARN-013 name the prefilled reply block without stating its layout.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

The reply block at the end of every owner report now stacks each query: the Needs tag alone on its line, a blank line, the recommended instruction, and a `---` between entries. `ki-delegation`'s standard owns the rule and shows a two-query example; `ki-pmo`'s full summary and `DEFAULTS` entry, the `ki-coordinator` output style, the coordinator-reminder hook line, its test, the banner test and RUN-4 say the same.

### Change Summary

- `ki-delegation`: the reply-block bullet states the stacked entry, the `No reply needed.` case and the example; the Needs-tags paragraph says a returned reply pairs each tag line with the paragraph beneath it and that a bare `BOT-1 do it` still names its query; RUN-4's description, prompt and guidance review the stacked entry; the rubric is regenerated; sources carry the review.
- `ki-pmo`: the full summary's reply-block bullet and the `DEFAULTS` entry stack; sources carry the review; `scripts/banner.test.ts` asserts the hook's stacked wording. PMO-6 does not review the reply block and is unchanged; no `ki-pmo` rubric item mentions it, so the generated rubric is already in sync.
- Output style and hook: the owner-report paragraph describes the stacked entry and `No reply needed.`; the hook line reads "each reply-block entry stacks its tag on one line, a blank line, then the recommended instruction, never a menu of options, with --- between entries", and `hooks/coordinator-reminder.test.ts` carries the same line.
- No one-line `<tag> - <recommended instruction>` example remained in skill sources, references or `docs/` beyond the rule text itself; the search in Verify finds only this record.

### Verification

`bun run test` (1142 pass, 0 fail), `bunx tsc --noEmit`, the skill-graph check, `bun test hooks/coordinator-reminder.test.ts` with the banner test, and `ki repo audit --skill` for `ki-delegation`, `ki-pmo`, `ki-skills` and `ki-work-roadmap` pass on the combined result. The `ki-skills` audit carries two pre-existing warnings outside this scope: two `ki-skills` sources past their refresh cadence.

### Outstanding concerns

- Owner reports already written in the one-line form stay as they are; a thread adopts the stacked form at its next report.
- The hook line is injected on every owner message; the longer sentence costs a few tokens per turn.

### Post-change review

The owner-side reading of a reply needs no code: no tool parses the reply block, and a coordinating thread reads a returned tag line and the instruction paragraph after it as one answer. The catalogue and the diagram stamps did not change because no skill frontmatter changed.

### Mini recap

The copyable reply block is now stacked per query, as Kris asked, in the rule, its restatements, the hook and the tests.

## Done

Closed 2026-10-14 under the brief Kris's coordinating thread issued for this record, which said "deliver it, and close it if verified", with Kris's request quoted in Context. Verified at close: `bun run test` 1142 pass, `bunx tsc --noEmit` clean, the skill-graph check in sync, the hook and banner tests 19 pass, and `ki repo audit --skill` for `ki-delegation`, `ki-pmo`, `ki-skills` and `ki-work-roadmap` with no failure.

## Discussion

### Why the rule keeps one code block

Kris's target keeps every query in one `text` block, so one copy button still returns the whole reply; the `---` separators give the owner the per-query boundary without splitting the block.
