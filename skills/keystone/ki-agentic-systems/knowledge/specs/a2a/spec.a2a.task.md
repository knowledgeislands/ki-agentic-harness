---
id: spec.a2a.task
title: Task, in the Agent2Agent protocol
type: specification
status: proposal
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, SPEC-CARDS, drafted as a proposal for the owner's review (12 November 2026)
links:
  spec.a2a:
    predicate: dcterms:isPartOf
  industry.session:
    predicate: skos:relatedMatch
---

# Task, in the Agent2Agent protocol

A2A's task lets a client follow work it has handed to a remote agent, however long it takes, through to its result. It is part of the [Agent2Agent protocol][spec.a2a].

A task is "the fundamental unit of work managed by A2A, identified by a unique ID" ([specification][A2A1]). A [remote agent][spec.a2a.remote-agent] answers a message with a message when it can reply at once, or with a task for longer work. A task moves through states: submitted and working; interrupted while it needs input or authentication; and finally completed, failed, cancelled or rejected. A finished task never restarts: a follow-up starts a new task in the same context ([life of a task][A2A3]). Its outputs are artifacts. A context, `contextId`, groups related tasks and messages, which the specification says should be treated as one conversational session.

This graph keeps "task" off its term cards, because vendors use it for a session, for delegated work and for scheduled work. A2A's task is delegated work, as the remote agent holds it. Its context comes nearest to a [session][industry.session], though what the remote agent keeps across a context is up to it.

[spec.a2a]: ./spec.a2a.md
[spec.a2a.remote-agent]: ./spec.a2a.remote-agent.md
[industry.session]: ../../industry/industry.session.md
[A2A1]: https://a2a-protocol.org/latest/specification/
[A2A3]: https://a2a-protocol.org/latest/topics/life-of-a-task/
