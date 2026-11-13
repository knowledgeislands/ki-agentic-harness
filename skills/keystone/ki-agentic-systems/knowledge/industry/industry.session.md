---
id: industry.session
title: Session
type: term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, CARD-SESSION and SESSION-THREADS (12 November 2026)
links:
  industry.agent:
    predicate: ki:run-of
  industry.agent-harness:
    predicate: ki:run-by
---

# Session

A session keeps one run of an agent together, its context, its record and its place, so the work can be followed and resumed.

A session is one run of an [agent][industry.agent]: a conversation with its own context, its own id and the folder it works in. It is made of **turns**, each a request and the agent's work on it. The [agent harness][industry.agent-harness] runs the session and keeps its **transcript**, the record of every turn, so the session can be resumed later with its context intact.

A session is also made of **threads**. The agent's own line of work is its **primary thread**, and each [subagent][industry.subagent] it starts works in a thread of its own within the session. A thread is a part of a session, never another word for one.

## Specifications

- **Agent Client Protocol (ACP):** its session. Pending: the ACP specification card, `spec.acp`.
- **Agent Host Protocol (AHP):** its session and the chats inside it. Pending: the AHP specification card, `spec.ahp`.

## Our conventions

The Knowledge Islands system already says session in this sense, as in the `ki-acquire` skill's agent-session acquisition and the housekeeping skills' session inventories, and has no convention of its own to map onto it.

## Next

A [subagent][industry.subagent] is an agent started by another agent to do part of its work, in a thread of its own.

[industry.agent]: ./industry.agent.md
[industry.agent-harness]: ./industry.agent-harness.md
[industry.subagent]: ./industry.subagent.md
