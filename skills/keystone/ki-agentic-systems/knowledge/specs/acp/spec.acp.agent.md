---
id: spec.acp.agent
title: ACP agent, in the Agent Client Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  spec.acp:
    predicate: dcterms:isPartOf
  spec.acp.client:
    predicate: skos:related
  industry.agent:
    predicate: skos:broadMatch
  industry.agent-host:
    predicate: skos:relatedMatch
---

# ACP agent, in the Agent Client Protocol

An ACP agent is a coding agent that can serve any editor speaking ACP, without an integration for each one. It is part of the [Agent Client Protocol][spec.acp] ([ACP1]).

ACP defines agents as "programs that use generative AI to autonomously modify code", which usually run as subprocesses of the [ACP client][spec.acp.client]. An agent negotiates the protocol version, creates and keeps [ACP sessions][spec.acp.session], runs each prompt and streams its progress back, and asks the client's permission before a tool call ([ACP2]). Most ACP agents are also MCP clients ([ACP5]).

An ACP agent is an [agent][industry.agent] narrowed to coding. It is usually not an [agent host][industry.agent-host]: the client launches it as a subprocess and ends it ([ACP4]), so its sessions do not live independently of their client. Examples include Claude Agent, through Zed's adapter, Codex CLI, through ACP's adapter, and Gemini CLI ([ACP9]).

[spec.acp]: ./spec.acp.md
[spec.acp.client]: ./spec.acp.client.md
[spec.acp.session]: ./spec.acp.session.md
[industry.agent]: ../../industry/industry.agent.md
[industry.agent-host]: ../../industry/industry.agent-host.md
[ACP1]: https://agentclientprotocol.com/get-started/introduction
[ACP2]: https://agentclientprotocol.com/protocol/v1/overview
[ACP5]: https://agentclientprotocol.com/get-started/related-protocols
[ACP9]: https://agentclientprotocol.com/get-started/agents
[ACP4]: https://agentclientprotocol.com/protocol/v1/transports
