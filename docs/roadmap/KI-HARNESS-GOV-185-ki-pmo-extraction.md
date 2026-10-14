---
id: KI-HARNESS-GOV-185
area: GOV
title: ki-pmo extraction
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: in-progress
horizon: now
blocks: []
blocked_by: []
baseline_ref: 6d3e2f342464a96ef3d6d9e039a57260d4f9e2cd
created_at: 2026-10-14T10:11:16Z
updated_at: 2026-10-14T10:11:16Z
---

# Extract the Coordinating-Thread Standard into ki-pmo

## Goal

Create `ki-pmo`, the governance skill for coordinating threads, by moving the thread half of `ki-delegation`'s background-run standard into it without changing the rules' meaning; make `ki-pmo` the owner of the coordinator reminder hook and ship the `ki-coordinator` output style; add the reciprocal off-ramps in `ki-delegation`, `ki-checkpoint`, `ki-recap` and `ki-tokenomics`; and regenerate every derived publication, so that a coordinating thread can be rebuilt from repository evidence alone and stays responsive.

## Context

This is the harness delivery of the pilot KI-PRINCIPAL-ECO-013 in Knowledge Islands Principal, which Kris granted on 2026-10-14 in these words: "PILOT-GRANT - granted". The pilot's scope was set the day before: "PILOT-SCOPE - (a) ki-pmo move only, with the rebuild-from-checkpoint test." Kris set the principle the skill enforces on 2026-10-13: "It's imperative that you do not do the work directly and that you delegate that work to subagents so that you remain responsive. And if I send you a message, it doesn't preempt any work that you are already doing. This is a fundamental requirement of the delegation capability." The hook's ownership and signal follow Kris's "HOOK-OWNER - (a). A repository that doesn't delegate then never gets the hook, and removing ki-pmo disables it." The output style follows "COORD-STYLE" and its name "STYLE-NAME", and the `/ki-pmo` entry point follows "SUMMARY-ENTRY - (b) /ki-pmo entry point once KI-PRINCIPAL-ECO-013 creates ki-pmo; build nothing now." Which repositories declare the skill in the pilot is "CAPITALS - (a).", the island and this harness only.

## Boundary

- In scope: `skills/change-management/ki-pmo/` with its standard, sources, rubric items, tests and generated rubric; the reduction of `ki-delegation`'s standard, SKILL.md, sources and rubric; off-ramps in `ki-checkpoint`, `ki-recap` and `ki-tokenomics`; `hooks/coordinator-reminder.sh`, its tests and README; HARN-012 and a new HARN-013; refinements in place to ADR-KI-HARNESS-SKILLS-005 and ADR-KI-HARNESS-SKILLS-006; `output-styles/ki-coordinator.md`; `.ki.toml` and `.claude/settings.json`; the regenerated catalogue, skill graph and skill map.
- Out of scope: declaring `ki-pmo` in any other Capital; deploying the output style to a user's `~/.claude/output-styles/` through chezmoi; re-exporting the diagram SVGs where the viewer tooling is unavailable; the acceptance tests the pilot record runs in a live thread; a `tools-ki` release; any new feature record.

## Requirements

1. `ki-pmo` is a governance skill with the four universal modes plus HELP and the `summary | recap | full-summary | mark` entry points, depends on `ki-delegation` and `ki-checkpoint`, and its standard holds the moved material in the order the pilot record lists, opening with the responsive-coordinator principle in Kris's words.
2. `ki-delegation` keeps the run contract, the owner report and Needs tags, the sentence that no output style shortens an owner report and the decisions-log rules, and points to `ki-pmo` for the coordinating thread; its rubric keeps only run-side items.
3. The hook's signal is `[skills.ki-pmo]` in the checkout's top-level `.ki.toml`; a checkout with checkpoints but no declaration is silent.
4. `bun run test`, `bunx tsc --noEmit`, the skill-graph check and the focused audits for `ki-skills`, `ki-delegation`, `ki-checkpoint`, `ki-pmo`, `ki-repo-harness` and `ki-work-roadmap` pass on the combined result.

## Current state

