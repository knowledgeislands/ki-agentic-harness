---
id: industry.agent-harness
title: Agent harness
type: term
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, CARDS-AGENT (Kris, 12 November 2026)
links:
  industry.model:
    predicate: ki:runs
---

# Agent harness

An agent harness turns a [model][industry.model] into an agent, so that what the model decides is carried out in the world.

It is software that runs the loop: it gives the model its context, carries out the tool calls the model asks for, and feeds the results back until the work is done. It holds the tools, handles the context as it grows, and keeps each run it carries out. The model decides; the harness acts.

Vendor text often writes "harness" for the harness and the agent together; read it as covering both layers unless the text separates them.

## Our conventions

The Knowledge Islands harness, the `ki-agentic-harness` repository of skills, subagents, evals and hooks, is not an agent harness: it runs no loop and calls no model. Under INDUSTRY-FIRST it takes another name, settled after the industry's cards. Until then, write "the KI harness" or name the repository, and never a bare "harness" for it.

## Next

The [agent][industry.agent] is a model working through an agent harness.

[industry.model]: ./industry.model.md
[industry.agent]: ./industry.agent.md
