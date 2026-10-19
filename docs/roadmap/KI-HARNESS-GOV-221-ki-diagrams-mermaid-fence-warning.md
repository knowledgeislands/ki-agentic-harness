---
id: KI-HARNESS-GOV-221
area: GOV
title: ki-diagrams Mermaid fence warning
project: observatory
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T07:17:31Z
updated_at: 2026-10-19T07:17:31Z
---

# KI-HARNESS-GOV-221: ki-diagrams Mermaid Fence Warning

## Goal

`ki repo audit --skill ki-diagrams` warns on every fenced `mermaid` code block in a repository's tracked Markdown, naming the file and line, so that each Mermaid diagram left after the Archify migration is visible until it is replaced or the owner has decided to keep it.

## Context

Kris Brown answered DIAGRAM-REPLACE on 19 October 2026 in the Observatory work: "Re mermaid diagrams, if they can be replaced with archify they should be, e.g. activity diagrams. Flag any others that don't and I'll decide about them too". The recommended course Kris took the same day under RECOMMENDED, "Go with recommendations taking the above into account.", includes a `ki-diagrams` audit item that warns on any Mermaid fence. Both are logged in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md). The obs-diagrams survey counted 34 Mermaid fences in 24 files across 9 repositories; the migration pilots in ki-principal and the Observatory, then hands off to each other repository.

The standard already excludes Mermaid in [The tool: Archify](../../skills/governance/ki-diagrams/references/standards-diagrams.md#the-tool-archify). The current DIAG criteria cover only `docs/diagrams/` and its manifest, so a Mermaid fence elsewhere goes unseen. [KI-HARNESS-GOV-205](KI-HARNESS-GOV-205-static-light-diagram-export.md) carries the KI-theme export and the standard's wording for the same decision.

## Boundary

- In: one mechanical `ki-diagrams` rubric item under `scripts/rubric/items/` that reports each tracked Markdown file and line opening a `mermaid` fence, as a warning rather than a failure; its tests; its remediation pointing at Mode REFRESH or an owner decision; the regenerated `references/rubric.md`.
- In: a way to record an owner-kept Mermaid diagram so the warning stops repeating for it, if planning finds one is needed.
- Out: converting any repository's diagrams, which each owner does under its handoff; changing the Observatory's read-only Mermaid renderer; failing the audit on a Mermaid fence.

## Discussion

Questions for planning: whether the item applies to every repository that runs the audit or only to those adopting `ki-diagrams`; whether the scan reads tracked Markdown only or also other text files; and whether a kept diagram is recorded as a manifest exclusion or a marker beside the fence.
