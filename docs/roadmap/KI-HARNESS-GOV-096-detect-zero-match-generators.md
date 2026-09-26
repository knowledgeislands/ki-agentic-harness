---
id: KI-HARNESS-GOV-096
area: GOV
title: Detect zero-match generators
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T10:45:00Z
updated_at: 2026-09-26T10:45:00Z
---

# KI-HARNESS-GOV-096: Detect zero-match generators

## Goal

A generator, extractor or discovery predicate that matches nothing is distinguishable from one that ran correctly and found nothing, so an empty result cannot be mistaken for a fact about the data.

## Context

Raised by `5g-emerge-phase2` on 2026-09-25 under `5GE-P2-DATA-006`, which owns the instance. That repository extracts open Word review comments from a source document and attaches them to test cards. On 2026-09-04 the extractor reported `matched 0 comments onto 0 cards`, and that number was recorded in the repository's source-data query register as evidence about the source: query SDQ-006 said the registry's `TVR Section` column was empty on almost every row and therefore left every review comment unplaceable.

The number was guaranteed by the repository's own code. Two independent faults produced it. The card-discovery predicate filtered on a `TS-` filename prefix that no card file carries, so it walked the tree and matched zero files. Separately the heading walk was broken by Word's auto-numbering, which renders a section number into the run text with no separator — `2.6The scope of testing`, `5.1WP5.1 - EBU DTE Testbed` — defeating both a whitespace lookahead on the section number and a `\b` word boundary on the work-package token. Once both were fixed, 86 of 137 anchors reached a work package with that column playing no part at all, and 22 cards gained comments. SDQ-006 changed character from why the pipeline was inert to why its placement is coarse.

The cost was three weeks of a wrong query in a register whose purpose is to ask a source owner to change their document, plus an outbound ask drafted to a programme partner leading on that query. It was never sent, which is luck rather than a control. A second, smaller instance in the same work: the broken heading walk invented section numbers `§14.94` and `§16.02`, and a divergence class predicted from them did not survive measurement once the walk was fixed.

The `ki-repo` REVIEW checklist has no question that would have caught either. `Automated verification` (`skills/keystone/ki-repo/references/mode-review.md:354`) is the closest lens and its nearest questions each miss: `:363` asks unused-code analysis to report nothing unused, which says nothing about a predicate that matches nothing at runtime; `:366` asks that verification exercise representative real-scale data, which it did — the real document, producing zero. The structurally identical question already in the list is `:368`, that a change to a declaration another tool consumes was verified by running that tool, because a clean pass from a gate that cannot see the consumer reads exactly like verification and stops the reviewer looking. An empty result from a healthy-looking run is the same failure arriving from the data side.

## Boundary

In scope: whether the REVIEW checklist gains a zero-result question, and where; and whether the harness has anything to say about generators warning or failing on an empty walk as a matter of construction rather than review.

Out of scope: `5GE-P2-DATA-006` and the extractor it fixed, which are settled in that repository; the contents of any other lens; and the source documents themselves, which the harness has no relationship with.

## Discussion

Two routes, not exclusive.

**The checklist question.** Add to `Automated verification`, beside `:368`, whose reasoning it shares. Candidate wording: _A generator, extractor or discovery predicate that produced an empty or zero result was confirmed to have found nothing, rather than assumed to have looked._ The evidence is cheap — run it against a case known to be non-empty, or assert a floor — which is the test `mode-review.md:390` sets for keeping a question. Against it: the checklist prefers deleting an item that never fires, and a reviewer reading a generator's output is not the common case.

**The construction rule.** The question documents a hazard rather than removing it. A generator that walks a tree and matches nothing could be required to warn or exit non-zero, as a convention with the same standing as the script-naming law. That is the stronger fix and the harder one to scope, because the legitimate empty case exists — a tree with genuinely nothing in it — so the rule has to be about announcing emptiness, not forbidding it. The distinction to preserve is between _no input matched the predicate_ and _the input matched and yielded nothing_; the first is nearly always a bug, the second is data.

The general lesson, which is the reason this is worth a record at all: an empty result should almost never be silent, because a correct empty run and a broken one are indistinguishable from the outside, and the broken one launders a repository bug into evidence about something the repository does not own.

- `5GE-P2-DATA-006` in `5g-emerge-phase2` owns the instance, the fix and the verification. This record owns the reusable rule, because the REVIEW checklist lives here and that repository cannot change it.
- [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is the same hand-over shape from the same repository: a silent failure with no checklist question, where the structural fix was preferred to the question.
