---
id: KI-HARNESS-GOV-097
area: GOV
title: Extract format readers
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-09-26T12:39:00Z
---

# KI-HARNESS-GOV-097: Extract format readers

## Goal

A parser or reader gaining its second caller is extracted rather than copied, because a second caller is the cheapest available test of whether the first one was correct.

## Context

Raised by `apps-observatory` on 2026-09-25 under `KI-OBS-VIS-004`, which owns the instance. That repository's roadmap adapter carried a private YAML frontmatter reader. Building a second adapter over the same format, the record's steps called for extracting that reader into its own module at its second use rather than copying it — which is already what `ki-engineering` asks for, on comprehension grounds.

The extraction paid for itself in a way the standard does not currently claim. The reader had a latent defect: its unquote step anchored on `^['"]`, and an inline YAML list separates its entries with `, `, so every entry after the first arrived with a leading space and kept its opening quote. In the roadmap adapter the bug was invisible, because the fields it reads are rarely multi-entry inline lists. The moment a second caller read differently-shaped YAML of the same format, the defect fabricated three false `blocking` signals against identifiers like `'SDR-KI-ARCADIA-003` — a governance viewer reporting dependency breakage that did not exist.

Had the reader been copied, the fix would have landed in one copy. The other would have kept producing plausible identifiers with a stray quote, and nothing in either repository's gates would have said so: both copies type-check, both pass their own tests, and the defect is only observable against input the first caller never sees.

## Boundary

In scope: whether `ki-engineering`'s reuse standard gains this as a stated rationale and a worked example, and whether the `ki-repo` REVIEW `Duplication and reuse` lens gains a question about it.

Out of scope: `KI-OBS-VIS-004` and the reader it fixed, which are settled in that repository; the general question of when abstraction is premature, which the standard already governs and which this does not reopen.

## Discussion

The standard currently argues extraction from comprehension and single-source-of-truth: `Duplication and reuse` at `skills/keystone/ki-repo/references/mode-review.md:310` asks that repeated logic be consolidated rather than copied, and that a change introduce no second source of truth about an existing fact. Both would have been satisfied by extraction here. What neither says is the sharper thing this instance demonstrates: extraction is a _correctness_ operation, not only a tidiness one, because the second caller exercises the shared code against input the first one never produced.

That reframing matters for the argument people actually have. "Two call sites is too early to abstract" is usually right, and the standard is correct to resist premature extraction. But a _parser_ is a special case: its input space is defined by a format rather than by its callers, so a second caller is not a second use of a convenience — it is the first independent measurement of whether the reader implements the format or merely the subset the first caller happened to hand it.

Candidate wording for the standard, as rationale beside the existing reuse rule: _Extract a format reader at its second use. A second caller is the first independent test of whether it implements the format or only the subset the first caller produced; a copy keeps the untested subset and fixes reach one of them._

The cost of getting this wrong is worth naming because it is asymmetric. A copied reader does not fail loudly — it produces confident output from a defect, and here the output was governance signals ranked `blocking`. Duplication that silently drifts is the stated concern; duplication that silently _agrees while both are wrong_ is the same failure with no drift to detect.

- `KI-OBS-VIS-004` in `apps-observatory` owns the instance, the extraction and its regression test. This record owns the reusable rule, because `ki-engineering` and the REVIEW checklist live here and that repository cannot change them.
- [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) is the same hand-over shape and shares this one's reasoning: a clean pass from a gate that cannot see the failure reads exactly like verification.
