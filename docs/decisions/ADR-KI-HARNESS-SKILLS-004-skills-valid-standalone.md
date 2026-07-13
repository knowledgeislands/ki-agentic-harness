# ADR-KI-HARNESS-SKILLS-004: Skills must be valid standalone

**Date:** 2026-06-23

## Context

Skills are symlinked individually into a user's `.claude/skills/` directory by the `ki-bootstrap` keystone. A skill that imports files from another skill, or that depends on another skill being present at a known relative path, will break when deployed this way. The symlink convention means no shared parent directory is guaranteed, and no two skills can be assumed to be co-located.

## Decision

Every skill must be **valid installed standalone**. Specifically:

- A skill's `scripts/` checker imports only Node/Bun builtins — no cross-skill imports.
- A skill's `SKILL.md` refers to sibling skills by their `name:` frontmatter value, never by a file path.
- Composition is achieved by being run in sequence (the caller runs sibling A then sibling B), never by a skill importing another's code.
- Checkers compose by being **run in sequence**, not by importing one another.
- A **backend-specific variant** of a concern (a rendering, storage, or dotfiles mechanism) is expressed as a **composition skill** that runs the universal concern-skill and the backend-mechanism skill in sequence and adds only the backend delta — never by forking the shared INIT/AUDIT/CONFORM/REFRESH modes into a `<base>-*` skill, and never by baking the backend into the universal skill behind a config flag (which would pollute it with mechanism knowledge). The universal skill stays backend-neutral. First instance: the chezmoi render path is `ki-binding-chezmoi`, which composes the renderer-neutral `ki-binding` with `ki-dotfiles-chezmoi`, rather than living inside `ki-binding`.

## Consequences

- Any skill is installable from a cloud catalogue or a subset install without dependency resolution.
- The symlink-based install mechanism works for any skill without modification.
- Cross-skill references in prose are by name, so they survive path changes.
- The checker self-containment requirement is part of the mechanical-checker contract (ADR-KI-HARNESS-SKILLS-002).
- Backend-specific variants add no taxonomy cluster (consistent with ADR-KI-HARNESS-SKILLS-006): they are the composition mechanism applied to the backend axis, so a universal skill installs with no backend and a backend is opt-in via its composition skill.
