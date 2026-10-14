---
id: KI-HARNESS-GOV-193
area: GOV
title: Area diagrams with HTML
project: ways-of-working
component: governance
purpose: capability
kind: deliver
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: b4e2c5cd3198c39c99e186a736f3d451efaaa779
created_at: 2026-10-14T20:27:36Z
updated_at: 2026-10-14T21:50:01Z
---

# Area Diagrams With HTML

## Goal

The harness explains its skills through the right set of diagrams rather than one large graph: one generated dependency diagram per source concern under `skills/`, the skill map kept as their index, and a hand-traced workflow diagram of the coordinating-thread model. Every diagram's interactive HTML is committed beside its source and SVG through a declared manifest opt-in, and one local command builds all of it.

## Context

Kris set the record's home on 2026-10-14 in the `ways-of-working` thread: "open one new ki-agentic-harness roadmap item at Now, on my direct instruction, covering the eight area diagrams and the committed HTML with its build command, and the roadmap item sits in this initiative/project". The Project is `ways-of-working`, whose Initiative is `knowledge-islands-model`.

The diagram set comes from three decisions of the same day, quoted as recorded in the thread's decisions log:

- SUBGRAPHS: "Build eight area dependency diagrams ..., each showing the area's skills, what they rely on outside, and what relies on them; retire the big skill graph and keep the area map as the index."
- HTML: "Add one local build command for all diagram HTML." On committing the HTML, the substance of the cancelled `KI-HARNESS-GOV-179`: "I definitely want to get that done sooner rather than later. There's no reason for it to be on hold. So we can remove that hold and we can move it into now." The opt-in shape was answered on 2026-10-13 as HTML-COMMIT: "(a) manifest opt-in to commit the HTML; harness opts in."
- THREAD-DIAGRAM: "build thread-model as an Archify workflow diagram under docs/diagrams/, traced from ki-pmo and ki-delegation with the skills-map text diagram as its brief, in the same run as the area diagrams".

RUNTIME-TAG, on whether a box should mark a runtime-bound skill: "Leave it out." AREA-ACCEPT: Kris accepts after the area diagrams are delivered.

`KI-HARNESS-GOV-183` delivered the skill map and skill graph as generated sources under `ki-repo-harness` `CAP-4`. `KI-HARNESS-GOV-179` proposed the HTML opt-in and was cancelled as parked on 2026-10-14 before the HTML decision brought it back.

## Boundary

- In scope: a generated area diagram per source concern, derived from `SKILL.md` frontmatter beside the skill map in `ki-repo-harness`, covered by `CAP-4` and by `skill-graph.ts --check|--write`; retiring the skill graph from the generated set and from `docs/diagrams/`; the hand-authored `thread-model` workflow diagram; a per-diagram `commit_html` manifest field in `ki-diagrams`, its standard, audit and templates; one local build command for every diagram's HTML; `docs/diagrams/README.md` and `diagrams.toml` for the full set; this record.
- Out of scope: Knowledge Islands Principal's links to `docs/diagrams/`, which its own thread retargets if needed; Archify itself and the SVG exporter's browser route; any served documentation site; runtime-bound markers on boxes.

## Requirements

- Each area diagram puts the area's skills in one region, the outside skills they rely on grouped by area below, and the outside skills that rely on them grouped by area above, with solid `ki-depends-on` and dashed `ki-optional-depends-on` edges.
- The sources are deterministic: `CAP-4` AUDIT compares each committed source with its rendering, ignoring only the traced revision, and CONFORM rewrites a missing or stale one; `skill-graph.ts --check|--write` covers the same set.
- The skill-graph source, SVG and manifest entry are removed, and `CAP-4` no longer expects them.
- `thread-model` is an Archify `workflow` diagram whose steps cite the `ki-pmo` and `ki-delegation` sources they were traced from.
- A diagram whose manifest table sets `commit_html = true` commits `docs/diagrams/<slug>.html`; the `ki-diagrams` audit accepts that file only under the opt-in and applies the privacy checks to it; the README figure links to it.
- One command builds every diagram's HTML from the manifest, finalizing at showcase quality and copying opted-in HTML into `docs/diagrams/`.
- Every diagram passes Archify's four finalize gates at `--quality showcase` with `--repo-root`.

