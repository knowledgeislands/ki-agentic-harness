---
name: ki-housekeeping-chatgpt
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Audit ChatGPT opaque local-store evidence and Codex local memory or repository-scoped sessions. Use for
  ChatGPT store change detection, Codex memory reconciliation, or reviewed Codex thread cleanup;
  `ki-acquire-chatgpt` owns readable ChatGPT conversation acquisition.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# ChatGPT-family state housekeeping

This skill is the ChatGPT-family home for distinct ChatGPT and Codex state surfaces. Their stores and controls remain separate. [The Codex memory standard](references/standards-codex-memory.md) governs the repository-first memory decision; [the Codex state standard](references/standards-codex-state.md) governs exact physical-repository session selection and permanent-deletion safeguards.

Use the provider-neutral lifecycle: **acquire → stage → harvest → durable knowledge → archive/delete source**.

`mcp-housekeeping-chatgpt` exposes read-only `chatgpt_sessions_discover`, `chatgpt_sessions_list`, `chatgpt_session_read`, and `chatgpt_sessions_checkpoint` operations over the configured installed-app store. Its `*.data` records are opaque: discovery returns identity, provenance, timestamps, size, and hash; `read` returns exact bytes as base64 without claiming decoded conversation content.

Repository staging records the opaque source locator, timestamp, byte count, and hash but does not commit the opaque payload bytes by default. Those bytes contain no readable knowledge and remain permanently recoverable from Git after a later deletion; retain them only outside Git in an explicitly approved source store when the receiver has a justified need.

`ki acquire import --adapter chatgpt` owns repository-context staging and checkpoint persistence. The MCP never writes KI state, changes the ChatGPT store, decrypts a private format, archives, or deletes a source session.

The `ki-acquire-chatgpt` skill owns readable project routing, complete-conversation fidelity, incremental content versions, receiver staging, and later retirement evidence. Opaque local-store records may support its identity and change-detection layer, but never substitute for readable content.

Codex local memory is off by default but every declaring repository must explicitly set `auto_memory = "disabled" | "transition" | "enabled"` in its `[skills.ki-housekeeping-chatgpt]` table. Unset is **FAIL**; transition and retained memory under disabled policy are **WARN**. Enabled requires express human approval and a trusted project-scoped opt-in. The store is shared under the selected Codex home, not isolated by repository. Never create empty memory files, delete existing memories, or change chezmoi-managed user settings as a checker repair. Route durable learning into reviewed repository guidance or KB notes.

For Codex sessions, use the provider-neutral acquisition lifecycle before any source retirement. The experimental app-server adapter in `scripts/app-server.ts` provides an exact-repository, content-minimised inventory and separately reviewed deletion. Read [the Codex AUDIT procedure](references/mode-audit.md) before inventory and [the Codex CONFORM procedure](references/mode-conform.md) before any deletion. The MCP's read-only Codex discovery, list, read, and checkpoint operations do not write KI state; `ki acquire import --adapter codex` owns staging.

## Operating modes

### Mode HELP

Explain this boundary and stop without reading or changing any source session.

### Mode AUDIT

Run `ki repo audit --skill ki-housekeeping-chatgpt` for the explicit Codex memory policy and bounded local-store evidence. Missing, unreadable, or unsafe evidence is unavailable or failing evidence, never a fallback to arbitrary paths. Codex session inventory is a separate explicit operation described in the Codex AUDIT procedure.

### Mode CONFORM

There is no local-store or memory-file conform action. Acquisition and any later source-retention decision are separate, explicitly authorised operations. Codex session deletion requires the Codex CONFORM procedure and exact confirmation; it is never an automatic repository conform action.

### Mode EDUCATE

Explain the opaque ChatGPT store, shared Codex memory store, four comparable provider operations, exact Codex session identity and deletion boundary, default exclusion of opaque payload bytes from Git, and the separation of provider reads from KI staging and harvest.

### Mode REFRESH

REFRESH writes only the canonical `ki-housekeeping-chatgpt` source in `ki-agentic-harness`; when invoked from an installed copy, stop and redirect to the Harness. Revalidate ChatGPT store containment, Codex memory controls, and the Codex app-server protocol using [the refresh procedure](references/mode-refresh.md). Source mutation remains unavailable except reviewed Codex session deletion.

## Off-ramps

- Durable knowledge promotion belongs to Arcadia's acquisition lifecycle.
- Repository staging belongs to `ki acquire import --adapter chatgpt` in `tools-ki`.
- Archive or delete requires a later verified acquisition and harvest decision.
