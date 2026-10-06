---
id: KI-HARNESS-GOV-122
area: GOV
title: Capital-governed trade routes
theme: governance-consistency
horizon: now
status: in-progress
blocks: []
blocked_by: []
baseline_ref: d9476ba12327c27af97d02ec6c914060d3a31354
created_at: 2026-10-01T04:23:19Z
updated_at: 2026-10-06T15:00:00Z
---

# KI-HARNESS-GOV-122: Capital-governed trade routes

## Goal

Every repository declares its territory Capital, and the `ki-trades` standard, rubric and decision record take trade routes and standing-intake grants only from that Capital's policy. A member declares a bare `[skills.ki-trades]` carrying at most `map_bonus`, and any island the policy names must declare it.

## Context

The territorial model, classification and exchange design live in Arcadia as [KI-ARCADIA-GOV-016](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-GOV-016-territorial-classification-and-exchange.md), approved by the owner on 2026-10-06. This item is the harness's share of delivery; `tools-ki` delivers resolution, the read-only policy commands and the migration report as `KI-TOOL-CLI-104`.

The schema has three parts. `[skills.ki-repo].capital` is a mandatory canonical HTTPS URL in every `.ki.toml`, and a Capital points to itself. The Capital alone declares `[skills.ki-repo.territory]` with `name` and sorted `members`, including itself. The Capital alone declares `[skills.ki-trades.territory]` with `subtypes`, `[[channels]]` (`id`, `purpose`, `from`, `to`, `kinds`) expanding to exact `(source, receiver, kind)` triples, and `[[standing]]` grants. Resolution goes through the declared Capital in the local registry: a Capital that is not checked out is a stated WARN, never a FAIL or a silent "no routes"; an ambiguous or malformed policy fails closed.

## Boundary

- Harness standard, rubric, skill text, decision record and the harness's own `.ki.toml`. Executable route authority in `tools-ki` belongs to `KI-TOOL-CLI-104`; member `.ki.toml` changes elsewhere belong to the GOV-016 rollout.
- The two submitted records `TRD-8004751b` and `TRD-d03495e9` are neither rewritten nor stranded.
- No cross-territory activation.

## Current state

In progress. The owner collapsed the earlier staged plan on 2026-10-06: one change straight to the target state, no WARN transition and no legacy-compatibility layer, and the `capital` key is mandatory from the start. The rubric, standard, skill text and successor decision record are implemented on `feat/gov-122-capital-territory`; the harness's own route tables are stripped in the same change.

## Steps

- [x] `ki-repo` TERR-1 fails a missing or non-canonical `capital` and `conform` infers it when exactly one registered Capital lists the repository; TERR-2 checks the Capital-only territory table; TERR-3 checks two-way agreement with the registry, warning "territory policy lives in <url>, not available here" when the Capital is not checked out.
- [x] `ki-repo` COV-1 gains a `trades` signal: a repository named in any channel of its Capital's policy must declare `ki-trades`.
- [x] `skills/governance/ki-trades/scripts/rubric/contexts/trades.ts` resolves the Capital policy through the declared `capital`, and route, record and standing evidence read policy edges and grants.
- [x] Rubric items: CONFIG-1 fails retired `routes` and `subtypes` and a non-Capital `territory`; ROUTE-1 reads the Capital policy (unavailable WARN, ambiguous or malformed FAIL); new ROUTE-2 warns when declared but named in no channel; new Capital-only POLICY-1 schema and POLICY-2 named islands declare `ki-trades` (unregistered is INFO); AUTH-1 and STANDING-1 wording. `references/rubric.md` regenerated.
- [x] `references/standards-trades.md` gains Participation and Capital trade policy sections; `ki-trades` and `ki-trade` SKILL text drop the route and subtype mutators for the read-only policy commands; `ki-authoring` TOML exemplars lose route examples.
- [x] `GDR-KI-HARNESS-013` records Capital-owned trade policy and `GDR-KI-HARNESS-005` is archived as superseded.
- [x] Rework `trades.test.ts` to temporary Capital, member and peer fixtures with a temporary registry.
- [x] Declare the harness's Capital and strip its member route and subtype tables.
- [ ] Review and acceptance.

## Files touched

- `skills/keystone/ki-repo/` (territory rubric items, COV-1 trades signal, `references/standards-repository.md`, presentation test fixture)
- `skills/governance/ki-trades/` (rubric context, items including new `items/policy.ts`, tests, `references/standards-trades.md`, `references/rubric.md`, `references/sources.md`, `SKILL.md`)
- `skills/governance/ki-trade/` (`SKILL.md`, `references/standards-trade-operations.md`)
- `skills/governance/ki-authoring/references/` (`standards-toml.md`, `exemplars.md`)
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- `docs/decisions/GDR-KI-HARNESS-013-capital-owned-territory-trade-policy.md`, `GDR-KI-HARNESS-005-cross-repository-trade-routes.md`, `README.md`
- `.ki.toml`

## Verify

- `bun run test`, `bunx tsc --noEmit -p .`, biome and rumdl pass; the `ki-trades`, `ki-repo` and `ki-skills` rubrics are in sync with their catalogues.
- With the locally built `tools-ki` and this harness in an isolated `KI_*_HOME` holding all 41 registered checkouts: Arcadia's policy check reports every member conforming, `policy compare` against the v0.6.1 route baseline loses no edge, and `ki repo audit --repo . --progress never --concise` passes here and in Arcadia.

## Dependencies / blocks

No local dependency. The cross-repository relationship is recorded under Discussion.

## Documentation impact

### Decision Records

`GDR-KI-HARNESS-013` supersedes `GDR-KI-HARNESS-005`, which is archived.

### Specifications

The `ki-trades` and `ki-repo` standards and generated rubrics, and the `ki-authoring` TOML standard.

### Guides

`ki-trades` EDUCATE and `ki-trade` help text.

### Roadmap

None beyond this record.

## Discussion

### Cross-repository relationship

This item is blocked by `knowledgeislands/ki-arcadia-principal` `KI-ARCADIA-GOV-016`, which settles the policy authority and schema, and ships its switch together with `knowledgeislands/tools-ki` `KI-TOOL-CLI-104`.

### Re-scope

The owner re-scoped this item on 2026-10-06. Its former design questions (classification, warranted trades, offline peers, revocation and cross-territory exchange) are answered or deferred in `KI-ARCADIA-GOV-016`; the earlier owner question whether to design inter-territory exchange now is answered there: design the principles, defer activation.

### Owner decisions - 2026-10-06

- One change straight to the target state: no staged releases, no WARN transition for retired member keys, and no legacy-compatibility layer.
- The `capital` key is mandatory and fails immediately; CI failures while released tooling catches up are accepted.
- The `tools-techne` to `homebrew-tap` work channel is active in the Arcadia policy.
