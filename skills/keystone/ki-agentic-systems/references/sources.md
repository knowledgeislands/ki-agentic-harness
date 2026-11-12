---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-12T18:00:00Z
refresh: external-spec · monthly
---

# Sources — ki-agentic-systems

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
  - [2.1 Authoritative](#21-authoritative)
  - [2.2 Advisory](#22-advisory)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

The vendor sources and decisions behind the skill's rules in [SKILL.md](../SKILL.md#rules) and its knowledge graph, opened by [its root definition](_graph.md): the industry's cards, from [model](industry.model.md) to [skill](industry.skill.md), the specification cards, and the vendor subgraphs. Each vendor card cites the sources below by their links. Provenance only: the record of what changed lives in git, not a changelog here.

The vendors' naming keeps changing, so refreshing is a regular activity (TERMS-REFRESH), run monthly and whenever a vendor renames a product or a layer. Each refresh:

1. **Re-checks every source below,** and each source a card cites, for the names, the vendor's own word and the dates on each card, and records unverified or secondary facts as such.
2. **Watches how the industry's terms move:** a new word for a layer, a word that changes sense, a product renamed, merged, replaced or closed, and a vendor that starts or stops using a term.
3. **Keeps each vendor card current,** Anthropic and OpenAI first, then Google and Microsoft, under INDUSTRY-FIRST and LEADERS: its examples, its sense and its link to the industry's term, with a new vendor card for a new word and the card retired when a vendor drops one. A change to an industry card's definition is a change of substance and goes to the change that governs the skill, not into a refresh.
4. **Updates this file:** the last-reviewed dates, any source added or retired, and the Last review.

[Back to contents](#contents)

## 2. Outside sources

The vendors' own documentation and the specifications the cards follow, checked on 12 November 2026. The identifiers match the link labels on each card.

### 2.1 Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| **[A1]** [Anthropic, Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) | Model: current Claude models and ids | 2026-11-12 |
| **[A2]** [Anthropic, Claude Code overview](https://code.claude.com/docs/en/overview) | Agent harness and agent: Claude Code as harness and product | 2026-11-12 |
| **[A3]** [Anthropic, Claude Code glossary](https://code.claude.com/docs/en/glossary.md) | Agent harness, agent and session: "agentic harness", "Claude is the model inside it"; session, turn and transcript; subagents and agent teams | 2026-11-12 |
| **[A4]** [Anthropic, Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) | Agent harness and agent: the Agent SDK, Managed Agents, "Claude Agent" branding | 2026-11-12 |
| **[A5]** [Anthropic, Subagents](https://code.claude.com/docs/en/sub-agents) | Subagent: Claude Code's subagents | 2026-11-12 |
| **[A6]** [Anthropic, Extend Claude with skills](https://code.claude.com/docs/en/skills) | Skill: Claude Code's skills on the Agent Skills open standard; descriptions in context, bodies on use; custom commands merged into skills | 2026-11-12 |
| **[A7]** [Anthropic, Claude Code channels](https://code.claude.com/docs/en/channels) | Channel card (proposal): "an MCP server that pushes events into your running Claude Code session"; integrations start a new session; research preview | 2026-11-12 |
| **[A8]** [Anthropic, Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging) | Channel and peer agent cards (proposals): one session messaging another; "Peer address" | 2026-11-12 |
| **[A9]** [Anthropic, Agent teams](https://code.claude.com/docs/en/agent-teams) | Peer agent card (proposal): teammates, each "a full, independent Claude Code session", messaging each other; experimental | 2026-11-12 |
| **[O1]** [OpenAI, Models](https://learn.chatgpt.com/docs/models.md) | Model: current GPT models | 2026-11-12 |
| **[O2]** [OpenAI, Workspace model availability](https://learn.chatgpt.com/docs/enterprise/workspace-model-availability.md) | Model: models still listed | 2026-11-12 |
| **[O3]** [OpenAI, Unlocking the Codex harness](https://openai.com/index/unlocking-the-codex-harness/) | Agent harness: "Codex harness", 4 February 2026; refused the fetcher, title and date from search results | 2026-11-12 |
| **[O4]** [OpenAI, App Server](https://learn.chatgpt.com/docs/app-server) | Agent harness, agent and session: the Codex App Server, "the Codex agent"; thread, turn and item | 2026-11-12 |
| **[O5]** [OpenAI Agents SDK, sessions](https://openai.github.io/openai-agents-python/sessions/) and [running agents](https://openai.github.io/openai-agents-js/guides/running-agents/) | Agent harness: the run loop with handoffs | 2026-11-12 |
| **[O6]** [OpenAI, Get started with ChatGPT Work](https://learn.chatgpt.com/docs/get-started-with-work.md) | Agent: ChatGPT Work | 2026-11-12 |
| **[O7]** [OpenAI, Meet dots](https://learn.chatgpt.com/docs/dots.md) | Agent: dots, "an always-on agent" | 2026-11-12 |
| **[O8]** [OpenAI, Codex on mobile](https://learn.chatgpt.com/docs/mobile.md) | Session: task on mobile | 2026-11-12 |
| **[O9]** [OpenAI, ChatGPT and Codex changelog](https://learn.chatgpt.com/docs/changelog) | Session and subagent: task in Codex Cloud and the iOS app; Ultra mode's subagents | 2026-11-12 |
| **[O10]** [OpenAI, Remote connections](https://learn.chatgpt.com/docs/remote-connections.md) | Session: chat, and the heading renamed from thread to task to chat | 2026-11-12 |
| **[O11]** [OpenAI, Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | Session and subagent: Codex subagents and their agent threads | 2026-11-12 |
| **[O12]** [OpenAI, Build skills](https://learn.chatgpt.com/docs/build-skills.md) | Skill: a directory with a SKILL.md on the open standard; the 2% cap on the initial skill list; plugins as distribution | 2026-11-12 |
| **[O13]** [OpenAI, Skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins.md) | Skill: a skill and a plugin, "an installable bundle that can include skills and Model Context Protocol (MCP) servers" | 2026-11-12 |
| **[G1]** [Google, Gemini models](https://aistudio.google.com/docs/models) | Model: current Gemini models | 2026-11-12 |
| **[G2]** [Google, Antigravity overview](https://antigravity.google/docs/overview) | Agent harness, agent, session and subagent: the Antigravity harness and its surfaces; conversation; subagents in their own worktrees | 2026-11-12 |
| **[G3]** [Google, Gemini CLI docs](https://geminicli.com/docs/) | Agent: Gemini CLI and its replacement | 2026-11-12 |
| **[G4]** [Google, Antigravity CLI conversations](https://antigravity.google/docs/cli/conversations/) | Session: session ids in the CLI | 2026-11-12 |
| **[G5]** [Google, ADK sessions](https://adk.dev/sessions/) | Agent harness and session: the Agent Development Kit and its Session | 2026-11-12 |
| **[G6]** [Google, Jules changelog](https://jules.google/docs/changelog/) | Agent and session: Jules wind-down notice of 29 October 2026; task and Session | 2026-11-12 |
| **[G7]** [Google, Gemini CLI subagents](https://geminicli.com/docs/core/subagents/) | Subagent: Gemini CLI's subagents, which cannot call other subagents, and its remote subagents over A2A | 2026-11-12 |
| **[G8]** [Google, Agent Skills in Gemini CLI](https://geminicli.com/docs/cli/skills/) | Skill: Gemini CLI's Agent Skills, activated by `activate_skill`, against GEMINI.md | 2026-11-12 |
| **[G9]** [Google, ADK collaborative workflows](https://adk.dev/workflows/collaboration/) | Peer agent card (proposal): "peer agents" in a parallel workflow, used descriptively | 2026-11-12 |
| **[M1]** [Microsoft, MAI models](https://microsoft.ai/models/) | Model: Microsoft's own models | 2026-11-12 |
| **[M2]** [GitHub, Copilot supported models](https://docs.github.com/en/copilot/reference/ai-models/supported-models) | Model: the models Copilot serves | 2026-11-12 |
| **[M3]** [VS Code, Build with agents](https://code.visualstudio.com/docs/copilot/agents/overview) | Agent harness, agent and session: VS Code's harnesses, agent mode and agent session | 2026-11-12 |
| **[M4]** [VS Code, Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses) | Agent harness: "the software layer that runs an agent session" | 2026-11-12 |
| **[M5]** [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/) and [Copilot SDK](https://github.com/github/copilot-sdk) | Agent harness and session: the Harness Agent, the Copilot SDK and the agent session; page dated 23 October 2026 | 2026-11-12 |
| **[M6]** [GitHub, Copilot coding agent in Slack](https://github.blog/changelog/2025-10-28-work-with-copilot-coding-agent-in-slack/) | Agent: the former name, Copilot coding agent | 2026-11-12 |
| **[M7]** [GitHub, About Copilot in the cloud](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Agent and session: Copilot in the cloud; session and agent task | 2026-11-12 |
| **[M8]** [Agent Host Protocol, What is AHP](https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html) | Session: sessions and the chats inside them | 2026-11-12 |
| **[M9]** [VS Code, Subagents](https://code.visualstudio.com/docs/agents/subagents) | Subagent: VS Code's subagents and their nesting | 2026-11-12 |
| **[M10]** [VS Code, Use Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills) | Skill: Agent Skills across Copilot and Codex, their three levels, against custom instructions | 2026-11-12 |
| **[S1]** [Agent Skills specification](https://agentskills.io/specification) | Skill and the specification cards: a skill's directory, front matter and optional folders; progressive disclosure in three levels; file references one level deep | 2026-11-12 |
| **[M11]** [Agent Host Protocol, specification overview](https://microsoft.github.io/agent-host-protocol/specification/overview.html) | Agent host: the process that runs harnesses and owns their sessions, independently of clients | 2026-11-12 |
| **[M12]** [Agent Host Protocol, implementations](https://microsoft.github.io/agent-host-protocol/guide/implementations.html) | Agent host: VS Code's Agent Host and the other implementations | 2026-11-12 |
| **[OR1]** Orca's own command line on terra, `orca serve`, `orca open`, `orca host list` and `orca-environments.json` | Orca runtime and app: the runtime inside the app, headless `orca serve`, machines paired as environments | 2026-11-12 |
| **[Z1]** [Agent Client Protocol, agents](https://agentclientprotocol.com/get-started/agents) | Zed as an ACP client, and the agents it drives | 2026-11-12 |
| **[MCP1]** [Model Context Protocol, specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28) | MCP card (proposal): purpose, roles, extensions; revision 2026-07-28 | 2026-11-12 |
| **[MCP2]** [MCP, architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture) | MCP host, client and server cards (proposals): one client for each server | 2026-11-12 |
| **[MCP3]** [MCP, tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) | MCP tools card (proposal) | 2026-11-12 |
| **[MCP4]** [MCP, transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) | MCP transports card (proposal) | 2026-11-12 |
| **[MCP5]** [MCP, stdio transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio) | MCP transports card (proposal): stdio | 2026-11-12 |
| **[MCP6]** [MCP, Streamable HTTP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) | MCP transports card (proposal): Streamable HTTP | 2026-11-12 |
| **[MCP7]** [MCP, versioning](https://modelcontextprotocol.io/specification/versioning) | MCP card (proposal): current revision | 2026-11-12 |
| **[MCP8]** [MCP, changelog 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) | MCP card (proposal): stateless protocol, protocol-level session removed | 2026-11-12 |
| **[MCP9]** [MCP, resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources) | MCP server card (proposal): resources | 2026-11-12 |
| **[MCP10]** [MCP, prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts) | MCP server card (proposal): prompts | 2026-11-12 |
| **[ACP1]** [Agent Client Protocol, introduction](https://agentclientprotocol.com/get-started/introduction) | ACP card (proposal): purpose | 2026-11-12 |
| **[ACP2]** [ACP, protocol v1 overview](https://agentclientprotocol.com/protocol/v1/overview) | ACP client and agent cards (proposals): roles and messages | 2026-11-12 |
| **[ACP3]** [ACP, session setup](https://agentclientprotocol.com/protocol/v1/session-setup) | ACP session card (proposal): "a conversation or thread" | 2026-11-12 |
| **[ACP4]** [ACP, transports](https://agentclientprotocol.com/protocol/v1/transports) | ACP card (proposal): transports | 2026-11-12 |
| **[ACP5]** [ACP, related protocols](https://agentclientprotocol.com/get-started/related-protocols) | ACP card (proposal): against MCP, and IBM's Agent Communication Protocol merged into A2A | 2026-11-12 |
| **[ACP6]** [ACP, governance](https://agentclientprotocol.com/community/governance) | ACP card (proposal): jointly governed by Zed Industries and JetBrains | 2026-11-12 |
| **[ACP7]** [ACP, v2 draft announcement](https://agentclientprotocol.com/announcements/acp-v2-draft) | ACP card (proposal): v2 draft, alpha.15 | 2026-11-12 |
| **[ACP8]** [ACP, releases](https://github.com/agentclientprotocol/agent-client-protocol/releases) | ACP card (proposal): schema v1.31.0 of 10 November 2026 | 2026-11-12 |
| **[ACP9]** [ACP, agents](https://agentclientprotocol.com/get-started/agents) | ACP agent card (proposal): the same page as [Z1] | 2026-11-12 |
| **[ACP10]** [ACP, architecture](https://agentclientprotocol.com/get-started/architecture) | ACP client and agent cards (proposals) | 2026-11-12 |
| **[ACP11]** [ACP, session list](https://agentclientprotocol.com/protocol/v1/session-list) | ACP session card (proposal): listing sessions | 2026-11-12 |
| **[ACP12]** [ACP, session delete](https://agentclientprotocol.com/protocol/v1/session-delete) | ACP session card (proposal): deleting sessions | 2026-11-12 |
| **[AHP1]** [Agent Host Protocol, AHP and ACP](https://microsoft.github.io/agent-host-protocol/guide/ahp-and-acp.html) | AHP and AHP agent host cards (proposals): coordination layer against communication layer | 2026-11-12 |
| **[AHP2]** [AHP, doctrine](https://microsoft.github.io/agent-host-protocol/guide/doctrine.html) | AHP agent host card (proposal) | 2026-11-12 |
| **[AHP3]** [AHP, subscriptions](https://microsoft.github.io/agent-host-protocol/specification/subscriptions.html) | AHP client and channels cards (proposals) | 2026-11-12 |
| **[AHP4]** [AHP, session channel](https://microsoft.github.io/agent-host-protocol/specification/session-channel.html) | AHP session and channels cards (proposals) | 2026-11-12 |
| **[AHP5]** [AHP, chat channel](https://microsoft.github.io/agent-host-protocol/specification/chat-channel.html) | AHP session card (proposal): its chat is our thread | 2026-11-12 |
| **[AHP6]** [AHP, transport](https://microsoft.github.io/agent-host-protocol/specification/transport.html) | AHP card (proposal): transport | 2026-11-12 |
| **[AHP7]** [AHP, specification 1.0.0 release](https://github.com/microsoft/agent-host-protocol/releases/tag/spec%2Fv1.0.0) | AHP card (proposal): spec 1.0.0 of 2 October 2026 | 2026-11-12 |
| **[AHP8]** [AHP, MCP servers](https://microsoft.github.io/agent-host-protocol/guide/mcp.html) | AHP agent host card (proposal): it wraps a harness | 2026-11-12 |
| **[AHP9]** [AHP, versioning](https://microsoft.github.io/agent-host-protocol/specification/versioning.html) | AHP card (proposal): versioning | 2026-11-12 |
| **[A2A1]** [Agent2Agent, specification](https://a2a-protocol.org/latest/specification/) | A2A cards (proposals): client, remote agent, Agent Card and task | 2026-11-12 |
| **[A2A2]** [A2A, key concepts](https://a2a-protocol.org/latest/topics/key-concepts/) | A2A remote agent and Agent Card cards (proposals): opaque agents | 2026-11-12 |
| **[A2A3]** [A2A, life of a task](https://a2a-protocol.org/latest/topics/life-of-a-task/) | A2A task card (proposal): task and contextId | 2026-11-12 |
| **[A2A4]** [A2A, release 1.0.1](https://github.com/a2aproject/A2A/releases/tag/v1.0.1) | A2A card (proposal): 1.0.0 of 12 March 2026, 1.0.1 of 28 May 2026 | 2026-11-12 |

[Back to contents](#contents)

### 2.2 Advisory

| Source | Informs | Last reviewed |
| --- | --- | --- |
| **[ST]** The earlier local terms study of 4 November 2026, in the Cairn store's legacy work | which words sessions already used loosely, such as launcher, harness and host | 2026-11-12 |
| **[RD]** The `ki-agentic-radar` skill's sources, for AHP adoption by agent host | the standards cards still to come | 2026-11-10 |

[Back to contents](#contents)

## 3. Decisions

| Id | Decision | Date | Backs | Status |
| --- | --- | --- | --- | --- |
| KNOWLEDGE-KIND | Kris's decision: a third kind of skill, the knowledge skill, only equips a session with a body of knowledge as Semantic Markdown cards; it audits and conforms nothing, its modes are `educate` and `refresh`, and other skills link to its cards rather than define its terms again. | 2026-11-10 | [SKILL.md](../SKILL.md#linking-to-a-card); defined in `ki-skills` on 12 November 2026 | In force |
| AGENTIC-SYSTEMS-SKILL | Kris's decision: `ki-agentic-systems` is the first knowledge skill, in the Keystone guild, and the one canonical source for agentic terms, with examples. | 2026-11-10 | [SKILL.md](../SKILL.md#the-cards) | In force |
| NAMING-RULE | Kris's decision: the system's own names are proper names chosen as metaphors from things in the landscape that outlast their makers; roles are plain words; analogies are written as analogies and are a card of their own. | 2026-11-11 | [SKILL.md](../SKILL.md#the-cards), the system's own terms still to come | In force |
| INDUSTRY-FIRST | Kris's decision: where an industry standard defines a term, its meaning stands and the system's conventions move to fit; each card says where a convention of ours maps onto it, and those that clash are renamed. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| LEADERS | Kris's decision: where vendors differ, Anthropic's and OpenAI's usage leads and the card notes where others differ. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| VENDORS | Kris's decision: each card gives the industry's name, its definition and examples from Anthropic, OpenAI, Google and Microsoft, and others where they matter, and says which sense it means where a vendor uses a name in more than one. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| CARD-ORDER | Kris's decision: the cards are ordered so each uses only words already defined, starting from the model. | 2026-11-12 | [SKILL.md](../SKILL.md#the-cards) | In force |
| CARDS-AGENT | Kris's decision, reworked the same day on the vendors' evidence: the first three cards are the model, the agent harness and the agent; vendors name an agent after its harness; the KI harness takes another name, settled after the industry's cards. | 2026-11-12 | [model](industry.model.md), [agent harness](industry.agent-harness.md), [agent](industry.agent.md) | In force |
| CARD-SESSION | Kris's decision: a session is one run of an agent, a conversation with its own context, its id and the folder it works in, made of turns; the harness runs it and keeps its transcript so it can be resumed; session is Anthropic's word and the majority's, OpenAI's task and chat, Google's conversation and Microsoft's agent session are synonyms, and "task" is kept off every card as a term. | 2026-11-12 | [session](industry.session.md) | In force |
| SESSION-THREADS | Kris's decision: a thread is not a synonym for a session but a part of one; a session is made of the agent's primary thread and a thread for each subagent, and OpenAI's top-level thread is the primary thread. | 2026-11-12 | [session](industry.session.md) | In force |
| CARD-SUBAGENT | Kris's decision: a subagent is an agent subordinate to another agent, started by it to do part of its work, acting wholly within its boundaries and under its control, and returning its result to it; it does not interact with other agents, the controlling agent being the point of interaction; each works in a thread of its own within the session; how a harness implements subagents, such as nesting, is not part of the definition; agent teams and A2A remote agents are agents in their own right, not subagents. | 2026-11-12 | [subagent](industry.subagent.md) | In force |
| HOST-SENSES | Kris's decision: never a bare "host"; agent host is the application or process that runs harnesses and owns their sessions, and machine is the computer, with a vendor's "host" for a computer noted on the machine card as a synonym. | 2026-11-12 | [SKILL.md](../SKILL.md#rules) | In force |
| TERMS-REFRESH | Kris's decision: refreshing is a regular activity that checks how the industry's terms move and keeps each card's examples current. | 2026-11-12 | [this file](#1-introduction), [SKILL.md](../SKILL.md#mode-refresh) | In force |
| SPEC-CARDS | Kris's decision: each specification a term rests on, such as the Agent Skills specification, MCP, ACP, AHP and A2A, is its own card, and a term card cites the specification and links to the part of that card it rests on rather than restating it. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), [session](industry.session.md), [Agent Skills](spec.agent-skills.md) | In force |
| AHEAD-OF-REVIEW | Kris's decision: the skill is built ahead of the Keystone review and declares the knowledge kind before `ki-skills` defines it, gaining each card as it is settled. | 2026-11-12 | [SKILL.md](../SKILL.md#knowledge-islands-agentic-systems) | In force |
| PURPOSE-FIRST | Kris's decision: a card says first what the thing achieves, then what it is and how it is built. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), [the root definition](_graph.md), every term and specification card | In force |
| CARD-SKILL | Kris's decision: a skill is a common way to extend any agent harness with knowledge and procedures, so the same capability works across harnesses and costs the agent little until needed, through progressive disclosure; it is built as a folder holding a `SKILL.md` under the Agent Skills specification; tools, instruction files and plugins are not skills. | 2026-11-12 | [skill](industry.skill.md), [Agent Skills](spec.agent-skills.md), [progressive disclosure](spec.agent-skills.progressive-disclosure.md) | In force |
| KG-ROOT, ROOT-FORM | Kris's decision, in the Cairn summit's change 06: a graph defines itself at its root in `_graph.md`, a card of type graph declaring its card types, link vocabulary, properties, constraints, subgraphs and extent. | 2026-11-12 | [the root definition](_graph.md) | In force |
| KG-SUBGRAPHS | Kris's decision, in change 06: the industry's terms form one subgraph and each vendor another, whose cards hold its own words and link to the industry's terms; synonyms and senses are links, and comparison is read through them. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), [the root definition](_graph.md), every vendor card | In force |
| LINK-VOCAB | Kris's decision, in change 06: each graph declares its link vocabulary at its root; SKOS is the default, with `ki:` only for what it lacks. | 2026-11-12 | [the root definition](_graph.md) | In force |
| KG-FLAT, FILE-NAME | Kris's decisions, in change 06: a graph is flat by default and a card's identity is its readable id; the file is `<id>.md` and the id carries the subgraph. | 2026-11-12 | [SKILL.md](../SKILL.md#the-cards) | In force |
| KG-GRAIN | Kris's decision, in change 06: no links into part of a card; each part linked to is a card of its own. | 2026-11-12 | [progressive disclosure](spec.agent-skills.progressive-disclosure.md) | In force |
| ENVIRONMENT | Kris's decision: an environment is where an agent's work runs, a whole machine, physical or virtual, or a container or sandbox inside one; local, remote and cloud are its kinds as values; a machine is the computer, which networking calls a host and we do not. | 2026-11-12 | [environment](industry.environment.md), [machine](industry.machine.md) | In force |
| CARD-AGENT-HOST | Kris's decision: an agent host is the application or process that runs agent harnesses and owns their sessions, independently of clients, in AHP's sense; a harness run by itself is its own agent host and client. | 2026-11-12 | [agent host](industry.agent-host.md) | In force |
| CARD-CLIENT | Kris's decision: a client is a window onto a session an agent host owns; a session can have several, and one program can be both agent host and client. | 2026-11-12 | [client](industry.client.md) | In force |
| VENDORS-MORE | Kris's decision: Orca and Zed Industries join the vendor subgraphs. | 2026-11-12 | [Orca runtime](orca.runtime.md), [Orca app](orca.app.md), [Zed](zed.zed.md) | In force |
| DIAGRAM-RESOURCE | Kris's decision: a diagram of the terms is a resource, addressable directly by a card of its own that says what it shows and where the diagram and its regeneration prompt live. | 2026-11-12 | [the root definition](_graph.md), the `diagram.` cards | In force |
| CARD-CHANNEL | Kris's decision, given for every high-confidence recommendation: a, the industry's words only; a channel pushes events from outside into a running session, with integration and session-to-session messaging as cards of their own under the ways into a session. The card's wording is still a proposal. | 2026-11-12 | [channel](industry.channel.md) | Taken, for Kris's review |

[Back to contents](#contents)

## 4. Last review

On 12 November 2026 the skill was written from the Cairn summit's change 22, knowledge skills, and a survey of the four vendors' documentation made that day for the cards. Every authoritative source above was checked then, except [O3], which refused the fetcher and is dated from search results. The same day the cards were reshaped into a knowledge graph under change 06: a root definition, the industry's subgraph, a specification subgraph and a subgraph for each vendor, the vendor rows of each term card becoming vendor cards linked by SKOS predicates, and the skill card and the Agent Skills specification's cards written from [A6], [O12], [O13], [G8], [M10] and [S1].

- **Confirmed:** Anthropic, Google and Microsoft each name the layer an agent harness, or an agentic harness, and OpenAI the Codex harness; vendors name an agent after its harness; VS Code alone calls Copilot, Claude and Codex harnesses. Session is Anthropic's word and the majority's; OpenAI says task or chat by surface, and Google conversation in Antigravity's app; OpenAI's top-level thread is the primary thread. All four vendors say subagent, and differ only on how subagents nest. All four build their skills on the Agent Skills specification, and OpenAI distributes them in plugins.
- **The knowledge kind:** `ki-skills` defines `ki-kind: knowledge` and how a knowledge skill holds its graph in `references/`, so the cards are checked as graph cards: `_graph.md` and files named by their ids.
- **Specification cards, proposed:** the cards for MCP, ACP, AHP and A2A, each split into its parts, were drafted as proposals from [MCP1] to [MCP10], [ACP1] to [ACP10], [AHP1] to [AHP9] and [A2A1] to [A2A4], for Kris's decision in the Cairn summit's change 22; none is agreed, and no decision above backs them.
- **Open watch-items:**
  - Jules closes on 31 December 2026, and Gemini CLI's replacement by the Antigravity CLI is spreading; move both to past examples when they go.
  - GitHub renamed its cloud agent Copilot in the cloud on 28 October 2026; check the older name has left the docs.
  - Gemini 4 Carbon became generally available on 10 November 2026 and GPT-5.5 is retiring; refresh the vendors' model cards.
  - Re-read [O3] when it can be fetched, and confirm its date.
  - OpenAI's session words keep moving between thread, task and chat; check which [O4], [O9] and [O10] use now.
  - ACP's v2 draft ([ACP7]) and MCP's next revision ([MCP7]); refresh the specification cards when either lands.

[Back to contents](#contents)
