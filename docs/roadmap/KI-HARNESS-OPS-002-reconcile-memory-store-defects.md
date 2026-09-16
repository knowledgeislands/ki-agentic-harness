---
id: KI-HARNESS-OPS-002
title: Reconcile memory-store defects
area: OPS
theme: operations
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-16T12:51:00Z
---

## Goal

Correct the known memory-store defects so the stored guidance has one trustworthy source of truth.

## Context

The repository moved from the former `workspaces/kis/` checkout path to `workspaces/kit/`. Claude therefore resolves a new writable project-memory directory for the current checkout while the writable legacy directory retains the previous records.

The legacy runtime-strategy record still cites the superseded `SDR-KI-HARNESS-002-runtime-portable-contracts.md` filename. The canonical decision is now `SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md`. The same legacy directory still contains `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`, even though their guidance was promoted into durable instructions.

## Boundary

Limit the repair to the exact three legacy records and their index entries. Do not migrate the remaining legacy memory set, delete either project-memory directory, rewrite generated Headroom content, or redesign the memory backend. Route the observed path-dependent state split to `KI-HARNESS-RTP-003`.

## Current state

Both current and legacy project-memory directories are writable. The current `workspaces/kit/` directory contains its index and no authored memory records; the former `workspaces/kis/` directory retains the three confirmed targets and its wider legacy memory set. The repository-local `ki-housekeeping-claude` audit passes, but the two promoted records and stale citation remain outside the current selected store.

## Steps

- [ ] Re-resolve the current and legacy physical memory directories and capture hashes for the three exact target files plus the legacy `MEMORY.md` before writing.
- [ ] Update the legacy runtime-strategy record and its index description only as needed to reference the canonical runtime-portable-contracts Decision Record.
- [ ] Remove the legacy index entries for `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`, then delete exactly those two promoted memory files after explicit destructive-action approval.
- [ ] Verify the current memory directory and every other legacy memory file are unchanged, and record the path split as evidence for `KI-HARNESS-RTP-003`.
- [ ] Run the focused housekeeping and roadmap audits and retain the exact before-and-after evidence for review.

## Files touched

- The legacy project-memory `MEMORY.md`
- The legacy `project-harness-runtime-strategy.md`
- The legacy `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`
- This roadmap record

## Verify

- The runtime-strategy citation resolves to `docs/decisions/SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md`.
- The two approved promoted-memory files and their legacy index entries are absent.
- Hash comparison proves every non-target memory file and the current `workspaces/kit/` memory directory are unchanged.
- `ki repo audit --skill ki-housekeeping-claude --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

No technical dependency remains. Implementation requires explicit approval to delete the two exact external memory files; approval to move and shape this roadmap item does not grant that destructive authority.

## Documentation impact

### Decision Records

No Decision Record changes are required; the repair restores the existing canonical SDR reference.

### Specifications

No behaviour-level specification changes are required.

### Guides

No guide changes are required because promoted Git guidance is already durable elsewhere.

### Roadmap

Use the observed checkout-path split as concrete shaping evidence for `KI-HARNESS-RTP-003`; do not broaden this repair into that routing decision.

## Discussion

### Return condition

The return condition was satisfied on 2026-09-16: both relevant directories are writable and the exact three targets remain observable. Any remaining backend concern must be supported by a reproducible inconsistency after this bounded repair.
