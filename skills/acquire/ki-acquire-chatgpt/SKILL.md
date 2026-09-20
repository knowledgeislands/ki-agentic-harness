---
name: ki-acquire-chatgpt
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-housekeeping-chatgpt]
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
ki-acquire-adapter: chatgpt
ki-acquire-actions: [import]
ki-acquire-repository-properties: [capture_path, output_path]
ki-acquire-invocation-properties: [capture, output]
ki-acquire-capabilities: [local-capture]
ki-acquire-omissions: [provider-network, project-enumeration, incremental-reads, source-retirement]
ki-acquire-mutation-boundary: read-only
ki-acquire-checkpoint: kep
ki-acquire-reset-scopes: []
description: >
  Govern incremental readable ChatGPT project and conversation acquisition, including stable project identity,
  prefixed routing, faithful versions, checkpoints, and later retirement evidence. Use for ChatGPT project import or
  routing design; `ki-housekeeping-chatgpt` owns opaque installed-store inventory.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# ChatGPT acquisition

Use the provider-neutral lifecycle **discover → acquire → stage → triage → optional source retirement**. Read [the ChatGPT acquisition standard](references/standards-chatgpt-acquisition.md) when designing or auditing project routing, incremental reads, fidelity, or checkpoints; read [the source record](references/sources.md) only during REFRESH or when current provider capability matters.

The current executable bridge accepts one user-prepared readable capture and emits a verified KEP. Its machine-readable `ki-acquire-*` metadata deliberately advertises only that proven surface. Project enumeration, incremental readable retrieval, receiver staging, reconciliation, reset, and source retirement remain required contract outcomes rather than falsely declared executable capabilities.

`ki-housekeeping-chatgpt` is a required source-evidence layer: it can identify opaque local records and changes without decoding them. This skill adds the readable acquisition and receiver-routing contract. Opaque bytes are never presented as conversation content, and acquisition never authorises source mutation.

## Operating modes

Invoked as `help`, `-h`, or `?`, explain the capability, current bridge, modes, and off-ramps, then stop. With no recognisable mode, provide the same explanation before offering an interactive mode choice.

### Mode AUDIT

Run `ki repo audit --skill ki-acquire-chatgpt --repo <repo>`, then review separately supplied runtime evidence against the generated rubric. Missing readable-source, project-binding, completeness, or checkpoint evidence remains a named gap; do not infer it from opaque local records or contact ChatGPT merely to make an audit pass.

### Mode CONFORM

Run AUDIT first, then `ki repo conform --skill ki-acquire-chatgpt --repo <repo> --dry-run`. CONFORM may publish generated rubric material but cannot invent project IDs, receiver bindings, readable content, source versions, or retirement authority. Apply authored configuration only after its owner confirms the exact mapping, then re-run AUDIT.

### Mode EDUCATE

Explain immutable project identity, `<Domain>: <Topic>` presentation, explicit receiver bindings, incremental content checkpoints, complete-conversation fidelity, local triage, and the separate retirement gate. Distinguish the current prepared-capture bridge from the intended incremental source.

### Mode REFRESH

Run only from the canonical `ki-agentic-harness` source. When invoked from an installed copy, stop and redirect there. Re-read [the tracked sources](references/sources.md), inspect only privacy-minimised source schemas and official capability documentation, update the standard and rubric when supported behaviour changes, then record the actual review date.

## Off-ramps

- `ki-housekeeping-chatgpt` owns opaque installed-store discovery, hashes, and read-only checkpoint evidence.
- `tools-ki` owns `ki acquire` execution, KEP construction, receiver writes, and persisted checkpoints.
- Arcadia owns provider-neutral knowledge-acquisition lifecycle and receiver-local triage semantics.
- ChatGPT account administration, project renaming, archiving, and deletion remain provider operations outside acquisition authority.
