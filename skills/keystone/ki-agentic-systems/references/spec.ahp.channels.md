---
id: spec.ahp.channels
title: Channels and subscriptions, in the Agent Host Protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for Kris's review (12 November 2026)
links:
  spec.ahp:
    predicate: dcterms:isPartOf
---

# Channels and subscriptions, in the Agent Host Protocol

Channels keep every client of an agent host in step, so each sees the same state and can recover it after a break. They are the core of the [Agent Host Protocol][spec.ahp] ([what is AHP][M8]).

A channel is a sequence of messages identified by a URI, with a state of its own: the root catalogue, `ahp-root://`, and each session, chat, terminal and changeset, among others ([channels and subscriptions][AHP3]). A [client][spec.ahp.client] subscribes to a channel and receives a snapshot of its state, then the actions that change it, numbered in order by the [agent host][spec.ahp.agent-host], and notifications for events the state does not keep. Actions are the only way state changes, applied by pure functions that run alike on both sides. Every message names its channel, so it can be routed by method and channel alone. The list of sessions is fetched on request rather than subscribed to.

An AHP channel carries the state of one resource to its subscribers; it is not a route between sessions or between systems, the sense the pending channel card, `industry.channel`, is settling.

[spec.ahp]: ./spec.ahp.md
[spec.ahp.client]: ./spec.ahp.client.md
[spec.ahp.agent-host]: ./spec.ahp.agent-host.md
[M8]: https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html
[AHP3]: https://microsoft.github.io/agent-host-protocol/specification/subscriptions.html
