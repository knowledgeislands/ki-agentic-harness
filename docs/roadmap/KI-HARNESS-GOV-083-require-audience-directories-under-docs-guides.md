---
id: KI-HARNESS-GOV-083
area: GOV
title: Require audience directories under docs/guides
theme: governance-consistency
blocks: []
blocked_by: []
transferred_from: ki-website
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-21T16:12:00Z
horizon: now
status: draft
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

## Discussion

Shaping settles the shape of the requirement, not whether to make one. The narrower question first: does `ROUTE-1` retiring `docs/developer/` into `docs/guides/developer/` already commit the standard to audience grouping in everything but name?
