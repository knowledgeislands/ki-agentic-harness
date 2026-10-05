---
id: KI-HARNESS-FND-027
area: FND
title: Configure Cloudflare guide path
theme: foundation-tooling
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-25T12:30:00Z
updated_at: 2026-10-05T08:41:49Z
---

# KI-HARNESS-FND-027: Configure Cloudflare guide path

## Goal

A repository can put its Cloudflare hosting guide where its own guide collection belongs, rather than keeping a folder that exists only to satisfy a hardcoded path in this repository's rubric.

## Context

`skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.ts:16` declares `export const GUIDE_PATH = 'docs/guides/developer/cloudflare.md'`, and WCF-26 checks that exact path with no `.ki.toml` override.

`5g-emerge-phase2` flattened `docs/guides/` to a single list under `ki-guides`, because its guide audience is the same for every guide and grouping them only added a folder to guess at. Every guide moved except this one: `docs/guides/developer/cloudflare.md` keeps a `developer/` folder that nothing else uses, solely so WCF-26 passes. That repository recorded the constraint as an outstanding concern on `5GE-P2-GOV-010` and correctly declined to fix it, since the path is not its to change - this record is the hand-over, and it is why that item could be closed for what it delivered.

The interaction with `ki-guides` is the substance of it. Two skills express a view about where a guide lives, one of them by configuration and one by a constant, and the constant wins. A repository that satisfies both is carrying a folder for the rubric rather than for a reader.

## Boundary

In scope: WCF-26 resolving the guide by discovery under the `ki-guides` collection root, `docs/guides/`, with no new `.ki.toml` key; the matching wording in the `ki-repo-website-cloudflare` standard, EDUCATE mode and rubric; and bringing the `ki-repo` REVIEW checklist's guide-placement question into line with `ki-guides`.

Out of scope: whether a Cloudflare guide should be required at all, which WCF-26 settles and this record does not reopen; the grouping policy inside a guide collection, which belongs to `ki-guides`; and the exact-role guide constants in `ki-repo-tools` (`scripts/rubric/items/tool.ts:258`-`:266`, `definition-of-done.md` and `releasing.md`), which are the same shape but have no reported failure and can follow as their own record if one arises. No other `ki-repo-website-*` skill holds a guide-path constant.

## Current state

Verified on `main` at `19651664`. `website-cloudflare.ts:16` exports `GUIDE_PATH`, typed into the context at `:74` and inspected at `:358`-`:359`; WCF-26 (`scripts/rubric/items/wcf.ts:245` onwards) hardcodes the path in its description and both failure messages. The standard (`references/standards-cloudflare-hosting.md:94`, section 6) and `references/mode-educate.md:189` name the exact path. `ki-guides` fixes the collection root as `docs/guides` (`skills/governance/ki-guides/scripts/rubric/contexts/guides.ts:5`, `standards-guides.md:42`) and accepts flat, grouped and mixed collections (`:44`-`:46`). `skills/keystone/ki-repo/references/mode-review.md:233` still asks that every guide lives in an audience subdirectory, contradicting `ki-guides`.

## Steps

- [ ] Replace `GUIDE_PATH` in `website-cloudflare.ts` with a `GUIDES_ROOT = 'docs/guides'` constant and a `DEFAULT_GUIDE_PATH = 'docs/guides/developer/cloudflare.md'` used only for EDUCATE and remediation text. Discover every file named `cloudflare.md` under `docs/guides/`, at any depth. The context's `guide` becomes one of `found` (exactly one, with its path and text), `missing` (none) or `ambiguous` (more than one, with the paths).
- [ ] Update WCF-26 in `wcf.ts`: pass on one non-empty guide; fail on `missing`, empty, or `ambiguous`, naming the paths found; describe the guide as "`cloudflare.md` in the guide collection" rather than an exact path; and keep the default location in the remediation.
- [ ] Add context tests in `website-cloudflare.test.ts` for a flat `docs/guides/cloudflare.md`, the default grouped path, an arbitrary group, none, two copies and an empty file; adjust `items/index.test.ts` for the new messages.
- [ ] Reword section 6 of `standards-cloudflare-hosting.md` and `mode-educate.md:189`: the guide is `cloudflare.md` anywhere in the `ki-guides` collection, placed according to that collection's grouping, and EDUCATE suggests `docs/guides/developer/cloudflare.md` only for a new or grouped collection.
- [ ] Replace `mode-review.md:233` with a question that defers to `ki-guides`: the guide collection's grouping, flat, grouped or mixed, is intentional and makes each guide's audience obvious.
- [ ] Regenerate `references/rubric.md` with `ki dev skill rubric ki-repo-website-cloudflare`.

