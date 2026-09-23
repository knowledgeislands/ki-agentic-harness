---
id: ADR-KI-HARNESS-SKILLS-004
title: 'Skills must be valid standalone'
date: 2026-06-23
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-004: Skills must be valid standalone

## Context

Skills are installed as independent capability payloads and projected into runtime skill directories by the `ki` host. A skill that imports files from another skill, or that depends on another skill being present at a known relative path, breaks that boundary. No shared source parent directory is guaranteed, and no two skills can be assumed to be co-located.

## Decision

Every skill payload must be **independently self-contained**, while executable prerequisites remain explicit. Specifically:

- A skill's `scripts/` code imports no sibling source. A declared shared module is materialised as a regular local file under the consumer's own `scripts/shared/`.
- A skill's `SKILL.md` refers to sibling skills by their `name:` frontmatter value, never by a file path.
- Composition is declared in `ki-depends-on`; the host resolves and runs prerequisites before their dependent rather than one skill importing or launching another.
- A **backend-specific variant** of a concern (a rendering, storage, or dotfiles mechanism) is expressed as a **composition skill** that depends on the universal concern and backend mechanism and adds only the backend delta — never by forking the shared EDUCATE/AUDIT/CONFORM/REFRESH modes into a `<base>-*` skill, and never by baking the backend into the universal skill behind a config flag. The universal skill stays backend-neutral. First instance: the chezmoi render path is `ki-binding-chezmoi`, which depends on the renderer-neutral `ki-binding` and `ki-repo-dotfiles-chezmoi`.

## Consequences

- Any skill payload can be acquired without a checkout-relative source layout; selecting it for execution requires dependency resolution.
- Runtime projection works without cross-skill relative paths.
- Cross-skill references in prose are by name, so they survive path changes.
- The checker self-containment requirement is part of the mechanical-checker contract (ADR-KI-HARNESS-SKILLS-002).
- Backend-specific variants add no taxonomy cluster: they are the composition mechanism applied to the backend axis, so a universal skill can be selected without a backend and a backend is opt-in via its composition skill.
