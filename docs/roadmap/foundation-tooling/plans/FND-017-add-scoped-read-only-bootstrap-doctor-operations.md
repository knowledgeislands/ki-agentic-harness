---
id: 'FND-017'
title: Add scoped read-only bootstrap doctor operations
status: open
roadmap: foundation-tooling/add-scoped-read-only-bootstrap-doctor-operations
blocks: —
blocked-by: FND-016, FND-020
---

## Context

DOCTOR must classify KI state and recommend a recovery action without writing, while keeping repository and user ownership strictly separate.

It becomes trustworthy only after FND-016 defines the shared lifecycle ownership proofs and explicit scopes.

## Current state

Bootstrap checks individual repository surfaces during AUDIT, but users lack a source-owned diagnostic that can run when the vendored runner is missing or that can inspect KI-managed user installation independently.

## Steps

1. Define a versioned, read-only DOCTOR report contract for `repo` and `user` scopes: stable status classes, machine-readable and human forms, findings, ownership evidence, exit semantics, and one precise recommended next action. Reject missing, ambiguous, or unsupported scope rather than inspecting broadly.
2. Implement repository DOCTOR from FND-016 ownership proofs. Inspect `.ki-config.toml`, supported runtimes, `.ki/` manifest state, runtime projections and copies, local governance source, and recovery availability; classify healthy, recoverable generated drift, preserved authored state, and unsafe or incomplete state without repairing any of them.
3. Implement user DOCTOR from the managed user-install contract. Inspect only KI-owned global installation, launcher, and managed payload state; never scan or report unrelated user configuration, repositories, or runtime content.
4. Make DOCTOR runnable from source and zero-install repository paths without a working generated runner. Guarantee no writes, including marker refreshes, temporary state in the target, or implicit installation; document its dry-run-equivalent nature.
5. Add fixtures for healthy, absent, stale, altered, unsafe-link, incomplete, conflicting, and mixed-scope states. Assert the exact recommended routes—EDUCATE, CLEAN, scoped UNINSTALL, or manual reconciliation—and verify no filesystem bytes change.
6. Re-vendor affected payloads, update HELP and user guidance, and run focused diagnostics plus serial repository gates.

## Files touched

- `skills/keystone/ki-bootstrap/` — source-owned DOCTOR entrypoints, classifiers, HELP, and tests.
- managed user-install and runtime-publication components — read-only evidence adapters and fixtures.
- user and onboarding guidance, generated payloads, and zero-install launcher documentation.

## Verify

1. `repo doctor` and `user doctor` require explicit scope and inspect only their selected ownership surface.
2. Every supported state yields a stable classification and exact recovery route without a write.
3. A missing or damaged `.ki/` runner does not prevent source or zero-install repository diagnostics.
4. Focused DOCTOR fixtures prove byte-for-byte no mutation; `bun run test` and `bun run ki:audit` pass.

## Dependencies / blocks

FND-016 supplies the lifecycle ownership and scope contract this diagnostic reports on.
