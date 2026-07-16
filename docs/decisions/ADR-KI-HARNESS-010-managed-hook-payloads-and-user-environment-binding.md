# ADR-KI-HARNESS-010: Managed hook payloads and user-environment binding

**Date:** 2026-07-16

## Context

The harness ships three Claude Code hooks: the Plan Mode lifecycle pair and the stale Git-lock guard. They operate in a user's Claude Code environment, while the bootstrap chain exists to make an individual repository govern itself. The legacy hook linker combines these concerns: it symlinks hook scripts from a harness checkout into `~/.claude/hooks/` and directly patches `~/.claude/settings.json`.

A checkout is movable and a remote bootstrap source is disposable, so a hook symlink is not a durable user-environment installation. Direct writes to Claude settings from bootstrap or an installer also create competing owners for a user-level file that a dotfiles manager may already govern. Repositories and skills that rely on a hook still need a way to establish and verify their preconditions without taking ownership of the user's environment.

## Decision

The harness separates hook payload delivery, user-environment binding, and repository governance.

- A hook payload is an owned, versioned set of executable regular files with a verifiable manifest. Hooks are never symlinked, whether sourced from a persistent checkout or a disposable download.
- Bootstrap installs and vendors skills for a target repository only. It neither installs hook payloads nor writes Claude settings.
- A renderer-neutral hook-binding requirement defines the valid payload and its required Claude Code registrations. The current compliant local user-space settings manager is chezmoi: its hook binding establishes the payload before rendering the matching Claude settings entries, and it is the sole writer of those managed entries. It preserves unrelated settings according to the dotfiles-management policy.
- A future compliant user-environment manager may satisfy the same hook-binding requirement without adopting chezmoi. Hook-consuming skills remain independent of the chosen manager.
- Each skill that depends on a hook declares and audits the capability it needs. Its CONFORM path may repair only its repository-facing declaration or direct the user to the environment manager; it never writes global Claude settings or installs an unmanaged hook.

The existing symlink linker and direct settings writer are legacy migration surfaces. Their replacement and the safe migration of recognised existing links are tracked on the hooks roadmap. A separate `ki-claude-hooks` governance skill is deferred until real deployments show that the renderer-neutral requirement needs its own durable standard.

## Consequences

- Hook installation survives repository moves, worktrees, cleanup of downloaded sources, and updates because the configured command names an owned regular file rather than a checkout path.
- A chezmoi-managed machine has one settings writer. Other managers can implement the same binding contract, so the hook consumer contract does not become chezmoi-specific.
- The hook payload installer can be tested independently of Claude settings, while the settings binding can test its payload precondition and preservation of unrelated user configuration.
- The current `link-hooks.ts` interface, its tests, documentation, and feature definition require migration. Until that work lands, the legacy path remains an accurately documented implementation debt rather than the target architecture.
- The hook-specific binding contract and chezmoi composition path need scoped implementation plans before they change user settings or add checks to consuming skills.

## References

- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) — repository bootstrap and its self-sufficiency boundary.
- [ADR-KI-HARNESS-SKILLS-004](ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md) — renderer-specific composition over a renderer-neutral concern.
