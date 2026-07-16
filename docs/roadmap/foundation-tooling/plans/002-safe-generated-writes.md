---
id: '002'
title: Finish rollout-critical generated-write hardening
status: in-progress
roadmap: foundation-tooling/finish-hardening-the-remaining-rollout-critical-generated-writes
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

Automatic writers must not follow repository-controlled symlinks or overwrite a path that changed after validation. The broad inventory is complete, and the highest-risk publication surfaces have landed; this plan now covers only the remaining writers needed for safe fleet rollout.

## Current state

Bootstrap publication is hardened through private staging, quarantine, manifest-last publication, guarded rollback, and hostile-path tests. Plan Mode hooks, the stale Git-lock guard, project-roadmap publication, and hook-settings JSON are also hardened and tested.

The inventory uses six local mutation classes: generated replacement, authored mutation, exclusive create, deletion or pruning, metadata mutation, and rollback cleanup. The rollout-critical gaps are scaffold-only `.ki-config.toml` publication, `.gitignore` publication, project skill and agent linkers, and global skill and hook symlink publication. Repository config, ignore, and project-link writes are bounded to the physical repository root; global links are bounded to the explicitly selected runtime target. Report writers, direct conformers, and opaque subprocess writers are non-blocking long-tail work recorded separately on the roadmap.

Node and Bun do not provide a portable descriptor-relative `openat`/`renameat` boundary. This baseline therefore trusts only invocation-created random entries inside an identity-validated mode-`0700` private transaction directory; every repository-controlled destination remains hostile. A native helper is the explicit off-ramp if that boundary becomes unacceptable.

## Steps

1. Promote the compact filesystem-safety contract into the enforcement framework: each writer has a mutation class, authorized physical root, logical transaction boundary, publication rule, and honest exclusion where strict guarantees do not apply.
2. Harden scaffold-only `.ki-config.toml` and `.gitignore` publication with snapshot and revalidation, no-follow leaf handling, and atomic replacement or exclusive creation as appropriate. Add symlink, parent-swap, content-change, and same-byte/new-inode fixtures.
3. Harden project skill and agent linkers plus global skill and hook symlink publication. Preserve blocker refusal, orphan handling, idempotence, standalone operation, and the selected runtime root; do not rework the already-hardened hook scripts or settings writer.
4. Run a dedicated adversarial review of only these remaining surfaces, covering leaf and parent swaps, concurrent replacement, guarded cleanup, unexpected blockers, and partial failure.
5. Format changed code, re-bootstrap any coverage-scoped checker changes, run focused tests, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

The enforcement framework; scaffold writers in `ki-repo` and `ki-bootstrap`; project skill and agent linkers; global skill and hook linkers; their focused tests; and coverage-scoped `.ki-meta` copies only if their checker sources change.

## Verify

Pass when the remaining writers have explicit class, root, transaction, and publication rules; hostile-path fixtures demonstrate refusal or safe publication without clobber; linker blocker, orphan, and idempotence behaviour is preserved; focused tests pass; a separate adversarial reviewer records GO; and `bun run test` followed by `bun run ki:audit` passes.

## Dependencies / blocks

Independent. It no longer blocks the read-only MCP baseline or pilot selection; an unresolved writer blocks only the fleet operation that invokes it. Long-tail report writers and direct conformers remain a separate Future item.

## Decisions

**Locked:** Use Node and Bun builtins for this baseline; accept and document the residual concurrent parent-replacement race; trust unpredictable invocation-created transaction entries only inside an identity-validated mode-`0700` private directory; never treat repository-controlled destinations as trusted; preserve standalone skill and shell-hook operation; and scope this plan to rollout-critical writers. A native descriptor-relative helper is the off-ramp if the trust boundary changes. The plan remains `opus` because filesystem-boundary mistakes can cause destructive writes; bounded implementation may be delegated after the contract is fixed, while adversarial judgment stays at the strongest tier.

**Escalate:** A requirement for descriptor-relative guarantees, a new runtime dependency, a write outside an authorized root, a need to isolate and republish an opaque subprocess, or an existing writer whose fail-safe semantics cannot be preserved.

## Readiness

- [x] Readiness test: a cold executor can identify the remaining rollout-critical writers, their required safety posture, the private-namespace boundary, and the native-helper off-ramp without reconstructing completed bootstrap or hook work (2026-07-16).
