---
id: KI-HARNESS-GOV-095
area: GOV
title: Align roadmap diagnostics
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 709f49fec523f596d1b388391bff6aed39ac5198
created_at: 2026-09-25T14:21:37Z
updated_at: 2026-10-06T20:54:38Z
---

# KI-HARNESS-GOV-095: Align roadmap diagnostics

## Goal

Make roadmap structure diagnostics agree so malformed records and duplicate canonical identifiers cannot pass one supported inspection path while failing or being silently accepted by another.

## Context

Kit Principal exposed two inconsistent results on 2026-09-25. `ki repo audit --skill ki-repo-kb-streams` passed while `ki repo roadmap list` exited non-zero because one file under `Streams/Roadmap/` lacked canonical work-item frontmatter. After that file was migrated, the list command exited successfully while displaying two active records with the same `KIT-007` identifier and no duplicate-identity diagnostic.

The harness owns the portable roadmap and Streams validation contracts and their native rubric contexts. `tools-ki` owns the executable `ki repo roadmap list` and audit hosts. Planning must identify the narrowest shared invariant and route implementation to each owning repository without duplicating validation semantics.

## Boundary

In scope: one portable structural invariant for a roadmap container, stated once in the roadmap standard and enforced mechanically by both harness rubrics that inspect a container (`ki-work-roadmap` for `docs/roadmap/`, `ki-repo-kb-streams` for `Streams/Roadmap/`). The invariant has two parts: every direct-child record has valid canonical frontmatter whose `id` matches its filename identifier; and no two retained records share an `id`. Fixtures pin both parts in both adapters.

Out of scope: implementing anything in `tools-ki`, including the exit behaviour and diagnostics of `ki repo roadmap list`, which is a separate trade to `tools-ki` once this lands; repairing Kit Principal's duplicate identifiers; changing any record's lifecycle state; re-validating every adapter-owned field from `ki-repo-kb-streams`, since the full record format stays with the roadmap adapter; and treating one command's current exit status as the contract.

## Current state

Verified on `main` at `19651664` and re-verified at `709f49fe` after KI-HARNESS-GOV-105 landed; only the duplicate-`id` line moved. Half of the invariant is already enforced:

- `ki-work-roadmap` `ITEM-1` fails a record without leading YAML frontmatter, with an invalid frontmatter line, missing fields, or an `id` that does not match its filename, and fails a duplicate `id` (`scripts/rubric/contexts/roadmap-evidence.ts:131`, `:480`, `:762`). No test pins the duplicate or missing-frontmatter cases.
- `ki-repo-kb-streams` `STREAM-6` (landed `690ebcd2`, 2026-10-04) fails a duplicate `id` among `Streams/Roadmap/` records, but `roadmapIdentityEvidence` (`scripts/rubric/contexts/streams.ts:143`-`:166`) silently skips any record with no frontmatter or no `id`. That skip is the 2026-09-25 Kit Principal failure: a record without canonical frontmatter passes the KB audit. The only record-format criterion, `STREAM-4`, is judgment.
- The roadmap standard says identifiers are unique (`standards-repository-roadmaps.md:41`) but does not state that every supported structural inspection must report both parts with a non-zero result.

## Steps

