---
id: KI-HARNESS-RTP-011
title: Review runtime binding drift
area: RTP
theme: runtime-portability
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: d18fd7e31b08aee0f159ef4a461c14447b9a4e1b
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

- [x] Re-run the portable, Claude, and Codex binding audits against the current readable non-secret configuration.
- [x] Capture a sanitised comparison in `docs/reviews/KI-HARNESS-RTP-011/runtime-binding-drift.md`.
- [x] Classify each difference as intentional representation, missing registration, stale registration, or unavailable evidence.
- [x] Prepare an exact reversible follow-up proposal without modifying user-level configuration.
- [x] Capture any material implementation work as separately prioritised roadmap records.

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

## Review

### Delivered

Against baseline `d18fd7e31b08aee0f159ef4a461c14447b9a4e1b`, the approved read-only review captured sanitised binding evidence, classified every reported difference, and created one bounded follow-up record. No user-level configuration, canonical binding data, or renderer output changed.

### Summary of changes

Added `docs/reviews/KI-HARNESS-RTP-011/runtime-binding-drift.md`, created `KI-HARNESS-GOV-059`, advanced the GOV issue ledger to `059`, and updated this record with completed steps and review evidence. The review classified both audit warnings as comparator drift against intentional renderer transformations.

### Verification

The portable binding audit passed. Claude and Codex audits reproduced their expected diagnostic warnings, and sanitised structural inspection accounted for every targeted registration. All four whole-file hashes matched at the primary implementation boundary; a later recheck found unrelated churn in app-owned `~/.claude.json`, while its targeted Claude Code binding remained conforming. Markdown, roadmap, and final repository gates passed.

### Outstanding concerns

The false-positive Claude and Codex warnings remain until `KI-HARNESS-GOV-059` is implemented. Activation and runtime health remain unavailable by design. App-owned whole-file churn means targeted binding comparison, not an extended whole-file hash window, is the reliable no-drift assertion. No other concern is known.

### Post-change review

The delivered evidence satisfies the approved discussion-only boundary and avoids an unsafe configuration repair. The follow-up isolates comparator correction from runtime state and keeps the result independently prioritised and reversible.

### Mini recap

All expected bindings are present; accepted renderer transformations explain the warnings. Review `KI-HARNESS-GOV-059` next if removing persistent false drift is valuable.

## Done

Accepted 2026-09-13 by the repository owner on the review packet above.

## Discussion

The relevant focused audits are `ki repo audit --skill ki-binding-claude --repo .` and `ki repo audit --skill ki-binding-codex --repo .`. Review should decide whether to retain, reconcile, or explicitly document each difference before any conform operation targets user configuration.
