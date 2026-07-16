---
id: '002'
title: Harden generated-file writes
status: open
roadmap: foundation-tooling/harden-generated-file-writes-against-symlinks-and-read-check-write-races
blocks: foundation-tooling/004
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

Bootstrap, INIT, CONFORM, hooks, and linkers write into repositories that may contain hostile symlinks or change between validation and publication. Fleet rollout multiplies this exposure, so automatic writers need one explicit safety posture before they are applied broadly.

## Current state

The cold inventory found six local mutation classes: generated replacement, authored mutation, exclusive create, deletion/pruning, metadata mutation, and rollback cleanup; remote/external mutation is a seventh class outside the local publication contract. The strongest current examples are project-roadmap publication, plan hooks, and hook-settings writes. Bootstrap/vendor publication, config scaffolding, `.gitignore`, linkers, many conformers, report writers, and `chmod` paths still use ordinary path-based sequences. Node/Bun expose strong leaf controls but no portable descriptor-relative `openat`/`renameat` boundary, so a native-helper guarantee would be a separate architecture decision. This plan changes filesystem safety only, not config correctness or schema.

## Steps

1. Bank the cold inventory in the enforcement-framework safety contract, with every writer assigned one mutation class, one authorized physical root, one logical transaction unit, and one publication rule. Include conditional audit-report writers and fleet-reachable conformers; classify remote GitHub mutation separately.
2. Define the builtins-only baseline: physically resolve and bound every existing parent; refuse symlink/dangling leaves; use same-directory exclusive temporary files; snapshot authored bytes; revalidate immediately before publication; use exclusive create or atomic rename as the class requires; guard rollback and cleanup against third-party changes. Document that repeated path revalidation mitigates but cannot eliminate a concurrent parent replacement without descriptor-relative OS primitives.
3. Add class-specific rules. Deletion/pruning must re-lstat and remove only an expected owned entry; metadata changes must reject symlinks and revalidate the regular file; generated multi-file operations publish one coherent generation; authored mutations compare snapshots; exclusive creates never overwrite; remote mutations retain their owning access gates and are not claimed by the local file contract.
4. Define authorized roots per surface: physical git root for repository output, canonical git directory for locks, physical Claude plans jail, physical repository-memory directory, explicitly selected runtime home/target for global linking and hooks, and caller-authorized report directory. A positional repository argument never implicitly authorizes writes to another surface.
5. Implement bounded batch A using the locked bootstrap protocol below, then harden scaffold-only `ki-repo` INIT, `.gitignore`, and project skill/agent linkers against the batch-A fixture matrix. This is the release-blocking batch.
6. Implement bounded batch B: harden global skill/hook linkers, plan hooks, and Git-lock deletion under their distinct roots, preserving shell independence and hook fail-safe behaviour.
7. Implement bounded batch C: finish reference generated writers and report generators, then migrate direct conformers by mutation class. Keep deployed checker units builtins-only and standalone; duplicate a small local primitive where necessary rather than adding a cross-skill runtime import.
8. Classify opaque subprocess writers explicitly. Run them only inside their validated target and do not claim the strict publication guarantee for their internal writes; isolation-and-republication or removal from automatic CONFORM requires a separate approved design.
9. Run a dedicated adversarial review covering leaf and parent swaps, same-byte inode replacement, partial publication, guarded rollback, prune/chmod races, and unexpected non-zero hooks; repair confirmed violations of the locked baseline.
10. Format changed code, re-bootstrap coverage-scoped vendors, and verify source/vendor parity after every batch.

## Files touched

The enforcement framework and its inventory; automatic writer implementations and focused tests across bootstrap, linkers/hooks, report generators, and affected skills; coverage-scoped `.ki-meta` copies and manifest.

## Verify

Pass when every inventoried writer has a documented class/root/transaction/rule; batches A–C have focused hostile-path coverage; opaque and remote writers have honest exclusions; all focused tests and `bun run test` pass; `bun run ki:audit` has no FAIL/WARN; and a separate adversarial reviewer records GO.

## Dependencies / blocks

