---
id: spec.mcp
title: Model Context Protocol (MCP)
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.mcp.host:
    predicate: dcterms:hasPart
  spec.mcp.client:
    predicate: dcterms:hasPart
  spec.mcp.server:
    predicate: dcterms:hasPart
  spec.mcp.tools:
    predicate: dcterms:hasPart
  spec.mcp.transports:
    predicate: dcterms:hasPart
  industry.agent-harness:
    predicate: skos:related
  spec.acp:
    predicate: skos:related
---

# Model Context Protocol (MCP)

The Model Context Protocol gives any LLM application one standard way to reach the context, data and tools it needs, so one integration works in every application that adopts it ([MCP1]).

MCP is a protocol of JSON-RPC 2.0 messages between three roles: an [MCP host][spec.mcp.host], the application, which creates one [MCP client][spec.mcp.client] for each [MCP server][spec.mcp.server] it connects to. A server offers resources, prompts and [tools][spec.mcp.tools]; a client may offer elicitation, asking the user for more information. Messages travel over its [transports][spec.mcp.transports]. Optional extensions, among them tasks and Skills over MCP, are negotiated on top ([MCP1]).

The current revision is 2026-07-28 ([MCP7]). It made MCP stateless: the `initialize` handshake and the protocol-level session of revisions up to 2025-11-25 are gone, and every request carries its own protocol version and capabilities ([MCP8]). MCP has no session in this graph's sense.

An [agent harness][industry.agent-harness] uses MCP to reach its tools; the pending `industry.tool` card will rest on it. The [Agent Client Protocol][spec.acp] works beside it.

[spec.mcp.host]: ./spec.mcp.host.md
[spec.mcp.client]: ./spec.mcp.client.md
[spec.mcp.server]: ./spec.mcp.server.md
[spec.mcp.tools]: ./spec.mcp.tools.md
[spec.mcp.transports]: ./spec.mcp.transports.md
[industry.agent-harness]: ./industry.agent-harness.md
[spec.acp]: ./spec.acp.md
[MCP1]: https://modelcontextprotocol.io/specification/2026-07-28
[MCP7]: https://modelcontextprotocol.io/specification/versioning
[MCP8]: https://modelcontextprotocol.io/specification/2026-07-28/changelog
