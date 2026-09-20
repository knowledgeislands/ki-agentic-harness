---
name: ki-housekeeping-codex
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-runtime-binding: true
ki-supported-runtimes: [chatgpt-codex]
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Acquire, audit, and later clean repository-scoped Codex sessions for one physical repository. Use for Codex
  session import, thread review, or old-thread cleanup with explicit retention; portable recurring repository
  maintenance belongs to `ki-work-housekeeping`.
argument-hint: 'audit <repo> | conform <artifact> <thread-id>... | educate <repo> | help | refresh'
---

# Codex session acquisition and housekeeping

Govern saved Codex-session acquisition and later cleanup through a review-before-delete workflow. Read the [Codex state standard](references/standards-codex-state.md) for the identity, artifact, and deletion contract.

The skill is opt-in while its machine-readable binding uses the experimental Codex app-server. It reads a complete provider payload only for an explicit acquisition operation, never applies automatic retention, and never infers repository ownership from a parent path or symlink alias. The `ki-work-housekeeping` skill continues to own recurring repository-maintenance work.

## AI session acquisition

Use the provider-neutral lifecycle: **acquire → stage → harvest → durable knowledge → archive/delete source**. For one exact physical repository, `mcp-housekeeping-codex` exposes read-only `codex_sessions_discover`, `codex_sessions_list`, `codex_session_read`, and `codex_sessions_checkpoint` operations. `list` and `checkpoint` are content-minimised provenance; `read` is the faithful source payload.

The MCP does not write Knowledge Islands state. `ki acquire import --adapter codex` will own inbound staging and incremental checkpoint persistence. Do not archive or delete a Codex session until acquisition, review, and harvesting have passed their later safety checkpoint.

## Operating modes

With no clear mode, explain the skill and its modes first; in an interactive session, then ask which mode and target to use. `help`, `-h`, and `?` explain and stop without starting app-server or changing state.

### Mode AUDIT

Read [the AUDIT procedure](references/mode-audit.md). It produces a content-minimised JSON review artifact on standard output and performs no deletion.

### Mode CONFORM

Read [the CONFORM procedure](references/mode-conform.md). It requires a previously reviewed artifact, exact root-thread selections, and the destructive confirmation phrase. It revalidates the complete selection before the first delete.

### Mode EDUCATE

Explain the exact-working-directory identity rule, active and archived inventory, descendant impact, review artifact, stable single-session CLI fallback, experimental app-server boundary, and permanent deletion consequence. Do not run AUDIT or CONFORM unless separately requested.

### Mode REFRESH

Read [the REFRESH procedure](references/mode-refresh.md). REFRESH writes only the canonical `ki-housekeeping-codex` source in `ki-agentic-harness`; when invoked from an installed copy, stop and redirect to the Harness.

## Runtime adapter

Run `bun scripts/app-server.ts --help` from this skill root for the public adapter contract. The MCP adapter exposes discovery, list, faithful read, and checkpoint in addition to the review/delete CLI; private protocol logic remains inside the same source module so its safety fixtures exercise the public behaviour directly.

## Off-ramps

- Recurring repository-owned maintenance work belongs to `ki-work-housekeeping`.
- Codex instruction and configuration token evidence belongs to `ki-tokenomics-codex`.
- Unsupported Codex cache and automatic retention stay out of scope.
