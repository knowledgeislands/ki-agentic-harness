---
id: KI-HARNESS-BATCH-014
repository: https://github.com/knowledgeislands/ki-agentic-harness
approved: true
approved_at: 2026-09-14T02:22:34Z
authority_mode: outcome
authority_evidence: User granted roadmap autonomy and previously required every pruned item to land as done first; the Ready plan applies both decisions to triage intake.
approved_payload_sha256: 767bd9d5de39e4415cecda93d7f4766f9697dddb45b2fba78d828c0333929482
run_id: KI-HARNESS-BATCH-014-RUN-001
timebox_ends_at: 2026-09-14T06:22:34Z
item_ids: [KI-HARNESS-GOV-060]
completion_target: awaiting-review
mandatory_stops: [material-scope-expansion, destructive-or-irreversible-work, external-coordination, verification-failure, new-unapproved-public-contract-decision, acceptance-or-pruning, push-or-release]
---

# KI-HARNESS-BATCH-014 — Complete portable triage lifecycle

## Outcome authority

Deliver automatic durable Triage capture, human-gated adoption, and an honest human-approved terminal intake disposition that lands as `done` before any separate prune. Stop this delivery at awaiting review; do not accept or prune GOV-060 itself.

## Selected plan

1. `KI-HARNESS-GOV-060` — establish Triage across both local adapters, retire the candidate marker, migrate current uncommitted records, and let `ki-accept` close rejected, duplicate, or merged intake without pretending it was adopted or implemented.

## Repository and files in scope

Only `ki-agentic-harness` may change. Scope is the selected roadmap record and this authorisation; the living repository-roadmap Decision Record; `ki-work-roadmap`, `ki-next`, `ki-plan`, `ki-accept`, and `ki-repo-kb-streams` contract, checker, helper, focused-test, and generated-publication files; the skills-by-outcome guide; the roadmap evaluation scenario and lifecycle diagram source and projection; and current candidate records requiring semantic migration. No sibling repository, runtime configuration, remote service, deployment, release, push, acceptance of GOV-060, or pruning may change.

## Required verification

- Focused `ki-work-roadmap`, `ki-next`, `ki-plan`, `ki-accept`, and `ki-repo-kb-streams` tests.
- Generated `ki-work-roadmap` rubric, capability catalogue, and lifecycle diagram publication parity.
- `ki-work-roadmap`, `ki-skills`, `ki-decision-records`, `ki-authoring`, and `ki-repo-harness` audits plus one live read-only `ki-repo-kb-streams` audit.
- Full Harness test suite and TypeScript gate.

## Allowed decisions and delegation

Implement the Ready plan's selected representation and authority boundary. A Triage record remains draft while open. On exact human approval, `ki-accept` may record a terminal `rejected`, `duplicate`, or `merged` intake disposition and close it directly as `done`; merged and duplicate dispositions name the retained canonical record. The done record must land in history before any later explicit prune-only commit. This is a closure path, not adoption, implementation, delivery acceptance, or automatic deletion. Same-session runtime subagents may review non-overlapping lanes but must not stage or commit. The coordinator retains lifecycle, generated publication, integration, and Git write authority.

## Completion and remedial policy

GOV-060 must reach `awaiting-review` with its canonical six-heading delivery packet. Any failed required gate, external dependency, new public-contract choice, or further material scope expansion stops delivery without weakening verification. No Triage record is closed or pruned as part of implementing this standard.

## Run ledger

<!-- ki-batch-run: KI-HARNESS-BATCH-014-RUN-001 767bd9d5de39e4415cecda93d7f4766f9697dddb45b2fba78d828c0333929482 -->
