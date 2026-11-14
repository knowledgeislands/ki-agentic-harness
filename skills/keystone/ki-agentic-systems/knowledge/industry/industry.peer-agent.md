---
id: industry.peer-agent
title: Peer agent
type: term
status: proposal
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, AGENT-KINDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  industry.agent:
    predicate: skos:broader
  industry.subagent:
    predicate: skos:related
  anthropic.agent-team:
    predicate: skos:related
---

# Peer agent

A peer agent lets agents share work as equals, each running its own session and passing findings to the others, where no one agent could hold the whole.

A peer agent is an [agent][industry.agent] in its own [session][industry.session] that works beside other agents in the same system, neither controlling nor controlled by them, and exchanges messages with them. Unlike a [subagent][industry.subagent], it is not started to do part of another agent's work and it does not return its result to one agent; each peer keeps its own boundaries and permissions, and a message from a peer is never the user's consent.

## What the industry says

No standard defines the word; "peer" is descriptive everywhere, which is why this card is a proposal. Anthropic's [agent team][anthropic.agent-team] is the clearest case: teammates are "separate Claude Code instances", each "a full, independent Claude Code session", who "communicate directly with each other" through a mailbox, under a team lead who coordinates but does not contain them ([agent teams][a9]). Anthropic's cross-session messaging gives sessions outside a team the same ability, and names each session's inbox its "Peer address" ([cross-session messaging][a8]). Google's Agent Development Kit speaks of an agent's "peer agents" in a parallel workflow ([ADK collaborative workflows][g9]). OpenAI's handoff, where one agent passes control of a conversation to another, is related but not the same: control moves, it is not shared.

Alternatives for the word: **teammate**, Anthropic's, which presumes a team and a lead; or no card, leaving **agent** with a qualifier in prose.

## Our conventions

Sessions on different rigs, each in its own package and passing notes through Cairn, are peer agents in this sense.

[industry.agent]: ./industry.agent.md
[industry.session]: ./industry.session.md
[industry.subagent]: ./industry.subagent.md
[anthropic.agent-team]: ../vendors/anthropic/anthropic.agent-team.md
[a9]: https://code.claude.com/docs/en/agent-teams
[a8]: https://code.claude.com/docs/en/cross-session-messaging
[g9]: https://adk.dev/workflows/collaboration/
