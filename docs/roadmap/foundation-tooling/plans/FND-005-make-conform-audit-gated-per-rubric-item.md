---
id: 'FND-005'
title: Make CONFORM audit-gated per rubric item
status: acceptance
roadmap: foundation-tooling/make-conform-audit-gated-per-rubric-item
blocks: —
blocked-by: —
---

## Context

Mechanical CONFORM must be truthful, minimal, and understandable at the level of an individual rubric item.

Running a complete audit followed by a complete write pass either performs needless work on already-clean criteria or forces each skill to recreate selective-audit logic independently.

## Current state

The shared checker audits each mechanical item immediately before any repair and re-audits after a persistent write.

`ki-engineering` is the first migrated proof rather than a special case, and direct and aggregate progress count the same flattened mechanical-item total.

## Steps

1. ✓ Define the shared mechanical-CONFORM contract: per-item pre-audit, explicit repair eligibility, conditional repair, post-repair audit, final outcome, and one completed progress unit.
2. ✓ Refactor the vendorable checker and rubric types so an item can declare a repair action and, where needed, explicit repair-on-`INFO` eligibility without treating all informational outcomes as mutable defects.
3. ✓ Preserve safe mutable contexts across a single item's pre-audit, repair, and verification while allowing a fresh evidence view after a write; do not turn context construction into a hidden whole-checker audit.
4. ✓ Make the reporter emit only each item's terminal outcome on JSONL, retain concise progress on stderr, and ensure `FIXED` requires both an observed persistent change and a passing post-repair audit.
5. ✓ Make direct and aggregate progress use the same flattened total of mechanical rubric-item executions; the aggregate may name the active skill, but must not advance only once per skill.
6. ✓ Migrate `ki-engineering` from its local selective-audit workaround as the first proof, then cover clean skips, repairable violations, declared repairable `INFO`, non-repairable `INFO`, dry runs, no-op writes, failed post-repair audits, and direct/aggregate per-item progress.
7. ✓ Use the resulting contract to identify the next small rollout set without changing unrelated skills in this plan.

## Files touched

- `skills/keystone/ki-skills/scripts/shared/`
- `skills/keystone/ki-skills/references/`
- `skills/foundations/ki-engineering/scripts/`
- focused checker, reporter, and engineering tests
- generated checker payloads where source parity requires them

## Verify

- A clean item never invokes its repair action during CONFORM.
- A repairable failing item is re-audited immediately and reports `FIXED` only after a real persistent change and a clean result.
- An ordinary `INFO` remains non-mutating; only an item that explicitly opts in may repair an `INFO` outcome.
- Judgment items remain counted as unevaluated and are never mechanically repaired.
- Canonical JSONL contains terminal findings only; progress remains visible without contaminating it.
- Direct and aggregate output advance against the same mechanical rubric-item total, not a skill count.
- `bun skills/keystone/ki-skills/scripts/shared/checker.test.ts`
- `bun skills/foundations/ki-engineering/scripts/conform.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan has no external dependency.

It is deliberately separate from FND-004: one establishes the roadmap/plan relationship, while this one establishes truthful mechanical repair semantics for every checker.

## Acceptance

- **Delivered:** Shared per-item audit-gated CONFORM, terminal-only reporter outcomes, consistent progress accounting, the `ki-engineering` migration, and focused coverage.
- **Verification:** The focused checker and engineering coverage, `bun run test`, and `bun run ki:audit` passed against this restored review state on 2026-07-20.
- **Outstanding concerns:** None known.
- **Mini recap:** Moving the repair contract into the shared checker avoided another skill-specific workaround. No additional durable learning route is proposed.