- [x] Add a "Structural validity" paragraph to `standards-repository-roadmaps.md` after the identifier-uniqueness sentence: every direct-child Markdown record other than `_ISSUES.md` (and, in a KB, the `Roadmap.md` index note) begins with valid canonical frontmatter whose `id` matches its filename identifier, no two retained records share an `id`, and any command that claims structural validation of a roadmap container reports each violation with a stable diagnostic and a non-zero result.
- [x] Add `STREAM-7 [M]`, "roadmap record frontmatter", to `ki-repo-kb-streams` `scripts/rubric/items/stream.ts`: FAIL for each direct child of `Streams/Roadmap/`, other than `_ISSUES.md` and `Roadmap.md`, that lacks parseable leading frontmatter, lacks an `id`, or whose `id` does not match its filename identifier. Diagnostic remediation pointing to the roadmap adapter's format.
- [x] Extend `scripts/rubric/contexts/streams.ts` with the evidence for `STREAM-7`, sharing the directory walk with `roadmapIdentityEvidence`, so a record skipped by `STREAM-6` is always reported by `STREAM-7`.
- [x] Add fixtures to `scripts/rubric/contexts/streams.test.ts` for: a record without frontmatter, a record without `id`, a filename and `id` mismatch, and two records sharing an `id`; update the mechanical count in `scripts/rubric/items/index.test.ts` from 8 to 9.
- [x] Add fixtures to `ki-work-roadmap` `scripts/rubric/items/index.test.ts` pinning `ITEM-1` for a record without frontmatter and for two records sharing an `id`.
- [x] Add one sentence to `standards-streams-structure.md` pointing to the roadmap standard's structural-validity paragraph, and regenerate `references/rubric.md` for both skills with `ki dev skill rubric <skill>`.
- [x] Raise a trade to `tools-ki` asking `ki repo roadmap list` to apply the structural-validity invariant, as in Dependencies / blocks; a follow-on, not an acceptance criterion here.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/index.test.ts`
- `skills/change-management/ki-work-roadmap/references/rubric.md` (if the publication changes)
- `skills/repo-structure/ki-repo-kb-streams/references/standards-streams-structure.md`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/items/stream.ts`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.ts`
- `skills/repo-structure/ki-repo-kb-streams/scripts/rubric/contexts/streams.test.ts`
- `skills/repo-structure/ki-repo-kb-streams/references/rubric.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` (criterion counts rise by one)

## Verify

1. A KB fixture whose `Streams/Roadmap/` holds one record without frontmatter fails `ki repo audit --skill ki-repo-kb-streams` with `STREAM-7` naming that file; the same fixture with the record removed passes.
2. A KB fixture with two records sharing `KIT-007` fails `STREAM-6` naming both files.
3. A non-KB fixture with the same two defects under `docs/roadmap/` fails `ITEM-1` for each, and the new tests pin both.
4. `_ISSUES.md` and a `Roadmap.md` index note are never reported by `STREAM-7`.
5. `ki repo audit --skill ki-repo-kb-streams` over this repository's sibling KB, Arcadia Principal, reports no new `STREAM-7` finding.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-work-roadmap --progress never
ki repo audit --skill ki-repo-kb-streams --repo <kb fixture or Arcadia checkout> --progress never
```

## Dependencies / blocks

None. Follow-on: once this lands, open a trade to `tools-ki` asking `ki repo roadmap list` to apply the structural-validity invariant from the roadmap standard, reporting malformed records and duplicate identifiers with a non-zero exit. That trade does not block this record and this record does not wait on it.

Sequencing: this record, [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) and [KI-HARNESS-GOV-105](KI-HARNESS-GOV-105-state-ordering-in-ledger.md) all edit the shared `ki-work-roadmap` files `scripts/rubric/contexts/roadmap-evidence.ts`, `scripts/rubric/items/index.test.ts` and `references/rubric.md`; this record, [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) and [KI-HARNESS-GOV-103](KI-HARNESS-GOV-103-cite-coordination-rules-once.md) all edit `references/standards-repository-roadmaps.md`. The anchors differ; whichever lands second rebases.

## Documentation impact

### Decision Records

None. The invariant restates what the format and uniqueness rules already require and adds no new authority.

### Specifications

`standards-repository-roadmaps.md` gains the structural-validity paragraph; `standards-streams-structure.md` gains one pointer sentence.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

Baseline `709f49fe`. One harness commit delivers both rubric halves and the standard; it moves this record to `awaiting-review`. The `tools-ki` follow-on draft record is raised after this commit lands, and its identifier is added here in a follow-up commit.

### Change Summary

