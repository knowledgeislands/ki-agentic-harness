---
id: KI-HARNESS-GOV-112
area: GOV
title: Apply September source refreshes
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T18:00:08Z
updated_at: 2026-10-05T08:19:22Z
---

# KI-HARNESS-GOV-112: Apply September source refreshes

## Goal

Resolve the material follow-up work discovered by the September 2026 `ki-agentic-radar`, `ki-model-radar`, and `ki-skills` source refreshes without treating provider releases or implementation counts as adoption evidence.

## Context

The 2026-09-26 refresh confirmed three changes that need more than source-ledger maintenance:

- The current model catalogues expose newer candidate identities, including Claude Opus 5.5 and the GPT-6 Sol and Luna family. The model radar does not yet establish whether they belong in its bounded model set or alter any Knowledge Islands model-agent route, support level, or default.
- The official Agent Host Protocol implementation catalogue now names multiple independent hosts. This supports updating implementation-count evidence, but it does not demonstrate cross-implementation interoperability or a Knowledge Islands use case.
- The former Gas Town Hall discovery source now redirects to Gas City, whose current software-factory and Beads-native orchestration shape is materially different from the source originally reviewed by `ki-skills`.

No existing roadmap item owns this combined refresh follow-up.

The same refresh also found a runtime-versus-host gap: official Codex documentation now says subagents are enabled by default and discovered from `.codex/agents/`, while the compatible KI harness still has no Codex subagent publication path or generic publisher.

## Boundary

Decided 2026-10-05 under delegated owner authority: this is a disposition pass only. Each of the four findings gets a recorded outcome in the source ledger that raised it. The Gas City discovery source in `ki-skills` is retired unless the bounded review below finds reusable skill-authoring practice. No model default or route moves, and AHP is not promoted.

In scope: one dated disposition entry per finding in the owning `references/sources.md`; removing the `GASCITY` row, its link definition and its last-review bullet from `ki-skills` when retired; clearing the `KI-HARNESS-GOV-112` routing pointers those ledgers carry.

Out of scope: changing a consumer model default, model-agent route, recommendation ring or support level; promoting AHP or any other protocol stance; the `ki-agentic-radar` Gas City assessment subject in `radar.toml`, which tracks a coordination tool rather than a skill-practice source and stays; importing Gas City doctrine; building a Codex subagent publisher or `.codex/agents/` projection, which is host work owned by `tools-ki` under `ADR-KI-HARNESS-AGENTS-002` and declined here by `checks.coverage-subagents-chatgpt = false`; and revisiting source claims the refresh already reconciled, including ACP schema release metadata.

## Current state

- **Models.** `skills/governance/ki-model-radar/references/sources.md` already records, at 2026-09-30, that the current Claude and GPT-6 family identities were added and that no route default or recommendation moved. Its 2026-09-26 entry still routes "new model candidates and local route implications" here.
- **AHP.** `skills/governance/ki-agentic-radar/references/sources.md` records multiple independent hosts with interoperability untested, and carries an open watch-item for public cross-implementation results.
- **Gas City.** `skills/keystone/ki-skills/references/sources.md` lists `GASCITY` as a community discovery source, says its changed orchestration shape is routed here, and names this record in its open watch-items. No repository evidence shows a skill-authoring practice adopted from it.
- **Codex subagents.** `skills/agentic-systems/ki-subagents-chatgpt/references/sources.md` and `skills/repo-structure/ki-repo-harness/references/sources.md` each route the `.codex/agents/` runtime-versus-host gap here.

## Steps

