---
id: KI-HARNESS-RTP-016
area: RTP
title: Retire Claude plugin projection
theme: runtime-portability
horizon: now
status: done
blocks: []
blocked_by: []
baseline_ref: c19e358d5f8cbd8cb3b45a664507309f43fbb3dd
created_at: 2026-10-05T10:40:00Z
updated_at: 2026-10-05T11:14:22Z
---

# KI-HARNESS-RTP-016: Retire Claude plugin projection

## Goal

The harness carries no generator, shape skill, Cowork enablement or live reference for the retired `ki-plugins` marketplace, and its decisions state the replacement distribution routes.

## Context

On 2026-10-05 Kris decided to retire `knowledgeislands/ki-plugins`: "lets just get rid of it, its 1 less thing to think about". The `ki` CLI is the main installer, and `npx skills add knowledgeislands/ki-agentic-harness -s <skill> -a <agent>` is the quick skills-only route for people outside Knowledge Islands. The `ki-plugins` README now carries a retirement notice, the GitHub repository is archived, and it is removed from the machine registry.

The ki-plugins README, CLAUDE and [KI-HARNESS-GOV-093](KI-HARNESS-GOV-093-keep-plugin-projection-current.md) cited `ADR-KI-HARNESS-005` for the projection; the owning decision is [ADR-KI-HARNESS-002](../decisions/ADR-KI-HARNESS-002-the-ki-naming-model-and-harness-as-source-vs-plugin-as-projection.md).

## Boundary

In scope: a new architecture decision recording the retirement and narrowing ADR-KI-HARNESS-002 in place; deleting the plugin builder, its tests and package script; deleting `ki-binding-claude`'s Cowork plugin registration evidence (`CLAUDEBIND-2`) and rebuild instructions; retiring the `ki-repo-plugins` skill and its `ki-repo` detection, shape, eval and catalogue entries; the `ki-plugins` trade route; closing GOV-093 as superseded; parking [KI-HARNESS-RTP-002](KI-HARNESS-RTP-002-reach-cowork-mcp-servers.md); and recording how the five governance agents reach Claude.

Out of scope: deleting the `ki-plugins` repository or local checkout; changes in `tools-ki` (shape list and test) and `ki-website` (skill catalogue), which are receiver-owned handoffs; generic Cowork mentions that describe Cowork as a Claude surface rather than the KI plugin (`ki-housekeeping-claude`, `ki-skills`, `ki-repo-mcp`, `ki-binding` ownership wording); the shared record `GDR-KI-FUNDAMENTALS-001`, whose `ki-plugins` clause is amended identically in every copy with Arcadia's enactment record; and projecting subagents into `.claude/agents`, which belongs to `tools-ki`.

## Current state

Verified on `main` at `a7b6f491`. `skills/environment/ki-binding-claude/scripts/build-plugin.ts` and `build-plugin.test.ts` exist; `package.json` declares `ki:binding:claude:build-plugin`; `items/index.ts` claims it as the skill's only package script. `contexts/claude.ts` reads Cowork settings for `knowledge-islands@ki-repo-plugins` from `knowledgeislands/ki-plugins`, reported by `CLAUDEBIND-2`. `skills/repo-structure/ki-repo-plugins/` is the plugin-marketplace shape; no estate repository other than `ki-plugins` declares it or carries `.claude-plugin/marketplace.json`. `.ki.toml` declares a trade route to `knowledgeislands/ki-plugins`. The five agents under `subagents/governance/` reached Claude only through the plugin: `tools-ki` acquires `subagents/` and its Claude Code descriptor names `.claude/agents`, but nothing projects agents there, and `~/.claude/agents` holds no KI agent.

## Steps

