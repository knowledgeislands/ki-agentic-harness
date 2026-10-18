---
id: KI-HARNESS-GOV-212
area: GOV
title: Work area ownership
kind: deliver
purpose: governance
project: ways-of-working
component: keystone
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-18T08:55:28Z
updated_at: 2026-10-18T08:55:28Z
---

# KI-HARNESS-GOV-212: Work Area Ownership

## Goal

`ki-repo`'s working-area standard names `+/_WORK/` and `+/_WORK_REVIEW/` and their owners, and its COVERAGE check takes either of them as the `ki-checkpoint` signal, so that a migrated repository passes coverage on the new areas; `+/_CHECKPOINTS/` and `+/_THREADS/` stay accepted, each with a warning naming its new home, until the tolerance window closes.

## Context

Kris Brown answered "yes, go ahead with all the recommended" on 18 October 2026 in the ways-of-working decisions log, "owner answers, batches 6 and 7", read back as taken:

> REPO-OWNERSHIP a) - one harness record teaches ki-repo `+/_WORK/` and `+/_WORK_REVIEW/`, still accepting the old areas with a warning; lands before any other territory migrates.
>
> COV-1 a) - ki-checkpoint's coverage marker moves to `+/_WORK/`, accepting `+/_CHECKPOINTS/` through the tolerance window; lands before the next territory.

The two answers change one check and one owner list, so they share this record. The work model, decided in [GDR-KI-PRINCIPAL-009](https://github.com/knowledgeislands/ki-principal/blob/main/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-009-the-work-model.md) and written into the harness by [KI-HARNESS-GOV-210](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md), puts each piece of work in `+/_WORK/<id>/` and migrated work awaiting review in `+/_WORK_REVIEW/<id>/`. After Knowledge Islands Principal migrated, its governance audit warned COV-1 "declares [skills.ki-checkpoint] but no +/_CHECKPOINTS/ subarea found - stale opt-in?", because the `ki-checkpoint` coverage signal is still the old folder.

## Boundary

- In: `ki-repo`'s working-area owner list in `references/standards-repository.md`; the coverage signal table and its tolerance sentence in `references/standards-configuration.md`; the `ki-checkpoint` COVERAGE entry and a tolerance-window warning for each old area present in `scripts/rubric/contexts/audit.ts`; their tests; any regenerated surface.
- Out: `ki-checkpoint`'s and `ki-pmo`'s own audits, which already read both shapes; `ki-checkpoint`'s `owns` declaration of the retained `+/_CHECKPOINTS/README.md` scaffold; moving any repository's files; closing the tolerance window, which phase 5 of the migration does; a release of `ki` or the harness.

## Current state

`references/standards-repository.md` says `ki-checkpoint` owns `+/_CHECKPOINTS/README.md` and active checkpoint records and `ki-delegation` owns `+/_THREADS/<run>/` thread folders; it names neither `+/_WORK/` nor `+/_WORK_REVIEW/`. The COVERAGE table in `audit.ts` detects `ki-checkpoint` only by a path under `+/_CHECKPOINTS/`, and `standards-configuration.md` lists the same signal. Nothing in `ki-repo` warns on an old area.

## Steps

- [ ] `standards-repository.md`: replace the two old owner lines with `+/_WORK/` (the work file `work.md` owned by `ki-checkpoint`, the rest of each work folder by `ki-pmo`) and `+/_WORK_REVIEW/` with its `README.md` index (owned by `ki-pmo`), and add the tolerance-window sentence for `+/_CHECKPOINTS/` and `+/_THREADS/<run>/`.
- [ ] `audit.ts`: the `ki-checkpoint` COVERAGE entry detects a path under `+/_WORK/`, `+/_WORK_REVIEW/` or, for the tolerance window, `+/_CHECKPOINTS/`; in a confirmed ki-repo, each old area present, `+/_CHECKPOINTS/` or `+/_THREADS/`, adds one COV-1 warning naming its new home.
- [ ] `standards-configuration.md`: the signal row names the new areas and the old one, and one sentence states the old-area warning.
- [ ] Tests in `repository.test.ts`: `+/_WORK/` and `+/_WORK_REVIEW/` each satisfy a declared `[skills.ki-checkpoint]` and require it when undeclared; `+/_CHECKPOINTS/` still satisfies it, with one warning; `+/_THREADS/` warns; a repository with only new areas has no COV-1 finding once declared.
- [ ] Regenerate any generated surface and run Verify.

## Files touched

- `skills/keystone/ki-repo/references/standards-repository.md`
- `skills/keystone/ki-repo/references/standards-configuration.md`
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`
- `skills/keystone/ki-repo/scripts/rubric/contexts/repository.test.ts`
- this record

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-repo` reports the rubric current.
- `ki repo audit --skill ki-repo`, `--skill ki-checkpoint`, `--skill ki-skills`, `--skill ki-authoring` and `--skill ki-work-roadmap` report no new failure in the contract under change.
- `ki repo audit --repo <ki-principal> --skill ki-repo` no longer warns that `[skills.ki-checkpoint]` is a stale opt-in.

## Dependencies / blocks

No blocker. The checks reach other repositories only when `ki` loads the harness's updated catalogue; no release is part of this record. Kris asked for it to land before any other territory migrates.

## Documentation impact

### Decision Records

None: the work model's decision record in Knowledge Islands Principal already sets the areas; this record aligns `ki-repo` with it.

### Specifications

None: `ki-repo`'s standards are the contract and change in place.

### Guides

None.

### Roadmap

None.

## Discussion

Captured, adopted to Now and planned to Ready by the `harness-followups` run in the ways-of-working work on Kris Brown's REPO-OWNERSHIP a) and COV-1 a) answers, which asked for one harness record each, landed before the next territory migrates; the two share this record because they change one owner list and one check.
