---
id: GDR-KI-HARNESS-009
title: 'Lean exact-set batch authority'
date: 2026-09-15
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---

# GDR-KI-HARNESS-009: Lean exact-set batch authority

## Context

Batch execution needs a durable statement of what an agent may do while a human is out of the loop. The earlier batch record repeated plans, files, checks, stop lists, and closure IDs already owned by canonical work items, adding review effort and commits without increasing authority. Outcome authority also differs from reviewed-item authority: it permits an orchestrator to choose eligible work, but does not mean the human reviewed the generated IDs. A useful contract must preserve that distinction, exact scope, integrity, expiry, verification, and acceptance evidence while making autonomous delivery cheap enough to use routinely.

## Decision

A Knowledge Islands batch is one lean, repository-local authority envelope over an exact frozen set of Ready work records for one autonomous window.

- Reviewed-item authority covers the exact human-reviewed IDs. Outcome authority records the current human instruction, completes selection and readiness before freezing the full eligible set, and needs no second exact-item gate.
- The authorisation records approval, authority mode and evidence where required, expiry, exact ordered IDs, completion target, payload hash, and `policy: safe-local-v1`. Its run ID and all-item closure scope are derived rather than duplicated.
- The body contains only its identity heading and append-only run ledger. Canonical items remain the sole plans and owners of detailed scope, files, checks, delivery evidence, review packets, and follow-up work.
- `completion_target: done` authorises consolidated acceptance of every named item only after each reaches `awaiting-review`, its evidence is rechecked, and one aggregate final gate passes. `awaiting-review` authorises no closure.
- The named safe-local policy stops unapproved public-contract decisions, material expansion, destructive or irreversible work, external coordination, verification failure, push, and release. Stricter item-level stops still apply.
- The `in-progress` transition is operational and needs no standalone commit. The preferred topology is one preparation and authorisation commit, one delivery commit per item, and one consolidated closure commit: `N + 2` commits for `N` items.
- Work discovered after freezing is captured for a later wave and cannot enter the active batch dynamically.
- Deterministic CLI support may prepare, validate, start, and close records, but cannot infer authority, select contentious work, replace item evidence, or decide acceptance.

Because the contract is not public, this decision replaces the existing authoring shape in place rather than introducing a second schema version. Already-completed records using the earlier shape may remain readable only until ordinary retention cleanup preserves their integrity evidence.

## Consequences

Autonomous work has a small, reviewable authority boundary and a predictable commit account while item-level evidence remains intact. Consolidated acceptance becomes explicit without duplicating closure lists, and named stops stay consistent across runs. Selection must be complete before implementation, so newly discovered work waits for another batch even when technically adjacent. Existing retained records require a narrow compatibility reader until cleanup, and repositories adopting native commands must keep mechanical lifecycle support separate from human authority and acceptance semantics.
