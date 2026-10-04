---
id: KI-HARNESS-GOV-131
area: GOV
title: Govern living diagrams
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T09:41:34Z
updated_at: 2026-10-04T09:55:26Z
---

# KI-HARNESS-GOV-131: Govern living diagrams

## Goal

Every KI repository that keeps diagrams keeps them the same way, under a `ki-diagrams` governance skill that does for diagrams what `ki-authoring` does for prose: a standard, a rubric, exemplars, and an audit and conform pair.

## Context

The owner reads diagrams more readily than prose and asked on 2026-10-03 for one consistent, good-looking way to keep diagrams across repositories. `apps-observatory` piloted it in KI-OBS-APP-034. That pilot established the following:

- **Committed forms:** seven Archify diagrams under `docs/diagrams/`, each committed as a JSON source traced to file and line plus a self-contained dual-theme SVG. The interactive HTML is rebuilt locally under `+/diagrams/` and never committed.
- **Manifest:** `docs/diagrams/README.md`, with one section per diagram giving question and audience, type, sources traced, staleness triggers, a regeneration prompt, the last checked revision, and the embedded SVG.
- **SVG export:** a Playwright script drives the viewer's own Export → SVG action, because Archify's command line has no SVG export.

On 2026-10-04 the owner ruled out a repository-local decision record for the tool choice. The standard, and the rationale for choosing Archify, belong in the harness.

## Boundary

The skill owns:

- the diagram standard: tool, committed forms, manifest shape, naming, and privacy rules;
- the choice of diagram type for a question;
- the regeneration and freshness procedure;
- the audit checks.

Archify itself, its schemas and its viewer stay upstream. Prose style stays with `ki-authoring`, and where a guide may embed a diagram stays with `ki-guides`. Adopting the skill in a repository is that repository's own work.

## Discussion

### Candidate checks

- Every diagram listed in the manifest has a source and an SVG, and every source is listed.
- Every source passes `finalize` at showcase quality.
- No source or SVG carries a local absolute path or private identity.
- No diagram is stale. A source is stale when its traced files changed after its last checked revision in a way its staleness triggers name. The mechanical part could compare file digests and leave the judgement to review.

### Embedding

A second pilot, a project documentation site, embeds each diagram as an inline figure with an **Interactive** control that opens the full viewer in an overlay, or in a new tab on a modified click. It commits the HTML because the site serves it. The Observatory pilot does not commit the HTML and embeds only the SVG (KI-OBS-VIS-016 there). The standard should name both cases:

- a repository that serves its diagrams commits the HTML;
- a repository that does not, commits only the source and the SVG;
- in both, the inline figure links onward to the interactive view.

The manifest should also be machine-readable, so a reader such as the Observatory can list diagrams and flag stale ones without parsing prose.

### Open questions

- Does the tool choice need its own GDR, or does the skill's standard carry the rationale?
- Where does the SVG exporter live? It could be vendored in each repository with a drift check, shipped in the skill's `scripts/`, or offered as a `ki` command. The best case is a command-line export upstream in Archify.
- Is Archify a declared prerequisite, installed through Rig as it is today, and how does a repository without it degrade?
- Which diagram set is the default for each repository shape: project, MCP server, Knowledge Base, harness?

### Tooling considered

Researched on 2026-10-03 for the pilot. Mermaid and Graphviz were excluded at the owner's direction as not good enough to look at. The criteria were visual quality, a committable text source, local-first use for private repositories, SVG and interactive HTML output, generation from code, and licence and maintenance.

- **Archify** (MIT). Chosen. It has the best look, a JSON source, local use, interactive HTML, dual-theme SVG through its viewer, and the architecture, workflow, sequence, data flow and lifecycle types. A site map is an architecture diagram read top to bottom. Component structure and state ownership is an architecture diagram with each state holder labelled by lifetime, and a state machine is a lifecycle diagram. Limits:
  - nodes are placed by hand;
  - it has no tree layout;
  - it has no route or import-graph importer;
  - it has no command-line SVG export.
- **D2** (MPL-2.0). A text diagram language with the dagre, ELK and TALA layout engines, themed SVG output, links and tooltips, but no interactive HTML. It is the best addition only for maps generated mechanically from code, such as a route manifest or dependency-cruiser's `-T d2` reporter. The research reported, unverified here, that TALA became free and bundled in D2 0.9.0 and that D2 moved from Terrastruct to a single-maintainer non-profit.
- **LikeC4** (MIT). Polished, local and interactive, but models C4 architecture rather than pages or components.
- **Structurizr** (Apache-2.0, open core). Has a DSL, but looks dated.
- **Stately Sketch and the XState visualiser** (MIT). Good for state charts, but only if XState is adopted.
- **SlickMap** (Unlicense). Styles an HTML list as a site tree. It is tidy, but has no dark theme.
- **Ilograph, Eraser and IcePanel.** Polished, but each needs payment or SaaS, which fails the private-repository rule.
- **tldraw and Excalidraw.** Hand-drawn style, not generated; tldraw needs a commercial licence key.
- **react-scanner, Storybook Composition and the Next.js and Astro route visualisers.** Rejected as category mismatches: one reports usage statistics, one merges Storybooks, and the route visualisers serve frameworks the pilot does not use.

Sources:

- <https://tt-a1i.github.io/archify/>
- <https://d2lang.com/blog/>
- <https://github.com/terrastruct/d2/releases>
- <https://github.com/terrastruct/TALA>
- <https://likec4.dev/>
- <https://github.com/structurizr/structurizr>
- <https://stately.ai/blog/2026-03-26-introducing-stately-sketch>
- <https://stately.ai/docs/visualizer>
- <https://github.com/astuteo/slickmap>
- <https://www.ilograph.com/desktop/>
- <https://www.eraser.io/pricing>
- <https://tldraw.dev/sdk-features/license-key>
- <https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md>
- <https://github.com/moroshko/react-scanner>
- <https://storybook.js.org/docs/sharing/storybook-composition/>
