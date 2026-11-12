---
id: knowledge-views
title: Knowledge Views and Projections
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:derived-from
  disclosure:
    predicate: ki:supports
  atomicity:
    predicate: ki:uses-principle
  moc:
    predicate: skos:related
  territories:
    predicate: skos:related
  semantic-markdown:
    predicate: skos:related
  reasoning:
    predicate: skos:related
  vocabularies:
    predicate: skos:related
  named-graphs:
    predicate: skos:related
  rdf:
    predicate: skos:related
---

# Knowledge Views and Projections

The enduring [Knowledge Graph][graph] is distinct from its acquisition inputs and its presentation projections. An [island][territories] may project the same knowledge into websites, documents, visualisations, or agent-facing views without replacing the semantic source with a flattened copy.

## Acquisition, representation and presentation

The three conceptual layers are acquisition (incoming material in any form), semantic representation (enduring meaning and relationships), and presentation (derived views). This is broader than [CQRS][cqrs], which specifically separates command/write and query/read models. The authoring and viewing tools should remain independent: the knowledge model must not depend on Obsidian or another editor. [Markdown's legibility][semantic-markdown], Git portability and inspectability are deliberate design choices.

## Data, information and presentation

Kris framed the same separation on 2 November 2026 as data, information and presentation: capture the data in one place, then decide separately what to show and how the data becomes information. Data is the canonical files, information is what the graph and its [maps of content][moc] make of them, and presentation is a view such as a viewer page. The proposed change-log graph is a first application of this framing.

## Context and composition

A view may select a coherent subset of graph resources and relationships, expose a summary as a single entry point, and reveal details progressively. [Contextual Atomicity][atomicity] allows the summary to stand as one resource when consumed by a higher-level graph. [Progressive Disclosure][disclosure] governs how much detail a consumer receives.

A view should record its scope, source membership, relevant versions and relationship dependencies. A deterministic fingerprint may detect stale views; detecting invalidation and rebuilding are separate operations. Avoid cascading invalidation where changes lie outside the view's defined boundary. A first prototype of derived summaries and version-based invalidation is future work.

## Semantic preservation

Rendering knowledge for human consumption must not silently discard typed relationships, attribution, direction, uncertainty or [provenance][reasoning]. A presentation may omit detail for readability, but the underlying knowledge remains recoverable. The graph should be rebuildable from canonical knowledge resources without requiring a permanently running graph database.

These are architectural principles and hypotheses; no materialised-view implementation is claimed.

## Open questions

- How should a curated view or cache node represent its source graph, scope, version and derivation?
- [PROV-O][vocabularies], [named graphs][named-graphs] and [RDF][rdf] queries are candidate ways to describe derived summaries and version-aware views; none has been chosen.
- How can projection or round-tripping be tested so that it never silently drops typed relationships or provenance?
- Should views be persisted or assembled on demand?

[graph]: ./knowledge-graph.md
[rdf]: ./rdf.md
[semantic-markdown]: ./semantic-markdown.md
[cqrs]: https://martinfowler.com/bliki/CQRS.html
[vocabularies]: ./semantic-vocabularies.md
[named-graphs]: ./rdf-foundations.md
[disclosure]: ./progressive-disclosure.md
[atomicity]: ./contextual-atomicity.md
[reasoning]: ./semantic-reasoning.md
[territories]: ./territories-and-islands.md
[moc]: ./map-of-content.md
