---
id: semantic-permeability
title: Semantic Permeability
type: principle
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  sovereignty:
    predicate: skos:related
  graph:
    predicate: ki:applies-to
  vocabularies:
    predicate: skos:related
  reasoning:
    predicate: skos:related
  atomicity:
    predicate: skos:related
  territories:
    predicate: skos:related
  datasets:
    predicate: skos:related
---

# Semantic Permeability

Knowledge systems can selectively relate, translate and exchange their concepts without requiring one universal ontology, and without silently merging interpretations or transferring authority. [Semantic Sovereignty][sovereignty] preserves local meaning while permeability makes explicit interoperability possible.

Cross-island mappings may use [SKOS][vocabularies] mapping properties such as `skos:exactMatch`, `skos:closeMatch` and `skos:related`. Similarity is not necessarily identity. Mapping assertions should preserve [authorship, evidence][reasoning] and disagreement, rather than silently equating resources.

The [Knowledge Graph][graph] can [compose knowledge across][atomicity] [independently governed territories][territories], including external systems such as Wikidata, without confusing external assertions with locally endorsed facts. Composing with systems such as Wikidata needs retrieval, query and composition mechanisms, not just an [RDF dataset][datasets].

[sovereignty]: ./semantic-sovereignty.md
[graph]: ./knowledge-graph.md
[territories]: ./territories-and-islands.md
[vocabularies]: ./semantic-vocabularies.md
[reasoning]: ./semantic-reasoning.md
[atomicity]: ./contextual-atomicity.md
[datasets]: ./rdf-foundations.md
