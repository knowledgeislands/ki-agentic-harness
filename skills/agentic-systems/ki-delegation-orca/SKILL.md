---
name: ki-delegation-orca
ki-kind: process
ki-applicability: invocation-only
ki-depends-on: [ki-delegation, ki-coordination]
description: >
  Start, wait on, steer, stop and close Orca supervised workers as a KI delegation launcher, on attended Macs for a work
  package that opts in. Use when a coordinator dispatches runs through `orca orchestration`; `ki-delegation` owns the
  portable run contract, `ki-coordination` the coordinating work, and Orca's own `orchestration` skill its command
  mechanics.
argument-hint: 'start <brief> | wait | status | steer <dispatch> | stop <dispatch> | close <dispatch> | recover | help'
---

# KI delegation — Orca

**Kind:** process.

This is the Orca adapter in the delegation family Kris chose under ORCH-NAME-DISPATCH on 1 November 2026: `ki-delegation` keeps the portable delegation contract and `ki agent` remains the floor launcher. This adapter owns only how a coordinator starts, waits on, steers, stops and closes Orca supervised workers. The brief, authority footer, report shape and owner report stay in `ki-delegation`; the turn budget, receive, mark, hold, Finished and the close-out of Orca workers stay in `ki-coordination`.

It stays a process skill, as Kris took ORCA-SKILL-KIND a) on 7 November 2026, revisited only if Orca use needs auditable criteria. Being a process skill is no way round the shared standards: a change to who writes reports, how runs detach or who holds authority is made in the governance skill that owns that rule.

Orca's own `orchestration` and `orca-cli` skills own command mechanics, flags and receipts. This skill names the commands Knowledge Islands relies on and the rules it lays over them, and nothing in it is an Orca setting.

Read [the Orca delegation standard](references/standards-orca-delegation.md) before launching an Orca worker, then [its migration file](references/standards-orca-delegation-migration.md) for the interim rules and trial tests that still apply. Read [the source record](references/sources.md) only when refreshing Orca-facing claims.

## Procedure

1. **Check reach.** Use Orca only on an attended Mac and only for a work package whose decisions log records its opt-in, and check that the unit has no other recorded launcher and is not already running; otherwise use `ki agent`. → [When Orca launches](references/standards-orca-delegation.md#when-orca-launches)
2. **Start.** One Run per package per coordinator session, its objective starting with the work id; one worker per brief, with the brief's runtime as its agent and the checked brief as its spec. → [Start](references/standards-orca-delegation.md#start)
3. **Wait.** One detached, bounded `check --wait`, re-armed after each wake, as the launcher's `wait`. → [Wait](references/standards-orca-delegation.md#wait)
4. **Steer, stop and read status** without treating silence or `unverifiable` as a stall, stopping a worker only on the owner's named word. → [Status, steering and stopping](references/standards-orca-delegation.md#status-steering-and-stopping)
5. **Receive and close out** each settled worker: read the report and the Git log, copy the report into the work folder, then close it out under `ki-coordination`'s Closing out Orca workers, and start the next queued worker. → [Receive and close-out](references/standards-orca-delegation.md#receive-and-close-out)
6. **Recover** after a coordinator session changes by making a new Run and settling the old one's workers. → [Recovery](references/standards-orca-delegation.md#recovery-after-a-coordinator-session-changes)

`help`, `-h` or `?` explains this boundary, the procedure and what the migration file still holds, then stops.

## Boundaries

- It never chooses Orca for a package without a logged opt-in, never runs Orca on `vega`, and never treats an Orca automation as a wake.
- It never stores a Run, Task or Dispatch id in a work-package file, and never hand-edits Orca's state.
- It never releases a worker without an accepted settlement, never releases in place of stopping, and never deletes Orca conversation history.
- It grants no authority: the brief's tier footer and the coordinating work's decisions govern what each worker may do.
