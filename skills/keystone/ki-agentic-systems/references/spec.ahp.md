---
id: spec.ahp
title: Agent Host Protocol (AHP)
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.ahp.agent-host:
    predicate: dcterms:hasPart
  spec.ahp.client:
    predicate: dcterms:hasPart
  spec.ahp.session:
    predicate: dcterms:hasPart
  spec.ahp.channels:
    predicate: dcterms:hasPart
  spec.acp:
    predicate: skos:related
---

# Agent Host Protocol (AHP)

The Agent Host Protocol lets several clients share the same agent sessions, each seeing the same live state, whatever agent runs behind them ([what is AHP][M8]).

It defines how an [agent host][spec.ahp.agent-host], which it calls a portable, standalone sessions server, talks to its [clients][spec.ahp.client]. The agent host holds the authoritative state of each [session and its chats][spec.ahp.session]; clients subscribe to it through [channels][spec.ahp.channels] and change it only by actions the agent host puts in order. Messages are JSON-RPC 2.0 over any reliable, ordered, two-way transport, most often WebSocket, and versions are negotiated when a client connects ([overview][M11], [transport][AHP6]).

AHP fixes how state is shared, not how an agent works. Below the agent host an agent is reached through its own interface, such as the [Agent Client Protocol][spec.acp]: AHP calls itself the coordination layer and ACP the communication layer ([AHP and ACP][AHP1]). Agents talking to each other are outside it.

Microsoft publishes it. Specification 1.0.0, of 2 October 2026, was the latest release on 12 November 2026 ([release][AHP7]); its Root, Session, Chat, Terminal, Telemetry and Resource watch channels are Stable, the others not yet ([versioning][AHP9]). VS Code's agent host is the reference server ([implementations][M12]).

[spec.ahp.agent-host]: ./spec.ahp.agent-host.md
[spec.ahp.client]: ./spec.ahp.client.md
[spec.ahp.session]: ./spec.ahp.session.md
[spec.ahp.channels]: ./spec.ahp.channels.md
[M8]: https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html
[M11]: https://microsoft.github.io/agent-host-protocol/specification/overview.html
[M12]: https://microsoft.github.io/agent-host-protocol/guide/implementations.html
[AHP1]: https://microsoft.github.io/agent-host-protocol/guide/ahp-and-acp.html
[AHP6]: https://microsoft.github.io/agent-host-protocol/specification/transport.html
[AHP7]: https://github.com/microsoft/agent-host-protocol/releases/tag/spec%2Fv1.0.0
[AHP9]: https://microsoft.github.io/agent-host-protocol/specification/versioning.html
