---
id: KI-HARNESS-GOV-130
area: GOV
title: Contextual decision prompts
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-03T02:56:47Z
updated_at: 2026-10-03T02:56:47Z
---

# Contextual decision prompts

## Goal

When a KI workflow needs an owner decision about a work item, the question gives enough context to decide, links directly to the canonical item when the interface supports it, and presents a recommended response with a short reason.

## Context

During review of `KI-TOOL-CLI-100`, the owner asked for decision questions through the available ask-user-questions interface so the item is one click away and the preferred answer is easy to select. The prior question put context and a recommendation in prose, but did not use that interface or include a clickable item link. This is reusable interaction guidance for KI process skills, especially selection and readiness decisions in `ki-next` and `ki-plan`, rather than a change to the `ki` executable.

## Boundary

In scope: decide where the shared question pattern belongs, identify the KI decision points that should use it, and show concise context, a canonical item link, and a justified recommended option in runtime-appropriate question examples. Preserve the need for explicit owner approval at governed transitions. Out of scope: changing roadmap lifecycle authority, silently submitting a preselected answer, requiring a question tool when the runtime lacks one, or assuming every question interface renders Markdown links.

## Discussion

### Link and answer presentation

Check whether each supported question interface renders a clickable local file or repository URL before specifying link syntax. Where it cannot, provide the canonical item identifier and a usable link in adjacent prose. Put the recommendation in the selectable response itself, with its reason in the option description where supported, so the owner can decide without reconstructing the rationale from earlier messages.

### Scope of the pattern

Start with work-item decisions that require an explicit owner answer, such as promotion to Next and Ready approval. Review other KI process skills for the same need before adding duplicate instructions. Keep each question brief enough to scan while giving the concrete state, choice, and consequence.
