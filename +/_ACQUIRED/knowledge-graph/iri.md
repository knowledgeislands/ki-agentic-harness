---
id: iri
title: IRI
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  rdf:
    predicate: skos:related
  foundations:
    predicate: skos:related
  addressing:
    predicate: skos:related
---

# IRI

An [IRI][iri-concepts], or Internationalised Resource Identifier, is the global identifier [RDF][rdf] gives a resource or a relationship. It looks like a web address but need not resolve to anything retrievable. IRIs generalise URIs to support international characters.

In Knowledge Islands an IRI names the thing itself, never the card that describes it, and the resource's type is the thing's type, not "document".

How Knowledge Islands names curated entities is set out in [RDF Foundations][foundations], and how its IRIs map to files and stay stable when a file moves is set out under the Knowledge Graph's [Addressing][addressing].

[iri-concepts]: https://www.w3.org/TR/rdf12-concepts/#section-IRIs
[rdf]: ./rdf.md
[foundations]: ./rdf-foundations.md
[addressing]: ./knowledge-graph.md#addressing
