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
updated_at: 2026-09-30T07:40:00Z
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

Captured and adopted into Now at the principal's direction on 30 September 2026. No skill text has changed.

Planning evidence, inspected locally on 30 September 2026 against Paperclip `2026.916.1`:

- Each run receives a fresh temporary `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `CLAUDE_CONFIG_DIR` and `CODEX_HOME` (`@paperclipai/server/dist/services/ai-connection-runtime.js`). User-scoped Claude Code and Codex MCP configuration, including the `ki-mcporter` bridge entry, therefore never reaches a run. Pinning `PAPERCLIP_GITHUB_HOST_HOME` fixes `ki` audits only.
- Paperclip injects MCP servers into runs itself and supports operator-configured generic remote MCP connections through its tool gateway. Private and loopback endpoints are accepted unless the deployment is both `authenticated` and `public` (`allowPrivateRemoteEndpoints` in `services/tool-access.js` and `services/tool-gateway.js`).
- The local instance binds to loopback with `exposure: "private"`, so a connection to `http://127.0.0.1:3333/mcp` is admissible. The bridge answered an unauthenticated probe with HTTP 405. No existing Paperclip connection to the bridge was verified, and no run was exercised.

## Steps

- [ ] `ki-binding` standard: add a **Host surface selection** section. A host-bound runtime (Claude Code, Desktop, Codex or a Paperclip run, on any host) reaches KI MCP servers through that host's mcporter bridge. claude.ai connectors belong to cloud sessions. An unauthorised connector in a host-bound session is expected state, reported only when a task needs that service and no bridge route provides it. Each host owns its inventory, bridge and secret store, and never depends on another host's loopback bridge.
- [ ] `ki-binding` SKILL.md: add one sentence pointing to that section.
- [ ] `ki-binding` rubric: add judgment item `BIND-J2` (host bridge is the local MCP route) in `scripts/rubric/items/bind.ts` and its index test.
- [ ] `ki-binding-claude` standard: extend the claude.ai web bullet to cloud sessions and connectors, citing the `ki-binding` section without restating it.
- [ ] `ki-agent-coordination-paperclip` standard: add **MCP access in runs** under interaction and skill composition. Run isolation excludes user MCP configuration, so the supported route is a Paperclip remote MCP connection to the host bridge, granted through Paperclip's connection mechanism. Bootstrap verifies access in a real run and reports a missing connection as a provisioning prerequisite. Never widen the audit home-pinning to MCP access.
- [ ] `ki-agent-coordination-paperclip` remote-delivery prerequisite: add the remote-host MCP requirements (own bridge and inventory, service-scoped secrets, private exposure reached through session manager or mesh, no default tunnel to the laptop, public exposure only with a separately decided authenticated HTTPS endpoint).
- [ ] `ki-agent-coordination-paperclip` rubric: add judgment item `COORD-14` (run MCP access) in `scripts/rubric/items/coordination.ts` and its index test; record the dated Paperclip evidence in `references/sources.md`.
- [ ] Regenerate rubric publications with `ki dev skill rubric` for all three skills.
- [ ] After delivery, offer the principal a one-line pointer for the chezmoi-managed user instructions; applying it stays outside this item.

## Files touched

- `skills/environment/ki-binding/SKILL.md`, `references/standards-cross-surface-binding.md`, `references/rubric.md`, `scripts/rubric/items/bind.ts`, `scripts/rubric/items/index.test.ts`
- `skills/environment/ki-binding-claude/references/standards-claude-binding.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`, `references/rubric.md`, `references/sources.md`, `scripts/rubric/items/coordination.ts`, `scripts/rubric/items/index.test.ts`
- Generated catalogue or plugin projections only where the pre-commit or rubric generator requires them.

## Verify

Run `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill` for `ki-binding`, `ki-binding-claude`, `ki-agent-coordination-paperclip` and `ki-skills`. Confirm the rule is stated once and cited elsewhere, and that the Paperclip evidence names what was and was not exercised.

## Dependencies / blocks

No local build-order dependency. Related: `KI-HARNESS-RTP-002` (Cowork reachability), `KI-HARNESS-GOV-118` (delegated skill access), and Techne `TECHNE-TOOLS-OPS-008` and `TECHNE-TOOLS-FAB-001`, which should consume the remote-host requirements when they resume.

## Documentation impact

### Decision Records

None. The rule is standard prose with judgment items; a remote exposure choice belongs to Techne when it resumes.

### Specifications

None expected.

### Guides

The Paperclip guidance gains the run-to-bridge route, its prerequisite, and remote-host requirements.

### Roadmap

When Techne resumes, link its host records to the remote-host requirements through `ki-trades` rather than editing Techne here.

## Discussion

### Remote Paperclip host

On EC2, the host-bound rule means the host runs its own mcporter daemon and XDG inventory, with entries targeting that host's clients and secrets from a service-scoped store rather than the laptop's interactive vault. A reverse tunnel to the laptop bridge would couple remote runs to laptop uptime and exposure, so it should not be the default. Runs must reach the bridge without a hardcoded path, as the existing `PAPERCLIP_GITHUB_HOST_HOME` pinning does for audits. Egress for MCP servers that call external APIs falls under Techne's scoped-egress question in `TECHNE-TOOLS-FAB-001`.
