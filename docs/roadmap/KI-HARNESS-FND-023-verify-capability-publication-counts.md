---
id: KI-HARNESS-FND-023
area: FND
title: Verify capability publication counts
theme: foundation-tooling
horizon: next
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T19:26:00Z
updated_at: 2026-09-15T05:40:45Z
---

# Verify capability publication counts

## Goal

Detect when an explicit capability-count claim in the root README drifts from the canonical generated capability catalogue, and repair only an unambiguous claim safely.

## Context

Since 2026-08-09, the generated skills catalogue changed in 13 commits while the root README changed in seven. The README advertised 51 skills while the catalogue reached 57 and then 58, before a manual correction to 59. Existing publication checks prove `skills/README.md` matches canonical `SKILL.md` frontmatter but do not cover the authored summary in the root README.

The current claim contains total, governance, and process counts. The canonical skill inventory already derives all three values, so the check can reuse those parsed facts without introducing another counter.

## Boundary

Use valid canonical skill frontmatter as the deterministic source. Do not require every Harness README to publish a numeric summary. Do not infer or rewrite prose when the claim is absent, incomplete, or ambiguous. CONFORM may replace only the three numeric tokens in one exact recognised claim and must preserve all surrounding authored text.

## Current state

`ki-repo-harness` already discovers every canonical skill and renders exact total and kind counts into the marker-bounded catalogue. Its Harness context reads the root README for orientation checks, but the capability-publication family currently evaluates only `skills/README.md`. No fixture exercises root-summary drift.

## Steps

- [ ] Extend the compatible-Harness context with a parsed root README capability-count observation derived from the existing canonical skill inventory.
- [ ] Add a capability-publication criterion that passes a matching explicit claim, remains not applicable when no numeric claim exists, and reports incomplete, ambiguous, or unequal claims without guessing.
- [ ] Add one bounded CONFORM proposal that replaces only the total, governance, and process number tokens when exactly one recognised claim is present.
- [ ] Cover matching, stale, absent, incomplete, ambiguous, malformed-frontmatter, and idempotent-repair cases through the existing Harness session boundary.
- [ ] Update the compatible-Harness standard and generated rubric publication for the new authored-summary invariant.
- [ ] Regenerate the capability catalogue only if the skill description or published rubric surface changes.

## Files touched

- `skills/repo-structure/ki-repo-harness/references/standards-compatible-harness.md`
- `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/harness.ts`
- A focused root-summary context module if separation keeps the parser comprehensible
- `skills/repo-structure/ki-repo-harness/scripts/rubric/items/capabilities.ts`
- Existing compatible-Harness context and item tests
- Generated `ki-repo-harness` rubric publication and `skills/README.md` only when mechanically affected

## Verify

- Focused `ki-repo-harness` capability-publication and item tests
- `ki repo conform --skill ki-repo-harness --repo . --dry-run`
- `ki repo audit --skill ki-repo-harness --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `bun run test`
- `bunx tsc --noEmit`
- `git diff --check`

## Dependencies / blocks

No dependency blocks implementation. [KI-HARNESS-GOV-058](KI-HARNESS-GOV-058-classify-skill-activation.md) owns applicability registration and does not overlap this publication invariant.

## Documentation impact

### Decision Records

No Decision Record is expected; this adds mechanical enforcement for an existing canonical-inventory relationship.

### Specifications

No repository-wide Specification change. The compatible-Harness standard and rubric own this source-publication invariant.

### Guides

No user guide change is expected because the existing AUDIT and CONFORM workflow remains unchanged.

### Roadmap

Close this item after the generated publication, focused fixtures, and repository-wide gates agree. Route any broader README composition concern separately.

## Discussion

### Failure policy

An absent count is valid because prose need not duplicate generated facts. Once an author chooses to publish a precise total and kind breakdown, all three numbers must agree. An incomplete or multiply matching statement is a diagnostic-only failure because rewriting it would require prose judgment.

### Repair boundary

The safe repair recognises one exact grammatical shape and substitutes only its numeric captures. This gives CONFORM useful mechanical behaviour without taking ownership of the rest of the README sentence.
