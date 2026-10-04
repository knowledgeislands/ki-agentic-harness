---
id: KI-HARNESS-GOV-132
area: GOV
title: Add ignored tmp area
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 42e2ac59fb3911d343e44f8fe77fe83046d6a3e4
created_at: 2026-10-04T10:18:57Z
updated_at: 2026-10-04T11:20:00Z
---

# KI-HARNESS-GOV-132: Add ignored tmp area

## Goal

Every KI repository has a third top-level working area, `tmp/`, for disposable, regenerable local output. `ki-repo` ignores it in Git by default, so nothing written there can be committed by accident or show up as untracked work.

## Context

`ki-repo` defines two working areas, `+/` for temporary inputs and `-/` for temporary outputs awaiting use or delivery. Both are tracked through their README files, because their contents are meaningful work in transit: batch records, checkpoints, trades and acquired sources. Neither suits build artefacts that are rebuilt from committed sources and never meant to travel.

The apps-observatory diagram pilot (KI-OBS-APP-034) exposed the gap. It rebuilt about 5.8 MB of interactive Archify HTML, plus receipts and browser captures, under `+/diagrams/`, and earlier Archify runs left 3.9 MB under `+/.archify/`. All of it showed as untracked, and it could have been staged by mistake. On 2026-10-04 the owner asked for `tmp` to be recognised as another working area, ignored by default.

## Boundary

The change is owned by `ki-repo`'s working-area standard and its managed ignore block, which FILES-6 already reconciles. It does not change the direction or lifecycle of `+/` and `-/` or their specialist subareas. It does not make `tmp/` a place for anything that has to survive or be reviewed. Repositories adopt the change through `ki repo conform`.

## Current state

`ki-repo` scaffolds `+/` and `-/` with README files and composes the root `.gitignore` from marker-bounded, skill-owned blocks. The `ki-repo` block reserves `reports/` but nothing for disposable scratch output, so it lands in `+/` as untracked work.

## Steps

- [x] Add `tmp/` to the `ki-repo` managed block and fold the legacy `tmp`, `/tmp` and `/tmp/` rules into it.
- [x] Cover the new rule and the fold in the `gitignore` and repository conform tests.
- [x] Document `tmp/` in the working-area standard, the ignore contract and the skill body.
- [x] Reconcile the harness's own `.gitignore`.

## Files touched

- `skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/gitignore.test.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- `skills/keystone/ki-repo/references/standards-repository.md`
- `skills/keystone/ki-repo/SKILL.md`
- `.gitignore`

## Verify

- `bun test --isolate --max-concurrency=1 ./skills/keystone/ki-repo` passes.
- `bun run test`, `bunx tsc --noEmit` and Biome pass.
- `ki repo audit --repo .` reports no FILES-6 finding for the harness.

## Dependencies / blocks

None. Other repositories adopt through `ki repo conform` once the harness change reaches their installed collection.

## Documentation impact

### Decision Records

None. [ADR-KI-HARNESS-013](../decisions/ADR-KI-HARNESS-013-compositional-ignore-management-and-generated-report-namespace.md) already makes the `ki-repo` block the owner of portable disposable output; `tmp/` is one more rule in it.

### Specifications

None.

### Guides

None. The repository standard is the canonical description.

### Roadmap

apps-observatory moves its diagram builds to `tmp/diagrams/` as its own follow-up.

## Review

### Delivered

`tmp/` is a reserved, ignored working area in every KI repository, Knowledge Bases included. It has no scaffold and no README.

### Change Summary

- The `ki-repo` managed ignore block now carries `tmp/` after `reports/`, and its purpose comment names it.
- `LEGACY_EQUIVALENTS` maps `tmp`, `/tmp` and `/tmp/` to `tmp/`, so conform drops an existing unmanaged rule instead of duplicating it.
- The standard's Working areas section defines `tmp/`: disposable, rebuildable from committed sources, safe to delete, never for material awaiting review or transfer. The ignore contract and the skill body mention it.
- The harness `.gitignore` is reconciled.

### Verification

- `bun test --isolate --max-concurrency=1 ./skills/keystone/ki-repo`: 75 pass, 0 fail. A new test asserts the rule and the legacy fold; the conform test asserts the proposal contains `tmp/`.
- `bunx tsc --noEmit`, Biome on `skills/keystone/ki-repo` and `rumdl` on the touched Markdown: clean.
- `ki repo audit --repo .`: PASS=30 WARN=2 FAIL=0, no FILES-6. The three warnings predate this change: one auto-memory reconciliation (SELECT-2) and two overdue source refreshes (LONG-3).
- `bun run test`: 852 pass, 0 fail across 141 files.

### Outstanding concerns

- Every other repository now reports FILES-6 until it is conformed, because its managed block lacks `tmp/`. That is the intended adoption path, but it turns each repository's audit red until `ki repo conform` runs there.
- The predecessor tools-ki bridge text in `audit.ts` is unchanged and still accepted as written.
- A Knowledge Base opened in Obsidian still indexes `tmp/` unless the vault excludes it; the ignore rule only covers Git.

### Post-change review

The rule sits at any depth, matching `reports/`. No local checkout tracks anything under a `tmp` directory, so no tracked file becomes ignored.

### Mini recap

Owner decisions on 2026-10-04 settled the shape; the change is one rule, three legacy mappings, tests and standard text.

## Discussion

### Owner decisions

On 2026-10-04 the owner settled the shape:

- the name is `tmp`, not `.tmp`;
- it has no README;
- it is ignored by the managed `.gitignore` block;
- it applies to every repository, Knowledge Bases included.

### Sweep

A sweep of 49 local checkouts found none tracking files under a `tmp` directory at any depth. Nine already carried an unmanaged `tmp` ignore rule, which conform now folds into the managed one.

### Adopters

Once this lands, apps-observatory moves the diagram build location from `+/diagrams/` to `tmp/diagrams/` in `docs/diagrams/README.md` and in each source's `meta.output`.
