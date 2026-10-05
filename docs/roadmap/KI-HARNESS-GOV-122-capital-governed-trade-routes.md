---
id: KI-HARNESS-GOV-122
area: GOV
title: Capital-governed trade routes
theme: governance-consistency
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T04:23:19Z
updated_at: 2026-10-06T10:00:00Z
---

# KI-HARNESS-GOV-122: Capital-governed trade routes

## Goal

The `ki-trades` standard, rubric and decision record take trade routes and standing-intake grants from the territory Capital's policy rather than paired member `.ki.toml` tables. A member declares a bare `[skills.ki-trades]`, and any island the policy names must declare it.

## Context

The territorial model, classification and exchange design moved to Arcadia as [KI-ARCADIA-GOV-016](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-GOV-016-territorial-classification-and-exchange.md), approved by the owner on 2026-10-06. That record owns the conceptual questions this item formerly held: classification, when a trade is warranted, and cross-territory exchange, whose activation is deferred. This item is re-scoped to the harness's share of delivery. `tools-ki` delivers resolution, the sweep and migration as `KI-TOOL-CLI-104`.

The Capital policy is planned at `Admin/Governance/trade-policy.toml` in the Capital, resolved among registered `ki-repo-kb-principal` repositories whose policy names the host as Capital. Channels expand to exact `(source, receiver, kind)` triples; standing grants live in the same policy. Missing or ambiguous policy is unavailable and fails closed; no Agora is consulted.

## Boundary

- Harness standard, rubric, skill text and decision record only. Executable route authority in `tools-ki` belongs to `KI-TOOL-CLI-104`.
- No member `.ki.toml` is stripped until the switched tooling is installed everywhere, per GOV-016's migration sequence.
- The two submitted records `TRD-8004751b` and `TRD-d03495e9` are neither rewritten nor stranded.
- No cross-territory activation.

## Current state

Draft, re-scoped on 2026-10-06 from design to delivery. The standard, rubric and `GDR-KI-HARNESS-005` still describe paired member route tables; 21 KI repositories carry them.

## Steps

- [ ] `skills/governance/ki-trades/scripts/rubric/contexts/trades.ts`: add Capital policy parse and resolution reusing `registeredRepositories`; rewrite `routeEvidence`, the `permitted` check in `recordEvidence` and `standingCaptureEvidence` against policy edges and grants; accept a bare member table and report legacy keys; add Capital-only `policyEvidence`.
- [ ] Rubric items: CONFIG-1 retires `routes` and `subtypes` (WARN in transition, FAIL after); ROUTE-1 reads the Capital policy (unavailable WARN, ambiguous or malformed VIOLATION); new ROUTE-2 warns when declared but named nowhere; new Capital-only POLICY-1 schema, POLICY-2 named islands declare `ki-trades` (unresolvable is INFO), POLICY-3 members agree with Known Lands; AUTH-1 and STANDING-1 wording. Regenerate `references/rubric.md`.
- [ ] `ki-repo` COV-1 gains a `trades` signal: detected when the resolved Capital policy names the island or local `_TRADES` records exist, so a named but undeclared island fails a full audit.
- [ ] Rewrite `references/standards-trades.md` participation, standing intake and authority sections and add the Capital policy section; update `ki-trades` and `ki-trade` SKILL text; supersede `GDR-KI-HARNESS-005` in place or by successor per the decision-record standard.
- [ ] Rework `trades.test.ts` fixtures to policy fixtures.

## Files touched

- `skills/governance/ki-trades/` (rubric context, items, tests, `references/standards-trades.md`, `references/rubric.md`, `SKILL.md`)
- `skills/governance/ki-trade/SKILL.md`
- `skills/keystone/ki-repo/` (COV-1 context, `references/standards-configuration.md`, rubric)
- `docs/decisions/GDR-KI-HARNESS-005-cross-repository-trade-routes.md`

## Verify

- `ki-trades` and `ki-repo` rubric tests pass; regenerated rubric is clean.
- Against a fixture Capital policy equal to the current legacy routes, every territory member's `ki-trades` audit result is unchanged.

## Dependencies / blocks

No local dependency. The cross-repository relationship is recorded under Discussion.

## Documentation impact

### Decision Records

`GDR-KI-HARNESS-005` is amended or superseded to move route authority to the Capital.

### Specifications

The `ki-trades` standard and generated rubric.

### Guides

`ki-trades` EDUCATE and `ki-trade` help text.

### Roadmap

None beyond this record.

## Discussion

### Cross-repository relationship

This item is blocked by `knowledgeislands/ki-arcadia-principal` `KI-ARCADIA-GOV-016`, which settles the policy authority and schema, and ships its switch together with `knowledgeislands/tools-ki` `KI-TOOL-CLI-104`.

### Re-scope

The owner re-scoped this item on 2026-10-06. Its former design questions (classification, warranted trades, offline peers, revocation and cross-territory exchange) are answered or deferred in `KI-ARCADIA-GOV-016`; the earlier owner question whether to design inter-territory exchange now is answered there: design the principles, defer activation.
