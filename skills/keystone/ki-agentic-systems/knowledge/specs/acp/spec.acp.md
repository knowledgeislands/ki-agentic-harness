---
id: spec.acp
title: Agent Client Protocol (ACP)
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.acp.client:
    predicate: dcterms:hasPart
  spec.acp.agent:
    predicate: dcterms:hasPart
  spec.acp.session:
    predicate: dcterms:hasPart
  spec.mcp:
    predicate: skos:related
  spec.a2a:
    predicate: skos:related
---

# Agent Client Protocol (ACP)

The Agent Client Protocol lets any code editor drive any coding agent, so that an agent works in every editor that adopts it and each side can develop on its own ([ACP1]).

ACP is a protocol of JSON-RPC 2.0 messages between an [ACP client][spec.acp.client], usually an editor, and an [ACP agent][spec.acp.agent]. The client initialises the connection, opens an [ACP session][spec.acp.session] and sends prompts; the agent streams back updates, reports tool calls and asks permission before acting ([ACP2]). It reuses the [Model Context Protocol][spec.mcp]'s JSON representations where it can, and the client hands the agent the user's MCP servers ([ACP5]).

Its one transport is stdio: the client launches the agent as a subprocess and they exchange newline-delimited JSON-RPC. A remote transport over Streamable HTTP is still being specified ([ACP4]).

The stable protocol is version 1, at schema 1.31.0 on 10 November 2026 ([ACP8]); version 2 has been in draft since 20 July 2026 ([ACP7]). Zed Industries and JetBrains govern it jointly ([ACP6]), and [Zed][zed.zed] is one of its clients ([agents][ACP9]).

It is not the Agent Communication Protocol, IBM's BeeAI project, also called ACP, which merged into [Agent2Agent][spec.a2a] in 2025 ([ACP5]).

[spec.acp.client]: ./spec.acp.client.md
[spec.acp.agent]: ./spec.acp.agent.md
[spec.acp.session]: ./spec.acp.session.md
[spec.mcp]: ../mcp/spec.mcp.md
[zed.zed]: ../../vendors/zed/zed.zed.md
[spec.a2a]: ../a2a/spec.a2a.md
[ACP1]: https://agentclientprotocol.com/get-started/introduction
[ACP2]: https://agentclientprotocol.com/protocol/v1/overview
[ACP4]: https://agentclientprotocol.com/protocol/v1/transports
[ACP5]: https://agentclientprotocol.com/get-started/related-protocols
[ACP6]: https://agentclientprotocol.com/community/governance
[ACP7]: https://agentclientprotocol.com/announcements/acp-v2-draft
[ACP8]: https://github.com/agentclientprotocol/agent-client-protocol/releases
[ACP9]: https://agentclientprotocol.com/get-started/agents
