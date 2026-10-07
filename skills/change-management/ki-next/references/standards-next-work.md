# Next-work procedure

`ki-next` applies the transition rules of the adapter selected by `ki-work`.

It never treats a recap, handoff, or historic transcript as authority to write.

Its responsibility ends at selecting, promoting, deferring, or spawning due work and handing confirmed immediate work to `ki-plan` for shaping.

## Contents

- [1. Ground](#1-ground)
- [2. Triage inbound handoffs](#2-triage-inbound-handoffs)
- [3. Review relevance and capture](#3-review-relevance-and-capture)
- [4. Select candidates](#4-select-candidates)
- [5. Defer](#5-defer)
- [6. Compare, rank, and confirm](#6-compare-rank-and-confirm)
- [7. Spawn due housekeeping work](#7-spawn-due-housekeeping-work)
- [8. Finish](#8-finish)

## 1. Ground

When a `ki-recap` precedes this cycle, require its bounded handoff to be complete before starting a new selection cycle. Treat its digest as orientation only and re-ground every repository fact below.

1. Resolve the current git repository physically and read `.ki.toml`.
2. Run `ki repo audit --skill ki-work --repo <git-root>` and stop on any failure. Read its selected adapter literal and require the matching declared owner table. This process does not reimplement the base selector's semantic validation and never infers an adapter from repository shape.
3. For `roadmap`, run `ki repo audit --skill ki-work-roadmap --repo <git-root>` and stop on any FAIL or WARN. Read `ROADMAP.md`, every canonical item directly below `docs/roadmap/`, and active `docs/housekeeping/` templates; derive lifecycle status and dependencies from frontmatter.
4. For `kb-streams`, run `ki repo audit --skill ki-repo-kb-streams --repo <git-root>` and stop on any FAIL or WARN. Read the flat records and `_ISSUES.md` ledger in `Streams/Roadmap/`, plus active recurring Activity notes in the configured `ki-repo-kb-activities` collection, fresh.
5. For `github-issues` or `linear`, stop before reading or writing records: remote process execution is not implemented. Do not fall back to local paths or a compatibility representation.
6. When the repository declares `ki-trades`, run its audit and inspect validated inbound records after the clean governing-skill audits. Its `README.md` is orientation, not a record.

## 2. Triage inbound handoffs

Present every inbound record that still needs receiver judgment. Use the receiver vocabulary: **unconsidered**, **in progress**, **parked**, **clarify**, **applied**, **adopted**, **retained**, **declined**, or **superseded**. A newly copied record begins `unconsidered`; receipt is a separate delivery fact, not a decision.

Present its sender provenance, payload, constraints, current status, existing receiver rationale and linkage, and the exact available status transitions.

Require confirmation of the exact inbound file, receiver status, rationale, local linkage, and resulting local record write. Change only receiver-local fields; do not rewrite sender provenance or payload, mutate an outbound or peer copy, or delete a record as part of disposition.

For a work trade, choose between direct application and a local roadmap proposal before recording a terminal decision:

- Propose `applied` only when the trade has one bounded, reversible, independently verifiable local outcome; authority is clear; no material design decision, dependency, migration, public-contract change, or cross-repository write is involved; and an existing targeted verification gate proves the result. Present the exact local edit, verification, and commit boundary, require confirmation, apply and verify the change, commit it atomically, then record `applied` with that full verified commit ID. A documentation or configuration change is not automatically trivial merely because its diff is small.
- Otherwise propose one or more local work records. Preserve the trade's operating model, sources, alternatives, authority and safety boundaries, and unresolved questions. Require separate confirmation of each record's wording and horizon, then record `adopted` with the confirmed local linkage. Adoption does not itself prioritize, implement, accept, or complete that work.

Knowledge trades never use direct application. Record `retained` only after the knowledge is placed in a named canonical local artifact; otherwise keep the trade in progress, park it, ask for clarification, decline it, or supersede it as the evidence warrants.

Do not manufacture a roadmap item merely to close a trivial work trade. Conversely, do not use `applied` to bypass roadmap selection or review for material work.

After a terminal decision, report the next condition required by the sender's observation policy. `unattended` and `receipt` permit release after receipt; `decision` waits for a terminal decision; `completion` waits through decision and, for adopted work, local completion. Applied work and retained knowledge satisfy completion directly, while decline or supersession resolves it without completion. In progress, parked, and clarify retain the outbound copy whenever its policy still waits. Recommend receiver pruning only after sender release is observable; `ki-next` never performs a peer write or infers release from silence.

Receiver-local standing knowledge intake is not an inbound trade disposition. When `ki-trades` validates a marked `STI-*` capture against an exact active subtype grant, route the knowledge proportionately: augment an existing record only inside its established goal and boundary; create a local draft for a distinct insight, decision, dependency, or scope; or retain directly as canonical knowledge when knowledge itself is the outcome. A public contract or implementation consequence still becomes receiver-local work. Never infer selection, priority, implementation, acceptance, completion, or publication authority from the standing route, source repository, or Agora membership.

`unattended` and `receipt` are itemised observation policies only. They do not activate standing intake, grant automatic transfer or execution authority, or weaken receiver-owned disposition. Any future autonomous transport or application requires a separate explicit authority contract.

## 3. Review relevance and capture

Run this pass for `--review`, or briefly when grounded evidence shows a material concern.

Identify only evidence-backed proposals: stale or obsolete work, duplicates, changed hold conditions, changed dependencies, or an item at the wrong horizon.

Do not change adopted content until the user confirms exact wording and placement. Bounded triage capture follows the exception below.

### Capture substantive prospective work

Any identifier named before publication is provisional. Immediately before allocating, re-read the applicable `_ISSUES.md` scope; if its high-water mark differs from the inspected value or the proposed serial is not exactly one greater, discard the proposed serial and reallocate from the latest value. Then commit the ledger advance on its own, in the repository's designated roadmap writing checkout, before writing the record it reserves. Never treat a plan, recap, approval, warm session context, or an uncommitted working copy as an identifier reservation. The [roadmap standard](../../ki-work-roadmap/references/standards-repository-roadmaps.md#number-reservation) owns that ordering and the write locus it depends on.

During the current interaction, capture a distinct prospective outcome, concern, dependency, or decision once it is substantive enough to state a plain-language Goal, Context, Boundary, and decision-useful Discussion, and it passes the [graduation test](../../ki-work-roadmap/references/standards-repository-roadmaps.md#ideas-and-graduation): it is actionable, a decision with an owner and a needed-by date, or must survive the session. Goal, Context, and Boundary alone are not enough. An idea that does not yet graduate goes to its Project note's `## Ideas` section when the Project is known, otherwise to the repository's `_IDEAS.md`, as a plain bullet without identity. Do not require prior approval. Allocate the next canonical identity, create one `status: triage` record with no horizon and matching timestamps, and report the capture after writing it. Capture creates durable intake only; it does not adopt, prioritise, plan, implement, batch, accept, or prune work.

Before creating a record, search the selected adapter for an existing owner. Do not capture rhetorical examples, already-resolved observations, or duplicates. If an existing triage record owns the same Goal and Boundary, new decision-useful detail within that boundary may enrich it automatically and must advance its timestamp. If an adopted record owns the concern, report that owner and require confirmation before changing it. Adoption requires explicit human approval and remains here: it sets `status: draft`, a horizon, and `kind`, and may set `purpose`, `project` or `initiative`, and `component`. Cancellation as obsolete, rejected, duplicate, merged, or superseded requires exact human approval and routes to `ki-accept`, which records `status: cancelled` before any later prune; it is never a direct deletion. Approval alone never bypasses the lifecycle or done-before-prune rules.

## 4. Select candidates

### Non-KB repositories

1. Gather dependency-ready `now` and `next` records. Reuse their canonical record; if several are independently ready, recommend a small ranked set only when each retains its own lifecycle and the user confirms the set and order.
2. Only when none is eligible, assess `soon` records against the Next entry rule. After confirmation, change horizon to `next`, run the adapter audit, then re-evaluate it at the destination.
3. Only when Soon has no viable record, assess adopted Future work. Move directly to Next only when the full Next rule is met and Soon adds no value; otherwise move to Soon once the intended outcome and boundary are known. Re-evaluate after every confirmed move.
4. Review triage separately from candidate selection. Present the exact destination horizon, `kind`, and why it satisfies that horizon; adopt only after explicit human confirmation, then re-evaluate at the destination.
5. Exclude held records from selection. Propose a release only when their named condition changed or their review date has passed.

### Knowledge Bases

Use the same horizon vocabulary on flat `Streams/Roadmap/` records. A recurring Activity is the standing definition, not a delivery destination; due runs become linked roadmap records at the profile's declared horizon.

### Roadmap batchability screen

Before selecting one viable non-KB item, compare the whole dependency-ready candidate set for a **safe delivery synergy**. Do not promote a later-horizon item merely to create a batch: every candidate must first satisfy its normal route into immediate work. A group is a batch candidate only when all of the following are true:

- every record remains distinct with its own lifecycle, verification, and review packet;
- the items share a concrete delivery advantage, such as one bounded source surface, setup or verification pass, external coordination window, or coherent user outcome;
- their planned changes can be sequenced without conflicting writes, concealed dependencies, or one item's result changing another item's honest scope; and
- each item is independently executable at its position, with satisfied dependencies and no unapproved decision required.

Do not treat a shared Project or component, adjacent numbering, the same repository, or a desire for throughput as synergy. Related work that changes the same uncertain contract, needs a new decision, or would make a failure hard to isolate stays separate.

For each safe candidate group, present the named items in proposed order, the concrete advantage, the evidence that keeps them independent, the shared verification where relevant, and the mandatory stops that `ki-batch` will enforce. Also state why any superficially related candidate was excluded.

Require confirmation of the exact candidate set and order before planning each member through `ki-plan`. Once every selected record is Ready, offer the set to `ki-batch`. This is a preparation handoff, not implementation authority: `ki-batch` re-validates scope, readiness, verification, and stops, then requires its own reviewed authorisation before any `ki-implement` cycle begins.

If no group meets every condition, say so briefly and use the ordinary single-item selection path.

## 5. Defer

`defer <item> <horizon>` is an explicit user-confirmed move.

Resolve the exact record and identify linked dependencies before proposing it.

A defer changes horizon and keeps status, so the destination must admit that status under the [status and horizon table](../../ki-work-roadmap/references/standards-repository-roadmaps.md#status-and-horizon). Use Soon only for understood but non-immediate draft work and Future only for adopted long-term draft work needing re-scoping. Status `triage` is not a deferral destination: moving adopted work back into intake requires an explicit human disposition.

### Hold and release

Hold a record when it deliberately stops progressing until a named condition is met. Set `horizon: hold` and a `hold` mapping with `reason` (`waiting-for` an external condition or `parked` for an intentional pause), the named `condition`, and a `review` date where release cannot be observed. Keep status, `baseline_ref`, completed Steps, and review evidence; a review may wait on Hold for an unavailable reviewer. An in-progress hold older than a month should be reconsidered, because a stale baseline turns resuming into a rebase.

When the condition is observation of one or more trades, list them in `hold.trades: [TRD-…]` and state in prose whether the item awaits receipt, a terminal receiver decision, or completion of linked receiver-local work. Do not add trade identities to `blocks` or `blocked_by`: those arrays remain local work-item dependencies.

Release requires evidence that the condition changed, or a review date that prompts a fresh decision. Choose the destination horizon afresh rather than restoring the previous one, remove the `hold` mapping, and revalidate scope and dependencies at the destination.

Never silently delete, reopen, or detach a canonical execution record.

## 6. Compare, rank, and confirm

Use the **change-value profile** only when comparing viable material candidates or when a human asks for a material engineering-change comparison.

For a focused single-step fix, retain the lightweight selection path: explain the immediate reason and confirmation boundary without manufacturing a profile.

The profile makes these dimensions visible, with short evidence only for the dimensions that materially distinguish the candidates:

- **Capability** — user or system outcome enabled.
- **Comprehensibility** — reduction in ambiguity, indirection, or cognitive load.
- **Maintenance reduction** — obsolete code, duplication, or recurring manual work removed.
- **Reliability** — failure mode, verification, or recovery improved.
- **Leverage** — downstream work or users enabled by the result.
- **Delivery cost** — bounded implementation and verification effort.
- **Reversibility** — ease and safety of changing course after delivery.
- **Readiness** — decision, scope, and evidence are sufficient to begin.
- **Dependency availability** — required prerequisites, people, repositories, or services are available.

Do not calculate a composite score, store profile metadata on a work item, or imply that the profile chooses work automatically.

### Worked trade-off

Two ready candidates can both be worthwhile: a narrow local repair may have low delivery cost and high reversibility, while a compatibility improvement has higher leverage and reliability but depends on another repository.

Present those facts directly, choose only after the human confirms the order, and record neither candidate as objectively "higher value" once the unavailable dependency or chosen sequencing changes the decision.

Before a selection, adoption, promotion, or deferral write, show selected items, any proposed batch set and order, exact frontmatter or wording changes, and dependency effects. The bounded triage capture rule above is the sole no-prior-confirmation exception.

When an owner answer is needed, use the runtime's structured ask-user-questions interface if available. Put the item's current state, proposed change, consequence, and canonical record link in the question; use a clickable link only where that interface supports one, and otherwise place the link in adjacent prose. Offer the evidence-backed recommendation as the first selectable response with its reason in the option description where supported. For example, recommend moving a dependency-ready Soon item to Next when its scope is actionable, while offering to keep it in Soon. If evidence does not support a recommendation, say so. A preselected response is not an answer or approval. Use the same content in a concise prose question when no structured interface is available.

Require explicit confirmation, then run the applicable adapter audit.

Invoke `ki-plan` only after a selected record is Now or Next.

It shapes the same item through the stage-detail contract and stops for review before marking it Ready.

`ki-batch` may coordinate a confirmed synergistic group only when every member is Ready and only within an approved preparation boundary.

That handoff does not permit `ki-next` to infer batch, selection, or implementation authority.

## 7. Spawn due housekeeping work

Use the repository-native definition governed by `ki-work-housekeeping`: Project template fields are flat and hyphenated; KB Activity schedule fields are snake_case inside `housekeeping`, with `id`, `title`, and `status` at the Activity's top level. Ignore ordinary Activities without a profile and never evaluate retired Activities. Run the focused housekeeping audit before spawning; stop on invalid profiles, ambiguous identities, retained duplicate definitions, or unsafe placement. Every caller, including an external routine, uses this same admission and serialised active-run reservation rather than creating an independent run. KB profile writes also require the base's canonical-change authority.

A due-run identity is provisional until publication. Re-read the applicable issue ledger immediately before spawning and reallocate if it advanced. Commit the ledger advance on its own first, then write the spawned record and the template `active-run` linkage as one coherent change.

After grounding and before ordinary candidate selection, evaluate each active housekeeping template under the adapter's template horizon. Use `ki-work-housekeeping`'s read-only `evaluateHousekeepingSchedule({ repository, schedule, today })` capability with freshly read template fields and an explicit UTC date. Its owner standard defines calendar-or-commit eligibility, first-parent evidence, missing-history diagnostics, initial runs, and grace. Do not reimplement that calculation or treat unknown volume as zero; preserve manual confirmation, paused, and active-run guards.

For each due template, present the exact proposed work record, destination (normally Now or Next), template link, and policy effect. Spawn automatically only when the template expressly permits automatic spawning; otherwise require confirmation. The spawned record enters as `draft` and follows the ordinary shared lifecycle. In the same coherent change, set only `active-run` to the linked record identity; never change `last-run` or `last-run-ref` at spawn. `ki-accept` records successful completion by recording the actual successful completion date in `last-run`, the evidenced reviewed revision in `last-run-ref`, and clearing `active-run` only after the linked run is accepted as `done`.

Never implement a definition directly, spawn a duplicate active run, or leave a due work record in the Activity collection.

### Timestamp ownership

For a newly captured local record, write one canonical UTC-second instant to both `created_at` and `updated_at`. For any confirmed promotion, deferral, spawned-run linkage, or other semantic work-item mutation, preserve `created_at` and advance `updated_at` to the later of the current UTC second or one second after its observed value. Stop before publication when either timestamp is absent or malformed, or when the source revision changed after inspection. Read-only inventory never advances a timestamp. Remote adapters project provider-native timestamps and do not duplicate them into remote bodies.

## 8. Finish

During a normal next-work cycle, apply the `ki-batch` “Batch retention” rule to `+/_BATCHES/`. Remove inactive records as soon as useful outcomes and follow-up are dispositioned. Treat an incompletely dispositioned inactive record at or after seven days as overdue: route useful follow-up, record when none remains, then prune it. Report the exact removals. This routine maintenance is authorised without another confirmation; it does not select, accept, or prune roadmap work. No other working-area cleanup is implied.

Report each confirmed handoff disposition, synergy decision (including excluded near-matches), files changed, selected work, and audit result.

Identify `done` and `cancelled` records that are eligible for pruning when useful, but do not delete them; path- or glob-selected pruning belongs to `ki-accept`, while `ki repo roadmap prune` is the separate deterministic selected-repository sweep, which commits its deletions by default under the standardised prune message unless run with `--no-commit`. Pruning `done` and `cancelled` records is sanctioned cleanup whose archive is Git history.

If no work is eligible, identify the missing condition or scoping decision plainly.

End after reporting the confirmed selection, handoff, and audit result. Runtime context management is not a `ki-next` action or completion condition.