## Files touched

- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/contexts/website-cloudflare.test.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/items/wcf.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/scripts/rubric/items/index.test.ts`
- `skills/repo-structure/ki-repo-website-cloudflare/references/standards-cloudflare-hosting.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/mode-educate.md`
- `skills/repo-structure/ki-repo-website-cloudflare/references/rubric.md`
- `skills/keystone/ki-repo/references/mode-review.md`

## Verify

1. A fixture with only `docs/guides/cloudflare.md`, non-empty, passes WCF-26; so do `docs/guides/developer/cloudflare.md` and `docs/guides/operator/cloudflare.md`.
2. A fixture with no `cloudflare.md` under `docs/guides/` fails WCF-26; one with two fails as ambiguous and names both paths.
3. `grep -rn "developer/cloudflare" skills/repo-structure/ki-repo-website-cloudflare` matches only the EDUCATE default and remediation text, never a pass condition.
4. No `ki-repo` REVIEW question requires an audience subdirectory; `ki-guides` remains the only owner of grouping policy.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-repo-website-cloudflare --progress never
ki repo audit --skill ki-repo --progress never
```

## Dependencies / blocks

None. Follow-on, non-blocking: once released, tell `5g-emerge-phase2` it may move its guide to `docs/guides/cloudflare.md`; that repository owns the move.

The `ki-repo` `mode-review.md:233` anchor sits outside `Automated verification`, so it is independent of the [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md), [KI-HARNESS-GOV-098](KI-HARNESS-GOV-098-render-every-derived-signal.md), [KI-HARNESS-GOV-123](KI-HARNESS-GOV-123-review-unsettled-source-readings.md), [KI-HARNESS-GOV-124](KI-HARNESS-GOV-124-review-artefact-idempotence.md) and [KI-HARNESS-GOV-135](KI-HARNESS-GOV-135-review-governance-date-provenance.md) batch; [KI-HARNESS-GOV-092](KI-HARNESS-GOV-092-align-generated-normal-forms.md) edits a different anchor in the same file and whichever lands second rebases.

## Documentation impact

### Decision Records

None. Discovery applies the existing `ki-guides` ownership of the collection root; no new boundary is set.

### Specifications

`standards-cloudflare-hosting.md` section 6, `mode-educate.md` and `ki-repo` `mode-review.md`, as above.

### Guides

None in this repository; downstream guides move under their own repositories' authority.

### Roadmap

None.

## Discussion

Resolved below: the guide is discovered anywhere under the collection root. That is the cheapest fix and also the right one, because it stops the rubric having an opinion about grouping that `ki-guides` already owns. An explicit `.ki.toml` key would work but asks every repository to configure a path that could be discovered.

Checked during planning: no other `ki-repo-website-*` context holds a guide-path constant. Had one done so, this is the same one-fact-many-copies shape as `KI-HARNESS-GOV-093` and `KI-HARNESS-GOV-094` rather than a single hardcoded string. The nearest siblings are the exact-role constants in `ki-repo-tools`, left out of scope above.

Noted 2026-10-01: the hardcoded constant is not the only obstacle. The `ki-repo` REVIEW checklist asks at `skills/keystone/ki-repo/references/mode-review.md:233` that every guide under `docs/guides/` lives in an explicit audience subdirectory, such as `user/`, `developer/`, or `agent/`. A flat guide collection fails that question too, so making WCF-26 configurable or glob-based alone would not let `5g-emerge-phase2` flatten its last guide without then failing the checklist. That question contradicts `ki-guides` outright: `skills/governance/ki-guides/references/standards-guides.md:44` says flat, grouped and intentionally mixed collections are all valid, and `:46` says AUDIT emits no finding solely because a guide sits directly below `docs/guides/`. Execution should bring `mode-review.md:233` into line with `ki-guides` alongside WCF-26 rather than fixing the constant in isolation.

- [KI-HARNESS-GOV-094](KI-HARNESS-GOV-094-check-constraint-reach.md) is the same class of defect: a constraint restated in one skill's vendored rubric where another skill owns the fact

### Decision

WCF-26 resolves the guide path through the `ki-guides` collection root by discovery, not a new `.ki.toml` key. Decided by the Fable reviewer under delegated autonomy, reversible. The `.ki.toml` key alternative is not taken.
