---
id: KI-HARNESS-GOV-207
area: GOV
title: Recommendation confidence
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: aa5d0b039202cbd1f5d28841411bf1d07096c10f
created_at: 2026-10-17T23:32:09Z
updated_at: 2026-10-17T23:32:09Z
---

# KI-HARNESS-GOV-207: Recommendation Confidence

## Goal

Every recommended option in an owner-report query states how confident the recommendation is, `high`, `medium` or `low`, with a one-line reason, so the owner can weigh it without asking.

## Context

Kris asked on 2026-10-18 in the `product-management` thread: "When you're giving me the recommended course of action, can you tell me how high your confidence is on that?" and approved making it a standard under CONFIDENCE-STANDARD the same day: "Launch a ki-agentic-harness background run to add to the ki-pmo standard that every recommended option carries a confidence level (high, medium or low) with a one-line reason, and deliver it to Awaiting review."

## Boundary

- In: the `ki-pmo` query shape wherever it is drawn or exemplified - the Owner report Queries and Reply block bullets, the LINK-GUARD example, the full-summary Queries bullet, the DEFAULTS query, and the `run-report`, `footer-report` and `output-style` sources - with the regenerated output style, run-prompt Report paragraph and four authority footers; the PMO-6 and `ki-delegation` RUN-4 rubric items and their published rubrics; both source reviews.
- Out: the reply-block entry, which still carries only option a)'s instruction; reports written before this change; any chezmoi-managed copy of the output style or personal guidance outside this repository.

## Current state

Delivered at the resting point recorded under Review.

## Steps

- [x] Add the form `a) (recommended, confidence <level> - <reason>)` and its rule to the Owner report Queries bullet, citing Kris's words.
- [x] Exclude the confidence marker from the reply-block entry and carry the form into the example, full summary, DEFAULTS and generated sources.
- [x] Update PMO-6 and RUN-4 and publish both rubrics.
- [x] Regenerate the surfaces with `ki dev skill generate ki-pmo --write`.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/threads.ts`
- `skills/governance/ki-delegation/references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`, `assets/run-prompt.md`, `assets/rules-none.md`, `assets/rules-push.md`, `assets/rules-prune.md`, `assets/rules-release.md`
- `output-styles/ki-coordinator.md`
- `docs/roadmap/_ISSUES.md`, this record

## Verify

`bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-pmo`, `--skill ki-delegation` and `--skill ki-work-roadmap`, run sequentially.

## Dependencies / blocks

None.

## Documentation impact

### Decision Records

None: the decision is Kris's CONFIDENCE-STANDARD approval, quoted in the standard.

### Specifications

None: the standard is the contract and changes in place.

### Guides

None.

### Roadmap

None beyond this record.

## Review

### Delivered

The boundary above, from baseline `aa5d0b039202cbd1f5d28841411bf1d07096c10f`, in the delivery commit that carries this record.

### Change Summary

Option a) now reads `a) (recommended, confidence <level> - <reason>) <course>`, for example `a) (recommended, confidence high - the patch is already on main) push it`. Confidence reflects reversibility and how much was verified directly rather than taken from another agent's report; a destructive course resting on unverified claims is never `high`. Only option a) carries a confidence, and the reply-block entry drops the marker with the letter.

### Verification

- `bun run test`: 1210 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `ki repo audit --skill ki-delegation`: pass. `--skill ki-skills`: pass with two LONG-3 refresh-cadence warnings on untouched skills.
- `ki repo audit --skill ki-pmo`: four PMO-7 failures and one PMO-9 warning, all in the untouched `+/_THREADS/skill-reviews/` folder; fleet findings, not failures of this change.
- `ki repo audit --skill ki-work-roadmap`: pass.

### Outstanding concerns

A chezmoi-managed copy of the coordinator output style, if one is bound outside this repository, follows on its own review of `chezmoi diff`.

### Post-change review

The change meets the Goal in text on every surface that draws the query shape. Regression risk is low.

### Mini recap

Confidence lands on the recommended option across the standard, generated surfaces and rubrics.

## Discussion

Captured and delivered in one run on Kris's CONFIDENCE-STANDARD approval; the form `(recommended, confidence <level> - <reason>)` keeps the existing `(recommended)` marker and adds the confidence inside it, so no reader of earlier reports needs to change.
