---
id: KI-HARNESS-GOV-166
area: GOV
title: Retire shared_record
kind: deliver
purpose: debt
initiative: platform-foundations
component: governance
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: e440152f2902a40c20e8ddb4dc1d2d2da7341e29
created_at: 2026-10-08T13:49:15Z
updated_at: 2026-10-09T15:56:09Z
---

# KI-HARNESS-GOV-166: Retire shared_record

## Goal

The vestigial `shared_record` Decision Record mechanism is retired, so the `ki-decision-records` standard, rubric and code describe only the local records that every repository now holds.

## Context

The GOV-020 Decision Record scope rollout made every record's scope equal its repository's `repo_code`, enforced by `ROOT-3`. It deleted the mirrored `GDR-KI-FUNDAMENTALS-001` copies, and Arcadia's former TECHNE records and its fundamentals record became local records without `shared_record`. No live record now carries the field, yet it survives in `docs/specs/governance.md`, [GDR-KI-HARNESS-007](../decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md), the `ki-decision-records` SKILL.md, audit mode and standard, and the rubric's `shared-projection` context and its tests.

## Boundary

In scope: confirming that no repository in the territory still uses `shared_record`; removing the field, the shared-projection context and its rubric wiring and tests; and updating the standard, specification and any affected Decision Record. Out of scope: Decision Record scope rules (`ROOT-3`); cross-repository provenance, which stays with canonical source references.

## Current state

- A local search of every repository checked out under `~/workspaces` on 2026-10-09 found no Decision Record carrying `shared_record`. The one remaining hit is a test fixture in `apps-observatory/packages/evidence/src/frontmatter.test.ts`, which exercises that application's own frontmatter parser rather than a governed record.
- `ki-decision-records` still documents the marker in `SKILL.md`, `references/standards-decision-records.md` (numbering and frontmatter rules) and `references/mode-audit.md`.
- Its rubric reads the field in `scripts/rubric/contexts/decision-records.ts`, projects it through `scripts/rubric/contexts/shared-projection.ts`, enforces projection eligibility as FM-7, and exempts mirrors from FILENAME-5 serial continuity. Tests in `shared-projection.test.ts`, `decision-records.test.ts` and `items/index.test.ts` cover it.
- [GOV-012](../specs/governance.md) specifies the projection, and [GDR-KI-HARNESS-007](../decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md) decides it.

## Steps

- [x] Re-confirm that no repository in the territory carries `shared_record` on a Decision Record.
- [x] Delete `shared-projection.ts` and its test; remove `sharedRecord` and the projection fields from the Decision Record context, so every record counts in its prefix+scope serial series.
- [x] Retire FM-7 and drop the mirror exemption from FILENAME-5's description; remove the shared-record fixtures and tests.
- [x] Remove the marker from `SKILL.md`, the standard and the audit mode, and regenerate `references/rubric.md`.
- [x] Mark GOV-012 deprecated in place with a one-line reason, and remove the shared-identity paragraph and consequence from GDR-KI-HARNESS-007.
- [x] Run Verify, assemble the review packet and set this record `awaiting-review`.

## Files touched

- `skills/governance/ki-decision-records/SKILL.md`
- `skills/governance/ki-decision-records/references/standards-decision-records.md`, `mode-audit.md` and generated `rubric.md`
- `skills/governance/ki-decision-records/scripts/rubric/contexts/decision-records.ts`, `decision-records.test.ts`, and deleted `shared-projection.ts` and `shared-projection.test.ts`
- `skills/governance/ki-decision-records/scripts/rubric/items/frontmatter.ts`, `filename.ts` and `index.test.ts`
- `docs/specs/governance.md`
- `docs/decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md`
- This record

## Verify

