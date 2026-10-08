---
id: KI-HARNESS-RTP-018
area: RTP
title: Audit inside sandboxed runs
kind: deliver
project: paperclip-bootstrap-and-recovery
component: agentic-systems
status: done
blocks: []
blocked_by: []
baseline_ref: c94f5a394a6e4621374224c61ffd81fa5b80e009
created_at: 2026-10-06T23:01:19Z
updated_at: 2026-10-08T08:58:33Z
---

# KI-HARNESS-RTP-018: Audit inside sandboxed runs

## Goal

A governed audit can be run, and its result trusted, from inside a sandboxed agent run, so that an agent can verify its own repository work with `ki repo audit` in the plane where it works rather than only from an interactive shell.

## Context

Observed on 2026-09-26 inside a Paperclip agent run on the development host: every harness-backed `ki` verb failed with `declared skill ki-repo is provided by no declared harness (knowledgeislands/ki-agentic-harness); knowledgeislands/ki-agentic-harness is not installed`, and `ki harness list` reported `HARNESSES=0`. Repository-only verbs such as `ki repo roadmap list` were unaffected.

The cause was the resolved data root, not the install. `resolveKiPaths` in `tools-ki/src/core/paths.ts` takes the data root from `KI_DATA_HOME`, else `XDG_DATA_HOME/ki`, else `$HOME/.local/share/ki`. The sandboxed run had a synthetic per-run `HOME`, so the fallback named a directory that never existed. With `KI_DATA_HOME` pointed at the host data root, the same audit in the same run completed normally. Nothing propagates such a value into a run, so the default invocation remains a hard failure, and the error names the harness rather than the path.

Origin: first raised as branch-local `KI-HARNESS-RTP-016` on the abandoned Paperclip branch `paperclip/KNO-20-ki-binding-the-closed-portable-mcp-schema-rejects-the-host-canonical-inventory-bind-2-and-bind-1-compar`, commit `cb52ba0b` (`docs(roadmap): capture the sandboxed harness-root finding`). The branch serial was reused on `main` for other work, so the finding is captured again here. A patch copy is kept at `~/.local/state/ki/state-of-play/salvage/KNO-20/`. The cleanup that retired the branch is tracked in the `ki-arcadia-principal` checkpoint `+/_CHECKPOINTS/state-of-play.md`.

## Boundary

In scope: where a sandboxed run's harness data root comes from, and what an audit claim made from inside such a run may rest on. Also in scope, merged from `KI-HARNESS-RTP-019`: the Unix domain socket path limit that the same redirected `HOME` imposes on tools binding a control socket below it - skills state the constraint, detect it cheaply before invoking the tool, and respond in an accepted way.

Out of scope: the `KI_MCP_SOURCE` host-configuration question, and repairing the host install, which is intact and readable from inside the sandbox. Changing an agent runtime, patching a third-party tool, or weakening sandbox isolation to make a tool work is also out of scope.

## Shape

Settled 2026-10-08 under Kris's delivery authorisation (state-of-play Decision 19), reversible:

- **Propagation is invocation-scoped.** The data root reaches a run through the host-environment pin on the `ki` invocation itself, as the coordination audit procedure already does through `PAPERCLIP_GITHUB_HOST_HOME`. No KI value is added to the run's ambient environment, so the sandbox's reach does not widen silently. Configuring a Paperclip agent's environment is a coordination-plane change outside this record.
- **Read-only reach.** Only read verbs run against the pinned host roots from inside a run: audits, listings and roadmap reads. Install, refresh, upgrade, repair, cleanup, conform and development-link verbs are host maintenance, done from a human shell and reported from the run as a prerequisite. The duty is normative and judged under `COORD-10`; no runtime detection of a sandbox is added.
- **Diagnostic in `ki`.** tools-ki names the data root it searched when a declared harness resolves to nothing, and says when that root does not exist, so the failure points at the environment rather than at the install.
- **Socket paths.** The standard states the 104-byte macOS socket-path limit, the cheap pre-check, and the two accepted responses; the harness ships no socket helper, because no declared skill depends on a socket-binding tool today.

## Steps

