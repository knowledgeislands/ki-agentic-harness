---
id: KI-HARNESS-GOV-118
area: GOV
title: Resolve delegated skill access
theme: governance-consistency
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-27T16:50:38Z
updated_at: 2026-09-27T16:50:38Z
---

# Resolve delegated skill access

## Goal

A delegating agent can determine how its recipient reaches each required governance skill before sending work, without relying on private memory or discovering an unavailable runtime invocation by failure.

## Context

[KI-ARCADIA-ECO-005](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Streams/Roadmap/KI-ARCADIA-ECO-005-record-delegated-skill-access.md) records governance-skill invocation failures during the 22 September 2026 MCP and tools batch. Its 26 September installation observation distinguished installed process skills from governance skills available through the harness. Those are dated observations to recheck, not a universal claim that governance skills can never be invoked by a runtime.

This is the principal delivery record for that outcome. On 27 September 2026 the principal approved relocating delivery ownership here while retaining Arcadia's originating observation. The existing Next / draft position is preserved; this ownership edit neither approves a delivery design nor makes the item Ready.

## Boundary

Own the reusable delegation and skill-access guidance and its verification. Do not install skills, change runtime configuration, introduce a private checkout path as a portable contract, or choose a distribution redesign merely to resolve the observation. Arcadia retains provenance and handoff verification, not a second implementation plan.

## Current state

The originating observation exists, but the supported access route has not been freshly established in each affected runtime. The repository-relative versus runtime-installed discovery boundary must be checked before choosing documentation or implementation changes.

## Steps

- [ ] Reproduce or retire the dated access observations against the supported runtime and installed harness surfaces.
- [ ] Identify the smallest supported access route and resolve whether guidance alone is sufficient.
- [ ] If another repository must change, create or reuse a bounded downstream record there and link both directions before its implementation; do not absorb that repository's implementation here.
- [ ] Prepare the harness guidance and verification plan for human review before marking this record Ready.
- [ ] Following separately approved delivery, verify that a delegating agent can identify the supported access route without trial-and-error invocation.

## Files touched

Expected harness scope is the owning delegation and skill-discovery guidance plus focused tests if required. Exact source paths are selected during planning. No runtime, host configuration, or Arcadia knowledge files are authorised by this record.

## Verify

Exercise representative delegation instructions against the supported access route, including an unavailable invocation and its documented fallback. Run the relevant focused skill audits, harness tests and TypeScript gate for the reviewed implementation. Do not generalise evidence from one runtime to all runtimes.

## Dependencies / blocks

Arcadia's KI-ARCADIA-ECO-005 is the origin, not a build-order blocker. There is no known downstream implementation requirement yet. This principal record owns the overall outcome and integration evidence; any later downstream record owns only its repository-local deliverable and verification. Cross-repository relationships are recorded in prose, not local dependency arrays.

## Documentation impact

### Decision Records

No new decision is made by this ownership change. Assess whether a distribution or authority choice needs a Decision Record during planning.

### Specifications

Change an accepted access contract only if the reviewed solution requires it; do not turn a dated environment observation into a requirement.

### Guides

Make the supported route discoverable from the delegation guidance rather than keeping it in an agent's private memory.

### Roadmap

Keep the reciprocal Arcadia origin link and any later downstream links current. Closing a handoff or downstream ticket does not accept this principal outcome.

## Discussion

### Choice of remedy

Documenting a supported repository-local access route and making skills runtime-invocable are alternatives, not interchangeable commitments. Decide from fresh evidence and ownership boundaries. A CLI or installation defect, if established, needs its own downstream ticket in the implementation owner rather than a second principal record.
