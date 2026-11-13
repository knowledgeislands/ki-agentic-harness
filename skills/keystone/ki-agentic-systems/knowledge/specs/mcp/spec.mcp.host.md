---
id: spec.mcp.host
title: MCP host, in the Model Context Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  spec.mcp:
    predicate: dcterms:isPartOf
  industry.agent-harness:
    predicate: skos:relatedMatch
  industry.agent-host:
    predicate: skos:relatedMatch
  spec.mcp.client:
    predicate: skos:related
---

# MCP host, in the Model Context Protocol

An MCP host keeps the conversation and the user's consent in one place, so that each server it uses sees only what it needs. It is part of the [Model Context Protocol][spec.mcp] ([MCP2]).

MCP defines its hosts as "LLM applications that initiate connections" ([MCP1]). The MCP host creates and manages one [MCP client][spec.mcp.client] for each server, controls their permissions and lifecycle, enforces security policies and consent, coordinates the model, and aggregates context across clients. The full conversation stays with it ([MCP2]).

This is a third sense of "host", and it is never written bare. Its role is closest to an [agent harness][industry.agent-harness], which holds the tools and the context and talks to the model. It is not an [agent host][industry.agent-host], which runs harnesses and owns their sessions for clients to display, although one program can be both. MCP's hosts also include LLM applications that are not agentic, such as chat interfaces.

[spec.mcp]: ./spec.mcp.md
[spec.mcp.client]: ./spec.mcp.client.md
[industry.agent-harness]: ../../industry/industry.agent-harness.md
[industry.agent-host]: ../../industry/industry.agent-host.md
[MCP2]: https://modelcontextprotocol.io/specification/2026-07-28/architecture
[MCP1]: https://modelcontextprotocol.io/specification/2026-07-28
