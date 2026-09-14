# Batch procedure

This is the on-demand procedure for `ki-batch`.

The kind, phases, and relationship boundary live in [the skill](../SKILL.md).

## Contents

- [1. Establish authority and prepare the contract](#1-establish-authority-and-prepare-the-contract)
- [2. Validate before implementation](#2-validate-before-implementation)
- [3. Surface known questions](#3-surface-known-questions)
- [4. Run one bounded cycle](#4-run-one-bounded-cycle)
- [5. Review closure and recap](#5-review-closure-and-recap)
- [Batch retention](#batch-retention)
- [Controlled dry-run model](#controlled-dry-run-model)
- [Mandatory stops](#mandatory-stops)

## 1. Establish authority and prepare the contract

### Reviewed-item authority

Accept only an explicit candidate set.

Use the normal forward-work cycle for each candidate: `ki-next` for selection and priority and `ki-plan` for plan shape and readiness. Where bounded parallel work is useful, use runtime subagents and retain orchestration, review, and integration. If `ki-delegation` is active in the same scope, read its packet standard before creating a durable delegation packet. Resolve the selected adapter first, then resolve every candidate through that adapter.

Do not start `ki-implement` in this phase.

Check each candidate for a bounded plan, satisfied dependencies, known verification, compatible scope, and a reason it can run independently at its position in the batch.

Prepare one regular Markdown authorisation beneath `+/_BATCHES/`, named `<REPO>-BATCH-<NNN>.md` with the same frontmatter `id`. A batch is single-repository: every named record, its scope, and its run ledger are in that exact repository. Its frontmatter contains the local repository identity, explicit approval and timestamp, the SHA-256 of the approved payload, a unique run ID, expiry timestamp, ordered duplicate-free item IDs, `awaiting-review` completion target, mandatory stops, and an optional exact closure-item list. It contains all of the following:

- identifier and purpose;
- named plans in dependency order;
- repositories and files in scope;
- timebox;
- required verification;
- allowed decisions and delegation;
- explicit closure authority, if any;
- completion target; and
- mandatory stops.

The approved payload is every frontmatter value except `approved_payload_sha256` plus the authored body before `## Run ledger`, in its exact canonical form. Its SHA-256 binds the approval to the reviewed scope, plans, checks, decisions, and stops. After approval, append at most one `## Run ledger`, beginning with `<!-- ki-batch-run: <run-id> <approved-payload-sha256> -->`; the one blank-line separator required before that later Markdown heading is append-only ledger syntax and is excluded from the protected payload. The ledger records the outcome but cannot amend authority. The pure helper exposes the exact payload calculation used by its fixtures.

Present the complete authorisation for review and require explicit approval before implementation.

An omitted field is not implied authority.

### Outcome authority

Read and follow [the outcome-authority procedure](standards-outcome-authority.md). It permits generated selection and immediate execution only from affirmative current human authority, and retains exact scope, evidence, consolidated acceptance, and mandatory stops.

## 2. Validate before implementation

Resolve the approved regular local authorisation, the selected adapter, and every named canonical work item afresh. An absent, malformed, foreign, expired, unbound, duplicate, or changed authority is a no-write stop. Current outcome authority may generate the structured record as defined above; ordinary conversation, a clean gate, or an unstructured file does not substitute for it. A remote adapter stops before execution pending `KI-HARNESS-FND-014`; do not infer a local record path or call a remote API.

Confirm that each item remains `ready`, is a canonical record for the resolved local adapter, has a bounded approved plan, its dependencies remain satisfied and correctly ordered, its one repository and file or system boundary still match, its required checks are available, its delegation is authorised, and no mandatory stop has already occurred.

Apply `ki-git` shared-working-tree hygiene at this preflight: record expected `HEAD`, the pre-existing dirty paths, the thread-local touched-path set, any contested touched path, and existing staged paths. Unrelated pre-existing unstaged paths do not block an otherwise independent batch. A moved `HEAD`, untracked touched-path set, contested touched path, or another actor's staged path is a no-write stop until revalidated or coordinated.

Reject an invalid item plainly rather than quietly omitting it.

Stop the whole batch when its dependency order, authority, or completion target is no longer honest.

## 3. Surface known questions

Before starting the first record, collect every known missing decision, external dependency, conflict, or unavailable verification into one concise question set.

Do not start a record whose answer can change its scope, public contract, repository boundary, safety treatment, or completion target. Record the named decision and dependency effect in the batch ledger.

## 4. Run one bounded cycle

Run named items in dependency order.

For each independent record, invoke its normal `ki-implement` cycle and preserve that record's lifecycle transition, baseline, scope, verification, and review packet.

Use delegation only when the authorisation permits it and the item's plan supports it.

Review each completed cycle before starting a dependent one.

Append the run ledger entry per item to the approved authorisation: starting state, resulting state, baseline and resulting evidence, verification, decisions, delegation used, and any park or stop reason. The marker binds the ledger to the approved payload; it is a run account, never a parallel tracker or replacement for the canonical records.

When an item is ambiguous or blocked, park it with the evidence, named decision needed, and dependency effect.

Continue only items proven independent of the parked item and within the authorisation.

## 5. Review closure and recap

Records reach `awaiting-review` through `ki-implement`; the batch does not self-certify delivery evidence.

Invoke named batched closure through `ki-accept` only when the authorisation expressly grants that authority for those records. Outcome-authorised `done` completion is consolidated human authority, not agent self-approval: re-check each item’s exact review packet and current repository evidence before recording closure.

Otherwise stop each record at awaiting-review for normal human review.

After the run, produce a concise `ki-recap`-shaped record of delivered items, verification, decisions, parks, failures, deferred work, and proposed learning routes.

Pruning is never implied by batch completion.

## Batch retention

`+/_BATCHES/` holds temporary inputs to further repository work: the authority and run account for a bounded batch. `_AUTHORISATIONS` is retired with no discovery fallback. Changing the storage name does not change approval, payload hashing, run binding, or closure authority.

Regular `ki-next` and `ki-recap` runs remove eligible inactive batch records using this shared rule. A batch is eligible only when its last verified activity is strictly more than seven days old and every named item's useful outcome is retained in its canonical work record or committed history. The age basis is the latest of the last Git commit changing that exact path, the last recorded run activity, approval time, and timebox end. Filesystem modification time is not evidence. Exactly seven days old is not eligible.

The caller must verify each exact flat `<REPO>-BATCH-<NNN>.md` path beneath `+/_BATCHES/` is a regular file inside the physical Git root with no symlinked ancestors, is committed, and has identical HEAD, index, and working-copy bytes. It must inspect the complete record and ledger, confirm the batch is inactive and every named work record has no running implementation or delegated work, and verify that retained canonical outcome evidence covers every item. Keep active batches, running work, uncommitted or concurrently changed files, malformed or unbound payloads, unknown states, missing retained outcomes, and unverifiable activity timestamps. Report these exceptions without broadening cleanup to other working areas or record types.

The pure `selectExpiredBatches({ repositoryIdentity, now, records })` function in `scripts/internal/batch-retention.ts` validates the approval payload and ledger binding and returns exact `selected` paths, `retained` paths with reasons, and `writes: false`. Each record carries `path`, `contents`, `regularContainedFile`, `committedUnchanged`, `lastGitChangeAt`, `lastRecordedActivityAt`, `batchState`, and one `items` evidence entry per named item (`id`, `state`, `retainedOutcomeEvidence`). The booleans and activity evidence are observations supplied by the process, never defaults or inferences from age. The helper neither reads files nor removes them.

Immediately before deletion, the process must revalidate HEAD, index, working bytes, file containment, and inactivity against the selected evidence; if anything changed, retain the record. Delete only the selected exact paths, commit only those owned deletions under `ki-git`, and report what was removed and its recovery through Git history. Routine batch cleanup is already authorised by this retention policy; it does not authorise work-item pruning, acceptance, or deletion of other working-area records.

## Controlled dry-run model

`scripts/internal/authorisation.ts` exposes a pure approval-payload calculation and a regular-file resolver. `scripts/internal/batch-cycle.ts` exposes a pure `evaluateBatchCycle()` helper. Their focused fixture tests prove that changed approval payloads, mismatched run records, duplicate IDs, unresolved or remote adapters, non-canonical or out-of-scope records, missing plans/checks, unauthorised delegation, stops, reversed dependencies, moved `HEAD`, absent touched-path tracking, contested or staged paths, a failed gate, an unready item, an unsatisfied dependency, and an early decision produce a named no-write outcome. They also prove unrelated pre-existing unstaged paths remain compatible with bounded delivery.

The model may report `coordinate` only for an authority-bound, same-repository set of named canonical Ready items through a locally executable selected adapter whose touched paths are tracked and uncontested. It verifies current evidence for outcome authority and complete closure scope for a `done` target. It does not invoke any skill, run a command, write a file, or mutate an item.

## Mandatory stops

Stop the affected item and escalate for a public-contract change outside the approved plan, material scope expansion, destructive or irreversible work, a new external dependency or coordination need, failed required verification, push or release, or an unapproved decision.

Do not continue by broadening the authorisation, guessing the decision, or converting a stop into a silent omission.
