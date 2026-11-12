---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-12T10:30:00Z
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

The vendor sources and decisions behind the skill's rules in [SKILL.md](../SKILL.md#rules) and its cards: [model](term-model.md), [agent harness](term-agent-harness.md), [agent](term-agent.md), [session](term-session.md) and [subagent](term-subagent.md). Provenance only: the record of what changed lives in git, not a changelog here.

The vendors' naming keeps changing, so refreshing is a regular activity (TERMS-REFRESH), run monthly and whenever a vendor renames a product or a layer. Each refresh:

1. **Re-checks every source below,** and each source a card cites, for the names, the vendor's own word and the dates on each card, and records unverified or secondary facts as such.
2. **Watches how the industry's terms move:** a new word for a layer, a word that changes sense, a product renamed, merged, replaced or closed, and a vendor that starts or stops using a term.
3. **Keeps each card's examples current,** Anthropic and OpenAI first, then Google and Microsoft, under INDUSTRY-FIRST and LEADERS, and keeps its senses section true. A change to a card's definition is a change of substance and goes to the change that governs the skill, not into a refresh.
4. **Updates this file:** the last-reviewed dates, any source added or retired, and the Last review.

[Back to contents](#contents)

## 2. Outside sources

The vendors' own documentation the cards follow, checked on 12 November 2026. The identifiers match the citations on each card.

### 2.1 Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| **[A1]** [Anthropic, Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) | Model: current Claude models and ids | 2026-11-12 |
| **[A2]** [Anthropic, Claude Code overview](https://code.claude.com/docs/en/overview) | Agent harness and agent: Claude Code as harness and product | 2026-11-12 |
| **[A3]** [Anthropic, Claude Code glossary](https://code.claude.com/docs/en/glossary.md) | Agent harness, agent and session: "agentic harness", "Claude is the model inside it"; session, turn and transcript; subagents and agent teams | 2026-11-12 |
| **[A4]** [Anthropic, Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) | Agent harness and agent: the Agent SDK, Managed Agents, "Claude Agent" branding | 2026-11-12 |
| **[A5]** [Anthropic, Subagents](https://code.claude.com/docs/en/sub-agents) | Subagent: Claude Code's subagents | 2026-11-12 |
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
| **[G1]** [Google, Gemini models](https://aistudio.google.com/docs/models) | Model: current Gemini models | 2026-11-12 |
| **[G2]** [Google, Antigravity overview](https://antigravity.google/docs/overview) | Agent harness, agent, session and subagent: the Antigravity harness and its surfaces; conversation; subagents in their own worktrees | 2026-11-12 |
| **[G3]** [Google, Gemini CLI docs](https://geminicli.com/docs/) | Agent: Gemini CLI and its replacement | 2026-11-12 |
| **[G4]** [Google, Antigravity CLI conversations](https://antigravity.google/docs/cli/conversations/) | Session: session ids in the CLI | 2026-11-12 |
| **[G5]** [Google, ADK sessions](https://adk.dev/sessions/) | Agent harness and session: the Agent Development Kit and its Session | 2026-11-12 |
| **[G6]** [Google, Jules changelog](https://jules.google/docs/changelog/) | Agent and session: Jules wind-down notice of 29 October 2026; task and Session | 2026-11-12 |
| **[G7]** [Google, Gemini CLI subagents](https://geminicli.com/docs/core/subagents/) | Subagent: Gemini CLI's subagents, which cannot call other subagents | 2026-11-12 |
| **[M1]** [Microsoft, MAI models](https://microsoft.ai/models/) | Model: Microsoft's own models | 2026-11-12 |
| **[M2]** [GitHub, Copilot supported models](https://docs.github.com/en/copilot/reference/ai-models/supported-models) | Model: the models Copilot serves | 2026-11-12 |
| **[M3]** [VS Code, Build with agents](https://code.visualstudio.com/docs/copilot/agents/overview) | Agent harness, agent and session: VS Code's harnesses, agent mode and agent session | 2026-11-12 |
| **[M4]** [VS Code, Understand agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses) | Agent harness: "the software layer that runs an agent session" | 2026-11-12 |
| **[M5]** [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/) and [Copilot SDK](https://github.com/github/copilot-sdk) | Agent harness and session: the Harness Agent, the Copilot SDK and the agent session; page dated 23 October 2026 | 2026-11-12 |
| **[M6]** [GitHub, Copilot coding agent in Slack](https://github.blog/changelog/2025-10-28-work-with-copilot-coding-agent-in-slack/) | Agent: the former name, Copilot coding agent | 2026-11-12 |
| **[M7]** [GitHub, About Copilot in the cloud](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Agent and session: Copilot in the cloud; session and agent task | 2026-11-12 |
| **[M8]** [Agent Host Protocol, What is AHP](https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html) | Session: sessions and the chats inside them | 2026-11-12 |
| **[M9]** [VS Code, Subagents](https://code.visualstudio.com/docs/agents/subagents) | Subagent: VS Code's subagents and their nesting | 2026-11-12 |

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
| KNOWLEDGE-KIND | Kris's decision: a third kind of skill, the knowledge skill, only equips a session with a body of knowledge as Semantic Markdown cards; it audits and conforms nothing, its modes are `educate` and `refresh`, and other skills link to its cards rather than define its terms again. | 2026-11-10 | [SKILL.md](../SKILL.md#linking-to-a-card) | In force |
| AGENTIC-SYSTEMS-SKILL | Kris's decision: `ki-agentic-systems` is the first knowledge skill, in the Keystone guild, and the one canonical source for agentic terms, with examples. | 2026-11-10 | [SKILL.md](../SKILL.md#the-cards) | In force |
| NAMING-RULE | Kris's decision: the system's own names are proper names chosen as metaphors from things in the landscape that outlast their makers; roles are plain words; analogies are written as analogies and are a card of their own. | 2026-11-11 | [SKILL.md](../SKILL.md#the-cards), the system's own terms still to come | In force |
| INDUSTRY-FIRST | Kris's decision: where an industry standard defines a term, its meaning stands and the system's conventions move to fit; each card says where a convention of ours maps onto it, and those that clash are renamed. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| LEADERS | Kris's decision: where vendors differ, Anthropic's and OpenAI's usage leads and the card notes where others differ. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| VENDORS | Kris's decision: each card gives the industry's name, its definition and examples from Anthropic, OpenAI, Google and Microsoft, and others where they matter, and says which sense it means where a vendor uses a name in more than one. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), every card | In force |
| CARD-ORDER | Kris's decision: the cards are ordered so each uses only words already defined, starting from the model. | 2026-11-12 | [SKILL.md](../SKILL.md#the-cards) | In force |
| CARDS-AGENT | Kris's decision, reworked the same day on the vendors' evidence: the first three cards are the model, the agent harness and the agent; vendors name an agent after its harness; the KI harness takes another name, settled after the industry's cards. | 2026-11-12 | [model](term-model.md), [agent harness](term-agent-harness.md), [agent](term-agent.md) | In force |
| CARD-SESSION | Kris's decision: a session is one run of an agent, a conversation with its own context, its id and the folder it works in, made of turns; the harness runs it and keeps its transcript so it can be resumed; session is Anthropic's word and the majority's, OpenAI's task and chat, Google's conversation and Microsoft's agent session are synonyms, and "task" is kept off every card as a term. | 2026-11-12 | [session](term-session.md) | In force |
| SESSION-THREADS | Kris's decision: a thread is not a synonym for a session but a part of one; a session is made of the agent's primary thread and a thread for each subagent, and OpenAI's top-level thread is the primary thread. | 2026-11-12 | [session](term-session.md) | In force |
| CARD-SUBAGENT | Kris's decision: a subagent is an agent subordinate to another agent, started by it to do part of its work, acting wholly within its boundaries and under its control, and returning its result to it; it does not interact with other agents, the controlling agent being the point of interaction; each works in a thread of its own within the session; how a harness implements subagents, such as nesting, is not part of the definition; agent teams and A2A remote agents are agents in their own right, not subagents. | 2026-11-12 | [subagent](term-subagent.md) | In force |
| HOST-SENSES | Kris's decision: never a bare "host"; agent host is the application or process that runs harnesses and owns their sessions, and machine is the computer, with a vendor's "host" for a computer noted on the machine card as a synonym. | 2026-11-12 | [SKILL.md](../SKILL.md#rules) | In force |
| TERMS-REFRESH | Kris's decision: refreshing is a regular activity that checks how the industry's terms move and keeps each card's examples current. | 2026-11-12 | [this file](#1-introduction), [SKILL.md](../SKILL.md#mode-refresh) | In force |
| SPEC-CARDS | Kris's decision: each specification a term rests on, such as the Agent Skills specification, MCP, ACP, AHP and A2A, is its own card, and a term card cites the specification and links to the part of that card it rests on rather than restating it. | 2026-11-12 | [SKILL.md](../SKILL.md#rules), [session](term-session.md) | In force |
| AHEAD-OF-REVIEW | Kris's decision: the skill is built ahead of the Keystone review and declares the knowledge kind before `ki-skills` defines it, gaining each card as it is settled. | 2026-11-12 | [SKILL.md](../SKILL.md#knowledge-islands-agentic-systems) | In force |

[Back to contents](#contents)

## 4. Last review

On 12 November 2026 the skill was written from the Cairn summit's change 22, knowledge skills, and a survey of the four vendors' documentation made that day for the cards. Every authoritative source above was checked then, except [O3], which refused the fetcher and is dated from search results.

- **Confirmed:** Anthropic, Google and Microsoft each name the layer an agent harness, or an agentic harness, and OpenAI the Codex harness; vendors name an agent after its harness; VS Code alone calls Copilot, Claude and Codex harnesses. Session is Anthropic's word and the majority's; OpenAI says task or chat by surface, and Google conversation in Antigravity's app; OpenAI's top-level thread is the primary thread. All four vendors say subagent, and differ only on how subagents nest.
- **Pending the knowledge kind:** `ki-skills` does not yet define `ki-kind: knowledge`, card files in `references/`, or how its rubric checks a knowledge skill, so the skill has no rubric and its mechanical audit reports the kind and the card files until it does. The cards sit flat in `references/`, term cards as `term-<id>.md` and specification cards as `spec-<id>.md`: the simplest layout that keeps each card one addressable file, keeps the two sets side by side, and gives the closed reference vocabulary two patterns to admit.
- **Open watch-items:**
  - Jules closes on 31 December 2026, and Gemini CLI's replacement by the Antigravity CLI is spreading; move both to past examples when they go.
  - GitHub renamed its cloud agent Copilot in the cloud on 28 October 2026; check the older name has left the docs.
  - Gemini 4 Carbon became generally available on 10 November 2026 and GPT-5.5 is retiring; refresh the model card's lists.
  - Re-read [O3] when it can be fetched, and confirm its date.
  - OpenAI's session words keep moving between thread, task and chat; check which [O4], [O9] and [O10] use now.

[Back to contents](#contents)
