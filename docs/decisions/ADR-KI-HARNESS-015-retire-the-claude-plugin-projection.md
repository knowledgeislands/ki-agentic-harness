---
id: ADR-KI-HARNESS-015
title: 'Retire the Claude plugin projection'
date: 2026-10-05
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_depends_on: [ADR-KI-HARNESS-002, ADR-KI-HARNESS-006]
---

# ADR-KI-HARNESS-015: Retire the Claude plugin projection

## Context

[ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-the-ki-naming-model-and-harness-as-source-vs-plugin-as-projection.md) treats a Claude plugin marketplace as a lossy, per-surface projection of this harness. The Harness realised that model as `knowledgeislands/ki-plugins`: a generated marketplace built by `ki-binding-claude`'s `build-plugin.ts`, carrying the portable skills and five governance agents onto Claude Cowork, audited by `ki-repo-plugins`, and registered in Cowork settings through `ki-binding-claude`.

The projection had no drift check, so every skill change left it stale, and keeping it current meant a second generated repository, a generator, a shape skill, a Cowork enablement path, and an open question about how Cowork reaches host-local MCP servers. Meanwhile the `ki` CLI installs the harness for every supported runtime ([ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md)), and the general-purpose `skills` CLI can add individual harness skills to an agent without any Knowledge Islands setup. The owner judged the plugin route one more thing to think about for no current benefit.

## Decision

Knowledge Islands does not maintain a Claude plugin marketplace projection of this harness.

- **The `ki` CLI is the main installer.** It acquires, verifies, and activates the harness for the user's runtimes.
- **`npx skills add knowledgeislands/ki-agentic-harness -s <skill> -a <agent>` is the quick skills-only route** for people outside a Knowledge Islands setup. It installs skill copies only; repository governance still comes from the `ki` CLI.
- **`ki-plugins` is retired and archived read-only.** The harness carries no plugin generator, no `ki-repo-plugins` shape skill and no `ki-binding-claude` Cowork plugin registration or rebuild path.

The harness-as-source principle of ADR-KI-HARNESS-002 stands: any future surface packaging remains a projection of this source, never a fork. Reinstating a plugin projection is a new decision that must name its drift check and its consumers.

## Consequences

- Cowork has no supported Knowledge Islands packaging. `ki-binding-claude` governs Claude Code, Claude Desktop, and the claude.ai web convention only; generic Cowork state remains with `ki-housekeeping-claude`.
- Reaching KI MCP servers from Cowork has no delivery route.
- The five governance agents under `subagents/governance/` reached Claude only through the plugin. The `ki` CLI acquires the `subagents/` payload and its Claude Code descriptor names `.claude/agents`, but it does not yet project agents there, and `npx skills add` carries skills only. Until the CLI projects subagents, the agents are available to Claude only by explicit copy or link from a harness checkout.
- No repository declares the plugin-marketplace shape. `ki-repo` detection, the eval suite, and consumers of the skill catalogue drop `ki-repo-plugins`; repositories that validate shape names follow on their own schedule.
- No generated plugin copy exists, so harness-to-plugin drift cannot occur.

## References

- [ADR-KI-HARNESS-002](ADR-KI-HARNESS-002-the-ki-naming-model-and-harness-as-source-vs-plugin-as-projection.md) — harness as source and any surface packaging as a projection.
- [ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) — the `ki` CLI user installation and repository bootstrap that replace the plugin route.
