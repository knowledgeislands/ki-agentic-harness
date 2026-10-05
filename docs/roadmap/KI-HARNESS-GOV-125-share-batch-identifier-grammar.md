---
id: KI-HARNESS-GOV-125
area: GOV
title: Share batch identifier grammar
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: [KI-HARNESS-GOV-094]
baseline_ref: null
created_at: 2026-10-01T19:49:57Z
updated_at: 2026-10-05T08:03:47Z
---

# KI-HARNESS-GOV-125: Share batch identifier grammar

## Goal

A repository whose work-item identifiers are valid roadmap identifiers can author a valid batch authorisation over them, because `ki-batch` and `ki-work-roadmap` accept the same identifier grammar.

## Context

Raised by `5g-emerge-phase2` on 2026-10-01 while authorising its first batch. That repository has no trade route to this harness by its own decision, and this repository's `.ki.toml` limits maintenance intake to named KI repositories, so the hand-over is written here directly as Triage, as `KI-HARNESS-GOV-096` and `KI-HARNESS-FND-027` were.

`5g-emerge-phase2` declares `repo_code = "5GE-P2"`. `ki repo audit --skill ki-work-roadmap` accepts its work items, such as `5GE-P2-DATA-008`, as valid. `ki-batch` rejects the same identifiers, so the repository cannot author a valid batch at all.

The two skills disagree:

- `ki-work-roadmap` accepts `^[A-Z0-9][A-Z0-9-]{1,23}-\d{3,}$` (`skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts:37`, filename form at `:38`), matching the standard's `<REPO>` grammar `[A-Z0-9][A-Z0-9-]{1,23}` (`references/standards-repository-roadmaps.md:43`).
- `ki-batch` requires an alpha-leading code and exactly three serial digits at five sites under `skills/change-management/ki-batch/scripts/internal/`: `identifiers()` for `item_ids` and `closure_item_ids`, `/^[A-Z][A-Z0-9-]*-\d{3}$/` (`authorisation.ts:86`-`:91`); the batch `id` and filename check, `/^[A-Z][A-Z0-9-]*-BATCH-\d{3}$/` (`authorisation.ts:207`); the run-ledger marker, `-RUN-\d{3}` (`authorisation.ts:130`); retention, `/^\+\/_BATCHES\/([A-Z][A-Z0-9-]*-BATCH-\d{3}\.md)$/` (`batch-retention.ts:41`); and legacy migration over `+/_AUTHORISATIONS/` (`legacy-batch-migration.ts:85`).

The `ki-batch` standard is not the problem: `references/standards-batch.md:25` names the file `<REPO>-BATCH-<NNN>.md`, and `<REPO>` is the roadmap standard's repository code. The code drifted from both standards.

Reproduced on 2026-10-01 against `+/_BATCHES/5GE-P2-BATCH-001.md` in the `5g-emerge-phase2` checkout:

```sh
cd <5g-emerge-phase2 checkout>
bun -e "import { resolveBatchAuthorisation } from '<harness>/skills/change-management/ki-batch/scripts/internal/authorisation.ts'
console.log(resolveBatchAuthorisation({ repositoryRoot: process.cwd(), authorisationPath: '+/_BATCHES/5GE-P2-BATCH-001.md', repositoryIdentity: 'https://github.com/5g-emerge/5g-emerge-phase2', now: new Date() }))"
# { kind: 'stop', reason: 'batch authorisation has an invalid identity or filename', writes: false }
```

The identity check fires first; every `item_ids` entry would fail `identifiers()` next. The serial width is a second, latent disagreement: the roadmap accepts four or more digits, so a repository past `999` in any area would hit the same wall with an alpha-leading code.

## Boundary

This record is deliberately narrow, and does not overlap [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md). That record creates the shared identifier-grammar module, migrates the six original restating skills, and adds the conformance test that lists `ki-batch` as a pending entry. This record covers only what GOV-094 leaves to `ki-batch`.

In scope:

