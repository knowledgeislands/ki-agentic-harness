---
id: KI-HARNESS-RTP-011
title: Review runtime binding drift
area: RTP
theme: runtime-portability
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
---

## Goal

Discuss whether the observed Claude Desktop and Codex binding differences are intended runtime-local choices or drift that should be reconciled.

## Context

The 2026-09-04 estate audit passed all declared harness skills except for two warnings. `ki-binding-claude` reported that Claude Desktop did not match the targeted full non-secret definition while Claude Code did, and `ki-binding-codex` reported a non-secret TOML difference in the Codex configuration. Repository-local conformance proposed no deterministic changes.

## Boundary

This record captures audit evidence for discussion only. It is not an accepted decision, priority assignment, implementation authorisation, or permission to alter user-level runtime configuration. Any change must first inspect the exact non-secret diff and confirm whether each runtime is intended to share the portable binding inventory.

## Shaping

Compare each runtime-native configuration with the canonical binding inventory, classify deliberate client-specific representation separately from missing or stale registrations, and prepare an exact reversible proposal. Keep credentials, tokens, and other secrets outside roadmap evidence.

## Current state

The 2026-09-04 audit recorded two runtime-native warnings, but the exact current non-secret differences have not been captured or classified. The portable inventory and runtime configuration remain the evidence sources; no user-level configuration change is authorised by this record.

## Steps

- [ ] Re-run the portable, Claude, and Codex binding audits against the current readable non-secret configuration.
- [ ] Capture a sanitised comparison in `docs/reviews/KI-HARNESS-RTP-011/runtime-binding-drift.md`.
- [ ] Classify each difference as intentional representation, missing registration, stale registration, or unavailable evidence.
- [ ] Prepare an exact reversible follow-up proposal without modifying user-level configuration.
- [ ] Capture any material implementation work as separately prioritised roadmap records.

## Files touched

- `docs/reviews/KI-HARNESS-RTP-011/runtime-binding-drift.md`
- `docs/roadmap/KI-HARNESS-RTP-011-review-runtime-binding-drift.md`

## Verify

- `ki repo audit --skill ki-binding --repo .` passes.
- `ki repo audit --skill ki-binding-claude --repo .` and `ki repo audit --skill ki-binding-codex --repo .` produce findings accounted for by the review.
- Hashes of every readable user-level configuration source inspected before and after the review are unchanged.
- `ki repo audit --skill ki-authoring --repo .` and `ki repo audit --skill ki-work-roadmap --repo .` pass.

## Dependencies / blocks

The portable binding inventory and relevant runtime-native configuration must be readable. Missing runtime evidence is classified as unavailable rather than inferred. No external service, configuration mutation, or prior roadmap delivery is required.

## Documentation impact

### Decision Records

No Decision Record is required for the evidence review. A material choice to change the portable binding contract would require a separately scoped decision.

### Specifications

No behaviour-level contract changes are authorised.

### Guides

No human guidance changes are planned unless the review identifies a separately approved operating change.

### Roadmap

This record will retain the review result and link any separately prioritised implementation records arising from it.

## Discussion

The relevant focused audits are `ki repo audit --skill ki-binding-claude --repo .` and `ki repo audit --skill ki-binding-codex --repo .`. Review should decide whether to retain, reconcile, or explicitly document each difference before any conform operation targets user configuration.
