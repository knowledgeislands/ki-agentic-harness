---
id: openai.thread
title: Thread (OpenAI)
type: vendor-term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
vendor: OpenAI
origin: Cairn summit change 22, CARD-SESSION and SESSION-THREADS, and change 06, KG-SUBGRAPHS (Kris, 12 November 2026)
links:
  industry.session:
    predicate: skos:relatedMatch
---

# Thread (OpenAI)

In the Codex App Server, a [session][industry.session] is a top-level thread, made of turns, themselves made of items, and each subagent works in an agent thread of its own ([App Server][o4], [Subagents][o11]). The top-level thread is the session's primary thread and an agent thread is a [subagent's][industry.subagent] thread: each is a part of a session, not another word for one, so the match is related rather than close.

[industry.session]: ./industry.session.md
[industry.subagent]: ./industry.subagent.md
[o4]: https://learn.chatgpt.com/docs/app-server
[o11]: https://learn.chatgpt.com/docs/agent-configuration/subagents
