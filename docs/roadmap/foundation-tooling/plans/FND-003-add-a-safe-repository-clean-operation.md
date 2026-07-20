---
id: 'FND-003'
title: Add a safe repository clean operation
status: acceptance
roadmap: foundation-tooling/add-a-safe-repository-clean-operation
blocks: —
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

- **Delivered:** Source-owned repository CLEAN with manifest and marker ownership checks, dry-run and repeat safety, fail-closed handling of unfamiliar or concurrent state, and CLEAN-then-EDUCATE recovery.
- **Verification:** Focused CLEAN coverage, `bun run test`, and `bun run ki:audit` passed against this restored review state on 2026-07-20.
- **Outstanding concerns:** The later scoped CLEAN / DOCTOR / UNINSTALL roadmap item intentionally broadens the end-user lifecycle; it does not invalidate this repository CLEAN boundary.
- **Mini recap:** Defining CLEAN by proven generated ownership—not names or broad directories—keeps re-vendoring recoverable without erasing authored state. No additional durable learning route is proposed.
