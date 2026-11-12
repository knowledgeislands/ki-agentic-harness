---
id: semantic-vocabularies
title: Semantic Vocabularies
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  sovereignty:
    predicate: ki:respects-principle
  permeability:
    predicate: ki:enables-principle
  graph:
    predicate: ki:used-by
  rdf:
    predicate: skos:related
  iri:
    predicate: skos:related
  territories:
    predicate: skos:related
  semantic-markdown:
    predicate: skos:related
  reasoning:
    predicate: skos:related
---

# Semantic Vocabularies

[RDF][rdf] predicates and classes use identifiable [IRIs][iri]. An [island][territories] can define its own terms, reuse external vocabularies or explicitly map between them, without requiring all islands to share one ontology. An ontology here is a formal model of a domain's classes, properties and constraints, as expressed in [RDFS][rdfs] and [OWL][owl]; a vocabulary is a lighter set of terms. This supports [Semantic Sovereignty][sovereignty] and [Semantic Permeability][permeability].

## Candidate vocabularies

- **[Dublin Core][dublin-core]** provides reusable metadata terms such as title, creator and date, a candidate for card metadata in [front matter][semantic-markdown].
- **[Schema.org][schema-org]** provides broad vocabulary for describing people, organisations, software and other entities.
- **[SKOS (Simple Knowledge Organization System)][skos]** is particularly relevant to concepts, taxonomies and cross-island mappings. `skos:broader`, `skos:narrower`, `skos:related`, `skos:exactMatch` and `skos:closeMatch` express different kinds of conceptual relationship: broader means neither subclass nor island containment, and close match does not mean identity. SKOS is the first vocabulary to explore, starting with `skos:Concept`.
- **[RDFS][rdfs]** supplies classes, properties, domains and ranges. What domain and range statements do and do not establish is covered in [Semantic Reasoning and Evidence][reasoning].
- **[OWL][owl]** offers richer logical semantics, including inverse properties.
- **[PROV-O][prov-o]** can describe knowledge derivation and provenance.
- **[SHACL][shacl]** is a candidate for validating expected data shapes separately from inference.

These are candidate vocabularies and standards for the [Knowledge Graph][graph], not a commitment to adopt all of them. The minimal `ki:` predicate vocabulary remains to be formally defined and mapped to persistent IRIs, under ki.sop.main's vocabulary work in ki-principal; until then its prefix carries a placeholder address on the Knowledge Islands website, in the Knowledge Islands territory card.

[sovereignty]: ./semantic-sovereignty.md
[rdf]: ./rdf.md
[territories]: ./territories-and-islands.md
[semantic-markdown]: ./semantic-markdown.md
[iri]: ./iri.md
[permeability]: ./semantic-permeability.md
[graph]: ./knowledge-graph.md
[reasoning]: ./semantic-reasoning.md
[dublin-core]: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
[schema-org]: https://schema.org/
[skos]: https://www.w3.org/TR/skos-reference/
[rdfs]: https://www.w3.org/TR/rdf12-schema/
[owl]: https://www.w3.org/TR/owl2-overview/
[prov-o]: https://www.w3.org/TR/prov-o/
[shacl]: https://www.w3.org/TR/shacl/
