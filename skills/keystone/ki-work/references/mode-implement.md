# Implement

`ki-work implement` is a subcommand of the Work guild's lead. It was the `ki-implement` process skill until the guild folded it into `ki-work` (PROCESS-SUBCOMMANDS), and keeps that skill's procedure and boundaries.

Delivers one approved, ready work record to an evidence-backed awaiting-review boundary.

Read [the implementation procedure](standards-implementation.md) and [the local authority notes](sources.md) before acting.

## What this subcommand does

`ki-work implement` owns one work record's delivery path from `ready` to `in-progress` to `awaiting-review`.

It does not choose work, create or reshape a plan, close a lifecycle, or delete a record.

1. Resolve the repository's selected adapter, then preflight its exact canonical record, readiness, approval, dependencies, and stated verification. Stop before execution when that adapter is remote.
2. Record immutable baseline evidence and transition only that record to `in-progress`.
3. Apply the approved plan within its boundary.
4. In territory or Project coordinating work, dispatch every implementation unit to a detached background run under `ki-delegation`; keep the coordinator responsive. A background run delivering this record may use bounded runtime subagents only when the approved plan or explicit authority permits them. Apply the durable-packet suitability test before a handoff.
5. Review and integrate bounded results, run the required verification, and record the evidence.
6. Create the roadmap-owned required review packet—`Delivered`, `Change Summary`, `Verification`, `Outstanding concerns`, `Post-change review`, then `Mini recap`—transition the record to `awaiting-review`, and stop.

The caller or `ki-work accept` owns the next decision.

## Relationship boundary

`ki-work recap` may surface unfinished work and learning routes, but it does not start or close implementation.

`ki-work next` selects and prepares forward work; it does not authorise its execution.

`ki-work plan` owns plan shape and readiness material; it does not replace this delivery procedure.

Kris's coordinating-work rule requires detached background runs for every unit; an in-session subagent is not such a run. Conversational bounded work may proceed directly, and a background run may use bounded subagents within its approved plan. `ki-delegation`, when active, owns run and durable-packet contracts. The delivering agent retains authority boundaries, dependency ordering, integration, verification and the final account of its unit; the coordinator retains the owner's conversation.

`ki-coordination` may deliver a frozen wave of independent records only within an unattended window's recorded grant.

It does not bypass readiness, baseline, scope, verification, or human-review gates.

## Invocation

`help` / `-h` / `?` explains this subcommand and stops, taking no action.

`implement <work>` resolves the selected adapter, then one canonical work record. It may use a roadmap item, including one under `Streams/Roadmap/`, only when the selected local adapter resolves to that record shape. Remote execution stops.

With no item, identify that an explicit approved ready item is required and stop.

## Notes

- Implementation is not autonomous authority. Stop for a missing approval, an ambiguous plan, a failed required gate, material scope expansion, an external coordination need, an irreversible action, or any decision outside the item's stated authority.
- No KI CLI command, wrapper script, runtime-specific spawning mechanism, push, release, or deletion belongs here.
- `awaiting-review` is evidence for review, never inferred approval.
