---
id: agent-harness
title: Agent harness
type: system-layer
territory: knowledge-islands
island: ki-agentic-harness
status: agreed
origin: Cairn summit change 22, CARDS-AGENT (Kris, 12 November 2026)
links:
  model:
    predicate: ki:runs
---

# Agent harness

An agent harness is the software that turns a [model][model] into an agent. It runs the loop: it gives the model its context, carries out the tool calls the model asks for, and feeds the results back until the work is done. It holds the tools, handles the context as it grows, and keeps each run it carries out. The model decides; the harness acts.

## Examples by vendor

| | Anthropic | OpenAI | Google | Microsoft and GitHub |
| --- | --- | --- | --- | --- |
| **Current harnesses** | Claude Code, the harness itself; the Claude Agent SDK, the same loop as a library; Managed Agents, "a hosted agent harness that runs the agent loop" | The Codex harness, served by the Codex App Server; the Codex SDK; the OpenAI Agents SDK, a run loop with handoffs | The Antigravity harness, shared by every Antigravity surface; the Antigravity SDK; the Agent Development Kit (ADK) | VS Code's agent harnesses, Copilot, Claude and Codex; the Copilot SDK, "the same engine behind Copilot CLI"; Microsoft Agent Framework's Harness Agent |
| **Their word** | "agentic harness": "Claude Code is the harness; Claude is the model inside it" | "Codex harness" in its engineering post of 4 February 2026; the docs say "the Codex agent" | "a shared, highly optimized agent harness co-trained with Gemini models" | "agent harness": "the software layer that runs an agent session" |
| **Sources** | [A2][a2], [A3][a3], [A4][a4] | [O3][o3], [O4][o4], [O5][o5] | [G2][g2], [G5][g5] | [M3][m3], [M4][m4], [M5][m5] |

Google and Microsoft say "agent harness", Anthropic "agentic harness" and OpenAI "harness"; all four mean the same layer. The sources and the dates they were checked are in [the skill's sources](sources.md).

## Where a name has more than one sense

- **Claude Code** and **Codex** each name both a harness and the [agent][agent] built on it, by context; on this card each means the harness.
- **Copilot** is a harness in VS Code and a family of agents on GitHub; on this card it means the harness.
- Vendor text often writes "harness" for the harness and the agent together, as Microsoft Agent Framework's Harness Agent does. Read it as covering both layers unless the text separates them.

## Our conventions

The Knowledge Islands harness, the `ki-agentic-harness` repository of skills, subagents, evals and hooks, is not an agent harness: it runs no loop and calls no model. Under INDUSTRY-FIRST it takes another name, settled after the industry's cards. Until then, write "the KI harness" or name the repository, and never a bare "harness" for it.

## Next

The [agent][next] is a model working through an agent harness.

[model]: ./term-model.md
[agent]: ./term-agent.md
[next]: ./term-agent.md
[a2]: https://code.claude.com/docs/en/overview
[a3]: https://code.claude.com/docs/en/glossary.md
[a4]: https://code.claude.com/docs/en/agent-sdk/overview
[o3]: https://openai.com/index/unlocking-the-codex-harness/
[o4]: https://learn.chatgpt.com/docs/app-server
[o5]: https://openai.github.io/openai-agents-python/sessions/
[g2]: https://antigravity.google/docs/overview
[g5]: https://adk.dev/sessions/
[m3]: https://code.visualstudio.com/docs/copilot/agents/overview
[m4]: https://code.visualstudio.com/docs/agents/concepts/agent-harnesses
[m5]: https://learn.microsoft.com/en-us/agent-framework/overview/
