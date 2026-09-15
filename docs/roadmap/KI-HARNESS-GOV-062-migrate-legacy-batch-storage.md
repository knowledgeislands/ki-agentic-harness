---
id: KI-HARNESS-GOV-062
area: GOV
title: Migrate legacy batch storage
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: 97a2348a7a641f8572714a7ec58caca262d22c0f
created_at: 2026-09-14T19:04:19Z
updated_at: 2026-09-15T12:25:33Z
---

# Migrate legacy batch storage

## Goal

Give repositories a bounded, evidence-preserving transition for batch records left under `+/_AUTHORISATIONS/` after canonical storage moved to `+/_BATCHES/`.

## Context

The current `ki-batch` contract has no execution discovery fallback for `_AUTHORISATIONS`, and routine `ki-next` and `ki-recap` retention inspects only `+/_BATCHES/`. A fresh estate observation found legacy records in Techne, KI Website, tools-ki, mcp-acquire-whatsapp, mcp-git-audit, mcp-gsuite, and mcp-m365. Some repositories also retain an empty legacy directory.

The in-place v1 contract now rejects pre-change records for execution while retaining their parser shape for integrity and cleanup. Moving a byte-identical completed record into canonical batch storage does not change its approval hash, but it must not turn that retained evidence into executable authority.

## Boundary

Do not restore permanent legacy discovery, infer approval from a file's presence, execute a retired authorisation, alter protected payload bytes, delete active or unverifiable evidence, weaken the seven-day inactivity rule, or mutate consumer repositories from this Harness delivery. Repository owners retain migration and deletion authority.

## Current state

`ki-batch` can parse the retired shape as `retained-legacy` and refuses it in the execution resolver. Its retention selector accepts canonical `+/_BATCHES/` evidence only. No pure classifier currently distinguishes a safe byte-preserving relocation from a record that must remain quarantined or receive fresh authority.

The transition uses four outcomes:

- **Relocate** a committed, unchanged, regular completed record into `+/_BATCHES/` byte-for-byte when its canonical work outcomes are retained and it is not yet retention-eligible.
- **Prune** a completed record only when the ordinary batch-retention age, inactivity, containment, commit, and retained-outcome guards all pass.
- **Reauthorise** active or resumable work through a new lean record with current explicit authority; never translate approval automatically.
- **Retain** malformed, uncommitted, symlinked, unknown, or incompletely evidenced records at their existing path with a named reason.

## Steps

- [x] Add a transition section to the batch standard defining the four outcomes and their no-inference boundary.
- [x] Add a pure legacy-record classifier that consumes caller-supplied path, file, Git, lifecycle, canonical-outcome, and age evidence without reading, moving, or deleting anything.
- [x] Reuse the existing retired-shape parser and batch-retention rule rather than creating a second legacy schema or weaker age calculation.
- [x] Require relocation to preserve exact bytes and filename beneath `+/_BATCHES/`, reject destination collisions, and re-parse the result as retained non-executable evidence.
- [x] Require active work to stop with `reauthorise`; document that only a newly approved lean exact-set envelope can resume execution.
- [x] Add fixtures for completed young records, completed expired records, active work, missing canonical outcomes, malformed payloads, unsafe paths, symlinks, uncommitted bytes, collisions, and empty legacy directories.
- [x] Record the observed receiver repositories as migration evidence without writing them; route native filesystem mechanics to the existing tools-ki batch automation owner if the pure contract proves useful.
- [x] Run focused batch tests, skill audits, Markdown checks, and repository-wide gates.

## Files touched

- `skills/change-management/ki-batch/references/standards-batch.md`
- `skills/change-management/ki-batch/scripts/internal/legacy-batch-migration.ts`
- `skills/change-management/ki-batch/scripts/legacy-batch-migration.test.ts`
- `skills/change-management/ki-batch/SKILL.md` only if invocation or summary needs the transition route
- Generated capability or rubric publications only when mechanically affected
- This roadmap record

## Verify

- Focused legacy batch migration, authorisation, and retention tests
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No dependency blocks the portable classifier and procedure. Native cross-repository filesystem mutation is separately owned by tools-ki and is not part of this Harness item. Each receiver must explicitly execute or approve its own resulting relocation, reauthorisation, retention, or prune action.

## Documentation impact

### Decision Records

No new Decision Record is expected. `GDR-KI-HARNESS-009` already establishes the in-place lean contract and narrow retained-record compatibility boundary.

### Specifications

No repository-wide Specification change. This is a temporary transition procedure within the batch process contract.

### Guides

Keep the transition in the batch reference unless a native user-facing migration command is implemented later.

### Roadmap

Close this Harness item when the classifier and transition procedure are verified. Any receiver-specific migration becomes a receiver-owned item only where its local evidence requires work.

## Review

### Delivered

Delivered the approved portable transition classifier and reference procedure from immutable baseline `97a2348a7a641f8572714a7ec58caca262d22c0f`. Receiver repositories, native filesystem mutations, execution discovery, and old-authority translation remained excluded.

### Summary of changes

Added `legacy-batch-migration.ts` as a pure four-outcome classifier over caller-supplied evidence. It reuses the retained legacy parser and canonical retention selector, binds relocation to an exact whole-file hash and unchanged filename, rejects destination collisions, requires fresh authority for active work, and safely classifies a verified empty retired directory. Added focused fixtures and updated the batch standard with transition policy, observed receiver evidence, and tools-ki ownership of native mechanics. No approved deviation was needed.

### Verification

`bun test skills/change-management/ki-batch/scripts/legacy-batch-migration.test.ts skills/change-management/ki-batch/scripts/authorisation.test.ts skills/change-management/ki-batch/scripts/batch-retention.test.ts` passed 19 tests and 111 assertions. `bunx tsc --noEmit`, focused Biome, `git diff --check`, and the `ki-skills` and `ki-authoring` audits passed. The roadmap audit reported no GOV-062 finding but remained non-zero on concurrent transient GOV-064 state; the batch coordinator owns its clean aggregate rerun and the single aggregate `bun run test` gate before consolidated acceptance.

### Outstanding concerns

No implementation concerns. Any native cross-repository migration still requires receiver authority and immediate filesystem and Git revalidation; this delivery deliberately supplies no mutation executor.

### Post-change review

The classifier meets the stated four-outcome goal without weakening legacy non-execution or retention age rules. Scope held to the batch contract, pure helper, focused tests, and this record. Regression risk is bounded by reuse of the existing parser and retention selector, with focused coverage of every planned stop class. The item is ready for acceptance after the aggregate batch gate.

### Mini recap

Legacy batch evidence can now be classified as relocate, prune, reauthorise, or retain without writes or inferred authority. Focused code, type, authoring, roadmap, and skill checks pass; no unresolved defect remains. The durable learning is already placed in the batch standard, while native execution remains a tools-ki concern.

## Done

Accepted 2026-09-15 under the approved completion authority in `KI-HARNESS-BATCH-022` after the aggregate repository gate passed.

## Discussion

### Why relocation is byte-preserving

The earlier approval payload excludes storage path, so a regular committed record can move without changing its hash. Preserving exact bytes avoids inventing a new approval and keeps the record useful to retention. The execution resolver's `retained-legacy` stop prevents the new location from reviving authority.

### Why active work is not translated

The lean contract derives policy, run identity, and closure scope differently. Automatically converting an active record would manufacture current approval for a new envelope. A fresh authorisation is cheaper and clearer than a compatibility rule that weakens authority.
