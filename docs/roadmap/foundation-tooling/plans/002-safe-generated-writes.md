---
id: '002'
title: Harden generated-file writes
status: open
roadmap: foundation-tooling/harden-generated-file-writes-against-symlinks-and-read-check-write-races
blocks: foundation-tooling/004
blocked-by: —
handoff: true
tier: opus
readiness: pending
---

## Context

Bootstrap, INIT, CONFORM, hooks, and linkers write into repositories that may contain hostile symlinks or change between validation and publication. Fleet rollout multiplies this exposure, so automatic writers need one explicit safety posture before they are applied broadly.

## Current state

Some newer writers already use same-directory temporary files, byte snapshots, exclusive creation, or symlink refusal; older config scaffolding and vendoring paths still use ordinary existence/read/write sequences. The exact writer inventory and reusable boundary are not yet settled. This plan changes filesystem safety only, not config correctness or schema.

## Steps

1. Inventory every automatic repository writer reachable through bootstrap, INIT, CONFORM, hook/linking, roadmap generation, and vendoring; classify each destination as generated replacement, authored-file mutation, or exclusive create.
2. Define and document the locked write policy for those classes: validate physical parents inside the target root, reject symlink leaves and unsafe parent chains, snapshot authored inputs, use same-directory temporary files and atomic publication, and fail closed on concurrent change.
3. Implement the smallest shared or locally duplicated primitive that preserves standalone-skill constraints; do not introduce cross-skill imports that break symlinked standalone use.
4. Migrate the inventoried writers in bounded batches, adding hostile symlink, dangling-link, replacement-race, and rollback fixtures alongside each batch.
5. Run an adversarial safety review against path traversal, leaf swaps, parent swaps, partial publication, rollback clobbering, and unexpected non-zero hook behaviour; repair every confirmed path.
6. Format changed code, re-bootstrap coverage-scoped vendors, and verify source/vendor parity.

## Files touched

Automatic writer implementations and their focused tests across bootstrap and affected skills/hooks; the owning safety standard or decision record if the inventory proves a new cross-cutting contract is required; coverage-scoped `.ki-meta` copies and manifest.

## Verify

Pass when every inventoried writer has a documented publication class and hostile-path fixture, all focused tests and `bun run test` pass, `bun run ki:audit` has no FAIL/WARN, and a separate adversarial reviewer records GO.

## Dependencies / blocks

Independent first-round work. It blocks fleet rollout because re-bootstrap and conform are the rollout mechanism. It does not include `.ki-config.toml` schema, per-repo overrides, or comment-style work.

## Decisions

**Locked:** Fail closed; never follow repository-controlled symlink outputs; preserve standalone-skill operation; separate authored mutation, generated replacement, and exclusive create; require dedicated adversarial review. The recommended tier is `opus` because a mistaken filesystem boundary can cause destructive writes.

**Escalate:** Any policy choice that changes the trusted-checkout boundary, requires a new runtime dependency, or cannot preserve an existing writer's transactional semantics.

## Readiness

- [ ] Readiness test: a cold executor can produce the complete writer inventory and classify the first implementation batch without inferring the threat model.
