# Review closure and pruning procedure

This is the on-demand procedure for `ki-accept`.

The kind, authority boundary, and relationship map live in [the skill](../SKILL.md).

## 1. Resolve the record and closure evidence

1. Resolve the physical Git root and the selected adapter through `ki-work`; never infer an adapter from a filesystem shape.
2. Stop before reading or writing an operational record when the adapter is unresolved or remote. Remote discovery, stale-read checks, and every mutation remain unavailable.
3. Resolve one canonical regular local record under the selected adapter's exact root. `roadmap` uses `docs/roadmap/`; `kb-streams` uses `Streams/Roadmap/`.
4. Classify the proposed closure as delivery acceptance, failed review, or cancellation.
5. For delivery, confirm that the record is `awaiting-review`, every planned Step is complete, and its immutable delivery evidence is present. Confirm `## Review` occurs immediately before `## Discussion` and contains, exactly once and in order, `### Delivered`, `### Change Summary`, `### Verification`, `### Outstanding concerns`, `### Post-change review`, and `### Mini recap`. Confirm that the governing audits pass on the record as it will be committed: the selected adapter's record audit (`ki-work-roadmap` for `roadmap`, `ki-repo-kb-streams` for `kb-streams`), `ki-authoring`, and every audit the record's own `Verify` names, judged by that section's stated criterion. A failing governing audit blocks closure, and there is no waiver: repair the failure and re-run, or return the record to `in-progress` under a failed review.
6. For cancellation, confirm that the record is open: `triage`, `draft`, `ready`, `in-progress`, or `awaiting-review`. Present exactly one proposed `resolution` - `obsolete`, `rejected`, `duplicate`, `merged`, or `superseded` - and its rationale. Duplicate, merged, and superseded name a `resolution_target`: another canonical work-item identifier, which may belong to another repository. A same-repository target must resolve in the selected roadmap; a cross-repository target is checked by reading it where available and is otherwise accepted by shape. Obsolete and rejected name no target. Do not require execution Steps, delivery evidence, or a Review packet. Only the owning repository closes its own record: never close or edit the target, or a record in another repository, from here.
7. Re-check current repository evidence that materially affects the proposed closure decision.

Do not repair missing delivery or review evidence by inference. Return a record to implementation only through an explicit new decision; this procedure does not silently reopen or reshape it.

## 2. Obtain closure authority

Present the exact canonical record, its six-part delivery review packet or exact proposed cancellation, known concerns, and proposed terminal state.

When the owner must decide, use the runtime's structured ask-user-questions interface if available. Include the canonical record link, the proposed disposition, material evidence or concern, and what approval would close. Put a reasoned recommendation first among selectable responses: recommend closure only when the evidence supports it, otherwise recommend retaining the current state. Use adjacent prose for the link if the interface cannot render it, or a prose question with the same context if no question tool exists. A preselected response is not approval.

Require explicit human approval before writing `done` or `cancelled`. A standing human grant counts only when quoted with its source and it covers the exact record.

The sole exception is an approved `ki-batch` authority whose payload and run binding are still valid and which explicitly grants delivery closure for this exact record. Batch authority never cancels a record. An authority that merely permits execution, delegation, reporting, or a different named record is not closure authority.

## 3. Record, retain, and reconcile completion

Append the terminal closure evidence required by the selected local adapter and set the approved record to `done` or `cancelled` in one coherent change, removing its horizon and any `hold` mapping.

For delivery, append `## Done` against the six-part Review packet. For cancellation, set `status: cancelled`, the approved `resolution` and any required `resolution_target`, and insert `## Cancelled` immediately before `## Discussion`: who approved it and when, why, and any outstanding changes it leaves. For a cross-repository target, also name the target's repository and path so the evidence survives pruning. Keep `baseline_ref` as it stands and do not fabricate delivery evidence or adoption.

A failed review sets an `awaiting-review` record back to `in-progress` with the findings recorded in `Discussion`; it is not a terminal transition.

Retain the terminal record as recoverable history. Do not delete it as part of closure.

The closure transition does not require a standalone commit and may land with its coherent acceptance evidence or directly coupled reconciliation. It must, however, land as a committed `done` or `cancelled` record before any later prune commit.

For a linked housekeeping run, verify that the template's `active-run` names this exact work-record identity and that the run's `housekeeping_template` and `scheduled_for` evidence agree. Only after the accepted completion is recorded, atomically set the template's `last-run` to the evidenced actual successful completion date, set `last-run-ref` to the verified full commit covered by that review, and clear `active-run`. Keep the original `scheduled_for` unchanged. This intentionally replaces the former scheduled-date advancement rule; do not backfill old dates. Follow `ki-work-housekeeping` for anchor validity: a commit-triggered template requires verified reviewed-revision evidence, not an inferred implementation baseline, current HEAD, or closure commit. Calendar-only templates may retain a null anchor.

Resolve the definition by its stable identity under the placement owned by `ki-work-housekeeping`. In a KB this is the Activity note: write only `housekeeping.last_run`, `housekeeping.last_run_ref`, and `housekeeping.active_run` for successful closure, preserving all other Activity metadata and narrative. The base's canonical-change authority must cover these bounded evidence updates. Project definitions retain their flat hyphenated fields. The same field mapping applies to explicit non-success dispositions below; an external task's completion is not KI acceptance.

