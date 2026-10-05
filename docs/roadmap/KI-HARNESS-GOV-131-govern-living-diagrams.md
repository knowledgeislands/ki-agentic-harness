---
id: KI-HARNESS-GOV-131
area: GOV
title: Govern living diagrams
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-04T09:41:34Z
updated_at: 2026-10-05T08:41:49Z
---

# KI-HARNESS-GOV-131: Govern living diagrams

## Goal

Every KI repository that keeps diagrams keeps them the same way, under a `ki-diagrams` governance skill that does for diagrams what `ki-authoring` does for prose: a standard, a rubric, exemplars, and an audit and conform pair.

## Context

The owner reads diagrams more readily than prose and asked on 2026-10-03 for one consistent, good-looking way to keep diagrams across repositories. `apps-observatory` piloted it in `KI-OBS-APP-034`. That pilot established the following:

- **Committed forms:** seven Archify diagrams under `docs/diagrams/`, each committed as a JSON source traced to file and line plus a self-contained dual-theme SVG. The interactive HTML is rebuilt locally under `+/diagrams/` and never committed.
- **Manifest:** `docs/diagrams/README.md`, with one section per diagram giving question and audience, type, sources traced, staleness triggers, a regeneration prompt, the last checked revision, and the embedded SVG.
- **SVG export:** a Playwright script drives the viewer's own Export > SVG action, because Archify's command line has no SVG export.

On 2026-10-04 the owner ruled out a repository-local decision record for the tool choice. The standard, and the rationale for choosing Archify, belong in the harness.

## Boundary

The skill owns:

- the diagram standard: tool, committed forms, manifest shape, naming, and privacy rules;
- the choice of diagram type for a question;
- the regeneration and freshness procedure;
- the audit checks;
- the SVG exporter, shipped in the skill's `scripts/`.

Archify itself, its schemas and its viewer stay upstream. Prose style stays with `ki-authoring`, and where a guide may embed a diagram stays with `ki-guides`. Adopting the skill in a repository, including this harness's own Graphviz figure under `docs/diagrams/`, is that repository's own work. No GDR is written: the skill's standard carries the tool rationale.

## Current state

