---
id: spec.acp.session
title: Session, in the Agent Client Protocol
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
  industry.session:
    predicate: skos:closeMatch
---

# Session, in the Agent Client Protocol

An ACP session keeps one conversation with an agent together, so that one agent can run several at once and a client can come back to any of them. It is part of the [Agent Client Protocol][spec.acp] ([ACP3]).

ACP calls a session "a specific conversation or thread" between client and agent, with its own context, conversation history and state. The client opens one with `session/new`, giving an absolute working directory and the MCP servers to connect to, and the [ACP agent][spec.acp.agent] answers with a unique session id. Where the agent supports them, the client can load a session, replaying its history; resume it without replay; list, close or delete sessions ([listing][ACP11], [deleting][ACP12]). Loading lets a session persist across restarts and be shared between client instances ([ACP3]).

It closely matches a [session][industry.session] in this graph's sense, but where ACP says "thread", this graph means a part of a session, never another word for one.

[spec.acp]: ./spec.acp.md
[spec.acp.agent]: ./spec.acp.agent.md
[industry.session]: ./industry.session.md
[ACP3]: https://agentclientprotocol.com/protocol/v1/session-setup
[ACP11]: https://agentclientprotocol.com/protocol/v1/session-list
[ACP12]: https://agentclientprotocol.com/protocol/v1/session-delete
