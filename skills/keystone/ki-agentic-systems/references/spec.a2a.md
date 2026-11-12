---
id: spec.a2a
title: Agent2Agent protocol (A2A)
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.a2a.client:
    predicate: dcterms:hasPart
  spec.a2a.remote-agent:
    predicate: dcterms:hasPart
  spec.a2a.agent-card:
    predicate: dcterms:hasPart
  spec.a2a.task:
    predicate: dcterms:hasPart
  spec.mcp:
    predicate: skos:related
---

# Agent2Agent protocol (A2A)

The Agent2Agent protocol lets independent agents, built by different vendors on different frameworks, find each other and work together without access to each other's internal state, memory or tools ([specification][A2A1]).

An [A2A client][spec.a2a.client] sends requests to an [A2A server, the remote agent][spec.a2a.remote-agent], which it finds through its [Agent Card][spec.a2a.agent-card]. The specification has three layers. Its data model holds [tasks][spec.a2a.task]; messages, each one turn from the user or the agent; artifacts, the outputs of a task; and parts, the text, file or structured data inside messages and artifacts. Its operations send messages and get, list and cancel tasks. Its bindings, JSON-RPC 2.0, gRPC and HTTP+JSON/REST, carry them with the same behaviour, and custom bindings are allowed. Updates arrive by polling, by streaming or by push notifications to a webhook. The Protocol Buffers file `a2a.proto` is normative.

A2A covers agents working with agents; [MCP][spec.mcp] covers an agent using tools and data, and the two are complementary. A2A is a Linux Foundation project contributed by Google. Version 1.0 was released on 12 March 2026 and patch 1.0.1 on 28 May 2026, the latest on 12 November 2026; patches do not affect compatibility ([release][A2A4]).

[spec.a2a.client]: ./spec.a2a.client.md
[spec.a2a.remote-agent]: ./spec.a2a.remote-agent.md
[spec.a2a.agent-card]: ./spec.a2a.agent-card.md
[spec.a2a.task]: ./spec.a2a.task.md
[spec.mcp]: ./spec.mcp.md
[A2A1]: https://a2a-protocol.org/latest/specification/
[A2A4]: https://github.com/a2aproject/A2A/releases/tag/v1.0.1
