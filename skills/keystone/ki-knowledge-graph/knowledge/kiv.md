---
id: kiv
title: KIV
type: software-component
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  family:
    predicate: ki:member-of
  views:
    predicate: ki:provides-interface-for
  semantic-markdown:
    predicate: ki:interprets
  graph:
    predicate: skos:related
---

# KIV — local viewer

KIV is the working name for a local viewer of the [knowledge graph][graph], a member of the [KI tool family][family]; its final name is Kris's to choose. Its first prototype, in the assistant repository's `packages/kiv/`, is read-only: it lets Kris inspect and navigate the captured, context and curated cards on Kris's own machine and changes nothing.

Each page is a split view. The card is read as rendered [Semantic Markdown][semantic-markdown] with working links, and beside it a graph of the card's neighbours, built from its typed and plain links, re-centres as Kris moves from card to card. Nodes are coloured by the area they come from, so a capture reads differently from a context card. It is one of the presentation [views][views] the graph can be projected into, and it could grow beyond the assistant repository.

[family]: ./ki-tool-family.md
[semantic-markdown]: ./semantic-markdown.md
[views]: ./knowledge-views.md
[graph]: ./knowledge-graph.md