## Current state

`docs/diagrams/` holds the skill map and skill graph sources and SVGs, refreshed at `f847248b`. `CAP-4` generates both from `SKILL_DIAGRAMS` in `skill-diagrams.ts`. The `ki-diagrams` standard keeps HTML out of Git unless a repository serves it, and `DIAG-1` rejects any unlisted file under `docs/diagrams/`. The thread model exists only as the text diagram in the `skills-map` report.

## Steps

- [x] Add the area-diagram builder beside `skill-map.ts`, register the eight areas in `SKILL_DIAGRAMS` and drop the skill graph from it; cover it with tests.
- [x] Update `CAP-4`'s rubric text, the harness standard, `SKILL.md` and the CLI header for the new set; republish the rubric.
- [x] Add `commit_html` to the `ki-diagrams` manifest, standard, templates and audit, with tests.
- [x] Add the build command for every diagram's HTML.
- [x] Generate the area sources; finalize every diagram at showcase and export SVGs; remove the skill-graph files.
- [x] Author, finalize and export `thread-model`.
- [x] Update `docs/diagrams/README.md` and `diagrams.toml` for the full set.
- [x] Run the gates and set the record awaiting review.

## Files touched

`skills/repo-structure/ki-repo-harness/` (contexts, rubric items, rubric, standard, `SKILL.md`, CLI), `skills/governance/ki-diagrams/` (standard, rubric, audit, assets, build script), `docs/diagrams/`, `package.json` and this record.

## Verify

`bun run test`; `bunx tsc --noEmit`; `ki repo audit --skill ki-repo-harness`, `--skill ki-skills`, `--skill ki-diagrams` and `--skill ki-work-roadmap`; `ki dev skill rubric ki-repo-harness`; `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`; Archify finalize gates for every diagram.

## Dependencies / blocks

None. Archify, a system Chrome and Playwright are installed locally and are not package dependencies.

## Documentation impact

### Decision Records

None expected: the opt-in is a standard field Kris decided, recorded here and in the standard.

### Specifications

None.

### Guides

None; `docs/diagrams/README.md` is the reader-facing index.

### Roadmap

None beyond this record.

## Review

### Delivered

The approved boundary, delivered on the baseline `b4e2c5cd3198c39c99e186a736f3d451efaaa779` in the commits that follow this record's opening at `b7d3b53e`: eight generated area diagrams beside the skill map under `CAP-4`, the skill graph retired, the hand-traced `thread-model` workflow diagram, the `commit_html` manifest opt-in in `ki-diagrams`, one build command for every diagram's HTML, and the manifest and README for the ten diagrams. Excluded as planned: Knowledge Islands Principal's links, Archify, the exporter's browser route, a served site and runtime-bound markers.

### Change Summary

- `ki-repo-harness`: `skill-areas.ts` builds one architecture source per concern, the concern's skills in one region, the outside skills they rely on grouped by concern below and their outside dependents grouped by concern above, every edge running downward. `SKILL_DIAGRAMS` lists the map then the eight areas; `skill-graph.ts` keeps only the shared node reader and legend. `CAP-4`'s text, the harness standard, `SKILL.md` and the CLI help name the new set; the rubric is republished.
- `ki-diagrams`: an optional `commit_html = true` manifest field. `DIAG-1` accepts `<slug>.html` only under it and then requires the file and a README link to it; `DIAG-2` applies the privacy checks to committed HTML. `scripts/build-html.ts` finalizes every listed diagram at showcase quality with `--repo-root` and a fresh `--out-dir` under `+/diagrams/<slug>/build/`, copies opted-in HTML into `docs/diagrams/`, and with `--svg` re-exports each SVG. The standard, `SKILL.md`, Mode EDUCATE and REFRESH, the templates and the rubric say so.
- `package.json`: the repository-owned `self:diagrams:html` script runs the build command; no dependency was added.
- `docs/diagrams/`: the skill-graph source and SVG removed; eight `skill-area-<concern>` sources, `thread-model.workflow.json`, and an SVG and committed HTML for each of the ten diagrams; `diagrams.toml` opts every diagram in; each README figure links to its HTML.
- Deviations: none of scope. The area counts are keystone 3 skills, governance 13, change-management 13, repo-structure 16, agentic-systems 4, environment 9, acquire 3 and design 2; design has no declared relationship, so its diagram shows its two skills alone. `thread-model` cites the `ki-pmo` and `ki-delegation` headings at the pinned revision `b7d3b53e`, because Archify checks line evidence against the committed file and both standards carry another thread's uncommitted edits.

