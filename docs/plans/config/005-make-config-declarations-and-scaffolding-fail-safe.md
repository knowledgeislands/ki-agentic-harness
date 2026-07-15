---
id: '005'
title: Make configuration declarations and scaffolding fail-safe
status: open
roadmap: Make configuration declarations and scaffolding fail-safe
blocks: —
blocked-by: —
---

# Make configuration declarations and scaffolding fail-safe

## Context

The governance set is derived from `.ki-config.toml`, so silently dropping a declared skill or requiring a manual edit before the documented bootstrap path can work undermines the repo's self-sufficiency contract. Two ROADMAP gaps share that boundary: unresolved `[ki-*]` tables disappear inside bootstrap resolution, and `FILES-3` tells users to run INIT for missing foundations even though INIT does not scaffold the config. The desired outcome is fail-before-write resolution plus owner-controlled, append-only scaffolding that makes a greenfield or partially configured repo self-governing in one run.

## Current state

- `link-skills.ts --check` already reports an unresolvable declaration as `BOOT-1` FAIL, but linker write/dry-run mode, `resolveSet()`, bootstrap INIT, and BOOT-9 can still continue with the unknown root filtered out.
- `resolveSet()` extracts only exact top-level headers, silently skips non-skills in its closure, and is the shared source for `bootstrap.ts` and the harness-side BOOT-9 audit.
- `ki-repo` owns the `.ki-config.toml` file-level contract and required bare `[ki-authoring]` marker. Its `audit.ts --init` emits a new-file template, `conform.ts` carries a stale partial template, and `init.ts` delegates directly to bootstrap without writing config.
- The documented zero-install route `bootstrap.ts <target> --seed ki-repo` bypasses the per-skill INIT delegator, so fixing only `ki-repo/scripts/init.ts` would leave that route false.
- Canonical repo audit/conform scripts are coverage-vendored into `.ki-meta`; edits to them require formatting before a coverage-scoped re-bootstrap and source/vendor hash verification.

## Steps

1. ✓ Trace both gaps and lock ownership: `ki-bootstrap` is the canonical skill-index authority and must fail resolution before mutation; `ki-repo` owns every `.ki-config.toml` byte and exposes a scaffold-only INIT leg that bootstrap invokes by subprocess composition.
2. Harden `ki-bootstrap` resolution and all callers:
   - Parse and deduplicate root owners from exact and dotted `[ki-*]` headers while ignoring comments and `coverage-*` keys.
   - Validate declared roots and explicit seeds against the ref-specific canonical skill index; return a typed, sorted unresolved-root error instead of a partial set.
   - Make bootstrap INIT stop before `.ki-meta` mutation, make BOOT-9 emit a structured FAIL, and make linker write, dry-run, and check modes reject orphans before mutation while retaining `BOOT-1` reporting.
3. Add run-based resolver/bootstrap/linker regressions and wire them into `bun run test`: unknown and duplicate roots, dotted known/unknown roots, comments and coverage overrides, valid process/bootstrap declarations, invalid seeds, known implication closure, and byte-identical/no-`.ki-meta` fail-before-write behavior.
4. Implement append-only `ki-repo` scaffolding:
   - Add a scaffold-only leg to `ki-repo` INIT that creates a missing config with one `[ki-repo]` default block plus one bare `[ki-authoring]`, or appends only whichever root marker is absent.
   - Detect exact root headers without treating `[ki-repo.checks]` as the root; preserve every existing byte as an exact prefix; never change values, comments, ordering, or another skill's keys; make the operation idempotent and dry-run safe.
   - When `ki-repo` is seeded or resolves, have bootstrap invoke that owner leg, then re-resolve before vendoring. Bare bootstrap with no seed and no config remains an empty-set operation.
   - Give CONFORM the same FILES-1/FILES-3 repair behavior and keep its emitted new-file template aligned with `audit.ts --init`.
5. Add run-based INIT/bootstrap/CONFORM regressions: greenfield direct INIT and `--seed ki-repo`, each partial-marker direction, custom-byte preservation, subtable-only detection, repeat idempotency, dry-run no-write, ordinary re-bootstrap repair, and same-run vendoring of both `ki-repo` and `ki-authoring` plus the self-check runners.
6. Reconcile the `ki-bootstrap` and `ki-repo` standards, rubrics, help prose, script comments, and audit remediation text with the fail-before-write and owner-delegated scaffold contract. Remove the contradictory injected-baseline/never-edits-config claims while retaining the rule that bootstrap embeds no TOML schema and never edits config directly.
7. Format canonical scripts, re-bootstrap coverage, and verify canonical/vendored repo checker hashes. Run focused tests, `bun run test`, `bun run ki:skills:audit`, `bun run ki:authoring:audit`, and `bun run ki:audit`; adversarially review the config-writing and bootstrap paths before integration.

## Files touched

- `skills/keystone/ki-bootstrap/SKILL.md`
- `skills/keystone/ki-bootstrap/references/audit-rubric.md`
- `skills/keystone/ki-bootstrap/references/bootstrap-standard.md`
- `skills/keystone/ki-bootstrap/scripts/resolve.ts`
- `skills/keystone/ki-bootstrap/scripts/bootstrap.ts`
- `skills/keystone/ki-bootstrap/scripts/audit.ts`
- `skills/keystone/ki-bootstrap/scripts/link-skills.ts`
- `skills/keystone/ki-bootstrap/scripts/link-skills.test.ts`
- `skills/keystone/ki-bootstrap/scripts/resolve.test.ts`
- `skills/keystone/ki-repo/SKILL.md`
- `skills/keystone/ki-repo/references/audit-rubric.md`
- `skills/keystone/ki-repo/references/ki-config-standard.md`
- `skills/keystone/ki-repo/references/repo-standard.md`
- `skills/keystone/ki-repo/scripts/audit.ts`
- `skills/keystone/ki-repo/scripts/conform.ts`
- `skills/keystone/ki-repo/scripts/init.ts`
- `skills/keystone/ki-repo/scripts/init.test.ts`
- `package.json`
- `.ki-meta/skills/ki-repo/`

## Verify

- Every unresolvable declared or seeded root fails before any linker or bootstrap mutation, names each root once in sorted order, and remains unsuppressible by coverage overrides.
- Known exact/dotted declarations still resolve the correct implication closure; process/global skills remain existence-valid, and `ki-bootstrap` remains excluded from the vendored set.
- Greenfield and partial configs converge to exactly one `[ki-repo]` root and one bare `[ki-authoring]` marker without changing pre-existing bytes; dry-run writes nothing and a second run is byte-identical.
- Direct `ki-repo` INIT and `bootstrap.ts --seed ki-repo` both produce a runnable `.ki-meta/bin/ki-audit` and vendor the two declared foundations in the same run.
- Canonical and vendored `ki-repo` audit/conform scripts have matching hashes after the coverage-scoped bootstrap.
- Focused tests, the full test suite, skill/authoring/plan audits, and the aggregate audit exit clean apart from already-recorded unrelated standing warnings.

## Dependencies / blocks

No plan dependency. Plan 004's authenticated Claude runtime smoke test is independent. This plan closes two previously separate ROADMAP gaps at the same config/bootstrap boundary; the larger schema and per-skill override-documentation candidates remain intentionally out of scope.
