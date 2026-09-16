---
id: KI-HARNESS-OPS-002
title: Reconcile memory-store defects
area: OPS
theme: operations
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: a20371601f95ea46a0602713429e7816be31486a
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-16T13:18:45Z
---

## Goal

Correct the known memory-store defects so the stored guidance has one trustworthy source of truth.

## Context

The repository moved from the former `workspaces/kis/` checkout path to `workspaces/kit/`. Claude therefore resolves a new writable project-memory directory for the current checkout while the writable legacy directory retains the previous records.

The legacy runtime-strategy record still cited the superseded `SDR-KI-HARNESS-001-runtime-portable-contracts.md` filename. The canonical decision is now `SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md`. The same legacy directory retained `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`, even though their guidance was promoted into durable instructions.

## Boundary

Limit the repair to the exact three legacy records and their index entries. Do not migrate the remaining legacy memory set, delete either project-memory directory, rewrite generated Headroom content, or redesign the memory backend. Route the observed path-dependent state split to `KI-HARNESS-RTP-003`.

## Current state

At the immutable baseline, both current and legacy project-memory directories were writable. The current `workspaces/kit/` directory contained its index and no authored memory records; the former `workspaces/kis/` directory retained the three confirmed targets and its wider legacy memory set. The repository-local `ki-housekeeping-claude` audit passed, while the two promoted records and stale citation remained outside the current selected store.

## Steps

- [x] Re-resolve the current and legacy physical memory directories and capture hashes for the three exact target files plus the legacy `MEMORY.md` before writing.
- [x] Update the legacy runtime-strategy record and its index description only as needed to reference the canonical runtime-portable-contracts Decision Record.
- [x] Remove the legacy index entries for `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`, then delete exactly those two promoted memory files after explicit destructive-action approval.
- [x] Verify the current memory directory and every other legacy memory file are unchanged, and record the path split as evidence for `KI-HARNESS-RTP-003`.
- [x] Run the focused housekeeping and roadmap audits and retain the exact before-and-after evidence for review.

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

No dependency or block remains. The user explicitly authorised progression after the plan named the two external deletions.

## Documentation impact

### Decision Records

No Decision Record changes are required; the repair restores the existing canonical SDR reference.

### Specifications

No behaviour-level specification changes are required.

### Guides

No guide changes are required because promoted Git guidance is already durable elsewhere.

### Roadmap

Use the observed checkout-path split as concrete shaping evidence for `KI-HARNESS-RTP-003`; do not broaden this repair into that routing decision.

## Review

### Delivered

From immutable baseline `a20371601f95ea46a0602713429e7816be31486a`, repaired the three exact legacy project-memory defects without migrating or changing the current memory store, the remaining legacy memories, generated Headroom content, or either memory directory.

### Summary of changes

Updated `project-harness-runtime-strategy.md` to the canonical `SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md` reference, removed the two corresponding entries from the legacy `MEMORY.md`, and deleted only `feedback-explicit-git-staging.md` and `complete-the-merge-loop.md`. Live inspection corrected the draft plan's provisional old filename from SDR-002 to the actually observed SDR-001 path; this did not change the approved repair boundary.

### Verification

- Confirmed all four pre-change targets were regular files rather than symlinks and captured their SHA-256 hashes.
- Confirmed both deleted files and their legacy index entries are absent.
- Confirmed the updated SDR path exists in the repository and is the only runtime-portable-contract citation in the repaired memory.
- Compared before-and-after manifests: all 13 non-target legacy memory files and the current `workspaces/kit/` memory store are byte-for-byte unchanged.
- `ki repo audit --skill ki-housekeeping-claude --repo .` — PASS.
- `ki repo audit --skill ki-work-roadmap --repo .` — PASS before review publication.
- `git diff --check` — PASS.

### Outstanding concerns

None within this bounded repair. The broader checkout-path-dependent state split remains intentionally owned by `KI-HARNESS-RTP-003`.

### Post-change review

The result meets the goal: the retained runtime-strategy memory now points to the canonical decision and the two already-promoted guidance records no longer duplicate their durable owners. Hash comparison limits regression risk to the three approved targets and legacy index; the current memory store and unrelated legacy records were unchanged. The item is ready for acceptance review.

### Mini recap

Reconciled the known legacy memory-store defects and preserved the path-split evidence for the broader state-routing decision. No backend redesign, bulk migration, or additional cleanup was performed.

## Done

Accepted 2026-09-16 by Kris Brown on the review packet above.

## Discussion

### Return condition

The return condition was satisfied on 2026-09-16: both relevant directories are writable and the exact three targets remain observable. Any remaining backend concern must be supported by a reproducible inconsistency after this bounded repair.