Failed, abandoned, and superseded runs do not advance successful-run evidence and retain their `active-run` link until a separate explicit template disposition or replacement. A disposition clears the old link without changing `last-run` or `last-run-ref`. A replacement atomically substitutes the already-created, verified new linked identity without changing `last-run` or `last-run-ref`; `ki-next` alone creates that new linked draft. Never infer a disposition or replacement from a failed gate, missing evidence, or silence.

When recording local acceptance, preserve `created_at` and advance `updated_at` to the later of the current UTC second or one second after its observed value. Compare the observed source revision immediately before publication and stop on source drift, a absent or malformed timestamps. Review and prune-only reads do not advance timestamps; remote adapters project provider-native values.

## 4. Prune explicitly selected terminal records

Pruning a `done` or `cancelled` record is sanctioned cleanup. Git history is the archive: the parent of the prune commit holds each record, and pruned records are not restored.

1. Accept one or more explicit canonical work-record paths or filename globs. Resolve their complete matching set only beneath the selected local adapter root: `docs/roadmap/` for `roadmap` or `Streams/Roadmap/` for `kb-streams`. Reject absolute paths, parent traversal, an empty or incomplete match, symlinks, directories, and files outside the canonical work-record shape. The caller should quote a shell glob so the procedure receives it.
2. Resolve the full matching set before deleting anything. Confirm every result is a regular canonical record with `status: done` or `status: cancelled`.
3. For each candidate, inspect declared trade evidence. Refuse to prune a done record linked from an adopted completion-observation trade until sender release is observable. Missing or uncertain trade evidence is a stop, not permission.
4. The explicit paths or globs are the deletion authority. Do not ask for a second confirmation merely because the complete resolved set contains more than one done item.
5. Before deleting anything, apply the cross-repository reference preflight below to every record in the set. Repair orphaning references and statements that depended on the record to stay true in a separate commit ahead of the prune. That keeps the prune-only commit to deletions and preserves inspectable evidence.
6. Confirm repository history contains every selected record in its terminal state in a commit earlier than the proposed deletion. Delete only the complete resolved regular eligible set, then run the applicable repository gates. Commit the removal of one or more eligible records as a dedicated prune-only commit containing no lifecycle transition or unrelated work. Do not broaden the supplied glob, prune an accepted-but-not-done item, follow a symlink, or delete a record merely because it looks old. Use the standardised message: subject `chore(roadmap): prune <N> done work record(s)`, singular for one record, and a body of one `- <ID>` line per record in identifier order.

### Cross-repository reference preflight

Search the owning repository and relevant accessible peers identified by the selected registry or Agora scope, declared relationships, and known inbound references. Include an identified archived or deregistered peer: removal from discovery does not remove its links. Report the roots searched and any relevant unavailable source; a local-only scan is not evidence that peer references are absent. Do not silently widen access to unrelated repositories or fetch private sources.

Use mechanical searches for each candidate's canonical path, filename and identifier, then resolve matches as relative Markdown links, wikilinks or repository URLs. Distinguish references removed by the same approved prune from surviving references. A bare historical identifier is not automatically a dangling link; a commit-pinned reference survives only when the named committed record is verified. Review whether surviving prose still depends on the candidate for rationale, authority or correction, rather than treating every search hit as a blocker.

Preserve useful references by linking to the appropriate durable current document or a verified immutable Git-history copy. Verify that the chosen history locator is available to its intended readers; a local Git object alone does not prove a hosted URL resolves. Repair only within the authorised repository scope, committing repairs before deletion. Prune approval does not authorise peer edits, unarchiving, publication or a trade-projection rewrite. If an orphaning reference cannot be repaired within that authority, or relevant reference evidence is unavailable, retain the affected Done record and report the exact blocker. Continue pruning only independently safe candidates; never claim exhaustive cross-repository coverage from an incomplete scan.

`ki repo roadmap prune` is a separate native non-KB host operation: it sweeps every selected repository's canonical regular `done` roadmap items after validating the complete selected set. It does not approve closure, choose records by inference, delete a non-terminal or retained-trade record, or replace this procedure when an explicit path or glob selection is required. Complete the reference preflight before invoking it; the command does not supply that evidence. By default it commits each repository's deletions itself as one prune-only commit under the standardised message, staging exactly the deleted record paths and running the repository's hooks; it refuses before deleting anything when the repository is not a Git work tree, already has staged changes, or holds an untracked or modified selected record, and a rejected commit restores the deleted records. `--dry-run` makes the same selection and checks and reports the records and planned commit without changing anything. `--no-commit` only deletes the records and skips those Git checks, so confirm each record's committed `done` state and commit the deletions alone under the same message.

## Controlled acceptance models

`scripts/internal/acceptance-cycle.ts` and `scripts/internal/prune-selection.ts` expose pure no-write models. Their focused fixtures cover adapter resolution, remote refusal, canonical-root lifecycle evidence, exact review headings, human approval-bound batch authority, cancellation resolution evidence and human-only authority, housekeeping success and non-success dispositions, traversal, symlink, incomplete-set, non-terminal, prior committed-`done`, retained-trade, and eligible selected-prune paths with a prune-only commit boundary and its standardised commit message. The models do not read a live adapter, alter lifecycle state, update a template, delete a file, run a command, or contact an external system.
