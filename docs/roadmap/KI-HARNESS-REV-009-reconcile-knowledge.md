---
id: KI-HARNESS-REV-009
area: REV
title: Reconcile repository knowledge
theme: regular-reviews
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-18T03:10:58Z
updated_at: 2026-09-18T03:10:58Z
housekeeping_template: KI-HARNESS-HK-002
scheduled_for: 2026-09-18
---

# Reconcile repository knowledge

## Goal

Reconcile current decisions, specifications, guides, source references, indexes, retained review evidence, and roadmap orientation after the recent delivery interval, then establish an evidenced revision anchor for future change-volume scheduling.

## Context

The previous reconciliation was accepted on 2026-09-14 before the template gained `last-run-ref`. The user has explicitly requested an early refresh. Since that accepted evidence, the Harness has delivered substantial governance, acquisition, housekeeping, radar, website, and engineering work and pruned several completed roadmap records.

## Boundary

Review canonical knowledge in this repository. Preserve historical records as history, do not reinterpret receiver-owned findings, and do not rewrite another repository. Make only narrowly justified consistency corrections; route material or ambiguous work through deduplicated roadmap intake.

## Current state

The repository-level audit has no failures. Current Decision Record, Specification, guide, roadmap, source-ledger, and generated entry points require a judgmental reconciliation against implemented state and the 99-commit interval since retained prior acceptance evidence.

## Steps

- [ ] Inventory current Decision Records, Specifications, guides, source ledgers, review evidence, roadmap records, and generated orientation surfaces affected by the bounded change interval.
- [ ] Run their owner audits and inspect indexes, statuses, dependencies, predecessor or successor claims, links, and authority boundaries.
- [ ] Compare current explanatory claims with implemented behaviour and accepted decisions without rewriting historical evidence.
- [ ] Classify each material result as conforming, bounded correction, retained history, receiver-owned concern, or deduplicated follow-up.
- [ ] Record exact coverage, limitations, findings, and the revision reviewed for acceptance-time reconciliation.

## Files touched

- `docs/roadmap/KI-HARNESS-REV-009-reconcile-knowledge.md`
- Any narrowly related Harness knowledge file required for a demonstrated consistency correction
- Any Harness-owned follow-up created through normal roadmap intake when a material non-duplicate finding requires later delivery

## Verify

- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-specs --repo .`
- `ki repo audit --skill ki-guides --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-work-housekeeping --repo .`
- `git diff --check`
- Every inspected collection and material discrepancy has an explicit disposition.

## Dependencies / blocks

No delivery dependency blocks the local reconciliation. Receiver-owned or ambiguous findings remain unmodified and are reported with their ownership boundary.

## Documentation impact

### Decision Records

Correct only mechanically demonstrable present-state inconsistencies. Any new policy choice requires a separate Decision Record process.

### Specifications

Correct only accepted-behaviour drift demonstrated against implementation or current authority.

### Guides

Correct only current procedures demonstrably inconsistent with implemented workflows.

### Roadmap

Retain this run as reconciliation evidence. Capture only material, deduplicated Harness-owned follow-up; acceptance later records the exact reviewed revision in the housekeeping template.

## Delegation

The repository-local collections share cross-links and authority boundaries, so one coordinated pass will preserve a single evidence model and avoid duplicate findings.

## Discussion

The review must distinguish current knowledge from retained historical evidence and working material. A clean mechanical audit alone is not sufficient evidence of semantic reconciliation.