- `ki-batch`'s adoption of the shared grammar delivered by GOV-094: declare the shared dependency, materialise the copy, replace the five hand-written literals with composed patterns, and clear the conformance test's pending `ki-batch` entry.
- Resolving `authorisationPath` against `repositoryRoot` rather than the process working directory in `resolveBatchAuthorisation`.
- Tests that pin digit-leading codes, item serials wider than three digits, and root-relative path resolution.

Out of scope:

- Creating the shared module, the conformance test, or any change to another skill: [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md).
- The batch authorisation contract, run ledger and retention semantics, which are unchanged; `5GE-P2-BATCH-001` itself, which belongs to `5g-emerge-phase2`; and whether `<REPO>` may lead with a digit, which `ADR-KI-HARNESS-SKILLS-015` settled.
- The `ki` host's own batch codec in `tools-ki` (`src/core/batch/codec.ts`, `src/core/batch/operations.ts`), which already accepts digit-leading codes but fixes batch and run serials at three digits. Aligning its serial width is a host-side follow-on for `tools-ki` and does not block this record.
- Disposing of this record as `merged` or otherwise. It stays a separate delivery record; any terminal disposition is the owner's.

## Current state

Verified on `main` at `19651664`: all five literals in Context are unchanged (`authorisation.ts:89`, `:130`, `:207`; `batch-retention.ts:41`; `legacy-batch-migration.ts:85`), and `resolveBatchAuthorisation` still computes `resolve(authorisationPath)` at `authorisation.ts:142`. `ki-batch`'s `SKILL.md` declares no `ki-shared-dependencies:`. Existing tests in `scripts/authorisation.test.ts` pass absolute paths, so the working-directory dependence is untested. The shared module does not exist yet; [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is `ready`.

## Steps

