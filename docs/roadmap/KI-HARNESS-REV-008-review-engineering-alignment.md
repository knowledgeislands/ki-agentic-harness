---
id: KI-HARNESS-REV-008
area: REV
title: Review engineering alignment
theme: regular-reviews
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 216523fde3d5353aaa13a1379de460af53dc491a
created_at: 2026-09-18T03:10:58Z
updated_at: 2026-09-18T03:14:27Z
housekeeping_template: KI-HARNESS-HK-001
scheduled_for: 2026-09-18
---

# Review engineering alignment

## Goal

Review repository engineering and mechanical-governance alignment across the changes since the previous accepted review, route only material residual findings, and establish an evidenced revision anchor for future change-volume scheduling.

## Context

The previous run was accepted on 2026-09-14, but it predates the template's `last-run-ref` contract. The user has explicitly requested an early refresh. There were 99 first-parent delivery commits between the retained acceptance evidence at `d3b18f1c9d67a96b58017ffa1675df90e489baf3` and the scheduling change, one below the template's 100-commit trigger; the scheduling commit forms this run's immutable baseline.

## Boundary

This is a review run, not blanket remediation authority. Inspect the current repository and the bounded change interval; fix only defects required to make the review evidence truthful and mechanically valid. Route material implementation work through deduplicated roadmap intake. Do not mutate another repository, external runtime configuration, releases, or deployment state.

## Current state

In progress from immutable baseline `216523fde3d5353aaa13a1379de460af53dc491a`. The full repository audit has no failures. The current housekeeping warning is expected because no evidenced `last-run-ref` exists. Recent work materially changed change-management, acquisition, website, engineering, generated capability, and housekeeping surfaces, making a fresh alignment review proportionate despite the calendar cadence not yet being due.

## Steps

- [x] Inventory the 99-commit first-parent interval and identify changed engineering, skill, generated, test, and mechanical-governance surfaces.
- [x] Run the repository's full audit, tests, TypeScript, formatter or authoring checks, and generated-publication checks once against a fixed baseline.
- [x] Inspect changed boundaries for ownership, duplication, contract drift, deterministic checks, and regression coverage.
- [x] Classify each material result as conforming, bounded correction, retained judgment, watch signal, or deduplicated follow-up.
- [x] Record exact coverage, limitations, findings, and the revision reviewed for acceptance-time reconciliation.

## Files touched

- `docs/roadmap/KI-HARNESS-REV-008-review-engineering-alignment.md`
- Any Harness-owned follow-up created through normal roadmap intake when a material non-duplicate finding requires later delivery
- A narrowly related source or test only when required to keep review evidence mechanically truthful

## Verify

- `ki repo audit --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `bunx biome check .`
- `git diff --check`
- Every changed surface in the bounded interval has an explicit reviewed or excluded disposition.

## Dependencies / blocks

No delivery dependency blocks the local review. The previous accepted review and current Git history provide the bounded interval; absence of a historical template anchor remains explicit rather than backfilled.

## Documentation impact

### Decision Records

No Decision Record is expected unless the review exposes a durable policy choice outside accepted authority.

### Specifications

No Specification change is expected; separately route any implementation-contract gap.

### Guides

Update a guide only if current operating instructions are demonstrably inconsistent with implemented behaviour.

### Roadmap

Retain this run as successful-review evidence. Capture only material, deduplicated Harness-owned follow-up; acceptance later records the exact reviewed revision in the housekeeping template.

## Delegation

The review is locally coordinated. Its fixed change interval and shared verification gates make direct execution more efficient than splitting overlapping repository evidence.

## Review

### Delivered

Reviewed the 99 first-parent delivery commits after retained acceptance commit `d3b18f1c9d67a96b58017ffa1675df90e489baf3` through immutable run baseline `216523fde3d5353aaa13a1379de460af53dc491a`. The pass covered 119 changed files, including 86 TypeScript files with 4,017 additions and 556 deletions.

### Summary of changes

- Confirmed the changed acquisition, batch, housekeeping, roadmap, website, engineering, generated-publication, radar, and capability surfaces pass their declared repository contracts and regression suites.
- Confirmed removal of legacy review evidence, completed work records, and legacy batch files was paired with current owner records and clean repository audits rather than leaving broken references.
- Identified one material residual: `knip.json` still targets the former one-level skill layout. `bunx knip` exits successfully but reports 14 configuration hints, including unmatched `skills/*/scripts/**/*.ts` patterns, so it does not prove dead-code coverage across `skills/<domain>/<skill>/scripts/`.
- Captured the distinct, unadopted follow-up in `KI-HARNESS-FND-025`; no implementation was folded into this review.

### Verification

- `ki repo audit --repo .` — 30 skill groups pass, two groups warn, zero fail. The three warnings are the already identified Claude Desktop render drift and the two pre-anchor housekeeping diagnostics.
- Focused `ki-engineering`, `ki-skills`, and `ki-repo-harness` audits — pass.
- `bun run test` — 726 pass, 0 fail, 3,190 expectations across 133 files.
- `bunx tsc --noEmit` — pass.
- `bunx biome check .` — 580 files checked, no fixes required.
- `git diff --check` — pass.

### Outstanding concerns

- Knip source coverage remains incomplete until `KI-HARNESS-FND-025` is adopted and delivered.
- Claude Desktop's missing `MCP_M365_ATTACHMENT_ROOTS` is external rendered-state drift. Its canonical source is correct; applying chezmoi remains a separately approved user-environment action.
- The two housekeeping warnings cannot clear until these review records are accepted and the templates receive exact reviewed-revision anchors.

### Post-change review

No repository implementation was changed during the review. The sole new work record is evidence-backed, deduplicated, and remains in Triage. All other changed engineering surfaces have a passing owner audit and regression evidence; no additional broad remediation is justified.

### Mini recap

Engineering and mechanical governance are stable across the recent delivery interval, with one bounded knip-coverage gap captured for later disposition.

## Discussion

The early run is explicitly user-requested and nearly coincides with the 100-commit trigger. It must not manufacture a historical anchor: only this run's accepted reviewed revision can become `last-run-ref`.
