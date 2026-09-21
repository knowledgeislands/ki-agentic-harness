---
id: KI-HARNESS-GOV-083
title: Require audience guide directories
area: GOV
theme: governance-consistency
horizon: now
status: draft
blocks: []
blocked_by: []
transferred_from: ki-website
baseline_ref: null
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T16:40:00Z
---

## Goal

`ki-guides` requires a guide collection to be grouped by the audience that reads it, and the rubric checks that grouping mechanically rather than leaving it to local taste.

## Context

`standards-guides.md` currently permits either arrangement: a guide "may live directly under the root in a small collection, or below a meaningful concern or audience directory (`developer/`, `operations/`, `release/`)", and it states plainly that "category names are local information architecture, not a KI-wide taxonomy". The rubric follows that — `GUIDE-1`, `GUIDE-2`, and `GUIDE-3` check the root, the index, and one H1 per guide; `ROUTE-1` and `ROUTE-2` check boundaries and judgment. Nothing checks audience grouping, because nothing requires it.

The estate has already voted with its feet, unevenly. `tools-ki`, `tools-mgit`, and `tools-git-almanac` all split `user/` and `developer/`. `mcp-acquire-whatsapp` splits `developer/` and `operator/`. `ki-website` was flat until today. Six `mcp-*` repositories have no `docs/guides/` at all and hold their practical material in the README. Where the split exists it was a local choice, so a reader moving between repositories cannot rely on it.

The argument for requiring it: a collection index that routes by topic makes the reader work out which documents are meant for them, and the usual failure is that contributor mechanics and user instructions end up interleaved. The standard already half-concedes this — `ROUTE-1` retires `docs/developer/` specifically so contributor material lands at `docs/guides/developer/`, which is an audience directory named as such.

The argument against: `ki-guides` deliberately avoids imposing a KI-wide taxonomy, and a small collection with three documents gains a path segment and nothing else. Whatever this decides, it should decide it for collections of every size rather than carving out an exception that re-creates today's inconsistency.

Raised from `ki-website`, which has grouped its own collection under `developer/` and has opened companion items in ten tool and MCP repositories asking them to do the same. Those items cite this one; if it is declined, they stand on their own merits and should say so.

## Boundary

Adopted into `Now` by explicit approval, so this is prioritised work rather than intake. It remains `status: draft`: `ki-plan` shapes it to `Ready` before any implementation.

If it is accepted, it is a change to the standard and the rubric together — a requirement the rubric cannot check is a preference. Retrofitting every KI repository is a consequence to be weighed here, not a separate problem to discover afterwards.

## Shaping

- Decide whether audience grouping is required, recommended, or left local, and say which for collections of every size.
- If required, settle whether the directory names are an open vocabulary or a fixed set. `user/`, `developer/`, and `operator/` cover what the estate already uses; `operations/` and `release/` appear in the current text.
- Decide what a mixed collection does with a genuinely cross-audience document rather than leaving it to invent a folder.
- Add the rubric item, with its mechanical evidence and a remediation that `ki repo conform` can perform where the move is unambiguous.
- Estimate the retrofit: which repositories change, and whether the audit reports a failure or a warning during a transition.

## Current state

`standards-guides.md` permits either arrangement and states that category names are local information architecture. The rubric follows: `GUIDE-1`, `GUIDE-2`, and `GUIDE-3` check the root, the index, and one H1 per guide, and `ROUTE-1` and `ROUTE-2` check boundaries and judgment. Nothing checks audience grouping. This repository's own collection is the case in point — `docs/guides/developer/` is an audience directory, while `docs/guides/skills-by-outcome.md` sits at the collection root outside any audience.

## Steps

- [ ] Decide whether audience grouping is required, recommended, or left local, and state which for collections of every size.
- [ ] If required, settle whether the directory names are an open vocabulary or a fixed set, and record the reasoning either way.
- [ ] Decide what a genuinely cross-audience document does, so a collection is not left inventing a folder.
- [ ] Amend `standards-guides.md` to state the requirement.
- [ ] Add the rubric item with its mechanical evidence, and a `ki repo conform` remediation where the move is unambiguous.
- [ ] Bring this repository's own collection into conformance, starting with `docs/guides/skills-by-outcome.md`.
- [ ] Estimate the retrofit across the estate and decide whether the audit fails or warns during the transition.

## Files touched

`skills/documentation/ki-guides/references/standards-guides.md`, `skills/documentation/ki-guides/rubric.toml` and `rubric.md`, the conform remediation, and this repository's `docs/guides/`.

## Verify

`ki repo audit --skill ki-guides --repo .` passes here under the amended rubric, and the new rubric item fails a deliberately flat fixture collection and passes a grouped one.

## Dependencies / blocks

Nothing blocks this. Eleven companion items in the tool, MCP, and website repositories cite it: each stands on its own merits, so they neither block this nor wait on it. If this is declined, they remain valid as local choices and should say so.

## Documentation impact

### Decision Records

A decision record is owed if the requirement lands. Tightening an explicitly permissive standard across the estate is a decision with a retrofit cost, and the reasoning for a fixed or open audience vocabulary needs to survive the change.

### Specifications

No behaviour-level contract changes to the harness tooling beyond the rubric item itself, which is the mechanical expression of the standard rather than a separate contract.

### Guides

`standards-guides.md` changes, and this repository's own collection is restructured to conform.

### Roadmap

The companion items in the other repositories are already open. If the requirement lands with a transition period, the horizon of that transition is recorded here rather than left implicit.

## Discussion

Shaping settles the shape of the requirement, not whether to make one. The narrower question first: does `ROUTE-1` retiring `docs/developer/` into `docs/guides/developer/` already commit the standard to audience grouping in everything but name?
