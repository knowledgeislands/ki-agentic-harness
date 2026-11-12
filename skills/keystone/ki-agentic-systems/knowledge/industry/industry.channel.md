---
id: industry.channel
title: Channel
type: term
status: proposal
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, CARD-CHANNEL a, on Kris's word for high-confidence recommendations; wording a proposal for Kris's review (12 November 2026)
links:
  industry.session:
    predicate: skos:related
  industry.client:
    predicate: skos:related
  spec.mcp:
    predicate: dcterms:conformsTo
  spec.ahp.channels:
    predicate: skos:related
---

# Channel

A channel lets something outside an agent's session reach it while it runs, so the agent can react to events that happen while nobody is watching.

Option A of CARD-CHANNEL was taken on Kris's word for every high-confidence recommendation (12 November 2026): the industry's words only. The card stays a proposal until its wording is agreed.

## What the industry says

Anthropic, who lead (LEADERS), define the word: "A channel is an MCP server that pushes events into your running Claude Code session", which may be two-way, the agent replying through it "like a chat bridge"; Telegram, Discord and iMessage are the first, and channels are a research preview ([Claude Code channels][a7]). Anthropic set it apart from three neighbours on the same page:

- **An integration** starts a new session from an outside system, as Claude in Slack does from a mention; a channel reaches the session already open.
- **A standard [MCP server][spec.mcp]** is queried by the agent; "nothing is pushed to the session".
- **Remote Control** lets you drive your own session from elsewhere, which is a [client][industry.client], not a channel.

Sessions messaging one another are a fourth thing, which Anthropic call **cross-session messaging**: one session writes a plain-text message to another, found through its "Peer address" ([cross-session messaging][a8]). OpenAI's nearest words are triggers for scheduled tasks and integrations such as Linear and Slack, each starting work rather than reaching a running session. Microsoft's Copilot Studio uses "channel" for where an agent is published, such as Teams or a website, a different sense. The [Agent Host Protocol's channels][spec.ahp.channels] are a third sense again: a subscription to one resource's state. "Agentic channel" is used only in commerce, for a sales channel served by agents.

## The decision and the option set aside

- **A, the industry's words only, taken.** This card takes Anthropic's sense: a channel pushes events from outside into a running [session][industry.session]. Cards to follow: an integration, which starts a new session, and session-to-session messaging, named from Anthropic's cross-session messaging, all three under a broader card for the ways into a session. Microsoft's and AHP's senses go on their own cards.
- **B, our own qualified labels, set aside.** The system would have kept "agentic channel" for every route into or between sessions, in a subgraph of its own, at the cost of a word the industry does not use.

## Our conventions

Cairn's messages between sessions on Kris's rigs, sent through the Agora MCP, are session-to-session messaging under option A, not channels; a Cairn notice pushed into a running session would be a channel.

[industry.session]: ./industry.session.md
[industry.client]: ./industry.client.md
[spec.mcp]: ../specs/mcp/spec.mcp.md
[spec.ahp.channels]: ../specs/ahp/spec.ahp.channels.md
[a7]: https://code.claude.com/docs/en/channels
[a8]: https://code.claude.com/docs/en/cross-session-messaging
