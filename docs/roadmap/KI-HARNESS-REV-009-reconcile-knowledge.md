---
id: KI-HARNESS-REV-009
area: REV
title: Reconcile repository knowledge
theme: regular-reviews
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: fa37a31b58e535fcf96415422da7fb608575365d
created_at: 2026-09-18T03:10:58Z
updated_at: 2026-09-18T03:20:53Z
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

In progress from immutable baseline `fa37a31b58e535fcf96415422da7fb608575365d`. The repository-level audit has no failures. Current Decision Record, Specification, guide, roadmap, source-ledger, and generated entry points require a judgmental reconciliation against implemented state and the recent delivery interval since retained prior acceptance evidence.

## Steps

- [x] Inventory current Decision Records, Specifications, guides, source ledgers, review evidence, roadmap records, and generated orientation surfaces affected by the bounded change interval.
- [x] Run their owner audits and inspect indexes, statuses, dependencies, predecessor or successor claims, links, and authority boundaries.
- [x] Compare current explanatory claims with implemented behaviour and accepted decisions without rewriting historical evidence.
- [x] Classify each material result as conforming, bounded correction, retained history, receiver-owned concern, or deduplicated follow-up.
- [x] Record exact coverage, limitations, findings, and the revision reviewed for acceptance-time reconciliation.

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

## Review

### Delivered

Reconciled 49 current Decision Records, seven Specification files, five guide files, 14 retained roadmap records, four housekeeping templates, and the source-ledger and entry-point changes made since the previous accepted reconciliation. The immutable run baseline is `fa37a31b58e535fcf96415422da7fb608575365d`.

### Summary of changes

- Removed stale fixed claims that Knowledge Islands owned exactly 19 local stdio MCP servers from `ADR-KI-HARNESS-TOOLCHAIN-002` and `ADR-KI-HARNESS-TOOLCHAIN-003`. The decisions now state the durable proxy invariant without duplicating volatile inventory.
- Reconciled `ADR-KI-HARNESS-TOOLCHAIN-004` with native rubric execution. It now assigns structured `automatic`, `diagnostic`, and `guarded` remediation metadata to criteria and generic presentation and transaction ownership to the `ki` host, replacing the obsolete claim that 23 separate checker programs embed remediation footers. The living record and its index link were renamed in place under the same identity.
- Replaced the model radar's broken `main` link to pruned `KI-HARNESS-REV-003` with a commit-pinned retained-evidence link.
- Confirmed current Decision Record and Specification indexes, requirement conformance evidence, guide placement, roadmap orientation, generated capability entry points, and changed source ledgers remain internally consistent.

### Verification

- `ki repo audit --skill ki-decision-records --repo .` — pass.
- `ki repo audit --skill ki-specs --repo .` — pass.
- `ki repo audit --skill ki-guides --repo .` — pass.
- `ki repo audit --skill ki-authoring --repo .` — pass.
- `ki repo audit --skill ki-work-roadmap --repo .` — pass.
- Repository Markdown relative-link scan found no missing real targets; the sole reported path is the intentional filename placeholder in the Decision Record template.
- Search across current source ledgers found no remaining `main` link to a pruned Harness roadmap record.
- `git diff --check` — pass.

### Outstanding concerns

- `KI-HARNESS-FND-025` now owns the knip coverage gap found by the paired engineering review; it remains unadopted Triage work.
- The two housekeeping schedule warnings remain until these reviews are accepted and exact reviewed-revision anchors are written to their templates.
- Claude Desktop render drift remains external to this repository and requires separately approved chezmoi application.

### Post-change review

The corrections change no accepted system behaviour. They remove volatile inventory from durable decisions, align one living Decision Record with already implemented rubric authority, and preserve pruned review evidence through an immutable link. No new policy decision or additional roadmap item is required.

### Mini recap

Current repository knowledge is mechanically clean and semantically aligned after three bounded present-state corrections; only the separately captured knip coverage work remains.

## Discussion

The review must distinguish current knowledge from retained historical evidence and working material. A clean mechanical audit alone is not sufficient evidence of semantic reconciliation.
