---
id: KI-HARNESS-GOV-205
area: GOV
title: Static light diagram export
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-17T22:06:58Z
---

# KI-HARNESS-GOV-205: Static Light Diagram Export

## Goal

`skills/governance/ki-diagrams/scripts/export-svg.ts` offers a static flattened light export option beside its dual-theme default, and `ki-pmo-design` and `ki-diagrams` state that a design report carries its diagrams as inline text diagrams or as exported static SVGs committed beside the subject's Project note, so that every diagram a report shows renders legibly in any previewer.

## Context

Kris Brown answered DIAGRAMS-EXPORT on 17 October 2026 at 22:50 BST in the ways-of-working thread: "Add a ki-agentic-harness triage record for a static flattened light export option in export-svg.ts and a ki-pmo-design and ki-diagrams rule that design reports use inline text diagrams or exported static SVGs beside a Project note."

The [diagram-fix run report](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_THREADS/state-of-play/diagram-fix.report.md) found the cause. The exporter writes Archify's dual-theme SVG, dark by default, whose fills, strokes and text colours come from CSS custom properties, `color-mix()` and `:is()` rules in an embedded stylesheet with inlined web fonts. A previewer that does not run that CSS, such as Zed's renderer or `rsvg-convert`, falls back to black, so text and boxes vanish. The run fixed four diagrams by flattening each under Archify's light theme in headless Chrome into a static SVG with plain hex colour attributes, a light background, real `<text>` in a system monospace stack, and no stylesheet, variables or embedded fonts. It used a one-off script outside any repository, so a re-export from source brings the dark dual-theme SVG back.

## Boundary

- In: a light, static, flattened export option in `export-svg.ts`, built on the existing Chrome driver, with its tests and usage; the `ki-diagrams` rule on when to use it and how the manifest records it; the `ki-pmo-design` rule that design reports use inline text diagrams or exported static SVGs beside the Project note; regenerated skill surfaces.
- Out: changing the dual-theme default for living diagrams elsewhere; changing Archify; re-exporting existing diagrams in other repositories, which their owners do.

## Discussion

Captured on Kris Brown's DIAGRAMS-EXPORT answer. Questions for planning: whether the static option should become the default for report diagrams only or for every diagram; whether the exporter's fail-closed checks, canonical export receipt and external-reference refusal apply unchanged to the flattened form; and whether the manifest needs a field naming the export form.
