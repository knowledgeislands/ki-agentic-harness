---
id: KI-HARNESS-GOV-096
area: GOV
title: Detect zero-match generators
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T10:45:00Z
updated_at: 2026-10-05T08:00:02Z
---

# KI-HARNESS-GOV-096: Detect zero-match generators

## Goal

A generator, extractor or discovery predicate that matches nothing is distinguishable from one that ran correctly and found nothing, so an empty result cannot be mistaken for a fact about the data.

## Context

Raised by `5g-emerge-phase2` on 2026-09-25 under `5GE-P2-DATA-006`, which owns the instance. That repository extracts open Word review comments from a source document and attaches them to test cards. On 2026-09-04 the extractor reported `matched 0 comments onto 0 cards`, and that number was recorded in the repository's source-data query register as evidence about the source: query SDQ-006 said the registry's `TVR Section` column was empty on almost every row and therefore left every review comment unplaceable.

The number was guaranteed by the repository's own code. Two independent faults produced it. The card-discovery predicate filtered on a `TS-` filename prefix that no card file carries, so it walked the tree and matched zero files. Separately the heading walk was broken by Word's auto-numbering, which renders a section number into the run text with no separator - `2.6The scope of testing`, `5.1WP5.1 - EBU DTE Testbed` - defeating both a whitespace lookahead on the section number and a `\b` word boundary on the work-package token. Once both were fixed, 86 of 137 anchors reached a work package with that column playing no part at all, and 22 cards gained comments. SDQ-006 changed character from why the pipeline was inert to why its placement is coarse.

The cost was three weeks of a wrong query in a register whose purpose is to ask a source owner to change their document, plus an outbound ask drafted to a programme partner leading on that query. It was never sent, which is luck rather than a control. A second, smaller instance in the same work: the broken heading walk invented section numbers `§14.94` and `§16.02`, and a divergence class predicted from them did not survive measurement once the walk was fixed.

The `ki-repo` REVIEW checklist has no question that would have caught either. `Automated verification` (`skills/keystone/ki-repo/references/mode-review.md:361`) is the closest lens and its nearest questions each miss: `:370` asks unused-code analysis to report nothing unused, which says nothing about a predicate that matches nothing at runtime; `:373` asks that verification exercise representative real-scale data, which it did - the real document, producing zero. The structurally identical question already in the list is `:375`, that a change to a declaration another tool consumes was verified by running that tool, because a clean pass from a gate that cannot see the consumer reads exactly like verification and stops the reviewer looking. An empty result from a healthy-looking run is the same failure arriving from the data side.

## Boundary

In scope: one zero-result question in the `Automated verification` lens of `skills/keystone/ki-repo/references/mode-review.md`, written jointly with the idempotence question from [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) and placed immediately before it, so the two read as a pair about whether generator output can be interpreted.

Out of scope: a construction rule requiring generators to warn or exit non-zero on an empty walk (see Decision); `5GE-P2-DATA-006` and the extractor it fixed, which are settled in `5g-emerge-phase2`; the contents of any other lens; and the source documents themselves.

## Current state

`Automated verification` starts at `mode-review.md:361`. The nearest questions are `:370` (unused-code analysis), `:373` (representative real-scale data), `:375` (a consumed declaration verified by running its consumer) and `:376` (a count-based gate whose findings are read rather than carried forward); `Checklist evolution` is at `:398`. Nothing asks whether an empty or zero result was shown to be a finding rather than a predicate that never matched. No rubric item, test or generated file mirrors the REVIEW checklist, so the delivery is one Markdown edit. Line numbers are as observed on 2026-10-05 and drift as siblings land; anchor every insertion by its neighbouring text.

## Steps

- [ ] Insert one question directly after the `:376` count-based-gate question (the end of the "reads exactly like verification" pair) and before "No gate is made to pass by widening an ignore list": `- [ ] A generator, extractor or discovery predicate that returned an empty or zero result was confirmed to have found nothing, by a run against a known non-empty case or an asserted floor, rather than assumed to have looked.`
- [ ] Land it in the same change as the [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) question, which follows it immediately, and check that neither question restates the other.
- [ ] Run the verification below.

## Files touched

- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. `Automated verification` contains exactly one new zero-result question, placed after the count-based-gate question and immediately before the idempotence question from [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md).
2. The question is a single yes-or-no item that names acceptable evidence (a known non-empty case or an asserted floor) and distinguishes a predicate that never matched from one that matched and yielded nothing.
3. No other lens changes, and no rubric, TypeScript or generated file changes for this record: `git diff --stat` shows only `mode-review.md`.
4. The added text uses British English and ASCII hyphens only, and the focused audits report no new finding in `mode-review.md`.
5. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) is written jointly with this record and should land in the same change. Sequencing for the `mode-review.md` batch, a preference rather than a build order: this record, then [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md), [KI-HARNESS-GOV-098](KI-HARNESS-GOV-098-render-every-derived-signal.md) and [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md) in that order inside `Automated verification`, then [KI-HARNESS-GOV-135](KI-HARNESS-GOV-135-review-governance-date-provenance.md) in `Repository governance`. Each inserts after the previous one's text, so the five can be delivered as one batch without conflict.

## Documentation impact

### Decision Records

None. A REVIEW checklist question is governed by the checklist's own `Checklist evolution` rule and is not a structural decision.

### Specifications

None. The harness has no specification for the REVIEW checklist.

### Guides

None. The website skills-by-outcome guide selects skills by task and does not restate REVIEW questions.

### Roadmap

None beyond the batch sequencing above. `5GE-P2-DATA-006` in `5g-emerge-phase2` owns the instance and needs no change from this delivery.

## Discussion

### Decision

Add one REVIEW question under `Automated verification` in `skills/keystone/ki-repo/references/mode-review.md` covering zero-match generator, extractor and predicate output, written jointly with and adjacent to the idempotence question from [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md); the construction rule is not adopted in this record. Decided by the Fable reviewer under delegated autonomy, reversible.

### Options considered

Two routes were proposed, not exclusive; the Decision above resolves them.

**The checklist question (adopted).** Add to `Automated verification`, beside `:375`, whose reasoning it shares. Candidate wording: _A generator, extractor or discovery predicate that produced an empty or zero result was confirmed to have found nothing, rather than assumed to have looked._ The evidence is cheap - run it against a case known to be non-empty, or assert a floor - which is the test `Checklist evolution` (`mode-review.md:398`) sets for keeping a question. Against it: the checklist prefers deleting an item that never fires, and a reviewer reading a generator's output is not the common case.

**The construction rule (not adopted here).** The question documents a hazard rather than removing it. A generator that walks a tree and matches nothing could be required to warn or exit non-zero, as a convention with the same standing as the script-naming law. That is the stronger fix and the harder one to scope, because the legitimate empty case exists - a tree with genuinely nothing in it - so the rule has to be about announcing emptiness, not forbidding it. The distinction to preserve is between _no input matched the predicate_ and _the input matched and yielded nothing_; the first is nearly always a bug, the second is data.

The general lesson, which is the reason this is worth a record at all: an empty result should almost never be silent, because a correct empty run and a broken one are indistinguishable from the outside, and the broken one launders a repository bug into evidence about something the repository does not own.

- `5GE-P2-DATA-006` in `5g-emerge-phase2` owns the instance, the fix and the verification. This record owns the reusable rule, because the REVIEW checklist lives here and that repository cannot change it.
- [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is the same hand-over shape from the same repository: a silent failure with no checklist question, where the structural fix was preferred to the question.
