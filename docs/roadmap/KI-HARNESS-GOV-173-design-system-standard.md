---
id: KI-HARNESS-GOV-173
area: GOV
title: Design system standard
kind: deliver
purpose: capability
component: design
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: e1c6243e514d4bd5cd43585540b229e58cc4c4ca
created_at: 2026-10-11T03:40:00Z
updated_at: 2026-10-11T04:50:00Z
---

# KI-HARNESS-GOV-173: Design System Standard

## Goal

A repository with a user interface keeps its design knowledge the same way every time: values in its token source, the practical how in a design guide, stable behaviour in Specifications, the why in Decision Records, and checks that keep them true, with design work moving from a brief through options and an owner's decision to rules that outlast it.

## Context

The 5G-EMERGE Phase 3 calendars page was designed in October 2026 from an owner's brief, through three directions on a design canvas, to a combined choice, then built and consolidated into a site design guide, a refined colour Decision Record and contrast checks. Kris asked on 2026-10-11 how design records should be kept for the future, then asked for that method as a Knowledge Islands skill under `skills/design/`, covering how, what and why rather than any repository's own design guide. Kris chose a governance skill named `ki-design-system`, delivered as files in the primary checkout for Kris to commit.

The harness already held `ki-design-inspiration` for visual references and `ki-design-loop` for the shape of Projects and cross-cutting models; neither said where a repository's interface design knowledge lives or how it stays true.

## Boundary

- **In:** the `ki-design-system` skill with its standard, modes, exemplar, sources, guide skeleton and structured rubric; reciprocal off-ramps in `ki-design-inspiration` and `ki-design-loop`; the regenerated capability catalogue and README counts.
- **Out:** any repository's own design guide or tokens; changes to the Guides, Specifications, Decision Records or design-loop standards; declaring the skill in `5g-emerge-phase3`, which waits for a harness release that carries it; the website-owned skills-by-outcome guide.

## Current state

Committed on `main` in the primary checkout, after the ledger advance on its own; not pushed. A harness release then lets adopting repositories declare the skill.

## Steps

- [x] Write `references/standards-design-system.md`: scope and boundary, where design knowledge lives, the token source, the design guide, design Specifications and Decision Records, design work from brief to rule, checks, the floor, projections and configuration.
- [x] Write `SKILL.md`, the four mode procedures, exemplars, sources and the guide skeleton in `assets/`.
- [x] Write the structured rubric: DSYS-1 to DSYS-3 fail on the declaration, guide and checks; DSYS-4 and DSYS-5 warn on unnamed token sources and literal colour values; DSYS-6 to DSYS-8 are judgment. Materialise `scripts/shared/rubric.ts` from `ki-skills` and regenerate `references/rubric.md`.
- [x] Add `ki-design-system` as an off-ramp in the descriptions of `ki-design-inspiration` and `ki-design-loop`.
- [x] Regenerate the capability catalogue and README counts with `ki repo conform --skill ki-repo-harness`.
- [x] Update the fleet remediation inventory counts the new catalogue changes.
- [x] Pilot the checker on `5g-emerge-phase3` with a temporary declaration.

## Files touched

- `skills/design/ki-design-system/` (new): `SKILL.md`, `assets/design-guide.md`, `references/` (standard, four modes, exemplars, sources, generated rubric), `scripts/shared/rubric.ts`, `scripts/rubric/contexts/design.ts` and its test, `scripts/rubric/items/` (`index.ts`, `design.ts`, `publication.ts`, index test)
- `skills/design/ki-design-inspiration/SKILL.md` and `skills/change-management/ki-design-loop/SKILL.md` (descriptions)
- `skills/README.md` (generated catalogue) and `README.md` (counts)
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` (fleet counts)
- `docs/roadmap/_ISSUES.md` and this record

## Verify

- `bun test --isolate ./skills/design/ki-design-system` passes; `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-design-system` reports `references/rubric.md` in sync.
- `ki repo audit --skill ki-skills` and `ki repo audit --skill ki-repo-harness` show no new finding.
- `ki repo audit --skill ki-design-system` passes on `5g-emerge-phase3` with the exemplar's declaration.

## Dependencies / blocks

No roadmap dependency. `5g-emerge-phase3` can declare the skill only once a harness release carries it.

## Documentation impact

### Decision Records

None. The standard is house policy owned by the skill, as for `ki-diagrams`.

### Specifications

None.

### Guides

None in this repository. The skill's guide skeleton is for adopting repositories.

### Roadmap

Closes this record on acceptance.

## Review

### Delivered

`ki-design-system`, a declaration-only governance skill in `skills/design/`. Its standard routes each kind of design knowledge to one home, defines design work in six stages from brief to retirement, names four groups of checks, sets a four-part floor, treats outside design tools as projections, and reads three `.ki.toml` keys validate-down. It prescribes no interface's appearance.

### Change Summary

- New skill with standard, modes, exemplar, sources, guide skeleton and an eight-item rubric (five mechanical, three judgment).
- Reciprocal off-ramps in `ki-design-inspiration` and `ki-design-loop`.
- Catalogue and README counts regenerated: 62 skills, 51 governance and 11 process; fleet inventory counts updated.

### Verification

Run in a clone at the baseline, with `ki` 0.10.1 from `tools-ki` source hosting the clone as the installed harness through a temporary `XDG_DATA_HOME` link:

- `bun test --isolate ./skills/design/ki-design-system`: 10 pass, 0 fail. `bun run test` across skills, hooks and evals: 1,072 pass, 0 fail. `bunx tsc --noEmit`: pass. Biome and rumdl: clean. The fleet remediation inventory test pins criterion counts, so its expected counts move by the new catalogue: one more catalogue, nine more criteria (six mechanical, four judgment, one hybrid).
- `ki dev skill rubric ki-design-system`: in sync after `--write`.
- `ki repo audit --skill ki-skills`: FAIL=0, WARN=1, the pre-existing fleet finding LONG-3 (a source last reviewed 2026-06-21); every criterion for the new skill passes or is not applicable.
- `ki repo audit --skill ki-repo-harness`: CAP-2 and CAP-3 failed before the catalogue regeneration and passed after it. `ki-work-roadmap` keeps its two pre-existing warnings.
- `5g-emerge-phase3` at `3ac0eab` with the exemplar's declaration: `ki repo audit --skill ki-design-system` PASS, six mechanical criteria evaluated. The same pilot found the site design guide linking two Decision Records outside its collection, a `ki-guides` GUIDE-4 failure, fixed there in `ceaf953`, the revision the exemplar now pins.

### Outstanding concerns

- DSYS-4 accepts a token source named only by its file name, which passes a guide that says `tokens.css` where two token files share that name; no adopter has that case yet.
- DSYS-5 reads the whole guide, code blocks included, so a guide quoting a third-party colour example warns; its judgment aspect clears an illustration.

### Post-change review

Read cold, the standard tells a maintainer where each design statement goes and what each design-work stage leaves behind, without consulting this record or the pilot.

### Mini recap

The design-record method from the Phase 3 calendars work is now a harness standard with a checker; adopting it is a three-key declaration once released.

## Discussion

### Owner choices - 2026-10-11

Kris chose a governance skill over a process skill, the name `ki-design-system`, and delivery as uncommitted files in the primary checkout.
