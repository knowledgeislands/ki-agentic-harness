---
name: ki-housekeeping-chatgpt
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Acquire and audit installed ChatGPT session material through opaque, read-only local-store evidence. Use to
  import ChatGPT sessions for one repository, with faithful reads, checkpoints, staging, and later harvest;
  acquisition never authorises source-session deletion.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# ChatGPT session acquisition

Use the provider-neutral lifecycle: **acquire → stage → harvest → durable knowledge → archive/delete source**.

`mcp-housekeeping-chatgpt` exposes read-only `chatgpt_sessions_discover`, `chatgpt_sessions_list`, `chatgpt_session_read`, and `chatgpt_sessions_checkpoint` operations over the configured installed-app store. Its `*.data` records are opaque: discovery returns identity, provenance, timestamps, size, and hash; `read` returns exact bytes as base64 without claiming decoded conversation content.

`ki space acquire chatgpt import` owns repository-context staging and checkpoint persistence. The MCP never writes KI state, changes the ChatGPT store, decrypts a private format, archives, or deletes a source session.

## Operating modes

### Mode HELP

Explain this boundary and stop without reading or changing any source session.

### Mode AUDIT

Run `ki repo audit --skill ki-housekeeping-chatgpt` for the configured bounded local-store evidence. Missing, unreadable, or unsafe source evidence is unavailable or failing evidence, never a fallback to arbitrary paths.

### Mode CONFORM

There is no local-store conform action. Acquisition and any later source-retention decision are separate, explicitly authorised operations.

### Mode EDUCATE

Explain the opaque-store boundary, the four comparable provider operations, and the separation of provider reads from KI staging and harvest.

### Mode REFRESH

REFRESH writes only the canonical `ki-housekeeping-chatgpt` source in `ki-agentic-harness`; when invoked from an installed copy, stop and redirect to the Harness. Revalidate that discovery remains path-bounded, records remain opaque unless documented otherwise, and source mutation stays unavailable.

## Off-ramps

- Durable knowledge promotion belongs to Arcadia's acquisition lifecycle.
- Repository staging belongs to `ki space acquire chatgpt import` in `tools-ki`.
- Archive or delete requires a later verified acquisition and harvest decision.
