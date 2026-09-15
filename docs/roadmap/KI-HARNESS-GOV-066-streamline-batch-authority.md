---
id: KI-HARNESS-GOV-066
area: GOV
title: Streamline Batch Authority
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 597762d65adcf69402fad8a3df8287b8acc95174
created_at: 2026-09-15T05:00:57Z
updated_at: 2026-09-15T05:16:00Z
---

# Streamline Batch Authority

## Goal

Make one batch a lean, integrity-bound authority envelope over a frozen set of Ready work items, with efficient execution and consolidated acceptance instead of duplicated project management.

## Context

The latest four delivered records used three batch files containing 177 lines and 17 commits. Their safety boundaries remained valuable, but scope, checks, stops, closure IDs, review evidence, and lifecycle transitions were repeatedly restated. The implementation standard already permits `in-progress` to remain operational instead of requiring a standalone commit.

The approved direction keeps exact-set freezing, repository isolation, item-owned plans and review packets, append-only outcome evidence, and explicit stop conditions. It replaces the pre-publication contract in place with one safe-local policy, derives all-item closure from `completion_target: done`, and treats newly discovered remedial work as capture-only input to a later batch.

## Boundary

Do not introduce dynamic admission, weaken exact-item integrity, infer human authority, collapse item-owned verification, permit public-contract decisions outside approved authority, alter pruning rules, broaden repository scope, or authorise push or release. Existing completed records remain verifiable as retained evidence until normal cleanup removes them; their retired shape is not executable or available for new authoring.

## Current state

Delivered from immutable baseline `597762d65adcf69402fad8a3df8287b8acc95174` under the user's explicit approval of the lean exact-set proposal. The portable skill contract, pure validators, governance decision, examples, generated catalogue, and receiver-owned CLI roadmap plan now agree on one in-place v1 shape.

## Steps

- [x] Add a governance Decision Record for the lean exact-set authority envelope and consolidated acceptance.
- [x] Replace the current frontmatter with `policy: safe-local-v1`, deriving fixed stops and all-item closure while retaining approval evidence, expiry, exact IDs, and payload binding.
- [x] Retain a narrow cleanup-only reader for existing completed records and reject the retired shape for execution or new authoring.
- [x] Reduce new authorisation bodies to the identity heading plus append-only run ledger; keep plans, checks, and review packets in canonical work records.
- [x] Define selection-first freezing, capture-only remedial findings, `N + 2` commit guidance, focused per-item checks, and one aggregate final gate.
- [x] Update pure authorisation, batch-cycle, and retention fixtures for the replaced contract and retained legacy evidence.
- [x] Refresh the reviewed-item and outcome-authority exemplars.
- [x] Shape `KI-TOOL-CLI-070` around deterministic `prepare`, `validate`, `run`, and `close` support without moving authority semantics into the CLI.
- [x] Regenerate affected skill publications and run focused and repository-wide verification.

## Files touched

- `docs/decisions/GDR-KI-HARNESS-009-lean-exact-set-batch-authority.md`
- `docs/decisions/README.md`
- `docs/guides/skills-by-outcome.md`
- `skills/change-management/ki-batch/`
- `skills/README.md`
- This roadmap item and batch run ledger.
- Receiver-owned `tools-ki` roadmap item in independent commit `e464cea`.

## Verify

- Focused `ki-batch` authorisation, cycle, and retention tests.
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No Harness dependency. Native CLI implementation follows the accepted contract through receiver-owned `KI-TOOL-CLI-070`; it does not block the portable process contract.

## Documentation impact

### Decision Records

Added and registered `GDR-KI-HARNESS-009`.

### Specifications

No repository-wide Specification change. The process skill owns the portable batch contract.

### Guides

Updated the task-oriented skill guide and both batch exemplars for the lean workflow.

### Roadmap

This record owns Harness delivery. The independently committed `tools-ki` item owns native mechanics and is Ready for implementation.

## Review

### Delivered

Replaced the pre-publication authoring contract in place with the lean exact-set shape and fixed safe-local policy. Added the durable governance decision, aligned examples and guidance, regenerated the capability catalogue, and prepared the receiver-owned CLI implementation item.

### Summary of changes

New records omit duplicated run ID, timebox name, stop list, closure list, and plan prose. The parser derives one run ID and all-item closure, validates the identity-only protected body, rejects retired records for execution, and preserves their parsing only for integrity-aware retention. Batch execution guidance now uses selection-first freezing, item-focused delivery checks, one aggregate gate, capture-only follow-ups, and the preferred `N + 2` commit topology.

### Verification

All 20 focused batch tests pass. The full Harness test suite and TypeScript gate pass. The `ki-skills`, `ki-repo-harness`, `ki-decision-records`, `ki-work-roadmap`, and `ki-authoring` audits pass, and the generated capability catalogue is current.

### Outstanding concerns

Native CLI automation remains independently scheduled as Ready `KI-TOOL-CLI-070`; it is not required for the portable contract to operate. No other delivery concern remains.

### Post-change review

Implement the prepared `tools-ki` item when that repository next takes CLI delivery work. Evaluate rolling admission only if later usage demonstrates that capture-only next waves are materially restrictive.

### Mini recap

The lean authority envelope is delivered and verified from baseline `597762d6`. The user explicitly approved implementation and subsequently directed that the pre-publication v1 be replaced in place rather than introducing v2. The only follow-up is independently owned CLI automation.

## Discussion

The contract deliberately optimises the common case before considering rolling admission. One autonomous window freezes one complete eligible set. Work discovered during execution is captured for the next wave, preserving an easily reviewed authority boundary. No schema-version split is needed before public release.
