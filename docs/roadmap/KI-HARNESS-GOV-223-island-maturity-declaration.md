---
id: KI-HARNESS-GOV-223
area: GOV
title: Island maturity declaration
project: observatory
component: keystone
priority: medium
size: m
kind: deliver
status: draft
horizon: now
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T18:51:40Z
updated_at: 2026-10-20T02:42:00Z
transferred_from: ki-principal ki.observatory CONDITION-TOML, 2026-10-19
---

# KI-HARNESS-GOV-223: Island Maturity Declaration

## Goal

The `ki-repo` standard defines a fixed maturity scale and the `.ki.toml` key in which each island, each repository, declares its own maturity, and a `ki-repo` rubric criterion checks that the key is present and names a level from the scale, so that a reader such as the Observatory takes an island's maturity from its own declaration rather than inferring it.

## Context

Kris Brown gave two answers on 19 October 2026 in the Observatory work, logged in the [Observatory decisions log](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/+/_WORK/ki.observatory/decisions.md). Under STEP3-ANSWERS, condition is not commit age:

> Condition, I'm thinking should not necessarily based on age last commit because that's not something you always see. I think an island ... must declare it's level development, so for example, on Snowden Island is fairly well settled. me, will end up thriving what needs do. ... I think should level maturity reflects is, and then there's something falls into decline or ruin be scale again something needs stored somewhere I don't know where would be. But some kind of quality measure.

Under CONDITION-TOML, the home:

> I agree condition home should stated in its ki.toml. Of course, makes subjective, but hey, that's fine.

Read back as taken: each island declares its maturity in `.ki.toml` from a fixed scale the `ki-repo` standard defines; decline or ruin comes from `ki repo audit` health, not from a declaration; handoff records go to this harness and to tools-ki.

Kris chose the scale on 19 October 2026 under MATURITY-FOUR: "I agree with the maturity scale." It is read back as taken in the decisions log as MATURITY-SCALE a). The scale, lowest first:

- `founding` - the island is being established; its contract and purpose are still forming;
- `growing` - in active development towards what it is for;
- `settled` - established and doing what it is for, with work continuing;
- `thriving` - settled and doing what it needs to, however long since its last commit.

The scale is ordinal and declared, so it is subjective by design, as Kris accepted. It carries no score or percentage, and decline or ruin is never one of its levels.

## Boundary

- In: the scale's names, order and one-line meanings in the `ki-repo` configuration standard; the key, proposed as `maturity` in `[skills.ki-repo]`; a rubric criterion that warns when the key is absent and fails when it names a level outside the scale; its fixture tests; the rubric publication.
- In: stating in the standard that decline or ruin is read from `ki repo audit` health, with the audit outcome that maps to each, so the declared and the derived signals stay apart.
- Out: declaring a level in any repository's `.ki.toml`, which each repository does for itself once the key exists; the `ki` reader that exposes the declaration and the health, which tools-ki owns; the Observatory views that draw them, which apps-observatory.local owns.

## Current state

Checked on 20 October 2026 at `30cbbd1d`. No `ki-repo` standard, rubric item or `.ki.toml` names a maturity key or scale. The `[skills.ki-repo]` keys are documented in `skills/keystone/ki-repo/references/standards-repository.md`, for example Repository kind and Visibility, with the file-level contract in `references/standards-configuration.md`. Each key's mechanical checks are emitted as evidence findings by `scripts/rubric/contexts/audit.ts`, as `KIND-1` and `VIS-1` are, and published through item files under `scripts/rubric/items/` such as `kind.ts` and `visibility.ts`. The tools-ki reader is [KI-TOOL-KI-CLI-159](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-159-island-maturity-and-health.md), at Soon and draft.

## Steps

