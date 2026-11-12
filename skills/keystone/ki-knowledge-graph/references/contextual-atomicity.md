---
id: contextual-atomicity
title: Contextual Atomicity and Recursive Graph Composition
type: principle
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  disclosure:
    predicate: ki:supports
  graph:
    predicate: ki:applies-to
  atomic-design:
    predicate: skos:related
  zettelkasten:
    predicate: skos:related
  territories:
    predicate: skos:related
  semantic-markdown:
    predicate: skos:related
  views:
    predicate: skos:related
---

# Contextual Atomicity and Recursive Graph Composition

The right granularity of knowledge depends on context: a [card][semantic-markdown] should stay coherent for its reader rather than splitting every fact into its own resource. Kris proposed this as atomic knowledge, drawing on [Zettelkasten][zettelkasten] and, by loose analogy only, on [Atomic Design][atomic-design]. A quote can be one atomic card even though its words are not meaningful units there; a word can be an atomic concept in a linguistic island; a galaxy can be a meaningful unit when the subject is the universe.

Within the [Knowledge Graph][graph], a compound graph can itself be treated as one addressable entity when referenced by a higher-level graph. Choosing the unit that is atomic for its context, from a quote to a compound graph, is **contextual atomicity**. Compound graphs may recursively compose other graphs, including graphs in other [jurisdictions][territories], without duplicating them, changing ownership or endorsing their assertions.

A summary or index can stand as the entry point for [Progressive Disclosure][disclosure]; how a derived view keeps its sources, boundaries and provenance and detects staleness is set out in [Knowledge Views and Projections][views].

[disclosure]: ./progressive-disclosure.md
[graph]: ./knowledge-graph.md
[views]: ./knowledge-views.md
[atomic-design]: ./atomic-design.md
[zettelkasten]: ./zettelkasten.md
[territories]: ./territories-and-islands.md
[semantic-markdown]: ./semantic-markdown.md
