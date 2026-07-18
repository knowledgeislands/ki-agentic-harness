# ki-agentic-harness

The **agentic harness** for Knowledge Islands work — the canonical home for what an agent is equipped with here, kept in one place so the whole set can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use it.

## Place in the Knowledge Islands ecosystem

The harness is the canonical source for reusable Knowledge Islands tooling. It generalises patterns proven in [Arcadia Principal](https://github.com/knowledgeislands/ki-arcadia-principal) into skills, agents, MCP wrappers, evals, and hooks; it does not originate the Knowledge Islands philosophy or model. Implementation evidence from the harness helps [KI Specifications](https://github.com/knowledgeislands/ki-specifications) formalise portable contracts, and applicable Active specifications constrain implementations that claim conformance.

The [KI Website](https://github.com/knowledgeislands/ki-website) may vendor source-labelled harness documentation for public publication, while this repository remains canonical for the tooling and its executable artifacts. The mirrored [ecosystem decision](docs/decisions/GDR-KI-ARCADIA-001-knowledge-islands-ecosystem-fundamentals.md) defines the four authorities and publication flows.

A harness is **five parts** — the things an agent is given to work with:

- **Skills** ([`skills/`](skills)) — reusable [Agent Skills](https://agentskills.io/specification): the most-built-out part of the harness today, all governance skills — including `ki-harness`, which governs this five-part container itself, and `ki-bootstrap`, the repository bootstrap keystone. What a skill is and the map of the set are in [Skills](docs/guides/user-guide/skills.md); the per-skill catalogue is in [Skill catalogue](docs/guides/user-guide/skill-catalogue.md).
- **Agents** ([`agents/`](agents)) — Knowledge Islands [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), one per file. Governance agents live under `agents/governance/`, governed by the `ki-agents` skill. See [`agents/README.md`](agents/README.md).
- **MCP servers** ([`mcp/`](mcp)) — where KI's MCP servers would consolidate as workspace packages. An empty **shelf** today; they currently live as separate `mcp-*` repos, governed by the `ki-mcp` skill. See [`mcp/README.md`](mcp/README.md).
- **Evals** ([`evals/`](evals)) — a behavioural test suite that checks a skill actually _changes what the model does_, not just that its `SKILL.md` is well-formed. A rough signal, not a gate. See [`evals/README.md`](evals/README.md).
- **Hooks** ([`hooks/`](hooks)) — durable global Claude Code hook payloads for Plan Mode lifecycle and stale Git-lock recovery; a user-environment manager binds them into settings separately. See [`hooks/README.md`](hooks/README.md).

All five parts are first-class; skills are simply the most built-out, with agents, the eval suite, and hooks now populated and `mcp/` still an empty shelf. A skill does not have to be wedded to Knowledge Islands — the repository layout and delivery conventions apply to every kind equally.

## Get started

```bash
cd /path/to/repository-you-want-to-govern
curl -fsSL https://knowledgeislands.info/harness/install | sh
```

This is repository bootstrap: it creates that repository's governance machinery and does not change the rest of your user environment. The stable Knowledge Islands URL redirects to this repository's canonical bootstrap script. [Install and get started](docs/guides/user-guide/getting-started.md) covers optional user-environment tooling and hook payloads; [Use skills](docs/guides/user-guide/using-skills.md) explains how to work with the resulting skills. Harness contributors should see [local skill linking](docs/guides/developer/linking-skills.md).

## Documentation

| Doc | What's in it |
| --- | --- |
| [Overview](docs/guides/user-guide/overview.md) | A short account: what the harness is, what it does for its owner, how the parts fit. |
| [Install and get started](docs/guides/user-guide/getting-started.md) | The practical starting point: optional tools, repository bootstrap, and user-environment hook payloads. |
| [Use skills](docs/guides/user-guide/using-skills.md) | How a skill fires from a plain-language request or slash command. |
| [Skills](docs/guides/user-guide/skills.md) | What a skill is, the map of the set (the six clusters and their interdependencies), and the shared governance-skill shape. |
| [Skill catalogue](docs/guides/user-guide/skill-catalogue.md) | Every skill, one by one, grouped by cluster — what each governs and when to reach for it. |
| [Bootstrap reference](docs/guides/user-guide/onboarding.md) | The detailed bootstrap model: remote transport, `.ki-meta/`, day-to-day bins, fleet use, and keeping current. |
| [Recommended tools](docs/guides/user-guide/recommended-tools.md) | System-level dependencies: chezmoi, headroom-ai, mcporter, claude.ai connectors. |
| [Developer linking](docs/guides/developer/linking-skills.md) | The current local live-link workflow for harness contributors. |
| [Prompting guides](docs/guides/prompting/README.md) | How to prompt the models we run — one guide per model (Fable 5, Opus 4.8, Sonnet 5), each with a Sources section for refresh. |

The user guide is self-contained. For how it relates to the decisions, feature definitions, plans, and skill code underneath it — and to the Knowledge Islands concept — see [docs/docs.md](docs/docs.md).

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). The standards, the mechanical checkers, and the advisory eval harness are all in place, and keeping them applied is a continuous practice tied to the invariants the `ki-skills` rubric enforces, not roadmap work.