- [ ] Settle the three open questions under Discussion with the owner (see Dependencies / blocks).
- [ ] Add an Island maturity section to `references/standards-repository.md`: the four levels in order with their one-line meanings, the key and its table, that the level is declared and subjective by design, and that decline and ruin are read from `ki repo audit` health with the mapping settled at planning.
- [ ] Parse the key in `scripts/rubric/contexts/audit.ts` and emit a new `MATURITY-1` evidence finding: WARN when the key is absent, FAIL when it names a level outside the scale or is not a string.
- [ ] Add `scripts/rubric/items/maturity.ts` declaring MATURITY-1 at FAIL with `overrideLevels: ['WARN']`, register it in `index.ts`, and cover it in `index.test.ts`.
- [ ] Add fixture tests for absent, valid and invalid values in the context tests.
- [ ] Add the key, commented, to `KI_REPO_DEFAULT` in `audit.ts`, the authoritative key list `--educate` writes, so that the default block proposes no level on a repository's behalf.
- [ ] Regenerate `references/rubric.md` and the remediation-inventory counts.

## Files touched

- `skills/keystone/ki-repo/references/standards-repository.md` and `rubric.md`
- `skills/keystone/ki-repo/scripts/rubric/contexts/audit.ts`, `repository.ts` if the evidence code needs listing, and their tests
- `skills/keystone/ki-repo/scripts/rubric/items/maturity.ts`, `index.ts` and `index.test.ts`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts`

## Verify

- `bun run test` and `bunx tsc --noEmit` pass.
- `ki dev skill rubric ki-repo` leaves no diff.
- `ki repo audit --skill ki-repo` here reports MATURITY-1 as a warning until this repository declares a level, and a fixture declaring `maturity = "ruined"` fails it.

## Dependencies / blocks

Blocks the tools-ki work that exposes each island's declared maturity and its audit-derived health through `ki`, since that reader needs the key and scale this record defines.

Decided on 20 October 2026 under PLANNED-READY a), as recommended, except where marked open:

- Key home: `maturity` in `[skills.ki-repo]`, because `[repo]` holds only harness resolution and `ki-repo` owns the island's identity keys; the alternative is `[repo]`.
- Retired islands: no level of their own; an archived repository is read from its GitHub archived state and audit health.
- Decline and ruin: ruin for failing criteria or an audit that cannot run; decline for open warnings older than a tolerance the standard names. Still open: the tolerance has no value, and `ki repo audit` keeps no history from which a warning's age could be read, so the decline rule needs an owner answer before Ready.

The `MATURITY` family name assumes no other `ki-repo` family uses it; `scripts/rubric/items/index.ts` confirms the codes in use.

## Documentation impact

### Decision Records

None needed: the owner's CONDITION-TOML and MATURITY-FOUR answers are recorded in the Observatory decisions log, and the scale lives in the standard.

### Specifications

None: no Specification covers `.ki.toml` keys.

### Guides

None: no guide in this repository describes `.ki.toml` keys.

### Roadmap

Unblocks [KI-TOOL-KI-CLI-159](/Users/krisbrown/workspaces/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-159-island-maturity-and-health.md); each repository declares its own level afterwards, with no record here.

The Observatory draws both signals in apps-observatory.local, in [KI-OBSERVA-BCN-008](https://github.com/knowledgeislands/apps-observatory.local/blob/80c1a1b0faaf05e025ed37a8c8fdd6c9e62d9fbf/docs/roadmap/KI-OBSERVA-BCN-008-beacon-signal-anatomy.md) for the Beacon's condition chips and [KI-OBSERVA-VIS-030](https://github.com/knowledgeislands/apps-observatory.local/blob/934da9c9d3659fcccb3f0b07577363cc819761b7/docs/roadmap/KI-OBSERVA-VIS-030-known-lands-chart.md) for the Known Lands chart, each linked at a fixed revision so the link survives pruning. Both draw condition as unknown until the key exists, so nothing there is blocked by build order.

## Discussion

Open for planning: whether the key sits in `[skills.ki-repo]` or `[repo]`; whether an archived or retired island needs a level of its own or is read from audit health alone; and which `ki repo audit` outcome maps to decline and which to ruin, for example decline for open warnings past a tolerance and ruin for failing criteria or an audit that cannot run. The harness owns priority and design.

### Planning answers, 20 October 2026

Kris Brown answered PLANNED-READY on 20 October 2026 in the ways-of-working decisions log, "owner answers on the 03:08 BST send": "the old do need to move to Ready if possible, and we need to move them", taken as a): take the listed answers and mark each record Ready where the readiness checks pass. Two of the three decisions are recorded under Dependencies / blocks. The record stays a draft: the decline rule needs a tolerance and a source for a warning's age, which no listed answer gives.
