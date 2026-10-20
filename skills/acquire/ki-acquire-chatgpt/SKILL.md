---
name: ki-acquire-chatgpt
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: [ki-acquire]
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
ki-acquire-checkpoint: capture-front-matter
ki-acquire-reset-scopes: []
description: >
  Govern ChatGPT conversation capture: honest digest or full-thread coverage, routing from project and conversation
  evidence, and the capture end point recorded in the digest's README front matter. Use for ChatGPT capture or audit;
  `ki-acquire` owns the common contract.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# ChatGPT acquisition

Apply `ki-acquire` for the common contract, then [the ChatGPT acquisition standard](references/standards-chatgpt-acquisition.md). The generated [rubric](references/rubric.md) holds the review criteria; read [the sources](references/sources.md) only during REFRESH or when current provider capability matters.

A ChatGPT capture is a digest or full-thread snapshot written by the receiving repository's capture route, with its end point in the digest's README front matter. The `ki-acquire-*` front matter advertises only the proven `tools-ki` bridge, which imports one user-prepared readable capture. Acquisition never mutates ChatGPT.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain the skill, modes and off-ramps, then stop; offer a mode choice only in an interactive session.

### Mode AUDIT

Run the `ki-acquire` audit, then `ki repo audit --skill ki-acquire-chatgpt --repo <repo>`, and review supplied capture evidence against the rubric. Missing coverage or end-point evidence stays a named gap; do not contact ChatGPT merely to complete an audit.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-acquire-chatgpt --repo <repo> --dry-run`. It may publish the generated rubric but cannot invent routes, content, end points or retirement authority.

### Mode EDUCATE

Explain digest versus full-thread coverage, the front-matter end point, linked segments, routing and the separate retirement gate.

### Mode REFRESH

Run only in the canonical `ki-agentic-harness`; from an installed copy, stop and redirect there. Re-read [the sources](references/sources.md), inspect only official capability documentation and privacy-minimised schemas, update the standard and rubric when supported behaviour changes, and record the review date.

## Off-ramps

- `tools-ki` owns `ki acquire` execution.
- `ki-housekeeping-chatgpt` owns opaque local-store evidence, which is never conversation content.
- ChatGPT account administration, project renaming, archiving and deletion stay outside acquisition authority.
