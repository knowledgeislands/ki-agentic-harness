# Repository roadmap standard

## Scope

This standard applies to non-KB repositories.

A repository whose `.ki.toml` declares `repo_type = "kb"` uses `ki-repo-kb-streams` and must not add a parallel project `ROADMAP.md` or `docs/roadmap/` tree. It may declare `[skills.ki-work-roadmap]` alongside `[skills.ki-repo-kb-streams]` to configure the shared record model, issuing areas and components; the declaration does not select the project `roadmap` adapter. Streams remains the KB container and audit owner.

## Contents

- [Canonical shape](#canonical-shape)
- [Status and horizon](#status-and-horizon)
- [Lifecycle moves](#lifecycle-moves)
- [Ideas and graduation](#ideas-and-graduation)
- [Migration tolerance](#migration-tolerance)
- [Work-item discipline](#work-item-discipline)
- [Lifecycle commit boundaries](#lifecycle-commit-boundaries)
- [Trade review](#trade-review)
- [Conform and educate](#conform-and-educate)

## Canonical shape

Every non-KB repository uses one shape.

```text
ROADMAP.md                              # concise orientation
docs/roadmap/
  _ISSUES.md                            # durable issue-allocation ledger, sorted first
  README.md                             # area definitions, fixed-area mode only
  <REPO>-<NNN>-<slug>.md                # repository-wide issuing mode
  <REPO>-<AREA>-<NNN>-<slug>.md         # fixed-area issuing mode
```

`ROADMAP.md` is a concise stable orientation that points to `docs/roadmap/` and explicitly does not duplicate the work-item queue.

CLI tooling reports and filters the canonical items.

Each work-item file is canonical and owns its full authored detail.

Its frontmatter `title` is a compact label of at most four words. The file slug remains a stable identifier aid and need not repeat or constrain the title.

There are no simple or thematic profiles, theme `ROADMAP.md` files, `plans/` directories, item locators, or standalone plan records.

The item identifier is globally unique within its repository. A repository chooses one issuing mode: repository-wide `<REPO>-<NNN>`, or fixed-area `<REPO>-<AREA>-<NNN>`.

**Structural validity.** A roadmap container is structurally valid when every direct-child Markdown record other than `_ISSUES.md` (and, in a knowledge base, the `Roadmap.md` index note) begins with valid canonical frontmatter whose `id` matches its filename identifier, and no two retained records share an `id`. Any command that claims structural validation of a roadmap container reports each violation with a stable diagnostic and a non-zero result; one inspection path must not pass or silently skip what another rejects. This invariant is the shared floor, not the full record format, which this standard and the work-item format own.

`<REPO>` is the stable uppercase alphanumeric `repo_code` in the `ki-repo` table and matches `[A-Z0-9][A-Z0-9-]{1,23}`.

`<AREA>` is an uppercase code for a fixed issuing namespace. It is selected when the item opens, recorded as `area:` frontmatter, and never changes. It is not a mutable theme or group.

`<NNN>` is a zero-padded serial allocated from `001`. In repository-wide mode it is one repository sequence. In fixed-area mode it is one sequence per area. Never lower a high-water mark, fill a gap, or reuse a number after pruning. An identifier proposed during planning is provisional, not reserved. A serial becomes reserved only when its advanced ledger is committed, and the commit that advances the ledger precedes the commit that writes the record. The writer must re-read the applicable `_ISSUES.md` high-water mark immediately before allocating, allocate one greater than that current value, and commit the advance before the record exists. If the ledger changed since inspection, discard the proposed serial and reallocate from the latest value. [Number reservation](#number-reservation) owns the ordering and the write locus it depends on.

`docs/roadmap/_ISSUES.md` is the canonical durable allocation ledger. Repository-wide mode uses `last_id`; fixed-area mode uses a code-sorted `areas: { AREA: N }` map. The checker verifies that the ledger matches the configured issuing mode and no retained item exceeds its applicable high-water mark; CONFORM scaffolds the file only when it is absent.

The filename repeats the identifier followed by a lowercase kebab-case slug.

`area` declares only the issuing namespace. Grouping lives in the classification fields of [the work-item format](standards-work-item-format.md#classification): `kind`, `purpose`, `project`, `initiative`, and `component`.

A repository in repository-wide mode declares no issuing vocabulary. A fixed-area repository declares its durable area codes as a list:

```toml
[skills.ki-repo]
repo_code = "KI-HARNESS"

[skills.ki-work-roadmap]
areas = ["FND", "GOV"]
components = ["skills", "checker"]
```

In fixed-area mode every item's `area` must be one of the declared codes. A repository must not mix issuing modes.

The `areas` list holds codes only. A fixed-area repository defines what each code covers in its roadmap index, under an `## Areas` heading that names every declared code in backticks:

- a project repository uses `docs/roadmap/README.md`, which is an index, not a record;
- a Knowledge Base uses its `Streams/Roadmap/Roadmap.md` index note.

The definition is short prose: what work the area issues, and where its boundary with neighbouring areas lies. The checker warns for each declared code the index does not name. A retired code keeps its definition while retained records use it.

The optional `components` list is the repository's kebab-case vocabulary for which part of the repository a record touches. An item's `component`, when present, must be declared there. Components are repository-owned; Projects and Initiatives are territory-owned and live in the [Project registry](../../ki-work/references/standards-project-registry.md).

Keep statuses, horizons, lifecycle moves, work-item location, and reporting behaviour universal rather than per-repository configuration.

The former `theme` grouping is deprecated. The area-to-theme map (`areas.FND = "foundation-tooling"`) and the `themes = [...]` list remain readable with a checker warning during the [migration tolerance window](#migration-tolerance); new configuration uses the area list.

## Status and horizon

`status` says how far work has got; `horizon` says when it is intended. They are independent axes.

`status` is one of `triage`, `draft`, `ready`, `in-progress`, `awaiting-review`, `done`, or `cancelled`. `triage` is captured but unadopted intake; `done` and `cancelled` are the two terminal endings.

Every adopted, open record carries exactly one `horizon`. In selection order:

1. `now` - receiving current delivery attention; plans permitted.
2. `next` - the next bounded work to prepare or begin; plans permitted.
3. `soon` - understood but not yet started.
4. `future` - adopted long-term work that still needs re-scoping before it becomes actionable.
5. `hold` - deliberately not progressing until a named release condition is met.

The horizon rule is one line: `horizon` is present if and only if the record is adopted and open. Triage, done, and cancelled records omit the field rather than carrying `null`.

| Status | Allowed horizon |
| --- | --- |
| `triage` | none |
| `draft` | `now`, `next`, `soon`, `future`, `hold` |
| `ready` | `now`, `next`, `hold` |
| `in-progress`, `awaiting-review` | `now`, `hold` |
| `done`, `cancelled` | none; kept as history |

Starting implementation moves the record to Now in the same change, so Now holds work in flight and Next holds work prepared to follow. Views may report the Now count as a signal; there is no cap.

Hold replaces the former Waiting for and Parked horizons. The record's `hold` mapping gives its `reason`: `waiting-for` an external condition, or `parked` as an intentional pause. A held record keeps its status, `baseline_ref`, completed Steps, and review evidence, so a review may also wait on Hold for an unavailable reviewer. The checker warns on an in-progress hold whose `updated_at` is more than 31 days old, because a stale baseline turns resuming into a rebase.

The root orientation holds no horizon headings or item list.

Terminal work is removed only through the lifecycle and pruning commit boundary below.

Continuous practices belong in a standard or orientation file, not among finite work items. Recurring obligations stay as `ki-work-housekeeping` templates or KB Activities whose runs are ordinary records.

### Triage

A substantive prospective outcome, concern, dependency, or decision that passes the [graduation test](#ideas-and-graduation) may be captured as `status: triage` without prior approval after checking for an existing owner. Creating one does not adopt, prioritise, plan, implement, or accept the work. A human must explicitly approve every exit from triage: adoption to `draft`, or cancellation. Approval does not bypass the terminal-before-prune rule, and triage has no direct discard path.

## Lifecycle moves

Moves are authored, judgment-led decisions. CONFORM never chooses a move; it only repairs the concise root orientation. Every destination must satisfy the status and horizon table.

| Move | Rule | Owner |
| --- | --- | --- |
| Adopt | `triage` -> `draft`, setting a horizon and `kind`, with explicit human approval | `ki-next` |
| Defer | change horizon and keep status | `ki-next` |
| Hold | horizon -> `hold` with a reason, a named release condition, and a review date where release cannot be observed; status, `baseline_ref`, completed Steps, and review evidence are kept | `ki-next` |
| Release | evidence that the hold condition changed; choose a horizon afresh and revalidate scope and dependencies | `ki-next` |
| Replan | `ready` -> `draft`; replanning in-progress work keeps its baseline and delivered evidence and replaces only the remaining plan, under renewed approval | `ki-plan` |
| Start | `ready` -> `in-progress`, moving the record to Now in the same change | `ki-implement` |
| Accept | `awaiting-review` -> `done`, removing the horizon in the closure change | `ki-accept` |
| Failed review | `awaiting-review` -> `in-progress` | `ki-accept` |
| Cancel | any open record, including triage, -> `cancelled` with a `resolution` and a `## Cancelled` section, with explicit human approval; the horizon is removed | `ki-accept` |
| Duplicate across repositories | cancel with `resolution: duplicate` or `merged` and a qualified `resolution_target`; only the owning repository closes its own record | `ki-accept` |

A defer keeps status, so its destination must admit that status: ready work moves only among Now, Next, and Hold, and in-progress or awaiting-review work leaves Now only for Hold. Moving lifecycle work to an earlier horizon than the table admits is a replan or a cancellation, not a defer.

- **Future -> Soon** requires enough scope to state the intended outcome and boundary.
- **Future -> Next** is permitted when one review establishes the Future minimum plus actionable scope, understood dependencies, and readiness to start; state why Soon adds no useful shaping stage and re-evaluate at Next.
- **Soon -> Next** requires actionable scope, understood dependencies, and readiness to start.
- **Hold -> another horizon** is a release. It requires evidence that the named condition changed, or a review date that prompts a fresh decision, and the destination is chosen afresh rather than restored.
- A move back to **Soon**, **Future**, or **Hold** must preserve honest wording and any linked item lifecycle state.

`now` and `next` are the only horizons in which an item may be shaped into an execution-ready plan or enter implementation.

An item may be expanded with executable steps only after it reaches one of those horizons and the user confirms the work.

An immediate item may remain `status: draft` while `ki-plan` shapes it.

It becomes `status: ready` only after its execution detail and verification are reviewable, its dependencies are satisfied, and the user approves it for implementation. A held ready or in-progress record keeps its plan and resumes only after release.

When no immediate work is eligible, `ki-next` evaluates Now and Next first, then Soon, then Future. Held records are excluded from selection until released. Triage review is a separate intake activity and never makes a record selection-eligible without explicit adoption.

Every confirmed move is re-evaluated at its destination.

## Ideas and graduation

An idea has no identifier, horizon, or status, and never owns state. It waits outside the record queue:

- in its Project note's `## Ideas` section when a Project is known, under the [Project registry](../../ki-work/references/standards-project-registry.md); or
- otherwise as a plain bullet in the repository's `docs/roadmap/_IDEAS.md`, or `Streams/Roadmap/_IDEAS.md` in a Knowledge Base, beside `_ISSUES.md`.

`_IDEAS.md` is not a record. It carries no identity, the structural-validity invariant skips it, and CONFORM never creates or rewrites it. Graduation links the new record from the idea's place and removes the bullet, keeping useful research in the record.

Goal, Context, and Boundary alone are not enough to make a record. After checking for an existing owner, an idea graduates to a `status: triage` record only when:

- (a) it is **actionable**: the next step is known and no unmade decision blocks it;
- (b) it is a **decision** with an owner and a needed-by date, adopted as `kind: decide`; or
- (c) it must **survive the session**: it is deferred, delegated, multi-step, or reviewed by someone else.

Unknown implementation is fine for an investigation or decision, and a missing prerequisite alone does not make capture premature. `ki-next` places an idea that does not yet graduate in its Project note's Ideas section when the Project is known, and in `_IDEAS.md` otherwise. This test governs record capture only; it does not change any repository's Enactment threshold.

## Migration tolerance

The model stays at v1: new fields and statuses enter v1 directly, and new records use the new shape immediately. While existing records migrate, the checker tolerates these deprecated shapes with a warning, never a failure:

- a `theme` field;
- `horizon: waiting-for` or `horizon: parked`, including `waiting_on_trades` at `waiting-for`;
- `horizon: triage`, whether open intake at `status: draft` or a terminal disposition at `status: done` with `intake_disposition` or `intake_disposition_target`;
- a `done` record still carrying a horizon;
- a `ready`, `in-progress`, or `awaiting-review` record at a horizon the former rule allowed but the table above does not, such as in-progress at Next;
- an adopted record without `kind`;
- the area-to-theme map or `themes` list in `.ki.toml`;
- a Capital's legacy `Streams/Projects/Initiatives.md` index in place of `Streams/Initiatives/` notes.

The checker still validates deprecated fields where the former rule did, at warning severity. A new-shape value that is present but invalid fails immediately. A repository that passed the former checker gains no new failure. Rejection of the deprecated shapes follows once every repository's open records are migrated, under a separate record. This section is the one place that window is defined.

## Work-item discipline

When an item has verified tasks in Paperclip or another task system, keep their qualified, provider-keyed `task_links` on that item using the [work-item format](standards-work-item-format.md#task-links). This is an association record, not a second lifecycle, a live ownership claim, or a central task registry. Write and reconcile it only through the repository's [designated primary checkout](#roadmap-write-locus).

Every item conforms to [the work-item format](standards-work-item-format.md), including the final topic-oriented `Discussion` section and the detail required at its current horizon and lifecycle state.

An item begins with a mandatory plain-language Goal, then its outcome evidence, boundary, current context, and enough discussion to preserve decision-useful reasoning.

At Soon, shaping records the intended approach, known dependencies, open decisions, and promotion conditions.

When multi-file or multi-step execution is selected for immediate work, `ki-plan` enriches that same file in place with current state, steps, files, verification, dependencies, and delegation where appropriate.

It never creates a duplicate plan file.

This adapter owns the concrete local record lifecycle independently of `horizon`; the base selector owns only abstract lifecycle vocabulary:

`triage` → `draft` → `ready` → `in-progress` → `awaiting-review` → `done`, with `cancelled` reachable from any open state.

`triage` is unadopted intake; `draft` covers adopted work that is captured or actively shaped. The [status and horizon table](#status-and-horizon) governs where each state may sit.

`ki-implement` owns `ready` → `in-progress` → `awaiting-review`.

Its start transition records the immutable full `HEAD` commit in `baseline_ref`; its completion writes the required review packet.

`ki-accept` owns explicit `awaiting-review` → `done`, human-approved cancellation of any open record, including triage, and pruning selected by an explicit work-record path or glob. Cancelling triage intake does not adopt or implement the work.

`ki-recap` and `ki-next` may identify or recommend eligible pruning, but they never delete a work-item record.

`blocks` and `blocked_by` use work-item identifiers, must be reverse-consistent and acyclic, and cannot permit execution while a blocker is not done. Because that check gates execution on the blocker's lifecycle, only genuine build order belongs in the field: declare it when the work cannot be built without something that does not exist yet, and withdraw it once that thing exists. A declaration standing on a related record's approval state, rather than on missing work, makes the audit fail for a reason that is not true and holds executable work behind a review queue.

An optional `hold.trades: [TRD-…]` list identifies the exact trade records whose observable progress forms a hold condition. It is valid only at `horizon: hold`, contains unique canonical trade identities, and never replaces or extends `blocks` or `blocked_by`. The item body states the exact condition being observed: receipt, a terminal receiver decision, or completion of receiver-local work linked from an adopted trade.

An explicit later prune path or glob removes only the resolved `done` or `cancelled` items; the selection itself is the deletion authority and does not need a second confirmation. `ki-work-housekeeping` templates may spawn linked ordinary work records; their cadence does not create a second delivery lifecycle.

A done work item linked from an adopted completion-observation trade remains retained until sender release is observable. Roadmap review and pruning report that external reference as a guard and refuse to remove the linked work record while it is unresolved.

Every process-owned lifecycle or semantic work-item mutation preserves `created_at`, advances `updated_at` monotonically, and refuses to replace a changed source revision. Remote adapters project provider-native timestamps rather than duplicating them into remote bodies. The work-item format owns the precise timestamp contract.

## Lifecycle commit boundaries

Lifecycle states record operational truth; a transition does not create a mandatory standalone Git commit. Commit a status update with the coherent planning, implementation, review, or closure changes it describes. Git history need not contain every intermediate lifecycle state: an item's first committed form may already be `ready` when capture, shaping, and readiness approval form one coherent operation, and implementation may take a committed `ready` item to `awaiting-review` with its delivery changes after passing through `in-progress` operationally. The state that lands must satisfy its own evidence and authority gates.

Pruning is the exception. Repository history must contain the selected item as `done` or `cancelled` in a commit earlier than the commit that deletes it. A prune commit contains only the removal of one or more explicitly selected, eligible terminal work records; it does not combine a lifecycle transition, implementation, acceptance, or unrelated change. This preserves an inspectable accepted record before its later cleanup without forcing every earlier transition into a separate commit.

Pruning a terminal record, `done` or `cancelled`, is sanctioned cleanup. Git history is the archive: the parent of the prune commit holds the record, and pruned records are not restored. The prune commit uses one standardised message so every cleanup is recognisable in the log: the subject `chore(roadmap): prune <N> done work record(s)`, singular for one record, and a body with one `- <ID>` line per record in identifier order. `ki repo roadmap prune` writes this commit itself by default, staging exactly the deleted record paths and running the repository's hooks; it refuses before deleting anything when the repository is not a Git work tree, already has staged changes, or holds a selected record that is untracked or modified, and a rejected commit restores the deleted records. `--dry-run` makes the same selection and checks and reports the records and planned commit without changing anything. `--no-commit` only deletes the records and skips those Git checks, so the caller confirms each record's committed `done` state and commits the deletions alone under the same message.

### Number reservation

Number reservation is the other exception, and it orders two commits rather than separating them. Advance the applicable `_ISSUES.md` high-water mark and commit that advance on its own, then write the record. The ledger advance may not wait for the record it reserves.

The ordering, not the coupling, is what makes a reservation real. Publishing a record together with its advance is safe against one writer and unsafe against two: two writers that read the same high-water mark both believe they own the next serial, and neither discovers the collision until the second record is written. Re-reading the ledger immediately before publication does not close that window, because the window is between the read and the commit. A committed advance is observable to every other writer at the moment the reservation is taken, which is the earliest point at which it can be observed at all.

The reservation commit contains only the ledger advance. It is not a lifecycle transition and carries no work-item evidence, so it does not weaken the rule that a state which lands must satisfy its own gates. Nothing else reserves a number: a plan, an approval, a warm session, a branch name, or an uncommitted working copy is not a reservation.

### Roadmap write locus

A committed advance only reserves a number if every writer commits to the same history. Two isolated checkouts that each commit an advance on their own branch reproduce the collision exactly, one merge later.

Every write under the roadmap directory — capture, shaping, a lifecycle transition, acceptance, or a prune — is therefore serialised through one designated writing checkout per repository, and concurrent writers queue there rather than each holding their own. A run that works in an isolated checkout for delivery does not use it for roadmap records; it takes its number and writes its record in the designated checkout. Where a coordination plane schedules those runs, its own standard names which checkout is designated; this standard requires only that exactly one is.

## Trade review

Where a repository declares `ki-trades` and its records exist, include their structural relevance in the judgment portion of a roadmap audit.

- **Inbound:** identify each submission that still needs receiver review or a separately confirmed local roadmap proposal. A trade status, including adopted, does not create or prioritize a work item.
- **Outbound:** identify observable receiver progress that may warrant an originating follow-up. The receiver owns disposition, priority, execution, and acceptance.
- **Holding:** confirm that each `hold.trades` identity names an existing relevant trade and that the prose names its precise observed condition without treating the trade as a local dependency.
- **Pruning:** identify a done item still referenced by an adopted completion-observation trade whose sender release is not yet observable; it is not prune-eligible.

The review is read-only and reports structural guidance or proposed local roadmap action only.

It does not set disposition, infer adoption or acceptance from silence, move or prune trade records, prioritize local work, or change another repository's state.

## Conform and educate

`ki repo conform --skill ki-work-roadmap --repo <repo> --dry-run` shows the exact root-orientation replacement.

CONFORM repairs that orientation and creates a missing issue-allocation ledger only when every canonical item is valid.

It never invents an item, changes a horizon, changes lifecycle status, removes authored prose, reallocates an identifier, or edits an item body.

`ki repo educate --skill ki-work-roadmap --repo <repo>` scaffolds the root orientation only when the repository has no roadmap artefacts.

It does not create speculative work-item files.
