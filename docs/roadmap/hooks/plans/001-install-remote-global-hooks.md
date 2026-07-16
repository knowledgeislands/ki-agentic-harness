---
id: '001'
title: Install remote global Claude hooks safely
status: in-progress
roadmap: hooks/install-claude-code-hooks-from-github-safely
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

The zero-install repository bootstrap intentionally executes from a disposable GitHub tarball. The current hook linker creates symlinks back to its source, so it cannot be used from that transport without leaving broken global hooks. A separate, explicit global installation action is needed before fleet rollout; it must never be invoked by a per-repository bootstrap.

## Current state

`link-hooks.ts` can link the three Claude Code hooks from a persistent harness checkout and merge their registrations into `~/.claude/settings.json`. It has no durable remote-install mode, while the onboarding path documents only the per-repository bootstrap. The existing hook behaviour and registrations are already tested; this plan changes delivery only.

## Steps

1. Define an explicit GitHub-backed installer entry point, its requested ref, and a content-addressed durable payload location under `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`. Keep it independent from `bootstrap.sh` and fleet bootstrap instructions.
2. Publish the complete hook payload as executable regular files plus a manifest in that owned versioned directory. Treat an existing payload id as reusable only when its manifest, bytes, hashes, and modes match; otherwise refuse without clobbering it.
3. Merge only the three owned settings registrations, including legacy unversioned KI commands and exact old-version commands. Preserve unrelated settings, matchers, handlers, and legacy hook files. Write settings only after a valid payload exists; an unreferenced payload after a settings failure is an accepted retry-safe residue.
4. Preserve the persistent-checkout symlink linker as a compatibility/developer path, but make the remote entry point select the durable-copy installer. Do not remove old top-level links automatically.
5. Add focused tests for a disposable source, idempotent reruns, upgrades, malformed/symlinked settings, owned and unowned blockers, partial publication failure, source validation, migration, and exact settings registration.
6. Document the one-time installer alongside the repository bootstrap, format changed files, run focused tests, a dedicated adversarial review, `bun run test`, and `bun run ki:audit`.

## Files touched

The durable hook installer and tests, a POSIX remote entry point, package script and user-facing hook/onboarding documentation, and the generated roadmap projections.

## Verify

From a disposable GitHub-tarball-equivalent source, the installer leaves executable, manifest-verified durable hook files under the owned versioned `~/.claude/hooks/` namespace. Settings reference that payload rather than the disposable source, unrelated settings remain unchanged, and reruns are byte-stable. Unsafe settings or destination blockers leave existing files and settings unchanged. Focused tests, independent safety review, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

Independent of repository bootstrap and of Plan 002. It is intentionally a one-time user-level action, so parallel `mgit` bootstrap operations never mutate shared Claude settings.

## Decisions

**Locked:** Keep hook installation separate from per-repository bootstrap; use a durable copy or versioned payload rather than a symlink into a fetched tarball; retain the existing three hook registrations and behaviours; preserve unrelated settings and fail closed on unsafe destination shapes; use the strongest review tier for the auto-executing installer.

**Escalate:** A need to install hooks for a non-Claude runtime, a requirement to silently replace user-owned global hook files, a new external runtime dependency, or any claim of filesystem-wide atomicity across payload and settings.

## Readiness

- [x] Readiness test: a cold executor can distinguish the disposable repository bootstrap from the explicit durable global installer and can verify its ownership and rollback boundaries without redesigning the hooks (2026-07-16).
