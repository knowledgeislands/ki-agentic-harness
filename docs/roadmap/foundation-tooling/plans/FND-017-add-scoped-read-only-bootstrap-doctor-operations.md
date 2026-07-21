---
id: 'FND-017'
title: Add scoped read-only bootstrap doctor operations
status: in-progress
roadmap: foundation-tooling/add-scoped-read-only-bootstrap-doctor-operations
blocks: —
blocked-by: —
---

## Context

DOCTOR must classify KI state and recommend a recovery action without writing, while keeping repository and user ownership strictly separate.

It becomes trustworthy only after FND-016 defines the shared lifecycle ownership proofs and explicit scopes.

## Current state

Bootstrap checks individual repository surfaces during AUDIT. A source-owned DOCTOR prototype now inspects repository or user state independently of the vendored runner, using the committed FND-016 ownership proofs without invoking a mutable lifecycle operation.

## Settled report contract

- Report schema `1` records the explicit `repo` or `user` scope, physical subject, aggregate status, exactly one next action, exit semantic, and ordered findings with stable codes and optional ownership evidence.
- Status classes are `healthy`, `absent`, `recoverable`, and `unsafe`. Healthy and absent state exit `0`; recoverable and unsafe state exit `1`; invalid invocation exits `2` from the command boundary.
- Next actions are `none`, `educate`, `clean`, `repo-uninstall`, `user-uninstall`, or `manual-reconciliation`. DOCTOR never infers an omitted scope or performs the recommended operation.
- Terminal and JSON rendering derive from the same report. Inspection is dry-run-equivalent by definition: it creates no target-local temporary file, refreshes no marker, and makes no repair.

## Steps

1. ✓ Define a versioned, read-only DOCTOR report contract for `repo` and `user` scopes: stable status classes, machine-readable and human forms, findings, ownership evidence, exit semantics, and one precise recommended next action. Reject missing, ambiguous, or unsupported scope rather than inspecting broadly.
2. ✓ Implement repository DOCTOR from FND-016 ownership proofs. Inspect `.ki-config.toml`, supported runtimes, `.ki/` manifest state, runtime projections and copies, local governance source, and recovery availability; classify healthy, recoverable generated drift, preserved authored state, and unsafe or incomplete state without repairing any of them.
3. ✓ Implement user DOCTOR from the managed user-install contract. Inspect only KI-owned global installation, launcher, and managed payload state; never scan or report unrelated user configuration, repositories, or runtime content.
4. ✓ Make DOCTOR runnable from source and zero-install repository paths without a working generated runner. Guarantee no writes, including marker refreshes, temporary state in the target, or implicit installation; document its dry-run-equivalent nature.
5. ✓ Add fixtures for healthy, absent, stale, altered, unsafe-link, incomplete, conflicting, and mixed-scope states. Assert the exact recommended routes—EDUCATE, CLEAN, scoped UNINSTALL, or manual reconciliation—and verify no filesystem bytes change.
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

FND-016 supplies the lifecycle ownership and scope contract this diagnostic reports on. Its committed ownership matrix is sufficient for implementation to proceed; FND-016 acceptance remains a review dependency, not an execution gate.

## Delegation

- Round 1 — judgment: a `gpt-5.6-sol` worker defines the versioned DOCTOR report and classification contract against FND-016's committed ownership matrix; files: this plan and a proposed bounded implementation surface; gate: reviewable report schema, status/exit semantics, and no-write invariants.
- Round 2 — mechanical: a `gpt-5.6-terra` worker may implement the settled read-only classifiers and fixtures in exclusive source files; gate: byte-stability fixtures and focused diagnostics.
- Orchestrator: resolves contract questions, adversarially reviews every script, runs final verification, and commits only gated work.
