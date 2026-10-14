---
id: KI-HARNESS-GOV-179
area: GOV
title: Diagram HTML commit opt-in
project: ways-of-working
component: governance
kind: deliver
status: draft
horizon: hold
hold:
  reason: parked
  condition: The roadmap burn-down leaves room for new capability; nothing depends on committing the HTML before then
  review: 2026-11-16
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T22:55:00Z
updated_at: 2026-10-14T06:52:07Z
---

# Diagram HTML Commit Opt-In Through the Manifest

## Goal

A repository that adopts `ki-diagrams` says in its diagrams manifest whether it commits a diagram's interactive HTML beside the source and the SVG, so the choice is declared and audited rather than inferred from whether the repository "serves" its diagrams. The harness opts in, so its skill graph's interactive view is in Git beside the static one.

## Context

The `ki-diagrams` standard commits two forms of every diagram, the source and the SVG, and keeps the third out of Git unless the repository serves it: "Interactive HTML - `<slug>.html`, the finalized viewer with search, focus, zoom and source links, roughly 800 KB per diagram. Committed only by a repository that serves it, such as a documentation site. Otherwise it is rebuilt locally under `+/diagrams/<slug>/` and never committed." The embedding rule follows the same split: a repository that serves its diagrams "commits the HTML and links the figure to it", and one that does not "commits only the source and the SVG", leaving a reader such as the Observatory to offer the interactive view once `finalize` has written it locally.

The harness skill graph, delivered under the explicit skill dependency graph record, and the change-management skills diagram in Knowledge Islands Principal were both committed as source and SVG with the HTML left untracked under `+/diagrams/<slug>/`, as the standard requires. The `ways-of-working` thread put the question to Kris as `HTML-COMMIT`, whether a repository should be able to commit the HTML by declaring it, and Kris answered on 2026-10-13, in words that reached the thread with stop words stripped, quoted as received: "HTML-COMMIT - (a) manifest opt-in to commit the HTML; harness opts in." The manifest is the right place because the standard already makes `docs/diagrams/diagrams.toml` "the machine-readable authority" that "a reader such as the Observatory can list a repository's diagrams and flag stale ones" from, and the audit's DIAG-1 criterion already requires that "every file under `docs/diagrams/` belongs to a listed diagram", which an HTML file cannot satisfy today.

This record is captured from Kris's answer and is not adopted, planned or implemented by it.

## Boundary

- The manifest opt-in, the standard's two rules it changes, the audit's acceptance of a declared HTML file, the refresh procedure's output path and the harness's own opt-in for its skill graph.
- Not the SVG exporter or the Playwright prerequisite, which the browser-free SVG extractor record investigated and closed on its finding, and whose pinned-stylesheet follow-on is held with Kris.
- Not Knowledge Islands Principal's change-management diagram: each adopting repository makes its own declaration, and that diagram is design working material in any case.
- Not a site that serves the HTML, and no change to how the Observatory or any reader discovers it.

## Discussion

### What the opt-in changes

Today the standard decides by a property of the repository, "a repository that serves it", which nothing declares and the audit cannot read. The opt-in makes it a manifest field, so the standard's Committed forms and Embedding rules read from the declaration: with the opt-in the HTML is a third committed form under `docs/diagrams/`, the README's figure links onward to it, and step 3 of the refresh procedure writes `<slug>.html` to `docs/diagrams/` as the standard already says for a serving repository; without it the HTML stays under `+/diagrams/<slug>/` and is never committed, as now. The audit's DIAG-1 then accepts a `<slug>.html` only where its diagram declares the opt-in and fails one that is present without it or absent with it. The privacy rule applies to the committed HTML as it does to the source and the SVG, since the finalized viewer embeds the source.

### Open questions

- Whether the field is per diagram, in each slug's table, or once for the repository. The manifest "has one table per slug and no other content", so a per-diagram field such as `commit_html = true` fits the existing shape; a repository-level field would need the manifest's shape to change.
- Whether the harness's skill-graph sync check, which regenerates the source and compares it, should also rebuild the HTML or only confirm that the committed HTML was finalized from the committed source.
- The cost in Git history of an 800 KB file that changes with every regeneration, against the benefit Kris chose: an interactive view of the skill graph that is in the repository rather than rebuilt by each reader.

### Adoption

On 14 October 2026 Kris approved the state-of-play thread's triage burn-down as written, under Kris's instruction to burn the roadmap down: adopted as `deliver / Hold` until 2026-11-16. Nothing depends on the committed HTML, which can be rebuilt locally, and each regeneration adds about 800 KB to Git history; the burn-down comes first. Adoption grants no planning, implementation or acceptance authority.
