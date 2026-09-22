---
id: KI-HARNESS-GOV-083
title: Clarify audience guide grouping
area: GOV
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
transferred_from: ki-website
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-22T06:31:00Z
---

## Goal

`ki-guides` recommends audience directories when they materially improve navigation, while keeping small and genuinely cross-audience collections clear without imposing a universal taxonomy.

## Context

`standards-guides.md` currently permits either arrangement: a guide "may live directly under the root in a small collection, or below a meaningful concern or audience directory (`developer/`, `operations/`, `release/`)", and it states plainly that "category names are local information architecture, not a KI-wide taxonomy". The rubric follows that — `GUIDE-1`, `GUIDE-2`, and `GUIDE-3` check the root, the index, and one H1 per guide; `ROUTE-1` and `ROUTE-2` check boundaries and judgment. Nothing checks audience grouping, because nothing requires it.

The estate has already voted with its feet, unevenly. `tools-ki`, `tools-mgit`, and `tools-git-almanac` all split `user/` and `developer/`. `mcp-acquire-whatsapp` splits `developer/` and `operator/`. `ki-website` was flat until today. Six `mcp-*` repositories have no `docs/guides/` at all and hold their practical material in the README. Where the split exists it was a local choice, so a reader moving between repositories cannot rely on it.

Audience grouping is useful when a collection serves stable, distinct readers: contributor mechanics, operator procedures, and end-user instructions otherwise become interleaved. The standard already recognises that useful shape by routing a retired `docs/developer/` root to `docs/guides/developer/`.

A universal requirement would be counterproductive. A collection with only a few guides gains a path segment without gaining clarity, and a guide serving several audiences would need an artificial category. Directory names also reflect the local product and operating model, so a fixed KI-wide vocabulary would turn useful information architecture into a compliance taxonomy.

Raised from `ki-website`, which has grouped its own collection under `developer/` and has opened companion items in ten tool and MCP repositories asking them to do the same. Those items cite this one; if it is declined, they stand on their own merits and should say so.

## Boundary

Adopted into `Now` by explicit approval, so this is prioritised work rather than intake. It remains `status: draft`: `ki-plan` shapes it to `Ready` before any implementation.

The approved policy is advisory: use open-vocabulary audience directories when the collection has stable audience distinctions and grouping improves the route from the index. Root-level guides remain valid for a small collection, shared entry points, or genuinely cross-audience material. The rubric records this as judgment, not as a mechanical path requirement, and CONFORM never relocates authored guides.

## Current state

`standards-guides.md` permits either arrangement and states that category names are local information architecture. The rubric checks structure and routing but does not explicitly help a reviewer decide when audience grouping improves discovery. This repository illustrates the intended mixed shape: `docs/guides/developer/` contains contributor-facing material, while the cross-audience `docs/guides/skills-by-outcome.md` remains at the collection root.

## Steps

- [ ] Amend `standards-guides.md` to recommend audience directories when stable reader groups make the collection easier to navigate, while preserving valid flat and mixed collections.
- [ ] State that directory names use an open local vocabulary and that shared entry points or genuinely cross-audience guides may remain at the collection root.
- [ ] Extend the existing `ROUTE-2` judgment guidance and fixtures so review assesses audience clarity without claiming a mechanically provable directory rule.
- [ ] Make explicit that AUDIT emits no structural finding solely because a guide is flat and CONFORM never moves an authored guide between categories.
- [ ] Review the eleven companion repository items and ensure they describe local information-architecture choices rather than compliance with a Harness-wide requirement.

## Files touched

- `skills/governance/ki-guides/references/standards-guides.md`
- `skills/governance/ki-guides/references/rubric.md`
- `skills/governance/ki-guides/scripts/rubric/items/routing.ts`
- Focused `ki-guides` fixtures
- `docs/roadmap/KI-HARNESS-GOV-083-require-audience-guide-directories.md`

## Verify

- Focused fixtures prove that flat, audience-grouped, and intentionally mixed collections remain mechanically valid.
- The rendered rubric tells a reviewer when audience grouping improves discovery without inventing a fixed vocabulary.
- `ki dev skill rubric ki-guides` reproduces the committed rubric.
- `ki repo audit --skill ki-guides --repo .`, `ki repo audit --skill ki-skills --repo .`, and `ki repo audit --skill ki-work-roadmap --repo .` pass.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

Nothing blocks this. Eleven companion items in the tool, MCP, and website repositories cite it: each stands on its own merits, so they neither block this nor wait on it. If this is declined, they remain valid as local choices and should say so.

## Documentation impact

### Decision Records

No Decision Record is required because the plan preserves the existing local-information-architecture boundary and clarifies its judgment rather than imposing a new estate-wide taxonomy.

### Specifications

No behaviour-level contract changes to the harness tooling beyond the rubric item itself, which is the mechanical expression of the standard rather than a separate contract.

### Guides

`standards-guides.md` and the reviewer guidance change. No guide is relocated merely to satisfy this item.

### Roadmap

The companion items remain local choices. Review them for wording that falsely claims a universal requirement; no estate-wide retrofit or transition period is created.

## Discussion

### Policy decision

Audience grouping is recommended, not required. Use it when stable reader groups materially improve navigation. The vocabulary remains open and repository-local. A small collection, shared entry point, or genuinely cross-audience guide may remain at `docs/guides/`; mixed collections are valid.

### Why judgment is the right enforcement

The filesystem can prove that a guide is beneath the governed root, but it cannot prove who its readers are or whether a new path segment improves discovery. A mechanical rule would reward directory shape rather than useful routing. `ROUTE-2` already owns discoverability and correct placement as a judgment concern, so the smallest coherent change is to make the audience question explicit there.

### Companion repository work

The eleven companion items may still be worthwhile where a local collection mixes clearly distinct audiences. They must stand on that local evidence rather than cite this item as a universal migration requirement. Repositories whose current flat or mixed collection is clear need no change.
