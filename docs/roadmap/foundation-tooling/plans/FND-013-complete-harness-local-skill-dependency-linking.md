---
id: 'FND-013'
title: Link source-harness bootstrap payloads
status: done
roadmap: foundation-tooling/link-source-harness-bootstrap-payloads
blocks: —
blocked-by: —
---

## Context

`ki-agentic-harness` is both the author of its skills and a governed harness that re-vendors them beneath `.ki/bootstrap/`.

Portable consumer repositories must retain regular, self-contained vendored payloads, but repeatedly copying the harness's own source material into its local bootstrap tree creates a large noisy diff on every source change.

For a same-checkout source harness, bootstrap should project the source material it owns through contained relative symlinks instead of copying it.

This makes local checker, educator, catalogue, and agent changes live during harness development while preserving the portable copied model everywhere else.

## Current state

FND-013 established a physical same-harness resolver and uses it for runtime skills and declared source-tree shared modules.

It deliberately retained `.ki/bootstrap/` checker and educator payloads as regular manifest-hashed copies.

After FND-014, those copies now live beneath `.ki/bootstrap/{agents,skills,checkers,educators}/`; a source change therefore produces a large generated diff alongside the authored change.

The bootstrap manifest and CLEAN implementation currently prove only regular generated files, and the source-harness parity checks reject generated symlinks.

## Steps

1. [x] Trace every `.ki/bootstrap/` payload by ownership and execution role: agents, retained skill catalogue, checker scripts/references/shared dependencies/HELP, educator launcher/module/source snapshot, and bootstrap coordinator material. Identify the canonical same-harness source for each copied source payload and the genuinely generated glue that must remain regular. Confirm that `.ki/bin/` and `.ki/manifest.json` remain generated regular files.

2. [x] Settle the source-harness bootstrap-link contract. It applies only when the physical target is the nearest regular `[ki-harness]` root and every source resolves beneath that same root's canonical `skills/` or `agents/` tree. Each link is relative, contained, and preflight-validated; no external checkout, installed payload, ordinary repository, archive, or release package receives one. Replace copied source material with links; retain only generated HELP/launcher/runner glue where no canonical source exists. Record how manifest ownership, AUDIT, CLEAN, rebuild, and release packaging prove and handle the links without a legacy fallback.

3. [x] Implement the smallest bootstrap publication and manifest changes for that contract. Generate contained links in the harness-local `.ki/bootstrap/` surface, make aggregate AUDIT/CONFORM/EDUCATE resolve them normally, and preserve fully copied, standalone output for non-harness targets. Extend guarded replacement and rollback to reject stale regular files, dangling or escaping links, unsafe parents, and concurrent changes without overwriting unproven content.

4. [x] Extend manifest, AUDIT, and CLEAN for the dual owned forms. Manifest-prove regular generated glue by hash and source-harness links by their relative target plus canonical-source identity; CLEAN removes only exactly proven generated links or regular files and never follows them. A re-bootstrap can replace a proven former copy with its canonical link, but ambiguous, altered, or foreign material fails closed for manual recovery.

5. [x] Add focused fixtures for the current harness, a minimal same-checkout harness, an ordinary consumer, a separate harness checkout, and a packaged or source-absent target. Prove that source edits are visible through every intended `.ki/bootstrap/` link without re-vendoring; ordinary and external targets remain regular standalone copies; CHECKER/EDUCATE/HELP execution, CLEAN then EDUCATE recovery, dry-run, repeat, rollback, and release packaging remain correct.

6. [x] Update `ki-bootstrap`, `ki-harness`, source-harness parity checks, user/developer guidance, and generated payloads. Re-vendor this harness, inspect that copied source material no longer produces a second generated diff, then run focused tests, `bun run test`, and `bun run ki:audit` serially.

## Files touched

- `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/` — source-harness detection, bootstrap publication, manifesting, CLEAN, aggregate-path safety, and fixtures.
- `skills/keystone/ki-bootstrap/` and `skills/keystone/ki-repo/` — copy-versus-link contract, capability audit criteria, and developer guidance.
- `.ki/bootstrap/` — regenerated harness-local links and minimal regular generated glue.
- `.gitignore`, package scripts, and documentation only where the established generated/link boundary changes.

## Verify

1. A same-checkout source harness has contained relative links for every `.ki/bootstrap/` source payload, while `.ki/bin/`, `.ki/manifest.json`, and genuinely generated glue remain regular files.
2. Editing a canonical source changes the effective harness-local checker, educator, catalogue, or agent payload immediately without a generated duplicate diff.
3. Ordinary repositories, separate harness checkouts, archives, and release-package fixtures receive dereferenced regular copies and run without the source harness.
4. Manifest validation, AUDIT, CLEAN, dry-run, repeat, rollback, and re-bootstrap accept only the exact known link or regular-file form and preserve unproven content.
5. Focused bootstrap, harness-source, manifest/CLEAN, aggregate, and packaging tests pass.
6. `bun skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts .` succeeds after source changes.
7. `bun run test` passes.
8. `bun run ki:audit` passes after the test suite completes.

## Dependencies / blocks

FND-014 is complete and supplies the direct `.ki/` ownership boundary.

This revises FND-013's earlier accepted assumption that generated bootstrap payloads must always be copied.

FND-003's retained CLEAN acceptance record supplies the existing fail-closed baseline; this plan extends that proof model for same-checkout links without changing CLEAN's repository scope.

## Acceptance

### Delivered

This harness now links its own canonical `skills/` and `agents/` payloads beneath `.ki/bootstrap/`.

Checker entry points and educator source payloads are relative links; HELP snapshots, educator launchers, `.ki/bin/`, and `.ki/manifest.json` remain generated regular files.

Ordinary repositories retain the existing self-contained copied payload model.

### Summary of changes

The manifest records links separately from file hashes.

Re-bootstrap, aggregate execution, capability audit, and CLEAN accept only manifest-proven links that resolve within the same harness's canonical `skills/` or `agents/` tree.

CLEAN unlinks proven generated links without following them; altered, dangling, escaping, or foreign links fail closed.

### Verification

The focused CLEAN/bootstrap fixtures cover ordinary consumers and an isolated source-harness checkout, including live source visibility, `ki-educate`, and CLEAN recovery.

`bun run test` and `bun run ki:audit` both pass after re-vendoring this harness.

### Outstanding concerns

Confirm that the intentionally small regular bootstrap surface — HELP snapshots, thin launchers, bins, and manifest — is the right ongoing development boundary.

### Mini recap

Separating canonical source material from generated glue removes the repeated source-copy diff while retaining ordinary-repository portability and fail-closed cleanup.

## Done

FND-013 completed the source-harness bootstrap-link boundary: canonical source material is linked live, while intentionally generated HELP snapshots, launchers, bins, and manifest state remain regular generated files.

Residual concern: None. A content-hash inventory confirmed that the remaining small regular bootstrap files are generated or derived rather than redundant copies suitable for linking.

Intended follow-up: None. Retain this completion record until a later explicit plan-prune batch.
