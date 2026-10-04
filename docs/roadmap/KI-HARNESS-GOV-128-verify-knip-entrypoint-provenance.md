---
id: KI-HARNESS-GOV-128
area: GOV
title: Verify Knip entrypoint provenance
theme: governance-consistency
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: bc42e6e7146841b32b26cfe6880f650e26de7f5a
created_at: 2026-10-02T05:46:14Z
updated_at: 2026-10-04T11:38:52Z
---

# KI-HARNESS-GOV-128: Verify Knip entrypoint provenance

## Goal

The portable engineering standard requires Knip to inspect authored repository commands and canonical skill scripts, and its audit asks reviewers to verify why each declared entry point is genuinely invoked. An unused file must not be hidden by naming it as an entry point.

## Context

The `ki-engineering` standard expects Knip entries for test, script and evaluation roots that plugins do not discover, but the entry list is trusted input to Knip. A blanket `scripts/*.ts` entry makes every future top-level script appear live. On 2026-10-02, `tools-ki` still excluded `scripts/**` from Knip after its unused D3 vendoring script was removed. Removing that exclusion and including its canonical local `ki-self` scripts exposed an unused type re-export. Several MCP repositories already run `scripts/smoke.ts` from `package.json`, but named that entry only through a broad glob or left Knip to infer it.

Canonical skills also have executable TypeScript under their own `scripts/` trees. The harness Knip config includes those trees through broad entry patterns; repository-local authored skills can sit under `.agents/skills/`, alongside linked managed projections that must stay excluded. A code file's location or entry declaration alone cannot establish use by a package command, a test runner, a skill workflow or the native rubric catalogue.

## Boundary

This item owns the portable `ki-engineering` rule and judgment audit for the provenance of Knip entry points. Each repository owns its actual command and skill invocations; the separately completed top-level script inventory and any remaining repository-specific cleanup do not expand this skill change. Preserve the exclusion of generated or linked skill projections. Do not make operational scripts subject to the product source's 100% Vitest coverage threshold; coverage and reachability answer different questions.

## Current state

The standard names script and evaluation entries but does not require a reviewer to establish a real caller for every entry. `KNIP-2` reviews findings that Knip emits and `KNIP-3` checks published exports; neither can identify a dead script already declared as an entry. The harness configuration still has broad skill-script entry patterns. The user explicitly requested this rule in the canonical skill on 2026-10-02.

## Steps

- [x] State the authored-script and canonical-skill scope, entry-point provenance requirement, and generated-projection exception in the engineering standard and skill guidance.
- [x] Add a Knip judgment item that reviews declared entries and broad globs against supported invocations without treating a passing Knip run as proof of use.
- [x] Regenerate the published rubric, test the new criterion, and verify the skill and repository gates.

## Files touched

`skills/governance/ki-engineering/SKILL.md`, `references/standards-engineering.md`, `scripts/rubric/items/knip.ts`, the generated `references/rubric.md`, focused rubric tests, and this work record.

## Verify

Run the focused `ki-engineering` rubric tests, `bun run test`, `bunx tsc --noEmit`, `ki dev skill rubric ki-engineering`, and `ki repo audit --skill ki-skills`. Confirm the generated rubric states the new judgment criterion and the work-item audit passes.

## Dependencies / blocks

The user's explicit request authorises this portable rule. Existing top-level script config changes and the canonical `ki-self` example provide evidence; no repository-specific cleanup blocks the skill change.

## Documentation impact

### Decision Records

No new decision record is needed; this makes the already chosen Knip quality gate honest about its entry declarations.

### Specifications

The engineering standard gains the accepted provenance rule; no product behaviour contract changes.

### Guides

The skill guidance and generated rubric explain how reviewers apply the rule.

### Roadmap

This record carries delivery and review evidence. Repository-specific findings remain with their owners.

## Review

### Delivered

The portable Knip provenance rule and judgment audit were added within the approved skill boundary from baseline `bc42e6e7146841b32b26cfe6880f650e26de7f5a`. Generated and linked skill projections remain excluded, and operational scripts remain outside the product-source coverage threshold.

### Change Summary

The engineering standard and `SKILL.md` now name real-caller evidence for repository and canonical skill scripts. `KNIP-4` asks a reviewer to check each declared entry and broad pattern against supported invocations; the generated rubric and catalogue count tests were updated. The criterion is judgment-only because Knip cannot establish a caller merely from its entry configuration.

### Verification

`bun run test` passed (851 tests); `bunx tsc --noEmit`, `ki dev skill rubric ki-engineering`, focused `ki repo audit --skill ki-skills` and `ki repo audit --skill ki-engineering`, and `rumdl check` on the changed Markdown all passed. The focused engineering and remediation-inventory tests passed after updating their criterion counts.

### Outstanding concerns

The existing broad skill-script entry patterns in the harness Knip configuration still need a repository-specific provenance review under the new criterion. This delivery establishes the portable rule and does not claim that every current entry has already passed human judgment.

### Post-change review

The rule distinguishes authored code from managed projections and real invocations from Knip declarations. No automatic audit result claims that a declared entry is live. The generated rubric matches its authored catalogue.

### Mini recap

The engineering skill now carries the entry-point provenance standard and review question. Verification passed; repository-specific entry reviews remain with their owners.

## Done

Accepted 2026-10-04 on the review packet above, under the owner's delegated estate-push authority following an independent Fable review verdict of ACCEPT. The reviewer re-ran the gates at HEAD (852 tests pass, tsc clean, ki-engineering rubric in sync, focused audits PASS); the harness's own broad skill-script globs remain a repository-specific review under the new KNIP-4 criterion, as the Outstanding concerns record.

## Discussion

### Entry-point evidence

Review every explicit Knip entry and broad entry pattern against a real caller: a package command, published executable, configured test runner, documented skill operation, native catalogue loader or another supported invocation. Prefer named entries where a glob would automatically bless unrelated future files. Include top-level `scripts/` and canonical skill scripts in Knip's project scope so unreferenced files and exports remain visible. Where a workflow invokes a file outside static imports, record that evidence close to its entry declaration or in the audit result.

### Review outcome

Add a judgment criterion to the `ki-engineering` audit that distinguishes verified, uncertain and obsolete entry declarations. A mechanically passing Knip run does not clear uncertain provenance. Remove obsolete entries and code only after checking whether a supported external or skill workflow calls them; do not invent a caller solely to silence Knip. Keep this concern distinct from the dependency-direction rollout in [KI-HARNESS-GOV-127](KI-HARNESS-GOV-127-adopt-dependency-cruiser-estatewide.md).
