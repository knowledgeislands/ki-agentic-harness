---
name: ki-knowledge-graph
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern knowledge graphs: Semantic Markdown cards named by readable ids, a `_graph.md` root definition, typed links
  with SKOS by default, subgraphs, layered graphs with shadow nodes, and curating captured material through a staging
  graph to dispatch. Use to define a graph, curate, tend or dispatch knowledge; `ki-acquire` owns capture,
  `ki-dodecakrisis` sorting and `ki-repo-kb` knowledge-base structure.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | curate <capture> | tend <area> | dispatch <package> | help | refresh'
---

# Knowledge graph

Read [the knowledge-graph standard](references/standards-knowledge-graph.md) first: what every graph shares, its root definition, cards, links and subgraphs, layered graphs and shadow nodes, and then curation, one use of a graph, from Deposit through the staging graph and tending to dispatch. While [the migration overlay](references/standards-knowledge-graph-migration.md) exists, read it last; it lists temporary adjustments, and the standard wins wherever the two differ.

The skill holds the method, how a graph is defined and how knowledge is curated, tended and handed on; a graph itself keeps the things that are, its concepts and their relations, and a card never restates this method. Sorting before Deposit is the `ki-dodecakrisis` skill's, and faithful capture, coverage, originals and provider rules are the `ki-acquire` skill's and its provider skills'. The folders and zones of a knowledge base, the staging base's included, are the `ki-repo-kb` skill's. Prose style is the `ki-authoring` skill's, and a receiving island's triage of what it is sent is the `ki-next` skill's. Executable checks and importers live in the repositories that run them. The concepts the standard relies on are cards in the skill's own graph, flat in `references/` beside the standard and opened by [its root definition](references/_graph.md); read a card when the standard names its concept. The [generated rubric](references/rubric.md) holds the review criteria. This skill accepts no repository configuration properties.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the method, modes and off-ramps without reading or changing any card; offer a mode choice only in an interactive session.

Every mode reads first. CURATE and TEND write only in the repository whose graph they work, under the authority the work already carries; DISPATCH writes into another repository only with an approval it cites.

### Mode AUDIT

Run `ki repo audit --skill ki-knowledge-graph --repo <repo>`, then review the supplied cards, captures and curation commits against the standard, recording each judgment criterion as conforming, a named gap or a justified exclusion. The mechanical audit does not prove that curation was faithful; missing evidence stays a named gap.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-knowledge-graph --repo <repo> --dry-run`. The host may regenerate rubric publication. Propose root-definition, card front-matter, link-predicate and strike-through corrections as a list; this mode does not rename, merge, split, dispatch or delete a card or capture.

### Mode EDUCATE

Explain the root definition, the card format, links and subgraphs, and for a curating repository the funnel and transactional curation, using the repository's own cards as examples. Do not curate or dispatch to demonstrate the method.

### Mode CURATE

Take one bounded item from one named capture and curate it under the standard's transactional curation: look up the layer above, then the graph, for an existing card; distil, qualify, relate and integrate; verify; and commit the card change with the item's strike-through and destination note, or strike a dropped item in its own commit. Report the item, its destinations and what is still unstruck. Stop after the item; the next is a new run of the mode.

### Mode TEND

Tend one named area of a staging graph: report duplicate definitions, cards no link reaches, unqualified claims and untended shadow nodes, then propose merges, splits, renames and shadow-node pruning as a list. Make only the changes the work already authorises, each in its own commit; never prune an area's last shadow node at its touch point.

### Mode DISPATCH

Dry-run first: list each package, its receiving island and its destination under `+/_ACQUIRED/` there. Move a package only with an approval that names it, and never from a declared holding area. After the move, leave a shadow node where each dispatched card was.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the skill's own cards, the knowledge-tending cards and actual practice in the graphs that follow the standard with the standard, then make and verify the smallest correction. When a migration item is done, delete its line, and delete the overlay once it is empty.
