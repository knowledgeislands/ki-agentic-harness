---
id: KI-HARNESS-GOV-093
area: GOV
title: Keep plugin projection current
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: c19e358d5f8cbd8cb3b45a664507309f43fbb3dd
created_at: 2026-09-25T08:50:34Z
updated_at: 2026-10-05T11:12:24Z
---

# KI-HARNESS-GOV-093: Keep plugin projection current

## Goal

A change to a canonical skill reaches `ki-plugins` without a person remembering to regenerate it, or the staleness is visible to something that fails.

## Context

`ki-plugins` is a generated, lossy projection of this repository, produced by `ki:binding:claude:build-plugin` and never hand-edited (ADR-KI-HARNESS-002; earlier text cited ADR-KI-HARNESS-005 in error). Nothing fails when it falls behind its source.

`ADR-KI-HARNESS-SKILLS-015` relaxed the decision-record and specification identifier grammars in `ki-decision-records` and `ki-specs` on 2026-09-25. Repositories resolving skills from this checkout picked the change up immediately; any consumer resolving them through the published plugin still enforces the old alpha-leading rule, and would reject an identifier this repository now calls well-formed. The divergence was noticed in conversation rather than reported by a check.

That is one instance of the general case: every skill edit makes the projection stale, and the window between the two is unbounded and unmeasured.

## Boundary

In scope: route 2 from Discussion, a read-only check mode on the existing builder that regenerates the projection into a scratch directory, compares it with a `ki-plugins` checkout, and exits non-zero on any difference; its tests; its place in this repository's documented verification gate; and, as the first step, raising a trade to `ki-plugins` for the regeneration that carries `ADR-KI-HARNESS-SKILLS-015` and every later skill change.

Out of scope: the projection's lossiness, which `ADR-KI-HARNESS-005` settles; any write to `ki-plugins`, including the regeneration itself; any change to how other runtimes resolve skills; a pre-commit hook or CI job that depends on a sibling checkout; the builder's stale default output path (`~/kis/knowledgeislands/ki-repo-plugins`), which the check does not rely on; and routes 1 and 3.

Cross-repository boundary: the regeneration is a trade to `ki-plugins`, executed under that repository's authority. `ki-plugins` has been paused since `b425f11` (2026-09-20): its `AGENTS.md` says not to refresh the generated payload "unless the pause is explicitly lifted", so the owner lifts the pause there when disposing of the trade. This record writes nothing in `ki-plugins`, and its acceptance does not depend on the trade: the check is verified against a scratch build in this repository.

## Current state

Verified on `main` at `19651664`. `skills/environment/ki-binding-claude/scripts/build-plugin.ts` supports `--dry-run` and `--json` but has no compare mode; its header states it is a public command rather than a rubric action because its target is a separate repository. The package script is `ki:binding:claude:build-plugin`. The `ADR-KI-HARNESS-SKILLS-015` change has in fact already reached `ki-plugins`: its `ki-decision-records` and `ki-specs` rubric contexts are byte-identical to this repository's, carried by the `ki-plugins` refresh `5006188` (2026-09-27), made after the pause. The projection has not been regenerated since, so later skill changes are likely unprojected; the size of that drift is unmeasured. Nothing in this repository compares the two.

## Steps

- [x] Close as superseded by [KI-HARNESS-RTP-016](KI-HARNESS-RTP-016-retire-claude-plugin-projection.md): the projection this record would have checked is retired under `ADR-KI-HARNESS-015`, so none of the planned steps (preserved under Discussion) was executed.

## Files touched

- `skills/environment/ki-binding-claude/scripts/build-plugin.ts`
- `skills/environment/ki-binding-claude/scripts/build-plugin.test.ts`
- `skills/environment/ki-binding-claude/references/standards-claude-binding.md`
- `package.json`
- `AGENTS.md`

## Verify

1. The trade to `ki-plugins` exists, names the regeneration and this harness revision, and leaves the pause decision to that repository; its execution is not a criterion here.
2. `bun run ki:binding:claude:build-plugin <scratch dir>` into a fresh scratch directory (for example from `mktemp -d`), followed by `bun run ki:binding:claude:check-plugin <scratch dir>`, exits `0`; no `ki-plugins` checkout is needed.
3. Editing any projected `SKILL.md` in this repository without regenerating makes the same command exit `1` and name that skill's path; reverting restores `0`.
4. The scratch output directory's bytes and mtimes are unchanged after any number of `--check` runs.
5. The new tests pass under `bun run test`.

```bash
bun run test
bunx tsc --noEmit
bun run ki:binding:claude:build-plugin <scratch dir>
bun run ki:binding:claude:check-plugin <scratch dir>
ki repo audit --skill ki-binding-claude --progress never
```

## Dependencies / blocks

