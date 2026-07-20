---
id: 'FND-003'
title: Add a safe repository clean operation
status: done
roadmap: foundation-tooling/add-a-safe-repository-clean-operation
blocks: FND-016
blocked-by: —
---

## Context

EDUCATE and repository bootstrap create derived governance machinery plus runtime skill copies, but there must be a symmetric way to remove only that generated state.

Manual cleanup is easy to get mostly right and dangerously easy to broaden into deleting authored or deliberately linked `ki-*` content.

## Current state

`.ki-meta/` is the generated repository governance root. Complete runtime skill copies live below the runtime directories declared by `[ki-repo] supported_runtimes` and carry `.ki-meta/generated-runtime-skill.json`, which proves their origin and integrity.

`.ki-config.toml`, canonical skill source, explicit development links, repository agents, repository-local `.ki-self`, and unmarked runtime content are authored state rather than generated cleanup targets.

## Steps

1. ✓ Define CLEAN as removal of generated repository state, not removal of governance intent: preserve `.ki-config.toml`, authored source, explicit development links, agents, and repository configuration.
2. ✓ Add a source-owned `ki-bootstrap` repository clean entrypoint with `--dry-run` and explicit target handling; it must not depend on `.ki-meta/` because successful cleanup removes that runner.
3. ✓ Remove `.ki-meta/` through the same identity, symlink, race, and conflict-safety principles used by repository bootstrap.
4. ✓ Discover supported runtime roots from `.ki-config.toml` and remove only regular runtime skill directories whose generated marker and integrity prove ownership. Preserve markerless directories, symlinks, changed payloads, and every path selected only by a `ki-*` name.
5. ✓ Add focused clean, repeat-clean, dry-run, tamper, symlink, concurrent-mutation, and CLEAN-then-EDUCATE tests; document the lifecycle and run the serial repository gates.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/`
- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/project-skill-publisher.ts` where marker validation can be reused cleanly
- focused bootstrap and runtime-publication tests
- user and developer lifecycle guidance

## Verify

- CLEAN removes `.ki-meta/` and all unchanged marker-owned runtime skill copies.
- CLEAN preserves `.ki-config.toml`, authored/linked/tampered runtime content, agents, and canonical vendored source modules.
- A second CLEAN succeeds without changes, and EDUCATE after CLEAN reconstructs a passing footprint.
- `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-clean.test.ts`
- `bun run test`
- `bun run ki:audit`

## Dependencies / blocks

This plan has no external dependency. It establishes the repository-side CLEAN boundary that the broader lifecycle work will build on.

## Acceptance

### Delivered

Repository CLEAN removes only proven generated state, leaving governance intent and authored repository state intact.

### Summary of changes

- Added the source-owned `ki-bootstrap` CLEAN entry point in `scripts/clean.ts` and the ownership-aware implementation in `scripts/internal/repo-bootstrap/repo-clean.ts`.
- CLEAN removes manifest-proven `.ki-meta/` output and unchanged marker-owned runtime skill copies; dry-run, repeat, tamper, symlink, concurrent-mutation, and CLEAN-then-EDUCATE cases are covered in `repo-clean.test.ts`.
- Updated the bootstrap contract and lifecycle guidance so cleanup can succeed after it removes the vendored runner.

### Verification

- `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-clean.test.ts`, `bun run test`, and `bun run ki:audit` passed on 2026-07-20.
- Code-evidence baseline: `339a17b5`; no CLEAN implementation has changed since that review state.

### Outstanding concerns

The defined follow-up is [Implement scoped lifecycle operations](../ROADMAP.md#implement-scoped-lifecycle-operations), which covers repository CLEAN alongside scoped repository/user DOCTOR and UNINSTALL. In particular, repository CLEAN is not an uninstall: it does not remove user-level installation, repository intent, configuration, authored sources, development links, agents, or unproven content. That broader contract needs separate design and acceptance analysis; it does not invalidate this conservative generated-output boundary.

### Mini recap

Defining CLEAN by proven generated ownership—not names or broad directories—keeps re-vendoring recoverable without erasing authored state. No additional durable learning route is proposed.

## Done

FND-003 completed the conservative repository CLEAN baseline: it removes only proven generated duplication and leaves the repository declaration and authored state ready for EDUCATE.

Residual concern: None.

Intended follow-up: FND-016 owns the broader scoped lifecycle contract, including repository and user UNINSTALL plus the basis for FND-017 DOCTOR and FND-018 `kisle`; it builds on this completed CLEAN boundary without broadening CLEAN itself.
