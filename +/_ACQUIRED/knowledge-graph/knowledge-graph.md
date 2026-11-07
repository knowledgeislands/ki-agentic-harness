---
id: knowledge-graph
title: Knowledge Islands Knowledge Graph
type: knowledge-domain
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
attachment: proposed
links:
  kiri:
    predicate: ki:implemented-by
  kig:
    predicate: ki:accessed-through
  tending:
    predicate: skos:related
  progressive-disclosure:
    predicate: ki:uses-principle
  sovereignty:
    predicate: ki:uses-principle
  permeability:
    predicate: ki:uses-principle
  atomicity:
    predicate: ki:uses-principle
  semantic-markdown:
    predicate: ki:uses-convention
  reasoning:
    predicate: ki:requires-semantics
  vocabularies:
    predicate: ki:uses-vocabularies
  views:
    predicate: ki:supports
  rdf-foundations:
    predicate: ki:underpinned-by
  territories:
    predicate: skos:related
  rdf:
    predicate: skos:related
  independence:
    predicate: skos:related
  iri:
    predicate: skos:related
  territory:
    predicate: skos:related
  comprehension:
    predicate: skos:related
  folder:
    predicate: skos:related
  layered:
    predicate: skos:related
---

# Knowledge Islands Knowledge Graph

The Knowledge Islands knowledge graph is a curated Markdown knowledge system with machine-readable semantic relationships. This card represents the knowledge-graph domain: each island curates its own knowledge graph, and this card describes the architecture they share.

[Knowledge Islands RDF Interface (KIRI)][kiri] interprets [semantic Markdown][semantic-markdown] into [RDF][rdf], and [Knowledge Islands Graph (KIG)][kig] exposes the same engine through a command-line interface. [Knowledge Tending][tending], the cycle through which knowledge is acquired, curated and retired, is a related but distinct domain. The graph uses [Progressive Disclosure][progressive-disclosure] to expose coherent summaries before deeper knowledge.

## Governing concepts

The graph respects [Semantic Sovereignty][sovereignty] and [Semantic Permeability][permeability], supports [Contextual Atomicity][atomicity], and distinguishes asserted knowledge from [Semantic Reasoning and Evidence][reasoning]. It uses the proposed Semantic Markdown authoring convention and may reuse established [Semantic Vocabularies][vocabularies]. [Knowledge Views and Projections][views] provide selective presentations without replacing the semantic source. Curated knowledge stands on its own under [Knowledge Independence][independence].

## Progressive enrichment

The graph's goal is to enrich Markdown resources progressively with meaningful, typed links to addressable concepts and entities, while preserving readable prose. Not every noun requires a link immediately: semanticisation is iterative, proportionate and reviewable, and ordinary links remain useful and can be identified later for optional annotation. This is a goal, not a requirement to create excessive cards or implement tooling now.

Knowledge Islands need not be fully RDF compliant from the start: resources are written to be compatible with semantics, and the model is built up over time without losing relationship information. Relationships between cards are graph arcs and count as knowledge in their own right, not just embedded hyperlinks. Whether they appear in the prose or are recorded separately, their type, direction and provenance must stay accessible.

## Addressing

The provisional filesystem convention is `curated/<territory>/<island>/<zone>/<domain>/<resource>.md`, where the zone is the receiving Capital's own, such as `Pillars/`, and an island without zones omits it. In a receiving repository the graph is proposed to live in a top-level [`knowledge/` folder][folder] in place of `Pillars/`, and graphs in different repositories join in layers through attachment points and shadow nodes, as [Layered Graphs][layered] sets out. A domain is represented by a same-named Markdown file inside its directory. [Territorial authority][territories] governs namespaces; the territory's namespace policy and canonical [IRI][iri] bases remain to be specified. An IRI names the thing itself, such as a concept, never the card about it: the card is a same-named Markdown file describing the thing, found through an implicit mapping from the IRI, and the resource's type is the thing's type, not "document". A deterministic form of that mapping from IRI to file path is still to be defined, and resource identity must survive file relocation through stable identifiers or redirects. The `ki:` predicate prefix is declared in the [Knowledge Islands][territory] territory card.

## Interoperability

How [KIRI][kiri] is intended to build [RDF][rdf-foundations] and export it, and what about it is still undecided, is set out in its card.

## Future: a first RDF prototype

The first prototype is planned inside the assistant repository only, with Knowledge Islands' own proposed architecture as its subject, and changes no existing Knowledge Islands repository or tool.

- Generate Turtle and JSON-LD from the cards and inspect them, checking that ordinary links stay visible as navigation without acquiring predicates, and that Turtle and JSON-LD encode the same asserted relationships.
- Compile cards to RDF, query them and render a website from local files, without a running graph database.
- Try out curated namespace conventions, SKOS concept mappings, Dublin Core metadata, provenance and summary freshness on a few cards.
- Test this card as the progressive-disclosure entry point that leads a reader or agent on to KIRI and KIG.
- Measure whether the graph actually helps, as [Measuring Graph Comprehension][comprehension] proposes.

[kiri]: ./kiri.md
[rdf]: ./rdf.md
[iri]: ./iri.md
[kig]: ../../../tools-kig/tools-kig.md
[tending]: ../knowledge-tending/knowledge-tending.md
[progressive-disclosure]: ./progressive-disclosure.md
[sovereignty]: ./semantic-sovereignty.md
[permeability]: ./semantic-permeability.md
[atomicity]: ./contextual-atomicity.md
[semantic-markdown]: ./semantic-markdown.md
[reasoning]: ./semantic-reasoning.md
[vocabularies]: ./semantic-vocabularies.md
[views]: ./knowledge-views.md
[independence]: ../knowledge-tending/knowledge-independence.md
[territory]: ../../../knowledge-islands.md
[rdf-foundations]: ./rdf-foundations.md
[territories]: ./territories-and-islands.md
[comprehension]: ./measuring-graph-comprehension.md
[folder]: ./knowledge-folder.md
[layered]: ./layered-graphs.md
