---
id: KI-HARNESS-BATCH-016
repository: https://github.com/knowledgeislands/ki-agentic-harness
approved: true
approved_at: 2026-09-14T17:32:00Z
authority_mode: outcome
authority_evidence: User instructed a massive push and requested as much roadmap delivery as possible.
approved_payload_sha256: 2b80ec2a19c1aaa4ce594e4112b5e799b92323a4753734f2131557410f9af829
run_id: KI-HARNESS-BATCH-016-RUN-001
timebox_ends_at: 2026-09-14T21:32:00Z
item_ids: [KI-HARNESS-REV-003]
completion_target: done
mandatory_stops: [unapproved-public-contract-change, material-scope-expansion, destructive-or-irreversible-work, external-coordination, verification-failure, push-or-release]
closure_item_ids: [KI-HARNESS-REV-003]
---

# KI-HARNESS-BATCH-016 — Deliver Model Radar

## Outcome authority

Deliver the locally bounded, non-contentious Model Radar plan through its own implementation, review, and acceptance lifecycle. Keep runtime-default changes, provider adoption, paid evaluation, private-repository evaluation, deployments, and consumer-repository writes outside the run.

## Selected plan

- `KI-HARNESS-REV-003` — establish the portable `ki-model-radar` governance skill, evidence schema, initial public-source snapshot, deterministic audit coverage, housekeeping cadence, and user-facing route.

## Scope

- Repository: `knowledgeislands/ki-agentic-harness` only.
- Files: the exact REV-003 plan surfaces, generated capability and rubric publications, batch ledger, and lifecycle record.
- Evidence: public primary sources and bounded independent benchmark methodology sources; no authenticated or paid endpoint.
- Excluded: runtime bindings or defaults, model installation, provider selection, private data, benchmark execution, deployments, pushes, releases, sibling-repository writes, and unrelated refactors.

## Required verification

- Focused `ki-model-radar` tests and deterministic fixture coverage.
- Generated rubric and capability catalogue parity.
- `ki-model-radar`, `ki-skills`, `ki-work-housekeeping`, `ki-authoring`, `ki-repo-harness`, and roadmap audits.
- Full Harness test suite and TypeScript.

## Decisions and delegation

The accepted REV-003 vocabulary, evidence boundary, TOML snapshot authority, and consumer hand-off are locked. One read-only worker may collect current public-source evidence, and one exclusive write worker may implement the bounded skill and tests. The coordinator owns integration, lifecycle state, generated publications, full verification, acceptance, and every Git write window.

Provider and benchmark facts without adequate current evidence remain explicitly unknown or absent rather than inferred. Any decision that changes runtime defaults, introduces external coordination, weakens evidence gates, or expands the public contract beyond the Ready record stops the affected work.

## Completion and remedial policy

The admitted record must move from Ready through In progress and Awaiting review, pass its canonical review-packet recheck, then close through `ki-accept` under this exact closure authority. Non-blocking improvements become separately captured owner-local work and do not hold viable delivery open.

## Run ledger

<!-- ki-batch-run: KI-HARNESS-BATCH-016-RUN-001 2b80ec2a19c1aaa4ce594e4112b5e799b92323a4753734f2131557410f9af829 -->