- [ ] **Models:** in the `ki-model-radar` sources ledger, add a dated disposition: the 2026-09-30 targeted review discharged the candidate-identity follow-up; route evaluation for a new model needs its own work item with local-fit evidence; no default moved. Replace the routing pointer in the 2026-09-26 entry.
- [ ] **AHP:** in the `ki-agentic-radar` sources ledger, add a dated disposition: implementation multiplicity is recorded, interoperability remains unwitnessed, the stance is unchanged and the existing watch-item carries the follow-up.
- [ ] **Gas City:** read the current Gas City guide once for skill-authoring or harness practice not already covered by the `ki-skills` standard. If none is found, retire `GASCITY`: remove its table row, its `[gas-city]` link definition and its last-review bullet, and add a dated note under `## Last review` saying it was retired and why. If concrete reusable practice is found, keep the source, record the practice in `## Discussion` here, and capture any standard change through `ki-next` rather than making it in this record.
- [ ] **Codex subagents:** in both the `ki-subagents-chatgpt` and `ki-repo-harness` sources ledgers, replace the routing pointer with a dated disposition: the runtime capability is recorded, publication remains host-owned and unavailable, and this repository declines a Codex projection.
- [ ] Remove `KI-HARNESS-GOV-112` from the `ki-skills` open watch-items line, and confirm with `grep -rn "GOV-112" skills` that no ledger still routes work here.
- [ ] Run the verification below and record each finding's outcome in one line under `## Discussion`.

## Files touched

- `skills/governance/ki-model-radar/references/sources.md`
- `skills/governance/ki-agentic-radar/references/sources.md`
- `skills/keystone/ki-skills/references/sources.md`
- `skills/agentic-systems/ki-subagents-chatgpt/references/sources.md`
- `skills/repo-structure/ki-repo-harness/references/sources.md`

## Verify

1. Each of the four findings has one dated disposition entry in its owning ledger, and `grep -rn "GOV-112" skills` returns nothing.
2. Either `GASCITY` and `[gas-city]` are absent from `skills/keystone/ki-skills/references/sources.md` with a dated retirement note, or this record's `## Discussion` names the specific reusable practice that justified keeping it.
3. `git diff` shows no change to any `radar.toml`, rubric, standard or `.ki.toml`, so no default, ring, stance or declaration moved.
4. The commands below pass.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-skills --progress never
ki repo audit --skill ki-model-radar --progress never
ki repo audit --skill ki-agentic-radar --progress never
ki repo audit --skill ki-subagents-chatgpt --progress never
ki repo audit --skill ki-repo-harness --progress never
ki repo audit --skill ki-authoring --progress never
```

## Dependencies / blocks

None. A Codex subagent publisher, if ever wanted, is a separate `tools-ki` item raised through `ki-trades`; this record raises none.

## Documentation impact

### Decision Records

None. A disposition pass records outcomes in source registers; it changes no decision.

### Specifications

None.

### Guides

None.

### Roadmap

None. No model defaults or AHP promotion follow from this pass, and no item is raised in `tools-ki`.

## Discussion

### Model and route evaluation

Identify which newly current models are relevant to Knowledge Islands workloads, preserve the distinction between a provider model identity and an executable model-agent route, and gather local-fit evidence before proposing route or default movement.

### AHP interoperability evidence

Assess at least two independent hosts against a compatible client or locate a public witnessed result. Keep implementation multiplicity separate from interoperability state and route any command-centre adoption decision to its owning capability.

### Gas City source disposition

Review the successor project's current workflow, durable-work, and orchestration contracts against the Agent Skills and Knowledge Islands standards. Adopt only reusable evidence-backed practice; otherwise retire or narrow the discovery source explicitly.

### Codex subagent publication

Reconcile the now-documented Codex runtime capability with the portable subagent and compatible-harness contracts. Decide whether the harness should publish `.codex/agents/`, how installation and activation are verified, and which host owns projection without treating a conforming TOML source file as execution evidence.

### Completion signal

The follow-up is complete when each finding has a documented disposition, any warranted radar or skill-standard change is verified by its focused audit, and every consumer-facing change has its own approved work route rather than being bundled into this review.

### Decision

Disposition pass only: record each finding's outcome and retire the Gas City source unless evidence of reusable practice is found; no model defaults and no AHP promotion. Decided by the Fable reviewer under delegated autonomy, reversible.
