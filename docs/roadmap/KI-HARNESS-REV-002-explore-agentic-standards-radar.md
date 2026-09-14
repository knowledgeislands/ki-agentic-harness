---
id: KI-HARNESS-REV-002
area: REV
title: Agentic Standards Radar
theme: regular-reviews
horizon: next
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 9e976e6a0306bcc1dd66311c6bb859408d54b9e4
created_at: 2026-09-14T01:43:10Z
updated_at: 2026-09-14T18:51:14Z
---

# Agentic Standards Radar

## Goal

Establish an evidence-based radar that helps Knowledge Islands notice and assess emerging agentic standards, architectural patterns, and knowledge models early enough to make deliberate adoption, rejection, or monitoring decisions.

## Context

Knowledge Islands has invocation-scoped public discovery through `ki-pulse`, capability-owned source lists and REFRESH modes, and a model-specific radar through `ki-model-radar`. It has no durable cross-cutting owner that distinguishes protocols, formats, architectural patterns, knowledge or provenance structures, research claims, and vendor terminology while preserving comparable maturity and interoperability evidence.

The completed Agent Host Protocol review demonstrated the need: a protocol can have stable channels and several client libraries while still lacking independent server interoperability. Current ACP, A2A, MCP, AGENTS.md, AAIF, and W3C work provide enough primary evidence to establish a useful first snapshot without credentials, paid infrastructure, or runtime mutation.

## Boundary

Do not select a preferred agent architecture, create a general framework catalogue, run an unbounded market scan, add a daemon, prototype integrations, mutate runtime configuration, or adopt standards automatically. Do not duplicate `ki-model-radar`, capability-owned source lists, or the earlier AHP-specific review.

A standards-body community group is not automatically a formal standard; a versioned protocol is not automatically stable; multiple packages are not automatically interoperability proof. The radar informs owners and never changes consumer configuration directly.

## Current state

Primary-source evidence is sufficient to seed interface and format entries for MCP, ACP, AHP, A2A, AGENTS.md, and the W3C AI Agent Protocol incubation work. A standalone `ki-agentic-radar` governance skill is the smallest durable owner: `ki-pulse` cannot own standing state, housekeeping cannot own a contract, and capability-specific REFRESH modes cannot provide the cross-cutting classification.

## Steps

- [x] Create `ki-agentic-radar` as a runtime-neutral governance skill with AUDIT, CONFORM, EDUCATE, and REFRESH modes.
- [x] Define a TOML snapshot and Markdown standard separating subject kind, stewardship, specification maturity, implementation evidence, interoperability evidence, Knowledge Islands stance, movement, uncertainty, owner, and return trigger.
- [x] Define evidence classes for normative text, governance or release material, reference implementations, independent implementations, conformance or interoperability demonstrations, operational adoption, research, and vendor claims.
- [x] Seed interface entries for MCP, ACP, AHP, A2A, AGENTS.md, and the W3C AI Agent Protocol incubation work from primary sources.
- [x] Seed a bounded structural vocabulary distinguishing agent loops, branching or supervisor trees, graph-orchestrated execution, knowledge graphs, and provenance graphs without presenting those patterns as equivalent standards.
- [x] Add deterministic checks for duplicate identities, closed vocabularies, dates, evidence links, source-role contradictions, unsupported maturity claims, missing owners, and invalid movement or stance combinations.
- [x] Limit CONFORM to generated publication or provably semantic-neutral structural repair; authored evidence, maturity, stance, and routing remain guarded.
- [x] Add one monthly housekeeping review that uses `ki-pulse` for bounded discovery and routes material consequences to an existing skill REFRESH, Decision Record, or `ki-next`.
- [x] Register the skill, add focused evaluation scenarios, update task-oriented guidance, and regenerate the harness catalogue.

## Files touched

- `skills/governance/ki-agentic-radar/`
- `.ki.toml`
- `docs/housekeeping/KI-HARNESS-HK-005-monthly-agentic-radar-review.md`
- `evals/scenarios/ki-agentic-radar.ts`
- `evals/harness.ts`
- `docs/guides/skills-by-outcome.md`
- generated `skills/README.md`
- root `README.md` capability counts when required

## Acceptance criteria

