---
name: ki-delegation
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern agent delegation: routine detached background runs (run packet, prompt shape, authority footers,
  decisions log, coordination, run queue, monitoring) and durable packets for approved high-risk
  handoffs. Use when delegating to background agents or writing a delegation brief; `ki agent` launches runs and
  `ki-pmo` governs the coordinating work that launches them.
argument-hint: 'audit <repo> | conform <repo> | educate <work-item> | help | refresh'
---

# Knowledge Islands delegation standard

`ki-delegation` owns two runtime-neutral contracts for delegating Knowledge Islands work to agents:

- **Background runs** - routine delegation to background agents: detachment, the run packet, prompt shape, authority tiers and their footers, the decisions log, coordination, the run queue and monitoring. Every agent report is an owner report in the shape the [`ki-pmo` standard](../../change-management/ki-pmo/references/standards-pmo.md#owner-report) sets. Read [the background-run standard](references/standards-background-runs.md) before launching or briefing a background agent. The coordinating work that launches runs - territory work or Project work, its responsiveness, report forms, glyph banner, openers, bootstrap, decision classes and working rules - is governed by [`ki-pmo`](../../change-management/ki-pmo/references/standards-pmo.md), which depends on this skill.
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

Explain the two contracts and when a packet is added to a run, the `ki agent` launcher, coordinating work and its bootstrap in `ki-pmo`, the work file in `ki-checkpoint`, Paperclip delegation in `ki-agent-coordination-paperclip`, subagent roles in `ki-subagents`, model-purpose policy in `ki-tokenomics`, and cross-repository transfer in `ki-trades`.

## Notes

- A packet makes a high-risk runtime handoff durable, authority-bounded, and reviewable; it is not a separate execution lifecycle.
- A run's brief, the decisions log and agent reports live tracked in the work folder, `+/_WORK/<id>/`, of the work that launched it, the brief as `briefs/<name>.md` until its report is received, committed at each send, and at each mark the coordinator deletes by explicit path every report whose queries are all answered and whose outcome has a durable home and every brief whose report it has, while Git history holds the rest; the state directory holds machine-local runtime files only. A run report closes with the glyph banner and carries no reply block. Neither folder is a Decision Record, and the work file in it is `ki-checkpoint`'s: in-force decisions are consolidated into their durable owner, and a prompt or record describes a decision in the owner's words and its date, never by its number.
- Coordinating work's Summary, recap since the mark and full summary are `ki-pmo`'s forms; each is an owner report in `ki-pmo`'s shape, and `ki-recap` stays the single-session summary.
- The local rubric is the materialised domain contract; generic execution, reporting, transaction safety, and publication remain owned by `ki`.
