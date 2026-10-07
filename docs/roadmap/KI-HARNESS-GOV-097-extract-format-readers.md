---
id: KI-HARNESS-GOV-097
area: GOV
title: Extract format readers
kind: deliver
purpose: debt
initiative: platform-foundations
component: governance
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 58dbf3502df5b6bb777b3b28965392cff5932221
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-10-07T20:52:48Z
---

# KI-HARNESS-GOV-097: Extract format readers

## Goal

A parser or reader gaining its second caller is extracted rather than copied, because a second caller is the cheapest available test of whether the first one was correct.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. That repository's roadmap adapter carried a private YAML frontmatter reader. Building a second adapter over the same format, the record's steps called for extracting that reader into its own module at its second use rather than copying it - which is already what `ki-engineering` asks for, on comprehension grounds.

The extraction paid for itself in a way the standard does not currently claim. The reader had a latent defect: its unquote step anchored on `^['"]`, and an inline YAML list separates its entries with `, `, so every entry after the first arrived with a leading space and kept its opening quote. In the roadmap adapter the bug was invisible, because the fields it reads are rarely multi-entry inline lists. The moment a second caller read differently-shaped YAML of the same format, the defect fabricated three false `blocking` signals against identifiers like `'SDR-KI-ARCADIA-003` - a governance viewer reporting dependency breakage that did not exist.

Had the reader been copied, the fix would have landed in one copy. The other would have kept producing plausible identifiers with a stray quote, and nothing in either repository's gates would have said so: both copies type-check, both pass their own tests, and the defect is only observable against input the first caller never sees.

## Boundary

In scope: a stated rationale in `ki-engineering`'s reuse standard that a format reader is extracted at its second caller because that caller is its first independent test, and a short worked example drawn from this instance.

Out of scope: a new `ki-repo` REVIEW question or `ki-engineering` rubric item (see Decision); `KI-OBS-VIS-004` and the reader it fixed, which are settled in `apps-observatory`; and the general question of when abstraction is premature, which the standard already governs and which this does not reopen.

## Current state

`skills/governance/ki-engineering/references/standards-engineering.md` `## Code design` (from `:44`) argues reuse from comprehension: its `Prefer clarity to maximal DRY` bullet extracts shared code only for a stable concept with the same meaning, lifecycle and error semantics for every caller. It says nothing about extraction as a correctness operation. `DESIGN-1 [J]` in `scripts/rubric/items/design.ts` cites `standards-engineering.md#code-design` and needs no change. `references/exemplars.md` has a `## Selected patterns` section of configuration exemplars and no code-design example. The `ki-repo` REVIEW `Duplication and reuse` lens (`mode-review.md:314`) is unchanged by this record.

## Steps

- [x] In `standards-engineering.md` `## Code design`, add one bullet after `Prefer clarity to maximal DRY`: **Extract a format reader at its second caller.** A parser's input space is defined by its format, not its callers, so a second caller is the first independent test of whether it implements the format or only the subset the first caller produced; a copy keeps the untested subset, and a fix reaches only one copy. Link the worked example in `exemplars.md`.
- [x] In `references/exemplars.md`, add a `### A format reader extracted at its second caller (Code design)` pattern under `## Selected patterns`: the private YAML frontmatter reader, its `^['"]` unquote defect on inline lists, the three false `blocking` signals the second caller exposed, and why a copy would have kept them. Name `KI-OBS-VIS-004` in `apps-observatory` as the source without linking its roadmap record.
- [x] Confirm `ki dev skill rubric ki-engineering` reports the generated rubric unchanged.
- [x] Run the verification below.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/exemplars.md`

## Verify

1. `## Code design` carries the second-caller rationale as one bullet beside the existing reuse rule, framed as a correctness reason and not as a lowered threshold for abstraction in general.
2. `exemplars.md` contains one worked example that a reader can follow without opening `apps-observatory`: the defect, why the first caller hid it, what the second caller exposed, and why a copy would have kept it.
3. No checklist or rubric item is added: no file under `skills/governance/ki-engineering/scripts/` or `skills/keystone/ki-repo/` changes, and `references/rubric.md` is unchanged.
4. Added text uses British English and ASCII hyphens only; focused audits report no new finding in either file.
5. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-engineering
ki repo audit --skill ki-engineering --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. `KI-HARNESS-GOV-124` (done) adds a determinism bullet to the same `## Code design` list; whichever lands second rebases onto the other, a sequencing preference rather than a build order.

