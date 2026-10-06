---
id: KI-HARNESS-GOV-098
area: GOV
title: Render every derived signal
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-10-06T21:19:43Z
---

# KI-HARNESS-GOV-098: Render every derived signal

## Goal

A count a view reports and the rows that view renders agree, so a reader who is told something was raised can find it.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. That repository composes an attention surface from signals each instrument derives about its own subject, and each instrument's view both renders its subjects as rows and reports how many signals it raised.

One signal kind broke the correspondence. Four of the five structural checks over Decision Records name a record as their subject, so each attaches to a row. The fifth - a serial run that is not contiguous from `001` - has a _run_ as its subject, not a record, so it had no row to attach to. The summary counted it; the outline showed it nowhere. The defect surfaced only because a test asserted the on-screen count, which read `2 raised` against one visible tag.

The general shape: a derivation whose subject space is wider than the view's row space produces signals that are counted and invisible. The count is the honest part and the view is the lie, which is the worse way round - a reader who trusts the count goes looking and concludes the tool is broken, and a reader who trusts the rows concludes nothing was raised.

## Boundary

In scope: one count-equals-rendered-rows question in the `Automated verification` lens of `skills/keystone/ki-repo/references/mode-review.md`, naming the fixture test as its evidence.

Out of scope: `KI-OBS-VIS-004`, which fixed its instance by rendering a separate line for signals whose subject is not a row and recorded the rule in its own `AGENTS.md`; the design of any particular view; and the contents of other lenses.

## Current state

No REVIEW question relates a reported count to the rows a view renders. `Contracts and interfaces` (`mode-review.md:262`) and `Duplication and reuse` (`:314`) each miss it, as the Discussion explains. `Automated verification` starts at `:361`; after [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) and [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) land, their two questions follow the count-based-gate question at `:376`. Line numbers are as observed on 2026-10-05; anchor by text.

## Steps

- [x] Insert one question directly after the [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) idempotence question, or, if that has not landed, directly after the count-based-gate question: `- [ ] Where a view both reports a count and renders the items it counts, a test over a fixture exercising every subject kind the derivation can produce asserts that the count equals the items rendered.`
- [x] Run the verification below.

## Files touched

- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. `Automated verification` contains exactly one new count-versus-rendered question, after the idempotence question where that exists.
2. The question names its evidence: a test asserting the count against the rendered items, over a fixture covering every subject kind the derivation produces.
3. No other lens, rubric, TypeScript or generated file changes for this record.
4. Added text uses British English and ASCII hyphens only; focused audits report no new finding in `mode-review.md`.
5. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. Sequencing for the `mode-review.md` batch, a preference rather than a build order: [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md), [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md), this record, [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md), then [KI-HARNESS-GOV-135](KI-HARNESS-GOV-135-review-governance-date-provenance.md). Each inserts after the previous one's text.

## Documentation impact

### Decision Records

None. A REVIEW checklist question is governed by `Checklist evolution`, not by a Decision Record.

### Specifications

None.

### Guides

None. The website skills-by-outcome guide does not restate REVIEW questions.

### Roadmap

None. `KI-OBS-VIS-004` in `apps-observatory` owns the instance and needs no change.

## Review

### Delivered

One count-versus-rendered question in the `Automated verification` lens of `skills/keystone/ki-repo/references/mode-review.md`, worded exactly as the Step specifies and naming the fixture test as its evidence. `KI-OBS-VIS-004`, other lenses, rubrics, TypeScript and generated files are excluded and unchanged. Baseline `a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe`; implementation commit `8f34487c`.

### Change Summary

- `skills/keystone/ki-repo/references/mode-review.md`: one checklist item. It was inserted directly after the count-based-gate question while [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) was absent. [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) (`5383ceae`) and GOV-124 (`0362c53f`) then landed ahead of it in the same push, so it now sits directly after the idempotence question, as the Step prefers.
- The resulting order in `Automated verification` is the count-based-gate question, then the zero-result question (GOV-096), the idempotence question (GOV-124) and the count-versus-rendered question (GOV-098), then the ignore-list question, which is the batch sequencing the three records prescribe.

### Verification

- `bun run test`: 940 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `bunx biome check .`: exit 0; pre-existing warnings and infos in unrelated files only.
- `ki repo audit --skill ki-repo --progress never`: findings identical to the baseline (diffed); the eight pre-existing `RUNTIMES-2` activation findings and the worktree-only `REPO-REG-1` registration finding, none in `mode-review.md`.
- `ki repo audit --skill ki-authoring --progress never`: PASS.
- `git diff --stat a845446a17fb9f18cc4a7c1bc3aeba0c16894ebe..8f34487c`: only `mode-review.md`, one insertion.
- Verify 1 and 2: exactly one new count-versus-rendered question, after the idempotence question; it names a test asserting the count against the rendered items over a fixture covering every subject kind. Verify 3: no other lens, rubric, TypeScript or generated file changes for this record. Verify 4: added text is British English with ASCII hyphens only. Verify 5: tests and type checking pass.

### Outstanding concerns

None.

### Post-change review

The goal is met: REVIEW now asks the completeness question that no lens asked before. Scope held to one Markdown line. There is no regression risk, because nothing mirrors the REVIEW checklist. Independent review by a Fable subagent returned APPROVE, with no blocking or should-fix finding for this record. Ready for acceptance.

### Mini recap

Delivered one REVIEW question, all gates pass, and no concerns are open. Learning route: none beyond the checklist text, since `KI-OBS-VIS-004` already recorded the rule for its instance.

## Done

Accepted 2026-10-06 by Kris Brown on the review packet above.

## Discussion

### Decision

Add a count-equals-rendered-rows question to the REVIEW checklist, under `Automated verification` beside its sibling generator-output questions, with the fixture test as its evidence. Decided by the Fable reviewer under delegated autonomy, reversible.

### Options considered

The nearest existing lenses each miss it. `Contracts and interfaces` (`skills/keystone/ki-repo/references/mode-review.md:262`) governs what crosses a boundary, and the contract here was correct - the signal was well-formed and carried its subject honestly. `Duplication and reuse` at `:314` is about second sources of truth, and there is only one source here. The failure is a _completeness_ relation between two projections of the same evidence, which no current question asks about.

Candidate wording as raised, for `Contracts and interfaces` or `Human use and configuration` (`:273`); superseded on placement by the Decision above: _Where a view reports a count derived from evidence, every item in that count has somewhere in that view to appear; a derivation whose subject space is wider than the view's rows is rendered somewhere else rather than only counted._

Against adding it: it is narrow, firing only on views that both aggregate and enumerate the same evidence. The checklist prefers deleting a question that never fires. In favour: the class is wider than the phrasing suggests - any summary line, badge count, or dashboard tile over a subject space its own table does not cover has this defect, and it is invisible to type-checking, to tests that assert rows, and to tests that assert counts. Only a test asserting _both against each other_ catches it, which is itself the reviewable behaviour.

The evidence is cheap, which is the test `Checklist evolution` (`mode-review.md:398`) sets for keeping a question: assert the reported count equals the rendered count for a fixture that exercises every subject kind the derivation can produce.

- `KI-OBS-VIS-004` in `apps-observatory` owns the instance and its fix. This record owns the reusable rule, because the REVIEW checklist lives here and that repository cannot change it.
- [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) is the neighbouring case from the data side: an empty result that cannot be distinguished from a healthy run. This one is a non-empty result that cannot be found.
