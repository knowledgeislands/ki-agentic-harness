# ADR-KI-HARNESS-010: Managed hook payloads and user-environment binding

**Date:** 2026-07-16

## Context

The harness ships three Claude Code hooks: the Plan Mode lifecycle pair and the stale Git-lock guard. They operate in a user's Claude Code environment, not inside any one repository.

The former standalone hook installer and legacy hook linker obscured that boundary: one created a separate onboarding action, while the other symlinked a checkout and patched Claude settings directly.

## Decision

Claude hook delivery is a component of the one-time harness user installation.

- `/harness/install` installs the durable hook payload whenever Claude Code is selected. The user installer calls an internal Claude hook-payload component; there is no separate public hook route or shell entry point.
- The payload is an owned, versioned set of executable regular files with a verifiable manifest and stable `current/<hook-name>` command copies. Hooks are never symlinked.
- Repository bootstrap neither installs hook payloads nor writes Claude settings.
- A compliant user-environment manager establishes the settings binding after it verifies the installed payload. Chezmoi is the current manager and the sole writer of its managed settings entries; another manager may implement the same requirement.
- A hook-consuming skill may audit its capability and repair only repository-facing declarations. It never installs a global hook or writes global settings.

## Consequences

- One user command supplies both global skills and the Claude hook payload, while hook activation remains separately and safely managed.
- The payload survives checkout moves, worktree cleanup, and disposable downloads because its configured command is an owned regular file.
- Re-running `/harness/install` is the hook-payload update and repair path. Existing unmanaged links are not adopted or overwritten.
- The payload installer and the user-environment binding can be tested independently.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — the user-install and repository-bootstrap boundary.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — renderer-specific composition over a renderer-neutral concern.