## Documentation impact

### Decision Records

None. A rationale and example inside an existing standard change no decision.

### Specifications

None.

### Guides

None. The website skills-by-outcome guide does not restate engineering standards.

### Roadmap

None. `KI-OBS-VIS-004` in `apps-observatory` owns the instance and needs no change.

## Review

### Delivered

The second-caller rationale and its worked example in the `ki-engineering` reuse standard, within the approved boundary: no checklist, rubric, script or `ki-repo` REVIEW change. Baseline `58dbf3502df5b6bb777b3b28965392cff5932221`; the delivery is the commit that carries this packet.

### Change Summary

- `skills/governance/ki-engineering/references/standards-engineering.md`: one `## Code design` bullet, **Extract a format reader at its second caller**, after `Prefer clarity to maximal DRY`. It frames extraction as a correctness reason specific to readers of a shared format, states that it is not a lower threshold for abstraction in general, and links the example.
- `skills/governance/ki-engineering/references/exemplars.md`: a `### A format reader extracted at its second caller (Code design)` pattern under `## Selected patterns`, ahead of the `.ki.toml` table pattern. It names `KI-OBS-VIS-004` in `apps-observatory` without linking its record and describes the `^['"]` unquote defect, why the first caller hid it, the three false `blocking` signals and why a copy would have kept them.

### Verification

- `ki dev skill rubric ki-engineering`: `references/rubric.md` in sync, unchanged.
- `ki repo audit --skill ki-engineering --progress never`: PASS.
- `ki repo audit --skill ki-authoring --progress never`: PASS.
- `bun run test`: 999 pass, 0 fail. `bunx tsc --noEmit`: clean.
- Full `ki repo audit` in the worktree: no finding in either file. Its only failures are `REPO-REG-1` and `RUNTIMES-2`, which arise because the temporary worktree path is not registered; the registered primary checkout reports FAIL=0 at the same base.

### Outstanding concerns

None.

### Post-change review

The goal is met: the standard now gives the correctness reason for extracting a format reader at its second caller and a worked example a reader can follow without opening `apps-observatory`. Scope held to the two reference files. Regression risk is nil for code; the bullet is review guidance and adds no rubric item. Ready for acceptance.

### Mini recap

Delivered one standard bullet and one exemplar; rubric unchanged and all gates pass. No learning route beyond the standard itself.

## Discussion

### Decision

Add the second-caller-as-test rationale and a worked example to the `ki-engineering` reuse standard; no new checklist item in either `ki-engineering` or the `ki-repo` REVIEW `Duplication and reuse` lens. Decided by the Fable reviewer under delegated autonomy, reversible.

### Analysis as raised

The standard currently argues extraction from comprehension and single-source-of-truth: `Duplication and reuse` at `skills/keystone/ki-repo/references/mode-review.md:314` asks that repeated logic be consolidated rather than copied, and that a change introduce no second source of truth about an existing fact. Both would have been satisfied by extraction here. What neither says is the sharper thing this instance demonstrates: extraction is a _correctness_ operation, not only a tidiness one, because the second caller exercises the shared code against input the first one never produced.

That reframing matters for the argument people actually have. "Two call sites is too early to abstract" is usually right, and the standard is correct to resist premature extraction. But a _parser_ is a special case: its input space is defined by a format rather than by its callers, so a second caller is not a second use of a convenience - it is the first independent measurement of whether the reader implements the format or merely the subset the first caller happened to hand it.

Candidate wording for the standard, as rationale beside the existing reuse rule (adopted as the basis for the Steps): _Extract a format reader at its second use. A second caller is the first independent test of whether it implements the format or only the subset the first caller produced; a copy keeps the untested subset and fixes reach one of them._

The cost of getting this wrong is worth naming because it is asymmetric. A copied reader does not fail loudly - it produces confident output from a defect, and here the output was governance signals ranked `blocking`. Duplication that silently drifts is the stated concern; duplication that silently _agrees while both are wrong_ is the same failure with no drift to detect.

- `KI-OBS-VIS-004` in `apps-observatory` owns the instance, the extraction and its regression test. This record owns the reusable rule, because `ki-engineering` and the REVIEW checklist live here and that repository cannot change them.
- `KI-HARNESS-GOV-096` (done) is the same hand-over shape and shares this one's reasoning: a clean pass from a gate that cannot see the failure reads exactly like verification.
