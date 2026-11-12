---
id: spec.a2a.agent-card
title: Agent Card, in the Agent2Agent protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.a2a:
    predicate: dcterms:isPartOf
  industry.skill:
    predicate: skos:relatedMatch
---

# Agent Card, in the Agent2Agent protocol

The Agent Card lets a client find an agent and know, before calling it, what it can do and how to reach it. It is part of the [Agent2Agent protocol][spec.a2a].

It is a JSON document that every [remote agent][spec.a2a.remote-agent] must publish, describing its identity, capabilities, skills, service endpoint and authentication requirements ([specification][A2A1]). A [client][spec.a2a.client] finds it at the well-known address `https://{server_domain}/.well-known/agent-card.json`, in a registry or catalogue, or by direct configuration. It lists the agent's interfaces, each a binding and URL, in order of preference, and the client uses the first it supports. A card may be signed, and an agent may offer a fuller extended card to clients once they have authenticated.

The card's skills are capabilities the agent declares, each with an id, name, description and tags. They are not [skills][industry.skill] in the Agent Skills sense, which extend an agent harness with knowledge and procedures; the two are related only by name.

[spec.a2a]: ./spec.a2a.md
[spec.a2a.remote-agent]: ./spec.a2a.remote-agent.md
[spec.a2a.client]: ./spec.a2a.client.md
[industry.skill]: ./industry.skill.md
[A2A1]: https://a2a-protocol.org/latest/specification/