In progress in the pilot's harness worktree on branch `pilot/ki-pmo` from baseline `6d3e2f34`.

## Steps

- [ ] Create `ki-pmo`: SKILL.md, standard, sources, rubric items with tests, generated rubric.
- [ ] Reduce `ki-delegation` and move the thread rubric items.
- [ ] Add the off-ramps in `ki-checkpoint`, `ki-recap` and `ki-tokenomics`.
- [ ] Move the hook to the declaration signal; update tests, README, HARN-012; add HARN-013; ship the output style.
- [ ] Refine the two ADRs in place; declare `[skills.ki-pmo]`; select the output style in `.claude/settings.json`.
- [ ] Regenerate the catalogue, skill graph and skill map; run the gates; commit by explicit path and push fast-forward.

## Files touched

- `skills/change-management/ki-pmo/**` (new), `output-styles/ki-coordinator.md` (new).
- `skills/governance/ki-delegation/SKILL.md`, `references/standards-background-runs.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`, `scripts/rubric/items/index.test.ts`.
- `skills/governance/ki-checkpoint/references/standards-checkpoints.md`, `skills/change-management/ki-recap/SKILL.md`, `skills/environment/ki-tokenomics/SKILL.md`, `references/standards-tokenomics.md`, `references/sources.md`.
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`, `docs/specs/harness.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-005-*.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-006-*.md`.
- `.ki.toml`, `.claude/settings.json`, `skills/README.md`, `docs/diagrams/skill-graph.architecture.json`, `docs/diagrams/skill-map.architecture.json`, `docs/roadmap/_ISSUES.md`.

## Verify

- `bun run test`, `bunx tsc --noEmit`, `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`, `bun test hooks/coordinator-reminder.test.ts`.
- `ki repo audit --skill ki-skills`, `ki repo audit --skill ki-delegation`, `ki repo audit --skill ki-checkpoint`, `ki repo audit --skill ki-pmo`, `ki repo audit --skill ki-repo-harness`, `ki repo audit --skill ki-work-roadmap`.
- A search across the harness for `under ki-delegation`, `ki-delegation read at` and the moved anchors finds only `ki-pmo`'s own transitional notes and this record.

## Dependencies / blocks

- The installed `ki` resolves declared skills through the dev-linked primary checkout, so the `[skills.ki-pmo]` declaration can be audited and committed only once `main` carries the skill; the declaration follows the skill in its own commit, as KI-HARNESS-GOV-182 found.
- The pilot's acceptance tests, the chezmoi deployment of the output style and the other Capitals' declarations belong to KI-PRINCIPAL-ECO-013 and Wave F.

## Documentation impact

### Decision Records

ADR-KI-HARNESS-SKILLS-005 and ADR-KI-HARNESS-SKILLS-006 are refined in place: the delegation run contract and the coordinating thread are distinct, and `change-management` holds coordinating-thread governance.

### Specifications

HARN-012 names `ki-pmo` and the declaration signal; HARN-013 adds the coordinator output style.

### Guides

None.

### Roadmap

No follow-on record here. The diagram SVG re-export, where the viewer tooling is unavailable, is named under Review for its owner.

## Discussion

### Why the hook's signal is the declaration and not the checkpoints folder

A checkpoints folder marks a repository that has had a thread, not one that delegates under this contract. Kris's "HOOK-OWNER - (a)" makes the declaration the signal so that adopting or removing `ki-pmo` turns the reminder on or off with nothing else to configure.

### Why ki-recap carries no optional dependency on ki-pmo

The off-ramp is prose: in a coordinating thread, `ki-recap` hands a recap to `ki-pmo`'s forms, which is Kris's "RECAP-AWARE - (c) ki-recap detects coordinating thread and hands ki-pmo's forms." An `ki-optional-depends-on` edge from `ki-recap` to `ki-pmo` would close an undirected cycle through `ki-batch` and `ki-delegation`, and the skill-graph layout, which lays the dependency graph out as a forest, overflows on a cycle. `ki-recap` is a global process skill with no declaration table, so the edge would also add nothing to activation.
