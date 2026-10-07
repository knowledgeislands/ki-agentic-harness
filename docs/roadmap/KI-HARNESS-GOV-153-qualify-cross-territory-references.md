---
id: KI-HARNESS-GOV-153
area: GOV
title: Qualify cross-territory references
kind: deliver
purpose: capability
project: roadmap-model
component: change-management
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-07T14:55:49Z
updated_at: 2026-10-07T14:55:49Z
---

# KI-HARNESS-GOV-153: Qualify cross-territory references

## Goal

A record's `project`, and a projectless record's `initiative`, can name an entry in another territory's registry through a qualified reference, resolved through the local `ki` registry, while an unqualified slug keeps meaning the repository's own Capital territory.

## Context

The roadmap model scopes Project and Initiative slugs to a territory and resolves them through the repository's own Capital. Some repositories serve Projects owned by a different territory: chezmoi's Capital is `kit-principal`, yet its records serve Knowledge Islands Projects such as `agent-host` and the `rig` Initiative, which live in `ki-arcadia-principal`. Today those values cannot resolve, so chezmoi's audit reports its registry as unavailable.

Kris approved cross-territory Project references on 7 October 2026 (decision 9 in `~/.local/state/ki/state-of-play/design/decisions.md`): a record may name another territory's Project, for example `knowledgeislands/agent-host`, resolved through the local registry.

## Boundary

- Harness standard, checker, tests and published rubric only. `tools-ki` grouping and migration-helper support is its own record; rewriting chezmoi's values is chezmoi's migration.
- A qualified reference is classification, not authority: the referenced territory gains no plan, priority or acceptance over the record.
- No new registry file or alias table. The territory key must be resolvable from the existing `~/.local/state/ki/registry.toml`.
- Resolution stays local and read-only: no fetch, no remote lookup.

## Current state

- `standards-work-item-format.md` and `standards-project-registry.md` define `project` and `initiative` as territory-scoped kebab-case slugs resolved through the repository's own Capital.
- `roadmap-evidence.ts` fails any `project` or `initiative` value that is not a bare kebab-case slug.
- `project-registry.ts` loads only the repository's own Capital registry.
- The local registry keys repositories by name, each with its `repository` URL and checkout `path`; it holds no territory names. Several Capitals share one GitHub owner (`krisb` owns `kit-principal`, `kit-hnr`, `kit-legal` and `kit-techmedix`), so an owner name cannot identify a territory.

## Steps

- [ ] Define the qualified syntax `<territory>/<slug>`, where `<territory>` is the local-registry key of the territory's Capital, in the work-item format and the registry standard, with resolution, warning and authority rules.
- [ ] Teach `project-registry.ts` to load a named territory's registry through the local registry, checking that the named checkout declares itself a Capital.
- [ ] Teach `roadmap-evidence.ts` to accept qualified values, resolve each against its territory, and warn without failing when the territory or slug is unresolvable; keep the contradiction rule within one territory.
- [ ] Add focused tests; regenerate published rubrics; run the gates and write the review packet.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`
- `skills/change-management/ki-work/references/standards-project-registry.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/project-registry.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts`
- `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.model.test.ts`
- Any regenerated rubric publication

## Verify

- `bun run test` passes and `bunx tsc --noEmit` is clean.
- `ki repo audit --skill ki-work-roadmap` reports FAIL=0 here, and against chezmoi once its values are qualified, with no unresolved-project warning for a qualified Knowledge Islands Project.
- `ki repo audit --skill ki-skills` reports FAIL=0 with only pre-existing warnings.
- `bunx rumdl check` passes on every touched Markdown file.

## Dependencies / blocks

None. [KI-HARNESS-GOV-150](KI-HARNESS-GOV-150-check-the-roadmap-model.md) and [KI-HARNESS-GOV-151](KI-HARNESS-GOV-151-recognise-the-initiatives-folder.md) are done.

## Documentation impact

### Decision Records

None in the harness: decision 9 of the roadmap-model run is the approval, and Arcadia files the run.

### Specifications

None: no repository Specification describes the registry.

### Guides

None.

### Roadmap

A matching `tools-ki` record makes `ki roadmap list --by project|initiative` and the migration helper honour qualified references; chezmoi then qualifies its Knowledge Islands values.

## Discussion

### Territory key

Kris suggested `knowledgeislands/agent-host`. The local registry cannot resolve `knowledgeislands`: it keys repositories by name and holds no territory names, and a GitHub owner is ambiguous because `krisb` owns four Capitals. The Capital's own registry key, `ki-arcadia-principal`, is unique, already resolvable and stable, so a reference reads `ki-arcadia-principal/agent-host`. A friendlier territory alias would need a registry field the `ki` CLI owns; it can follow without changing records that already use the Capital key, by accepting both.

### Authority

Decision 9 (Kris Brown, 7 October 2026) approves the change, and decision 6 grants carry-through to done for the whole rollout, including fast-forward pushes of the commits it makes. That is the adoption, readiness and acceptance authority for this record.
