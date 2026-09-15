---
id: KI-HARNESS-GOV-062
area: GOV
title: Migrate legacy batch storage
theme: governance-consistency
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:04:19Z
updated_at: 2026-09-15T05:45:25Z
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

- [ ] Add a transition section to the batch standard defining the four outcomes and their no-inference boundary.
- [ ] Add a pure legacy-record classifier that consumes caller-supplied path, file, Git, lifecycle, canonical-outcome, and age evidence without reading, moving, or deleting anything.
- [ ] Reuse the existing retired-shape parser and batch-retention rule rather than creating a second legacy schema or weaker age calculation.
- [ ] Require relocation to preserve exact bytes and filename beneath `+/_BATCHES/`, reject destination collisions, and re-parse the result as retained non-executable evidence.
- [ ] Require active work to stop with `reauthorise`; document that only a newly approved lean exact-set envelope can resume execution.
- [ ] Add fixtures for completed young records, completed expired records, active work, missing canonical outcomes, malformed payloads, unsafe paths, symlinks, uncommitted bytes, collisions, and empty legacy directories.
- [ ] Record the observed receiver repositories as migration evidence without writing them; route native filesystem mechanics to the existing tools-ki batch automation owner if the pure contract proves useful.
- [ ] Run focused batch tests, skill audits, Markdown checks, and repository-wide gates.

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

## Discussion

### Why relocation is byte-preserving

The earlier approval payload excludes storage path, so a regular committed record can move without changing its hash. Preserving exact bytes avoids inventing a new approval and keeps the record useful to retention. The execution resolver's `retained-legacy` stop prevents the new location from reviving authority.

### Why active work is not translated

The lean contract derives policy, run identity, and closure scope differently. Automatically converting an active record would manufacture current approval for a new envelope. A fresh authorisation is cheaper and clearer than a compatibility rule that weakens authority.
