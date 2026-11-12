---
id: diagram.agentic-terms-by-example
title: Agentic terms by example
type: resource
status: agreed
territory: knowledge-islands
island: ki-agentic-harness
origin: Cairn summit change 22, DIAGRAM-RESOURCE (Kris, 12 November 2026)
links:
  industry.machine:
    predicate: dcterms:subject
  industry.environment:
    predicate: dcterms:subject
  industry.agent-host:
    predicate: dcterms:subject
  industry.agent:
    predicate: dcterms:subject
  industry.session:
    predicate: dcterms:subject
  industry.subagent:
    predicate: dcterms:subject
  industry.client:
    predicate: dcterms:subject
---

# Agentic terms by example

An instance diagram that shows how the terms nest, with real examples: [machines][industry.machine] give [environments][industry.environment], local, remote and cloud; [agent hosts][industry.agent-host] run [agents][industry.agent]; each agent runs a [session][industry.session], with [subagent][industry.subagent] threads inside it; and [clients][industry.client] view the agent hosts.

- **Figure:** [agentic-terms-by-example.svg][svg], with the [interactive viewer][html].
- **Source and regeneration:** [its Archify source][src] and its table in the harness's [diagram manifest][manifest], which holds the question it answers, what it is traced from, when it goes stale and how to regenerate it.

sol's session and the cloud row are illustrative.

[industry.machine]: ../industry/industry.machine.md
[industry.environment]: ../industry/industry.environment.md
[industry.agent-host]: ../industry/industry.agent-host.md
[industry.agent]: ../industry/industry.agent.md
[industry.session]: ../industry/industry.session.md
[industry.subagent]: ../industry/industry.subagent.md
[industry.client]: ../industry/industry.client.md
[svg]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-terms-by-example.svg
[html]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-terms-by-example.html
[src]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/agentic-terms-by-example.architecture.json
[manifest]: https://github.com/knowledgeislands/ki-agentic-harness/blob/main/docs/diagrams/diagrams.toml
