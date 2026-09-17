---
id: KI-HARNESS-REV-006
area: REV
title: Review Model Radar
theme: regular-reviews
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-17T09:42:38Z
updated_at: 2026-09-17T09:42:38Z
housekeeping_template: KI-HARNESS-HK-003
scheduled_for: 2026-09-17
---

# Review Model Radar

## Goal

Keep model and execution-route evidence current enough to support deliberate recommendations without turning new signals into automatic adoption or consumer-default changes.

## Context

The initial weekly model-radar review became due on 2026-09-17. The committed radar needs a bounded evidence pass covering relevant releases, availability, pricing, licensing, lifecycle, benchmark applicability, local fit, and retirement consequences.

## Boundary

This review may update the Harness-owned radar and route separately owned consequences. It must not install models, change consumer configuration, alter runtime defaults, or treat discovery and benchmark claims as adoption authority.

## Current state

This is the first run linked from `KI-HARNESS-HK-003`. No implementation baseline has been selected, and the review window and evidence sources still need to be bounded during planning.

## Steps

- [ ] Use `ki-pulse` for bounded recent discovery and verify material signals against registered primary and independent sources.
- [ ] Audit the committed model radar, preserving distinctions between bare models, endpoints, model-agent routes, and complete environments.
- [ ] Record an evidenced no-change result or prepare the smallest supported fact, recommendation, support, retirement, or benchmark-lifecycle update.
- [ ] Route any installation, adapter, trial, default, retirement, or receiver-owned consequence separately through `ki-next`.

## Files touched

- `skills/governance/ki-model-radar/references/radar.toml`
- `skills/governance/ki-model-radar/references/sources.md`
- `docs/roadmap/KI-HARNESS-REV-006-review-model-radar.md`
- separately owned follow-up records only when evidence warrants capture

## Verify

- `ki repo audit --skill ki-model-radar --repo .`
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

Material implementation or consumer consequences must become deduplicated owner-local proposals rather than being delivered inside this review.

## Discussion

### Evidence gate

The weekly cadence does not lower the radar's evidence or human-review gates. A valid no-change result is preferable to unsupported movement, and every recommendation must retain counter-evidence and uncertainty.