- `standards-repository-roadmaps.md` gains the **Structural validity** paragraph after the identifier-uniqueness sentence: every direct-child record other than `_ISSUES.md` (and a KB `Roadmap.md` index note) begins with canonical frontmatter whose `id` matches its filename identifier, no two retained records share an `id`, and any command claiming structural validation reports each violation with a stable diagnostic and a non-zero result.
- `ki-repo-kb-streams` gains `STREAM-7 [M]`, "roadmap record frontmatter". `streams.ts` now walks `Streams/Roadmap/` once into `roadmapRecords`, which feeds both `STREAM-6` and `STREAM-7`, so any record the identity check cannot compare is reported by `STREAM-7`. It fails missing frontmatter, unparseable YAML, a non-mapping, a missing `id`, and a filename that is not `<id>-<slug>.md`, including a bare `<id>.md`; it skips `_ISSUES.md` and `Roadmap.md`. A digit-led slug such as `KB-OPS-008-2026-review.md` conforms, because the record's own `id` locates the identifier boundary.
- `standards-streams-structure.md` gains one sentence pointing to the structural-validity paragraph and keeps full record format with the roadmap adapter.
- Tests: `streams.test.ts` pins the frontmatter defects, a filename without a slug, the clean pass after removal, the excluded ledger and index note, and the `KIT-007` duplicate beside an unformatted record; the Streams mechanical count moves from 8 to 9. `ki-work-roadmap` `index.test.ts` pins `ITEM-1` for a record without frontmatter and for two records sharing an `id`.
- `references/rubric.md` is regenerated for `ki-repo-kb-streams`; `ki-work-roadmap`'s publication is unchanged. The `ki-skills` remediation inventory counts rise by one criterion (732 criteria, 491 mechanical, 369 diagnostic, 384 report-only).

### Verification

- `bun run test`: 955 pass, 0 fail. `bunx tsc --noEmit`: clean.
- `ki dev skill rubric ki-work-roadmap` and `ki dev skill rubric ki-repo-kb-streams`: both in sync.
- Verify 1 and 2, on a shallow clone of Arcadia Principal: adding a record without frontmatter fails `STREAM-7` naming that file; removing it passes; copying one record to share its `id` fails `STREAM-6` naming both files.
- Verify 3 and 4 are pinned by the new `ITEM-1` and `streams.test.ts` cases.
- Verify 5: `ki repo audit --skill ki-repo-kb-streams --repo ki-arcadia-principal` passes with no `STREAM-7` finding.
- `ki repo audit --skill ki-work-roadmap` passes. `ki repo audit --repo .` reports FAIL=0 and two WARNs that predate this change: `ki-model-radar` LIFECYCLE-1, a stale `evidence.openai-astra-release.reviewed_on`, and `ki-skills` LONG-3, a `references/sources.md` source past its refresh cadence.

### Outstanding concerns

- The Arcadia legacy-format gap stays accepted under the owner decision: records with canonical `id`s but legacy bodies still pass the KB Streams audit.
- `STREAM-7` restates the identifier grammar rather than importing the roadmap adapter's, and is deliberately more permissive in one case: it accepts a digit-led slug such as `<id>-2026-review.md`, which `ki-work-roadmap` `ITEM-1` rejects because its greedy `FILE_RE` (`roadmap-evidence.ts:38`) captures `<id>-2026` as the identifier. That adapter defect is outside this Boundary and is a candidate follow-on; a future grammar change must update both.
- Symbolic links under `Streams/Roadmap/` remain outside both `STREAM-6` and `STREAM-7`, since the walk reads regular files only; this predates the change, and repository symlink safety rules own them.
- `ki repo roadmap list` still does not apply the invariant until the `tools-ki` follow-on lands.

### Post-change review

A Fable review found no blocking defect. Two findings were addressed before commit: `STREAM-7` now rejects a bare `<id>.md` filename, matching the standard's `<id>-<slug>.md`, and the new remediation guidance uses ASCII apostrophes. The adapter's digit-led-slug defect and the symlink gap are recorded under Outstanding concerns.

