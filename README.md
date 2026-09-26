# ki-agentic-harness

The **agentic harness** for Knowledge Islands work — the canonical home for what an agent is equipped with here, kept in one place so the whole set can be versioned, reviewed, and installed together rather than scattered across the bases and projects that use it.

## Place in the Knowledge Islands ecosystem

The harness is the canonical source for reusable Knowledge Islands agentic capabilities. It generalises patterns proven in [Arcadia Principal](https://github.com/knowledgeislands/ki-arcadia-principal) into compatible harnesses, skills, agents, evals, and hooks; it does not originate the Knowledge Islands philosophy or model, implement the public CLI, or contain MCP servers. [tools-ki](https://github.com/knowledgeislands/tools-ki) supplies the `ki` executable platform that installs and hosts those capabilities. MCP servers remain independently released `mcp-*` repositories coordinated through the `ki-mcps` Agora. Implementation evidence from these repositories may inform future [KI Specifications](https://github.com/knowledgeislands/ki-specifications) after the ecosystem reaches its v1 boundary.

[Techne Principal](https://github.com/knowledgeislands/ki-techne-principal) translates the Knowledge Islands philosophy into engineering practice and may inform the harness, without owning its capability semantics. The [KI Website](https://github.com/knowledgeislands/ki-website) may vendor source-labelled harness documentation for public publication, while this repository remains canonical for the capability artifacts it publishes. The mirrored [ecosystem decision](docs/decisions/GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md) defines the six authorities and publication flows.

A harness is **four parts** — the things an agent is given to work with:

- **Skills** ([`skills/`](skills)) — 62 reusable [Agent Skills](https://agentskills.io/specification): 52 governance skills that hold standards and 10 process skills that drive workflows. Use [choose a skill by outcome](https://knowledgeislands.info/guidance/skills/by-outcome/) to find the right capability or journey; the generated [capability catalogue](skills/README.md#generated-capability-catalogue) is the exact local inventory and publishes declared dependency facts.
- **Agents** ([`subagents/`](subagents)) — Knowledge Islands [Claude Code subagents](https://code.claude.com/docs/en/sub-agents), one per file. Governance agents live under `subagents/governance/`, governed by the `ki-subagents` skill. See [`subagents/README.md`](subagents/README.md).
- **Evals** ([`evals/`](evals)) — a behavioural test suite that checks a skill actually _changes what the model does_, not just that its `SKILL.md` is well-formed. A rough signal, not a gate. See [`evals/README.md`](evals/README.md).
- **Hooks** ([`hooks/`](hooks)) — durable global Claude Code hook payloads for Plan Mode lifecycle and stale Git-lock recovery; a user-environment manager binds them into settings separately. See [`hooks/README.md`](hooks/README.md).

All four parts are first-class; skills are simply the most built-out. A skill does not have to be wedded to Knowledge Islands — the repository layout and delivery conventions apply to every kind equally.

## Get started

```bash
brew install knowledgeislands/tap/ki
ki bootstrap
```

`ki bootstrap` configures detected agent runtimes, installs the verified canonical harness, and activates the core user skills. Repository governance remains explicit through `.ki.toml`, `ki repo skill`, and the native `ki repo` operations. [Install and get started](https://knowledgeislands.info/guidance/using-ki/getting-started/) covers the complete flow; [Use skills](https://knowledgeislands.info/guidance/using-ki/using-skills/) explains how to work with the resulting skills. Harness contributors should see [local harness development](docs/guides/developer/local-harness-development.md).

## Documentation

- [Overview](https://knowledgeislands.info/guidance/using-ki/) — a short account of what the harness is, what it does for its owner, and how the parts fit.
- [Install and get started](https://knowledgeislands.info/guidance/using-ki/getting-started/) — install `ki`, bootstrap the user environment, activate skills, and govern a repository.
- [Use skills](https://knowledgeislands.info/guidance/using-ki/using-skills/) — how a skill fires from a plain-language request or slash command.
- [Choose a skill by outcome](https://knowledgeislands.info/guidance/skills/by-outcome/) — route an intended result to the smallest useful skill or delivery journey.
- [Capability catalogue](skills/README.md#generated-capability-catalogue) — the generated complete inventory, argument hints, runtime bindings, and formal dependencies.
- [Onboarding reference](https://knowledgeislands.info/guidance/using-ki/onboarding/) — the detailed installed-harness, activation, and native-governance boundaries.
- [Command-line interface](https://knowledgeislands.info/guidance/using-ki/command-line-interface/) — the current end-user `ki` command surface and scope boundaries.
- [Optional tools](https://knowledgeislands.info/guidance/using-ki/recommended-tools/) — optional user and system tools: chezmoi, headroom-ai, Codex skill discovery, mcporter, and claude.ai connectors.
- [Local harness development](docs/guides/developer/local-harness-development.md) — use a local checkout as the active canonical harness.
- [Prompting guides](https://knowledgeislands.info/guidance/prompting/) — how to prompt the models we run, with one source-backed guide per model.

The public website guidance is self-contained. For how it relates to the decisions, specifications, roadmap items, and skill code underneath it — and to the Knowledge Islands concept — see [docs/docs.md](docs/docs.md).

## Roadmap

The forward view — what's next and why — lives in [ROADMAP.md](ROADMAP.md). The standards, the mechanical checkers, and the advisory eval harness are all in place, and keeping them applied is a continuous practice tied to the invariants the `ki-skills` rubric enforces, not roadmap work.
