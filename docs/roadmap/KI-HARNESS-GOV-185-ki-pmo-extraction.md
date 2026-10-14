---
id: KI-HARNESS-GOV-185
area: GOV
title: ki-pmo extraction
project: ways-of-working
component: governance
kind: deliver
purpose: governance
status: awaiting-review
horizon: now
blocks: []
blocked_by: []
baseline_ref: 6d3e2f342464a96ef3d6d9e039a57260d4f9e2cd
created_at: 2026-10-14T10:11:16Z
updated_at: 2026-10-14T10:50:03Z
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

Delivered on harness `main` and pushed on 2026-10-14 as six commits from baseline `6d3e2f34`: the ledger advance, this record, a `ki-skills` fix that reads a hyphenated mode name whole, the extraction commit, a fix giving each mechanical `ki-pmo` rubric item its own outcome bucket, and the declaration commit with the regenerated catalogue, `ki-delegation` rubric and diagram manifest stamp. Awaiting review.

## Steps

- [x] Create `ki-pmo`: SKILL.md, standard, sources, rubric items with tests, generated rubric.
- [x] Reduce `ki-delegation` and move the thread rubric items.
- [x] Add the off-ramps in `ki-checkpoint`, `ki-recap` and `ki-tokenomics`.
- [x] Move the hook to the declaration signal; update tests, README, HARN-012; add HARN-013; ship the output style.
- [x] Refine the two ADRs in place; declare `[skills.ki-pmo]`; select the output style in `.claude/settings.json`.
- [x] Regenerate the catalogue, skill graph and skill map; run the gates; commit by explicit path and push fast-forward.

## Files touched

- `skills/change-management/ki-pmo/**` (new), `output-styles/ki-coordinator.md` (new).
- `skills/governance/ki-delegation/SKILL.md`, `references/standards-background-runs.md`, `references/sources.md`, `references/rubric.md`, `scripts/rubric/items/background-runs.ts`, `scripts/rubric/items/index.test.ts`.
- `skills/governance/ki-checkpoint/references/standards-checkpoints.md`, `skills/change-management/ki-recap/SKILL.md`, `skills/environment/ki-tokenomics/SKILL.md`, `references/standards-tokenomics.md`, `references/sources.md`.
- `hooks/coordinator-reminder.sh`, `hooks/coordinator-reminder.test.ts`, `hooks/README.md`, `docs/specs/harness.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-005-*.md`, `docs/decisions/ADR-KI-HARNESS-SKILLS-006-*.md`.
- `skills/keystone/ki-skills/scripts/rubric/contexts/skill.ts`, `skill.test.ts`, `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`, `README.md`, `docs/diagrams/diagrams.toml`.
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

## Review

### Delivered

The approved boundary was delivered in full: `ki-pmo` with its standard, sources, rubric items, tests and generated rubric; the reduced `ki-delegation`; the off-ramps in `ki-checkpoint`, `ki-recap` and `ki-tokenomics`; the hook on the declaration signal with its tests, README, HARN-012 and HARN-013; the two ADRs refined in place; the `ki-coordinator` output style; the `.ki.toml` declaration and `.claude/settings.json` selection; and the regenerated catalogue, skill graph, skill map, `ki-delegation` rubric and diagram manifest stamp. The exclusions held: no other Capital declared, no chezmoi deployment, no SVG re-export, no live acceptance test, no release, no new feature record. Baseline `6d3e2f342464a96ef3d6d9e039a57260d4f9e2cd`. Authority is Kris's grant of 2026-10-14: "PILOT-GRANT - granted", within "PILOT-SCOPE - (a) ki-pmo move only, with the rebuild-from-checkpoint test." and "CAPITALS - (a)."

### Change Summary

