---
id: spec.a2a.client
title: Client, in the Agent2Agent protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.a2a:
    predicate: dcterms:isPartOf
  industry.client:
    predicate: skos:relatedMatch
---

# Client, in the Agent2Agent protocol

An A2A client lets an agent, or an application, hand work to another agent on a user's behalf. It is a role in the [Agent2Agent protocol][spec.a2a].

The specification defines it as "an application or agent that initiates requests to an A2A Server on behalf of a user or another system" ([specification][A2A1]); its key concepts call it the client agent ([key concepts][A2A2]). It reads a [remote agent][spec.a2a.remote-agent]'s [Agent Card][spec.a2a.agent-card], uses the first interface on it that it supports, sends messages, and follows the [tasks][spec.a2a.task] that come back.

It is not the [client][industry.client] term's sense. An A2A client starts work with another agent, and is often an [agent][industry.agent] itself; our client is a window onto a session an agent host owns. The two are related, not the same.

[spec.a2a]: ./spec.a2a.md
[spec.a2a.remote-agent]: ./spec.a2a.remote-agent.md
[spec.a2a.agent-card]: ./spec.a2a.agent-card.md
[spec.a2a.task]: ./spec.a2a.task.md
[industry.client]: ../../industry/industry.client.md
[industry.agent]: ../../industry/industry.agent.md
[A2A1]: https://a2a-protocol.org/latest/specification/
[A2A2]: https://a2a-protocol.org/latest/topics/key-concepts/
