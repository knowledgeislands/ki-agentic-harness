---
id: kiri
title: KIRI
type: software-component
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  kig:
    predicate: ki:exposed-through
  knowledge-graph:
    predicate: ki:implements
  semantic-markdown:
    predicate: ki:interprets
  reasoning:
    predicate: ki:provides-capability
  family:
    predicate: ki:member-of
  rdf:
    predicate: skos:related
  representations:
    predicate: skos:related
---

# KIRI — Knowledge Islands RDF Interface

KIRI is the proposed semantic engine: the library underneath that [Knowledge Islands Graph (KIG)][kig] and an MCP server use. It resolves [Markdown resource identities and typed relationships][semantic-markdown], constructs [RDF][rdf] graphs and exports [supported serialisations][representations]. It keeps inferred statements distinguishable from asserted ones, as [Semantic Reasoning and Evidence][reasoning] sets out.

KIG is the proposed CLI interface to it. KIRI implements the [Knowledge Graph][knowledge-graph] capability and is the engine of the [KI tool family][family].

## Naming

**KIRI** currently expands to **Knowledge Islands RDF Interface**. Its name has evocative linguistic associations: Māori _kiri_ (skin or bark), Japanese _kiri_ (桐, paulownia tree; 霧, mist), and Indonesian _kiri_ (left). These are associations, not technical etymologies or claims that the name derives from those languages.

## Interoperability

KIRI is intended to build RDF and export supported formats such as Turtle and JSON-LD. The engine and conversion tooling are not yet implemented. Which parser and RDF library KIRI uses is still to be decided, after checking their support for the RDF 1.2 features it needs.

## Open questions

- What does the final "I" in KIRI stand for? KIRI is the library underneath KIG and MCP rather than an interface itself, so Interface, Indexer and Inference are candidates; this is still to be decided.

[kig]: ../../../tools-kig/tools-kig.md
[rdf]: ./rdf.md
[semantic-markdown]: ./semantic-markdown.md
[representations]: ./rdf-foundations.md#representations-and-querying
[reasoning]: ./semantic-reasoning.md
[knowledge-graph]: ./knowledge-graph.md
[family]: ./ki-tool-family.md
