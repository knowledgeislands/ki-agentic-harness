---
id: KI-HARNESS-GOV-125
area: GOV
title: Share batch identifier grammar
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-01T19:49:57Z
updated_at: 2026-10-01T19:49:57Z
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

In scope: making `ki-batch` accept every identifier the roadmap standard accepts, by sharing one grammar rather than correcting the five literals in place; and tests that pin digit-leading codes and serials wider than three digits.

Out of scope: the batch authorisation contract, the run ledger and retention semantics, which are unchanged; `5GE-P2-BATCH-001` itself, which belongs to `5g-emerge-phase2`; and whether `<REPO>` should allow digit-leading codes, which `ADR-KI-HARNESS-SKILLS-015` settled.

## Discussion

### A missed instance of GOV-094

This is the class [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) describes, not a new one. `69a0fc80` relaxed the digit-leading rule on 2026-09-24 across four skills; GOV-094 then found `ki-decision-records` and `ki-specs` still enforcing the repealed rule, and listed six restating skills for its decided fix of one shared grammar. `ki-batch` is a seventh that GOV-094's list does not name, and it was found the same way: a downstream repository using a legal code and hitting a wall, rather than anything in this repository reporting the divergence.

That is evidence for GOV-094's structural route over its checklist fallback, because its candidate question relied on a grep for the regex literal, and `ki-batch` never shared it: the repealed roadmap literal was `[A-Z][A-Z0-9-]{1,23}-\d{3,}`, while `ki-batch` has spelled the grammar `[A-Z][A-Z0-9-]*-\d{3}` since `66732390` on 2026-08-09. The owner may reasonably dispose of this record as `merged` into GOV-094 by adding `ki-batch` to its list of restating skills, or keep it separate if `ki-batch` should be fixed ahead of the shared definition.

### Fix shape

Share one pattern with the roadmap rather than widen `ki-batch`'s literals. Five hand-written copies inside one skill, each composing the grammar with a different suffix, is the drift GOV-094 exists to remove. A single exported repository-code and item-identifier grammar from which `-BATCH-NNN` and `-RUN-NNN` are composed keeps the batch, run and item forms from diverging from each other as well.

### A second, smaller observation

`resolveBatchAuthorisation` resolves `authorisationPath` against the process working directory, not `repositoryRoot` (`authorisation.ts:142`). Called from outside the repository with the relative path its own standard prescribes, it stops with `batch authorisation is not a canonical local record`, which reads as a malformed record rather than as a working-directory mistake. That may be intended, with callers always passing an absolute path, but it cost one false reproduction here and is worth a sentence in the input type or a resolution against the root.
