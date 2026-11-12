---
id: spec.mcp.tools
title: Tools, in the Model Context Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.mcp:
    predicate: dcterms:isPartOf
  spec.mcp.server:
    predicate: skos:related
  industry.agent-harness:
    predicate: skos:relatedMatch
---

# Tools, in the Model Context Protocol

MCP's tools let a model act on systems outside itself, such as querying a database or calling an API, through any [MCP server][spec.mcp.server] that offers them. They are part of the [Model Context Protocol][spec.mcp] ([MCP3]).

A tool is named by a unique `name` and described by a `description`, an `inputSchema` in JSON Schema, and optionally a `title`, an `outputSchema` and `annotations`. A client discovers tools with `tools/list` and calls one with `tools/call`; the result carries text, images, audio, resource links or structured content ([MCP3]).

Tools are model-controlled: the model chooses them from its context and the user's prompts, and, in this graph's terms, the [agent harness][industry.agent-harness] carries the call out. The specification says there should always be a human able to deny a call, and treats a tool's annotations as untrusted unless its server is trusted ([MCP3]).

The pending `industry.tool` card will rest on this part.

[spec.mcp]: ./spec.mcp.md
[spec.mcp.server]: ./spec.mcp.server.md
[industry.agent-harness]: ../../industry/industry.agent-harness.md
[MCP3]: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
