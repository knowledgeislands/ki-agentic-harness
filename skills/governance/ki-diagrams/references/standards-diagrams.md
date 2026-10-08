# Diagrams standard

This standard defines how a Knowledge Islands repository keeps living diagrams: diagrams that explain the system as built, traced from named source files, and kept current as the code changes. The hosted rubric enforces its mechanical criteria; the generated [rubric](rubric.md) publishes every criterion, and [exemplars](exemplars.md) point at a conforming set. It was established by the `apps-observatory` pilot (`KI-OBS-APP-034` there) and adopted as a harness standard by `KI-HARNESS-GOV-131`.

## Contents

- [The tool: Archify](#the-tool-archify)
- [Choosing a diagram type](#choosing-a-diagram-type)
- [Committed forms](#committed-forms)
- [The manifest](#the-manifest)
- [Embedding](#embedding)
- [Privacy](#privacy)
- [Regeneration and freshness](#regeneration-and-freshness)

## The tool: Archify

Diagrams are authored with [Archify](https://tt-a1i.github.io/archify/) (MIT), installed for the principal as an Agent Skill through Rig (`[skill.archify]`, source `tt-a1i/archify`). Its command line is `node <archify>/bin/archify.mjs`, where `<archify>` is the installed skill directory.

Archify was chosen on 2026-10-03 against six criteria: visual quality, a committable text source, local-first use for private repositories, SVG and interactive HTML output, generation from code, and licence and maintenance. It has the best look of the tools considered, a JSON source, local use, interactive HTML, a dual-theme SVG through its viewer, and the five diagram types below. Its limits are known and accepted:

- nodes are placed by hand;
- it has no tree layout;
- it has no route or import-graph importer;
- its command line has no SVG export, which [the exporter](#the-svg-exporter) supplies.

Mermaid and Graphviz were excluded at the owner's direction as not good enough to look at. D2 is the best addition only for maps generated mechanically from code, such as a route manifest or a dependency graph, and has no interactive HTML. LikeC4 models C4 architecture only; Structurizr looks dated; Stately suits state charts only where XState is adopted; SlickMap has no dark theme; Ilograph, Eraser and IcePanel need payment or SaaS, which fails the private-repository rule; tldraw and Excalidraw are hand-drawn rather than generated; react-scanner, Storybook Composition and framework route visualisers are category mismatches. [Sources](sources.md) lists the evidence for each.

The tool choice is recorded here rather than in a Decision Record. `ADR-KI-HARNESS-TOOLCHAIN-002` lists Archify among the harness's adopted complementary tools and links back to this section.

## Choosing a diagram type

A diagram answers one question for one audience. Choose the type from the question, not from the subject:

| Question                                                       | Type           |
| -------------------------------------------------------------- | -------------- |
| What are the parts, and how do they connect or depend?         | `architecture` |
| What steps does a process take, and where can it stop or fork? | `workflow`     |
| What happens, in order, between participants for one request?  | `sequence`     |
| Where does data come from, what transforms it, where does it go? | `dataflow`   |
| What states does one thing move through, and on what events?   | `lifecycle`    |

Three common questions map onto these types:

- **A site map** is an `architecture` diagram read top to bottom, one node per page or view, labelled with the route that feeds it.
- **Component structure and state ownership** is an `architecture` diagram with each state holder labelled by its lifetime.
- **A state machine** is a `lifecycle` diagram.

If a question needs two types, it is two questions; draw two diagrams.

## Committed forms

Each diagram has up to three forms under `docs/diagrams/`:

- **Source** - `<slug>.<type>.json`, the Archify input. It records the repository revision and cites the file and line each node was traced from. It is the thing to edit. Always committed.
- **SVG** - `<slug>.svg`, the self-contained dual-theme export: dark by default, light under `prefers-color-scheme: light`, fonts inlined, and no reference outside the file other than a fragment or an inline `data:` URI. Always committed.
- **Interactive HTML** - `<slug>.html`, the finalized viewer with search, focus, zoom and source links, roughly 800 KB per diagram. Committed only by a repository that serves it, such as a documentation site. Otherwise it is rebuilt locally under `+/diagrams/<slug>/` and never committed.

`docs/diagrams/` holds nothing else apart from the manifest and its `README.md`.

### Naming

The slug is lower-case kebab-case and names the question's subject, not the type: `beacon-request`, not `sequence-1`. The type is the file's second extension and matches the manifest's `type`. One slug, one diagram.

## The manifest

`docs/diagrams/diagrams.toml` is the machine-readable authority: a reader such as the Observatory can list a repository's diagrams and flag stale ones without parsing prose. It has one table per slug and no other content:

| Field          | Holds                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `type`         | One of `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`                                    |
| `question`     | The one question the diagram answers                                                                       |
| `audience`     | Who asks it                                                                                                |
| `traced`       | Repository-relative paths or Git pathspec globs the diagram was traced from, one per entry - no brace sets |
| `stale_when`   | The changes to those paths that would make the diagram untrue                                              |
| `regenerate`   | The prompt an agent with the Archify skill is given to rebuild the diagram from repository evidence        |
| `last_checked` | The commit the diagram was last traced or confirmed against                                                |

`docs/diagrams/README.md` is the reader-facing index: a short introduction, one section per diagram stating its question in prose, and the SVG embedded with `![Title](<slug>.svg)`. It does not repeat the manifest's operational fields. Both templates ship in the skill's `assets/`.

## Embedding

A diagram is embedded as its SVG, never as a screenshot. The inline figure always links onward to the interactive view:

- **A repository that serves its diagrams** commits the HTML and links the figure to it, for example as an **Interactive** control that opens the viewer in an overlay, or in a new tab on a modified click.
- **A repository that does not** commits only the source and the SVG. A reader that can build the HTML locally, such as the Observatory, offers the interactive view once `finalize` has written it under `+/diagrams/<slug>/`, and otherwise says it is not built.

Any other Markdown document embeds a diagram with a relative path to its SVG. Where a guide may embed one is `ki-guides`' concern.

## Privacy

No committed source or SVG may carry:

- a local absolute path (`/Users/...`, `/home/...`, a temporary directory) or a `file://` URL;
- an email address or other personal identity;
- a private repository's name, note content, or a commit subject.

Sources cite repository-relative paths. A repository URL in a source's metadata is the repository's own public remote or is omitted. The audit checks the mechanical cases; naming a private repository or a person is a judgment it asks for.

## Regeneration and freshness

A diagram goes **stale** when a path it was traced from changes in a way its `stale_when` names. The audit compares each diagram's `traced` paths between `last_checked` and `HEAD` in read-only Git history and warns on any change; whether the change matches `stale_when` is judgment.

To refresh a stale diagram, or to confirm a warned one:

1. Give an agent with the Archify skill the diagram's `regenerate` prompt and its current source. Ask it to re-trace from the repository and keep the existing layout wherever the facts have not changed.
2. Rebuild and check it: `node <archify>/bin/archify.mjs finalize <type> docs/diagrams/<slug>.<type>.json +/diagrams/<slug>/<slug>.html --repo-root "$PWD" --quality showcase --json`. All four gates - validate, deliver, check, browser check - must pass.
3. Re-export the SVG: `bun <ki-diagrams>/scripts/export-svg.ts +/diagrams/<slug>/<slug>.html docs/diagrams/<slug>.svg`. A repository that serves its HTML writes `<slug>.html` to `docs/diagrams/` instead.
4. Set `last_checked` to the commit the diagram was traced against.

A change outside `stale_when` needs no rebuild: review it, then advance `last_checked`.

To add a diagram, write its manifest table and README section first, then author the source, finalize, export, and set `last_checked`.

### The SVG exporter

Archify's SVG export lives only in its viewer's Export menu. The exporter opens the finalized HTML in headless Chromium, calls the function that menu item calls, and keeps the downloaded file byte for byte, so the committed SVG is exactly what a reader's click would produce and cannot drift from Archify's own serialiser. It fails closed: an export the viewer does not mark canonical, or one carrying an external reference, is refused rather than written.

### Without Archify or Playwright

Both are optional prerequisites. AUDIT reads committed files and Git history only and runs without either. EDUCATE, REFRESH and authoring stop without Archify and give the Rig install instruction. The exporter stops without Playwright and gives `bun add --dev playwright && bunx playwright install chromium`; Playwright is the adopting repository's development dependency, not the harness's.
