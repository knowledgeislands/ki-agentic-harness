---
id: openai.subagent
title: Subagent (OpenAI)
type: vendor-term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
vendor: OpenAI
origin: Cairn summit change 22, CARD-SUBAGENT, and change 06, KG-SUBGRAPHS (12 November 2026)
links:
  industry.subagent:
    predicate: skos:exactMatch
---

# Subagent (OpenAI)

OpenAI says subagent in the industry's sense of a [subagent][industry.subagent]: "A delegated agent that Codex starts to handle a specific task" ([Subagents][o11]). Each works in an agent thread, part of the session ([Thread][openai.thread]).

## Examples

- Codex's built-in agents `default`, `worker` and `explorer` ([Subagents][o11]).
- The `codex agents` command centre, and Ultra mode, which uses subagents ([changelog][o9]).

[industry.subagent]: ../../industry/industry.subagent.md
[openai.thread]: ./openai.thread.md
[o11]: https://learn.chatgpt.com/docs/agent-configuration/subagents
[o9]: https://learn.chatgpt.com/docs/changelog
