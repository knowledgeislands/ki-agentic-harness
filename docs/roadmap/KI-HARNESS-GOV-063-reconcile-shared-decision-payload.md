---
id: KI-HARNESS-GOV-063
area: GOV
title: Reconcile Shared Decision Payload
theme: governance-consistency
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-15T05:47:28Z
---

# Reconcile shared Decision Record payload

## Goal

Establish one valid canonical fundamentals decision across all six primary repositories while preserving required Knowledge Base metadata and independent repository acceptance.

## Context

All six copies of `GDR-KI-FUNDAMENTALS-001` declare `shared_record: true`, whose current contract requires byte-identical content. Fresh inspection found three byte variants:

- Arcadia and Techne share one payload with `note_type: admin/governance/decision`.
- tools-ki, KI Specifications, and KI Website share a second payload with the current repository names and no Knowledge Base metadata.
- the Harness has a third payload with older `ki-repo-specifications` and `ki-repo-website` names.

The only content difference between the current project payload and Knowledge Base payload is `note_type`; the Harness additionally carries the stale repository names throughout the decision. The Knowledge Base note contract requires note classification, while `ki-decision-records` currently defines a shared record as a verbatim mirror.

## Boundary

Do not rewrite receiver copies from this repository, silently weaken `shared_record: true`, discard Knowledge Base classification, treat one repository's local acceptance as estate-wide authority, or preserve stale repository names merely to achieve byte identity. The Harness owns the portable decision-record contract; every receiver owns its local payload update and acceptance.

## Current state

The work is adopted into Next because the conflict is real and affects current authority, but it is not Ready until one public metadata model is explicitly chosen. The choice must distinguish decision identity from container-required metadata and state what “shared payload” compares.

## Steps

- [ ] Choose one of the explicit shared-metadata models in Discussion and record the decision in the existing `ki-decision-records` authority or a new governance Decision Record.
- [ ] Define the canonical comparison projection, including exact included and excluded fields, ordering or serialization rules, and failure behaviour.
- [ ] Update `ki-decision-records` standards, context parser, rubric, and fixtures so shared-record drift is mechanically detectable without reading peer repositories during an ordinary local audit.
- [ ] Produce one canonical current `GDR-KI-FUNDAMENTALS-001` content payload using the accepted repository names and metadata rule.
- [ ] Update the Harness copy only after the contract is accepted, then prepare exact receiver-owned work for Arcadia, Techne, tools-ki, KI Specifications, and KI Website.
- [ ] Verify each receiver independently accepts and commits its projection before claiming estate-wide reconciliation.
- [ ] Regenerate affected rubric and capability publications and run repository-wide gates.

## Files touched

- `skills/governance/ki-decision-records/` standards, parser, rubric, and fixtures
- `docs/decisions/GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md`
- A new or amended Harness governance Decision Record for the accepted shared-metadata model
- Generated `ki-decision-records` rubric and capability catalogue only when mechanically affected
- This roadmap record
- Receiver-owned copies only through independently approved repository work

## Verify

- Focused `ki-decision-records` shared-record and metadata fixtures
- Byte or canonical-projection comparison of all six accepted copies
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No build dependency blocks decision preparation. Readiness is gated by the explicit metadata-model choice below because it changes the public meaning of `shared_record: true` and the permitted Decision Record frontmatter.

## Documentation impact

### Decision Records

Record the accepted shared-metadata model durably, then update the shared fundamentals decision under independent repository acceptance.

### Specifications

Update a portable Specification only if shared-record projection becomes a conformance surface outside compatible Harness governance.

### Guides

Update Decision Record authoring guidance if maintainers must produce or compare a canonical projection rather than byte-identical files.

### Roadmap

Prepare receiver-local items only after the model and canonical payload are accepted. Keep each repository's implementation and closure independent.

## Discussion

### Model A — universal metadata in every copy

Add the Knowledge Base `note_type` to all six files and preserve literal byte identity. This is mechanically simple but leaks a container-specific classification into project repositories and makes future container metadata part of every shared payload.

### Model B — canonical decision projection

Define shared identity over decision-owned fields and body while permitting explicitly named container metadata such as `note_type` outside the comparison. This respects repository containers but requires a deterministic projection and replaces the current plain-language promise of verbatim copies.

### Model C — external container metadata

Keep files byte-identical and move Knowledge Base classification to an external index or path-derived projection. This preserves the current shared contract but would change the Knowledge Base note model and create a second metadata lookup.

### Readiness decision

Model B best separates portable decision content from repository container metadata, but it is a public governance change and needs explicit approval before this record can become Ready. Whichever model is chosen must also decide whether unknown repository-local fields fail closed or are excluded only through an allowlist.
