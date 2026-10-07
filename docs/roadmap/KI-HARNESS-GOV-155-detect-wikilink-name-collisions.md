---
id: KI-HARNESS-GOV-155
area: GOV
title: Detect wikilink name collisions
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: repo-structure
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T17:20:21Z
updated_at: 2026-10-07T17:20:21Z
---

# KI-HARNESS-GOV-155: Detect wikilink name collisions

## Goal

A Knowledge Base audit fails mechanically when two tracked notes share a leaf filename that a shortest-unique wikilink would resolve, so adding a second page with a previously unique name can no longer silently break existing bare links.

## Context

`ki-repo-kb` defines `LINK-1` (shortest-unique Obsidian wikilinks), but `scripts/rubric/items/links.ts` implements it as a judgement-only item over sampled notes: nothing detects a collision. `tools-ki` has no wikilink code.

The problem is live in Arcadia. At planning time 19 leaf names collided among tracked Markdown outside `+/` and `-/`, including `Activities.md` (three paths), `Conformance.md` (three), and `Enactment Process.md`, `Processes.md` and `Governance.md` (two each).

Origin: `KI-ARCADIA-OPS-003` in `knowledgeislands/ki-arcadia-principal` (`Streams/Roadmap/KI-ARCADIA-OPS-003-page-registry.md`, pruned 2026-10-07). It proposed a page registry handed over as a work trade. Trades are on hold (decision 11 of the state-of-play design), so the finding is recorded here in the receiving repository instead.

## Boundary

- The check belongs to the `ki-repo-kb` rubric. Whether it needs a generated registry file or a direct scan of tracked notes is a planning question.
- No change to any Knowledge Base's notes is part of this record; each base repairs its own collisions.

## Discussion

- The Arcadia proposal stored every page in a registry, not only the collisions, so a later addition could be checked against existing bare links. A direct scan of `git ls-files '*.md'` gives the same answer without a stored file.
