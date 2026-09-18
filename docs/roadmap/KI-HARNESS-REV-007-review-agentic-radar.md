---
id: KI-HARNESS-REV-007
area: REV
title: Review Agentic Radar
theme: regular-reviews
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: 87a0debd4c517b5138cc4828ad69cdaef01cbb24
created_at: 2026-09-17T09:42:38Z
updated_at: 2026-09-18T04:09:06Z
housekeeping_template: KI-HARNESS-HK-005
scheduled_for: 2026-09-17
---

# Review Agentic Radar

## Goal

Keep evidence about agentic protocols, interface formats, stewardship, implementations, interoperability, and architectural patterns current enough to support deliberate Knowledge Islands decisions without turning discovery into automatic adoption.

## Context

The first weekly agentic-radar review became due on 2026-09-17. The committed snapshot and tracked-source ledger were last reviewed on 2026-09-14, so this run covers the bounded interval from 2026-09-14 through 2026-09-17 plus any declared return trigger visible on a current primary source.

The review must keep specification maturity, implementation state, demonstrated interoperability, operational adoption, and local stance separate. A release, package count, incubating group, steward claim, or implementation catalogue does not prove independent interoperability.

## Boundary

Do not mutate consumer configuration, prototype an integration, choose an agent architecture, collapse similarly named protocols, or present vendor terminology, organisational affiliation, package count, or reference implementation as proof of formal maturity or interoperability. Route material consequences separately.

## Current state

`skills/governance/ki-agentic-radar/references/radar.toml` is mechanically valid and within the nine-day freshness grace window. Its source ledger records a 2026-09-14 review with return triggers for new protocol releases, governance transfer, independent implementation, published conformance or interoperability results, material operational adoption, deprecation, and a concrete Knowledge Islands use case.

The repository contains the source form of `ki-pulse`, but that process is not currently available in this runtime's installed skill catalogue. This run may therefore perform the same bounded discovery directly against tracked primary sources and narrowly targeted public searches; absence of `ki-pulse` does not authorise an open-ended ecosystem survey.

## Steps

- [x] Audit the current agentic radar and enumerate subjects whose return triggers or tracked sources need rechecking in the review window.
- [x] Perform bounded discovery against registered normative, governance, release, implementation, conformance, interoperability, and adoption sources, preferring primary evidence and retaining counter-evidence.
- [x] Reconcile each material signal into the smallest supported identity, maturity, implementation, interoperability, stance, movement, evidence, or uncertainty change, or record an evidenced no-change result.
- [x] Advance snapshot and source-ledger review dates only for evidence actually rechecked, preserving historical release dates and uncertainty.
- [x] Route capability changes, experiments, Decision Records, or receiver-owned consequences through their normal owners rather than implementing them inside this review.
- [x] Run agentic-radar, authoring, skill, TypeScript, and repository tests, then record the exact review outcome.

## Files touched

- `skills/governance/ki-agentic-radar/references/radar.toml`
- `skills/governance/ki-agentic-radar/references/sources.md`
- Generated rubric only if the accepted contract changes
- `docs/roadmap/KI-HARNESS-REV-007-review-agentic-radar.md`
- Any separately justified follow-up roadmap record created through the normal intake boundary

## Verify

- `ki repo audit --skill ki-agentic-radar --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki dev skill rubric ki-agentic-radar` when the generated rubric changes
- Focused radar tests, `bun run test`, and `bunx tsc --noEmit`
- Every changed classification resolves to evidence of the right class and preserves uncertainty and counter-evidence.
- A no-change outcome names the sources and return triggers checked rather than merely advancing dates.

## Dependencies / blocks

No external dependency blocks a direct tracked-source review. If a primary source is unavailable or a signal cannot support the claimed maturity or interoperability level, retain the current classification and record the uncertainty.

## Documentation impact

### Decision Records

No Decision Record is expected unless evidence exposes a durable policy choice outside the existing radar contract.

### Specifications

No Specification change is expected; the run reviews evidence rather than defining accepted system behaviour.

### Guides

No guide change is expected unless an accepted finding establishes a new operator procedure.

### Roadmap

Material implementation or receiver consequences become deduplicated owner-local proposals. This review does not select or implement them.

## Review

### Delivered

Completed the 2026-09-14 through 2026-09-17 review window across the registered protocol, governance, implementation, conformance, interoperability, and adoption sources.

### Summary of changes

- Updated Agent Client Protocol evidence to stable schema v1.22.0 and retained the separately published v2.0.0 alpha as counter-evidence rather than treating it as the stable contract.
- Updated Agent Host Protocol evidence to specification v0.9.0.
- Added Wyrd's independently maintained AHP server as corroborating implementation evidence. This moves AHP from `reference-only` to `single-implementation` and records inward movement while retaining `assess` and `untested` interoperability.
- Recorded evidenced no-change outcomes for MCP, ACP, A2A, AGENTS.md, and the W3C Agent Protocol Community Group.
- Advanced only evidence, subject, and source-ledger dates directly rechecked during this run.

### Verification

- Rechecked the primary ACP and AHP release surfaces, Microsoft's AHP catalogue, the Wyrd server repository, the A2A specification and TCK, AGENTS.md adoption, and the W3C group and draft surfaces.
- Focused agentic-radar tests, `bunx tsc --noEmit`, `ki repo audit --skill ki-agentic-radar --repo .`, `ki repo audit --skill ki-authoring --repo .`, and `ki dev skill rubric ki-agentic-radar` — pass.
- `bun run test` — 726 pass, 0 fail, 3,188 expectations across 133 files.

### Outstanding concerns

- No second independent AHP implementation or independently witnessed interoperability or conformance result was found.
- The Wyrd server is early and deliberately bounded; it supports an implementation-state change, not an adoption recommendation or trial.
- ACP v2 remains pre-release counter-evidence, and remote-agent support remains a return trigger.

### Post-change review

The implementation classification now reflects credible independent code without overstating interoperability. No implementation, adoption, or Decision Record work is justified by this review alone.

### Mini recap

The agentic radar now reflects the current ACP and AHP releases and one independent AHP implementation while preserving the evidence gates for interoperability and adoption.

## Done

Accepted 2026-09-18 by Kris Brown on review packet above.

## Discussion

### Evidence gate

Weekly cadence does not lower maturity, interoperability, or human-review gates. A valid no-change result is preferable to unsupported movement, and every classification must retain uncertainty and counter-evidence.

### Review economy

The bounded interval and declared return triggers keep the review proportionate. The run should revisit the full source inventory only where a changed primary source or a new signal makes an existing classification questionable.
