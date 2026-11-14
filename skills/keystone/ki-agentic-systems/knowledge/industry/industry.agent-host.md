---
id: industry.agent-host
title: Agent host
type: term
status: agreed
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 22, CARD-AGENT-HOST a) (12 November 2026)
links:
  industry.agent-harness:
    predicate: ki:runs
  industry.session:
    predicate: skos:related
  industry.environment:
    predicate: skos:related
---

# Agent host

An agent host lets [sessions][industry.session] outlive, and be shared across, the windows used to see them.

An agent host is the application or process, running in an [environment][industry.environment], that runs [agent harnesses][industry.agent-harness] and owns their sessions, independently of the clients that display them. The definition is the Agent Host Protocol's (`spec.ahp`, pending) ([M11]).

Examples: Orca, Claude Desktop, the ChatGPT desktop app, the Antigravity app and VS Code's Agent Host ([M12]). A harness run by itself, such as Claude Code or Codex in a terminal, is its own agent host and client in one process.

The leaders have no formal word: Anthropic's "surface" covers agent host and client together, and OpenAI's "host" is the machine.

## Our conventions

On terra, Orca's runtime lives inside the Orca app; `orca serve` runs the same runtime headless, as on sol.

## Next

A [client][industry.client] is a window onto a session an agent host owns.

[industry.session]: ./industry.session.md
[industry.environment]: ./industry.environment.md
[industry.agent-harness]: ./industry.agent-harness.md
[industry.client]: ./industry.client.md
[M11]: https://microsoft.github.io/agent-host-protocol/specification/overview.html
[M12]: https://microsoft.github.io/agent-host-protocol/guide/implementations.html
