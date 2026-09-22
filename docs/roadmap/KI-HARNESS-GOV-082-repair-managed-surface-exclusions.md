---
id: KI-HARNESS-GOV-082
area: GOV
title: Repair managed surface exclusions
theme: governance-consistency
blocks: []
blocked_by: []
baseline_ref: 61fcf274ced8632cad9d0e329b5bd06cca0d332b
transferred_from: ki-website
created_at: 2026-09-21T15:23:58Z
updated_at: 2026-09-22T01:23:21Z
horizon: now
status: awaiting-review
---

## Goal

A `GEN-1` failure clears itself. Either `ki repo conform` repairs it, or the diagnostic tells the reader that Knip will advise the opposite and why that advice is wrong. Today it does neither, and the fix is a two-string insert that two repositories have independently failed to make.

## Context

`GEN-1` requires the managed discovery surfaces — `src/generated/`, `.claude/skills/`, `.claude/agents/`, `.agents/skills/` — to be excluded from Biome, Knip, and the Markdown gate consistently. These are directories a runtime sweeps to find capability, holding copies placed by `ki bootstrap`, so a tool that reports on them is reporting on a file the next sync overwrites. `standards-engineering.md` §212 states the rule and the reasoning is sound; nothing here disputes it.

The trap is an asymmetry between the three tools. For Biome and rumdl the exclusions do real work — without them, those tools genuinely walk the directory. For Knip they are inert, because nothing in any workspace's `project` globs reaches `.claude/skills/` in the first place. Knip therefore reports them as removable. In KI Website `bunx knip` prints exactly:

```text
Configuration hints (2)
.claude/skills/**    knip.json  Remove from ignore
.agents/skills/**    knip.json  Remove from ignore
```

Both entries are required by `GEN-1`. Acting on Knip's own hint turns a passing audit into a failing one — the entry is mandatory precisely because it is functionally redundant, since its job is to be a machine-checkable statement that the three tools agree.

The mitigation exists but is invisible. `KNIP-2` runs `bunx knip --no-config-hints` ([`audit-evidence.ts:793`](../../skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts)), so the house gate never surfaces the hint. A developer running `bunx knip` by hand — the obvious thing to do when chasing a Knip finding — sees it with no indication that it is expected.

The prose is better than I first credited. §231 already says the managed-surface `ignore` entries are reported as unused configuration hints, are required by `GEN-1`, and that the hint must not be acted on. That landed in `5e296ef9` on 2026-09-19. What it does not do is sit anywhere the reader will be at the moment of failure: §212 states the rule without mentioning the hint, and the audit's own message says only which cells are empty.

Two repositories have hit this. KI Website removed both entries during `KI-WEB-SITE-013` on the strength of Knip's report and failed the gate mid-implementation. `infoschematics` is failing `GEN-1` right now with the identical pair of cells, alongside nine unrelated failures.

`GEN-1` is audit-only — `generated: { gen1: evidence('GEN-1') }` in `engineering.ts:429`, with no conform counterpart. §212 gives the reason: repairing Biome and Knip configuration while preserving supported JSON/JSONC comments and unrelated bytes needs an owned editor capability the rubric does not have.

## Boundary

This concerns `GEN-1`'s diagnostic and repair inside `ki-engineering`. It does not reopen whether the rule is correct, and it does not touch `.rumdl.toml`, which `ki-authoring` wholly owns and already conforms.

It changes no repository's configuration. `infoschematics` owns its own failure, and KI Website is already conformant.

## Current state

`GEN-1` correctly requires managed-surface exclusions across Biome, Knip, and Markdown tooling, but its diagnostic does not explain that Knip may call required entries unused. CONFORM has no comment-preserving multi-format editor capable of repairing every affected configuration safely.

## Steps

- [x] Extend the `GEN-1` diagnostic to name the missing tool cell and explain that Knip's unused-ignore hint does not override the cross-tool managed-surface contract.
- [x] Cross-reference the managed-surface rule and Knip-hint explanation where the operator encounters the failure.
- [x] Keep CONFORM no-write for this concern until one safe editor can preserve supported JSON and JSONC bytes, comments, ordering, and unrelated configuration.
- [x] Add fixtures for absent Knip exclusions, partial cross-tool coverage, fully compliant exclusions, and the exact remediation message.
- [x] Regenerate the engineering rubric and verify existing `KNIP-2` behaviour remains unchanged.

## Files touched

- `skills/governance/ki-engineering/references/standards-engineering.md`
- `skills/governance/ki-engineering/references/rubric.md`
- `skills/governance/ki-engineering/scripts/rubric/items/generated.ts`
- `skills/governance/ki-engineering/scripts/rubric/contexts/engineering.ts`
- Focused `GEN-1` fixture tests

## Verify

