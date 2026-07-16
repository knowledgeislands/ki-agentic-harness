---
id: '001'
title: Install durable Claude hook payloads safely
status: in-progress
roadmap: hooks/install-claude-code-hooks-from-github-safely
blocks: —
blocked-by: —
handoff: true
tier: opus
readiness: 2026-07-16
---

## Context

The zero-install repository bootstrap intentionally executes from a disposable GitHub tarball and installs skills only. The current hook linker creates symlinks back to its source, so it cannot be used from that transport without leaving broken global hooks. The three shipped hooks need a durable regular-file payload before a chezmoi-managed environment can safely register them in Claude settings.

## Current state

`link-hooks.ts` symlinks the three Claude Code hooks from a persistent harness checkout and merge-patches their registrations into `~/.claude/settings.json`. It has no durable remote-install mode, while the onboarding path documents only the per-repository bootstrap. The existing hook behaviour and registrations are already tested. This plan changes payload delivery only; `ki-dotfiles-chezmoi` will later own managed settings configuration and the skills that consume hooks will audit their required capability.

## Steps

1. Define an explicit GitHub-backed payload installer, its requested ref, and a content-addressed durable payload location under `~/.claude/hooks/knowledgeislands/ki-agentic-harness/`. Keep it independent from `bootstrap.sh` and fleet bootstrap instructions; its caller may be a later chezmoi-managed path, but bootstrap must never invoke it.
2. Publish the complete hook payload as executable regular files plus a manifest in that owned versioned directory. Treat an existing payload id as reusable only when its manifest, bytes, hashes, and modes match; otherwise refuse without clobbering it.
3. Leave `~/.claude/settings.json` untouched. A later `ki-dotfiles-chezmoi` path will inspect the installed manifest and own matching registrations; neither this installer nor repository bootstrap may mutate that settings file.
4. Retire the persistent-checkout hook symlink linker as an installer. Safely replace only recognised legacy hook symlinks with validated owned copies; do not alter user-owned files or links.
5. Add focused tests for a disposable source, idempotent reruns, upgrades, owned and unowned blockers, partial publication failure, source validation, and exact manifest validation.
6. Document the one-time installer alongside the repository bootstrap, format changed files, run focused tests, a dedicated adversarial review, `bun run test`, and `bun run ki:audit`.

## Files touched

The durable hook installer and tests, a POSIX remote entry point, package script and user-facing hook/onboarding documentation, and the generated roadmap projections.

## Verify

From a disposable GitHub-tarball-equivalent source, the installer leaves executable, manifest-verified regular hook files under the owned versioned `~/.claude/hooks/` namespace and does not create or modify `~/.claude/settings.json`. No hook is a symlink after a successful recognised migration. Reruns are byte-stable and unsafe destination blockers leave existing files unchanged. Focused tests, independent safety review, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

Independent of repository bootstrap and of Plan 002. It is intentionally a one-time user-level action, so parallel `mgit` bootstrap operations never mutate shared Claude settings.

## Decisions

**Locked:** Keep hook payload installation separate from per-repository bootstrap; bootstrap installs skills only. Use an owned durable regular-file payload, never a symlink, including from a persistent checkout; never write Claude settings from the payload installer or bootstrap; retain the existing hook behaviours; fail closed on unsafe payload destinations; and use the strongest review tier for the auto-executing installer. A future `ki-dotfiles-chezmoi` binding path owns settings registration and payload availability on managed machines; each hook-consuming skill audits its required hook capability.

**Escalate:** A need to install hooks for a non-Claude runtime, a requirement to silently replace user-owned global hook files, a new external runtime dependency, a direct settings write from the installer or bootstrap, or any claim of filesystem-wide atomicity across payload and settings.

## Readiness

- [x] Readiness test: a cold executor can distinguish the disposable repository bootstrap from the explicit durable global installer and can verify its ownership and rollback boundaries without redesigning the hooks (2026-07-16).
