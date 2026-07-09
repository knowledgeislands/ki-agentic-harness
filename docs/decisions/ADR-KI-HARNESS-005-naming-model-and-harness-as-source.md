# ADR-KI-HARNESS-005: The ki- naming model and harness-as-source vs plugin-as-projection

**Date:** 2026-07-07

## Context

Two structural facts about this harness need a stated home so that later decisions can reason against them rather than re-derive them.

The first is naming. The `knowledgeislands` GitHub organisation holds several repositories, and their names carry meaning: they signal what governs what. **Knowledge Islands** is the portable model — the framework: the organisation itself, the family of `ki-*` skills, and the `KI-` decision-record scope. **Arcadia** is the first and canonical Knowledge Island, the exemplar base that proves the model in practice. A repository name that does not align to this distinction leaves a reader guessing whether a repo is framework-level infrastructure or territory-scoped island content.

The second is packaging. This repository is an agentic harness: a dev-time source bundle that co-locates five parts — `skills/`, `agents/`, `mcp/`, `evals/`, `hooks/` (ADR-KI-HARNESS-002) — each installed by its own native mechanism. Separately, the Claude plugin/marketplace format (the Cowork packaging format) is a way to distribute skills, agents, and MCP servers to a host. These are two different things at two different points in the lifecycle, and conflating them — treating the plugin as something the harness "becomes", or as a competitor to it — misstates how the source reaches each surface.

## Decision

**Naming.** The `knowledgeislands` org's repositories use the `ki-` namespace, and repository names align to their governance scope:

- **`ki-arcadia-principal`** is the canonical Knowledge Island — the exemplar base, the source of the KI model. The `-principal` role marker is retained, as used archipelago-wide (kit-principal, hnr-principal, and so on).
- **`ki-agentic-harness`** is the framework's general tooling — the skills, agents, MCP wrappers, evals, and hooks any island adopts. It is framework-level (scope `KI-HARNESS`), not Arcadia-territory-scoped.
- **`ki-website`** is the framework's own public site (knowledgeislands.info). It too is framework-level, not Arcadia-territory-scoped.

**Harness vs plugin.** An **agentic harness** is a dev-time source bundle co-locating the five parts, each installed by its own native mechanism (skills via `ki-bootstrap` symlinks, agents as files, and so on). A Claude **plugin/marketplace** — a GitHub repo carrying `.claude-plugin/marketplace.json`, per-plugin `.claude-plugin/plugin.json`, `.mcp.json`, and bundled `skills/`/`agents/` — is a **distributable, lossy, per-surface projection** of that source: skills and agents port into it as files; host-local MCP servers do not, because Cowork's gVisor sandbox cannot reach them. The `ki-binding` skill is the **actor** that projects the single source onto each surface — symlinks for Claude Code, chezmoi-rendered config for Claude Desktop, an `enabledPlugins` toggle plus a plugin for Claude Cowork. The harness is the source; the plugin is one surface's packaging.

## Consequences

- Repository names are self-describing: a `ki-` repo is framework-level unless its name marks a territory (`ki-arcadia-principal`), and the framework/base split is legible from the org listing alone.
- The five-part bundle stays the single source of truth. Distribution to any surface is a projection performed by `ki-binding`, not a fork or a rewrite; nothing "becomes" a plugin.
- The projection is understood to be lossy per surface: skills and agents travel as files; host-local MCP servers need separate sandbox-portability work before they reach Cowork. A surface receiving fewer parts is expected, not a defect.
- Decisions about a given surface's enablement have one reasoning home — `ki-binding` and the cross-surface design record — rather than being scattered across per-surface scripts.

## References

- The `ki-mcp` cross-surface-enablement design record — the design record for the single-source-to-many-surfaces fan-out that `ki-binding` realises.
- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-purpose-and-scope.md) — the bundle layout that is the source this decision projects.
- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-purpose-and-scope.md) — the purpose and scope of this repository as the harness.
- The `ki-bootstrap` skill — the keystone that links project-local skills, the Claude Code arm of the projection.
