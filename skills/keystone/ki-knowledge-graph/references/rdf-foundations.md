---
id: rdf-foundations
title: RDF Foundations
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:underpins
  reasoning:
    predicate: skos:related
  vocabularies:
    predicate: skos:related
  territories:
    predicate: skos:related
  rdf:
    predicate: skos:related
  iri:
    predicate: skos:related
  semantic-markdown:
    predicate: skos:related
  addressing:
    predicate: skos:related
  atomicity:
    predicate: skos:related
  kiri:
    predicate: skos:related
---

# RDF Foundations

This card sets out how Knowledge Islands uses [RDF][rdf], the intended semantic backbone of its [Knowledge Graph][graph]. The [RDF 1.2 Primer][primer] was read up to and including chapter 4, through its RDF model, multiple graphs and vocabularies. The Primer explains the concepts; formal RDF specifications define the normative model. RDF 1.2 was still evolving during this discussion, so implementation must verify the status and library support of required features.

## Model and identity

RDF subjects may be [IRIs][iri] or blank nodes, predicates are IRIs, and objects may also be typed or language-tagged literals.

A **blank node** is a genuine but globally unnamed node, suitable for locally described structure. Later curation may give a blank node a global identity, but that never happens automatically. A curated knowledge entity should generally receive a stable, human-comprehensible IRI; temporary UUID-based identifiers are possible but should not require breaking existing references when curated names emerge. Not every literal, date or supporting fact warrants its own [knowledge card][semantic-markdown].

Names are readable, lowercase kebab-case, governed under the naming authority set out in [Territories and Islands][territories]. Check compatibility with existing identifiers before any migration to curated kebab-case IRIs. How IRIs map to files and stay stable when a file moves is set out under the Knowledge Graph's [Addressing][addressing]. A repository URL is not automatically a canonical semantic identifier. IRIs may reflect their territory, but identity must not depend on classifications that can change.

## Multiple graphs

RDF graphs are sets of triples. Datasets can contain named graphs, but a named graph is a technical container, **not automatically an island**. How compound graphs draw from multiple islands or external jurisdictions is set out in [Contextual Atomicity][atomicity]. Territories, islands and federated territories are graph-level entities, as set out in [Territories and Islands][territories].

## Vocabularies and semantics

Candidate vocabularies are set out in [Semantic Vocabularies][vocabularies]. The [Semantic Reasoning and Evidence][reasoning] model covers inference and validation, and separates asserted facts, inference, claim reports, confidence, accuracy and provenance. How RDF 1.2 triple terms and reifiers describe claims is set out there too.

## Representations and querying

Turtle, TriG, N-Triples, N-Quads, JSON-LD, RDF/XML and RDFa are serialisations or embedding approaches rather than the authoring model itself. [Markdown remains the human-authored source][semantic-markdown]. [KIRI][kiri] may construct an RDF graph and serialise it to supported formats; KIG and [MCP][mcp] may expose the same underlying engine. SPARQL querying, OWL inference, SHACL validation, RDF 1.2 reifiers and round-trip tests remain future implementation/evaluation work.

The learning approach is to use the RDF 1.2 Primer as an introduction and consult the [Concepts][rdf-concepts], [What's New][rdf-new], [Turtle][turtle] and [SPARQL][sparql] specifications as needed, rather than requiring all specifications to be read before experimentation.

[graph]: ./knowledge-graph.md
[rdf]: ./rdf.md
[iri]: ./iri.md
[reasoning]: ./semantic-reasoning.md
[vocabularies]: ./semantic-vocabularies.md
[territories]: ./territories-and-islands.md
[addressing]: ./knowledge-graph.md
[atomicity]: ./contextual-atomicity.md
[semantic-markdown]: ./semantic-markdown.md
[kiri]: ./kiri.md
[mcp]: https://modelcontextprotocol.io/
[primer]: https://www.w3.org/TR/rdf12-primer/
[rdf-concepts]: https://www.w3.org/TR/rdf12-concepts/
[rdf-new]: https://www.w3.org/TR/rdf12-new/
[turtle]: https://www.w3.org/TR/rdf12-turtle/
[sparql]: https://www.w3.org/TR/sparql12-query/