- [ ] Confirm [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is `done` and `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.ts` exists.
- [ ] Add `ki-shared-dependencies: [ki-work-roadmap:work-identifiers]` to `ki-batch`'s `SKILL.md` and materialise the byte-identical copy at `skills/change-management/ki-batch/scripts/shared/work-identifiers.ts`.
- [ ] Replace the five literals with patterns built from the local copy: item identifiers in `identifiers()`, the `-BATCH-` identity and filename check, the `-RUN-` marker, the retention path, and the legacy migration path.
- [ ] In `resolveBatchAuthorisation`, compute the record path as `resolve(root, authorisationPath)`, so a relative path is taken from the repository root and an absolute path is unchanged. State this in the `ResolveBatchAuthorisationInput` type comment.
- [ ] Add tests to `scripts/authorisation.test.ts`, `scripts/batch-retention.test.ts` and `scripts/legacy-batch-migration.test.ts`: `5GE-P2-BATCH-001` resolves with `item_ids` such as `5GE-P2-DATA-008` and `KI-HARNESS-GOV-1000`; a `5GE-P2-BATCH-001-RUN-001` marker binds; a digit-leading batch is retained and migrated; and a relative `+/_BATCHES/<id>.md` path resolves when the process working directory is outside the repository.
- [ ] Remove the pending `ki-batch` entry from the conformance inventory in `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts`.
- [ ] Raise a trade to `tools-ki` for widening its batch codec's batch and run serials (`src/core/batch/codec.ts`, `src/core/batch/operations.ts`) from three digits to `\d{3,}`; a follow-on, not an acceptance criterion here.

## Files touched

- `skills/change-management/ki-batch/SKILL.md`
- `skills/change-management/ki-batch/scripts/shared/work-identifiers.ts` (new)
- `skills/change-management/ki-batch/scripts/internal/authorisation.ts`
- `skills/change-management/ki-batch/scripts/internal/batch-retention.ts`
- `skills/change-management/ki-batch/scripts/internal/legacy-batch-migration.ts`
- `skills/change-management/ki-batch/scripts/authorisation.test.ts`
- `skills/change-management/ki-batch/scripts/batch-retention.test.ts`
- `skills/change-management/ki-batch/scripts/legacy-batch-migration.test.ts`
- `skills/change-management/ki-work-roadmap/scripts/shared/work-identifiers.conformance.test.ts` (pending entry removed only)

## Verify

1. The Context reproduction, run from a directory outside the repository with a relative `authorisationPath`, returns `kind: 'resolved'` for a fixture `5GE-P2-BATCH-001.md` whose `item_ids` include `5GE-P2-DATA-008`.
2. `grep -nE "\[A-Z\]\[A-Z0-9-\]\*" skills/change-management/ki-batch/scripts/internal/*.ts` returns nothing.
3. Every identifier accepted by `ki-work-roadmap`'s `ID_RE` is accepted in `item_ids`, shown by a test that feeds both the same fixture list.
4. An authorisation path outside `+/_BATCHES/`, relative or absolute, still stops with `batch authorisation is not a canonical local record`.
5. The conformance test passes with no pending entry and fails if a hand-written repository-code literal is reintroduced into `ki-batch`.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-skills --progress never
```

## Dependencies / blocks

Blocked by [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md), which must deliver the shared module and conformance test first. Plan complete; ready once KI-HARNESS-GOV-094 is done. The `tools-ki` codec serial-width alignment is a non-blocking host-side follow-on.

## Documentation impact

### Decision Records

None.

### Specifications

None. `references/standards-batch.md` already names files `<REPO>-BATCH-<NNN>.md` in terms of the roadmap's `<REPO>`; the code now matches it.

### Guides

None.

### Roadmap

[KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) carries the reciprocal `blocks`.

## Discussion

### A missed instance of GOV-094

This is the class [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) describes, not a new one. `69a0fc80` relaxed the digit-leading rule on 2026-09-24 across four skills; GOV-094 then found `ki-decision-records` and `ki-specs` still enforcing the repealed rule, and listed six restating skills for its decided fix of one shared grammar. `ki-batch` is a seventh that GOV-094's list does not name, and it was found the same way: a downstream repository using a legal code and hitting a wall, rather than anything in this repository reporting the divergence.

That is evidence for GOV-094's structural route over its checklist fallback, because its candidate question relied on a grep for the regex literal, and `ki-batch` never shared it: the repealed roadmap literal was `[A-Z][A-Z0-9-]{1,23}-\d{3,}`, while `ki-batch` has spelled the grammar `[A-Z][A-Z0-9-]*-\d{3}` since `66732390` on 2026-08-09. The owner may reasonably dispose of this record as `merged` into GOV-094 by adding `ki-batch` to its list of restating skills, or keep it separate if `ki-batch` should be fixed ahead of the shared definition.

### Decision

Kept separate rather than merged or withdrawn, and scoped narrowly to resolving `authorisationPath` against `repositoryRoot` plus `ki-batch`'s adoption of the [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) grammar, with the non-overlap stated in both records. Decided by the Fable reviewer under delegated autonomy, reversible.

This record is not merged into [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md); a terminal disposition needs the owner. GOV-094 now names `ki-batch` as its seventh restating skill and owns the shared module and conformance test. This record keeps only what GOV-094 does not cover: `ki-batch`'s adoption of that module, and the working-directory resolution of `authorisationPath` below. The two records share no file except the one-line removal of the pending `ki-batch` entry from the conformance inventory, which this record makes after GOV-094 is done.

### Fix shape

Share one pattern with the roadmap rather than widen `ki-batch`'s literals. Five hand-written copies inside one skill, each composing the grammar with a different suffix, is the drift GOV-094 exists to remove. A single exported repository-code and item-identifier grammar from which `-BATCH-NNN` and `-RUN-NNN` are composed keeps the batch, run and item forms from diverging from each other as well.

### A second, smaller observation

`resolveBatchAuthorisation` resolves `authorisationPath` against the process working directory, not `repositoryRoot` (`authorisation.ts:142`). Called from outside the repository with the relative path its own standard prescribes, it stops with `batch authorisation is not a canonical local record`, which reads as a malformed record rather than as a working-directory mistake. That may be intended, with callers always passing an absolute path, but it cost one false reproduction here and is worth a sentence in the input type or a resolution against the root.
