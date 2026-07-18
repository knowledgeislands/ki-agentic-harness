---
id: 'GOV-002'
title: Align KB Stream focus with non-KB roadmap horizons
status: open
roadmap: governance-consistency/align-kb-stream-focus-with-non-kb-roadmap-horizons
blocks: —
blocked-by: GOV-001
---

## Context

Knowledge Base Streams and non-KB roadmaps are distinct local structures that describe the same broad lifecycle: visible blocked work, immediately actionable work, background work, deferred work, and completed history. Align their semantics and the process skills that route through them without flattening either structure into the other.

## Current state

Non-KB repositories use the five `ki-project-roadmap` horizons and governed plan files. Knowledge Bases use `ki-kb-streams` focus directories (`Active`, `Background`, `Dormant`, `Future`, and `Settled`) and proposal checklists. `ki-next` and `ki-plan` currently stop for KBs, while `ki-recap` has only limited local-structure routing. The existing stream lifecycle treats `Settled` as an in-tree record even though durable completed history belongs in canonical documentation and git.

## Steps

1. After GOV-001, update the existing roadmap/Streams boundary decision and feature material to lock the shared lifecycle vocabulary: add `Blocking` to Streams, keep `waiting for` as explicit dependency data within `Background`, align Stream `Dormant` with a non-KB `Parked` horizon, retire `Settled`, and keep proposal or plan status separate from focus or horizon placement.
2. Update `ki-kb-streams` standards, rubric, checker, conform/educate behaviour, examples, source notes, and evaluations for the new Focus model; require completed Stream outcomes to be retained in their canonical documentation and git history rather than a `Settled/` workspace.
3. Update the renamed `ki-repo-roadmap` standard, checker, conformer, generated projection, fixtures, and documentation to add and govern `Parked` without weakening its existing non-KB thematic-plan model.
4. Make `ki-recap`, `ki-next`, and `ki-plan` structure-aware orchestration skills: detect repository type, dispatch to `ki-repo-roadmap` for non-KB work or `ki-kb-streams` for KB work, and use a KB proposal checklist rather than writing a non-KB plan in a KB.
5. Record concrete cross-repository rollout handoffs for the affected Knowledge Base owners once the harness contract is verified, identifying the originating item and whether each recipient is blocked by or blocks local work; do not modify another repository as an implicit part of this plan.
6. Refresh user/developer guidance, composition graphs, and end-to-end fixtures for both repository types; verify the two models share lifecycle meaning while retaining their own file shapes and governance owners.

## Files touched

- `docs/decisions/`, `docs/features/`, and roadmap/process documentation defining the non-KB/KB boundary.
- `skills/implied-families/ki-kb-streams/` and `skills/general-governance/ki-repo-roadmap/`, including standards, rubrics, scripts, tests, and examples.
- `skills/process/ki-recap/`, `skills/process/ki-next/`, and `skills/process/ki-plan/`, plus their scenarios and generated skill graph.
- Follow-on handoff entries in the receiving repositories' owned roadmaps, created only after their owners accept them.

## Verify

1. Focused `ki-kb-streams` and `ki-repo-roadmap` fixtures prove the declared Focus/horizon mappings, absence of `Settled`, and `Parked` handling.
2. Process-skill scenarios prove that a non-KB repository reaches a governed plan and a KB reaches its Stream proposal checklist, with no cross-shape artifact created.
3. `bun run test` and `bun run ki:audit` pass serially after generated outputs are refreshed.
4. The recorded handoffs identify their origin, recipient, ownership, and dependency direction without making the harness plan depend on an unaccepted external change.

## Dependencies / blocks

GOV-001 blocks this plan because every updated process and governance composition must use the final `ki-repo-roadmap` identifier. The implementation creates a shared lifecycle contract, not a common on-disk schema: `ki-kb-streams` and `ki-repo-roadmap` remain distinct adapters.
