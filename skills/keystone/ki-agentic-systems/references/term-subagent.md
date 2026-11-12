---
id: subagent
title: Subagent
type: system-layer
territory: knowledge-islands
island: ki-agentic-harness
status: agreed
origin: Cairn summit change 22, CARD-SUBAGENT (Kris, 12 November 2026)
links:
  agent:
    predicate: ki:subordinateTo
  session:
    predicate: dcterms:isPartOf
---

# Subagent

A subagent is an [agent][agent] subordinate to another agent, started by it to do part of its work. It acts wholly within the controlling agent's boundaries and under its control, and returns its result to it. It does not interact with other agents: the controlling agent is the point of interaction. Each subagent works in a thread of its own within the [session][session], beside the controlling agent's primary thread.

Harnesses vary in how they implement subagents, such as whether a subagent may start subagents of its own, and that is not part of the definition.

## Examples by vendor

| | Anthropic | OpenAI | Google | Microsoft and GitHub |
| --- | --- | --- | --- | --- |
| **Current names** | Claude Code's subagents, such as Explore, Plan and general-purpose, run in the foreground or background, or as forks | Codex subagents, each in an agent thread, with the built-in agents `default`, `worker` and `explorer`; the `codex agents` command centre; Ultra mode uses them | Gemini CLI's subagents, such as codebase_investigator, cli_help, generalist and browser_agent; Antigravity's subagents, each in its own Git worktree | VS Code's subagents, started by `runSubagent` or by the Copilot harness's own tool, nesting up to five deep when enabled |
| **Their word** | Claude Code's "subagent": "A subagent stays inside the session that spawned it" and "returns a summary to the main conversation" | "subagent": "A delegated agent that Codex starts to handle a specific task" | "subagent": specialists with "their own isolated context loop", which cannot call other subagents | "subagent": "works in its own context and returns a focused result to the main agent" |
| **Sources** | [A3][a3], [A5][a5] | [O9][o9], [O11][o11] | [G2][g2], [G7][g7] | [M9][m9] |

All four vendors say subagent in this sense. They differ on nesting, which Google forbids and VS Code allows to depth five when enabled, and that difference is the harness's, not the term's. The sources and the dates they were checked are in [the skill's sources](sources.md).

## Where a name has more than one sense

- **Agent teams** in Claude Code are several full sessions under a team lead, each an agent in its own right that others interact with, so they are not subagents; Codex's **agent thread**, by contrast, is the thread a subagent works in, not a separate session.
- **Remote subagents** in Gemini CLI are remote agents reached over A2A, agents in their own right; despite the name, they are not subagents in this card's sense.
- **Task** names VS Code's Copilot-harness tool that starts a subagent; no card uses it as a term.

## Our conventions

The definitions in the KI harness's `subagents/` folder describe roles a subagent takes, such as a reviewer or an explorer; each is run as a subagent of the controlling agent. The `ki-subagents` skill and its bindings say how to run them in a given agent host.

## Next

The skill card, still to come.

[agent]: ./term-agent.md
[session]: ./term-session.md
[a3]: https://code.claude.com/docs/en/glossary.md
[a5]: https://code.claude.com/docs/en/sub-agents
[o9]: https://learn.chatgpt.com/docs/changelog
[o11]: https://learn.chatgpt.com/docs/agent-configuration/subagents
[g2]: https://antigravity.google/docs/overview
[g7]: https://geminicli.com/docs/core/subagents/
[m9]: https://code.visualstudio.com/docs/agents/subagents
