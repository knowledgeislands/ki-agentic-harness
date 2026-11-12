---
id: layered-graphs
title: Layered Graphs, Attachment Points and Shadow Nodes
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:applies-to
  folder:
    predicate: skos:related
  sovereignty:
    predicate: ki:respects-principle
  permeability:
    predicate: ki:uses-principle
---

# Layered Graphs, Attachment Points and Shadow Nodes

Each repository keeps its own [knowledge graph][graph], usually in its [`knowledge/` folder][folder], and the graphs join in layers rather than by copying. Kris agreed the picture on 4 November 2026.

- **Attachment point.** A graph declares its attachment points: the nodes it is fully confident will not be relocated, which other graphs may pin to. Declaring one is a promise of a stable id and path, with a deprecation pointer rather than removal if it ever has to change.
- **Shadow node.** Another graph brings an attachment point in as a shadow node: a read-only pointer, kept in the assistant repository under its `context/`, that records what it shadows and when it was last checked. The lower graph hangs its own nodes off the shadow.
- **Promotion.** When one of the lower graph's own nodes settles, it is promoted up into the graph above, and its place below becomes a shadow node.

So the canonical graph sits above, as Knowledge Islands Principal's does, and a graph still forming sits below, as the assistant's does: it holds what is still being captured and curated, and points up for what is settled. Each island keeps authority over its own nodes, under [Semantic Sovereignty][sovereignty], while the links between layers are an instance of [Semantic Permeability][permeability].

## Shadow-node life cycle

Kris proposed this refinement on 7 November 2026: shadows are left behind, pruned back where untended and grown again when needed.

- **Lift.** When a card is promoted up, its shadow nodes stay behind, so links into the lower graph still resolve.
- **Prune.** After a few rounds of use and population, shadows in areas no longer being tended are pruned back. Nothing is lost, because the real card lives in the graph above.
- **Touch point.** Each area keeps a single shadow node at its peripheral point, where the lower layer touches the layer above.
- **Look up before you grow.** Before growing a new node, check the layer above for a suitable one. If there is one, bring it down as a shadow and grow off that, rather than building a duplicate.
- **Regrow.** Pruned shadows can always be grown back.

## Open questions

- How a graph declares an attachment point: a front-matter flag, a register, or its `_index.md`.
- Exactly what a shadow node records about what it shadows, and how its last check is dated.

This is a proposal, not adopted practice.

[graph]: ./knowledge-graph.md
[folder]: ./knowledge-folder.md
[sovereignty]: ./semantic-sovereignty.md
[permeability]: ./semantic-permeability.md
