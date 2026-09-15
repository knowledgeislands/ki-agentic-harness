# Batch procedure

This is the on-demand procedure for `ki-batch`. The skill owns the process boundary; this reference owns the authorisation shape and execution rules.

## 1. Select and freeze the set

Use `ki-next` to select candidates and `ki-plan` to make every admitted record honestly Ready. For reviewed-item authority, admit only the exact approved set. For outcome authority, scan the eligible repository queue first, prepare the complete non-contentious set that fits the instruction and window, record exclusions, then freeze the set once.

Every item must be canonical to the selected local adapter, in the same repository, independently deliverable or correctly dependency-ordered, and equipped with an executable plan and verification. Findings discovered after freezing are capture-only inputs to a later batch.

## 2. Prepare the lean authorisation

Create one regular Markdown file directly beneath `+/_BATCHES/`, named `<REPO>-BATCH-<NNN>.md`, with the same `id` in frontmatter:

```yaml
---
id: KI-EXAMPLE-BATCH-001
repository: https://github.com/knowledgeislands/ki-example
approved: true
approved_at: 2026-09-15T06:00:00Z
authority_mode: reviewed-items
approved_payload_sha256: <sha256>
expires_at: 2026-09-15T09:00:00Z
item_ids: [KI-EXAMPLE-001, KI-EXAMPLE-002]
completion_target: awaiting-review
policy: safe-local-v1
---
```

Outcome mode additionally requires a non-empty `authority_evidence` value. Reviewed-item mode must omit it. `completion_target` is either `awaiting-review` or `done`; `done` grants consolidated closure for every `item_ids` entry and needs no duplicate closure list.

The run ID is derived as `<batch-id>-RUN-001`. The body contains only the matching H1 and, once execution starts, the append-only `## Run ledger`. Plans, boundaries, files, checks, decisions, review packets, and remedial work stay in canonical items.

The approval hash covers every frontmatter value except `approved_payload_sha256` plus the authored body before `## Run ledger`, in exact canonical form. Append at most one ledger beginning with:

```md
## Run ledger

<!-- ki-batch-run: KI-EXAMPLE-BATCH-001-RUN-001 <approved-payload-sha256> -->
```

The marker binds the ledger to the approved payload. Ledger entries record only item ID, result, baseline, result commit, and material exception. They do not amend authority or repeat item evidence.

The repository may keep already-completed pre-change authorisations readable until normal retention cleanup so their hashes remain verifiable. That compatibility is not an alternative authoring contract; new batches use the shape above.

## 3. Validate before implementation

Resolve one approved regular local authorisation and reject unsupported or retired fields in a newly authored record. Confirm repository identity, approval, current expiry, payload hash, run binding, policy, duplicate-free exact IDs, completion target, canonical Ready records, dependency order, and locally executable adapter.

Apply `ki-git` shared-working-tree hygiene: record expected `HEAD`, pre-existing dirty paths, thread-local touched paths, contested paths, and staged paths. Unrelated pre-existing unstaged paths do not block an independent batch. A moved `HEAD`, untracked touched-path set, contested touched path, or another actor's staged path requires no-write stop and revalidation.

Surface all known missing decisions, external dependencies, conflicts, and unavailable verification before the first implementation. Do not start an item whose answer could change its authority boundary.

## 4. Run the exact set

Run named items in dependency order through their ordinary `ki-implement` cycles. Keep each item's baseline, implementation, focused verification, and six-heading review packet in that item. The operational `in-progress` transition does not require a separate commit; Ready may land as `awaiting-review` with the implementation.

Prefer this commit topology when repository state permits:

1. one preparation and authorisation commit;
2. one delivery commit for each of the `N` named items;
3. one consolidated closure commit after the aggregate gate.

This produces `N + 2` commits without weakening per-item evidence. Stop or park only the affected item, and continue solely where independence is proven. Append a concise ledger row for every admitted item, including a park or stop.

## 5. Verify and close

Run focused checks during each item cycle. After all deliverable items reach `awaiting-review`, run one aggregate repository gate. `completion_target: awaiting-review` stops there for normal human review.

For `completion_target: done`, recheck every item's current review packet and aggregate evidence, then invoke `ki-accept` once for consolidated acceptance of the full named set. Partial closure is not covered by the authorisation: park the unresolved item and stop closure, or prepare a later separately authorised batch.

Record non-blocking improvements as receiver-owned candidates for the next wave. Do not reopen delivered records or widen the active set. Pruning is never implied.

## Safe-local policy

`policy: safe-local-v1` fixes these mandatory stops:

- an unapproved public-contract decision;
- material scope expansion;
- destructive or irreversible work;
- external coordination;
- verification failure or unavailable required verification;
- push or release.

Outcome authority may cover a public-contract decision only when the current human instruction or an admitted approved item explicitly decides it. The policy name centralises common stops; it does not weaken a stricter item-level stop.

## Batch retention

`+/_BATCHES/` holds temporary authority and run-account inputs. `_AUTHORISATIONS` is retired and has no discovery fallback.

Regular `ki-next` and `ki-recap` housekeeping may remove an inactive batch only when its last verified activity is strictly more than seven days old and every named item's useful outcome remains in its canonical work record or committed history. Activity is the latest of the last Git commit changing the exact path, last recorded run activity, approval time, and expiry. Filesystem modification time is not evidence; exactly seven days is not eligible.

The caller must prove the exact flat path is a regular file within the physical Git root with no symlinked ancestor, committed with identical HEAD, index, and working-copy bytes. It must inspect the full ledger, prove the batch inactive, and provide retained canonical outcome evidence for every item. Active, malformed, unbound, uncommitted, unknown, or incompletely evidenced batches remain retained with a reason.

`scripts/internal/batch-retention.ts` is a pure selector and never reads or deletes files. Immediately before deletion, revalidate all evidence. Delete only the selected exact paths, commit only owned deletions under `ki-git`, and report Git-history recovery. This policy never authorises work-item pruning.

## Pure validation model

`scripts/internal/authorisation.ts`, `batch-cycle.ts`, and `batch-retention.ts` expose no-write helpers. Their fixtures prove payload integrity, current-shape validation, narrow retained-record readability, derived run and closure scope, adapter and work-item eligibility, dependency order, working-tree hygiene, stop handling, and conservative retention. A pure helper may report coordination eligibility; it never invokes a skill, runs a command, writes a file, accepts work, or removes a record.
