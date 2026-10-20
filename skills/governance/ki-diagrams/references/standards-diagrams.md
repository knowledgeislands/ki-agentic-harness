# Diagrams standard

This standard defines how a Knowledge Islands repository or knowledge-base island keeps diagrams: living diagrams that explain the system as built, traced from named source files and kept current as the code changes, and [island diagrams](#island-diagrams) that explain a model or process. The hosted rubric enforces its mechanical criteria; the generated [rubric](rubric.md) publishes every criterion, and [exemplars](exemplars.md) point at a conforming set. It was established by the `apps-observatory` pilot (`KI-OBSERVA-APP-034` there) and adopted as a harness standard by `KI-HARNESS-GOV-131`.

## Contents

- [The tool: Archify](#the-tool-archify)
- [Choosing a diagram type](#choosing-a-diagram-type)
- [Committed forms](#committed-forms)
- [The manifest](#the-manifest)
- [Embedding](#embedding)
- [Privacy](#privacy)
- [Regeneration and freshness](#regeneration-and-freshness)
- [Island diagrams](#island-diagrams)

## The tool: Archify

Diagrams are authored with [Archify](https://tt-a1i.github.io/archify/) (MIT), installed for the principal as an Agent Skill through Rig (`[skill.archify]`, source `tt-a1i/archify`). Its command line is `node <archify>/bin/archify.mjs`, where `<archify>` is the installed skill directory.

Archify was chosen on 2026-10-03 against six criteria: visual quality, a committable text source, local-first use for private repositories, SVG and interactive HTML output, generation from code, and licence and maintenance. It has the best look of the tools considered, a JSON source, local use, interactive HTML, a dual-theme SVG through its viewer, and the five diagram types below. Its limits are known and accepted:

- nodes are placed by hand;
- it has no tree layout;
- it has no route or import-graph importer;
- its command line has no SVG export, which [the exporter](#the-svg-exporter) supplies.

Mermaid and Graphviz were excluded at the owner's direction as not good enough to look at. The audit warns on each fenced `mermaid` block left in the repository's tracked Markdown, naming its file and line, until it is replaced by an Archify diagram or the owner decides to keep it, as Kris set on 19 October 2026 under DIAGRAM-REPLACE: "Re mermaid diagrams, if they can be replaced with archify they should be, e.g. activity diagrams. Flag any others that don't and I'll decide about them too". A kept diagram carries `<!-- ki-diagrams: keep mermaid -->` on the line before its fence, so the decision sits beside it: Mermaid diagrams found in a repository are replaced by Archify diagrams wherever Archify can carry them, and the rest are flagged to the owner. D2 is allowed only for maps generated mechanically from code, such as a route manifest or a dependency graph, styled from the `ki-design` tokens; it has no interactive HTML. LikeC4 models C4 architecture only; Structurizr looks dated; Stately suits state charts only where XState is adopted; SlickMap has no dark theme; Ilograph, Eraser and IcePanel need payment or SaaS, which fails the private-repository rule; tldraw and Excalidraw are hand-drawn rather than generated; react-scanner, Storybook Composition and framework route visualisers are category mismatches. [Sources](sources.md) lists the evidence for each.

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

Each diagram has up to four forms under `docs/diagrams/`:

- **Source** - `<slug>.<type>.json`, the Archify input. It records the repository revision and cites the file and line each node was traced from. It is the thing to edit. Always committed.
- **SVG** - `<slug>.svg`, self-contained, with no reference outside the file other than a fragment or an inline `data:` URI. Always committed. Its form is the manifest's `svg_form`:
  - `dual`, the default for living diagrams: Archify's own export, dark by default and light under `prefers-color-scheme: light`, fonts inlined;
  - `light`: a static light-only export with every paint resolved to a plain attribute, no `<style>`, no CSS variable and no `@font-face`, and the system monospace font, so it renders the same in any SVG viewer, `rsvg-convert` included;
  - `ki`: the same static form painted from the `ki-design` light role, wash and font tokens, with each node icon whose meaning a KI symbol carries drawn as that symbol's glyph, for a design report or a page in the Knowledge Islands look;
  - `ki-night`: the `ki` form in the `ki-design` night palette, since a static SVG carries one palette and the KI theme maps both the night and day themes.

  A design report uses `ki` or `light`, committed beside the subject's Project note as `ki-work-design` sets.
- **Interactive HTML** - `<slug>.html`, the finalized viewer with search, focus, zoom and source links, roughly 800 KB per diagram. Committed only for a diagram whose manifest table sets `commit_html = true`, as a repository that serves its diagrams does, or one whose readers open the viewer from a checkout or a forge; the opt-in then requires it. Otherwise it is rebuilt locally under `+/diagrams/<slug>/` and never committed.
- **Receipt** - `<slug>.receipt.json`, beside each committed viewer and only there: the proof that the viewer was rendered from the committed source. It holds the receipt schema version, the slug and type, the source and HTML file names with their SHA-256 hashes and byte counts, and the renderer's name and version, with no local path, so it is portable. [The build command](#the-build-command) writes it with the viewer, and it is never hand-edited. A viewer whose receipt is missing or no longer matches its source and HTML is stale, whatever its `last_checked` says: a matching receipt never refreshes `last_checked`, and a stale `last_checked` never fails the receipt.

`docs/diagrams/` holds nothing else apart from the manifest and its `README.md`.

### Naming

The slug is lower-case kebab-case and names the question's subject, not the type: `beacon-request`, not `sequence-1`. The type is the file's second extension and matches the manifest's `type`. One slug, one diagram.

## The manifest

`docs/diagrams/diagrams.toml` is the machine-readable authority: a reader such as the Observatory can list a repository's diagrams and flag stale ones without parsing prose. It has one table per slug and no other content. Every field is required except `commit_html` and `svg_form`:

| Field          | Holds                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `type`         | One of `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`                                    |
| `question`     | The one question the diagram answers                                                                       |
| `audience`     | Who asks it                                                                                                |
| `traced`       | Repository-relative paths or Git pathspec globs the diagram was traced from, one per entry - no brace sets |
| `stale_when`   | The changes to those paths that would make the diagram untrue                                              |
| `regenerate`   | The prompt an agent with the Archify skill is given to rebuild the diagram from repository evidence        |
| `last_checked` | The commit the diagram was last traced or confirmed against                                                |
| `commit_html`  | Optional; `true` commits the diagram's `<slug>.html` and its receipt, and absent or `false` keeps it local |
| `svg_form`     | Optional; the [SVG form](#committed-forms), one of `dual`, `light`, `ki`, `ki-night`, absent meaning `dual` |

`docs/diagrams/README.md` is the reader-facing index: a short introduction, one section per diagram stating its question in prose, and the SVG embedded with `![Title](<slug>.svg)`; a diagram with `commit_html = true` also links its figure to `<slug>.html`, for example `[![Title](<slug>.svg)](<slug>.html)`. It does not repeat the manifest's operational fields. Both templates ship in the skill's `assets/`.

## Embedding

A diagram is embedded as its SVG, never as a screenshot. The inline figure always links onward to the interactive view:

- **A diagram that commits its HTML** under `commit_html = true` links the figure to it: in the README as a link around the image, and on a site that serves its diagrams, for example, as an **Interactive** control that opens the viewer in an overlay, or in a new tab on a modified click.
- **A diagram that does not** commits only the source and the SVG. A reader that can build the HTML locally, such as the Observatory, offers the interactive view once `finalize` has written it under `+/diagrams/<slug>/`, and otherwise says it is not built.

Any other Markdown document embeds a diagram with a relative path to its SVG. Where a guide may embed one is `ki-guides`' concern.

## Privacy

No committed source, SVG or HTML may carry:

- a local absolute path (`/Users/...`, `/home/...`, a temporary directory) or a `file://` URL;
- an email address or other personal identity;
- a private repository's name, note content, or a commit subject.

Sources cite repository-relative paths. A repository URL in a source's metadata is the repository's own public remote or is omitted. The audit checks the mechanical cases; naming a private repository or a person is a judgment it asks for.

## Regeneration and freshness

A diagram goes **stale** when a path it was traced from changes in a way its `stale_when` names. The audit compares each diagram's `traced` paths between `last_checked` and `HEAD` in read-only Git history and warns on any change; whether the change matches `stale_when` is judgment.

To refresh a stale diagram, or to confirm a warned one:

1. Give an agent with the Archify skill the diagram's `regenerate` prompt and its current source. Ask it to re-trace from the repository and keep the existing layout wherever the facts have not changed.
2. Rebuild and check it: `node <archify>/bin/archify.mjs finalize <type> docs/diagrams/<slug>.<type>.json +/diagrams/<slug>/<slug>.html --repo-root "$PWD" --quality showcase --json`. All four gates - validate, deliver, check, browser check - must pass.
3. Re-export the SVG: `bun <ki-diagrams>/scripts/export-svg.ts [--form <form>] +/diagrams/<slug>/<slug>.html docs/diagrams/<slug>.svg`, passing the manifest's `svg_form` where it is not `dual`. A diagram with `commit_html = true` also copies the finalized `<slug>.html` to `docs/diagrams/` and writes its receipt, which the build command does for it.
4. Set `last_checked` to the commit the diagram was traced against.

[The build command](#the-build-command) runs steps 2 and 3 for every listed diagram at once.

A change outside `stale_when` needs no rebuild: review it, then advance `last_checked`.

To add a diagram, write its manifest table and README section first, then author the source, finalize, export, and set `last_checked`.

Each working folder `+/diagrams/<slug>/` carries a `mark.toml` sidecar at its root that says who wrote it and when, under the `ki-delegation` background-run standard's [working-area marks](../../ki-delegation/references/standards-background-runs.md#working-area-marks), which names its fields in one place. The mark is working-area provenance only: neither Archify's `<slug>.delivery.json` beside the HTML nor the committed `<slug>.receipt.json` carries it, so a rebuild leaves the committed receipt unchanged. The audit warns on a working folder without a well-formed mark.

### The build command

`bun <ki-diagrams>/scripts/build-html.ts [--repo <dir>] [--work <id>] [--svg | --check] [slug...]` builds every diagram the manifest lists, or the named ones, in one local command. Each is finalized as step 2 runs it, with a fresh `--out-dir` at `+/diagrams/<slug>/build/`, and a diagram with `commit_html = true` has its HTML copied to `docs/diagrams/<slug>.html` with its receipt, refused where Archify's own delivery receipt vouches for other bytes; `--svg` also re-exports each SVG as step 3 does. After a successful finalize it writes the folder's `mark.toml`, taking the work, run and agent from `KI_AGENT_RUN` and the run packet in a background run and writing `session` otherwise, with `--work <id>` naming the work where no run packet does. A failing gate stops the build before that diagram's committed forms are touched. `--check` renders nothing and needs neither Archify nor a browser: it fails when a committed viewer's receipt is missing or does not match, and a repository's pre-commit hook runs it on the staged snapshot so a commit that changes a source or viewer without re-rendering is refused. It finds Archify at `ARCHIFY_HOME` when set, otherwise as the Agent Skill the Rig install places in the runtime's skills directory, and never edits a source or the manifest. A repository may bind it to a repository-owned `self:` package script.

### The SVG exporter

Archify's SVG export lives only in its viewer's Export menu. The exporter opens the finalized HTML in the system Google Chrome or Chromium, headless, calls the function that menu item calls, and keeps the downloaded file byte for byte, so the committed SVG is exactly what a reader's click would produce and cannot drift from Archify's own serialiser. It fails closed: an export the viewer does not mark canonical, or one carrying an external reference, is refused rather than written.

`--form <form>` selects a static form in place of the default `dual`. The exporter first takes the canonical export as above, then opens it in the same browser with the form's theme and, for `ki` and `ki-night`, the Archify theme variables set from the `ki-design` tokens. It writes every computed paint, stroke and text property as a plain attribute, drops the stylesheet, classes, inline styles and hidden elements, and sets the font family to the form's monospace stack. For `ki` and `ki-night` it first draws each node icon whose meaning a KI symbol carries with that symbol's `ki-design` glyph, scaled from the glyph's 24-unit grid to Archify's 16: database as the library, calendar as the calendar, decision as the council hall, external as the port, security as the customs house and message bus as the current. Every other icon stays as Archify draws it. It refuses a result that still carries a `<style>` element, a `var(` reference or an `@font-face` rule. The `ki-design` values are vendored at a pinned revision in `scripts/internal/ki-design-tokens.ts`, whose test compares them against that revision of the `ki-design` token file where a checkout is available; the glyphs are vendored at the same revision in `scripts/internal/ki-design-glyphs.ts`, whose test compares each with its glyph file and its symbol's icon.

The browser is found and launched the way Archify's own browser gate finds and launches it: `ARCHIFY_CHROME` names the executable when set, otherwise the platform's fixed install paths are tried before the commands on `PATH`, and the browser runs headless with a throwaway profile, speaking the DevTools Protocol over its remote-debugging pipe. The exporter carries its own small port of that route, verified against Archify 3.0.1, so it depends on no Archify internals and needs no package install: a repository that can finalize a diagram can export it.

### Without Archify or a browser

Both are optional prerequisites. AUDIT, and the build command's `--check`, read committed files and Git history only and run without either. EDUCATE, REFRESH and authoring stop without Archify and give the Rig install instruction. The exporter stops without a Google Chrome or Chromium and gives Archify's own message, `Chrome or Chromium is unavailable. Set ARCHIFY_CHROME to its executable path.`; the browser is the machine's, not a development dependency of the adopting repository or of the harness.

## Island diagrams

A knowledge-base island keeps diagrams too, under the same tool, types, forms, manifest and privacy rules. An island diagram explains a model or a process rather than code, so its source and manifest cite the notes it draws from in place of traced source files: `traced` lists those notes' island-relative paths, and the audit's freshness check reads their history as it reads code. Its `stale_when` names the changes to those notes that would make it untrue. An island usually embeds its diagrams in notes and reports rather than serving a viewer, so a static `light` or `ki` form often suits it better than `dual`.