- [x] Write `ADR-KI-HARNESS-015` (retire the Claude plugin projection), narrow ADR-KI-HARNESS-002 in place, and index the new record.
- [x] Delete `build-plugin.ts`, `build-plugin.test.ts` and the `ki:binding:claude:build-plugin` script; drop the `packageScripts` claim and its test expectation.
- [x] Remove Cowork plugin registration from `ki-binding-claude`: the Cowork context fields and constants in `contexts/claude.ts`, `CLAUDEBIND-2` and its test, the Cowork paragraphs in `standards-claude-binding.md`, the `CW` and `PL` source rows, and the Cowork wording in `SKILL.md`; regenerate `references/rubric.md`.
- [x] Retire `ki-repo-plugins`: delete the skill directory and `evals/scenarios/ki-repo-plugins.ts`; remove it from `evals/harness.ts`, `ki-repo` `shapes.ts`, the `audit.ts` detector, `ki-repo` `SKILL.md` `ki-detects`, `standards-configuration.md`, `standards-repository.md` and `docs/decisions/references/mode-element-inventory.md`; regenerate `skills/README.md`.
- [x] Remove the `knowledgeislands/ki-plugins` trade route from `.ki.toml` and update `ki-binding` `SKILL.md` ownership wording.
- [x] Close GOV-093 as superseded and repoint GOV-102's and GOV-094's references to it; park RTP-002 with its reason and return trigger.
- [x] Run the verification below.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-015-retire-the-claude-plugin-projection.md`
- `docs/decisions/ADR-KI-HARNESS-002-the-ki-naming-model-and-harness-as-source-vs-plugin-as-projection.md`
- `docs/decisions/README.md`
- `docs/decisions/references/mode-element-inventory.md`
- `docs/roadmap/KI-HARNESS-GOV-093-keep-plugin-projection-current.md`
- `docs/roadmap/KI-HARNESS-GOV-094-check-constraint-reach.md`
- `docs/roadmap/KI-HARNESS-GOV-102-decide-role-record-serialization.md`
- `docs/roadmap/KI-HARNESS-RTP-002-reach-cowork-mcp-servers.md`
- `docs/roadmap/_ISSUES.md`
- `.ki.toml`, `package.json`
- `evals/harness.ts`, `evals/scenarios/ki-repo-plugins.ts`
- `skills/environment/ki-binding-claude/**`, `skills/environment/ki-binding/SKILL.md`
- `skills/repo-structure/ki-repo-plugins/**`
- `skills/keystone/ki-repo/SKILL.md`, `references/standards-configuration.md`, `references/standards-repository.md`, `scripts/rubric/contexts/shapes.ts`, `scripts/rubric/contexts/audit.ts`
- `skills/README.md`, `README.md`
- `skills/keystone/ki-skills/scripts/internal/remediation-inventory.test.ts` (catalogue and criterion counts)
- `skills/repo-structure/ki-repo-mcp/references/standards-cross-surface-enablement.md`, `skills/repo-structure/ki-repo-homebrew-tap/SKILL.md`, `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-existing-estate-onboarding.md`, `skills/governance/ki-authoring/references/sources.md`
- `docs/decisions/GDR-KI-HARNESS-002-public-repos-and-a-declared-license-decoupled-from-visibility.md`, `docs/decisions/GDR-KI-FUNDAMENTALS-001-knowledge-islands-ecosystem-fundamentals.md`

## Verify

1. `grep -rn -E "ki-plugins|build-plugin|ki-repo-plugins|COWORK_" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.delta --exclude-dir=.paperclip-repositories .` returns only ADR-KI-HARNESS-015, the ADR-002 reference to it, this record, the closed GOV-093, the parked RTP-002, the GOV-102 out-of-scope note citing ADR-KI-HARNESS-015, and the `ki-authoring` source note on the retired projection.
2. `ki-binding-claude`'s catalogue lists `CLAUDEBIND-1` and `CLAUDEBIND-J1` only and claims no package script.
3. `ki repo audit --skill ki-repo` no longer detects or accepts the plugin shape, and `skills/README.md` lists no `ki-repo-plugins`.
4. GOV-093 is `done` as superseded; RTP-002 is `parked` with a named return trigger.
5. `bun run test`, `bunx tsc --noEmit` and `bunx biome check .` pass, and `ki repo audit` reports no finding introduced by this change.

```bash
bun run test
bunx tsc --noEmit
bunx biome check .
ki repo audit --progress never
```

## Dependencies / blocks

None locally. Handoffs, non-blocking: `tools-ki` drops `ki-repo-plugins` from `projectShapes` in `src/core/configuration/declaration.ts` and `kind-shape.test.ts`, and may project `subagents/` into `.claude/agents`; `ki-website` refreshes its skill catalogue on the next `sync:skills` and drops the `ki-plugins` project entry. Arcadia's enactment record amends `GDR-KI-FUNDAMENTALS-001` and Known Lands.

## Documentation impact

### Decision Records

New `ADR-KI-HARNESS-015`; `ADR-KI-HARNESS-002` narrowed in place.

### Specifications

`standards-claude-binding.md` loses its Cowork plugin paragraph; `ki-repo` configuration and repository standards drop the plugin shape.

### Guides

None in this repository. The website skills-by-outcome page is a `ki-website` handoff.

### Roadmap

GOV-093 closed as superseded; RTP-002 parked.

## Review

### Delivered

The harness no longer maintains a Claude plugin projection. `ADR-KI-HARNESS-015` records the retirement and narrows `ADR-KI-HARNESS-002`; the plugin builder, its script, the Cowork registration check and the `ki-repo-plugins` shape are removed; GOV-093 is closed as superseded and RTP-002 is parked. The `ki` CLI and `npx skills add` are the distribution routes.

### Change Summary

- Decisions: new `ADR-KI-HARNESS-015`; `ADR-KI-HARNESS-002` narrowed in place; decision index entry 54; `GDR-KI-HARNESS-002` example generalised; `mode-element-inventory.md` row removed; shared `GDR-KI-FUNDAMENTALS-001` plugin-packaging clause removed identically with Arcadia, `ki-specifications`, `ki-website` and `tools-ki`.
- `ki-binding-claude`: `build-plugin.ts`, its test and the `ki:binding:claude:build-plugin` script deleted; `CLAUDEBIND-2`, Cowork context fields and constants, `packageScripts`, `[CW]` and `[PL]` sources and the Cowork wording removed; `references/rubric.md` updated to match.
- `ki-repo-plugins`: skill directory and eval scenario deleted; detection removed from `ki-repo` (`shapes.ts`, `audit.ts`, `SKILL.md`, configuration and repository standards); `skills/README.md` and root `README.md` counts now 60 skills and 50 governance skills.
- Peer wording: `ki-binding`, `ki-repo-homebrew-tap`, Paperclip onboarding, `ki-authoring` sources and the `ki-repo-mcp` cross-surface standard no longer present a KI Cowork plugin as live.
- Roadmap: GOV-093 done as superseded; GOV-094 and GOV-102 repointed; RTP-002 parked with return trigger; `_ISSUES.md` RTP high-water mark 016; `.ki.toml` trade route removed.

### Verification

- `bunx tsc --noEmit`: pass.
- `bun run test` after rebasing onto `09ed013e`: 833 pass, 7 fail, all 5-second or 10-second timeouts in `ki-repo`'s `repository.test.ts` under machine load averages of 12 to 17. Rerun with `--timeout 60000`, the `contexts/` directory passes 74 of 75; the remaining test hard-codes a 10-second limit, makes six audit calls of about 3.8 seconds each, and fails identically on unmodified `main`, as already recorded in GOV-137. The remediation-inventory counts were updated for the removed catalogue (50 catalogues, 722 criteria, 375 report-only).
- The Verify `grep` returns only the expected decision, roadmap and historical references.
- `bunx tsc --noEmit` and `bunx biome check .`: pass.
- Harness `ki repo audit --progress never` in the integration worktree: no finding from this change. The remaining failures are worktree-environment noise (RUNTIMES-2, ROUTE-1 and REPO-REG-1, because the worktree path is not the registered checkout) and the pre-existing GOV-137 ITEM-3 body-shape finding introduced by `710a65f3`, which belongs to that record's owner.
- `ki repo audit` passes in Arcadia, `ki-specifications`, `ki-website` and `tools-ki`.

### Outstanding concerns

- The five governance agents in `subagents/governance/` now reach Claude only by explicit copy or link until `tools-ki` projects `subagents/` into `.claude/agents` (handoff).
- `ki-website` `skillCatalogue.json5` and `skills.md` are ref-pinned snapshots and still list `ki-repo-plugins` until the next `sync:skills` refresh.
- `ki-binding-claude/references/rubric.md` was edited by hand because `ki dev skill rubric --write` needs a dev-linked install; the next regeneration should produce the same text.
- The load-sensitive `repository.test.ts` timeouts predate this item and remain with the follow-up suggested under [KI-HARNESS-GOV-137](KI-HARNESS-GOV-137-forbid-dependabot-auto-merge.md).

### Post-change review

Independent Fable review judged the `ki-repo-plugins` retirement reversible and low-risk. Generic Cowork mentions that describe Cowork as a Claude surface (`ki-housekeeping-claude`, `ki-skills` portability, evals) were deliberately left.

### Mini recap

The plugin projection, its builder and its repository shape are gone; one distribution surface fewer, with the CLI and `npx skills add` covering installation.

## Done

Accepted 2026-10-05 by Fable reviewer under Kris's delegated authority on the review packet above.

## Discussion

### Decision

Retire `ki-repo-plugins` rather than generalise it. Thirteen of its sixteen rubric items are specific to the KI projection, its CONFORM and EDUCATE modes run the deleted builder, and no other repository has the shape. Decided by the Fable reviewer under delegated autonomy; reversible because Git history keeps the skill and reinstating it is additive.

### Governance agents

The five governance agents (`ki-decision-author`, `ki-engineering-lead`, `ki-repo-kb-curator`, `ki-repo-kb-streams-curator`, `ki-skills-lead`) reached Claude only through the plugin, and the plugin was paused and not enabled locally. After retirement they reach Claude only by explicit copy or link from a harness checkout. The durable route is for the `ki` CLI to project `subagents/` into `.claude/agents`, which its Claude Code descriptor already names; that is `tools-ki` work.
