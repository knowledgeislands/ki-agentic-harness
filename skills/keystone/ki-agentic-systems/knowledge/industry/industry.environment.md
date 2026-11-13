---
id: industry.environment
title: Environment
type: term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, ENVIRONMENT a) (12 November 2026)
links:
  industry.machine:
    predicate: dcterms:isPartOf
  industry.agent:
    predicate: skos:related
---

# Environment

An environment gives an [agent's][industry.agent] work somewhere to run: the files, tools, access and limits it works with.

An environment is where the work actually runs: a whole [machine][industry.machine], physical or virtual, or a limited space inside one, such as a container or a sandbox. Its kind is a value, not a card of its own:

- **Local:** the machine you are at.
- **Remote:** another machine you reach and can identify.
- **Cloud:** provided by a vendor, on machines you cannot identify, as Claude Code on the web and Codex Cloud run.

A card may describe things from the machine or from the environment, whichever reads better; "host environment" is not used (HOST-SENSES).

## Our conventions

Orca pairs one machine with another as an "environment", over a websocket: terra paired with sol is a remote environment in this sense.

## Next

A [machine][industry.machine] is the computer an environment runs on.

[industry.agent]: ./industry.agent.md
[industry.machine]: ./industry.machine.md