### Verification

- `bun run test`: 1176 pass, 0 fail across 168 files.
- `bunx tsc --noEmit`: clean.
- `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`: all nine generated sources in sync.
- `ki dev skill rubric ki-repo-harness` and `ki dev skill rubric ki-diagrams`: in sync.
- `ki repo audit --skill ki-work-roadmap`: PASS, 15/15.
- `ki repo audit --skill ki-skills`: no failure, the two pre-existing `LONG-3` warnings. `--skill ki-repo-harness` on a clean checkout of the committed result: the only failure is `CAP-2` on `skills/README.md`, already present on `origin/main` because `cf601d66` changed the `ki-pmo` description without regenerating the catalogue; this record's commits touch neither file, and the primary checkout's `skills/README.md` carries another thread's uncommitted edits, so it is left to that thread.
- `ki repo audit --skill ki-diagrams` on the clean checkout: no failure once the nine generated diagrams' `last_checked` names `6aa00567`, the commit whose `SKILL.md` frontmatter they were generated from.
- `bun run self:diagrams:html --svg`: all ten diagrams pass Archify's four finalize gates at `--quality showcase` with `--repo-root`; each SVG was inspected by eye.
- `git diff --check` and `rumdl check` on the touched Markdown: clean.

### Outstanding concerns

- Crossings remain advisory on the denser areas (governance, repo-structure, environment, change-management); they passed the hard gates and read acceptably, but a later layout pass could reduce them.
- The label `agent-coordination-paperclip` slightly overflows its node in the areas that show it.
- Knowledge Islands Principal's Engineering Practice Pillar and the `ways-of-working` Project note may link `docs/diagrams/skill-graph.svg`, which no longer exists; that repository retargets its own links.
- `+/diagrams/` holds local build output and is untracked; it is not ignored in `.gitignore`.

### Post-change review

The skill map stays the index and now says each concern has an area diagram. Every generated source is regenerated by `CAP-4` CONFORM and checked by AUDIT; every diagram's HTML is rebuilt by one command and committed under the opt-in the audit enforces. Ready for Kris's acceptance, as AREA-ACCEPT set.

### Mini recap

Eight area diagrams and a thread-model workflow replace the single skill graph; diagram HTML is committed through a `commit_html` opt-in and built by one command; all gates green on the delivered paths. Learning route: none beyond this record and the run report.

## Discussion

Layout rule revised at Kris's request on 2026-10-14, after delivery; the record stays awaiting review. Each area's own skills now form a compact, near-square block instead of layers across the full width: every group of linked skills starts at its hub and takes its neighbours outward, the skills linked from above head a column and those linking below end one, a skill with both gets a column of its own, and the rest read down one column and up the next. Agentic Systems now reads `subagents` beside `subagents-claude`, then `agent-coordination-paperclip` beside `subagents-chatgpt`, under `repo-harness` and above `git`. Edges inside a region now run from a dependent back to the hub it sits beside rather than always downward; edges between regions still run downward. All eight area diagrams pass Archify's showcase gates.

Capability subgroups and plainer labels added at Kris's request on 2026-10-14, after delivery; the record stays awaiting review. A small grouping table in the generator nests a region per capability group inside four concerns, titled `<Concern> · <Group>`: Change Management splits into Work items, Delivery cycle and Programme; Governance into Writing and records, Coordination, Code and Git, and Radars; Repo Structure into Knowledge bases, Websites, and Projects and tools; Environment into MCP binding, Tokenomics and Housekeeping. Keystone, Agentic Systems, Acquire and Design stay one region each. The skill map nests the groups, each area diagram nests its own concern's groups and titles its outside regions by concern and group, and a test keeps every skill of a split concern in exactly one group. The applicability words now read always on, automatic, opt-in and command in sublabels, legends and the map's reading card. All nine generated diagrams pass Archify's showcase gates within 1395px.
