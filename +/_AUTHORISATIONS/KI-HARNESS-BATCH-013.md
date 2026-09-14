---
id: KI-HARNESS-BATCH-013
repository: https://github.com/knowledgeislands/ki-agentic-harness
approved: true
approved_at: 2026-09-14T02:01:29Z
authority_mode: outcome
authority_evidence: User granted autonomy to progress roadmap work; the Ready plan now includes the local KB Streams collision discovered before implementation.
approved_payload_sha256: 92588d786c0422552d24f61b062d6db8bd19e1347426474bcf5ee1cbfefd2e68
run_id: KI-HARNESS-BATCH-013-RUN-001
timebox_ends_at: 2026-09-14T06:01:29Z
item_ids: [KI-HARNESS-GOV-060]
completion_target: awaiting-review
mandatory_stops: [material-scope-expansion, destructive-or-irreversible-work, external-coordination, verification-failure, new-unapproved-public-contract-decision, acceptance-or-pruning, push-or-release]
---

# KI-HARNESS-BATCH-013 — Deliver portable triage intake

## Outcome authority

Deliver the agreed portable intake boundary across both executable local adapters so substantive prospective work is captured by default without being adopted. Stop at awaiting review; do not accept, prune, push, release, or execute a remote adapter.

## Selected plan

1. `KI-HARNESS-GOV-060` — replace the overloaded Future-candidate combination with a `triage` horizon, preserve `draft` as delivery maturity, gate departure from triage on human adoption, and migrate current uncommitted candidates without changing their relative priority.

## Repository and files in scope

Only `ki-agentic-harness` may change. Scope is the selected roadmap record and this authorisation; the existing repository-roadmap Decision Record; `ki-work-roadmap`, `ki-next`, `ki-plan`, and `ki-repo-kb-streams` contract, checker, helper, focused-test, and generated-publication files; the skills-by-outcome guide; the roadmap evaluation scenario and lifecycle diagram source and projection; and current candidate records requiring semantic migration. No sibling repository, runtime configuration, remote service, deployment, release, push, acceptance, or pruning may change.

## Required verification

- Focused `ki-work-roadmap`, `ki-next`, `ki-plan`, and `ki-repo-kb-streams` tests.
- Generated `ki-work-roadmap` rubric, capability catalogue, and lifecycle diagram publication parity.
- `ki-work-roadmap`, `ki-repo-kb-streams`, `ki-skills`, `ki-decision-records`, and `ki-authoring` audits.
- Full Harness test suite and TypeScript gate.

## Allowed decisions and delegation

Implement only the Ready plan's selected representation and authority boundary. Compatibility work may remove the retired `candidate` field and migrate current uncommitted records to triage, but must not adopt, reject, reprioritise, or execute them. Knowledge Base Streams must retain its canonical flat record and issue-allocation model; triage is metadata, never a directory. Same-session runtime subagents may implement non-overlapping file-level lanes; they must not stage or commit. The coordinator retains lifecycle, Decision Record, generated publication, integration, and Git write authority.

## Completion and remedial policy

The item must pass through `in-progress` and reach `awaiting-review` with its canonical review packet. Any failed required gate, external dependency, new public-contract choice, or material scope expansion stops the affected delivery without weakening verification. Non-blocking improvements become separate triage records only when they meet the new capture threshold.

## Run ledger

<!-- ki-batch-run: KI-HARNESS-BATCH-013-RUN-001 92588d786c0422552d24f61b062d6db8bd19e1347426474bcf5ee1cbfefd2e68 -->

### Batch stop

- Stopped before review because independent integration review found no honest terminal path for a rejected or merged Triage record to satisfy the existing done-before-prune rule.
- The implemented capture, adoption, checker, local-adapter, migration, and publication changes passed focused tests, all declared audits, a live KB Streams audit, the 615-test full suite, and TypeScript, but remain uncommitted implementation work pending expanded authority.
- `KI-HARNESS-GOV-060` returned to Ready with the required `ki-accept` intake-disposition scope made explicit for fresh authorisation.