The two inspection paths now agree on the structural floor for any record in either container. `STREAM-7` checks only frontmatter presence, parseability, `id` presence and filename agreement, so it does not duplicate `ki-work-roadmap`'s format validation, as the Decision requires.

### Mini recap

A malformed or unidentified `Streams/Roadmap/` record can no longer pass the KB audit silently, the roadmap standard states the shared invariant once, and tests pin both defects in both adapters.

## Discussion

### Expected diagnostic parity

For the same repository revision, supported roadmap audit and listing paths should agree on whether every direct child is a canonical work item and whether identifiers are unique. A malformed direct child or duplicate identifier should produce explicit, stable diagnostics and a non-zero result in every command that claims structural validation.

### Ownership and verification

The portable rule belongs with the roadmap and Streams governance contracts; executable parsing and command exit behaviour belong in `tools-ki`. Future planning should define fixtures for malformed frontmatter and duplicate identifiers, then verify both KB Streams and non-KB roadmap adapters without coupling either skill to a private CLI implementation.

### Arcadia handoff - legacy-format records

Originating repository: `ki-arcadia-principal`, from its 2026-10-06 roadmap consolidation survey. Relationship: non-blocking; it neither blocks nor is blocked by this record, and no Arcadia item depends on it.

On 2026-10-06, `ki repo audit --skill ki-repo-kb-streams --repo ki-arcadia-principal` (ki 0.6.1) passed although three `Streams/Roadmap/` records are in the legacy format: `KI-ARCADIA-GOV-001`, `KI-ARCADIA-MOD-003` and `KI-ARCADIA-OPS-002` have no `Goal`, `Context`, `Boundary` or `Discussion` sections and carry a `priority` field, and `MOD-003` also carries the retired `candidate` field. They have canonical `id`s that match their filenames, so the invariant in this record's Boundary would still pass them; body sections and retired fields are adapter-owned format, which the Boundary deliberately keeps out of `ki-repo-kb-streams`. Planning should decide whether that is acceptable or whether the KB Streams audit should reach the roadmap adapter's format checks for its records. Either way it is evidence that a structurally valid record can still be far from the work-item format with no mechanical signal.

### Decision

The harness defines the shared invariant, frontmatter validity and no duplicate active identifier, in the Streams and roadmap rubrics; the `tools-ki` list-command change is a separate trade. Decided by the Fable reviewer under delegated autonomy, reversible.

The harness defines the shared invariant, frontmatter validity and duplicate identifier, in the roadmap standard and enforces it in both the roadmap and Streams rubrics. The `tools-ki` list command change is a separate trade. `ki-repo-kb-streams` checks only frontmatter presence, `id` presence and filename agreement, not every adapter-owned field, so it does not duplicate `ki-work-roadmap`'s format validation.

### Decision needed before implementation (2026-10-06)

Delivery was paused without changes on 2026-10-06. The Arcadia handoff above arrived after the Decision. It explicitly asks planning to decide whether `ki-repo-kb-streams` should stop at frontmatter presence, `id` presence and filename agreement, which would leave legacy-format records with no mechanical signal, or reach the roadmap adapter's format checks. The Decision and Boundary choose the former, but nobody has confirmed that choice against the handoff. The owner should confirm one of these:

- keep the Boundary as written, and record the legacy-format gap as accepted or as separate follow-on work;
- widen `STREAM-7` before implementation.

In the same decision, the owner should confirm whether this delivery raises the `tools-ki` trade, a cross-repository write, or leaves it to the owner.

### Owner decision (2026-10-06)

Kris approved delivery as bounded: `STREAM-7` checks frontmatter and the `id` only, and the full record format stays with the roadmap adapter. The Arcadia legacy-format gap is accepted for this record; adapter-owned format remains `ki-work-roadmap`'s concern. This delivery raises the `tools-ki` handoff as a draft record in `tools-ki`'s `docs/roadmap/`.
