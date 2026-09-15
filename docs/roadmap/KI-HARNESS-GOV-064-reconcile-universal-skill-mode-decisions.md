---
id: KI-HARNESS-GOV-064
area: GOV
title: Reconcile Universal Skill Modes
theme: governance-consistency
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-15T05:40:45Z
---

# Reconcile universal skill mode decisions

## Goal

Give the Harness one unambiguous definition of universal governance modes and HELP so current Decision Records, skill guidance, and rubric language describe the same enacted contract.

## Context

`ADR-KI-HARNESS-007` says governance skills expose exactly four universal modes and treats HELP as skill documentation. `ADR-KI-HARNESS-SKILLS-001` first defines the same four acting modes, then calls HELP a fifth universal mode. `ADR-KI-HARNESS-SKILLS-006` and the `ki-skills` rubric repeat “modes + HELP” or “HELP mode” language.

Enacted skills consistently distinguish the four governance operations—AUDIT, CONFORM, EDUCATE, and REFRESH—from the non-acting `help`, `-h`, and `?` entry point. The reconciliation can therefore clarify existing behaviour without changing invocation or adding a mode.

## Boundary

Preserve the distinct decisions: `ADR-KI-HARNESS-007` owns native operations and aggregate execution, while `ADR-KI-HARNESS-SKILLS-001` owns interaction vocabulary and HELP behaviour. Do not remove HELP, change its pure-explain semantics, alter process-skill exemptions, reorder acting modes, or introduce a new invocation surface.

## Current state

The contradiction is confined to authority and rubric wording. The implementation already exposes four universal governance operations plus a pure explanatory HELP entry point. No source migration or consumer compatibility layer is required.

## Steps

- [ ] Amend `ADR-KI-HARNESS-SKILLS-001` in place to call HELP a universal non-acting entry point rather than a fifth mode, and replace “universal five” with “four modes plus HELP”.
- [ ] Clarify `ADR-KI-HARNESS-007` only where necessary to cross-state the same boundary without duplicating HELP's interaction contract.
- [ ] Align `ADR-KI-HARNESS-SKILLS-006` terminology so skill kind requires the four governance modes and the HELP entry point separately.
- [ ] Replace “HELP mode” wording in the `ki-skills` standard, rubric source, and generated rubric with “HELP entry point” while preserving the existing `argument-hint` and pure-explain checks.
- [ ] Search all current Decision Records and canonical skill standards for remaining claims that count HELP among universal modes; classify examples and historical quotations before editing.
- [ ] Add or adjust focused rubric fixtures only if terminology changes expose an untested behavioural distinction.
- [ ] Regenerate affected rubric and capability publications, then run the complete gates.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-007-uniform-skill-modes-bare-mode-scripts-and-a-coverage-scoped-aggregate-gate.md`
- `docs/decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md`
- `docs/decisions/ADR-KI-HARNESS-SKILLS-006-concern-first-skill-taxonomy-and-implication-graph.md`
- `skills/keystone/ki-skills/SKILL.md` and directly affected references or rubric sources
- Generated `ki-skills` rubric and `skills/README.md` only when mechanically affected
- This roadmap record

## Verify

- Search current authority and standards for contradictory universal-mode counts
- Focused `ki-skills` shape and publication tests
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo conform --skill ki-repo-harness --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No dependency blocks implementation. The accepted resolution is that universal governance operations remain exactly four and HELP is a required, non-acting entry point. This follows enacted behaviour and preserves both decisions' separate ownership.

## Documentation impact

### Decision Records

Amend the three current records in place so their present-state authority agrees. No new decision is needed because invocation behaviour does not change.

### Specifications

No repository-wide Specification change. This reconciles authority terminology around an existing skill-shape contract.

### Guides

Update only a guide that currently counts HELP as a mode; do not add new user workflow documentation.

### Roadmap

Close this item after the authority search and generated rubric agree. Route unrelated skill-applicability work to [KI-HARNESS-GOV-058](KI-HARNESS-GOV-058-classify-skill-activation.md).

## Discussion

### Authoritative distinction

A mode performs or governs a domain operation. HELP explains the capability and routes the caller without acting. Both are universally available on governance skills, but counting the entry point as a fifth mode makes “exactly four” false and obscures the operational boundary.

### Compatibility

This is a living-record reconciliation, not a runtime migration. Commands, arguments, ordering, and checks remain as they are; only contradictory present-state descriptions and generated labels change.
