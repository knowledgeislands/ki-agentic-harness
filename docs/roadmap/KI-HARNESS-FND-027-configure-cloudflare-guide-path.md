---
id: KI-HARNESS-FND-027
area: FND
title: Configure Cloudflare guide path
theme: foundation-tooling
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T12:30:00Z
updated_at: 2026-09-25T12:30:00Z
---

# KI-HARNESS-FND-027: Configure Cloudflare guide path

## Goal

A repository can put its Cloudflare hosting guide where its own guide collection belongs, rather than keeping a folder that exists only to satisfy a hardcoded path in this repository's rubric.

## Context

`skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.ts:16` declares `export const GUIDE_PATH = 'docs/guides/developer/cloudflare.md'`, and WCF-26 checks that exact path with no `.ki.toml` override.

`5g-emerge-phase2` flattened `docs/guides/` to a single list under `ki-guides`, because its guide audience is the same for every guide and grouping them only added a folder to guess at. Every guide moved except this one: `docs/guides/developer/cloudflare.md` keeps a `developer/` folder that nothing else uses, solely so WCF-26 passes. That repository recorded the constraint as an outstanding concern on `5GE-P2-GOV-010` and correctly declined to fix it, since the path is not its to change — this record is the hand-over, and it is why that item could be closed for what it delivered.

The interaction with `ki-guides` is the substance of it. Two skills express a view about where a guide lives, one of them by configuration and one by a constant, and the constant wins. A repository that satisfies both is carrying a folder for the rubric rather than for a reader.

## Boundary

In scope: how WCF-26 resolves the guide path — a `.ki.toml` key, a glob over the guide collection, or discovery through whatever `ki-guides` already knows about the collection's root.

Out of scope: whether a Cloudflare guide should be required at all, which WCF-26 settles and this record does not reopen; and the grouping policy inside a guide collection, which belongs to `ki-guides`.

## Discussion

The cheapest fix is a glob — accept the guide anywhere under the declared guide collection — and it is probably also the right one, because it stops the rubric having an opinion about grouping that `ki-guides` already owns. An explicit `.ki.toml` key would work but asks every repository to configure a path that could be discovered.

Worth checking during execution whether other `ki-repo-website-*` contexts hold sibling constants. If they do, this is the same one-fact-many-copies shape as `KI-HARNESS-GOV-093` and `KI-HARNESS-GOV-094` rather than a single hardcoded string, and the fix should be uniform across them.

- [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is the same class of defect: a constraint restated in one skill's vendored rubric where another skill owns the fact
