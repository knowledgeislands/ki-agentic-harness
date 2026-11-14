---
id: ki-knowledge-graph
title: The knowledge-graph method's own graph
type: graph
status: agreed
territory: knowledge-islands
island: ki-agent-backpack
origin: Cairn summit change 06, KG-SELF and KG-HOME a) (Kris, 12 November 2026)
---

# The knowledge-graph method's own graph

This graph holds the concepts the knowledge-graph standard relies on, so the standard follows its cards rather than restating them (KG-SELF): what a card is, how cards and graphs are addressed and layered, the vocabularies their links draw on, and the principles a graph keeps. It is the first graph to define itself in a root definition. A reader starts from the [knowledge graph][knowledge-graph], then [Semantic Markdown][semantic-markdown], the card format, and [layered graphs][layered-graphs].

## Card types

| Type | What a card of this type is about | Further properties required |
| --- | --- | --- |
| `graph` | A graph's root definition: this card | None |
| `knowledge-domain` | A body of knowledge and the architecture its graphs share | None |
| `concept` | An idea the method relies on | None |
| `principle` | A rule of judgement a graph keeps | None |
| `method` | An outside way of organising knowledge the method compares itself with | None |
| `authoring-convention` | A convention for writing cards | None |
| `naming-convention` | A convention for naming tools or things | None |
| `standard` | An outside standard the method builds on | None |
| `software-component` | A proposed tool that works on graphs | None |

## Link vocabulary

| Prefix | Vocabulary | Namespace | Predicates in use |
| --- | --- | --- | --- |
| `skos:` | SKOS, the default | `http://www.w3.org/2004/02/skos/core#` | `skos:related` |
| `ki:` | Knowledge Islands, for what SKOS lacks | Not yet published | `ki:applies-to`, `ki:candidate-member-of`, `ki:derived-from`, `ki:enabled-by`, `ki:enables-principle`, `ki:exposed-through`, `ki:has-candidate-member`, `ki:has-member`, `ki:implemented-by`, `ki:implements`, `ki:interpreted-by`, `ki:interprets`, `ki:member-of`, `ki:part-of`, `ki:proposed-capability-of`, `ki:provides-capability`, `ki:provides-interface-for`, `ki:represents`, `ki:requires-semantics`, `ki:respects-principle`, `ki:supports`, `ki:underpinned-by`, `ki:underpins`, `ki:used-by`, `ki:uses-convention`, `ki:uses-principle`, `ki:uses-vocabularies` |

## Properties

| Property | Meaning | Values | Required for |
| --- | --- | --- | --- |
| `id` | The card's identity and file name | A readable id | Every card |
| `title` | The thing's name | Text | Every card |
| `type` | The thing's type | A card type above | Every card |
| `status` | Whether the idea is adopted | `proposal`, `future-concept` or `agreed` | Every card |
| `territory` | The territory the knowledge belongs to | `knowledge-islands` | Every card |
| `island` | The island that owns the knowledge | `ki-principal`, or `ki-agent-backpack` for this card | Every card |
| `pillar` | The Principal's pillar the card was staged under | `Philosophy` | Every card but this one |
| `attachment` | Whether the card is offered as an attachment point | `proposed` | Optional |
| `links` | Typed links, keyed by reference label | A predicate from the vocabulary above | Optional |
| `origin` | Where the card came from, in one line | Text | Optional |
| `sensitive`, `sensitivity` | A mark weighed before the card is used outside its island | `true`, with a reason | Optional |

## Constraints

- The cards hold what the method relies on, never the method itself, which stays in the standard.
- A card's status stays `proposal` or `future-concept` until Kris agrees it.

## Subgraphs

None: the graph is one flat list, and every id is a plain name.

## Extent and limitations

- **What it covers:** the 22 cards the Inbox curated under the Principal's Pillars and dispatched to the harness on 7 November 2026, all proposals but one future concept. The island and pillar on each record where they were staged; their long-term home as knowledge may still be the Principal's Pillars.
- **Where the cards sit:** the root folder is the skill's `knowledge/` folder, which holds this root definition and the cards, flat, since the graph has no subgraphs, and nothing but the graph (KNOWLEDGE-FOLDER, GRAPH-FOLDERS).
- **Beside the graph:** the skill's `references/` folder holds the standard, its migration overlay, the generated rubric and the sources; those files are not cards.
- **Links left behind:** links to cards outside this graph were removed when the cards moved, their text kept: the Knowledge Islands territory card, the KIG tool card, the assistant repository's `context/` folder, and the Inbox's knowledge-tending cards for knowledge capture, the capture funnel, the change-log graph, knowledge tending and knowledge independence, and its ethical-knowledge card. Each can come back as a shadow node once its graph declares an attachment point.
- **Due a split:** six links reached into sections of cards, the knowledge graph's addressing and RDF foundations' representations and multiple graphs; they now point at the whole card, and those sections are due to become cards of their own when the graph is next tended (KG-GRAIN).
- **Due a vocabulary review:** `ki:part-of` could be Dublin Core's `dcterms:isPartOf`, and the `ki:` namespace is not yet published.
- **Pending:** cards for the root definition, card types, link types and subgraphs themselves, so the standard can follow them as it does the rest.

[knowledge-graph]: ./knowledge-graph.md
[semantic-markdown]: ./semantic-markdown.md
[layered-graphs]: ./layered-graphs.md
