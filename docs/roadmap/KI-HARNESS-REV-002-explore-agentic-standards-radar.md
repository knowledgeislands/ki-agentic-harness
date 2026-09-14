---
id: KI-HARNESS-REV-002
area: REV
title: Agentic Standards Radar
theme: regular-reviews
horizon: next
status: in-progress
blocks: []
blocked_by: []
baseline_ref: 9e976e6a0306bcc1dd66311c6bb859408d54b9e4
created_at: 2026-09-14T01:43:10Z
updated_at: 2026-09-14T18:15:35Z
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

- [ ] Create `ki-agentic-radar` as a runtime-neutral governance skill with AUDIT, CONFORM, EDUCATE, and REFRESH modes.
- [ ] Define a TOML snapshot and Markdown standard separating subject kind, stewardship, specification maturity, implementation evidence, interoperability evidence, Knowledge Islands stance, movement, uncertainty, owner, and return trigger.
- [ ] Define evidence classes for normative text, governance or release material, reference implementations, independent implementations, conformance or interoperability demonstrations, operational adoption, research, and vendor claims.
- [ ] Seed interface entries for MCP, ACP, AHP, A2A, AGENTS.md, and the W3C AI Agent Protocol incubation work from primary sources.
- [ ] Seed a bounded structural vocabulary distinguishing agent loops, branching or supervisor trees, graph-orchestrated execution, knowledge graphs, and provenance graphs without presenting those patterns as equivalent standards.
- [ ] Add deterministic checks for duplicate identities, closed vocabularies, dates, evidence links, source-role contradictions, unsupported maturity claims, missing owners, and invalid movement or stance combinations.
- [ ] Limit CONFORM to generated publication or provably semantic-neutral structural repair; authored evidence, maturity, stance, and routing remain guarded.
- [ ] Add one monthly housekeeping review that uses `ki-pulse` for bounded discovery and routes material consequences to an existing skill REFRESH, Decision Record, or `ki-next`.
- [ ] Register the skill, add focused evaluation scenarios, update task-oriented guidance, and regenerate the harness catalogue.

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

## Discussion

### Radar lenses

The radar should distinguish formal standards, de facto protocols, recurring architectural patterns, research claims, and vendor terminology. Evidence dimensions include maturity, interoperability, adoption, reproducibility, relevance to Knowledge Islands, uncertainty, and the capability that would own any response.

### Agentic structures

The initial comparison should cover execution loops, branching or supervisor trees, graph-shaped orchestration, knowledge graphs, and provenance graphs. Similar words must not collapse control flow, stored knowledge, and evidence lineage into one concept.

### Source and hand-off model

The radar keeps a compact current snapshot, primary-source ledger, and explicit return triggers. `ki-pulse` performs bounded discovery. Consequential outcomes route to a capability REFRESH, Decision Record, or owner-local roadmap item rather than becoming a second governance authority.
