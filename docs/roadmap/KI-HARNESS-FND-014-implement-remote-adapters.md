---
id: KI-HARNESS-FND-014
area: FND
title: Implement remote adapter execution
theme: foundation-tooling
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-08-09T20:58:31Z
updated_at: 2026-09-02T21:39:21Z
---

## Goal

Let the shared change-management lifecycle operate authorised GitHub Issues and Linear records rather than stopping at configuration standards.

## Context

`ki-work` and both remote adapter standards define adapter selection, provider-owned locators, lifecycle mapping, migration stops, closure semantics, and fail-closed remote execution. Process skills still have no authorised path to perform authenticated remote reads and writes. `ki-next` and `ki-plan` each carry a duplicate pure selected-adapter resolver, while `ki-implement` and `ki-accept` model remote refusal independently.

The Harness shared-module contract gives `ki-work` a portable ownership seam: it can publish one operation module that each process materialises locally, avoiding checkout-relative imports and process-specific resolver forks.

## Boundary

Do not introduce a parallel local tracker, synchronisation layer, runtime-vendor-specific shared contract, or unauthorised remote write. Repository-roadmap and KB Streams adapters retain their local implementations. A provider binding may use a connector, CLI, or API, but the common lifecycle sees only the adapter's declared mapping and opaque provider evidence. If the runtime cannot prove suitable capability, authentication, current identity, concurrency, or write authority, the process stops.

### Shaping

#### Selected design

`ki-work` owns one selected-adapter operation module published through the shared-module contract and materialised into `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept`. The module retains provider-native locators and exposes the shared lifecycle projection plus opaque snapshot evidence.

The first operational slice uses GitHub Issues. `ki-next` performs read-only inventory, then `ki-plan` performs exactly one authorised reversible readiness transition after an immediate reread and verifies the post-write snapshot. Multi-record remote readiness, implementation, acceptance, and pruning remain unsupported until that slice proves the authority and concurrency boundary. Linear receives the workspace-locator contract and pure fixtures but is not a live first provider.

#### Operation evidence

The provider-neutral input and result cover provider, current native locator, retained aliases, lifecycle projection, opaque snapshot or version evidence, authenticated identity, mutation authority, intended transition, approval evidence, durable remote reference, post-write snapshot, and explicit refusal or partial-write evidence. Provider-specific concurrency tokens remain opaque outside the owning adapter.

#### Promotion conditions

Mark Ready when the Linear workspace locator, operation shapes, capability-resolution rule, stale-read stop, provider fixtures, and single-record boundary are specified, and an explicitly authorised GitHub repository and draft Issue are selected for the `ki-next` to `ki-plan` pilot.

## Current state

No locally inspected repository currently selects `github-issues` or `linear`. An authenticated GitHub CLI and administrator access to an Issues-enabled repository establish capability evidence, but they do not authorise changing that repository's selected roadmap adapter or creating a pilot Issue. No equivalent local Linear capability or workspace locator is currently available.

The shared resolver, operation shape, Linear configuration delta, provider fixtures, and single-record fail-closed boundary are locally decidable. The item is selected for current attention because implementation design can proceed, but it remains Draft until the live pilot target and mutation authority are explicit.

The 2026-09-02 estate recheck still found no repository selecting `github-issues` or `linear`. No pilot repository, draft Issue, lifecycle metadata mapping, or reversible mutation authority has been supplied, so the record remains Draft; the locally decidable shared-module and fixture work should be shaped only after that pilot boundary can make the first operational slice testable end to end.

## Steps

- [ ] Define and test one `ki-work` shared module for selected-adapter resolution and remote operation evidence, then materialise it into all four process skills.
- [ ] Define the provider-neutral operation input, success, refusal, conflict, and partial-write result shapes.
- [ ] Extend `ki-work-linear` with an inspectable workspace URL, update its audit and generated rubric, and refresh authoritative Linear locator and concurrency sources.
- [ ] Add pure no-write GitHub and Linear fixtures covering capability absence, authentication refusal, locator migration, lifecycle conflicts, stale reads, insufficient write authority, post-write mismatch, and provider filtering.
- [ ] Select one explicitly authorised GitHub Issues pilot repository and one reversible draft Issue whose lifecycle metadata can move from queue to ready without changing the repository's canonical tracker by implication.
- [ ] Prove read-only `ki-next` inventory, then one authorised `ki-plan` queue-to-ready transition with immediate pre-write reread and matching post-write snapshot.
- [ ] Review the pilot before extending the operation contract to `ki-implement` delivery evidence or `ki-accept` closure. Keep remote pruning unsupported.
- [ ] Remove pending-FND-014 refusal language only from consumers and provider operations actually proven by the pilot.

## Files touched

- `skills/change-management/ki-work/` selected-adapter standard, shared operation module, and tests
- Materialised shared-module copies and focused decision models under `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept`
- `skills/change-management/ki-work-github-issues/` provider standard, sources, and fixtures
- `skills/change-management/ki-work-linear/` configuration standard, sources, rubric, and fixtures
- Generated capability and rubric publications affected by the shared module or Linear configuration change
- This work item and the authorised remote pilot evidence

## Verify

- Focused tests for the canonical resolver and each consumer's remote-operation decisions
- GitHub fixtures for record filtering, transfer aliases, stale snapshots, permission refusal, and post-write verification
- Linear fixtures for workspace and team resolution, moved locators, workflow mapping, stale snapshots, permission refusal, and post-write verification
- `ki repo audit --skill ki-work --repo <fixture-or-pilot>` and the selected remote-adapter audit
- One live `ki-next` inventory with zero writes
- One authorised `ki-plan` queue-to-ready transition with matching pre-write and post-write evidence
- `ki repo audit --skill ki-skills --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

Readiness requires explicit selection of the pilot repository and Issue, confirmation of its lifecycle metadata owner and values, and authority for the live reversible mutation. Current GitHub access is capability evidence only. Provider concurrency and version semantics must be refreshed from current authoritative sources during implementation.

## Documentation impact

### Decision Records

Add or amend a decision only if implementation changes the existing authority model rather than projecting it remotely.

### Specifications

The selected-adapter operation shape is an internal process contract, not a separate product specification.

### Guides

Document provider setup and failure recovery after the first live slice proves them.

### Roadmap

Later delivery and acceptance slices remain separately reviewable steps within this item until the first pilot shows whether they need independent records.

## Discussion

### Delegation

Keep the shared contract and first provider fixture in one coordinator-owned lane. Once that contract is fixed, GitHub and Linear fixture work can proceed independently. The coordinator retains pilot selection, remote authority, integration, and live verification.
