---
id: '001'
title: Harden durable hook-installer publication
status: in-progress
roadmap: hooks/harden-durable-hook-installer-publication
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

The durable hook-payload installer copies the Plan Mode lifecycle and stale Git-lock hooks into user space without writing Claude Code settings. Adversarial review found gaps in legacy-link recognition and migration, verification across file-identity boundaries, and staged or publication failure coverage. These need to close before chezmoi, or another user-environment manager, treats the payload as a dependable binding precondition.

## Current state

The installer already uses a content-addressed payload directory, regular executable files, a manifest, an active pointer, private staging, and source-removal tests. It intentionally leaves unknown user-owned files and links alone, and it never writes `~/.claude/settings.json`.

The remaining work is confined to installer integrity: prove a legacy link belongs to a verified prior harness before touching it; fail closed if a payload, manifest, pointer, or parent changes identity during verification or publication; and demonstrate that injected failures leave no unsafe partial state.

## Steps

1. Retire automatic legacy-link mutation outside the private installer namespace; preserve all pre-existing user-space hook links for a user-environment manager or deliberate manual migration.
2. Bind payload validation and active-pointer publication to verified regular-file identities and owned directory permissions, failing closed on replacement or drift.
3. Add adversarial tests for legacy lookalikes, post-read replacement, permission drift, and staging or publication failure with rollback or retained-conflict evidence.
4. Run focused installer tests, the full self-test suite, and the aggregate audit; update the installer documentation only where its verified behaviour changes.

## Files touched

`skills/keystone/ki-bootstrap/scripts/install-hooks.ts`, its focused test suite, and any directly affected hook-installer documentation or vendored checker copies.

## Verify

Pass when the installer publishes only verified regular payload files, refuses replacement or permission drift without clobbering another process's state, leaves all pre-existing user-owned hook links untouched, and proves clean rollback or durable conflict evidence for injected failures. Focused tests, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

Blocks user-environment hook binding through chezmoi. Independent of repository bootstrap, project-local linker hardening, and a future `ki-claude-hooks` governance skill.

## Decisions

**Locked:** hook payloads are regular files, never symlinks; bootstrap does not install hooks or write Claude settings; the installer owns only its namespace, manifest, and active pointer; unknown user-owned paths are never overwritten; chezmoi remains the sole writer of its managed Claude settings entries.

**Escalate:** any need to modify Claude settings from the installer, identify an arbitrary user-owned link as legacy without cryptographic or structural proof, add a new runtime dependency, or weaken fail-closed behaviour to preserve convenience.

## Readiness

- [x] Readiness test: a cold security-focused executor can identify the installer boundary, migration constraints, integrity requirements, and acceptance tests without re-deriving user-environment ownership (2026-07-16).
