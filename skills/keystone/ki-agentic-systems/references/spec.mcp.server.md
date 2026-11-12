---
id: spec.mcp.server
title: MCP server, in the Model Context Protocol
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
  spec.mcp.tools:
    predicate: skos:related
---

# MCP server, in the Model Context Protocol

An MCP server packages one focused capability, such as a database or an external service, so that any application speaking MCP can use it. It is part of the [Model Context Protocol][spec.mcp] ([MCP2]).

MCP defines servers as "services that provide context and capabilities" ([MCP1]), local processes or remote services. Each offers any of three features to an [MCP client][spec.mcp.client]:

1. **Resources:** context and data, such as files or database schemas, each named by a URI, for the application to include as it chooses ([MCP9]).
2. **Prompts:** templated messages the user selects, often as slash commands ([MCP10]).
3. **[Tools][spec.mcp.tools]:** functions the model can call.

A server should be easy to build and to combine with others. It never reads the whole conversation or sees into another server; where it needs input from the user or the model, it asks for it in its reply ([MCP2]).

[spec.mcp]: ./spec.mcp.md
[spec.mcp.client]: ./spec.mcp.client.md
[spec.mcp.tools]: ./spec.mcp.tools.md
[MCP2]: https://modelcontextprotocol.io/specification/2026-07-28/architecture
[MCP9]: https://modelcontextprotocol.io/specification/2026-07-28/server/resources
[MCP10]: https://modelcontextprotocol.io/specification/2026-07-28/server/prompts
[MCP1]: https://modelcontextprotocol.io/specification/2026-07-28
