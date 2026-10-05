---
id: KI-HARNESS-GOV-093
area: GOV
title: Keep plugin projection current
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T08:50:34Z
updated_at: 2026-10-05T08:03:47Z
---

# KI-HARNESS-GOV-093: Keep plugin projection current

## Goal

A change to a canonical skill reaches `ki-plugins` without a person remembering to regenerate it, or the staleness is visible to something that fails.

## Context

`ki-plugins` is a generated, lossy projection of this repository, produced by `ki:binding:claude:build-plugin` and never hand-edited (ADR-KI-HARNESS-005). Nothing fails when it falls behind its source.

`ADR-KI-HARNESS-SKILLS-015` relaxed the decision-record and specification identifier grammars in `ki-decision-records` and `ki-specs` on 2026-09-25. Repositories resolving skills from this checkout picked the change up immediately; any consumer resolving them through the published plugin still enforces the old alpha-leading rule, and would reject an identifier this repository now calls well-formed. The divergence was noticed in conversation rather than reported by a check.

That is one instance of the general case: every skill edit makes the projection stale, and the window between the two is unbounded and unmeasured.

## Boundary

In scope: route 2 from Discussion, a read-only check mode on the existing builder that regenerates the projection into a scratch directory, compares it with a `ki-plugins` checkout, and exits non-zero on any difference; its tests; its place in this repository's documented verification gate; and, as the first step, the regeneration that carries `ADR-KI-HARNESS-SKILLS-015` and every later skill change to `ki-plugins`.

Out of scope: the projection's lossiness, which `ADR-KI-HARNESS-005` settles; hand-editing anything in `ki-plugins`; any change to how other runtimes resolve skills; a pre-commit hook or CI job that depends on a sibling checkout; the builder's stale default output path (`~/kis/knowledgeislands/ki-repo-plugins`), which the check does not rely on; and routes 1 and 3.

Cross-repository boundary: the regeneration writes and commits in `ki-plugins`, under that repository's authority. `ki-plugins` has been paused since `b425f11` (2026-09-20): its `AGENTS.md` says not to refresh the generated payload "unless the pause is explicitly lifted". Step 1 therefore needs the owner's explicit lift of that pause, recorded in `ki-plugins`, before any write there. The harness-side check (steps 2 onwards) does not depend on it.

## Current state

Verified on `main` at `19651664`. `skills/environment/ki-binding-claude/scripts/build-plugin.ts` supports `--dry-run` and `--json` but has no compare mode; its header states it is a public command rather than a rubric action because its target is a separate repository. The package script is `ki:binding:claude:build-plugin`. The `ADR-KI-HARNESS-SKILLS-015` change has in fact already reached `ki-plugins`: its `ki-decision-records` and `ki-specs` rubric contexts are byte-identical to this repository's, carried by the `ki-plugins` refresh `5006188` (2026-09-27), made after the pause. The projection has not been regenerated since, so later skill changes are likely unprojected; the size of that drift is unmeasured. Nothing in this repository compares the two.

## Steps

- [ ] Regeneration first. Confirm the `ADR-KI-HARNESS-SKILLS-015` content is present in `ki-plugins` (it is, as of `5006188`). With the `ki-plugins` pause explicitly lifted by the owner, run `bun run ki:binding:claude:build-plugin <ki-plugins checkout>` from current `main` and commit the result in `ki-plugins` as one regeneration commit naming this harness revision, so the drift check starts from a current baseline.
- [ ] Add `--check` to `build-plugin.ts`: build the manifest into a fresh `mkdtemp` scratch directory, compare every generated path's digest with the given output directory, print each added, removed or changed path, exit `1` on any difference or when the output directory or its generated paths are absent, exit `0` when identical, and never write the output directory. Reject `--check` combined with `--dry-run`.
- [ ] Add tests to `build-plugin.test.ts`: two builds of the same source produce identical digests (determinism); `--check` passes against a freshly built output; changing one projected skill file in the source fixture makes `--check` fail and name that path; the output directory's bytes and mtimes are unchanged by `--check`.
- [ ] Add the package script `ki:binding:claude:check-plugin` running `bun skills/environment/ki-binding-claude/scripts/build-plugin.ts --check`.
- [ ] Add the check to the Verification bullet in `AGENTS.md` for changes touching `skills/` or `subagents/governance/`, with the `ki-plugins` checkout path resolved from `ki registry list`; and add one sentence to the Cowork paragraph of `references/standards-claude-binding.md` that a stale projection is detected by `--check`.

## Files touched

- `skills/environment/ki-binding-claude/scripts/build-plugin.ts`
- `skills/environment/ki-binding-claude/scripts/build-plugin.test.ts`
- `skills/environment/ki-binding-claude/references/standards-claude-binding.md`
- `package.json`
- `AGENTS.md`
- In `ki-plugins`, generated paths only, under step 1: `knowledge-islands/` and the marketplace manifest the builder owns

## Verify

1. `ki-plugins`' copies of `ki-decision-records` and `ki-specs` rubric contexts match this repository's byte for byte, so a digit-leading scope such as `GDR-5GE-P2-001` is accepted through the plugin.
2. `bun run ki:binding:claude:check-plugin <ki-plugins checkout>` exits `0` immediately after step 1.
3. Editing any projected `SKILL.md` in this repository without regenerating makes the same command exit `1` and name that skill's path; reverting restores `0`.
4. `git -C <ki-plugins checkout> status --porcelain` is empty after any number of `--check` runs.
5. The new tests pass under `bun run test`.

```bash
bun run test
bunx tsc --noEmit
bun run ki:binding:claude:check-plugin <ki-plugins checkout>
ki repo audit --skill ki-binding-claude --progress never
```

## Dependencies / blocks

None in this repository. Step 1 waits on the owner's explicit lift of the `ki-plugins` pause, which is a condition in that repository rather than a work item here.

## Documentation impact

### Decision Records

None. `ADR-KI-HARNESS-005` already establishes `ki-plugins` as a generated projection; this record adds its drift check.

### Specifications

`standards-claude-binding.md` gains one sentence.

### Guides

None.

### Roadmap

None.

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