- Focused engineering tests assert the diagnostic text, tool-specific missing cells, and clean compliant case.
- `ki dev skill rubric ki-engineering` reproduces the committed rubric.
- `ki repo audit --skill ki-engineering --repo .` and `ki repo audit --skill ki-skills --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

No dependency blocks the diagnostic repair. Automatic configuration mutation is explicitly excluded until safe format-preserving edit capability exists.

## Documentation impact

### Decision Records

No Decision Record is required because the managed-surface rule and ownership are unchanged.

### Specifications

The engineering standard and generated diagnostic rubric remain the accepted contract.

### Guides

No new guide is needed; remediation must appear in the failure itself and the existing standard.

### Roadmap

Automatic safe repair may be captured later if a general format-preserving configuration editor becomes available.

## Review

### Delivered

Improved the approved `GEN-1` operator path from immutable baseline `61fcf274ced8632cad9d0e329b5bd06cca0d332b`. The change remains diagnostic-only and does not add partial JSON or JSONC mutation.

### Summary changes

The audit now names missing Biome, Knip, and Markdown exclusion cells and explains that Knip's unused-ignore hint is expected and cannot override the cross-tool contract. The rubric remediation repeats that warning, the standard places it beside the managed-surface rule, and focused fixtures cover absent, partial, and compliant configurations.

### Verification

`bun test skills/governance/ki-engineering/scripts/rubric/items/index.test.ts` passed 28 tests, `bunx tsc --noEmit` passed, and `ki dev skill rubric ki-engineering --write` regenerated the committed rubric. The aggregate batch gate will rerun the repository-wide tests and skill audits.

### Outstanding concerns

No automatic repair is offered. A future safe editor must preserve comments, ordering, and unrelated JSON or JSONC configuration before CONFORM can own this cross-tool repair.

### Post-change review

The implementation meets the diagnostic goal without weakening tool ownership or masking Knip findings. The main regression risk is divergence between the pure fixture inspector and repository evidence collector; both share the same required text and are covered by the focused engineering suite. The item is ready for acceptance review.

### Mini recap

`GEN-1` failures now tell an operator exactly which exclusions are absent and why Knip's contrary hint must not be followed. Repair remains deliberate and reviewable; no receiver repository was modified.

## Discussion

### Planning decisions

The first slice repairs the operator path through an exact diagnostic rather than introducing a `knip.json`-only CONFORM exception. A partial editor would make safety depend on incidental file format and leave the same cross-tool failure inconsistent elsewhere.

### Why the smallest fix is the diagnostic

The reader of a `GEN-1` failure is, by construction, someone who does not know this rule exists — a conformant repository never shows them the message. They have the failure text and whatever Knip told them, and those two sources contradict each other with no tiebreaker in either.

One clause in the message closes that. Something to the effect of _knip reports these entries as unused configuration hints; that is expected and the hint must not be acted on_ costs nothing, appears exactly when it is needed, and does not depend on anyone having read §231. It is strictly additive and carries no risk to the check's behaviour.

### Whether conform should repair it

The general objection in §212 — comment-preserving JSON edits need a capability the rubric lacks — is real for `biome.json`, which is JSONC and carries comments in several repositories. It is weaker for the specific case that keeps failing. Both observed failures are the same shape: a `knip.json` that is plain JSON, needing two strings appended to an `ignore` array, in a file the house already stores single-line. An append to one array in one known-plain-JSON file is a much narrower capability than a general JSONC editor.

Scoping conform to that case would have fixed both occurrences automatically. The counter-argument is that a narrow repair invites the general one, and a half-repairing conform — fixing Knip, reporting Biome — is the partial cross-tool repair §212 explicitly declines to do.

### Cross-referencing

The cheapest documentation change is a pointer from §212 to §231, so that the section stating the rule also names the trap. This is worth doing regardless of which of the above lands, and is close to free.

### Alternatives considered

Leaving it is defensible now that §231 exists, on the argument that the documentation gap is already closed. The evidence against is that §231 predates KI Website's failure by two days and did not prevent it, because nothing routed the reader there.

Raising the hint into a rubric-owned wrapper — having the house always invoke Knip through a script that suppresses hints — would stop a hand-run `bunx knip` from ever showing the contradiction. It also hides a class of legitimate Knip advice, and conflicts with `ki:knip` being named as retired drift in §182.

### Questions resolved by the plan

- Is a narrow `knip.json`-only conform repair worth the precedent, or does the `GEN-1` remedy stay manual across all three tools for consistency?
- Should the diagnostic name the tool whose advice conflicts, or state the general principle that a tool's opinion about its own configuration does not override a cross-tool rule it cannot see?
- `infoschematics` is failing this today. Does that get a handoff item of its own, or is it left in its existing pile of ten failures?
- Do `src/generated/` and `.claude/agents/` have the same inert-to-Knip property, or is the collision specific to the skills directories?