- Every entry has a primary identity source, observed or reviewed date, classification, maturity evidence, implementation and interoperability state, KI stance, owner, and explicit uncertainty.
- Adopt or Trial requires a concrete Knowledge Islands use case and local evidence; provider claims alone cannot move an entry inward.
- Patterns and vendor terms cannot be labelled formal standards.
- The initial snapshot contains the five established interface or format subjects, the W3C incubation signal, and the five structural distinctions above.
- The monthly review produces no standing inbox and creates work only through the owning process.
- Focused validators and full repository gates pass.

## Verify

- `bun test skills/governance/ki-agentic-radar`
- `ki dev skill rubric ki-agentic-radar --write`
- `ki repo audit --skill ki-agentic-radar --repo .`
- `ki repo audit --skill ki-skills --repo .`
- `ki repo audit --skill ki-work-housekeeping --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-repo-harness --repo .`
- `bun run test`
- `bunx tsc --noEmit`

## Dependencies / blocks

No external blocker exists. Implement after `KI-HARNESS-REV-003` to avoid concurrent edits to shared integration surfaces, but do not treat the model radar as a semantic build dependency.

## Documentation impact

### Decision Records

Add a Decision Record only if implementation changes an existing authority boundary or adopts a protocol for Knowledge Islands rather than merely tracking it.

### Specifications

No repository-wide specification change is expected in the first delivery; the skill-local standard owns the radar schema and evidence vocabulary.

### Guides

Add one task-oriented route to the existing skills-by-outcome guide.

### Roadmap

Keep this item as implementation and review authority. Any approved integration, trial, or adoption consequence becomes separate owner-local work through `ki-next`.

## Review

### Delivered

Baseline `9e976e6a0306bcc1dd66311c6bb859408d54b9e4`; implementation commit `14653c48` establishes the agentic-standards radar. Concurrent roadmap timestamp work in `b2d7c3cd` was preserved and was not part of this delivery.

### Summary of changes

Added the `ki-agentic-radar` governance skill, evidence and classification standard, deterministic rubric, 33-record primary-source evidence set, six-subject snapshot, bounded structural vocabulary, monthly housekeeping review, three behavioural scenarios, repository registration, task-oriented guidance, and regenerated 60-capability catalogue. The snapshot keeps specification maturity, implementation breadth, interoperability, local stance, movement, ownership, uncertainty, and return triggers separate.

### Verification

- `ki-agentic-radar`, `ki-skills`, `ki-work-housekeeping`, `ki-authoring`, `ki-repo-harness`, and `ki-work-roadmap` audits pass.
- Focused agentic-radar and remediation-inventory tests pass: 15 tests and 54 expectations.
- Full Harness suite passes on rerun: 657 tests, zero failures.
- The one preceding full-suite run reached 656 passes and timed out in an unrelated five-second Knowledge Base decision-path fixture; that fixture passed in isolation in 1.6 seconds before the clean full rerun.
- `bunx tsc --noEmit` and `git diff --check` pass.
- The live Claude behavioural eval was not run because it is non-deterministic, quota-bearing, and advisory rather than a delivery gate.

### Outstanding concerns

No blocking concern. AHP remains pre-1.0 with reference-only server evidence; A2A interoperability remains claimed rather than demonstrated; AGENTS.md remains an unversioned incubating format despite broad adoption; the W3C Community Group remains an incubation signal. Monthly refresh should seek public cross-implementation and conformance results without inferring maturity from package counts.

### Post-change review

No protocol was adopted and no runtime configuration changed. No Decision Record or repository-wide Specification was required because the skill owns a local observational schema rather than changing an existing authority boundary. Consequential adoption, integration, or architecture choices remain separately reviewed owner-local work.

### Mini recap

The Harness now has a viable cross-cutting radar for protocols, formats, incubation work, and architectural signals. It distinguishes standards from patterns and marketing, and it preserves implementation and interoperability uncertainty before routing any real adoption work.

## Discussion

### Radar lenses

The radar should distinguish formal standards, de facto protocols, recurring architectural patterns, research claims, and vendor terminology. Evidence dimensions include maturity, interoperability, adoption, reproducibility, relevance to Knowledge Islands, uncertainty, and the capability that would own any response.

### Agentic structures

The initial comparison should cover execution loops, branching or supervisor trees, graph-shaped orchestration, knowledge graphs, and provenance graphs. Similar words must not collapse control flow, stored knowledge, and evidence lineage into one concept.

### Source and hand-off model

The radar keeps a compact current snapshot, primary-source ledger, and explicit return triggers. `ki-pulse` performs bounded discovery. Consequential outcomes route to a capability REFRESH, Decision Record, or owner-local roadmap item rather than becoming a second governance authority.
