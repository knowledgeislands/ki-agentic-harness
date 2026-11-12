---
id: knowledge-folder
title: The knowledge/ Folder
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  graph:
    predicate: ki:part-of
  semantic-markdown:
    predicate: ki:uses-convention
  atomicity:
    predicate: ki:uses-principle
  moc:
    predicate: ki:uses-convention
  layered:
    predicate: skos:related
---

# The knowledge/ Folder

The `knowledge/` folder is the proposed home of a repository's [knowledge graph][graph]: a top-level folder of small, atomic nodes, each a [Semantic Markdown][semantic-markdown] card with one primary home path, linked by typed predicates. A repository follows the Knowledge Islands graph standard when it has `knowledge/` in place of `Pillars/`; that single test makes plain which standard a repository follows, with no "version 1" and "version 2". Kris set out the idea on 4 November 2026.

## Why

What the assistant learnt from 1 November 2026 works: material comes in through the knowledge capture funnel and is curated into small cards, each with a primary home, linked by predicates such as `ki:part-of` and `ki:concerns`. Large Pillars pages hold too much in one place to link or tend well. How small a node should be is judged by [Contextual Atomicity][atomicity] rather than by word count.

## What changes, and what does not

Only `Pillars/` changes: it is replaced, over time, by `knowledge/`. `Admin/` (governance, conventions and operations), `Calendar/` (dated records), `Streams/` (roadmap, Projects and Initiatives), `+/` and `-/` (the inbound and outbound working areas and work packages) and `Resources/` (reference material, such as Legal's authorities, which is not a graph) stay as they are, so everything already built keeps working.

## Naming

`knowledge/` is lower case and kebab-case throughout, folders and node files alike, as in `knowledge/knowledge-tending/knowledge-capture-funnel.md`. The older areas keep their current names for now; Kris's preference is for a later, separate rename that moves every area to lower case and kebab-case, such as `admin/` and `streams/`, so the whole repository follows one convention.

## Folder notes

The Obsidian-style folder note, named after its folder, gives way to `_index.md`: the first file in every `knowledge/` folder and its [map of content][moc]. It stands for the folder's place in the graph, saying what the folder is about and linking its nodes and sub-folders. The leading underscore sorts it first and marks it as the folder's own node rather than one of its children. Work packages' focus folders start with `index.md` today, and the two names are to be settled together.

## Links between the new and the old

A `knowledge/` node may link to anything in `Pillars/`, and to anything a Pillars page could link to, such as `Resources/`. Each such target counts as a **legacy note**: the link reads as a pointer from the graph into the older structure. Nothing in the older areas has to link back, so nothing breaks.

## How a repository moves across

1. **Side by side.** `knowledge/` is added beside `Pillars/`, with a home page, `knowledge/_index.md`, as the graph's entry point, pointing into Pillars where nothing newer exists yet.
2. **Progressive.** Pillars pages are pulled across one at a time. The minimum upgrade from a legacy page to a node is front matter (id, type, primary home and links with predicates), a kebab-case name, and a split into fragments wherever the page holds more than one idea. The home page's link moves to the new node, and the old page points to its replacement.
3. **Complete.** When `Pillars/` is empty, it goes.

Knowledge Islands Principal goes first, bootstrapped from the assistant's staged cards, so that everything else is built from it. The assistant may follow the same graph approach for its own knowledge areas, and the territories follow at their own pace, Humans Not Robots and Legal first. How graphs in different repositories join is set out in [Layered Graphs][layered].

## Open questions

- Whether a territory may bring its `Resources/` into its graph, or Resources stays outside everywhere.
- Whether the internal-versus-reference split is still needed inside `knowledge/`, or the primary home path is enough.
- The minimum node: its front matter fields, its predicates and how small a fragment is.
- Whether `Admin/` and `Streams/` link into `knowledge/` by plain links or have nodes of their own.
- `_index.md` or `index.md` as the folder note.
- When the older areas are renamed, and how fast the standard rolls out.

This is a proposal, not adopted practice.

[graph]: ./knowledge-graph.md
[semantic-markdown]: ./semantic-markdown.md
[atomicity]: ./contextual-atomicity.md
[moc]: ./map-of-content.md
[layered]: ./layered-graphs.md