- [x] Add a "Host tools in runs" subsection to the coordination standard after "MCP access in runs": invocation-scoped data-root pinning, read-only reach, how an audit claim from a run is evidenced, and the socket-path constraint with its detection and accepted responses.
- [x] Point `mode-audit.md` step 2 at the subsection and state that the pin serves read verbs only.
- [x] Extend `COORD-10`'s sources and judgment to host-tool reach inside a run, and regenerate `references/rubric.md`.
- [x] In tools-ki, pass the data root to declared-skill resolution so the no-provider error names the root searched and whether it exists; cover it through the CLI seam.
- [x] Run the harness and tools-ki verification below.

## Files touched

- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/mode-audit.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` (generated)
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts`
- tools-ki: `src/core/configuration/resolution.ts`, `src/core/configuration/local-provider.ts`, the four resolution call sites, and a CLI test

## Verify

1. The standard names which `ki` verbs a run may use against the pinned host roots, and states the socket-path limit, pre-check and accepted responses.
2. In tools-ki, `ki repo audit` with `HOME` and `KI_DATA_HOME` pointed at an empty directory fails naming that data root and saying it does not exist; with the root present but the harness missing, it names the root.
3. Harness `bun run test` and `bunx tsc --noEmit` pass; tools-ki tests and coverage pass; `ki repo audit` is clean in both primary checkouts.

## Documentation impact

### Decision Records

None. The coordination standard owns run-environment rules and is refined in place.

### Specifications

None.

### Guides

None.

### Roadmap

A follow-on is needed only if Kris wants the run's ambient environment provisioned with a data root; that is a Paperclip agent-configuration change under the programme hold.

## Done

Delivered and verified 2026-10-08: the coordination standard's "Host tools in runs" subsection, the audit procedure and `COORD-10` landed in the harness with tests and type check passing; tools-ki `f0ef4cc` names the data root, with its tests at full coverage. Run with a synthetic `HOME`, `ki repo audit` now reports `data root /tmp/.../.local/share/ki does not exist; check KI_DATA_HOME, XDG_DATA_HOME and HOME`. Accepted under Kris's standing decision that delivered and verified work counts as accepted.

## Discussion

### Candidate resolutions, none chosen here

- **Runtime propagation.** The environment that provisions a run carries a data root across through `KI_DATA_HOME` or `XDG_DATA_HOME`. Smallest change, but every run then depends on a host path it cannot verify, and the sandbox reach widens silently.
- **Standard statement.** The coordination standard names which `ki` verbs are available inside a sandboxed run and requires the rest to be evidenced from a non-sandboxed shell at a named revision.
- **Diagnostic in `ki`.** The resolver reports the data root it chose and that it is absent, rather than reporting a declared harness as not installed. This removes the misdiagnosis without making the audit run.

These compose rather than compete; shaping decides which are load-bearing and which repository owns each.

### Read-only reach

The synthetic home differs between runs, so a per-run bootstrap is not a fix. A read-only audit against the host data root is sound; a write-capable verb such as install, refresh or `dev local on` would mutate the user's real data root from inside a run that believes it is isolated. Whether propagation must be read-only, and how that is enforced, belongs here.

### Socket paths under a sandboxed home

Merged from `KI-HARNESS-RTP-019` (Fit sandbox socket paths), approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, because it is the same redirected sandbox `HOME`, here breaking socket paths.

A macOS Unix domain socket address is limited to a 104-byte path (`sun_path[104]` in `sys/un.h`). A per-run sandbox home of well over one hundred characters stops any tool whose control socket sits at a fixed offset below it from binding, and the failure presents as an address-length error. Observed instance: a session-manager tool whose socket sits at `<home>/config/<tool>/<tool>.sock` failed under a 142-character sandboxed home because the socket path was 166 characters; the same binary works from an ordinary shell.

Detection compares the intended socket path length with the platform limit before invoking the tool, and reports both numbers. Overriding the home directory for the tool's benefit defeats isolation and is not acceptable. Pointing the tool's socket at a short directory through its own configuration is acceptable, as is declaring that the capability needs a human-driven terminal. A container runtime with a short home path does not have the problem.

Open questions carried over: which existing skills depend on a tool of this shape and state the limitation; whether a short, run-owned scratch directory may hold a socket without weakening isolation; and whether the harness should publish a shared helper that measures the socket-path budget. The salvaged original draft is at `~/.local/state/ki/state-of-play/salvage/KNO-7/`, and the merged record's full text is at [its last open revision](https://github.com/knowledgeislands/ki-agentic-harness/blob/05d6acecb33dc19a6ac4aab7b077700c5ae9d2fc/docs/roadmap/KI-HARNESS-RTP-019-fit-sandbox-socket-paths.md).
