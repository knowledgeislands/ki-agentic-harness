---
id: KI-HARNESS-GOV-123
area: GOV
title: Review unsettled-source readings
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T19:49:57Z
updated_at: 2026-10-01T19:49:57Z
---

# KI-HARNESS-GOV-123: Review unsettled-source readings

## Goal

A reviewer looking at a delivered artefact can tell whether it encodes an unresolved question in its source, without already having to know that it does, and can see what would change if the question were settled the other way.

## Context

Raised by `5g-emerge-phase2` on 2026-09-26 under `5GE-P2-GOV-014`, which owns the instance and the local fallback. That repository has no trade route to this harness by its own decision, and this repository's `.ki.toml` limits maintenance intake to named KI repositories, so the hand-over is written here directly as Triage, as `KI-HARNESS-GOV-096` and `KI-HARNESS-FND-027` were.

The Supply & Demand Control data flow in that repository was redrawn on 2026-09-25 and 2026-09-26. It passes all three Archify gates, its rendered capture was read and reads correctly, and it is committed (`3bca997`). It also draws one of two incompatible readings of where the CAMARA APIs sit in the supply chain. `apps/site/src/content/documentation/architecture/msf-and-sdc.md:88` places them between SCAL and Content Steering, while the three-SCAL component list at `:90` reads them as a delivery pathway in their own right, reached through the Exposure Gateway. The diagram draws the second. Source-data query `SDQ-020` records the conflict (`a35da8f`), and `5GE-P2-DATA-007` records which flow changes if the first reading turns out correct.

All of that is captured, but only because the conflict happened to be noticed while drawing. Nothing about the artefact advertises it. A reviewer opening the diagram sees a clean five-lane drawing that passes its gates; a reviewer reading the page sees prose that says something different from the picture beside it. Neither view exposes that a choice was made under uncertainty.

The shape is general. Any derived artefact, whether a diagram, a summary table or a generated dataset, can silently resolve an ambiguity in its source, and the resolution then looks like a fact. That repository already has conventions for the opposite direction: raise a query rather than edit a source, and do not delete recorded data to fit an inferred constraint. What is missing is the reviewer-side question.

The `ki-repo` REVIEW checklist (`skills/keystone/ki-repo/references/mode-review.md`, lenses from `:168`) has no equivalent. The nearest questions each miss: `:216` asks that a human can follow the repository's story without reconstructing it from unstated context, which is about narrative rather than about a single artefact's provenance; `:226` asks that Decision Records state the current decision and its consequences, which covers choices the repository owns, not readings it was forced to draw from a source it does not own.

## Boundary

In scope: whether the REVIEW checklist gains an unsettled-source question, its wording, and which lens it belongs in under the placement rule at `mode-review.md:397`.

Out of scope: `SDQ-020`, the CAMARA topology and the diagram itself, which belong to `5g-emerge-phase2` and its source owner; any convention about captions or figure annotation; and the contents of other lenses.

## Proposed lens

> When a delivered artefact encodes one of several possible readings of an unsettled source, does a record state which reading was drawn, and what concretely changes if another wins?

The second clause is what makes it useful. "This is uncertain" is a caveat a reader can do nothing with. "The Exposure SCAL flow goes into Steering instead, and the 5G Network node comes out of the Far Edge lane" is an instruction, and it can be acted on by someone who was not there when the choice was made.

## Discussion

### Worked example

Complete and citable in `5g-emerge-phase2`: `SDQ-020` in `docs/notes/source-data-queries.md` for the conflict, `5GE-P2-DATA-007` for the consequence, and commits `3bca997` and `a35da8f` for the artefact and the query.

### Placement

`mode-review.md:397` admits a concept only when it is likely to improve future assessments, is not already covered, and fits the broad-to-narrow progression. Documentation and knowledge (`:213`) is the natural home, beside `:224`-`:226`, because the question is about whether a record carries the provenance of a choice. An alternative is Repository purpose and stability (`:172`), next to `:182` on distinguishing intentional boundaries from defects, since an unsettled reading is a known, deliberate departure from certainty.

### Why not better captions

A caption saying the topology is contested would help the reader of that one page. It would not help the reviewer of the next artefact, because a caption is written by an author who already knows the problem exists. A review question is asked of every artefact by someone who does not. That is the difference between a fix and a check, and it is why the ask came to the harness rather than staying with the figure.

### Fallback and origin

- `5GE-P2-GOV-014` in `5g-emerge-phase2` will add the lens to its own `AGENTS.md` as a local review convention if this record is rejected; a rejection here should say so, so that repository can close its item.
- [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) is the sibling candidate from the same session recap, and the owner may want to dispose of both in one conversation.
