---
id: KI-HARNESS-GOV-123
area: GOV
title: Review unsettled-source readings
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: governance
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T19:49:57Z
updated_at: 2026-10-07T20:29:57Z
---

# KI-HARNESS-GOV-123: Review unsettled-source readings

## Goal

A reviewer looking at a delivered artefact can tell whether it encodes an unresolved question in its source, without already having to know that it does, and can see what would change if the question were settled the other way.

## Context

Raised by `5g-emerge-phase2` on 2026-09-26 under `5GE-P2-GOV-014`, which owns the instance and the local fallback. That repository has no trade route to this harness by its own decision, and this repository's `.ki.toml` limits maintenance intake to named KI repositories, so the hand-over is written here directly as Triage, as `KI-HARNESS-GOV-096` and `KI-HARNESS-FND-027` were.

The Supply & Demand Control data flow in that repository was redrawn on 2026-09-25 and 2026-09-26. It passes all three Archify gates, its rendered capture was read and reads correctly, and it is committed (`3bca997`). It also draws one of two incompatible readings of where the CAMARA APIs sit in the supply chain. `apps/site/src/content/documentation/architecture/msf-and-sdc.md:88` places them between SCAL and Content Steering, while the three-SCAL component list at `:90` reads them as a delivery pathway in their own right, reached through the Exposure Gateway. The diagram draws the second. Source-data query `SDQ-020` records the conflict (`a35da8f`), and `5GE-P2-DATA-007` records which flow changes if the first reading turns out correct.

All of that is captured, but only because the conflict happened to be noticed while drawing. Nothing about the artefact advertises it. A reviewer opening the diagram sees a clean five-lane drawing that passes its gates; a reviewer reading the page sees prose that says something different from the picture beside it. Neither view exposes that a choice was made under uncertainty.

The shape is general. Any derived artefact, whether a diagram, a summary table or a generated dataset, can silently resolve an ambiguity in its source, and the resolution then looks like a fact. That repository already has conventions for the opposite direction: raise a query rather than edit a source, and do not delete recorded data to fit an inferred constraint. What is missing is the reviewer-side question.

The `ki-repo` REVIEW checklist (`skills/keystone/ki-repo/references/mode-review.md`, lenses from `:169`) has no equivalent. The nearest questions each miss: `:217` asks that a human can follow the repository's story without reconstructing it from unstated context, which is about narrative rather than about a single artefact's provenance; `:227` asks that Decision Records state the current decision and its consequences, which covers choices the repository owns, not readings it was forced to draw from a source it does not own.

## Boundary

In scope: one unsettled-source question in the `Automated verification` lens of `skills/keystone/ki-repo/references/mode-review.md`, using the wording proposed in this record; and, merged from `KI-HARNESS-GOV-135`, one date-provenance question in the `Repository governance` lens of the same file, asking what evidence supports each governance or conformance date and what that date claims.

Out of scope: `SDQ-020`, the CAMARA topology and the diagram itself, which belong to `5g-emerge-phase2` and its source owner; any convention about captions or figure annotation; and the contents of other lenses beyond the one date-provenance question. For that question: no estate-wide metadata edit, new date schema, mechanical backdating checker, or correction in a receiving repository; historical claims are preserved unless an authorised correction has evidence.

## Current state

No REVIEW question asks whether a delivered artefact records which reading of an unsettled source it drew. The nearest questions, `mode-review.md:217` and `:227`, miss it as the Context explains. `Automated verification` starts at `:361`; the batch siblings land after the count-based-gate question at `:376`. Line numbers are as observed on 2026-10-05; anchor by text.

## Steps

- [ ] Insert one question directly after the `KI-HARNESS-GOV-098` (done) question, or, if the batch siblings have not landed, directly after the count-based-gate question: `- [ ] A delivered artefact that encodes one of several possible readings of an unsettled source has a record stating which reading was drawn and what concretely changes if another wins.`
- [ ] Insert one question directly after `The repository declaration reflects what the repository now contains.` in `Repository governance` (merged from `KI-HARNESS-GOV-135`): `- [ ] Each governance or conformance date states what it claims - an evidenced adoption, a preserved historical assertion, or the first surviving declaration - and none is backdated by inference or read as proof of audited conformance.`
- [ ] Run the verification below.

## Files touched

- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. `Automated verification` contains exactly one new unsettled-source question, after the count-versus-rendered question where that exists.
2. The question requires both the reading drawn and its concrete consequence if another reading wins, matching the proposed lens.
3. `Repository governance` contains exactly one new date-provenance question, directly after the declaration question, distinguishing the three date kinds and refusing both inferred backdating and reading a date as audited conformance.
4. No other lens, rubric, TypeScript or generated file changes for this record.
5. Added text uses British English and ASCII hyphens only; focused audits report no new finding in `mode-review.md`.
6. `bun run test` and `bunx tsc --noEmit` pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

`blocked_by` and `blocks` are empty by intent. Sequencing for the `mode-review.md` batch, a preference rather than a build order: `KI-HARNESS-GOV-096` (done), `KI-HARNESS-GOV-124` (done), `KI-HARNESS-GOV-098` (done), then this record. Each inserts after the previous one's text; the merged `KI-HARNESS-GOV-135` question edits `Repository governance`, whose text anchor is independent of the others.

## Documentation impact

### Decision Records

None. A REVIEW checklist question is governed by `Checklist evolution`, not by a Decision Record.

### Specifications

None.

### Guides

None. The website skills-by-outcome guide does not restate REVIEW questions.

### Roadmap

On delivery, `5GE-P2-GOV-014` in `5g-emerge-phase2` no longer needs its local fallback lens and can close. That repository has no trade route to this harness by its own decision, so the owner relays the outcome; this record writes nothing there.

## Discussion

### Decision

Add the unsettled-source lens to the `ki-repo` REVIEW checklist under `Automated verification`, as proposed in this record. Decided by the Fable reviewer under delegated autonomy, reversible.

### Proposed lens

> When a delivered artefact encodes one of several possible readings of an unsettled source, does a record state which reading was drawn, and what concretely changes if another wins?

The second clause is what makes it useful. "This is uncertain" is a caveat a reader can do nothing with. "The Exposure SCAL flow goes into Steering instead, and the 5G Network node comes out of the Far Edge lane" is an instruction, and it can be acted on by someone who was not there when the choice was made.

### Worked example

Complete and citable in `5g-emerge-phase2`: `SDQ-020` in `docs/notes/source-data-queries.md` for the conflict, `5GE-P2-DATA-007` for the consequence, and commits `3bca997` and `a35da8f` for the artefact and the query.

### Placement (resolved)

Resolved by the Decision above: `Automated verification`, beside the other questions about artefacts that pass their gates yet cannot be interpreted. The analysis as raised, whose alternatives are not taken, follows.

`Checklist evolution` (`mode-review.md:398`) admits a concept only when it is likely to improve future assessments, is not already covered, and fits the broad-to-narrow progression. Documentation and knowledge (`:214`) is the natural home, beside `:225`-`:227`, because the question is about whether a record carries the provenance of a choice. An alternative is Repository purpose and stability (`:173`), next to `:183` on distinguishing intentional boundaries from defects, since an unsettled reading is a known, deliberate departure from certainty.

### Why not better captions

A caption saying the topology is contested would help the reader of that one page. It would not help the reviewer of the next artefact, because a caption is written by an author who already knows the problem exists. A review question is asked of every artefact by someone who does not. That is the difference between a fix and a check, and it is why the ask came to the harness rather than staying with the figure.

### Fallback and origin

- `5GE-P2-GOV-014` in `5g-emerge-phase2` will add the lens to its own `AGENTS.md` as a local review convention if this record is rejected; a rejection here should say so, so that repository can close its item.
- `KI-HARNESS-GOV-124` (done) is the sibling candidate from the same session recap, and the owner may want to dispose of both in one conversation.

### Merged from KI-HARNESS-GOV-135

Kris approved merging `KI-HARNESS-GOV-135` (Review governance date provenance) into this record on 2026-10-07, under decision 17 of the state-of-play design: it is another single judgment prompt in the same `mode-review.md`. The territory-governance review found a newly added Legal Conformance entry dated earlier than the first surviving `.ki.toml` declaration; the entry was corrected and older recorded dates were preserved as historical assertions. The reusable question is what each date evidences, not whether old dates are wrong. The merged record's full text is at [its last open revision](https://github.com/knowledgeislands/ki-agentic-harness/blob/05d6acecb33dc19a6ac4aab7b077700c5ae9d2fc/docs/roadmap/KI-HARNESS-GOV-135-review-governance-date-provenance.md).
