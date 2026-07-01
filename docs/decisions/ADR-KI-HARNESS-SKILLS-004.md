# ADR-KI-HARNESS-SKILLS-004: Skills must be valid standalone

**Status:** Accepted

**Date:** 2024-01-01

## Context

Skills are symlinked individually into a user's `.claude/skills/` directory by the `ki-bootstrap` keystone. A skill that imports files from another skill, or that depends on another skill being present at a known relative path, will break when deployed this way. The symlink convention means no shared parent directory is guaranteed, and no two skills can be assumed to be co-located.

## Decision

Every skill must be **valid installed standalone**. Specifically:

- A skill's `scripts/` checker imports only Node/Bun builtins — no cross-skill imports.
- A skill's `SKILL.md` refers to sibling skills by their `name:` frontmatter value, never by a file path.
- Composition is achieved by being run in sequence (the caller runs sibling A then sibling B), never by a skill importing another's code.
- Checkers compose by being **run in sequence**, not by importing one another.

## Consequences

- Any skill is installable from a cloud catalogue or a subset install without dependency resolution.
- The symlink-based install mechanism works for any skill without modification.
- Cross-skill references in prose are by name, so they survive path changes.
- The checker self-containment requirement is part of the mechanical-checker contract (ADR-KI-HARNESS-SKILLS-002).

## References

- [docs/design.md](../design.md) §Principles — "Composition only" and standalone validity.
- [skills/ki-engineering/references/enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) §2 — "depend on Node/Bun builtins only — no npm dependencies; be self-contained: no imports from another skill's files".
