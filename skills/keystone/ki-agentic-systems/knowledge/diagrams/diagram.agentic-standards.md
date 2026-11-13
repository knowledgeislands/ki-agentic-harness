---
id: diagram.agentic-standards
title: Agentic standards and channels
type: resource
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, DIAGRAM-RESOURCE (12 November 2026); its channels and agent kinds wait on CARD-CHANNEL and AGENT-KINDS
links:
  industry.agent-host:
    predicate: dcterms:subject
  industry.agent:
    predicate: dcterms:subject
  industry.client:
    predicate: dcterms:subject
---

# Agentic standards and channels

A diagram of what each open standard connects: MCP an [agent][industry.agent] to its tools, ACP one [client][industry.client] to one agent, AHP many clients to one [agent host][industry.agent-host], and A2A an agent to an opaque remote agent in another agentic system. It also draws channels within a system and between systems, and an integration, which are provisional until CARD-CHANNEL and AGENT-KINDS are settled; this card is a proposal until then.

- **Figure:** [agentic-standards.svg][svg], with the [interactive viewer][html].
- **Source and regeneration:** [its Archify source][src] and its table in the harness's [diagram manifest][manifest].

The specification cards it points to, [MCP][spec.mcp], [ACP][spec.acp], [AHP][spec.ahp] and [A2A][spec.a2a], are proposals; CARD-CHANNEL took option A, the industry's words, so the diagram's channel labels are to be redrawn in them.

[industry.agent]: ../industry/industry.agent.md
[industry.client]: ../industry/industry.client.md
[industry.agent-host]: ../industry/industry.agent-host.md
[spec.mcp]: ../specs/mcp/spec.mcp.md
[spec.acp]: ../specs/acp/spec.acp.md
[spec.ahp]: ../specs/ahp/spec.ahp.md
[spec.a2a]: ../specs/a2a/spec.a2a.md
[svg]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-standards.svg
[html]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-standards.html
[src]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-standards.architecture.json
[manifest]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/diagrams.toml
