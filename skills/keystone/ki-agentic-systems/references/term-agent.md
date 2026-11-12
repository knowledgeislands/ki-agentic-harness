---
id: agent
title: Agent
type: system-layer
territory: knowledge-islands
island: ki-agentic-harness
status: agreed
origin: Cairn summit change 22, CARDS-AGENT (Kris, 12 November 2026)
links:
  model:
    predicate: dcterms:hasPart
  harness:
    predicate: dcterms:hasPart
---

# Agent

An agent is a [model][model] working through an [agent harness][harness]: what you deal with when work gets done. The model decides each step and the harness carries it out, so the agent reads, acts and reports in the world where the model alone cannot. Vendors name an agent after its harness, so a product name can mean the agent or its harness, by context.

## Examples by vendor

| | Anthropic | OpenAI | Google | Microsoft and GitHub |
| --- | --- | --- | --- | --- |
| **Current agents** | Claude Code; "Claude Agent", the name Anthropic prefers for partners' agents built on the Claude Agent SDK; Managed Agents | Codex; ChatGPT Work, delegated work in ChatGPT; dots, "an always-on agent", one per user, living in the cloud | Antigravity, as an app, the `agy` CLI and IDE extensions; Gemini CLI, replaced by the Antigravity CLI for unpaid and Google One users on 18 June 2026; Jules, read-only after 11 November 2026 and closing on 31 December 2026 | GitHub Copilot in VS Code's agent mode, Copilot CLI, and Copilot in the cloud, so named from 28 October 2026 and formerly the Copilot coding agent |
| **Their word** | "agentic coding tool", while also calling Claude Code the harness | "agent": "the Codex agent", "Your dot is an always-on agent" | "agent", though Gemini CLI never calls itself one | GitHub says "agent"; VS Code calls Copilot, Claude and Codex harnesses |
| **Sources** | [A2][a2], [A3][a3], [A4][a4] | [O4][o4], [O6][o6], [O7][o7] | [G2][g2], [G3][g3], [G6][g6] | [M3][m3], [M6][m6], [M7][m7] |

Anthropic and OpenAI both call the product an agent and its loop a harness; VS Code alone calls the products harnesses. The sources and the dates they were checked are in [the skill's sources](sources.md).

## Where a name has more than one sense

- **Claude** names the model family, the Claude app and Claude Desktop, "Claude Agent" for partners' agents, a harness in VS Code, and in Slack a way to start work; **Codex** names the agent, its harness, part of model names such as GPT-5.3-Codex, several apps and tools, and historically a 2021 language model. On this card, Claude Code and Codex each mean the agent.
- **ChatGPT** names the chat product, the desktop app that now holds Codex, ChatGPT Work and @ChatGPT in Slack and Teams; on this card, ChatGPT Work is the agent.
- **Copilot** names GitHub's family of agents, a VS Code harness, the Copilot SDK, Copilot Studio and Microsoft's unrelated assistant products; on this card it means GitHub's agents.
- **Gemini** names the model family, the Gemini app and Gemini CLI; on this card, Gemini CLI is the agent.

## Our conventions

The definitions under the KI harness's `subagents/` folder describe roles an agent takes when it is run as a subagent, not agents of their own; the session's next card, the subagent, places them.

## Next

A [session][next] is one run of an agent.

[model]: ./term-model.md
[harness]: ./term-agent-harness.md
[next]: ./term-session.md
[a2]: https://code.claude.com/docs/en/overview
[a3]: https://code.claude.com/docs/en/glossary.md
[a4]: https://code.claude.com/docs/en/agent-sdk/overview
[o4]: https://learn.chatgpt.com/docs/app-server
[o6]: https://learn.chatgpt.com/docs/get-started-with-work.md
[o7]: https://learn.chatgpt.com/docs/dots.md
[g2]: https://antigravity.google/docs/overview
[g3]: https://geminicli.com/docs/
[g6]: https://jules.google/docs/changelog/
[m3]: https://code.visualstudio.com/docs/copilot/agents/overview
[m6]: https://github.blog/changelog/2025-10-28-work-with-copilot-coding-agent-in-slack/
[m7]: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
