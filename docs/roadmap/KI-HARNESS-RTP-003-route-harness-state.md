---
id: KI-HARNESS-RTP-003
title: Route harness state
area: RTP
theme: runtime-portability
horizon: soon
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-16T12:51:00Z
---

## Goal

Put each kind of harness state in the durable home that matches how it must be shared, protected, and recovered.

## Context

The work will produce a finite routing table or Decision Record assigning each state class to repository tracking, knowledge-base content, synchronised personal configuration, or intentionally disposable machine-local storage.

The `workspaces/kis/` to `workspaces/kit/` checkout-path migration supplied the first concrete failure: Claude resolved a new project-memory directory for the current path, leaving the authored memory set in a writable legacy directory while the current directory began nearly empty. `KI-HARNESS-OPS-002` owns the narrow repair of three known legacy records; this item owns the wider durability and routing question exposed by that split.

## Boundary

Cover project memory, runtime settings and hooks, learned patterns, and caches; create follow-up migrations only for state proven to be in the wrong home.

## Shaping

Start with one bounded inventory of Harness-related state across repository source and generated projections, user configuration and installed payload metadata, Claude project memory, learned-pattern stores, sessions, caches, and logs. For each representation, record its canonical owner, path-dependence, durability, sharing, sensitivity, regeneration, and recovery properties.

Use the observed Claude memory split as the first contradiction. Decide whether the durable outcome is a routing table under the existing runtime-portability decision set or a standalone Decision Record. Promote to Next when the inventory boundary, output location, canonical-owner vocabulary, and pass criteria for detecting path-coupled or duplicate authority are explicit.

## Discussion

### Routing test

Each state class needs an explicit durability, sharing, sensitivity, and ownership rationale before the work proposes moving it.

### State inventory

Start from concrete state rather than runtime names: repository source and generated projections; user configuration and installed harness metadata; runtime-local memory, sessions, caches, and logs; personal learned preferences; and durable knowledge-base material. A state class may have more than one representation, but each representation needs one declared canonical home.

### Routing criteria

For each class, assess whether it must survive machine replacement, be shared with collaborators, remain private to one user, be regenerated safely, or contain secrets. Repository tracking is for project-owned source; synchronised personal configuration is for durable user choice; a knowledge base is for maintained knowledge; disposable local storage is for recoverable runtime cache and session state.

### Evidence for promotion

The finite first inventory remains to be named. The contradictory state class is now evidenced by the split Claude project-memory directories. Promotion still needs a decision on whether the outcome is a routing table or a Decision Record. Do not start a broad migration merely because multiple copies exist.

### Return trigger

The trigger was met on 2026-09-16 when the checkout-path migration produced separate current and legacy Claude project-memory directories with materially different contents. Further examples may refine the inventory but are no longer required to justify shaping the routing decision.
