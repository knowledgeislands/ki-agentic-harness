---
id: KI-HARNESS-GOV-068
area: GOV
title: Optimise Skill Descriptions
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 5b89ed13ab32c2491634f60422150a8f70150b6d
created_at: 2026-09-15T12:11:12Z
updated_at: 2026-09-15T12:43:40Z
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

- [x] Rewrite all 60 canonical descriptions by sibling family, front-loading each skill's primary job and realistic trigger.
- [x] Remove duplicated trigger inventories and move workflow, rubric, and implementation detail out of frontmatter.
- [x] Preserve essential reciprocal off-ramps and process-skill authority boundaries where adjacent skills genuinely compete.
- [x] Record the current Codex initial-list budget and its honest optimisation consequence in the Agent Skills standard and source evidence.
- [x] Regenerate the marker-bounded capability catalogue from canonical frontmatter.
- [x] Compare before-and-after footprint and longest descriptions, then review close families with representative positive and negative routing prompts.
- [x] Run the complete skill audit and repository verification gates.

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

## Review

### Delivered

From immutable baseline `5b89ed13ab32c2491634f60422150a8f70150b6d`, optimised the complete 60-skill description surface, refreshed the generated capability catalogue, and recorded the current Codex initial-list budget without changing skill behaviour, ownership, or invocation policy. The implementation retained the approved exclusions: no arbitrary universal length cap, no removal of essential sibling boundaries, and no claim that description work can eliminate every runtime warning.

### Summary of changes

Rewrote the `description` frontmatter in all 60 canonical `skills/**/SKILL.md` files around primary capability, realistic activation language, and only material sibling off-ramps. Added the Codex shared-list budget and its interpretation to `standards-agent-skills.md`, refreshed the targeted OpenAI source evidence date in `sources.md`, and regenerated `skills/README.md` from canonical frontmatter. Total description text fell from 34,852 to 17,517 characters, average length from 581 to 292, and the maximum from 1,015 to 348; no description now exceeds 400 characters.

### Verification

- `ki repo audit --skill ki-skills --repo .` — PASS across the complete canonical skill set with no warning or failure.
- `ki repo conform --skill ki-repo-harness --repo .` — regenerated the exact marker-bounded capability catalogue; the final audit confirms publication remains exact.
- `bunx tsc --noEmit && bun run test && bunx biome check` — PASS; 693 tests across 129 files and 571 Biome-checked files.
- `bunx rumdl check` on every touched Markdown file and `git diff --check` — PASS after the final review packet.
- Work-lifecycle prompts distinguish selection (`ki-next`), readiness (`ki-plan`), delivery (`ki-implement`), and closure or pruning (`ki-accept`).
- Documentation prompts distinguish durable rationale (`ki-decision-records`), accepted behaviour (`ki-specs`), practical procedure (`ki-guides`), and future delivery (`ki-work-roadmap`).
- Website prompts distinguish the neutral lifecycle (`ki-repo-website`), Eleventy content sites (`ki-repo-website-content`), React/Vite applications (`ki-repo-website-app`), and Cloudflare hosting (`ki-repo-website-cloudflare`).
- Runtime prompts distinguish portable sources and policies from Claude, Codex, and chezmoi projections across binding, subagent, and tokenomics families.
- Signal and transfer prompts distinguish bounded discovery (`ki-pulse`) from agentic or model radar posture, and trade governance (`ki-trades`) from one-side operation (`ki-trade`) and receiver disposition (`ki-next`).

### Outstanding concerns

No blocking concern remains. The 17,517-character Harness description set still exceeds Codex's 8,000-character fallback before names and paths are counted, so a large combined system, user, repository, and plugin skill set may still produce shortening or omission warnings. Codex exposes no deterministic local selector harness here, so the family routing evidence is a semantic positive-and-negative prompt review rather than a claim about every model or installed-skill combination.

### Post-change review

The goal and approved boundary are met. Every description now states its capability and activation context early, the closest families retain reciprocal ownership cues, the generated catalogue is exact, and no skill behaviour or authority changed. Regression risk is limited to implicit selection wording and is mitigated by complete mechanical audit plus the family routing review; the item is ready for human acceptance.

### Mini recap

Delivered a catalogue-wide metadata optimisation with a 49.7 per cent description-footprint reduction, current Codex budget guidance, exact regenerated publication, and clean repository gates. The remaining runtime-budget caveat is recorded as an expected platform constraint, not follow-on implementation work.

## Discussion

### Optimisation standard

Judge descriptions by discoverability per standing character: front-load the primary use case and trigger words, state what the skill does and when it applies, retain only collision guidance needed to distinguish close neighbours, and move implementation detail or mode inventories into the body. Close sibling families may legitimately remain longer than isolated skills when the extra discriminator prevents misrouting.

### Verification shape

A delivery should retain a before-and-after inventory for character footprint and longest descriptions, run the complete mechanical collision audit, and review every sibling family for semantic overlap. Representative positive and negative prompts should test routing for the closest families rather than treating aggregate character reduction as the sole success measure.

### Runtime outcome

The optimisation can reduce truncation pressure and improve which skills survive a bounded initial listing. Runtime warnings also depend on the number and paths of system, user, repository, and plugin skills, so the honest target is a smaller, clearer Harness contribution rather than a universal no-warning promise.
