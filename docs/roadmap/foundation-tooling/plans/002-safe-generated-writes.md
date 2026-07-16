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

The broad generated-write inventory is complete, and the highest-risk publication surfaces have landed. This plan covers the remaining repository-local project-link operation: a developer deliberately runs it while working on a local checkout to reconcile skill and agent symlinks.

This is not a user-environment installer or a fleet deployment surface. Its job is to make the selected local development links match the current harness; a developer who invokes it has chosen that reconciliation. It must still reject malformed roots, configuration, managed parents, sources, and real-file or directory blockers, and leave the repository coherent after ordinary failures.

## Current state

Bootstrap publication is hardened through private staging, quarantine, manifest-last publication, guarded rollback, and hostile-path tests. Plan Mode hooks, the stale Git-lock guard, project-roadmap publication, and hook-settings JSON are also hardened and tested.

The inventory uses six local mutation classes: generated replacement, authored mutation, exclusive create, deletion or pruning, metadata mutation, and rollback cleanup. Bootstrap and scaffold-only `.ki-config.toml` / `.gitignore` publication are complete. The remaining gap is the shared transaction for project skill and supported Claude agent links. Global user-home skill publication, remote hook delivery, generic contract promotion, report writers, direct conformers, and opaque subprocess writers are independent work recorded on the roadmap.

An independent review identified deployment-grade concurrency and symlink-provenance concerns. The owner confirmed on 2026-07-16 that those are outside this deliberate local-development operation; the plan's contract below records the resulting boundary rather than leaving the review's broader assumptions implicit.

Node and Bun do not provide a portable descriptor-relative `openat`/`renameat` boundary. The local-development operation therefore uses an identity-validated mode-`0700` private transaction directory and ordinary path checks. A native helper is the explicit off-ramp if a future deployment-grade writer needs descriptor-relative guarantees.

## Steps

1. [x] Finish combined local-development reconciliation for project skill and supported Claude agent links, including their shared `.gitignore` update.
2. [x] Preserve standalone linker checks, real-path blocker refusal, symlink reconciliation and orphan handling, idempotence, selected-runtime behaviour, and explicit Codex-agent non-support.
3. [x] Review the implementation for malformed root, config, parent, source, real blocker, rollback, and partial-failure handling within that local-development boundary.
4. [x] Format changed code, re-bootstrap any coverage-scoped checker changes, run focused tests, then run `bun run test` and `bun run ki:audit` sequentially.

## Files touched

Project skill and agent linkers, their focused tests, and coverage-scoped `.ki-meta` copies only if their checker sources change.

## Verify

Pass when bootstrap and scaffold writers retain their existing guarantees, and the combined project linker handles malformed local paths, refuses real blockers, reconciles project-link symlinks, and rolls back ordinary partial failure safely. Focused tests, `bun run test`, then `bun run ki:audit` must pass. This plan makes no deployment-grade concurrency or user-owned-symlink ownership claim, and makes no safety claim for global user-home skill or hook installation.

## Dependencies / blocks

Independent. It no longer blocks the read-only MCP baseline or pilot selection; an unresolved writer blocks only the fleet operation that invokes it. Global skill publication and remote hook delivery have their own roadmap work; long-tail report writers and direct conformers remain a separate Future item.

## Decisions

**Locked:** This is a repository-local development operation, not a durable installer: it may replace or prune existing symlinks in its generated project-link directories to reconcile the developer's chosen checkout, including dangling or wrong-target links. It continues to refuse files, directories, and malformed managed paths. Use Node and Bun builtins with an identity-validated mode-`0700` private transaction directory; accept the residual concurrent parent-replacement race and lack of provenance for existing symlinks. Preserve standalone project-linker operation and scope this plan to per-repository development links. A native descriptor-relative helper is the off-ramp if the trust boundary changes. The plan remains `opus` because filesystem-boundary mistakes can cause destructive writes; bounded implementation may be delegated after the contract is fixed, while adversarial judgment stays at the strongest tier.

**Escalate:** A request to use this mechanism for non-development deployment, descriptor-relative guarantees, a new runtime dependency, a write outside an authorized root, a need to isolate and republish an opaque subprocess, or an existing writer whose ordinary failure semantics cannot be preserved.

## Readiness

- [x] Readiness test: a cold executor can identify the remaining project-link transaction, its required safety posture, the private-namespace boundary, and the native-helper off-ramp without reconstructing completed bootstrap, scaffold, or global-install work (2026-07-16).
