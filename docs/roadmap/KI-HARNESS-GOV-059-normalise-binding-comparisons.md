---
id: KI-HARNESS-GOV-059
area: GOV
title: Normalise binding comparisons
theme: governance-consistency
horizon: future
status: draft
candidate: true
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-13T16:20:31Z
updated_at: 2026-09-13T16:20:31Z
---

## Goal

Make Claude and Codex binding audits distinguish equivalent rendered definitions from genuine missing or stale registrations.

## Context

The `KI-HARNESS-RTP-011` review found no missing registrations. Claude Desktop rendered every targeted bare `node` command through the deliberately stable mise shim, while its audit compared against the currently resolved versioned executable. Codex rendered the same stable shim, expanded `~/` arguments, and resolved secret references, while its audit compared the live TOML directly against the unrendered portable values. These expected transformations produce persistent false drift warnings.

## Boundary

Do not change canonical binding data, runtime configuration, renderer output, client targeting, secret values, activation claims, or runtime-health claims. Do not make executable equivalence depend on running an arbitrary configured command.

## Discussion

### Comparison semantics

Define non-secret semantic comparison consistently across Claude and Codex: recognise a safe absolute executable projection of a canonical bare command, expand home-relative arguments, and treat an `op://` source as matching a non-empty rendered target value without exposing it.

### Verification focus

Add focused fixtures for missing registrations, genuinely stale arguments or environment keys, bare-command projections, home expansion, rendered secret references, URL definitions, and unrelated native entries. Preserve each adapter's existing ownership boundary and diagnostic-only audit behaviour.
