---
id: KI-HARNESS-RTP-018
area: RTP
title: Audit inside sandboxed runs
theme: runtime-portability
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-06T23:01:19Z
---

# KI-HARNESS-RTP-018: Audit inside sandboxed runs

## Goal

A governed audit can be run, and its result trusted, from inside a sandboxed agent run, so that an agent can verify its own repository work with `ki repo audit` in the plane where it works rather than only from an interactive shell.

## Context

Observed on 2026-09-26 inside a Paperclip agent run on the development host: every harness-backed `ki` verb failed with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed`, and `ki harness list` reported `HARNESSES=0`. Repository-only verbs such as `ki repo roadmap list` were unaffected.

The cause was the resolved data root, not the install. `resolveKiPaths` in `tools-ki/src/core/paths.ts` takes the data root from `KI_DATA_HOME`, else `XDG_DATA_HOME/ki`, else `$HOME/.local/share/ki`. The sandboxed run had a synthetic per-run `HOME`, so the fallback named a directory that never existed. With `KI_DATA_HOME` pointed at the host data root, the same audit in the same run completed normally. Nothing propagates such a value into a run, so the default invocation remains a hard failure, and the error names the harness rather than the path.

Origin: first raised as branch-local `KI-HARNESS-RTP-016` on the abandoned Paperclip branch `paperclip/KNO-20-ki-binding-the-closed-portable-mcp-schema-rejects-the-host-canonical-inventory-bind-2-and-bind-1-compar`, commit `cb52ba0b` (`docs(roadmap): capture the sandboxed harness-root finding`). The branch serial was reused on `main` for other work, so the finding is captured again here. A patch copy is kept at `~/.local/state/ki/state-of-play/salvage/KNO-20/`. The cleanup that retired the branch is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`.

## Boundary

In scope: where a sandboxed run's harness data root comes from, and what an audit claim made from inside such a run may rest on.

Out of scope: the `KI_MCP_SOURCE` host-configuration question, and repairing the host install, which is intact and readable from inside the sandbox.

## Discussion

### Candidate resolutions, none chosen here

- **Runtime propagation.** The environment that provisions a run carries a data root across through `KI_DATA_HOME` or `XDG_DATA_HOME`. Smallest change, but every run then depends on a host path it cannot verify, and the sandbox reach widens silently.
- **Standard statement.** The coordination standard names which `ki` verbs are available inside a sandboxed run and requires the rest to be evidenced from a non-sandboxed shell at a named revision.
- **Diagnostic in `ki`.** The resolver reports the data root it chose and that it is absent, rather than reporting a declared harness as not installed. This removes the misdiagnosis without making the audit run.

These compose rather than compete; shaping decides which are load-bearing and which repository owns each.

### Read-only reach

The synthetic home differs between runs, so a per-run bootstrap is not a fix. A read-only audit against the host data root is sound; a write-capable verb such as install, refresh or `dev local on` would mutate the user's real data root from inside a run that believes it is isolated. Whether propagation must be read-only, and how that is enforced, belongs here.

### Related

- [KI-HARNESS-RTP-019](KI-HARNESS-RTP-019-fit-sandbox-socket-paths.md) records another failure caused by the same redirected sandbox `HOME`.
