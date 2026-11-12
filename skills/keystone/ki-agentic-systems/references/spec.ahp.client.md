---
id: spec.ahp.client
title: Client, in the Agent Host Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.ahp:
    predicate: dcterms:isPartOf
  industry.client:
    predicate: skos:exactMatch
---

# Client, in the Agent Host Protocol

An AHP client lets a person see and drive sessions an agent host owns, from several places at once. It is a role in the [Agent Host Protocol][spec.ahp], in the [client][industry.client] term's sense.

A client connects to an [agent host][spec.ahp.agent-host], agrees a protocol version, and subscribes to the [channels][spec.ahp.channels] it wants to follow, receiving a snapshot of each and then every change in order. It sends commands and dispatches actions, applying its own at once and reconciling when the agent host echoes them back among other clients' ([what is AHP][M8]). After a dropped connection it reconnects and replays what it missed.

Any number of clients may share one session. Any of them may approve a tool call or cancel a turn, and the agent host accepts the first ([AHP and ACP][AHP1]).

AHP names IDEs, web apps and CLIs as clients; VS Code, AHPX and ahpc are among them, with official client libraries in Rust, TypeScript, Kotlin, Swift and Go ([implementations][M12]).

[spec.ahp]: ./spec.ahp.md
[industry.client]: ./industry.client.md
[spec.ahp.agent-host]: ./spec.ahp.agent-host.md
[spec.ahp.channels]: ./spec.ahp.channels.md
[M8]: https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html
[M12]: https://microsoft.github.io/agent-host-protocol/guide/implementations.html
[AHP1]: https://microsoft.github.io/agent-host-protocol/guide/ahp-and-acp.html
