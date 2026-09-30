---
id: KI-HARNESS-GOV-119
area: GOV
title: Simplify Agora membership
theme: governance-consistency
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 07707804caeb36983aaa369a507aed37cfb9c248
created_at: 2026-09-27T19:09:14Z
updated_at: 2026-09-30T13:04:14Z
---

# KI-HARNESS-GOV-119: Simplify Agora membership

## Goal

Reciprocal Agora membership records identities and consent without redundant role labels, while home, member, and reference remain distinct relationship kinds.

## Context

The former `ki-agora` standard required a role on both sides and matching values for reciprocity, although roles granted no permission or priority. Live groups used `member` and `observer` labels without different resolver behaviour. The user approved a role-free declaration contract and its live migration on 2026-09-30.

## Boundary

Keep owner approval, independent member consent, canonical identities, reciprocal resolution, and reference separation. This item owns the harness-side contract, rubric, and examples. The CLI parser and live declarations are a coordinated direct-user migration; `KI-TOOL-CLI-099` separately owns human-facing output grouping.

## Current state

The baseline used repository-to-role member tables and role-bearing member consent. The registered Agoras were reciprocal, so a coordinated schema cutover could preserve every participant identity.

## Steps

- [x] Define role-free home members and member consent in the decision and standard.
- [x] Update local validation, focused tests, generated rubric, and published skill catalogue.
- [ ] Complete the three held Techné declarations, then verify reciprocal Agora resolution estate-wide.

## Files touched

The `ki-agora` skill, `GDR-KI-HARNESS-006`, generated catalogue, authoring examples, this record, and the local `.ki.toml`. The companion CLI change and individual repository declarations are committed in their own repositories.

## Verify

Run `bun run test`, `bunx tsc --noEmit`, the focused `ki-agora`, `ki-repo-harness`, and `ki-authoring` audits, and `ki agora audit` across all registered profiles. The CLI's focused Agora tests, type check, and coverage gate provide host-side evidence.

## Dependencies / blocks

The new CLI parser and migrated home/member declarations must land together so named Agoras continue to resolve. The separate output-grouping item has no build-order dependency on this contract change.

## Documentation impact

### Decision Records

Amend `GDR-KI-HARNESS-006` in place. The separately governed shared fundamentals record remains under Arcadia's enactment work because it also names retired Agoras.

### Specifications

Update the `ki-agora` standard and generated rubric; the CLI's AGORA-002 specification follows the new declaration shape.

### Guides

Update the authoring examples and website-owned skills-by-outcome wording that described Agora roles.

### Roadmap

Retain `KI-TOOL-CLI-099` for output grouping. This record moves to human review after the held declarations migrate and estate-wide verification passes.

## Review

### Delivered

The harness contract now accepts a duplicate-free member identity array and member consent containing only the canonical home. Baseline: `07707804caeb36983aaa369a507aed37cfb9c248`. Owner inclusion, reciprocal consent, reference separation, and local-only target selection remain intact.

### Change Summary

The standard, `GDR-KI-HARNESS-006`, rubric validator and publication, skill description and catalogue, examples, and local declaration now use the role-free shape. A bounded rewrite verified preservation of home IDs, member identities, and membership homes in 44 live declarations; 41 were committed, while the three Techné changes were reverted under their programme hold. `tools-ki` removed role parsing and matching in commit `62f00ce`; its output presentation remains tracked by `KI-TOOL-CLI-099`.

### Verification

- Harness `bun run test`, `bunx tsc --noEmit`, and focused `ki-agora`, `ki-repo-harness`, and `ki-authoring` audits pass.
- `ki agora audit` reports seven healthy profiles and one KIS finding from a held Techné declaration. The estate-wide focused `ki-agora` audit reports 41 passes and three failures, all in the held Techné repositories.
- `tools-ki` focused Agora tests, TypeScript check, and focused `ki-self`, `ki-agora`, and `ki-authoring` audits pass.
- `tools-ki` full coverage tests pass, but the global 100% gate fails on one uncovered function in unrelated `src/core/storage/repository-stores.ts`.

### Outstanding concerns

The Techné programme hold covers `ki-techne-harness`, `ki-techne-principal`, and `tools-techne`; their role-bearing declarations remain unchanged until the principal explicitly resumes that work after the local Paperclip learning review. These declarations now fail strict validation, and the KIS Agora is unhealthy until they migrate. The unrelated `tools-ki` coverage gap is outside this contract change and remains a repository gate finding. Arcadia's shared `GDR-KI-FUNDAMENTALS-001` still names retired Agora groups and role labels; its existing `KI-ARCADIA-ECO-006` enactment item owns that amendment. `KI-TOOL-CLI-099` owns the requested output grouping.

### Post-change review

The migrated declarations preserve participant identities without role equality. The new validator rejects legacy tables, repeated members, and unexpected consent fields. Focused tests cover the changed behaviour; the live audit exposes the three held legacy declarations, while the separate coverage finding and shared-record amendment remain visible for review.

### Mini recap

Role-free membership is implemented and 41 declarations are committed. The KIS Agora remains unhealthy because three Techné declarations are held. The harness gates pass; one unrelated CLI coverage function remains uncovered. The durable contract is in `ki-agora` and `GDR-KI-HARNESS-006`, while the shared fundamentals amendment and output grouping retain their own work owners.

## Discussion

### Relationship kinds

Home owns the group declaration, a member reciprocally consents while governing itself, and a reference is owner-selected without membership. Former `observer` labels did not alter resolver behaviour and their repositories remain reciprocal members.
