---
id: industry.remote-agent
title: Remote agent
type: term
status: proposal
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, AGENT-KINDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  industry.agent:
    predicate: skos:broader
  spec.a2a.remote-agent:
    predicate: skos:exactMatch
  industry.subagent:
    predicate: skos:related
  google.remote-subagent:
    predicate: skos:related
---

# Remote agent

A remote agent lets an agent use another system's agent as a service, asking it for work and getting results back without knowing or controlling how that system works.

A remote agent is an [agent][industry.agent], or a system of agents, in another system, which a client agent reaches over a protocol and which stays opaque to it: its memory, tools and inner agents are hidden. The word and its sense are the [Agent2Agent protocol's remote agent][spec.a2a.remote-agent], the A2A server ([A2A specification][A2A1]). It is not a [subagent][industry.subagent], since it is independent of the agent that asks it, even where a vendor calls it one, as Google's [remote subagent][google.remote-subagent] does.

## What the industry says

A2A defines the term; Google's Agent Development Kit and Gemini CLI use it for agents reached over A2A, Gemini CLI as "remote subagents". Anthropic and OpenAI have no word of their own for it yet.

## Our conventions

No Knowledge Islands system offers or reach a remote agent today; a session on another rig is a peer agent, not a remote agent, because it is in the same system.

[industry.agent]: ./industry.agent.md
[industry.subagent]: ./industry.subagent.md
[spec.a2a.remote-agent]: ../specs/a2a/spec.a2a.remote-agent.md
[google.remote-subagent]: ../vendors/google/google.remote-subagent.md
[A2A1]: https://a2a-protocol.org/latest/specification/
