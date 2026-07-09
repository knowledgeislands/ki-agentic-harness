# ADR-KI-HARNESS-SKILLS-006: Six-cluster skill taxonomy and the implication graph

**Date:** 2026-07-09

## Context

The skill set grew to twenty without a stated organising model. The README described relationships in prose and ASCII art, and the only machine-readable substrate was `ki-repo`'s coverage array plus `ki-bootstrap`'s two-element baseline. Two things were missing: a named taxonomy that says what role each skill plays, and a single declared source for "linking skill X pulls in skill Y" that both the bootstrap chain and a user-facing dependency tree could derive from without drifting apart.

## Decision

The skills are organised into six clusters, and their relationships are declared in a machine-readable implication graph.

- **Clusters.** (1) **Keystone** — `ki-bootstrap`, `ki-repo`. (2) **Structure-independent governance**, always linked — `ki-authoring`, `ki-engineering`. (3) **Repo-structure**, mutually exclusive, exactly one per repo — `ki-harness`, `ki-kb`, `ki-website`, `ki-mcp`. (4) **General governance** — `ki-agents`, `ki-skills`, `ki-decision-records`, `ki-feature-definitions`, `ki-handoffs`, `ki-plans`. (5) **Implied families** — the KB family under `ki-kb`, the website family under `ki-website`. (6) **Environment**, governing the user's machine rather than a repo — `ki-binding`, `ki-housekeeping`, `ki-tokenomics`.
- **Implication graph.** Each SKILL.md declares an `implies:` frontmatter list — the single source from which `scripts/skill-graph.ts` generates both the bootstrap chain and the dependency tree (`ki:skills:graph`), validated in `ki:verify`.
- **Mutual exclusion.** A repo carries exactly one repo-structure skill; `ki-repo`'s coverage cascade enforces it mechanically.
- **Canonical names.** Each skill's directory name is its cluster name. `ki-housekeeping` broadens the former memory skill into machine-state hygiene generally, and `ki-feature-definitions` is the general-governance skill for feature specs.

## Consequences

- A new skill is placed by choosing its cluster; its edges are declared in one greppable place.
- The bootstrap chain and the user-guide tree cannot drift — both derive from `implies:`, and a broken edge fails CI.
- Cluster 6 gives the machine/environment skills a home the earlier repo-only taxonomy lacked.

## References

- [enforcement-framework.md](../../skills/ki-engineering/references/enforcement-framework.md) — the governance-skill shape each cluster follows.
- [ADR-KI-HARNESS-001](ADR-KI-HARNESS-001-composition-over-extension.md) — composition over extension, how skills relate within the graph.
- [docs/skills.md](../guides/user-guide/skills.md) — the catalogue the clusters organise.
