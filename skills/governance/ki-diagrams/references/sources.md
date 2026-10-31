# Tracked sources

**Refresh:** external-spec · quarterly

[The Diagrams standard](standards-diagrams.md) is Knowledge Islands house policy, derived from the `apps-observatory` pilot (`KI-OBSERVA-APP-034` there) and the tooling research of 2026-10-03, adopted by `KI-HARNESS-GOV-131`. The research reported some facts it could not verify; they are marked.

| Source                                                                                                  | Bears on                                                       | last reviewed |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------- |
| [Archify](https://tt-a1i.github.io/archify/)                                                            | The chosen tool: types, JSON source, viewer, SVG export, Chrome route | 2026-10-14    |
| [D2 blog](https://d2lang.com/blog/) and [releases](https://github.com/terrastruct/d2/releases)          | Code-generated maps; maintainer change (unverified)            | 2026-10-03    |
| [TALA](https://github.com/terrastruct/TALA)                                                             | D2's layout engine, reported free from D2 0.9.0 (unverified)   | 2026-10-03    |
| [LikeC4](https://likec4.dev/)                                                                           | C4-only modelling                                              | 2026-10-03    |
| [Structurizr](https://github.com/structurizr/structurizr)                                               | DSL with a dated look                                          | 2026-10-03    |
| [Stately Sketch](https://stately.ai/blog/2026-03-26-introducing-stately-sketch) and [visualiser](https://stately.ai/docs/visualizer) | State charts, only with XState              | 2026-10-03    |
| [SlickMap](https://github.com/astuteo/slickmap)                                                         | Site trees without a dark theme                                | 2026-10-03    |
| [Ilograph](https://www.ilograph.com/desktop/) and [Eraser pricing](https://www.eraser.io/pricing)       | Paid or SaaS, failing the private-repository rule              | 2026-10-03    |
| [tldraw licence key](https://tldraw.dev/sdk-features/license-key)                                       | Hand-drawn, commercial licence                                 | 2026-10-03    |
| [dependency-cruiser CLI](https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md)           | `-T d2` reporter for generated dependency maps                 | 2026-10-03    |
| [react-scanner](https://github.com/moroshko/react-scanner)                                              | Usage statistics, a category mismatch                          | 2026-10-03    |
| [Storybook Composition](https://storybook.js.org/docs/sharing/storybook-composition/)                   | Storybook merging, a category mismatch                         | 2026-10-03    |
| [Mermaid state][mmd-state] and [Sankey][mmd-sankey]                                                    | Mermaid's re-evaluation; the sketch step                       | listed 2026-10-31 |
| [Isoflow](https://isoflow.io/) and [FossFLOW][fossflow]                                                 | Isometric infrastructure pictures, liked                       | listed 2026-10-31 |
| [D3](https://d3js.org/)                                                                                 | Bespoke and quantitative diagrams drawn directly               | listed 2026-10-31 |
| [fletcher][fletcher] and [TikZ](https://tikz.dev/)                                                      | Figures inside typeset documents                               | listed 2026-10-31 |
| [IcePanel](https://icepanel.io/) and [Napkin](https://www.napkin.ai/)                                   | Paid or SaaS, inspiration only                                 | listed 2026-10-31 |
| [infoschematics](https://infoschematics.info/)                                                          | Knowledge Islands' own diagramming tool, to grow               | listed 2026-10-31 |

Rows marked "listed" were added without fetching their pages; the next REFRESH reviews them and gives each a `last reviewed` date.

[mmd-state]: https://mermaid.js.org/syntax/stateDiagram.html
[mmd-sankey]: https://mermaid.js.org/syntax/sankey.html
[fossflow]: https://github.com/stan-smith/FossFLOW
[fletcher]: https://typst.app/universe/package/fletcher

## Last review

- 2026-10-31 - DIAGRAM-TOOLS, Kris's words of 29 October 2026: the standard gains a tool preference order for each kind of diagram, built only from Kris's stated likes (Archify first; Stately/XState, LikeC4 and Isoflow/FossFLOW liked; then Mermaid, D2/TALA, D3, Typst/fletcher and TikZ), the sketch-in-Mermaid, beautify-in-Archify step, the SaaS tools as inspiration only and infoschematics as KI's own tool to grow. Mermaid's place is pending re-evaluation on its current rendering (state, Sankey), so the DIAGRAM-REPLACE warning stands. The new rows were listed without fetching their pages; the next REFRESH reviews them.
- 2026-10-26 - DIAGRAM-PRIVATE-CITATIONS, decided by Kris on 26 October 2026: a private repository's `traced` entry and source node metadata may cite `path:revision:lines` with no URL, Archify's URL citation object is used only where the remote is public, and the audit accepts either form, reading the path part for freshness. No audit failed before the change; Personal's two records follow by message.
- 2026-10-08 - Created from the `apps-observatory` pilot. Confirmed against Archify 3.0.1 that the command line still has no SVG export and that the ported exporter reproduces a committed Observatory SVG byte for byte.
- 2026-10-14 - `KI-HARNESS-GOV-181`: the exporter moved from Playwright to a port of the headless Chrome route Archify 3.0.1's `bin/visual-check.mjs` drives its browser gate through (`findChrome`, launch flags, pipe protocol). Three committed SVGs (this repository's `skill-graph` and `skill-map`, Knowledge Islands Principal's `change-management-skills`) re-exported byte-identical through the new route.
