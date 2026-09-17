---
id: KI-HARNESS-REV-007
area: REV
title: Review Agentic Radar
theme: regular-reviews
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T09:42:38Z
updated_at: 2026-09-17T09:42:38Z
housekeeping_template: KI-HARNESS-HK-005
scheduled_for: 2026-09-17
---

# Review Agentic Radar

## Goal

Keep evidence about agentic protocols, portable formats, architectural patterns, and knowledge or provenance structures current enough to support deliberate Knowledge Islands decisions without turning discovery into automatic adoption.

## Context

The initial weekly agentic-radar review became due on 2026-09-17. The committed radar needs a bounded evidence pass across identity, stewardship, specification maturity, releases, implementations, interoperability, governance, adoption, and counter-evidence.

## Boundary

This review may update the Harness-owned radar and route separately owned consequences. It must not mutate consumer configuration, prototype integrations, or present patterns, vendor terms, package counts, or organisational affiliations as proof of formal maturity or interoperability.

## Current state

This is the first run linked from `KI-HARNESS-HK-005`. No implementation baseline has been selected, and the review window and evidence sources still need to be bounded during planning.

## Steps

- [ ] Use `ki-pulse` for bounded recent discovery and verify material signals against sources registered by `ki-agentic-radar`.
- [ ] Audit the committed radar for malformed, stale, unsupported, or internally inconsistent entries while preserving evidence classes and uncertainty.
- [ ] Record an evidenced no-change result or prepare the smallest supported snapshot update.
- [ ] Route material capability refreshes, Decision Records, integrations, or receiver-owned consequences separately through `ki-next`.

## Files touched

- `skills/governance/ki-agentic-radar/references/radar.toml`
- `skills/governance/ki-agentic-radar/references/sources.md`
- `docs/roadmap/KI-HARNESS-REV-007-review-agentic-radar.md`
- separately owned follow-up records only when evidence warrants capture

## Verify

- `ki repo audit --skill ki-agentic-radar --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `git diff --check`

## Dependencies / blocks

No build dependency is known. Planning must establish a bounded review window and confirm source availability before readiness.

## Documentation impact

### Decision Records

No Decision Record is expected unless evidence exposes a durable policy choice outside the existing radar contract.

### Specifications

No Specification change is expected; the run reviews evidence rather than defining accepted system behaviour.

### Guides

No guide change is expected unless an accepted finding establishes a new operator procedure.

### Roadmap

Material implementation or receiver consequences must become deduplicated owner-local proposals rather than being delivered inside this review.

## Discussion

### Evidence gate

The weekly cadence does not lower maturity, interoperability, or human-review gates. A valid no-change result is preferable to unsupported movement, and every classification must retain uncertainty and counter-evidence.