- No `ki-diagrams` skill exists; the harness publishes 61 skills, 51 of them governance (`README.md`, `skills/README.md`).
- The pilot lives in `apps-observatory`: `docs/diagrams/README.md` (prose manifest with question, audience, type, traced sources, staleness trigger, regeneration prompt and last checked revision), seven `<slug>.<type>.json` sources with matching `<slug>.svg`, and `scripts/diagrams/export-svg.ts` (93 lines, Playwright and Chromium driving the viewer's Export > SVG action). Its interactive HTML is rebuilt under `tmp/diagrams/` and never committed.
- Archify is installed for the principal as an Agent Skill through Rig (`[skill.archify]` in the chezmoi-managed `~/.config/rig/conf.d/60-skills.toml`, source `tt-a1i/archify`); its CLI is `node <archify>/bin/archify.mjs finalize ...`.
- New governance skills follow the pattern of `skills/governance/ki-guides/`: `SKILL.md`, `references/` (standard, modes, generated `rubric.md`, `sources.md`, `exemplars.md`) and `scripts/rubric/` with the vendored `ki-skills:rubric` shared module. Registration is the generated catalogue (`ki repo conform --skill ki-repo-harness`), the counts in `README.md`, and the counts in `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`. No `tools-ki` or `.ki.toml` registration is needed, and the harness does not declare the skill for itself.
- `playwright` is not a harness dependency.

## Steps

- [ ] Scaffold `skills/governance/ki-diagrams/` through `ki-skills` Mode EDUCATE: `SKILL.md` with `ki-kind: governance`, `ki-applicability: declaration-only`, `ki-depends-on: []`, `ki-shared-dependencies: [ki-skills:rubric]`, modes AUDIT, CONFORM, EDUCATE and REFRESH, and a `compatibility` field declaring Archify and Playwright with Chromium as optional prerequisites.
- [ ] Write `references/standards-diagrams.md`: the Archify choice and its rationale, moved from this record's "Tooling considered" with its sources; the five diagram types and how a question maps to one; committed forms (`docs/diagrams/<slug>.<type>.json` and `<slug>.svg`; HTML committed only by a repository that serves it, otherwise rebuilt under `+/diagrams/`); the manifest; naming; privacy (no local absolute path, private repository name or personal identity in a source or SVG); the regeneration and freshness procedure; both embedding cases, each linking onward to the interactive view; and degradation without Archify (AUDIT runs on committed files alone; EDUCATE, REFRESH and export stop with the Rig install instruction).
- [ ] Define the manifest as `docs/diagrams/diagrams.toml`, one table per slug with `type`, `question`, `audience`, `traced`, `stale_when`, `regenerate` and `last_checked`, as the machine-readable authority; `docs/diagrams/README.md` remains the reader-facing index that embeds each SVG. Ship both templates under `assets/`.
- [ ] State that no diagram set is mandatory for any repository shape; give a recommended starter set per shape (project and harness: architecture and one workflow; MCP server: architecture and one request sequence; Knowledge Base: none by default) as EDUCATE guidance.
- [ ] Port the exporter to `scripts/export-svg.ts`: import `playwright` dynamically and fail closed with an install hint when it is absent; factor argument validation and the external-reference refusal into pure functions; cover them in `scripts/export-svg.test.ts` without launching a browser.
- [ ] Add the rubric under `scripts/rubric/`: a context reading the manifest, sources, SVGs and read-only Git history; `DIAG-1` (manifest and files agree both ways, `FAIL`); `DIAG-2` (no absolute path or private identity in a source or SVG, `FAIL`); `DIAG-3` (SVG self-contained, no external reference, `FAIL`); `DIAG-4` (a traced path changed since `last_checked`, `WARN`, with judgment on whether the change matches `stale_when`); `DIAG-5` (judgment: `finalize --quality showcase` passes and the type answers the question). Vendor `scripts/shared/rubric.ts` from `ki-guides`; add `index.test.ts`, `publication.ts` and fixture tests for each mechanical item.
- [ ] Write `references/mode-audit.md`, `mode-conform.md` (scaffold the manifest and README from `assets/` only, never author or regenerate a diagram), `mode-educate.md`, `mode-refresh.md`, `sources.md` (Archify and the considered alternatives) and `exemplars.md` (the Observatory set at a pinned revision); generate `references/rubric.md` with `ki dev skill rubric ki-diagrams`.
- [ ] Add a one-line Archify entry to "Adopted" in [ADR-KI-HARNESS-TOOLCHAIN-002](../decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md) linking `skills/governance/ki-diagrams/references/standards-diagrams.md`, consistent with how [KI-HARNESS-FND-028](KI-HARNESS-FND-028-adopt-qmd-kb-search.md) records qmd there.
- [ ] Register the skill: run `ki repo conform --skill ki-repo-harness` to republish the generated catalogue in `skills/README.md`; increment the skill counts in `README.md` by one each; increment the counts in `remediation-inventory.test.ts` rather than hardcoding them.
- [ ] Raise a knowledge trade to ki-website proposing a skills-by-outcome entry for keeping diagrams, and a knowledge trade to apps-observatory reporting that the exporter now ships in `ki-diagrams` so it may retire `scripts/diagrams/export-svg.ts` when it adopts the skill.

## Files touched

- `skills/governance/ki-diagrams/SKILL.md` (new)
- `skills/governance/ki-diagrams/references/standards-diagrams.md` (new)
- `skills/governance/ki-diagrams/references/mode-audit.md` (new)
- `skills/governance/ki-diagrams/references/mode-conform.md` (new)
- `skills/governance/ki-diagrams/references/mode-educate.md` (new)
- `skills/governance/ki-diagrams/references/mode-refresh.md` (new)
- `skills/governance/ki-diagrams/references/sources.md` (new)
- `skills/governance/ki-diagrams/references/exemplars.md` (new)
- `skills/governance/ki-diagrams/references/rubric.md` (new, generated)
- `skills/governance/ki-diagrams/assets/diagrams.toml` (new)
- `skills/governance/ki-diagrams/assets/README.md` (new)
- `skills/governance/ki-diagrams/scripts/export-svg.ts` (new)
- `skills/governance/ki-diagrams/scripts/export-svg.test.ts` (new)
- `skills/governance/ki-diagrams/scripts/rubric/contexts/diagrams.ts` (new)
- `skills/governance/ki-diagrams/scripts/rubric/items/index.ts` (new)
- `skills/governance/ki-diagrams/scripts/rubric/items/diagrams.ts` (new)
- `skills/governance/ki-diagrams/scripts/rubric/items/publication.ts` (new)
- `skills/governance/ki-diagrams/scripts/rubric/items/index.test.ts` (new)
- `skills/governance/ki-diagrams/scripts/shared/rubric.ts` (new, vendored)
- `docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-002-complementary-tooling-current-adoptions.md`
- `skills/README.md` (generated catalogue)
- `README.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`
- `-/_TRADES/knowledgeislands/ki-website/TRD-<id>.md` (new)
- `-/_TRADES/knowledgeislands/apps-observatory/TRD-<id>.md` (new)

## Verify

1. `ki repo audit --skill ki-skills` passes for `ki-diagrams`, and `skills/README.md` lists it in the generated catalogue with the counts in `README.md` matching.
2. `standards-diagrams.md` carries the Archify rationale and the considered alternatives with sources; `ADR-KI-HARNESS-TOOLCHAIN-002` lists Archify under "Adopted" in one line linking that standard; no new Decision Record exists.
3. Run against a copy of the `apps-observatory` diagram set with a `diagrams.toml` added, `ki repo audit --skill ki-diagrams` passes `DIAG-1` to `DIAG-3`. Fixture tests show `DIAG-1` failing for an unlisted source and for a listed slug without an SVG, `DIAG-2` failing for a `/Users/` path, `DIAG-3` failing for an external `href`, and `DIAG-4` warning when a traced file changed after `last_checked`.
4. The audit writes nothing and runs without Archify or Playwright installed.
5. `bun skills/governance/ki-diagrams/scripts/export-svg.ts` without Playwright exits non-zero with an install hint; with it, exporting an Observatory HTML build yields an SVG byte-identical to the committed one.
6. `bun run test` and `bunx tsc --noEmit` pass, and the remediation inventory test reflects the new catalogue.

```bash
bun run test
bunx tsc --noEmit
ki dev skill rubric ki-diagrams
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-repo-harness --progress never
ki repo audit --skill ki-authoring --progress never
```

Follow-on, outside acceptance: ki-website and apps-observatory dispose of their trades; each adopting repository declares `[skills.ki-diagrams]` in its own work.

## Dependencies / blocks

None. Archify upstream command-line SVG export would let the exporter shrink to a wrapper, but the shipped Playwright exporter makes it unnecessary for this record.

Sequencing: this record and [KI-HARNESS-GOV-121](KI-HARNESS-GOV-121-require-substantive-store-mirrors.md) both edit the counts in `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`. Increment, do not hardcode; whichever lands second rebases.

## Documentation impact

### Decision Records

None. The owner ruled out a repository-local decision record on 2026-10-04 and the decision below keeps the rationale in the skill's standard rather than a GDR.

### Specifications

`standards-diagrams.md` (new) is the behaviour contract; its generated `rubric.md` publishes `DIAG-1` to `DIAG-5`.

### Guides

None in this repository. The skills-by-outcome guide is website-owned and reached by the ki-website trade.

### Roadmap

None in this repository beyond the outbound trades.

## Discussion

### Candidate checks

- Every diagram listed in the manifest has a source and an SVG, and every source is listed.
- Every source passes `finalize` at showcase quality.
- No source or SVG carries a local absolute path or private identity.
- No diagram is stale. A source is stale when its traced files changed after its last checked revision in a way its staleness triggers name. The mechanical part could compare file digests and leave the judgement to review.

### Embedding

A second pilot, a project documentation site, embeds each diagram as an inline figure with an **Interactive** control that opens the full viewer in an overlay, or in a new tab on a modified click. It commits the HTML because the site serves it. The Observatory pilot does not commit the HTML and embeds only the SVG (`KI-OBS-VIS-016` there). The standard should name both cases:

- a repository that serves its diagrams commits the HTML;
- a repository that does not, commits only the source and the SVG;
- in both, the inline figure links onward to the interactive view.

The manifest should also be machine-readable, so a reader such as the Observatory can list diagrams and flag stale ones without parsing prose.

### Decision

Create a `ki-diagrams` standard carrying the Archify rationale, with no GDR; the exporter ships in the skill's `scripts/`; Archify is declared an optional prerequisite. Decided by the Fable reviewer under delegated autonomy, reversible.

The former open questions are resolved as follows: the standard carries the rationale; the exporter lives in the skill's `scripts/` rather than vendored per repository or as a `ki` command; Archify is an optional prerequisite installed through Rig, and a repository without it can still be audited; no diagram set is mandatory, and the standard recommends a starter set per repository shape.

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
