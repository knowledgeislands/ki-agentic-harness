---
id: KI-HARNESS-RTP-015
area: RTP
title: Verify run MCP connection
theme: runtime-portability
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-30T08:20:00Z
updated_at: 2026-10-05T12:00:00Z
---

# Verify run MCP connection

## Goal

A local Paperclip run reaches the host's mcporter bridge through a granted Paperclip remote MCP connection, so `COORD-14` conformance rests on live evidence rather than inspected code.

## Context

[KI-HARNESS-RTP-014](https://github.com/knowledgeislands/ki-agentic-harness/blob/ff6d023be0985ff4d431945fbdf241ef7318b6a3/docs/roadmap/KI-HARNESS-RTP-014-route-mcp-through-mcporter.md) documented the route from Paperclip `2026.916.1` source: runs replace user configuration, and Paperclip admits a loopback MCP endpoint on a private deployment. No connection to `http://127.0.0.1:3333/mcp` exists or was exercised, and the bridge refused connections from an interactive session on 30 September 2026.

## Boundary

Creating the connection and granting it to every Paperclip agent is a Paperclip configuration change on the local host, authorised by the principal's 2026-10-05 answer recorded below. This record provisions that local grant, verifies it in a real run, and corrects the harness guidance where evidence contradicts it. It does not provision or configure a remote host, build a bridge supervisor, add a claude.ai connector substitute, or change user-scoped MCP configuration. Under the [Techne Programme Hold](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Policies/Techne%20Programme%20Hold.md), only the local loopback route is in scope.

## Current state

- [standards-agent-coordination-paperclip.md](../../skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md) § MCP access in runs says the route is a Paperclip remote MCP connection to the host bridge "granted to the agents that need it", and that bootstrap verifies MCP access in a real run.
- `COORD-14` in the skill's `references/rubric.md` cites that section; its conformance currently rests on Paperclip `2026.916.1` source inspection from RTP-014, not on an exercised connection.
- No connection to `http://127.0.0.1:3333/mcp` exists; the bridge refused connections from an interactive session on 30 September 2026.

## Steps

- [ ] Re-ground: record the installed Paperclip version, whether the mcporter bridge is listening on `http://127.0.0.1:3333/mcp`, and the current company agent list. If the bridge is down, start it through its normal daemon path; if it cannot be started, stop and report.
- [ ] Create one Paperclip remote MCP connection to `http://127.0.0.1:3333/mcp` and grant it to every Paperclip agent in the company. If the Paperclip operation needs the principal's own session or credentials, stop and record the step as blocked for the owner.
- [ ] Run one local Paperclip task that lists the bridge's servers and calls one read-only tool through the granted connection; capture the run identifier, the tool list, and the result as evidence.
- [ ] Observe bridge availability: record what a run reports when the bridge is not listening. Do not build a supervisor; if the failure mode warrants one, capture a separate draft through `ki-next`.
- [ ] Update § MCP access in runs: state that every agent receives the loopback bridge grant, that the route was exercised (version and date), and correct any statement the evidence contradicts. Keep `COORD-14` wording aligned and regenerate the rubric if it changes.
- [ ] Write the evidence into Discussion, run Verify, assemble the review packet, and set the record to `awaiting-review`.

## Files touched

- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md`, `references/sources.md` and `scripts/rubric/items/coordination.ts` only if `COORD-14` wording or evidence citation changes
- This record

## Verify

- A Paperclip run identifier whose transcript shows a bridge tool listing and one successful read-only tool call through the granted connection.
- Paperclip shows the connection granted to every company agent.
- `bun run test`, `bunx tsc --noEmit`, and `ki repo audit --skill ki-agent-coordination-paperclip` pass.
- `ki repo audit --progress never` passes.

## Dependencies / blocks

No roadmap dependency. Builds on the accepted RTP-014 route. Requires a running local Paperclip instance and mcporter daemon on the principal's host.

## Documentation impact

### Decision Records

None; the grant scope is recorded here and in the coordination standard.

### Specifications

None.

### Guides

`ki-agent-coordination-paperclip` § MCP access in runs, as above.

### Roadmap

Closes this record on acceptance. A bridge keep-alive supervisor, if needed, is a separate draft.

## Discussion

### Owner decision - 2026-10-05

Answered: Kris decided that every Paperclip agent gets the loopback mcporter MCP grant. This settles the earlier open question of whether to grant every repository role or only roles whose tasks use KI MCP servers. The keep-alive question is handled by observation in this record, not by building a supervisor.
