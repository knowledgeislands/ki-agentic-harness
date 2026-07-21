---
id: 'FND-016'
title: Implement scoped lifecycle operations
status: done
roadmap: foundation-tooling/implement-scoped-lifecycle-operations
blocks: —
blocked-by: —
---

## Context

`ODR-KI-HARNESS-001` separates repository CLEAN from repository and user UNINSTALL, and defines DOCTOR as read-only at either explicit scope.

CLEAN already has an accepted conservative repository implementation, and the completed unified migration places the repository footprint under `.ki/`.

This plan turns that decision into one coherent lifecycle contract and safe source-owned operation layer, without collapsing distinct effects into a single destructive command.

## Current state

Repository CLEAN removes proven generated output but deliberately preserves adoption intent and all user-level state.

There is no scoped UNINSTALL operation, no common ownership classifier spanning repository and user state, and no final zero-install public-launcher contract for these operations.

## Steps

1. ✓ Reconcile `ODR-KI-HARNESS-001`, the completed CLEAN contract, and the established `.ki/` layout into an explicit ownership matrix: repository declaration, authored source, generated repository state, runtime projections, user installation, hooks, and unrelated files. Define selected-scope inputs, allowed effects, recovery paths, and refusal conditions for CLEAN and both UNINSTALL scopes.
2. ✓ Implement or extract narrow source-owned ownership-proof and safe-transaction primitives. Repository UNINSTALL may remove only proven KI declarations and repository footprint; user UNINSTALL may remove only proven KI-managed user installation material. Neither operation may cross its selected scope, follow an unsafe link, delete altered or unfamiliar content, or infer an omitted scope.
3. ✓ Provide repository operations through zero-install launchers that obtain temporary source without installing or mutating user state. Keep source, launcher, help, exit, dry-run, report, and error contracts explicit and usable when the repository's generated runner has been removed.
4. ✓ Align CLEAN, UNINSTALL, bootstrap/EDUCATE recovery, `.ki/` manifests, generated runtime payloads, user-managed payloads, documentation, and help so each operation names its effect accurately. Remove superseded paths and dead lifecycle code once current state conforms.
5. ✓ Add focused repository and user fixtures for healthy, absent, altered, unmarked, linked, concurrent-change, repeat, dry-run, partial-state, and scope-isolation cases. Verify that CLEAN followed by EDUCATE restores generated state while UNINSTALL intentionally ends adoption at only its chosen scope.
6. ✓ Re-vendor affected payloads and run focused lifecycle tests followed by serial repository gates. Leave DOCTOR implementation and `ki` dispatch to their dependent plans, exposing only the stable operations they require.

## Files touched

- `skills/keystone/ki-bootstrap/` — lifecycle entrypoints, ownership checks, launchers, help, and tests.
- `skills/repo-structure/ki-harness/`, managed user-install/hook components, and runtime publication code where their ownership markers participate.
- `.ki/`, runtime projections, user-install fixtures, documentation, and generated payload refreshes.
- `docs/decisions/ODR-KI-HARNESS-001-scoped-lifecycle-operations.md` — only if implementation exposes a material unresolved boundary.

## Verify

1. CLEAN, `repo uninstall`, and `user uninstall` have distinct, explicit scope and effect; no command crosses the selected scope.
2. Every deletion requires ownership proof and rejects altered, unmarked, linked, unsafe, or concurrently changed material.
3. Zero-install repository launchers do not create or mutate user-level installation state.
4. CLEAN then EDUCATE recovers generated repository state; each UNINSTALL leaves the opposite scope untouched.
5. Focused lifecycle and user-install tests, `bun run test`, and `bun run ki:audit` pass.

## Dependencies / blocks

The completed CLEAN baseline supplies the conservative generated-output boundary; the `.ki/` footprint is already established.

The committed operation and scope contract enables FND-017 DOCTOR and FND-018 `ki` implementation in parallel. FND-016 acceptance remains a review dependency, not an execution gate for those plans.

## Delegation

- Round 1 — safety review: a `gpt-5.6-terra` worker adversarially reviews the repository and user UNINSTALL scripts plus their fixtures; files: read-only lifecycle implementation and tests; gate: concrete findings or an explicit clean review before final verification.
- Round 2 — mechanical: the orchestrator addresses any accepted safety findings, refreshes generated material only when the bootstrap gate requires it, and runs the final serial repository gates; files: lifecycle implementation, docs, and generated surfaces; gate: focused tests, then `bun run test` and `bun run ki:audit`.
- Orchestrator: reviews every worker result, owns all commits, and presents the final acceptance packet.

## Acceptance

### Delivered

Repository CLEAN, repository UNINSTALL, and user UNINSTALL now have separate source-owned operations with explicit, non-crossing ownership boundaries and a temporary-source repository launcher.

### Summary of changes

- Added the ownership matrix and lifecycle guidance, repository and user UNINSTALL entrypoints, and `repo-operation.sh` for repository CLEAN/UNINSTALL.
- Hardened the deletion transactions in [`repo-clean.ts`](../../../../skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-clean.ts) and [`user-uninstall.ts`](../../../../skills/keystone/ki-bootstrap/scripts/user-uninstall.ts): every selected item is revalidated, symlinked parents are refused, directory mutation is detected, and unknown options fail before any deletion.
- Added regression fixtures covering dry runs, altered state, scope isolation, links, repeated operations, configuration ambiguity, and concurrent changes.

### Verification

- Focused repository and user lifecycle fixtures passed after `debb6566`.
- `bun run test` passed at `41807e30` with the completed lifecycle suite.
- `bun run ki:audit` passed at `41807e30` with zero FAIL; it retained the two pre-existing KI-SHAPE-7 judgement advisories.
- `bun run ki:bootstrap:audit` confirmed source-harness parity; no generated payload refresh was required because the affected source harness units are manifest-proven live links or source-owned operation scripts.

### Outstanding concerns

None for the scoped CLEAN and UNINSTALL contract. The two existing KI-SHAPE-7 advisories remain separate judgement work and do not concern lifecycle safety.

### Mini recap

Deletion safety needs proof both before selection and immediately before removal: a valid marker alone is insufficient when parents can be links or directories can change. This finding is captured in the implementation and tests; no additional roadmap item is proposed.

## Done

The scoped CLEAN and UNINSTALL lifecycle contract is complete and accepted. No residual safety concern remains; FND-017's completed read-only DOCTOR capability and the separately planned `ki` implementation build on this foundation.
