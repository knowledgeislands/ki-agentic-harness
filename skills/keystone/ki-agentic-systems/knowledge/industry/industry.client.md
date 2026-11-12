---
id: industry.client
title: Client
type: term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, CARD-CLIENT a) (Kris, 12 November 2026)
links:
  industry.agent-host:
    predicate: skos:related
  industry.session:
    predicate: skos:related
---

# Client

A client lets you see and drive a [session][industry.session] wherever you are, without the session living there.

A client is a window onto a session an [agent host][industry.agent-host] owns: it displays the session and sends your requests. One session can have several clients, and closing one does not end the session. One program can be both an agent host and its own client.

Examples: the Orca app, attached to its own runtime or a remote one; a terminal; Claude Desktop's window; a web page; a phone, through Remote Control or Orca's mobile pairing.

Anthropic says "surface", covering agent host and client together; OpenAI, Google for its CLI, and Microsoft say client. The Agent Client Protocol's and MCP's other senses of "client" belong on those specifications' cards, `spec.acp` and `spec.mcp`, pending.

## Next

The channel card, still to come.

[industry.session]: ./industry.session.md
[industry.agent-host]: ./industry.agent-host.md
