---
id: 'FND-002'
title: Review and extract evolvable skill capabilities
status: acceptance
roadmap: foundation-tooling/review-and-extract-evolvable-skill-capabilities
blocks: —
blocked-by: —
---

## Context

`ki-skills` can audit an existing skill against its rubric, deliberately create one through `EDUCATE`, and optimise its discoverability and token footprint.

It has no structured way to examine a skill's architecture for automation opportunities or to extract candidate reusable capabilities from a repository and an explicitly selected body of history.

Those findings need to join the ordinary roadmap and plan lifecycle, rather than becoming disconnected reports or silently created plans.

## Current state

`ki-skills` now provides distinct on-demand REVIEW and EXTRACT procedures, a read-only candidate-contract validator, and focused tests for the candidate and reconciliation boundary.

Both modes require explicit targets and, for history, explicit selected inputs; they present reconciled candidate proposals and leave all durable work to a later user-confirmed roadmap and plan action.

## Steps

1. [x] Define the distinct contracts and invocation grammar for `REVIEW` and `EXTRACT`: `REVIEW` assesses an existing skill or skill set beyond rubric conformance; `EXTRACT` assesses a repository and only explicitly selected history inputs. Preserve `AUDIT` as the conformance gate and `EDUCATE` as the only creation mode.
2. [x] Define a compact, inspectable candidate finding format with evidence, recommended disposition (`keep as guidance`, `move to reference`, `extract script`, `new skill`, `new agent or hook`, or `not worth formalising`), and a proposed roadmap treatment (`new item`, `amend existing item`, or `no roadmap work`).
3. [x] Specify and implement the common reconciliation handoff: compare candidates with canonical roadmap items, present deduplicated proposals, require user confirmation before any durable roadmap change, then route accepted work through `ki-next` and `ki-plan`. Do not mine historical transcripts, create a plan, or alter a skill without an explicit request.
4. [x] Add focused fixtures or tests for the mode boundaries, explicit-history requirement, candidate classification, duplicate/existing-roadmap matching, and confirmation boundary. Update the skill description, HELP, routed mode procedures, and user-facing catalogue.
5. [x] Regenerate any affected bootstrap-generated surfaces, run the focused checks, then run serial repository verification and prepare an acceptance packet.

## Files touched

- `skills/keystone/ki-skills/SKILL.md`
- `skills/keystone/ki-skills/references/`
- focused `ki-skills` tests and fixtures
- generated bootstrap material, only where HELP or source-vendor parity requires it
- `docs/guides/user-guide/skill-catalogue.md`

## Verify

1. `REVIEW` has a clear architectural-improvement remit distinct from `AUDIT`, and `EXTRACT` requires an explicit repository/history scope.
2. Findings carry evidence, one allowed disposition, and a reconciled roadmap outcome; no candidate creates or edits a roadmap item or plan without user confirmation.
3. The focused tests cover the discovery and handoff boundaries, and `bun run ki:skills:audit`, `bun run ki:bootstrap:audit`, `bun run test`, and `bun run ki:audit` pass serially.

## Dependencies / blocks

This is independent of the CLI implementation, but it blocks further near-term work because it defines the governed route by which the harness identifies and evolves reusable capabilities.

## Acceptance

### Delivered

`ki-skills` now has distinct REVIEW and EXTRACT modes that convert skill-evolution observations into evidence-backed, user-confirmed roadmap proposals.

### Summary of changes

- Added routed REVIEW and EXTRACT procedures, the candidate-finding format, and explicit no-write / explicit-history boundaries.
- Added a read-only candidate-contract validator for structured handoffs, including allowed dispositions, roadmap treatments, amendment locators, and exact-title reconciliation prompts.
- Added focused contract tests, updated generated HELP, and documented the modes in the user catalogue.

### Verification

- Passed `bun test skills/keystone/ki-skills/scripts/candidate-contract.test.ts`, `bun run ki:skills:audit`, `bun run ki:bootstrap:audit`, `bun run test`, and `bun run ki:audit` serially.
- The skills audit retains two existing `KI-SHAPE-7` warnings; the aggregate audit retains the known runtime-link bootstrap warnings. Neither concerns this feature.
- Implementation evidence: `a107566c` (`feat(skills): add review and extract modes`).

### Outstanding concerns

Exact normalised-title matching only surfaces a possible existing roadmap item. Semantic duplication and priority remain explicit human judgment, as do any durable writes.

### Mini recap

Discovery belongs in the skill that owns skill quality, but it must be a proposal layer. A compact mechanical contract makes handoffs checkable without pretending that candidate selection or roadmap priority is deterministic.
