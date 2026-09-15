# Portable checkpoint standard

A checkpoint is a concise repository-owned reconstruction snapshot for one active human-named thread. It lets a fresh agent continue useful work without relying on a transcript, private runtime state, or a vendor session.

## Activation and ownership

The capability is optional. A repository declares `ki-checkpoint` in `.ki.toml`; only then may it use the owned `+/_CHECKPOINTS/` subarea. `ki-repo` owns the generic `+/` scaffold and detects an undeclared specialist subarea, while `ki-checkpoint` alone interprets checkpoint records. An absent `_CHECKPOINTS` directory is quiet and means there is no active checkpoint scope.

The repository owns its active checkpoint content. Explicit removal deletes a record after durable information has been routed; Git supplies any recovery history.

## Record location and identity

An active checkpoint is one regular Markdown file at `+/_CHECKPOINTS/<thread>.md`. There is no retired-record state or `_RETIRED` directory.

`<thread>` is a non-empty, human-selected single path component. It cannot be `.` or `..`, contain a path separator, or encode an opaque runtime-session identifier. The filename stem, `thread` field, and H1 must agree exactly. There is at most one active record for a thread; nested, timestamped, symlinked, archived, and alternate layouts are invalid.

## Exact record form

An active record has exactly these frontmatter fields:

```yaml
---
type: ki-checkpoint
thread: portable-checkpoints
state: active
created_at: 2026-08-06T12:00:00Z
updated_at: 2026-08-06T14:30:00Z
---
```

Timestamps use UTC RFC 3339 second precision. `created_at` is no later than `updated_at`.

After frontmatter, the record uses exactly this heading sequence, with substantive content beneath every H2:

```markdown
# portable-checkpoints

## Objective

## Current state

## Decisions made

## Files touched

## Open questions

## Next step
```

The H1 repeats the thread name exactly. `Decisions made`, `Files touched`, and `Open questions` may say `None` when that is the truthful current state; an empty section is not a useful reconstruction snapshot.

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

Write durable decisions, accepted work state, or reusable knowledge to their proper owners before referring to them from a checkpoint. The checkpoint may name those canonical artifacts; it must not become their only copy.

## Resume lifecycle

The manual portable flow is deliberately small:

1. Require the user-selected thread name.
2. Resolve only the exact active path.
3. Read the whole record and validate its identity and `state: active`.
4. Reconstruct the work from the six sections and continue from `Next step`.

Do not search archived or nested paths as a fallback. Resume creates a fresh working context; it does not reopen, locate, or authenticate to the conversation that produced the checkpoint.

## Removal lifecycle

Removal requires explicit user direction; an agent must not infer completion from record content, a quiet session, or a Stop event. First confirm durable facts have reached their proper owners. Then delete the exact active file. If it was the final record, the empty `+/_CHECKPOINTS/` directory may also be removed.

No retired copy is kept. Git is the recovery mechanism, so `_RETIRED`, archive, timestamped-copy, and other nested checkpoint layouts are invalid.

## Prohibited payloads and claims

A checkpoint contains reconstruction state, not a transcript. It has no vendor-session field, conversation URL, runtime identifier, message log, or role-by-role dialogue. Its prose must not claim that a future agent can access or reopen the originating session.

It is also not a completion signal, roadmap, decision record, knowledge store, or session recap. `ki-recap` owns the user-facing judgment-led recap; the relevant governance skill owns each durable artifact. An optional runtime reminder consumer may use only an already-selected valid record under [its explicit contract](#optional-runtime-reminder-consumers). It does not grant write authority, choose a thread, invoke recap, read session material, or turn a portable procedure into a native host operation.

## Audit and conform boundary

AUDIT, CONFORM, and EDUCATE are currently hosted `ki repo` operations. REMOVE, RESUME, and UPDATE remain explicit agent procedures until a host operation is implemented and independently verified. AUDIT checks only the declared repository's physical checkpoint subarea. It reports absent scope as not applicable and rejects symlinks, unsupported nesting, and any retired-record layout.

CONFORM never authors checkpoint content or lifecycle transitions. It may publish the generated rubric, but it cannot create, update, or remove a checkpoint because those actions need a human-selected thread and explicit write authority.
