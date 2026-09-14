---
id: KI-HARNESS-BATCH-019
repository: https://github.com/knowledgeislands/ki-agentic-harness
approved: true
approved_at: 2026-09-14T19:41:00Z
authority_mode: outcome
authority_evidence: User asked whether more roadmap progress could be made under the active autonomous delivery instruction.
approved_payload_sha256: 953d9c9b0b5ea221d02aad987fc7130ac199b621649a71bf174827a0f77c1368
run_id: KI-HARNESS-BATCH-019-RUN-001
timebox_ends_at: 2026-09-14T23:41:00Z
item_ids: [KI-HARNESS-OPS-007]
completion_target: done
mandatory_stops: [unapproved-public-contract-change, material-scope-expansion, destructive-or-irreversible-work, external-coordination, verification-failure, push-or-release]
closure_item_ids: [KI-HARNESS-OPS-007]
---

# KI-HARNESS-BATCH-019 — Restore Source Harness CI

## Outcome authority

Restore the currently broken GitHub Actions push gate through a bounded repository-local workflow change that preserves released-CLI provenance while explicitly auditing the validated checked-out Harness.

## Selected plan

- `KI-HARNESS-OPS-007` — activate the source Harness through released `ki` v0.3.6's supported local-development route and update the checkout action from its retiring Node 20 release.

## Scope

- Repository: `knowledgeislands/ki-agentic-harness` only.
- Permitted changes: `.github/workflows/ci.yml`, focused regression coverage if materially useful, this work record, and batch evidence.
- Preserve: released executable and version proof, isolated runner state, bootstrap and registry setup, source-checkout validation, repair and audit gates.
- Excluded: CLI release or install changes, public-contract changes, persistent developer state, credential use beyond existing workflow, push, release, deployment, or weakening verification.

## Stop conditions

Stop if the released CLI does not support the planned local-Harness route, source activation cannot be validated, the action major is incompatible, verification fails, scope expands beyond the workflow concern, or remote confirmation would require an unapproved push.

## Verification

Validate workflow syntax and ordering, exercise the released-CLI sequence in disposable state where feasible, run the Harness test and TypeScript gates, audit engineering, Harness, roadmap, and authoring contracts, and check the final diff.

## Run ledger

<!-- ki-batch-run: KI-HARNESS-BATCH-019-RUN-001 953d9c9b0b5ea221d02aad987fc7130ac199b621649a71bf174827a0f77c1368 -->

### KI-HARNESS-BATCH-019-RUN-001

- Started from immutable baseline `b2746ee7f7cb03ea0969861bd8f9d969444a9403`.
- Delegated one read-only workflow and released-CLI evidence review; the coordinator retained planning, implementation, verification, lifecycle, acceptance, and Git authority.
- Delivered `.github/workflows/ci.yml` in `4f260a4f`, preserving released-CLI proof while activating and asserting the validated checked-out Harness before repair and audit.
- Verified workflow parsing, current checkout tag, released-v0.3.6 behaviour evidence, a clean full-suite rerun, TypeScript, focused governance audits, and diff hygiene.
- Moved `KI-HARNESS-OPS-007` to Awaiting review with the canonical packet; remote hosted-runner confirmation remains outside the no-push batch boundary.
