---
id: spec.mcp.client
title: MCP client, in the Model Context Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.mcp:
    predicate: dcterms:isPartOf
  spec.mcp.host:
    predicate: skos:related
  spec.mcp.server:
    predicate: skos:related
  industry.client:
    predicate: skos:relatedMatch
---

# MCP client, in the Model Context Protocol

An MCP client keeps each server apart from the others, so that one server can never see into another. It is part of the [Model Context Protocol][spec.mcp] ([MCP2]).

MCP calls its clients "connectors within the host application" ([MCP1]). The [MCP host][spec.mcp.host] creates one MCP client for each [MCP server][spec.mcp.server], and each talks to exactly that one server. It attaches the protocol version and its capabilities to every request, routes messages both ways, manages subscriptions and notifications, and keeps the security boundary between servers ([MCP2]). It may offer the server elicitation, asking the user for more information ([MCP1]).

An MCP client is not a [client][industry.client] in this graph's sense: it is plumbing inside an application, not a window onto a session. Most agents that speak the Agent Client Protocol are MCP clients as well.

[spec.mcp]: ./spec.mcp.md
[spec.mcp.host]: ./spec.mcp.host.md
[spec.mcp.server]: ./spec.mcp.server.md
[industry.client]: ./industry.client.md
[MCP1]: https://modelcontextprotocol.io/specification/2026-07-28
[MCP2]: https://modelcontextprotocol.io/specification/2026-07-28/architecture
