---
id: map-of-content
title: Map of Content
type: concept
territory: knowledge-islands
island: ki-principal
pillar: Philosophy
status: proposal
links:
  zettelkasten:
    predicate: skos:related
  disclosure:
    predicate: ki:uses-principle
  views:
    predicate: skos:related
---

# Map of Content

A map of content, or MOC, is a note whose job is to be an entry point: it gathers links to the cards on one theme or span and says briefly how they fit together, without holding their knowledge itself. MOCs are common in [Zettelkasten][zettelkasten]-style graphs, where densely linked atomic notes otherwise have no obvious place to start reading.

Kris noted on 2 November 2026 that MOCs are what the Knowledge Islands graphs are missing, and that they are needed generally, not only for one feature. Where a folder today has a structural `README.md`, a MOC could take its place as the reading entry point.

## Several maps over the same leaves

A MOC organises leaves without owning them, so several MOCs can sit over the same cards:

- **Time-based:** the assistant's daily `record/` is already a time-based MOC, one page a day linking to what happened.
- **Topic-based or territorial:** the same entries also fall naturally under territory headings, such as Legal, Humans Not Robots, Knowledge Islands and Personal, and could be gathered into a MOC per territory or theme.

A record kept as a semantic tree in this way would be largely the same thing as the change-log graph.

## Root index named after its folder

A folder's root MOC would be named after the folder, such as `record.md` for `record/`. To begin with it simply lists the sets of information it holds, for example each day as a link.

## Cascading granularity

As the graph is refined, granularity cascades down: a reader who wants more of something drills from a MOC into narrower MOCs and then into the cards, so the graph becomes more tree-like where it is read. This is [Progressive Disclosure][disclosure] applied to navigation, and a MOC is one kind of [knowledge view][views] over the graph.

## Beside territory context

The assistant repository's territory context is routing guidance: it tells someone capturing or curating where material belongs. A MOC is for reading: it tells someone exploring the knowledge where to start. The two can coexist over the same cards.

This is a proposal under discussion, not adopted practice; no MOC convention or file naming has been agreed.

[zettelkasten]: ./zettelkasten.md
[disclosure]: ./progressive-disclosure.md
[views]: ./knowledge-views.md
