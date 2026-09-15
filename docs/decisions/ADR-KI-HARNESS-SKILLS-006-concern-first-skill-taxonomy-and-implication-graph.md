---
id: ADR-KI-HARNESS-SKILLS-006
title: 'Concern-first skill taxonomy and implication graph'
date: 2026-07-09
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-006: Concern-first skill taxonomy and implication graph

## Context

The skill set needs a stable physical taxonomy for discovery and a separate, machine-readable classification for the contract each skill carries.

The previous decision made the directory name imply a skill's kind, especially through `skills/process/`.

That reversed the useful order: directory placement should say what a capability concerns, while metadata should say whether it governs a standard or executes a process.

The `ki-skills` checker also inferred process kind from an incidental description phrase, producing false governance-mode warnings for valid process skills.

## Decision

The skills use a concern-first physical taxonomy and declare their kind in frontmatter.

- **Explicit kind.** Every KI skill declares exactly one `ki-kind: governance` or `ki-kind: process` frontmatter field. A **governance skill** holds a house standard, ships the four universal acting modes (AUDIT/CONFORM/EDUCATE/REFRESH) plus the required non-acting HELP entry point, and carries a native rubric. A **process skill** drives an action or lifecycle and is exempt from that governance shape. The `ki-skills` rubric reads the field, validates its vocabulary, and routes kind-gated checks from it; neither a directory nor prose establishes kind. Kind is orthogonal to install scope: process skills may be global utilities, while a governance skill becomes repository-active only when the repository declares it.
- **Concerns.** Directories group a skill by what it concerns, not by kind. The current concern roots are `agentic-systems`, `change-management`, `environment`, `governance`, `keystone`, and `repo-structure`. `repo-structure` holds primary and specialised repository forms; `ki-repo` owns the generic working-area conventions applicable to both Project and KB repositories. `governance` holds durable authority standards, including checkpoints and cross-repository trade protocol; `change-management` holds the adapter selector, tracker adapters, lifecycle standards, and the short lifecycle processes. A concern may contain governance and process skills. Existing concern roots may be refined only when their own concern boundary becomes clearer; no directory encodes kind.
- **Delegation.** Runtime subagents provide the execution mechanism: an orchestrator decides whether bounded independent work merits delegation, then retains review and integration. `ki-delegation` is the optional governance standard for a durable delegation packet: sources, a quality bar, and native audit/conform over the packet shape. It augments an active process through `ki-optional-depends-on:` and does not grant execution authority. The retired `ki-delegate` process duplicated that execution guidance, so it is removed. This differs from the retired `ki-handoffs` capability, which had no concrete governed artifact and conflated execution delegation with cross-repository transfer.
- **Canonical names and implication graph.** Each skill's directory name remains its canonical name. Names in `.ki.toml`, `ki-depends-on:`, package scripts, and references are bare `ki-<name>`, never a source path. Each `SKILL.md` declares its necessary composition prerequisites in `ki-depends-on:`; a dependency is not coverage detection, an off-ramp, or shared-module packaging.
- **Dependency graph.** Each SKILL.md declares a `ki-depends-on:` frontmatter list. A dependency identifies a necessary governance prerequisite: selecting the dependent includes the prerequisite first, while independent skills receive a stable host-defined order. The list's textual order is never semantic; an additional edge expresses any further required partial order. A repo declaring a skill MUST explicitly declare each dependency in `.ki.toml`; activation and repository resolution reject a missing declaration before mutation or execution. `ki-optional-depends-on:` names an augmentation that is ordered and loaded only when independently active in the same scope; it never requires a declaration or installation. Separately coverage-detected governance adds no dependency edge.
- **Universal vs coverage-detected.** `ki-authoring` is a universal requirement of `ki-repo`, declared by its `ki-depends-on:` edge and explicitly present in each repo's configuration. `ki-engineering` governs the TS/Bun toolchain, which only exists where a `package.json` does — it remains **coverage-detected**: `ki-repo`'s coverage cascade expects `["knowledgeislands/ki-agentic-harness:ki-engineering"]` to be declared by any repo with a `package.json`, and only then does it get vendored/linked. A non-code repo (dotfiles, a KB, the homebrew tap) carries neither that table nor an inactive edge.
- **Mutual exclusion.** A repo carries exactly one primary structure: `ki-repo-project` or `ki-repo-kb`. Specialisations otherwise compose, with one explicit nested choice for websites: `ki-repo-website` is the neutral build/output seam and a website selects exactly one purpose-specific implementation, `ki-repo-website-content` or `ki-repo-website-app`. The former currently standardises Eleventy for Markdown/data page collections; the latter currently standardises React/Vite for one interactive application. Hosting adapters such as `ki-repo-website-cloudflare` are orthogonal and compose with either. `ki-repo` enforces both cardinalities mechanically.
- **Canonical names.** Each skill's directory name is its canonical name. A portable root keeps the unqualified concern name; a runtime-bound capability uses the runtime suffix and declares its supported runtimes in frontmatter. `ki-specs` is a governance skill for feature specs; `ki-guides` governs repository-local practical documentation.

## Consequences

- New skills are placed by concern and declare kind independently, so a path move never changes their contract.
- Kind-gated audit, conform, and documentation logic has one explicit metadata source and cannot accidentally reclassify a process skill from description wording.
- The delegation quality bar is reusable and auditable without making the operational delegation process a governance command or confusing it with cross-repository trades.
- The canonical bare-name resolver and dependency graph continue to isolate consumers from source paths.
- A repository can adopt Cloudflare Workers Static Assets while legitimately declining Eleventy; coverage overrides and hosting decisions no longer disable unrelated website checks.

## References

- [ADR-KI-HARNESS-004](ADR-KI-HARNESS-004-composition-over-extension.md) — composition over extension, how skills relate within the graph.
