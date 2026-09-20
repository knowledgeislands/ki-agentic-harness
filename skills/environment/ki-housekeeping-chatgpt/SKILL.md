---
name: ki-housekeeping-chatgpt
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit installed ChatGPT opaque local-store evidence for session identity, hashes, and read-only checkpoints.
  Use for local ChatGPT store inventory or change detection; `ki-acquire-chatgpt` owns readable project and
  conversation acquisition.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# ChatGPT local-store evidence

Use the provider-neutral lifecycle: **acquire → stage → harvest → durable knowledge → archive/delete source**.

`mcp-housekeeping-chatgpt` exposes read-only `chatgpt_sessions_discover`, `chatgpt_sessions_list`, `chatgpt_session_read`, and `chatgpt_sessions_checkpoint` operations over the configured installed-app store. Its `*.data` records are opaque: discovery returns identity, provenance, timestamps, size, and hash; `read` returns exact bytes as base64 without claiming decoded conversation content.

Repository staging records the opaque source locator, timestamp, byte count, and hash but does not commit the opaque payload bytes by default. Those bytes contain no readable knowledge and remain permanently recoverable from Git after a later deletion; retain them only outside Git in an explicitly approved source store when the receiver has a justified need.

`ki acquire import --adapter chatgpt` owns repository-context staging and checkpoint persistence. The MCP never writes KI state, changes the ChatGPT store, decrypts a private format, archives, or deletes a source session.

The `ki-acquire-chatgpt` skill owns readable project routing, complete-conversation fidelity, incremental content versions, receiver staging, and later retirement evidence. Opaque local-store records may support its identity and change-detection layer, but never substitute for readable content.

## Operating modes

### Mode HELP

Explain this boundary and stop without reading or changing any source session.

### Mode AUDIT

Run `ki repo audit --skill ki-housekeeping-chatgpt` for the configured bounded local-store evidence. Missing, unreadable, or unsafe source evidence is unavailable or failing evidence, never a fallback to arbitrary paths.

### Mode CONFORM

There is no local-store conform action. Acquisition and any later source-retention decision are separate, explicitly authorised operations.

### Mode EDUCATE

Explain the opaque-store boundary, the four comparable provider operations, the default exclusion of opaque payload bytes from Git, and the separation of provider reads from KI staging and harvest.

### Mode REFRESH

REFRESH writes only the canonical `ki-housekeeping-chatgpt` source in `ki-agentic-harness`; when invoked from an installed copy, stop and redirect to the Harness. Revalidate that discovery remains path-bounded, records remain opaque unless documented otherwise, and source mutation stays unavailable.

## Off-ramps

- Durable knowledge promotion belongs to Arcadia's acquisition lifecycle.
- Repository staging belongs to `ki acquire import --adapter chatgpt` in `tools-ki`.
- Archive or delete requires a later verified acquisition and harvest decision.
