# Portable checkpoint standard

A checkpoint is a concise repository-owned reconstruction snapshot for one active human-named thread. It lets a fresh agent continue useful work without relying on a transcript, private runtime state, or a vendor session.

## Contents

- [Activation and ownership](#activation-and-ownership)
- [Record location and identity](#record-location-and-identity)
  - [Coordination-thread naming](#coordination-thread-naming)
- [Thread label](#thread-label)
- [Thread role](#thread-role)
- [Exact record form](#exact-record-form)
- [Optional runtime reminder consumers](#optional-runtime-reminder-consumers)
- [Update lifecycle](#update-lifecycle)
  - [Recap-supplied hand-off evidence](#recap-supplied-hand-off-evidence)
- [Resume lifecycle](#resume-lifecycle)
- [Removal lifecycle](#removal-lifecycle)
- [Prohibited payloads and claims](#prohibited-payloads-and-claims)
- [Audit and conform boundary](#audit-and-conform-boundary)

## Activation and ownership

The capability is optional. A repository declares `ki-checkpoint` in `.ki.toml`; declaration requires the owned physical `+/_CHECKPOINTS/` subarea and exact `README.md` scaffold, retained even when no checkpoint records exist. `ki-repo` owns the generic `+/` scaffold and detects an undeclared specialist subarea, while `ki-checkpoint` alone interprets checkpoint records.

The repository owns its active checkpoint content. Explicit removal deletes a record after durable information has been routed; Git supplies any recovery history.

## Record location and identity

An active checkpoint is one regular Markdown file at `+/_CHECKPOINTS/<thread>.md`. There is no retired-record state or `_RETIRED` directory.

`<thread>` is a non-empty, human-selected single path component. It cannot be `.` or `..`, contain a path separator, or encode an opaque runtime-session identifier. The filename stem, `thread` field, and H1 must agree exactly. There is at most one active record for a thread; nested, timestamped, symlinked, archived, and alternate layouts are invalid.

### Coordination-thread naming

Where the repository keeps a Project registry ([the Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md)), a checkpoint for a Project's coordination thread is named `<initiative>.<project>`, using the `initiative` key from the Project note and the Project's own key, for example `techne.agent-host` or `rig.mac-studio-bootstrap`. Related checkpoints then sort together. A territory Capital's [state-of-play thread](../../../change-management/ki-pmo/references/standards-pmo.md#state-of-play-thread) is named `_state-of-play`, so that it sorts first; there is one per Capital and no other repository has one. A checkpoint with no Project keeps a plain human-selected name, prefixed with an Initiative key only when one obviously fits.

The full name appears in the filename stem, `thread` field, and H1. When a Project moves to another Initiative, rename its checkpoint, `thread` field, H1, and every reference in the same change.

A human opener names only the Project, for example `Re-bootstrap as the agent-host coordination thread under ki-pmo.`; [RESUME](#resume-lifecycle) resolves it to the full name.

The `ki-pmo` [Thread naming](../../../change-management/ki-pmo/references/standards-pmo.md#thread-naming) model gives every thread an authoritative id with a slug and title derived from it, and owns their form. These names, the label rule below and the `id` and `title` front-matter fields move to it only through the migration the owner approves; until then this section and [Thread label](#thread-label) govern.

## Thread label

An active record carries an optional `label`: the exact name the human gives the thread in their editor or agent client, so that it can be copied straight in. Its form is a path of segments joined by ` > `, which Kris adopted on 2026-10-15 from the thread list `KI > SoP`, `KI > Model > ways of working`, `KI > Model > knowledge acquisition`, `KI > Rig > mac studio setup`, `KI > mics / webcams`, `Acquire > intake (sol)` and `Chezmoi > misc (sol)`: "this is a better way I think".

- **State-of-play thread:** `<Space> > SoP`, for example `KI > SoP`.
- **Coordination thread:** `<Space> > <Initiative> > <project in words>`, for example `KI > Model > ways of working` or `KI > Rig > mac studio setup`, the Initiative written as its short display name and the Project's key written as words.
- **Conversational thread, or a checkpoint with no Project:** `<Space> > <topic>`, for example `KI > mics / webcams`.
- **Host:** a `(<host>)` suffix only when the thread is limited to that machine, as in `Acquire > intake (sol)`; a thread that resumes from its checkpoint anywhere names no host, consistent with `ki-pmo`'s rule that no thread state or resume line names a host. Kris set the suffix in these words: "no, the machine is only added if its limited to that machine, so intake and chezmoi misc are machine specific".

`<Space>` is the short display name of the group heading the editor shows the thread under, which is the repository: `ki-principal` shows as `KI`, `acquire` as `Acquire` and `chezmoi` as `Chezmoi`. It is the short name, not the heading verbatim.

Labels written before 2026-10-15 take the earlier form `<Initiative title>: <project>`, such as `KI Model: ways-of-working`, and the state-of-play thread's `Master: state-of-play`. They stay valid until the owner approves each change; a label is never rewritten without that approval. The mapping is mechanical: `KI Model: ways-of-working` becomes `KI > Model > ways of working`, `Master: state-of-play` in the Knowledge Islands Capital becomes `KI > SoP`; the Initiative title loses its Space and the Project key its hyphens.

A label is presentation only. Resolution and identity always go by the thread name and Project name, never the label, and a label may change without renaming the record. A missing label is a recommendation (WARN), not a failure.

## Thread role

An active record may carry an optional `role`, the one authoritative declaration of the thread's type: `conversational`, `coordination` or `state-of-play`. An absent field, or no checkpoint at all, means `conversational`, the default `ki-pmo` already gives a thread with no stated type. Kris chose the field on 2026-10-16 under ROLE-FIELD: "An optional checkpoint front-matter field `role: conversational | coordination | state-of-play`, absent meaning conversational, coordinating values valid only where `[skills.ki-pmo]` is declared, with existing coordinating checkpoints migrated through their own updates."

- `coordination` and `state-of-play` are valid only in a repository whose `.ki.toml` declares `[skills.ki-pmo]`. The declaration stays the capability gate and is never the role: it covers every session in the checkout.
- This standard owns the field and its validation; [`ki-pmo`](../../../change-management/ki-pmo/references/standards-pmo.md#thread-types) owns what each value means.
- Nothing else is authority for the role: not the label, a native session name, the file name or path, the presence of a checkpoint, the repository declaration, an output style, a hook line or a cached copy. An explicit current-thread owner instruction overrides the field for that session only, and an agent offers to write the field rather than writing it unasked.
- An existing coordinating checkpoint gains its `role` through its own thread's next update, at the latest on the `FIRST-STEP` line of its messages block at restart; another thread never edits it directly to add one.

## Exact record form

An active record has exactly these frontmatter fields, with `label` recommended, `role` optional under [Thread role](#thread-role), and every other field required:

```yaml
---
type: ki-checkpoint
thread: ki.portable-checkpoints
label: 'KI > Knowledge Islands > portable checkpoints'
state: active
created_at: 2026-08-06T12:00:00Z
updated_at: 2026-08-06T14:30:00Z
---
```

When present, `label` is a non-empty single-line string; quote it in YAML because it contains `>` or, in the earlier form, a colon. When present, `role` is one of `conversational`, `coordination` or `state-of-play`, placed after `label`, as in `role: coordination`.

Timestamps use UTC RFC 3339 second precision. `created_at` is no later than `updated_at`.

After frontmatter, the record uses exactly this heading sequence, with substantive content beneath every H2:

```markdown
# ki.portable-checkpoints

## Objective

## Current state

## Decisions made

## Files touched

## Open questions

## Next step
```

The H1 repeats the thread name exactly. `Decisions made`, `Files touched`, and `Open questions` may say `None` when that is the truthful current state; an empty section is not a useful reconstruction snapshot.

A coordinating thread under `ki-pmo` keeps its parked side topics in `Open questions` as dated one-line items, under [its parking rule](../../../change-management/ki-pmo/references/standards-pmo.md#parking-tangents); they never form an additional H2.

It also notes in `Current state` the `ki-pmo` revision it last read, under [its refresh rule](../../../change-management/ki-pmo/references/standards-pmo.md#refreshing-this-guidance). It keeps its mark there too, as one line under [its mark rule](../../../change-management/ki-pmo/references/standards-pmo.md#recap-since-the-mark); striking a new mark replaces it.

A conversational thread's checkpoint is this record and nothing more: no pick-up block, mark, resume line or messages block, which `ki-pmo` keeps for coordinating threads under [Coordinator-only machinery](../../../change-management/ki-pmo/references/standards-pmo.md#coordinator-only-machinery). It notes a pause in `Current state` and how to carry on in `Next step`.

## Optional runtime reminder consumers

A runtime-specific reminder consumer is separately opt-in. It may act only when its native event contract is independently evidenced and all of the following are true:

1. The repository declares `ki-checkpoint` and resolves to one physical repository root.
2. The runtime adapter is explicitly enabled in that runtime's own configuration; the portable `ki-checkpoint` declaration remains an empty capability marker.
3. The adapter receives one exact, human-selected thread name from that explicit runtime configuration. It resolves only `+/_CHECKPOINTS/<thread>.md`; directory scans, newest-record selection, runtime-derived names, and archived or nested fallback are forbidden.
4. The resolved record is a regular active checkpoint that satisfies this standard's identity and closed-schema requirements.

The only first-delivery action is a compact reminder that the already-selected record may need an explicit update. The consumer does not create, update, remove, select, or reword a checkpoint; infer work status or completion; invoke `ki-recap`; read a transcript or vendor session; or expose a session identifier. Repeated, interrupted, malformed, unknown, absent, or otherwise unsafe input is a quiet no-op. The native runtime adapter owns its event semantics, registration, timeout, exit behaviour, and any actionable failure text; the portable contract supplies no shared hook or fallback.

## Update lifecycle

Create or update a checkpoint only on explicit user request or a documented repository-local trigger, such as before context compaction, after a substantive decision, after a repository commit, or before a known pause. A generic Stop event is not authority to create or choose a checkpoint.

An update replaces the active snapshot in place, preserves `created_at`, and advances `updated_at`. It never appends timestamped copies or transcript history. Git is the history mechanism.

Another coordinating thread may add one line to a coordination checkpoint's messages block under `ki-pmo` and commit that path alone; that is not an update and does not advance `updated_at`. The owning thread's next update removes each line it has acted on.

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from a checkpoint. The checkpoint may name those canonical artifacts; it must not become their only copy.

### Recap-supplied hand-off evidence

An explicit `ki-recap checkpoint <thread>` invocation may supply grounded evidence to this update lifecycle. The composition does not grant write authority or weaken validation: the repository must declare a valid `ki-checkpoint` capability, the user must select exactly one human-named thread and explicitly authorise its update, and the checkpoint procedure must refuse any repository mismatch, stale baseline, ambiguous thread, interrupted update, or incomplete work state.

The supplied hand-off names the physical repository identity, immutable committed baseline or one complete portable patch against that baseline, scoped authority, result destination, and expected verification. A transcript, runtime session, shared filesystem, or provider snapshot may be available to the caller but is never required evidence and cannot replace those portable inputs. The checkpoint records concise reconstruction state and references to durable owners; it does not embed the patch, become the result store, or take ownership of the delegated work.

## Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected thread name or, from an opener, the Project name.
2. Resolve to one exact active path: `+/_CHECKPOINTS/<thread>.md` when that file exists; otherwise the single `+/_CHECKPOINTS/*.<project>.md` record whose final dot-separated component is the Project name; and `_state-of-play.md` for the state-of-play thread (`state-of-play`). If no file or more than one file matches, stop and ask the human which record is meant.
3. Read the whole record and validate its identity and `state: active`.
4. Reconstruct the work from the six sections and continue from `Next step`.

The label never takes part in resolution.

Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that produced the checkpoint.

## Removal lifecycle

Removal requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts reached their proper owners. Then delete the exact active file. Retain the exact `+/_CHECKPOINTS/README.md` scaffold while `ki-checkpoint` remains declared.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested checkpoint layouts are invalid.

## Prohibited payloads and claims

A checkpoint contains reconstruction state, not a transcript. It has no vendor-session field, conversation URL, runtime identifier, message log, or role-by-role dialogue. Its prose must not claim that a future agent can access or reopen the originating session.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. Project and Initiative notes ([the Project registry standard](../../../change-management/ki-work/references/standards-project-registry.md)) supplement it as the durable home of status. `ki-recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#optional-runtime-reminder-consumers). It does not grant write authority, choose a thread, invoke recap, read session material, or turn a portable procedure into a native host operation.

## Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT requires the declared repository's physical checkpoint subarea and exact retained README scaffold. It reports absent scope as not applicable only when `ki-checkpoint` is undeclared, and rejects symlinks, unsupported nesting, and any retired-record layout.

CONFORM never authors checkpoint-record content or lifecycle transitions. It may create or restore the retained README scaffold and publish the generated rubric, but it cannot create, update, or remove a checkpoint record because those actions need a human-selected thread and explicit write authority.