None. The `ki-plugins` regeneration is a receiver-owned trade; the owner lifts the pause there, and it does not block acceptance here.

## Documentation impact

### Decision Records

None. `ADR-KI-HARNESS-005` already establishes `ki-plugins` as a generated projection; this record adds its drift check.

### Specifications

`standards-claude-binding.md` gains one sentence.

### Guides

None.

### Roadmap

None.

## Review

### Delivered

Nothing from the approved plan. On 2026-10-05 Kris retired `ki-plugins` ("lets just get rid of it, its 1 less thing to think about"); the projection, its builder and the trade target this record depended on no longer exist. The record closes as superseded by [KI-HARNESS-RTP-016](KI-HARNESS-RTP-016-retire-claude-plugin-projection.md) and `ADR-KI-HARNESS-015`; its baseline records the revision at closure, and execution never began.

### Change Summary

No file in this record's Files touched list was changed for it. RTP-016 deletes `build-plugin.ts`, `build-plugin.test.ts` and the `ki:binding:claude:build-plugin` script, which removes the drift this record would have checked. This record's Context and Out of scope cited `ADR-KI-HARNESS-005`; the owning decision is `ADR-KI-HARNESS-002`.

### Verification

None run for this record; RTP-016 carries the retirement gates.

### Outstanding concerns

None. No `ki-plugins` regeneration trade was raised, so none needs withdrawing.

### Post-change review

The goal, keeping a published projection current, has no remaining subject. Closing rather than leaving it Ready prevents a later session from implementing a check against a retired repository.

### Mini recap

Superseded, not delivered. Learning route: a generated projection without a failing drift check went stale and was retired rather than repaired; `ADR-KI-HARNESS-015` records that any reinstated projection must name its drift check.

## Done

Accepted 2026-10-05 by Kris Brown on the review packet above.

## Discussion

Three candidate routes, to be chosen at triage rather than assumed here.

1. **Regenerate on demand.** Treat the projection as something a session refreshes when it changes a skill. Cheapest, and exactly the mechanism that already failed to fire in this case.
2. **Drift check that fails.** A gate regenerates into a scratch directory and compares, so a stale projection is a `FAIL` rather than a thing to remember. This is the `ki-repo` REVIEW expectation that vendored or generated copies are checked for drift by something that fails, applied to this repository's own output. It needs the regeneration path to be deterministic and bounded.
3. **Housekeeping cadence.** A recurring `ki-work-housekeeping` item that regenerates and commits. Catches drift eventually rather than at the point it is introduced, and the cadence is an arbitrary tolerance for how long consumers may be wrong.

Route 2 subsumes route 1 and makes route 3 unnecessary; routes 1 and 3 are only worth taking if the regeneration turns out not to be deterministic enough to diff.

Whichever route wins, the immediate regeneration carrying `ADR-KI-HARNESS-SKILLS-015` is owed to consumers of the published plugin and should not wait for it.

### Decision

Route 2: a failing drift check that regenerates the projection into scratch and compares it, with the `ADR-KI-HARNESS-SKILLS-015` regeneration as the first step. Decided by the Fable reviewer under delegated autonomy, reversible.

A failing drift check that regenerates the projection into scratch and compares, with the `ADR-KI-HARNESS-SKILLS-015` regeneration done first. The check runs in this repository's documented verification gate rather than a pre-commit hook, because a hook that fails on a missing or paused sibling checkout would block unrelated commits.

### Original plan (not executed)

- Raise a trade to `ki-plugins` for the `ADR-KI-HARNESS-SKILLS-015` regeneration and every later skill change: one regeneration commit from `bun run ki:binding:claude:build-plugin <ki-plugins checkout>` at current `main`, naming this harness revision. The owner lifts the pause there; nothing in this record writes to `ki-plugins`.
- Add `--check` to `build-plugin.ts`: build the manifest into a fresh `mkdtemp` scratch directory, compare every generated path's digest with the given output directory, print each added, removed or changed path, exit `1` on any difference or when the output directory or its generated paths are absent, exit `0` when identical, and never write the output directory. Reject `--check` combined with `--dry-run`.
- Add tests to `build-plugin.test.ts`: two builds of the same source produce identical digests (determinism); `--check` passes against a freshly built output; changing one projected skill file in the source fixture makes `--check` fail and name that path; the output directory's bytes and mtimes are unchanged by `--check`.
- Add the package script `ki:binding:claude:check-plugin` running `bun skills/environment/ki-binding-claude/scripts/build-plugin.ts --check`.
- Add the check to the Verification bullet in `AGENTS.md` for changes touching `skills/` or `subagents/governance/`, with the `ki-plugins` checkout path resolved from `ki registry list`; and add one sentence to the Cowork paragraph of `references/standards-claude-binding.md` that a stale projection is detected by `--check`.
