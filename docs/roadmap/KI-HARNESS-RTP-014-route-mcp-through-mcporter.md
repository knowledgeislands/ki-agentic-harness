---
id: KI-HARNESS-RTP-014
area: RTP
title: Route MCP through mcporter
theme: runtime-portability
horizon: now
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T06:59:13Z
updated_at: 2026-09-30T06:59:13Z
---

# Route MCP through mcporter

## Goal

Every agent running on a host the principal operates reaches KI MCP servers through that host's mcporter bridge, and treats claude.ai connectors as a cloud-session surface rather than a local gap to report. The rule holds for interactive sessions, local Paperclip runs and a future remote Paperclip host.

## Context

On 30 September 2026 an interactive Claude Code session listed twelve unauthorised claude.ai connectors as unavailable capability, although the connected `ki-mcporter` bridge (`http://127.0.0.1:3333/mcp` in user-scoped Claude Code configuration) is the principal's intended route. No skill states that preference: `ki-binding` models `mcporter` as one client token in the XDG `mcp-servers.yaml` inventory, and `ki-binding-claude` treats claude.ai web only as a non-rendered convention.

Local Paperclip runs scope `HOME` and the XDG base directories to a run directory. The Convenor's retained sessions show only Paperclip-provided MCP tools and no `ki-mcporter` calls, so the bridge's reachability from a run is unestablished. `ki-agent-coordination-paperclip` documents pinning the host home only for `ki` audits.

The principal intends Paperclip to run on an EC2 host later. Techne's `TECHNE-TOOLS-OPS-008` and `TECHNE-TOOLS-FAB-001` hold that work in Triage. A laptop loopback bridge is unreachable from such a host, so the rule must bind to the running host, not to one machine.

## Boundary

Own the portable surface-selection rule and its placement across `ki-binding`, `ki-binding-claude` and `ki-agent-coordination-paperclip`, with any rubric and test changes those require. Do not change user, chezmoi, Claude or Paperclip runtime configuration, provision a remote host, or resolve Cowork reachability, which `KI-HARNESS-RTP-002` owns. The remote-host section states requirements for Techne to consume; it does not design the host.

## Current state

Captured and adopted into Now at the principal's direction on 30 September 2026. The local Paperclip bridge route is unverified, and no skill text has changed.

## Steps

- [ ] Establish from a live or retained local Paperclip run whether the `ki-mcporter` bridge is configured and reachable, and record the evidence scope.
- [ ] State the surface-selection rule once in `ki-binding`: host-bound runtimes use the host's mcporter bridge, cloud sessions use claude.ai connectors, and an unauthorised connector in a host-bound session is expected state.
- [ ] Extend the `ki-binding-claude` web convention to cite that rule without restating it.
- [ ] State in `ki-agent-coordination-paperclip` how a run reaches the host bridge, or that it has no MCP route and what the prerequisite is, and the requirements a remote Paperclip host must meet.
- [ ] Add or adjust rubric items and tests where the rule becomes checkable.
- [ ] Offer the principal a one-line pointer for the chezmoi-managed user instructions; applying it stays with chezmoi.

## Files touched

Expected: `skills/environment/ki-binding/` (SKILL.md, standards and rubric), `skills/environment/ki-binding-claude/references/`, and `skills/agentic-systems/ki-agent-coordination-paperclip/references/`, plus generated rubric publications and focused tests. Exact paths are fixed during planning.

## Verify

Run `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill` for `ki-binding`, `ki-binding-claude`, `ki-agent-coordination-paperclip` and `ki-skills`. Confirm the rule is stated once and cited elsewhere, and that the Paperclip evidence names what was and was not exercised.

## Dependencies / blocks

No local build-order dependency. Related: `KI-HARNESS-RTP-002` (Cowork reachability), `KI-HARNESS-GOV-118` (delegated skill access), and Techne `TECHNE-TOOLS-OPS-008` and `TECHNE-TOOLS-FAB-001`, which should consume the remote-host requirements when they resume.

## Documentation impact

### Decision Records

Assess whether the surface-selection rule is a durable choice that needs a Decision Record rather than standard prose alone.

### Specifications

None expected.

### Guides

The Paperclip guidance gains the run-to-bridge route or its stated prerequisite.

### Roadmap

When Techne resumes, link its host records to the remote-host requirements through `ki-trades` rather than editing Techne here.

## Discussion

### Remote Paperclip host

On EC2, the host-bound rule means the host runs its own mcporter daemon and XDG inventory, with entries targeting that host's clients and secrets from a service-scoped store rather than the laptop's interactive vault. A reverse tunnel to the laptop bridge would couple remote runs to laptop uptime and exposure, so it should not be the default. Runs must reach the bridge without a hardcoded path, as the existing `PAPERCLIP_GITHUB_HOST_HOME` pinning does for audits. Egress for MCP servers that call external APIs falls under Techne's scoped-egress question in `TECHNE-TOOLS-FAB-001`.
