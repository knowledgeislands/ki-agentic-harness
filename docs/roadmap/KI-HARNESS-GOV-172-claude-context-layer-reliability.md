---
id: KI-HARNESS-GOV-172
area: GOV
title: Claude context layer reliability
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-10T16:49:02Z
updated_at: 2026-10-10T16:49:02Z
---

# KI-HARNESS-GOV-172: Claude Context Layer Reliability

## Goal

`ki-tokenomics-claude` explains which Claude context layers load every time and which load only on demand or conditionally, so that an owner places a rule meant to hold every time in a layer that is always on.

## Context

Arcadia Principal is retiring its Claude-specific knowledge-base notes, so that the island holds no runtime-specific notes. One of them described the Claude Cowork configuration layers. Arcadia deletes that note whatever happens here; this record carries the one point it held that `ki-tokenomics-claude` does not yet state. The skill attributes standing-surface evidence, but it does not say how reliably each layer fires.

The point, as Arcadia recorded it:

- The system prompt and project instructions are always on.
- The memory index is always loaded, but memory files are read only on demand, so rules held in them apply only conditionally.
- `CLAUDE.md` loads only when its folder is mounted.
- Skills load only when invoked.
- Hence a rule meant to hold every time belongs in an always-on layer.

The layering was observed in Cowork; the receiving owner should confirm it against current Claude Code behaviour before relying on it.

This is a non-blocking handoff from Arcadia Principal. It blocks nothing in Arcadia or here.

## Boundary

- In scope: deciding whether this belongs in the `ki-tokenomics-claude` audit standard or in guidance, and confirming the layer behaviour.
- Out of scope: portable budget policy, which `ki-tokenomics` owns, and Arcadia's notes, which are already retired.

## Discussion

### Placement

The point explains where a rule should live rather than how much context it costs, so it may sit better as guidance than as an audit criterion. The receiving owner decides.
