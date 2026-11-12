---
id: spec.mcp.transports
title: Transports, in the Model Context Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.mcp:
    predicate: dcterms:isPartOf
  spec.mcp.client:
    predicate: skos:related
  spec.mcp.server:
    predicate: skos:related
---

# Transports, in the Model Context Protocol

MCP's transports let the same messages reach a server on the same machine or across the internet, with the same meaning on every one. They are part of the [Model Context Protocol][spec.mcp] ([MCP4]).

A transport says only how messages are framed and delivered, how request metadata travels, and how a request is cancelled. MCP defines two:

1. **stdio:** the [MCP client][spec.mcp.client] launches the [MCP server][spec.mcp.server] as a subprocess and they exchange newline-delimited JSON-RPC over its standard input and output ([MCP5]).
2. **Streamable HTTP:** the server runs as an independent process with a single endpoint; each message is an HTTP POST, answered with one JSON object or a stream of Server-Sent Events for that request ([MCP6]).

Clients and servers may add custom transports that keep the same messages. Since 2026-07-28, Streamable HTTP carries no session id; the older HTTP+SSE transport of 2024-11-05 is deprecated ([MCP6]).

[spec.mcp]: ./spec.mcp.md
[spec.mcp.client]: ./spec.mcp.client.md
[spec.mcp.server]: ./spec.mcp.server.md
[MCP4]: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
[MCP5]: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio
[MCP6]: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
