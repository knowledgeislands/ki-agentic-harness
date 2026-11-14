---
id: industry.subagent
title: Subagent
type: term
status: agreed
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, CARD-SUBAGENT (12 November 2026)
links:
  industry.agent:
    predicate: skos:broader
  industry.session:
    predicate: dcterms:isPartOf
---

# Subagent

A subagent lets an agent hand part of its work to another agent under its control and take back the result.

A subagent is an [agent][industry.agent] subordinate to another agent, started by it to do part of its work. It acts wholly within the controlling agent's boundaries and under its control, and returns its result to it. It does not interact with other agents: the controlling agent is the point of interaction. Each subagent works in a thread of its own within the [session][industry.session], beside the controlling agent's primary thread.

Harnesses vary in how they implement subagents, such as whether a subagent may start subagents of its own, and that is not part of the definition. Agent teams and remote agents reached over the Agent2Agent protocol (A2A) are agents in their own right, not subagents.

## Our conventions

The definitions in the KI harness's `subagents/` folder describe roles a subagent takes, such as a reviewer or an explorer; each is run as a subagent of the controlling agent. The `ki-subagents` skill and its bindings say how to run them in a given agent host.

## Next

A [skill][industry.skill] extends an agent harness with knowledge and procedures.

[industry.agent]: ./industry.agent.md
[industry.session]: ./industry.session.md
[industry.skill]: ./industry.skill.md
