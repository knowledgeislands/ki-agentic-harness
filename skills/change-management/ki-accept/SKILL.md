---
name: ki-accept
ki-kind: process
ki-applicability: invocation-only
ki-depends-on: []
description: >
  Close a reviewed local work record as done, cancel an open record with an approved resolution, or prune
  explicitly selected eligible terminal records. Use only with human approval; use `ki-implement` for delivery,
  `ki-plan` for readiness, and `ki-next` for selection or adoption.
argument-hint: 'accept <work> | prune <work-record-or-glob>... | help'
---

# ki-accept

**Kind:** process.

Reviews the required delivery or cancellation evidence, records approved closure, retains terminal records, and prunes explicitly selected terminal records.

Read [the review-closure procedure](references/standards-acceptance.md) and [the local authority notes](references/sources.md) before acting.

## What this skill does

`ki-accept` is the only process skill that closes a work-record lifecycle. It also owns its explicitly selected terminal-record prune procedure.

1. Resolve the selected adapter and confirm one exact canonical local record at its physical root is either `awaiting-review` with the roadmap-owned six-heading review packet and passing governing audits or any open record, including triage, with an exact proposed cancellation `resolution`: obsolete, rejected, duplicate, merged, or superseded. Remote adapters stop.
2. Present the delivery review packet or proposed cancellation and require human approval. Batch closure authority may close only the named delivery record, never a cancellation.
3. Record approved closure as `done` or `cancelled`, removing the horizon, retain the terminal record, and ensure that state lands before any later pruning. A failed review returns the record to `in-progress` instead.
4. Prune only fully resolved regular `done` or `cancelled` records selected beneath the exact adapter root, excluding records retained by an unresolved completion-observation trade; selection is deletion authority. A prune-only commit may remove several eligible records together, contains no lifecycle transition or unrelated work, and carries the standardised message: subject `chore(roadmap): prune <N> done work record(s)`, singular for one record, and one `- <ID>` body line per record in identifier order.

It never chooses work, starts implementation, edits plan scope, reconstructs missing verification, or treats a recap or passing command as human approval.

## Relationship boundary

`ki-recap` identifies unfinished work and may recommend a review-closure action; it never closes or deletes a record.

`ki-next` captures and adopts forward work and may surface retained records. It routes an approved cancellation here; it never closes or invokes deletion.

`ki-plan` owns plan shape and the ongoing record, but terminal closure and explicitly selected pruning belong here.

Runtime subagents can help execute bounded review preparation only when separately authorised; they cannot approve or delete. `ki-delegation`, when active, supplies the durable packet standard.

`ki-batch` may request batched closure only when its approval-bound explicit authorisation grants it for the named record. It never grants pruning authority.

`ki-work-housekeeping` owns template shape and `ki-next` owns spawning. After a linked run is accepted, this skill alone advances the evidenced completion date `last-run` and reviewed revision `last-run-ref`, then clears `active-run`. Failed, abandoned, and superseded runs retain the active link until an explicit disposition clears it or a replacement atomically substitutes a new linked identity; neither advances successful-run evidence.

## Invocation

`help` / `-h` / `?` explains this skill and stops, taking no action.

`accept <work>` resolves the selected adapter, then reviews one canonical local work record. Delivery closure requires `awaiting-review` and stops for human authority unless an approval-bound batch authorisation explicitly permits that named closure. Cancellation requires exact human approval of its `resolution`, with a qualified `resolution_target` for duplicate, merged, or superseded; the target may sit in another repository, and only the owning repository closes its own record. Batch authority never substitutes. Remote execution stops.

`prune <work-record-or-glob>...` resolves each explicit pathname or glob only under the selected local adapter's canonical root (`docs/roadmap/` or `Streams/Roadmap/`), rejects traversal, symlinks, incomplete resolution, and retained trade-linked records, verifies every resolved regular work record is `done` or `cancelled`, then deletes exactly that set. Quote shell globs. The invocation is the deletion authority: do not ask for a second confirmation. Remote execution stops. Use `ki repo roadmap prune` only for the non-KB deterministic repository-roadmap sweep; it commits its deletions by default under the standardised message, and `--no-commit` leaves them for a manual commit under the same message.

With no target, identify the required exact accepted item or terminal records and stop.

## Notes

- This is a process skill, not a universal AUDIT / CONFORM / EDUCATE / REFRESH checker.
- Human approval is the default; it is never inferred from a clean gate, a commit, a recap, or silence.
- Terminal records are retained until their committed `done` or `cancelled` state precedes a dedicated prune-only commit. Pruning is sanctioned cleanup: Git history is the archive, and pruned records are not restored. `ki repo roadmap prune` makes the prune commit by default unless run with `--no-commit`. Process pruning is explicit destructive cleanup in either local adapter; native roadmap pruning is an intentionally explicit non-KB selected-repository sweep.
- No KI CLI command, wrapper script, runtime-specific mechanism, push, or release belongs here.
