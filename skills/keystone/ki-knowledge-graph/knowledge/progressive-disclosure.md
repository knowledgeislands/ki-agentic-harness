---
id: progressive-disclosure
title: Progressive Disclosure
type: principle
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  knowledge-graph:
    predicate: ki:used-by
  kiri:
    predicate: ki:enabled-by
  semantic-markdown:
    predicate: skos:related
  atomicity:
    predicate: skos:related
  views:
    predicate: skos:related
---

# Progressive Disclosure

Progressive disclosure presents a small, coherent entry point to knowledge first, and reveals further detail only when it is needed. For example, the universe can be understood at the level of galaxies without first expanding everything inside each galaxy.

In Knowledge Islands, a compound graph may be addressed and summarised as one [knowledge resource][semantic-markdown], under [Contextual Atomicity][atomicity], then expanded into its constituent resources and relationships. This avoids loading an entire graph into an agent's context unnecessarily.

[Agent Skills][agent-skills] use a comparable pattern: lightweight discovery metadata, instructions loaded when relevant, and supporting resources retrieved on demand. Knowledge Islands applies the principle to connected knowledge rather than only procedural instructions.

## Intended behaviour

The [Knowledge Graph][knowledge-graph] should support summary-level access and deeper inspection through [Knowledge Islands RDF Interface (KIRI)][kiri], with KIG and [MCP][mcp] interfaces able to request an appropriate disclosure level. Disclosure level and graph traversal depth are distinct: more graph hops do not necessarily imply more useful detail.

Derived summaries should preserve traceability to the knowledge they summarise; how their freshness is checked is set out in [Knowledge Views and Projections][views].

This is an agreed design principle, not an implemented KIRI feature.

[knowledge-graph]: ./knowledge-graph.md
[kiri]: ./kiri.md
[views]: ./knowledge-views.md
[atomicity]: ./contextual-atomicity.md
[mcp]: https://modelcontextprotocol.io/
[agent-skills]: https://agentskills.io/
[semantic-markdown]: ./semantic-markdown.md