Independent first-round work. It blocks fleet rollout because re-bootstrap and conform are the rollout mechanism. It does not include `.ki-config.toml` schema, per-repo overrides, or comment-style work.

## Batch A bootstrap protocol

1. Establish `.ki-meta` without recursive creation. If absent, call one exclusive `mkdir` on that direct child of the revalidated physical repository root, record its device/inode as invocation-created, and immediately verify it is the same real directory with the expected physical parent. If present, require an existing real directory with that parent. On failure, prune an invocation-created `.ki-meta` only when its device/inode still matches and it is empty; otherwise preserve it and report the conflict.
2. Acquire an exclusive regular `.ki-meta/.bootstrap.lock` with `wx` semantics inside that validated directory. Refuse an existing file, directory, symlink, or dangling symlink; record device/inode and remove only the exact lock created by this invocation. Two bootstrap runs never overlap.
3. Snapshot the exact bytes/types of every owned destination plus the owned vendor/bin entry sets. Treat `.ki-meta/audits/` and every unowned entry as preserved state outside the generation.
4. Build the complete candidate generation beneath an exclusive `.ki-meta/.bootstrap-staging-<random>/` directory: `skills/`, `bin/`, and `manifest.json`. Validate the staged tree and source/vendor hashes before publication. The staging directory is never a runtime target.
5. Revalidate the physical `.ki-meta` parent, lock ownership, destination snapshots, and absence of unexpected owned-entry changes immediately before publication. Stop before changing destinations on any mismatch.
6. Publish owned skill and bin files from staging through same-filesystem atomic renames in deterministic order, tracking exact published bytes. Remove obsolete owned files only after all replacements succeed and only when their snapshots still match. Publish `manifest.json` last as the generation-complete marker.
7. If any Nth publication fails, restore replaced files from their snapshots and remove transaction-created files only while current bytes/types still match what this invocation published. Restore obsolete files with exclusive create. If a third party changed a published destination, stop and report the exact rollback conflict rather than clobbering it.
8. On success or complete rollback, remove transaction-owned staging and lock entries after proving identity. Preserve `.ki-meta/audits/` byte-for-byte. This baseline guarantees coherent final success/rollback states, not zero-downtime reads during publication; callers must not run audits concurrently with bootstrap.

Batch A passes only with fixtures for: absent greenfield `.ki-meta` success plus raced creation/cleanup; symlink and dangling leaves at `.ki-meta`, `skills`, `bin`, manifest, config, `.gitignore`, and linker targets; symlinked intermediate parents; regular `.ki-config.toml` and `.gitignore` content changes plus same-byte/new-inode replacement between snapshot and publication; pre-existing lock/staging collisions; Nth-file publication failure with exact rollback; third-party change during rollback producing a conflict without clobber; obsolete-file prune races; real-file linker blockers; preserved `.ki-meta/audits`; manifest-last publication; and no transaction artifacts after success or complete rollback.

## Decisions

**Locked:** Use Node/Bun builtins only for this baseline; accept and document the residual concurrent parent-replacement race rather than adding a native helper; never follow symlink leaves; preserve standalone-skill operation; apply the six local mutation classes and per-surface roots above; transaction scope is one logical operation, not merely one file; use the batch-A staged-generation/manifest-last protocol and accept no concurrent-reader guarantee; opaque subprocess and remote mutations are explicitly outside the strict local publication guarantee; require dedicated adversarial review. The plan-level tier is `opus` because a mistaken filesystem boundary can cause destructive writes. Batch inventory/application after the policy is locked may use `sonnet`; adversarial judgment remains `opus`.

**Escalate:** A requirement for descriptor-relative parent-swap guarantees, a new runtime dependency, a write outside the authorized roots, isolation-and-republication of opaque subprocesses, or an existing writer whose transactional/fail-safe semantics cannot be preserved.

## Readiness

- [x] Readiness test: a cold executor reproduced the six-class inventory and confirmed batch A can proceed without inferring the threat model, trusted roots, transaction boundary, or residual-race posture (2026-07-16).
