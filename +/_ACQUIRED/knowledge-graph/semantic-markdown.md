---
id: semantic-markdown
title: Semantic Markdown
type: authoring-convention
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:represents
  kiri:
    predicate: ki:interpreted-by
  family:
    predicate: ki:candidate-member-of
  rdf:
    predicate: skos:related
  vocabularies:
    predicate: skos:related
  kig:
    predicate: skos:related
  iri:
    predicate: skos:related
  addressing:
    predicate: skos:related
  foundations:
    predicate: skos:related
  territory:
    predicate: skos:related
  atomicity:
    predicate: skos:related
  reasoning:
    predicate: skos:related
---

# Semantic Markdown

Semantic Markdown is the proposed authoring format for the [Knowledge Graph][graph], and one Semantic Markdown file is a card: a coherent, addressable knowledge resource. YAML front matter defines identity and metadata, prose remains human-readable, and ordinary reference-style Markdown links provide navigation. Markdown is chosen over collections of opaque word-processor documents so that the model stays open and inspectable by both people and machines.

A front-matter `links` map associates a reference identifier with an [RDF][rdf] predicate, drawn from the [Semantic Vocabularies][vocabularies], when an explicit semantic assertion is intended. An unannotated link remains navigational and must not acquire an invented predicate. Link definitions appear at the bottom of the document and contain only destinations; the visible, descriptive link text stays in the prose.

For example:

```markdown
---
id: kiri
links:
  kig:
    predicate: ki:exposed-through
---
The [Knowledge Islands Graph (KIG)][kig] provides a CLI.

[kig]: ../../../tools-kig/tools-kig.md
```

A local reference identifier is not a canonical [IRI][iri]; how IRIs map to files and survive relocation is set out under the Knowledge Graph's [Addressing][addressing].

Two optional front-matter conventions, agreed on 3 November 2026, qualify a card. A card may carry `sensitive: true` with `sensitivity: <reason>`, and the mark is weighed whenever someone considers using the card outside its principal or its own island, such as on a project site not managed from there alone; most cards carry neither, and there is no general audience field. A card's `status:`, one of `proposal`, `future-concept` or `agreed`, tells an idea from adopted practice.

[KIRI][kiri] is the proposed semantic engine, with [RDF output][foundations] as a derived serialisation rather than the Markdown authoring language. Candidate standards for comparison include Vault-LD, Enola YAML-LD and typed Markdown link approaches. The exact convention remains experimental; the `ki:` prefix is declared in the [Knowledge Islands][territory] territory card. RDFa was considered but is not native Markdown, and no Markdown-to-RDF standard has been chosen. Established standards and how widely they are used are reviewed before any custom syntax is invented.

## Open questions

- Which established Markdown, linked-data and RDF standards best support human-readable [atomic cards][atomicity], typed relations and source [provenance][reasoning]?
- What is the minimum canonical card schema: stable ID, title, type, author, date, body, links and evidence?
- Should relationships sit in front matter, reference-style links, dedicated sections, Turtle sidecars or a combination? The front-matter `links` map is the current working answer.
- What short Knowledge Islands name should the format have, as a member of the [KI tool family][family]? KISM (Knowledge Islands Semantic Markdown) and KIMD are examples; none has been chosen.

[graph]: ./knowledge-graph.md
[rdf]: ./rdf.md
[iri]: ./iri.md
[vocabularies]: ./semantic-vocabularies.md
[foundations]: ./rdf-foundations.md
[kiri]: ./kiri.md
[territory]: ../../../knowledge-islands.md
[addressing]: ./knowledge-graph.md#addressing
[atomicity]: ./contextual-atomicity.md
[reasoning]: ./semantic-reasoning.md
[family]: ./ki-tool-family.md
