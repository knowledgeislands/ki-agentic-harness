---
id: KI-HARNESS-RTP-019
area: RTP
title: Fit sandbox socket paths
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-06T23:01:19Z
---

# KI-HARNESS-RTP-019: Fit sandbox socket paths

## Goal

Skills that rely on a tool binding a Unix domain socket under the home directory state the constraint that a long redirected sandbox `HOME` imposes, detect it cheaply, and respond in an accepted way instead of failing opaquely.

## Context

A macOS Unix domain socket address is limited to a 104-byte path (`sun_path[104]` in `sys/un.h`). An agent runtime that isolates a run by redirecting the home directory into a per-run sandbox directory can produce a home path of well over one hundred characters on its own. Any tool that places its control socket at a fixed offset below that home then cannot bind, and the failure presents as an address-length error rather than a permission or configuration problem.

Observed instance: a session-manager tool whose control socket sits at `<home>/config/<tool>/<tool>.sock` failed to start under a sandboxed home of 142 characters, because the socket path was 166 characters. The same binary works from an ordinary shell.

Origin: an untracked draft (branch-local `KI-HARNESS-RTP-015`) in the retained Paperclip worktree for `paperclip/KNO-7-name-the-aws-cluster-as-the-target-for-techne-ops-002-and-run-the-proof`, never committed. The draft is preserved at `~/.local/state/ki/state-of-play/salvage/KNO-7/KI-HARNESS-RTP-015-keep-agent-sandbox-socket-paths-usable.md`. The cleanup that retired the worktree is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`. The serial `RTP-015` is used on `main` for other work.

## Boundary

This item does not change any agent runtime, patch a third-party tool, or weaken sandbox isolation to make a tool work. It records the constraint, tells skills how to detect it, and states the acceptable responses.

## Discussion

### Why this is structural

The isolation that makes local agent execution safe is the same mechanism that stops an agent driving the operator's session-manager, editor daemon or agent-supervisor tooling. The failure recurs for every tool of that shape and reappears whenever a runtime lengthens its sandbox path.

### Detection and responses

Compare the intended socket path length with the platform limit before invoking the tool, rather than interpreting the tool's error, and report both numbers as evidence. Overriding the home directory for the tool's benefit defeats isolation and is not acceptable. Pointing the tool's socket at a short directory through its own configuration is acceptable, as is declaring that the capability needs a human-driven terminal. A container runtime with a short home path does not have the problem.

### Open questions

- Which existing skills depend on a tool of this shape, and do they state the limitation?
- Is there a short, run-owned scratch directory a socket may use without weakening isolation?
- Should the harness publish a shared helper that measures the socket-path budget?

### Related

- [KI-HARNESS-RTP-018](KI-HARNESS-RTP-018-audit-inside-sandboxed-runs.md) records another failure caused by the same redirected sandbox `HOME`.
