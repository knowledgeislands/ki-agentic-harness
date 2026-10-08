---
name: ki-delegation
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern agent delegation: routine detached background runs (run packet, prompt shape, authority footers,
  decisions log, coordination, run queue, monitoring, project threads) and durable packets for approved high-risk
  handoffs. Use when delegating to background agents or writing a delegation brief; `ki agent` launches runs.
argument-hint: 'audit <repo> | conform <repo> | educate <work-item> | help | refresh'
---

# Knowledge Islands delegation standard

`ki-delegation` owns two runtime-neutral contracts for delegating Knowledge Islands work to agents:

- **Background runs** - routine delegation to background agents: detachment, coordinator responsiveness, the run packet, prompt shape, authority tiers and their footers, the decisions log, coordination, the run queue, monitoring, low-noise reporting, and project threads with their bootstrap and project recap. Read [the background-run standard](references/standards-background-runs.md) before launching or briefing a background agent.
- **Delegation packets** - the durable, reviewable brief for an approved high-risk handoff, embedded in its work record. Read [the delegation-packet standard](references/standards-delegation-packets.md) before designing a packet.

[The generated rubric](references/rubric.md) carries the mechanical and judgment criteria, and [the sources](references/sources.md) the refresh review.

It does not select work, authorise execution, choose a model, accept results, or transfer work between repositories. `ki agent` in `tools-ki` is the reference launcher and holds the runtime adapters; this skill names no runtime-specific mechanics.

Use a packet only when an approved delegated change has enough mutation risk, cross-agent handoff, or later audit need that its fixed decisions and authority boundaries must be durable. Every background run, with or without a packet, follows the background-run standard.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes.

Invoked as `help` / `-h` / `?`, it explains this boundary and stops.

### Mode AUDIT

Run `ki repo audit --skill ki-delegation --repo <repo>`.

The native rubric checks that this skill's authority footers exist and grant exactly their tier, then reviews run prompts against the background-run standard.

For durable packets, a roadmap record opts in by carrying `## Delegation` with both `### Locked decisions` and `### Escalate` sections plus a worker brief. The rubric checks the mechanically legible packet shape, then reviews whether packet activation, locked decisions, authority, isolation, escalation boundaries, return contract, and verification gates are actually sound.

Ordinary `## Delegation` plan notes without the packet marker remain under `ki-work-roadmap` and are not a failure here.

### Mode CONFORM

Run `ki repo conform --skill ki-delegation --repo <repo> --dry-run` before applying it.

CONFORM makes no authored packet-content change.

It never creates a packet or run prompt, chooses a worker or model, invents a locked decision, alters an escalation boundary, or grants execution authority.

### Mode EDUCATE

For a background run, explain the run packet and prompt shape, and offer `ki agent new` for a prompt skeleton with the right footer.

For one explicitly selected approved work record, explain or add the packet shape from [the delegation-packet standard](references/standards-delegation-packets.md).

Ask the delegating owner or planner to supply every semantic value; EDUCATE never guesses the delegation design or its authority tier.

### Mode REFRESH

**Precondition:** REFRESH writes only this canonical skill under `ki-agentic-harness`.

When invoked from an installed copy, stop and redirect to the harness.

Read [the sources](references/sources.md), compare delegation practice and its sources against both standards and the rubric, then update the source review in the same commit as any normative change.

### Mode HELP

Explain the two contracts and when a packet is added to a run, the project-thread bootstrap, the `ki agent` launcher, thread checkpoints in `ki-checkpoint`, Paperclip delegation in `ki-agent-coordination-paperclip`, subagent roles in `ki-subagents`, model-purpose policy in `ki-tokenomics`, and cross-repository transfer in `ki-trades`.

## Notes

- A packet makes a high-risk runtime handoff durable, authority-bounded, and reviewable; it is not a separate execution lifecycle.
- A run's state directory is non-durable, machine-local runtime state, not a `ki-checkpoint` checkpoint or a Decision Record; in-force decisions are consolidated into their durable owner.
- A project recap is a project-level roll-up, distinct from the session-level `ki-recap`.
- The local rubric is the materialised domain contract; generic execution, reporting, transaction safety, and publication remain owned by `ki`.
