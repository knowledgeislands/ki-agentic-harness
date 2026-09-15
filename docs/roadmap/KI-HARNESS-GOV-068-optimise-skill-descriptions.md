---
id: KI-HARNESS-GOV-068
area: GOV
title: Optimise Skill Descriptions
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-15T12:11:12Z
updated_at: 2026-09-15T12:32:19Z
---

# Optimise Skill Descriptions

## Goal

Make every Harness skill description earn its standing context cost while preserving reliable implicit selection, clear scope, and essential collision boundaries across the complete skill set.

## Context

The current 60 skill descriptions total 34,852 characters and average 581 characters; the longest three are just over 1,000 characters. The full `ki-skills` audit passes because every description remains within the portable 1,024-character cap and has no exact quoted-trigger collision, but those checks do not establish catalogue-wide efficiency or selection quality.

[Official OpenAI documentation](https://learn.chatgpt.com/docs/build-skills) states that Codex initially loads skill names, descriptions, and paths within at most two per cent of the model context, or 8,000 characters when the context size is unknown. It shortens descriptions first and may omit skills with a warning when the set remains too large. Concise, front-loaded descriptions can therefore preserve more useful routing signal and reduce warnings, although no description-only rewrite can guarantee that every installed skill fits every runtime budget.

## Boundary

This work reviews all canonical Harness descriptions as one selection surface. It does not shorten descriptions to an arbitrary universal length, remove necessary triggers or reciprocal off-ramps, change skill behaviour or ownership, disable implicit invocation, alter runtime loading policy, or claim that a clean mechanical audit proves routing effectiveness. Adoption, planning, implementation, acceptance, publication, and rollout remain separate decisions.

## Current state

All 60 canonical descriptions pass the existing mechanical skill audit, but together occupy 34,852 characters before skill names and Codex paths are counted. Descriptions frequently duplicate activation language, enumerate complete mode or trigger inventories, and carry implementation detail that belongs in the on-demand body. The generated capability catalogue republishes the same standing metadata and must remain exact after any rewrite.

## Steps

- [ ] Rewrite all 60 canonical descriptions by sibling family, front-loading each skill's primary job and realistic trigger.
- [ ] Remove duplicated trigger inventories and move workflow, rubric, and implementation detail out of frontmatter.
- [ ] Preserve essential reciprocal off-ramps and process-skill authority boundaries where adjacent skills genuinely compete.
- [ ] Record the current Codex initial-list budget and its honest optimisation consequence in the Agent Skills standard and source evidence.
- [ ] Regenerate the marker-bounded capability catalogue from canonical frontmatter.
- [ ] Compare before-and-after footprint and longest descriptions, then review close families with representative positive and negative routing prompts.
- [ ] Run the complete skill audit and repository verification gates.

## Files touched

- `skills/**/SKILL.md`
- `skills/keystone/ki-skills/references/standards-agent-skills.md`
- `skills/keystone/ki-skills/references/sources.md`
- `skills/README.md`
- `docs/roadmap/KI-HARNESS-GOV-068-optimise-skill-descriptions.md`

## Verify

Run `ki repo audit --skill ki-skills --repo .`, `ki repo audit --skill ki-repo-harness --repo .`, `bunx tsc --noEmit`, `bun run test`, `bunx biome check`, `bunx rumdl check` on the touched Markdown files, and `git diff --check`. Confirm the generated catalogue is exact and record the before-and-after description inventory plus close-family routing review in the review packet.

## Dependencies / blocks

The work has no unresolved build-order dependency. It depends only on the approved optimisation boundary above and current official OpenAI runtime evidence, both of which are available.

## Documentation impact

### Decision Records

No Decision Record is required because this work applies and sharpens the existing discoverability-per-token standard without changing skill ownership, activation authority, or runtime policy.

### Specifications

The Agent Skills standard gains current Codex initial-list budget guidance; no separate behaviour specification changes.

### Guides

No guide change is needed because selection guidance remains task-oriented and the exact descriptions are already published through the generated catalogue.

### Roadmap

This item records the implementation and review evidence; no follow-on roadmap item is required unless routing review exposes a distinct unresolved collision.

## Discussion

### Optimisation standard

Judge descriptions by discoverability per standing character: front-load the primary use case and trigger words, state what the skill does and when it applies, retain only collision guidance needed to distinguish close neighbours, and move implementation detail or mode inventories into the body. Close sibling families may legitimately remain longer than isolated skills when the extra discriminator prevents misrouting.

### Verification shape

A delivery should retain a before-and-after inventory for character footprint and longest descriptions, run the complete mechanical collision audit, and review every sibling family for semantic overlap. Representative positive and negative prompts should test routing for the closest families rather than treating aggregate character reduction as the sole success measure.

### Runtime outcome

The optimisation can reduce truncation pressure and improve which skills survive a bounded initial listing. Runtime warnings also depend on the number and paths of system, user, repository, and plugin skills, so the honest target is a smaller, clearer Harness contribution rather than a universal no-warning promise.
