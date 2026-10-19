---
id: KI-HARNESS-GOV-205
area: GOV
title: Static light diagram export
project: ways-of-working
component: governance
kind: deliver
priority: medium
size: l
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-19T23:30:55Z
---

# KI-HARNESS-GOV-205: Static Light Diagram Export

## Goal

`skills/governance/ki-diagrams/scripts/export-svg.ts` offers a static flattened light export option beside its dual-theme default, and `ki-work-design` and `ki-diagrams` state that a design report carries its diagrams as inline text diagrams or as exported static SVGs committed beside the subject's Project note, so that every diagram a report shows renders legibly in any previewer. The exporter also offers a KI-theme export that carries the `ki-design` palette, fonts and glyphs, so that the one diagram standard, Archify through `ki-diagrams`, looks like Knowledge Islands and stays readable in viewers that do not run Archify's CSS.

## Context

Kris Brown answered DIAGRAMS-EXPORT on 17 October 2026 at 22:50 BST in the ways-of-working thread: "Add a ki-agentic-harness triage record for a static flattened light export option in export-svg.ts and a ki-work-design and ki-diagrams rule that design reports use inline text diagrams or exported static SVGs beside a Project note."

The [diagram-fix run report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki/diagram-fix.report.md) found the cause. The exporter writes Archify's dual-theme SVG, dark by default, whose fills, strokes and text colours come from CSS custom properties, `color-mix()` and `:is()` rules in an embedded stylesheet with inlined web fonts. A previewer that does not run that CSS, such as Zed's renderer or `rsvg-convert`, falls back to black, so text and boxes vanish. The run fixed four diagrams by flattening each under Archify's light theme in headless Chrome into a static SVG with plain hex colour attributes, a light background, real `<text>` in a system monospace stack, and no stylesheet, variables or embedded fonts. It used a one-off script outside any repository, so a re-export from source brings the dark dual-theme SVG back.

This record also carries the open concern of [KI-HARNESS-GOV-217](https://github.com/knowledgeislands/ki-agentic-harness/blob/87da1b26/docs/roadmap/KI-HARNESS-GOV-217-coordination-and-work-design-renames.md), folded here on 18 October 2026 under Kris's PRUNE-HELD a) answer: the harness `thread-model` diagram stays pinned at `b7d3b53e`, where its cited `ki-pmo` paths exist, and renaming its node label and sources means re-tracing it at HEAD under its `regenerate` instruction in `docs/diagrams/diagrams.toml`.

Kris Brown widened the scope on 19 October 2026 in the Observatory work, answering DIAGRAM-STANDARD through the RECOMMENDED answer, "Go with recommendations taking the above into account." Its recommended course, taken as read back in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md), is that Archify through `ki-diagrams` is the one diagram standard, extended to the knowledge-base islands, with a KI-theme export folded into this record; D2 stays allowed only for diagrams generated from code, on the tokens; and Mermaid is excluded, following the NO-MERMAID answer of 18 October 2026, "I don't want mermaid as a diagram standard really, its pants". The theme maps colours from the `packages/tokens` night and day themes in `ki-design` as plain colour attributes any viewer renders, uses the `font.mono` system stack instead of embedded JetBrains Mono, and uses KI glyphs where the symbol library carries the meaning; the JSON source and interactive viewer stay as they are. The same day Kris kept the name `ki-diagrams` under ADR-KI-HARNESS-SKILLS-003 (DIAGRAM-NAME). The Mermaid audit warning the DIAGRAM-REPLACE answer relies on is [KI-HARNESS-GOV-221](KI-HARNESS-GOV-221-ki-diagrams-mermaid-fence-warning.md).

## Boundary

- In: a light, static, flattened export option in `export-svg.ts`, built on the existing Chrome driver, with its tests and usage; the `ki-diagrams` rule on when to use it and how the manifest records it; the `ki-work-design` rule that design reports use inline text diagrams or exported static SVGs beside the Project note; regenerated skill surfaces.
- In: re-tracing the `thread-model` diagram at HEAD under its `regenerate` instruction, and re-exporting it.
- In: a KI-theme export option in `export-svg.ts`, mapped from the `ki-design` tokens as above, flattened like the static light form so that it needs no stylesheet, variables or embedded fonts; its tests and usage; the `ki-diagrams` standard text the decision changes, as proposed under Discussion; regenerated skill surfaces.
- Out: changing the dual-theme default for living diagrams elsewhere; changing Archify; re-exporting existing diagrams in other repositories, which their owners do.

## Discussion

Captured on Kris Brown's DIAGRAMS-EXPORT answer. Questions for planning: whether the static option should become the default for report diagrams only or for every diagram; whether the exporter's fail-closed checks, canonical export receipt and external-reference refusal apply unchanged to the flattened form; and whether the manifest needs a field naming the export form.

The 19 October decision leaves the `ki-diagrams` standard narrower than the decision in three places, proposed here rather than edited because each changes scope rather than fixing a sentence outright:

- `references/standards-diagrams.md`, opening paragraph: "This standard defines how a Knowledge Islands repository keeps living diagrams" becomes "This standard defines how a Knowledge Islands repository or knowledge-base island keeps diagrams", with a short section on island diagrams, which explain a model or process rather than code and so cite the notes they draw from in place of traced source files.
- The same file, [The tool: Archify](../../skills/governance/ki-diagrams/references/standards-diagrams.md#the-tool-archify): "D2 is the best addition only for maps generated mechanically from code" becomes "D2 is allowed only for maps generated mechanically from code, such as a route manifest or a dependency graph, styled from the `ki-design` tokens; it has no interactive HTML", and "Mermaid and Graphviz were excluded" gains "Mermaid diagrams found in a repository are replaced by Archify diagrams wherever Archify can carry them, and the rest are flagged to the owner".
- The same file, [Committed forms](../../skills/governance/ki-diagrams/references/standards-diagrams.md#committed-forms): the SVG form names the KI-theme export once it exists, and whether it replaces the dual-theme default is a planning question for this record.
