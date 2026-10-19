---
id: KI-HARNESS-GOV-223
area: GOV
title: Island maturity declaration
project: observatory
component: keystone
priority: medium
size: m
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-19T18:51:40Z
updated_at: 2026-10-19T18:51:40Z
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

Proposed scale, drafted from Kris's words "settled" and "thriving" and awaiting Kris's choice of names, lowest first:

- `founding` - the island is being established; its contract and purpose are still forming;
- `growing` - in active development towards what it is for;
- `settled` - established and doing what it is for, with work continuing;
- `thriving` - settled and doing what it needs to, however long since its last commit.

The scale is ordinal and declared, so it is subjective by design, as Kris accepted. It carries no score or percentage, and decline or ruin is never one of its levels.

## Boundary

- In: the scale's names, order and one-line meanings in the `ki-repo` configuration standard; the key, proposed as `maturity` in `[skills.ki-repo]`; a rubric criterion that warns when the key is absent and fails when it names a level outside the scale; its fixture tests; the rubric publication.
- In: stating in the standard that decline or ruin is read from `ki repo audit` health, with the audit outcome that maps to each, so the declared and the derived signals stay apart.
- Out: declaring a level in any repository's `.ki.toml`, which each repository does for itself once the key exists; the `ki` reader that exposes the declaration and the health, which tools-ki owns; the Observatory views that draw them, which apps-observatory.local owns.

## Dependencies / blocks

Blocks the tools-ki work that exposes each island's declared maturity and its audit-derived health through `ki`, since that reader needs the key and scale this record defines.

The Observatory draws both signals in apps-observatory.local, in [KI-OBSERVA-BCN-008](https://github.com/knowledgeislands/apps-observatory.local/blob/80c1a1b0faaf05e025ed37a8c8fdd6c9e62d9fbf/docs/roadmap/KI-OBSERVA-BCN-008-beacon-signal-anatomy.md) for the Beacon's condition chips and [KI-OBSERVA-VIS-030](https://github.com/knowledgeislands/apps-observatory.local/blob/934da9c9d3659fcccb3f0b07577363cc819761b7/docs/roadmap/KI-OBSERVA-VIS-030-known-lands-chart.md) for the Known Lands chart, each linked at a fixed revision so the link survives pruning. Both draw condition as unknown until the key exists, so nothing there is blocked by build order.

## Discussion

Open for planning: the scale's names, which Kris chooses; whether the key sits in `[skills.ki-repo]` or `[repo]`; whether an archived or retired island needs a level of its own or is read from audit health alone; and which `ki repo audit` outcome maps to decline and which to ruin, for example decline for open warnings past a tolerance and ruin for failing criteria or an audit that cannot run. The harness owns priority and design.
