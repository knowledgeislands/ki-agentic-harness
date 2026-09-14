---
id: KI-HARNESS-RTP-003
title: Route harness state
area: RTP
theme: runtime-portability
horizon: parked
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-08-17T14:16:26Z
---

## Goal

Put each kind of harness state in the durable home that matches how it must be shared, protected, and recovered.

## Context

The candidate was intended to produce a finite routing table or decision record assigning each state class to repository tracking, knowledge-base content, synchronized personal configuration, or intentionally disposable machine-local storage. No concrete state-loss, duplication, exposure, or ownership failure currently justifies that broad review.

## Boundary

Cover project memory, runtime settings and hooks, learned patterns, and caches; create follow-up migrations only for state proven to be in the wrong home.

## Discussion

### Routing test

Each state class needs an explicit durability, sharing, sensitivity, and ownership rationale before the work proposes moving it.

### State inventory

Start from concrete state rather than runtime names: repository source and generated projections; user configuration and installed harness metadata; runtime-local memory, sessions, caches, and logs; personal learned preferences; and durable knowledge-base material. A state class may have more than one representation, but each representation needs one declared canonical home.

### Routing criteria

For each class, assess whether it must survive machine replacement, be shared with collaborators, remain private to one user, be regenerated safely, or contain secrets. Repository tracking is for project-owned source; synchronised personal configuration is for durable user choice; a knowledge base is for maintained knowledge; disposable local storage is for recoverable runtime cache and session state.

### Evidence for promotion

Promotion needs a finite first inventory, an identified contradictory duplicate or misplaced state class, and a decision on whether the outcome is a routing table or a Decision Record. Do not start a broad migration merely because multiple copies exist.

### Return trigger

Reconsider only when machine migration loses state that should have survived, one state class has contradictory canonical copies, sensitive state is found in an inappropriate home, or recurring manual recovery demonstrates that the current routing is inadequate.