Six commits on `main`, pushed on 2026-10-14: the ledger advance, this record, a `ki-skills` fix so the Operating-modes heading reader takes a hyphenated mode name whole, the extraction commit, a fix giving each mechanical `ki-pmo` rubric item its own outcome bucket, and the declaration commit with the regenerated publications. The declaration followed the skill in its own commit after `main` carried it, as KI-HARNESS-GOV-182 found. Two deviations from the record as captured, both corrective: the `ki-skills` reader fix and the `ki-diagrams` declaration moved above the Relationships banner so that `[skills.ki-trades]` is again the last table. The `ki-recap` optional dependency edge was not added; the Discussion gives the reason.

### Verification

Run on 2026-10-14 against the pushed tree on `main`:

- The test suite run by skill group with hooks and evals: 1128 tests pass, 0 fail. `bunx tsc --noEmit`: clean. `bun skills/repo-structure/ki-repo-harness/scripts/skill-graph.ts --check`: both sources in sync. `bun test hooks/coordinator-reminder.test.ts`: 12 pass.
- `ki repo audit` for `ki-skills`, `ki-delegation`, `ki-checkpoint`, `ki-pmo`, `ki-repo`, `ki-repo-harness`, `ki-diagrams` and `ki-work-roadmap`: no failures; the only warnings are the two pre-existing `ki-skills` refresh-cadence warnings on other skills' sources.
- `ki dev skill rubric ki-pmo` and `ki dev skill rubric ki-delegation`: in sync.
- The search for `under ki-delegation`, `ki-delegation read at` and the moved anchors finds only this record.

### Outstanding concerns

- The SVG exports under `docs/diagrams/` were not re-exported; the viewer tooling was not available to the delivery agent.
- `[skills.ki-delegation]` and `[skills.ki-pmo]` on the other Capitals belong to Wave F; `ki repo audit --skill ki-pmo` refuses a declaration whose `ki-delegation` dependency is undeclared.
- Deploying `output-styles/ki-coordinator.md` to `~/.claude/output-styles/` belongs to the user-environment manager.
- KI-HARNESS-GOV-175 and KI-HARNESS-GOV-180 cite `ki-delegation`'s former thread sections and are re-pointed to `ki-pmo` by their own deliveries.
- Biome warns on one non-null assertion in `skills/change-management/ki-pmo/scripts/rubric/contexts/pmo.test.ts`; a warning, not a gate.

### Post-change review

The one full `bun run test` invocation in the primary checkout ran for twenty minutes without output while another session's coverage run shared the checkout; the same suite passed in about thirty seconds run by skill group straight afterwards, and the cause was not established. The live `ki-principal` audit found the rubric-family outcome bug that the unit tests had not, which is why the fix commit exists. Ready for acceptance.

### Mini recap

Moved the coordinating-thread standard out of `ki-delegation` into `ki-pmo`, put the coordinator hook on the declaration signal, shipped the `ki-coordinator` output style and regenerated the derived publications. Learning route, not promoted: a rubric family that merges its context buckets must still route each mechanical item to its own bucket, and a live declaring repository catches that where the harness's own audit cannot.

## Discussion

### Why the hook's signal is the declaration and not the checkpoints folder

A checkpoints folder marks a repository that has had a thread, not one that delegates under this contract. Kris's "HOOK-OWNER - (a)" makes the declaration the signal so that adopting or removing `ki-pmo` turns the reminder on or off with nothing else to configure.

### Why ki-recap carries no optional dependency on ki-pmo

The off-ramp is prose: in a coordinating thread, `ki-recap` hands a recap to `ki-pmo`'s forms, which is Kris's "RECAP-AWARE - (c) ki-recap detects coordinating thread and hands ki-pmo's forms." An `ki-optional-depends-on` edge from `ki-recap` to `ki-pmo` would close an undirected cycle through `ki-batch` and `ki-delegation`, and the skill-graph layout, which lays the dependency graph out as a forest, overflows on a cycle. `ki-recap` is a global process skill with no declaration table, so the edge would also add nothing to activation.
