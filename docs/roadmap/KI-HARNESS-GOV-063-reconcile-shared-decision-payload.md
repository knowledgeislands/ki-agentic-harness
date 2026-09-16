---
id: KI-HARNESS-GOV-063
area: GOV
title: Reconcile Shared Decision Payload
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 8d2b9767634c78b09da41bb5bf610ef01eb033ea
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-16T12:53:49Z
---

# Reconcile shared Decision Record payload

## Goal

Establish a deterministic shared Decision Record projection, conform the Harness copy of the fundamentals decision, and prepare receiver-owned reconciliation without claiming estate-wide acceptance.

## Context

All six copies of `GDR-KI-FUNDAMENTALS-001` declare `shared_record: true`, whose current contract requires byte-identical content. Fresh inspection found three byte variants:

- Arcadia and Techne share one payload with `note_type: admin/governance/decision`.
- tools-ki, KI Specifications, and KI Website share a second payload with the current repository names and no Knowledge Base metadata.
- the Harness has a third payload with older `ki-repo-specifications` and `ki-repo-website` names.

The only content difference between the current project payload and Knowledge Base payload is `note_type`; the Harness additionally carries the stale repository names throughout the decision. The Knowledge Base note contract requires note classification, while `ki-decision-records` currently defines a shared record as a verbatim mirror.

## Boundary

Do not rewrite receiver copies from this repository, silently weaken `shared_record: true`, discard Knowledge Base classification, treat one repository's local acceptance as estate-wide authority, or preserve stale repository names merely to achieve byte identity. The Harness owns the portable decision-record contract and its own copy; every receiver owns its local payload update and acceptance, while a later observation owns the estate-wide comparison.

## Current state

The user approved Model B on 2026-09-16: shared identity compares a canonical decision-owned projection, excludes only the explicitly allowlisted `note_type` container field initially, and fails closed on every unknown frontmatter field. No general category of repository-local metadata is excluded.

## Steps

- [x] Record approved Model B with `note_type` as the initial and only excluded container field, unknown frontmatter failing closed, and amend `GDR-KI-HARNESS-007` as the living decision that already owns metadata authority.
- [x] Define the canonical comparison projection: fixed decision-owned fields, explicit exclusions, deterministic ordering and serialization, body normalization, and failure behaviour.
- [x] Update `ki-decision-records` standards, context parser, rubric, and fixtures so an ordinary local audit validates projection eligibility without claiming to observe peer-repository equality.
- [x] Produce the canonical current `GDR-KI-FUNDAMENTALS-001` decision projection using the accepted repository names and conform the Harness copy only.
- [x] Prepare exact receiver-owned work for Arcadia, Techne, tools-ki, KI Specifications, and KI Website without changing those repositories from the Harness.
- [x] Prepare a later observation item whose explicit six-repository projection comparison is the only work allowed to claim estate-wide reconciliation.
- [x] Regenerate affected rubric and capability publications and run repository-wide gates.

## Files touched

- `skills/governance/ki-decision-records/` standards, parser, rubric, and fixtures
- `docs/decisions/GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md`
- `docs/decisions/GDR-KI-HARNESS-007-document-metadata-and-principal-authority.md`
- Generated `ki-decision-records` rubric and capability catalogue only when mechanically affected
- This roadmap record

## Verify

- Focused `ki-decision-records` shared-record, allowlist, unknown-field, serialization, and metadata fixtures
- Local canonical-projection eligibility check for the Harness copy
- Explicit six-repository canonical-projection comparison in the later observation item
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

The user approved Model B, the initial `note_type`-only exclusion allowlist, and fail-closed handling of every unknown field on 2026-09-16. No build dependency blocks delivery.

## Documentation impact

### Decision Records

Amend `GDR-KI-HARNESS-007`, the living decision that already owns metadata authority, then update the Harness fundamentals copy under the accepted projection contract.

### Specifications

Update a portable Specification only if shared-record projection becomes a conformance surface outside compatible Harness governance.

### Guides

Update Decision Record authoring guidance if maintainers must produce or compare a canonical projection rather than byte-identical files.

### Roadmap

Prepare receiver-local items only after the model and canonical payload are accepted. Keep each repository's implementation and closure independent, then use a distinct observation item for the explicit six-repository comparison.

## Review

### Delivered

Delivered approved Model B against immutable baseline `8d2b9767634c78b09da41bb5bf610ef01eb033ea`. Shared identity now projects fixed Decision Record-owned fields and the complete LF-normalised body, excludes only `note_type`, and fails closed on unknown frontmatter. The Harness copy alone was reconciled; no peer shared record was changed.

### Summary of changes

Amended `GDR-KI-HARNESS-007`, updated the Harness `GDR-KI-FUNDAMENTALS-001` copy to current repository names and projection wording, added the portable Specification requirement, and extended `ki-decision-records` with deterministic projection, eligibility audit, tests, standard, audit guidance, and generated rubric. Captured [KI-HARNESS-GOV-069](KI-HARNESS-GOV-069-observe-shared-decision-reconciliation.md) for the later estate observation. Created and committed receiver-owned draft records in Arcadia (`3f3f91c`), Techne (`6ab3176`), tools-ki (`7618912`), KI Specifications (`fc8a871`), and KI Website (`6b909e3`); KI Website's pre-existing retired candidate metadata was repaired separately in `2ad43a9` so its roadmap gate passed.

### Verification

Projection tests prove frontmatter-order independence, `note_type` equivalence, unknown-field refusal, and complete-body sensitivity. Current inspection finds one new Harness projection and one matching projection across the five unchanged receiver copies, which is the expected pre-reconciliation state. Focused `ki-decision-records` and remediation-inventory tests pass; the six relevant Harness audits pass; `bunx tsc --noEmit`, all 714 tests, `bunx biome check`, and `git diff --check` pass. Each receiver record passed its local roadmap or Streams audit before commit.

### Outstanding concerns

The five receiver records remain unadopted Triage proposals under their owners' authority. Estate-wide equality is intentionally not claimed until those repositories accept and deliver their records and `KI-HARNESS-GOV-069` observes all six accepted revisions.

### Post-change review

The implementation keeps container metadata ownership narrow and explicit without weakening shared decision identity. Unknown-field refusal prevents silent divergence when future metadata appears. The projection implementation is directly testable and the local audit reports eligibility without pretending it can observe peer state. The approved Harness boundary is ready for acceptance review.

### Mini recap

GOV-063 now has a stable local contract, a canonical Harness payload, five independently owned receiver proposals, and a distinct observation gate. No automatic promotion of receiver work or estate-wide completion claim was made.

## Done

Accepted 2026-09-16 by Kris Brown on the review packet above.

## Discussion

### Model A — universal metadata in every copy

Add the Knowledge Base `note_type` to all six files and preserve literal byte identity. This is mechanically simple but leaks a container-specific classification into project repositories and makes future container metadata part of every shared payload.

### Model B — canonical decision projection

Define shared identity over a deterministic projection of decision-owned fields and body while excluding only explicitly allowlisted container metadata. The recommended initial allowlist contains only `note_type`; every unknown frontmatter field fails closed. This respects repository containers while retaining a narrow, reviewable exception to the current verbatim-copy promise.

### Model C — external container metadata

Keep files byte-identical and move Knowledge Base classification to an external index or path-derived projection. This preserves the current shared contract but would change the Knowledge Base note model and create a second metadata lookup.

### Readiness decision

Model B is approved with `note_type` as the sole initial exclusion and fail-closed treatment for every unknown field. No general category of repository-local metadata is implicitly excluded.
