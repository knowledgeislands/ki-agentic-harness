---
id: KI-HARNESS-OPS-003
title: Define OTLP observability
area: OPS
theme: operations
horizon: parked
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-21T23:51:38Z
---

## Goal

Define optional repository observability that is useful when enabled and completely quiet when disabled.

## Context

Define an off-by-default `ki-observability` capability for reporting repository and skill activity to a configured OTLP-compatible endpoint.

## Boundary

Disabled means no network activity; enabled reporting is best-effort and never changes AUDIT or CONFORM results. Do not introduce transcript scraping or a required gateway in the first slice.

## Discussion

### Trust boundary

Shaping must make consent, emitted fields, failure isolation, and endpoint ownership inspectable before selecting any instrumentation mechanism.

### Minimum event model

The first decision is whether repository observability has a useful minimum beyond the existing human-readable `ki` output. Any candidate event must identify its producer, repository scope, operation, outcome, duration, and redacted diagnostic category without exposing command arguments, environment values, file contents, prompt text, transcripts, or user configuration.

### Activation and failure model

An enabled endpoint must be explicit repository or user configuration with a defined owner; an absent configuration is the normal state. Emission must be asynchronous or otherwise isolated so endpoint failure, authentication failure, or network delay cannot alter audit findings, conform writes, exit status, or local CLI usability.

### Evidence for promotion

Before this is adopted beyond Triage, name one operational question that current local logs cannot answer, one consent and configuration owner, the exact event fields needed to answer it, and a test proving that disabled mode makes no network attempt.

### Return trigger

Resume this item when a concrete operational question cannot be answered from existing local output and the owner explicitly chooses to evaluate OTLP as the remedy, with a named consent and configuration owner.
