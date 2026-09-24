---
id: KI-HARNESS-GOV-083
title: Clarify audience guide grouping
area: GOV
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
transferred_from: ki-website
baseline_ref: 31f2c98e354526162438143fedbd8eafd9d2778c
created_at: 2026-09-21T15:44:00Z
updated_at: 2026-09-24T09:18:00Z
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

Adopted into `Now`, approved as `Ready`, and implemented from the immutable baseline recorded above. The local Harness boundary includes the general `ki-guides` judgment and any specialised Harness skill whose exact role conflicts with it; changes to receiver-owned roadmap records remain owned by those repositories.

The approved policy is advisory: use open-vocabulary audience directories when the collection has stable audience distinctions and grouping improves the route from the index. Root-level guides remain valid for a small collection, shared entry points, or genuinely cross-audience material. The rubric records this as judgment, not as a mechanical path requirement, and CONFORM never relocates authored guides.

## Current state

`standards-guides.md` permitted either arrangement and stated that category names are local information architecture, but its rubric did not explicitly help a reviewer decide when audience grouping improves discovery. The specialised `ki-repo-website-cloudflare` overlay also required its maintainer-facing guide at `docs/guides/cloudflare.md`, bypassing the `developer/` route. A scan of specialised Harness skills found no second exact root-level guide role with the same defect. This repository illustrates the intended mixed shape: `docs/guides/developer/` contains contributor-facing material, while the cross-audience `docs/guides/skills-by-outcome.md` remains at the collection root.

The companion-item inventory has grown from eleven to fourteen records. Several still describe this work as a universal directory requirement; those statements are inconsistent with the approved advisory policy and need correction in their owning repositories.

## Steps

- [x] Amend `standards-guides.md` to recommend audience directories when stable reader groups make the collection easier to navigate, while preserving valid flat and mixed collections.
- [x] State that directory names use an open local vocabulary and that shared entry points or genuinely cross-audience guides may remain at the collection root.
- [x] Extend the existing `ROUTE-2` judgment guidance and fixtures so review assesses audience clarity without claiming a mechanically provable directory rule.
- [x] Make explicit that AUDIT emits no structural finding solely because a guide is flat and CONFORM never moves an authored guide between categories.
- [x] Align the Cloudflare specialised exact role with the maintainer audience route at `docs/guides/developer/cloudflare.md`, including its evidence collector, criterion, fixtures, standard, EDUCATE procedure, and generated rubric.
- [x] Correct the fourteen companion repository items that describe this advisory policy as a universal Harness-wide directory requirement.

## Files touched

- `skills/governance/ki-guides/references/standards-guides.md`
- `skills/governance/ki-guides/references/rubric.md`
- `skills/governance/ki-guides/scripts/rubric/items/routing.ts`
- `skills/governance/ki-guides/scripts/rubric/contexts/guides.test.ts`
- `skills/governance/ki-guides/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/references/mode-educate.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/rubric.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/standards-cloudflare-hosting.md`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.test.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/items/wcf.ts`
- `docs/roadmap/KI-HARNESS-GOV-083-require-audience-guide-directories.md`

## Verify

- Focused fixtures prove that flat, audience-grouped, and intentionally mixed collections remain mechanically valid.
- The rendered rubric tells a reviewer when audience grouping improves discovery without inventing a fixed vocabulary.
- `ki dev skill rubric ki-guides` and `ki dev skill rubric ki-repo-website-cloudflare` report that both committed rubrics are in sync.
- `ki repo audit --skill ki-guides --repo .`, `ki repo audit --skill ki-skills --repo .`, `ki repo audit --skill ki-work-roadmap --repo .`, and `ki repo audit --skill ki-authoring --repo .` pass. The Harness does not declare the Cloudflare repository overlay for self-audit, so its focused fixture supplies the local implementation evidence.
- `bun run test` and `bunx tsc --noEmit` pass.

## Dependencies / blocks

Nothing blocks the local Harness implementation. Fourteen companion items in tool, MCP, specification, application, and website repositories cite it: each stands on its own merits, but their stale universal-requirement wording must be corrected by the owning repository before this item reaches review.

## Documentation impact

### Decision Records

No Decision Record is required because the plan preserves the existing local-information-architecture boundary and clarifies its judgment rather than imposing a new estate-wide taxonomy.

### Specifications

No behaviour-level contract changes to the harness tooling beyond the rubric item itself, which is the mechanical expression of the standard rather than a separate contract.

### Guides

`standards-guides.md` and the reviewer guidance change. No guide is relocated merely to satisfy this item.

### Roadmap

The companion items remain local choices. All fourteen records now state the advisory policy accurately and retain their receiver-owned lifecycle state. No estate-wide structural retrofit or transition period is created.

## Review

### Delivered

Clarified `ki-guides` as an advisory audience-routing judgment, aligned the specialised Cloudflare guide with its developer audience, and corrected all fourteen companion repository records that had described the policy as a universal directory requirement.

### Change Summary

Flat, audience-grouped, and intentionally mixed guide collections remain valid. Reviewers now consider whether stable reader groups make navigation clearer, while CONFORM never relocates authored guides. The fourteen receiver records now justify audience grouping from repository-local readers, and their pre-existing review packets use the current `Change Summary` heading.

### Verification

- The full Harness Bun test suite and TypeScript gate pass.
- `ki-guides`, `ki-skills`, `ki-work-roadmap`, and `ki-authoring` audits pass in the Harness.
- The generated `ki-guides` and `ki-repo-website-cloudflare` rubrics reproduce from source.
- Markdown validation passes across all changed receiver records.
- `ki-work-roadmap` audits pass in all fourteen receiver repositories.

### Outstanding concerns

The companion work items retain their existing local lifecycle states. This correction neither accepts delivered guide collections nor commits draft repositories to a particular audience taxonomy.

### Post-change review

Ready for human review. The policy and every known companion record now agree that audience grouping is evidence-led and repository-local rather than universally required.

### Mini recap

The estate has one coherent guide-grouping policy, one correctly routed Cloudflare guide role, and no known roadmap record claiming a universal audience-directory mandate.

## Discussion

### Policy decision

Audience grouping is recommended, not required. Use it when stable reader groups materially improve navigation. The vocabulary remains open and repository-local. A small collection, shared entry point, or genuinely cross-audience guide may remain at `docs/guides/`; mixed collections are valid.

### Why judgment is the right enforcement

The filesystem can prove that a guide is beneath the governed root, but it cannot prove who its readers are or whether a new path segment improves discovery. A mechanical rule would reward directory shape rather than useful routing. `ROUTE-2` already owns discoverability and correct placement as a judgment concern, so the smallest coherent change is to make the audience question explicit there.

### Companion repository work

The fourteen companion items may still be worthwhile where a local collection mixes clearly distinct audiences. They must stand on that local evidence rather than cite this item as a universal migration requirement. Repositories whose current flat or mixed collection is clear need no change. The Harness scan identified the stale claim; correction remains in each record's owning repository.

### Specialised exact roles

The Cloudflare guide is stable maintainer/developer material, so `ki-repo-website-cloudflare` now requires `docs/guides/developer/cloudflare.md`. Specialised overlays may require exact guide roles, but those roles preserve the locally meaningful audience route rather than bypassing the collection's information architecture. A repository-wide scan found no other specialised skill hard-coding a root-level guide filename.
