---
id: KI-HARNESS-GOV-224
area: GOV
title: Diagram viewer receipts
project: observatory
component: governance
priority: medium
size: m
kind: deliver
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T19:10:30Z
updated_at: 2026-10-19T23:30:55Z
transferred_from: ki-principal ki.observatory OVERLAY-SYNC, 2026-10-19
---

# KI-HARNESS-GOV-224: Diagram Viewer Receipts

## Goal

A saved Archify viewer can be proved to match the diagram source it was rendered from, so that a stale viewer is caught mechanically at audit and at commit rather than discovered by a reader. Rendering writes each saved HTML viewer together with a portable receipt, and `ki repo audit` and the staged-snapshot commit check fail when a receipt is missing or does not match.

## Context

Kris Brown answered OVERLAY-SYNC on 19 October 2026 in the Observatory work: "Overly committed, I agree with recommendation." It is read back as taken in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md) as OVERLAY-COMMITTED a): rendering writes each saved viewer with a receipt of source and HTML hashes; `ki repo audit` and the commit check fail on a missing or mismatched receipt; the Observatory's Interactive button opens a viewer only when its receipt matches, otherwise shows it stale. This record carries the harness part.

The [overlay review report](/Users/krisbrown/.local/state/ki/agents/observatory/obs-overlay-review.report.md) of the same day found:

- all 12 entries in [`docs/diagrams/diagrams.toml`](../diagrams/diagrams.toml) set `commit_html = true`, and [`build-html.ts`](../../skills/governance/ki-diagrams/scripts/build-html.ts) finalizes each diagram and copies its HTML into `docs/diagrams/`, but records nothing that ties the copy to its source;
- the `ki-diagrams` audit checks that committed HTML is present where `commit_html` asks for it, and reads traced-code history against `last_checked`, but never compares a viewer with its source;
- the [pre-commit hook](../../.husky/pre-commit) has no viewer-sync gate;
- the 5G Emerge Phase 2 site already commits `*.delivery.json` receipts beside two saved viewers, carrying source and HTML hashes that verified against the current bytes, which is the shape this record generalises.

A date or a viewer's presence cannot prove agreement; content hashes can.

## Boundary

- In: rendering through `build-html.ts` writes, beside each committed viewer, a portable receipt holding the source hash, the HTML hash and the renderer's identity, with no local path or address; the `ki-diagrams` standard and manifest text that name the receipt and its shape.
- In: a `ki-diagrams` rubric criterion, run by `ki repo audit --skill ki-diagrams` on committed files alone, that fails when a `commit_html` entry has no receipt or its hashes do not match the current source and HTML; the same check in the staged-snapshot pre-commit audit, so a commit that changes a source or viewer without re-rendering is refused; fixture tests for both.
- In: re-rendering the 12 harness manifest entries so each carries a matching receipt.
- Out: `last_checked`, which keeps its separate question of whether a diagram still describes its traced code; a matching receipt never refreshes it, and a stale `last_checked` never fails the receipt check.
- Out: adopting receipts on the 5G Emerge Phase 2 and Phase 3 sites, which are later adopters in their own repositories; Phase 2's existing delivery receipts are a starting shape to reconcile with, not work done here.
- Out: the Observatory's Interactive button, which apps-observatory.local owns; changing Archify itself.

## Dependencies / blocks

The Observatory in apps-observatory.local opens a saved viewer only when its receipt matches, and otherwise shows it stale; that reader needs the receipt shape this record defines, so this record should land first.

No tools-ki change is identified: rendering runs through the harness's own `build-html.ts`, and the audit criterion is a `ki-diagrams` rubric item that `ki repo audit` runs from the harness. Planning confirms this; if the check needs a new `ki` capability, such as hashing support the rubric runtime does not offer, that tools-ki change is named here as a dependency before the record becomes Ready.

The 5G Emerge Phase 2 and Phase 3 sites in humans-not-robots adopt the receipt once it exists. Phase 2 already carries hashed delivery receipts and Phase 3 renders its saved viewers explicitly, so both can adopt without changing their build order.

## Discussion

### Receipt shape

Whether the receipt is one file per diagram beside its viewer, such as `docs/diagrams/<slug>.receipt.json` mirroring Phase 2's `*.delivery.json`, or one manifest-level ledger; which hash algorithm, with SHA-256 the obvious default; and whether renderer identity means the Archify version alone or also the `build-html.ts` revision.

### Scope of the check

Whether the SVG export joins the receipt now, since `export-svg.ts` already writes from the same viewer, or stays outside it; and whether a viewer with `commit_html = false` needs a receipt at all.
