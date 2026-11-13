---
id: spec.a2a.remote-agent
title: Remote agent, in the Agent2Agent protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  spec.a2a:
    predicate: dcterms:isPartOf
  industry.agent:
    predicate: skos:broadMatch
  industry.subagent:
    predicate: skos:relatedMatch
  spec.mcp:
    predicate: skos:related
---

# Remote agent, in the Agent2Agent protocol

The remote agent lets work be handed to an agent elsewhere that keeps its own workings to itself. It is the server's role in the [Agent2Agent protocol][spec.a2a].

The specification defines the A2A server (remote agent) as "an agent or agentic system that exposes an A2A-compliant endpoint, processing tasks and providing responses" ([specification][A2A1]). It must publish an [Agent Card][spec.a2a.agent-card], and it runs the [tasks][spec.a2a.task] its [clients][spec.a2a.client] ask for. To a client it is opaque, a black box whose memory and tools stay hidden ([key concepts][A2A2]); it may itself use [MCP][spec.mcp] to reach its tools.

A remote agent is an [agent][industry.agent] in its own right, or a system of agents, and not a [subagent][industry.subagent]: it is independent of its client and opaque to it, where a subagent acts within its controlling agent's boundaries. The pending remote agent card, `industry.remote-agent`, is to rest on this one.

[spec.a2a]: ./spec.a2a.md
[spec.a2a.agent-card]: ./spec.a2a.agent-card.md
[spec.a2a.task]: ./spec.a2a.task.md
[spec.a2a.client]: ./spec.a2a.client.md
[industry.agent]: ../../industry/industry.agent.md
[industry.subagent]: ../../industry/industry.subagent.md
[spec.mcp]: ../mcp/spec.mcp.md
[A2A1]: https://a2a-protocol.org/latest/specification/
[A2A2]: https://a2a-protocol.org/latest/topics/key-concepts/
