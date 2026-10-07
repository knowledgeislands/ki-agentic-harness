---
id: KI-HARNESS-GOV-153
area: GOV
title: Qualify cross-territory references
kind: deliver
purpose: capability
project: roadmap-model
component: change-management
status: done
blocks: []
blocked_by: []
baseline_ref: fba2230c97d119ea5b4efa22b34b786e17329fdc
created_at: 2026-10-07T14:55:49Z
updated_at: 2026-10-07T15:02:03Z
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

- [x] Define the qualified syntax `<territory>/<slug>`, where `<territory>` is the local-registry key of the territory's Capital, in the work-item format and the registry standard, with resolution, warning and authority rules.
- [x] Teach `project-registry.ts` to load a named territory's registry through the local registry, checking that the named checkout declares itself a Capital.
- [x] Teach `roadmap-evidence.ts` to accept qualified values, resolve each against its territory, and warn without failing when the territory or slug is unresolvable; keep the contradiction rule within one territory.
- [x] Add focused tests; regenerate published rubrics; run the gates and write the review packet.

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

## Review

### Delivered

A record's `project`, and a projectless record's `initiative`, may now name another territory's registry entry as `<territory>/<slug>`, where `<territory>` is the local `ki` registry key of that territory's Capital, for example `ki-arcadia-principal/agent-host`. Unqualified slugs keep meaning the repository's own Capital territory. Unresolvable territories and slugs warn and never fail. Excluded: `tools-ki` grouping and migration-helper support, and rewriting chezmoi's values. Baseline `fba2230c97d119ea5b4efa22b34b786e17329fdc`.

### Change Summary

- `skills/change-management/ki-work/references/standards-project-registry.md`: new Cross-territory references section with the syntax, the Capital-key rule, the Capital self-declaration check, unqualified meaning, warning-only resolution and classification-not-authority; Validation names the referenced territory and a cross-territory contradiction; a table of contents, now that the file passes 100 lines.
- `skills/change-management/ki-work-roadmap/references/standards-work-item-format.md`: the classification table and `project` paragraph admit territory-qualified values.
- `project-registry.ts`: the registry reader is split from Capital discovery; new `loadTerritoryRegistry` resolves a registry key to a checkout that declares itself a Capital; new `parseRegistryReference` splits `<territory>/<slug>`.
- `roadmap-evidence.ts`: `project` and `initiative` accept qualified values, each territory resolves once and warns once when unavailable, unknown slugs warn with the full value, and the contradiction rule compares Initiatives within the Project's territory, naming the qualified Initiative.
- `roadmap-evidence.model.test.ts`: tests for parsing, territory resolution and qualified membership, including a same-slug contradiction across territories.

Decision: the territory key is the Capital's registry key rather than `knowledgeislands`, because the registry holds no territory names and `krisb` owns four Capitals (Discussion, Territory key).

### Verification

- `bun run test`: 973 pass, 0 fail.
- `bunx tsc --noEmit`: clean.
- `ki repo audit --skill ki-work-roadmap`: FAIL=0, WARN=2, both pre-existing `theme` migration warnings on GOV-149 and GOV-150.
- `ki repo audit --skill ki-work`: PASS.
- `ki repo audit --skill ki-skills`: FAIL=0, WARN=1, the pre-existing LONG-3 refresh-cadence warning.
- `ki dev skill rubric ki-work-roadmap` and `ki-work`: in sync.
- `bunx rumdl check` on both touched standards: no issues.
- A scratch copy of chezmoi's roadmap with every `project` and `initiative` qualified as `ki-arcadia-principal/<slug>`: `ki repo audit --skill ki-work-roadmap` FAIL=0 and no registry warning, against the current `project registry is unavailable` warning on the live checkout.

### Outstanding concerns

`ki roadmap list --by project|initiative` and the migration helper in `tools-ki` do not yet understand qualified values; KI-TOOL-CLI-113 owns that. Chezmoi's own value rewrite is its migration under the same rollout.

### Post-change review

The goal is met with no new failure path: a qualified value either resolves or warns. Existing bare slugs resolve exactly as before, and the full suite passes unchanged apart from the widened format message. Regression risk is low and confined to classification warnings. Ready for acceptance.

### Mini recap

Qualified `<capital-key>/<slug>` references now resolve through the local registry, with warnings only when they cannot. Gates pass. Learning route: a friendlier territory alias would need a registry field owned by the `ki` CLI.

## Done

Accepted 2026-10-07 by Kris Brown on the review packet above.

## Discussion

### Territory key

Kris suggested `knowledgeislands/agent-host`. The local registry cannot resolve `knowledgeislands`: it keys repositories by name and holds no territory names, and a GitHub owner is ambiguous because `krisb` owns four Capitals. The Capital's own registry key, `ki-arcadia-principal`, is unique, already resolvable and stable, so a reference reads `ki-arcadia-principal/agent-host`. A friendlier territory alias would need a registry field the `ki` CLI owns; it can follow without changing records that already use the Capital key, by accepting both.

### Authority

Decision 9 (Kris Brown, 7 October 2026) approves the change, and decision 6 grants carry-through to done for the whole rollout, including fast-forward pushes of the commits it makes. That is the adoption, readiness and acceptance authority for this record. Closed through `ki-accept` under that grant after rechecking the review evidence on the committed delivery (`31dea9bb`): `bun run test` 973 pass and 0 fail, `bunx tsc --noEmit` clean, and `ki repo audit --skill ki-work-roadmap` FAIL=0.
