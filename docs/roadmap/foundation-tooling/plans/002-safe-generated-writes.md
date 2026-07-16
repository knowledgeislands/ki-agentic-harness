---
id: '002'
title: Finish repository-local generated-write hardening
status: in-progress
roadmap: foundation-tooling/finish-repository-local-generated-write-hardening
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

Automatic writers must not follow repository-controlled symlinks or overwrite a path that changed after validation. The broad inventory is complete, and the highest-risk publication surfaces have landed; this plan now covers only the remaining writers on the normal per-repository bootstrap and CONFORM path.

## Current state

Bootstrap publication is hardened through private staging, quarantine, manifest-last publication, guarded rollback, and hostile-path tests. Plan Mode hooks, the stale Git-lock guard, project-roadmap publication, and hook-settings JSON are also hardened and tested.

The inventory uses six local mutation classes: generated replacement, authored mutation, exclusive create, deletion or pruning, metadata mutation, and rollback cleanup. Bootstrap and scaffold-only `.ki-config.toml` / `.gitignore` publication are complete. The remaining per-repository gap is the shared transaction for project skill and supported Claude agent links. Global user-home skill publication, remote hook delivery, generic contract promotion, report writers, direct conformers, and opaque subprocess writers are independent work recorded on the roadmap.

Node and Bun do not provide a portable descriptor-relative `openat`/`renameat` boundary. This baseline therefore trusts only invocation-created random entries inside an identity-validated mode-`0700` private transaction directory; every repository-controlled destination remains hostile. A native helper is the explicit off-ramp if that boundary becomes unacceptable.

## Steps

1. Finish safe combined publication for project skill and supported Claude agent links, including their shared `.gitignore` update.
2. Preserve standalone linker checks, blocker refusal, orphan handling, idempotence, selected-runtime behaviour, and explicit Codex-agent non-support.
3. Run a dedicated adversarial review covering root, config, parent, source, destination, prune replacement, guarded rollback, unexpected blockers, and partial failure.
4. Format changed code, re-bootstrap any coverage-scoped checker changes, run focused tests, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

Project skill and agent linkers, their focused tests, and coverage-scoped `.ki-meta` copies only if their checker sources change.

## Verify

Pass when bootstrap, scaffold, and project-link writers have bounded physical roots and hostile-path tests; the combined project linker fails closed or rolls back safely; a separate adversarial reviewer records GO; and focused tests, `bun run test`, then `bun run ki:audit` pass. This plan makes no safety claim for global user-home skill or hook installation.

## Dependencies / blocks

Independent. It no longer blocks the read-only MCP baseline or pilot selection; an unresolved writer blocks only the fleet operation that invokes it. Global skill publication and remote hook delivery have their own roadmap work; long-tail report writers and direct conformers remain a separate Future item.

## Decisions

**Locked:** Use Node and Bun builtins for this baseline; accept and document the residual concurrent parent-replacement race; trust unpredictable invocation-created transaction entries only inside an identity-validated mode-`0700` private directory; never treat repository-controlled destinations as trusted; preserve standalone project-linker operation; and scope this plan to per-repository writers. A native descriptor-relative helper is the off-ramp if the trust boundary changes. The plan remains `opus` because filesystem-boundary mistakes can cause destructive writes; bounded implementation may be delegated after the contract is fixed, while adversarial judgment stays at the strongest tier.

**Escalate:** A requirement for descriptor-relative guarantees, a new runtime dependency, a write outside an authorized root, a need to isolate and republish an opaque subprocess, or an existing writer whose fail-safe semantics cannot be preserved.

## Readiness

- [x] Readiness test: a cold executor can identify the remaining project-link transaction, its required safety posture, the private-namespace boundary, and the native-helper off-ramp without reconstructing completed bootstrap, scaffold, or global-install work (2026-07-16).