- `git grep -n shared_record` returns only this record and the deprecated GOV-012 note.
- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-decision-records` leaves `references/rubric.md` unchanged after regeneration.
- `ki repo audit --skill ki-decision-records`, `ki repo audit --skill ki-specs` and `ki repo audit --skill ki-skills` report no FAIL.

## Dependencies / blocks

No roadmap dependency. Follows the GOV-020 Decision Record scope rollout, which left the field unused. Blocks nothing.

## Documentation impact

### Decision Records

GDR-KI-HARNESS-007 loses its shared-identity paragraph and the consequence that depends on it, edited in place.

### Specifications

GOV-012 is deprecated in place; its number stays claimed.

### Guides

None: no guide describes shared records.

### Roadmap

None.

## Review

### Delivered

Retired the `shared_record` Decision Record mechanism within the approved boundary: standard, skill, audit mode, rubric, code and tests no longer describe it; GOV-012 is deprecated in place; GDR-KI-HARNESS-007 no longer decides shared identity. `ROOT-3` scope rules and canonical source references are unchanged. Baseline `e440152f2902a40c20e8ddb4dc1d2d2da7341e29`; the delivery commit follows it on `main`.

### Change Summary

- `ki-decision-records`: deleted `scripts/rubric/contexts/shared-projection.ts` and its test; removed `sharedRecord` and the projection fields from `decision-records.ts`, so every record now counts in its prefix+scope serial series; retired FM-7 from `items/frontmatter.ts`; dropped the mirror exemption from FILENAME-5 in `items/filename.ts`; removed shared-record fixtures and the `shared record mirrors` tests from `decision-records.test.ts` and `items/index.test.ts`.
- `SKILL.md`, `references/standards-decision-records.md` and `references/mode-audit.md` no longer mention the marker; `references/rubric.md` drops FM-7 and the FILENAME-5 exemption.
- `ki-skills/scripts/internal/remediation-inventory.test.ts`: the structured-criterion inventory falls by one (FM-7, a diagnostic mechanical criterion).
- `docs/specs/governance.md`: GOV-012 struck through and marked deprecated with its reason.
- `docs/decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md`: shared-identity paragraph and dependent consequence removed in place.
- Deviation: `ki dev skill rubric` renders only the dev-linked primary checkout, so `references/rubric.md` was edited by hand in the worktree and then compared with `tools-ki`'s `renderRubricMarkdown` output for the worktree's rubric items: byte-identical.

### Verification

- `git grep -n shared_record` outside `docs/roadmap/`: no matches.
- `bun run test`: 1059 pass, 0 fail.
- `bunx tsc --noEmit`: pass.
- Rubric publication: rendered catalogue identical to `references/rubric.md`.
- `ki repo audit --skill ki-decision-records`: PASS. `ki repo audit --skill ki-specs`: PASS. `ki repo audit --skill ki-skills`: FAIL=0, WARN=1 (pre-existing LONG-3 refresh-cadence warning on `ki-skills` sources, unrelated).

### Outstanding concerns

- Territory evidence is a local search of repositories checked out under `~/workspaces`; a repository not checked out locally was not searched. The only hit, an `apps-observatory` parser test fixture, is not a governed record and is left alone.
- Installed checkers keep FM-7 until the next harness release reaches them; with no live `shared_record` record it cannot fire.

### Post-change review

The goal is met: only local records remain in the contract. Scope held to the record's boundary. Regression risk is low: a stray `shared_record: true` on a record now just counts in its local series, which is the stricter behaviour. Ready for acceptance.

### Mini recap

Removed a vestigial cross-collection mirroring mechanism from `ki-decision-records` and its specification and decision. Verification passed in full. Possible learning route, not promoted: `ki dev skill rubric` cannot render a worktree's rubric, which makes worktree delivery of rubric changes depend on a manual comparison; a `--root` option in `tools-ki` would remove that step.

## Discussion

Captured as a follow-up of the GOV-020 Decision Record scope rollout, whose report found the mechanism effectively vestigial.

### Adoption and readiness

Kris adopted this record on 2026-10-09 and asked for it to be planned, implemented and brought to review in one run; that instruction is the Ready approval for the plan above.
