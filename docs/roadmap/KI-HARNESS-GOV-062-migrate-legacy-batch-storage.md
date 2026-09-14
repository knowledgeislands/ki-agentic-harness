---
id: KI-HARNESS-GOV-062
area: GOV
title: Migrate legacy batch storage
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:04:19Z
updated_at: 2026-09-14T19:04:19Z
---

# Migrate legacy batch storage

## Goal

Provide a bounded migration or retirement path for batch records left under `+/_AUTHORISATIONS/` when the canonical batch location moved to `+/_BATCHES/`.

## Context

The current `ki-batch` standard retires `_AUTHORISATIONS` with no discovery fallback, and routine `ki-next` and `ki-recap` retention inspects only `+/_BATCHES/`. Repositories can still contain recently active legacy records, as observed in Infoschematics, leaving them outside both current batch execution and retention.

Without an explicit transition, active evidence may be discarded unsafely or completed legacy records may remain indefinitely because no current process owns them.

## Boundary

This item does not restore permanent legacy discovery, weaken the seven-day inactivity and retained-evidence guards, delete active records, or infer approval from an old file's presence.

## Discussion

### Transition contract

The migration must distinguish active, completed, malformed, and unverifiable legacy records. It should define whether safe records move intact, receive a new approval-bound payload, or remain quarantined until their run finishes.

### Ownership

The harness owns the batch semantics and transition procedure. Any native filesystem operation needed after that contract is accepted should be handed to `tools-ki` as a separately owned implementation outcome.
