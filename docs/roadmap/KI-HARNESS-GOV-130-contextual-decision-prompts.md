---
id: KI-HARNESS-GOV-130
area: GOV
title: Contextual decision prompts
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: 3d62e65cfd0667504fef131a1f5c7791cc922efc
created_at: 2026-10-03T02:56:47Z
updated_at: 2026-10-03T03:26:16Z
---

# Contextual decision prompts

## Goal

When a KI workflow needs an owner decision about a work item, the question gives enough context to decide, links directly to the canonical item when the interface supports it, and presents a recommended response with a short reason.

## Context

During review of `KI-TOOL-CLI-100`, the owner asked for decision questions through the available ask-user-questions interface so the item is one click away and the preferred answer is easy to select. The prior question put context and a recommendation in prose, but did not use that interface or include a clickable item link. This is reusable interaction guidance for KI process skills, especially selection and readiness decisions in `ki-next` and `ki-plan`, rather than a change to the `ki` executable.

## Boundary

In scope: decide where the shared question pattern belongs, identify the KI decision points that should use it, and show concise context, a canonical item link, and a justified recommended option in runtime-appropriate question examples. Preserve the need for explicit owner approval at governed transitions. Out of scope: changing roadmap lifecycle authority, silently submitting a preselected answer, requiring a question tool when the runtime lacks one, or assuming every question interface renders Markdown links.

## Current state

`ki-next` requires explicit decisions but does not specify how to ask them. `ki-plan` asks for a canonical link in prose but gives no question-tool pattern. `ki-accept` and `ki-batch` also seek owner decisions. The owner approved direct delivery of this guidance on 2026-10-03, including adoption into Now and preparation for implementation.

## Steps

- [x] Add concise decision-question guidance to the relevant `ki-next`, `ki-plan`, and `ki-accept` procedures, and cover batch approval where it presents a set of work items.
- [x] Require the choice, essential state and consequence, canonical item link where the interface supports it, and a reasoned recommended option; define a prose fallback and preserve explicit approval.
- [x] Review wording across the process skills and run the skill, roadmap, and Markdown checks.

## Files touched

The relevant procedure files under `skills/change-management/ki-next/`, `ki-plan/`, `ki-accept/`, and `ki-batch/`, plus this work record.

## Verify

Run `ki repo audit --skill ki-skills`, `ki repo audit --skill ki-work-roadmap`, and `ki repo audit --skill ki-authoring` for this repository; inspect the four procedures for consistent wording and valid links.

## Dependencies / blocks

No build dependency. Use each runtime's available question interface and keep a prose fallback; do not rely on unverified Markdown rendering inside a question widget.

## Documentation impact

### Decision Records

No decision record: this clarifies presentation of existing owner decisions without changing their authority.

### Specifications

No behavior-level specification change: the work concerns agent-facing process guidance.

### Guides

The process-skill procedures are the canonical guidance; no separate user guide is needed.

### Roadmap

Update this record with delivery and review evidence; leave unrelated work items unchanged.

## Review

### Delivered

The approved guidance now covers owner decisions in `ki-next`, `ki-plan`, `ki-accept`, and reviewed-item `ki-batch`. Each uses an available structured question interface, provides the item context and link where supported, offers a reasoned recommendation, and keeps explicit approval authoritative. The immutable starting baseline was `3d62e65cfd0667504fef131a1f5c7791cc922efc`; delivery is commit `83fae45d3b8195f71ed6ff21ff3703579269708f`.

### Change Summary

Updated the four process procedures under `skills/change-management/` with decision-specific question content and a prose fallback. Batch outcome authority remains governed by its separate contract. No scope departure was needed.

### Verification

`bunx rumdl check --fix` passed for the four procedure files. `ki repo audit --skill ki-work-roadmap` and `ki repo audit --skill ki-authoring` passed. `ki repo audit --skill ki-skills` had no failures and two existing refresh-cadence warnings for unrelated website skill sources last reviewed in August 2026. The commit hook repeated the Markdown check and skill audit on the staged snapshot.

### Outstanding concerns

No delivery concern within the approved boundary. Question interfaces may differ in link rendering; the guidance requires an adjacent prose link when the question cannot render one.

### Post-change review

The guidance meets the requested decision context, quick item access, and recommended response without changing approval authority. Changes are limited to four process procedures and their review record; the documentation-only change has low regression risk and is ready for owner review.

### Mini recap

Delivered and verified contextual decision prompts across the single-item and reviewed batch decisions. The rendering fallback remains part of the guidance. No further item-scoped work or learning route is proposed.

## Discussion

### Link and answer presentation

Check whether each supported question interface renders a clickable local file or repository URL before specifying link syntax. Where it cannot, provide the canonical item identifier and a usable link in adjacent prose. Put the recommendation in the selectable response itself, with its reason in the option description where supported, so the owner can decide without reconstructing the rationale from earlier messages.

### Scope of the pattern

Start with work-item decisions that require an explicit owner answer, such as promotion to Next and Ready approval. Review other KI process skills for the same need before adding duplicate instructions. Keep each question brief enough to scan while giving the concrete state, choice, and consequence.
