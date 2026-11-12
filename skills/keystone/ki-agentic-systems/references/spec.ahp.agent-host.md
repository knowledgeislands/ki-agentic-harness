---
id: spec.ahp.agent-host
title: Agent host, in the Agent Host Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.ahp:
    predicate: dcterms:isPartOf
  industry.agent-host:
    predicate: skos:exactMatch
  spec.acp:
    predicate: skos:related
---

# Agent host, in the Agent Host Protocol

The agent host lets sessions live apart from the windows that show them: it owns them, so clients can come and go. It is the server's role in the [Agent Host Protocol][spec.ahp], and the source of the [agent host][industry.agent-host] term.

AHP describes it as a portable, standalone sessions server ([what is AHP][M8]); its pages call it the server, the host and the agent host alike. It owns the authoritative state of every channel, puts every change in order and sends it to each subscribed client, and where clients conflict it settles the outcome ([doctrine][AHP2]). It publishes the agents and models it offers, and creates and disposes of sessions.

It wraps an [agent harness][industry.agent-harness]: its job is to turn whatever the harness exposes into AHP state ([MCP servers][AHP8]). Towards its agents it may speak another protocol, such as the [Agent Client Protocol][spec.acp], translating between the two ([AHP and ACP][AHP1]).

[spec.ahp]: ./spec.ahp.md
[industry.agent-host]: ./industry.agent-host.md
[industry.agent-harness]: ./industry.agent-harness.md
[spec.acp]: ./spec.acp.md
[M8]: https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html
[AHP1]: https://microsoft.github.io/agent-host-protocol/guide/ahp-and-acp.html
[AHP2]: https://microsoft.github.io/agent-host-protocol/guide/doctrine.html
[AHP8]: https://microsoft.github.io/agent-host-protocol/guide/mcp.html
