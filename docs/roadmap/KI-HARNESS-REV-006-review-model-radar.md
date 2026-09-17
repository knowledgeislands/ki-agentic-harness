---
id: KI-HARNESS-REV-006
area: REV
title: Review Model Radar
theme: regular-reviews
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: 85bd9943fa1d44785fbdb53a936efb53616e6340
created_at: 2026-09-17T09:42:38Z
updated_at: 2026-09-17T20:57:30Z
housekeeping_template: KI-HARNESS-HK-003
scheduled_for: 2026-09-17
---

# Review Model Radar

## Goal

Keep model and executable-route evidence current enough to support deliberate recommendations without turning a new signal into automatic adoption or a consumer-default change.

## Context

The first weekly model-radar review became due on 2026-09-17. The committed snapshot and tracked-source ledger were last reviewed on 2026-09-14, so this run covers the bounded interval from 2026-09-14 through 2026-09-17 plus any return trigger exposed by a current lifecycle page.

The review must distinguish bare models, provider endpoints, model-agent routes, and complete task environments. Provider claims may establish identity, availability, pricing, licensing, or lifecycle, but performance movement requires applicable independent or local evidence.

## Boundary

Do not install models or agents, buy access, alter runtime or consumer defaults, transmit private material, infer licence or openness across model variants, or turn benchmark position into a universal recommendation. Downstream implementation belongs in separately adopted owner-local work.

## Current state

`skills/governance/ki-model-radar/references/radar.toml` is mechanically valid and within the nine-day freshness grace window. Its source ledger records a 2026-09-14 review and open checks for provider availability, retirements, pricing, route support, benchmark versions, data dates, and exact open-weight licensing.

The repository contains the source form of `ki-pulse`, but that process is not currently available in this runtime's installed skill catalogue. This run may therefore perform the same bounded discovery directly against the tracked source ledger and primary provider or benchmark-owner release surfaces; absence of `ki-pulse` is not permission to broaden the window.

## Steps

- [ ] Audit the current model radar and enumerate only records whose declared return triggers or tracked sources need rechecking in the review window.
- [ ] Perform bounded discovery across registered primary sources, provider lifecycle and model catalogues, and independent benchmark-owner release surfaces; corroborate any consequential performance claim independently.
- [ ] Reconcile each material signal into the smallest supported identity, route, recommendation, support, retirement, benchmark-lifecycle, evidence, or counter-evidence change, or record an evidenced no-change result.
- [ ] Advance snapshot and source-ledger review dates only for evidence actually rechecked, preserving older publication and data-as-of dates.
- [ ] Route installation, adapter, trial, default, retirement, or receiver-owned consequences through deduplicated prospective work rather than implementing them in this review.
- [ ] Run model-radar, authoring, skill, TypeScript, and repository tests, then record the exact review outcome.

## Files touched

- `skills/governance/ki-model-radar/references/radar.toml`
- `skills/governance/ki-model-radar/references/sources.md`
- Generated rubric only if the accepted contract changes
- `docs/roadmap/KI-HARNESS-REV-006-review-model-radar.md`
- Any separately justified follow-up roadmap record created through the normal intake boundary

## Verify

- `ki repo audit --skill ki-model-radar --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki dev skill rubric ki-model-radar` when the generated rubric changes
- Focused radar tests, `bun run test`, and `bunx tsc --noEmit`
- Every changed claim resolves to applicable evidence and preserves material counter-evidence or uncertainty.
- A no-change outcome names the sources and return triggers checked rather than merely advancing dates.

## Dependencies / blocks

No external dependency blocks a direct tracked-source review. If a required source is unavailable or a consequential claim cannot be independently corroborated, retain the current state and record the uncertainty rather than forcing movement.

## Documentation impact

### Decision Records

No Decision Record is expected unless evidence exposes a durable policy choice outside the existing radar contract.

### Specifications

No Specification change is expected; the review updates evidence and lifecycle state rather than accepted system behaviour.

### Guides

No guide change is expected unless an accepted finding establishes a new operator procedure.

### Roadmap

Material implementation or consumer consequences become deduplicated owner-local proposals. This review does not select or implement them.

## Discussion

### Evidence gate

Weekly cadence does not lower the radar's evidence or human-review gates. A valid no-change result is preferable to unsupported movement, and every recommendation must retain applicable counter-evidence and uncertainty.

### Review economy

The bounded interval and explicit return triggers keep this run proportional. Historical sources need not be re-fetched indiscriminately when their claim has no lifecycle signal and the source ledger remains current.
