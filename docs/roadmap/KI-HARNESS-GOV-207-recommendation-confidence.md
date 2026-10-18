---
id: KI-HARNESS-GOV-207
area: GOV
title: Recommendation confidence
kind: deliver
purpose: governance
project: ways-of-working
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: aa5d0b039202cbd1f5d28841411bf1d07096c10f
created_at: 2026-10-17T23:32:09Z
updated_at: 2026-10-18T00:44:34Z
---

# KI-HARNESS-GOV-207: Recommendation Confidence

## Goal

Every recommended option in an owner-report query states how confident the recommendation is, `high`, `medium` or `low`, with a one-line reason, so the owner can weigh it without asking.

## Context

Kris asked on 2026-10-18 in the `product-management` thread: "When you're giving me the recommended course of action, can you tell me how high your confidence is on that?" and approved making it a standard under CONFIDENCE-STANDARD the same day: "Launch a ki-agentic-harness background run to add to the ki-pmo standard that every recommended option carries a confidence level (high, medium or low) with a one-line reason, and deliver it to Awaiting review."

## Boundary

- In: the `ki-pmo` query shape wherever it is drawn or exemplified - the Owner report Queries and Reply block bullets, the LINK-GUARD example, the full-summary Queries bullet, the DEFAULTS query, and the `run-report`, `footer-report` and `output-style` sources - with the regenerated output style, run-prompt Report paragraph and four authority footers; the PMO-6 and `ki-delegation` RUN-4 rubric items and their published rubrics; both source reviews.
- In, as the small change Kris named under CONFIDENCE-CHECK: the mechanical WARN-level PMO-11 rubric check, its tests, its standard and source-review lines, and the regenerated rubric publication.
- Out: the reply-block entry, which still carries only option a)'s instruction; reports written before this change; any chezmoi-managed copy of the output style or personal guidance outside this repository.

## Current state

Delivered at the resting point recorded under Review.

## Steps

- [x] Add the form `a) (recommended, confidence <level> - <reason>)` and its rule to the Owner report Queries bullet, citing Kris's words.
- [x] Exclude the confidence marker from the reply-block entry and carry the form into the example, full summary, DEFAULTS and generated sources.
- [x] Update PMO-6 and RUN-4 and publish both rubrics.
- [x] Regenerate the surfaces with `ki dev skill generate ki-pmo --write`.
- [x] Add the WARN-level PMO-11 check beside PMO-7, with tests, and publish the rubric.

## Files touched

- `skills/change-management/ki-pmo/references/standards-pmo.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/threads.ts`
- `skills/governance/ki-delegation/references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`, `assets/run-prompt.md`, `assets/rules-none.md`, `assets/rules-push.md`, `assets/rules-prune.md`, `assets/rules-release.md`
- `output-styles/ki-coordinator.md`
- `skills/change-management/ki-pmo/scripts/rubric/contexts/pmo.ts`, `scripts/rubric/contexts/pmo.test.ts`, and `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` for PMO-11
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

## Done

Accepted as delivered on 2026-10-18 at 00:40 BST by Kris Brown, recorded in the product-management decisions log: "ACCEPT-207 / Accept KI-HARNESS-GOV-207 under ki-accept." The six-part Review packet above stands as the closure evidence. Acceptance re-ran the checks on `b7ab7eff8`: `bun run test` 1210 pass, 0 fail; `bunx tsc --noEmit` clean; `ki repo audit --skill ki-delegation`, `--skill ki-work-roadmap` and `--skill ki-authoring` pass; `--skill ki-pmo` reports the same four PMO-7 failures and one PMO-9 warning as the Review, all in the untouched `+/_THREADS/skill-reviews/` folder, fleet findings rather than failures of this change.

On 2026-10-18 Kris agreed CONFIDENCE-CHECK in the `ways-of-working` thread, "yes, I agree with the confidence check, we can get on with that as well and accept it with the small change", so acceptance carries one small change: the rubric's PMO-11 now warns on any line of a thread report's Queries section beginning `<letter>) (recommended` without `, confidence high|medium|low - <reason>)`, outside fenced blocks. Only reports whose footer banner top border was issued on or after 2026-10-18 UTC are checked, so earlier reports, and conversational reports with no footer to date them, do not fail. Checks on the change: `bun run test` 1215 pass, 0 fail; `bunx tsc --noEmit` clean; `ki repo audit --skill ki-pmo` shows only the untouched `+/_THREADS/skill-reviews/` fleet findings; `--skill ki-skills` three LONG-3 refresh-cadence warnings on untouched skills; `--skill ki-work-roadmap` pass; run from source against ki-principal, PMO-11 passes.

## Discussion

Captured and delivered in one run on Kris's CONFIDENCE-STANDARD approval; the form `(recommended, confidence <level> - <reason>)` keeps the existing `(recommended)` marker and adds the confidence inside it, so no reader of earlier reports needs to change.
