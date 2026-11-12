---
id: spec.acp.client
title: ACP client, in the Agent Client Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.acp:
    predicate: dcterms:isPartOf
  spec.acp.agent:
    predicate: skos:related
  industry.client:
    predicate: skos:broadMatch
---

# ACP client, in the Agent Client Protocol

An ACP client lets you drive a coding agent from the tool you already work in, usually your editor. It is part of the [Agent Client Protocol][spec.acp] ([ACP2]).

ACP says clients "provide the interface between users and agents": typically code editors, though other interfaces qualify. A client launches the [ACP agent][spec.acp.agent], sends prompts, shows the updates and tool calls it streams back, and answers its requests for permission. It may also lend the agent its files and terminals, and passes it the user's MCP servers ([ACP2], [ACP10]). An agent can itself be an ACP client, running other coding agents as subagents ([ACP5]).

It is narrower than a [client][industry.client] in this graph's sense: it reaches an agent only through ACP. It also does more than a window does, since it starts the agent and serves its files and terminals. [Zed][zed.zed] is one.

[spec.acp]: ./spec.acp.md
[spec.acp.agent]: ./spec.acp.agent.md
[industry.client]: ./industry.client.md
[zed.zed]: ./zed.zed.md
[ACP2]: https://agentclientprotocol.com/protocol/v1/overview
[ACP5]: https://agentclientprotocol.com/get-started/related-protocols
[ACP10]: https://agentclientprotocol.com/get-started/architecture
