---
name: knowledgeislands-streams
description: >
  Operate and govern the Streams zone of a Knowledge Islands base — the working copy of work in motion, run as the Enactment Process (the canonical change
  process: a proposal goes draft → ready → ratify → roll out → review → settle, and nothing reaches stable knowledge except through that gate). Use to start a
  stream, iterate a proposal, mark one ready, roll out an approved change, run a post-change review, and settle or reject a stream — and to audit a base's
  Streams structure (Focus lifecycle, the `Proposal` suffix, leaf/parent layout, proposal frontmatter) or conform it. Triggers: "start a stream", "create a
  proposal", "mark this ready", "roll out this proposal", "settle this stream", "what's the enactment process", "plan mode for my knowledge base", "does this
  change need a proposal", "audit my streams". For the five-zone model and note CRUD / routing use the `knowledgeislands-kb` skill, which delegates the Streams
  zone here; for Markdown / TOML house style use `knowledgeislands-authoring`.
argument-hint: 'audit | conform | iterate | propose | ready | refresh | reject | review | rollout | settle'
---

# Knowledge Islands Streams

You are operating the **`Streams` zone** of a Knowledge Islands base. `Streams/` is the base's _working copy_ — the home of work in motion, and what the user
thinks of as "plan mode." It is governed by the **Enactment Process**. A stream is one of two weights (chosen per stream): a **full proposal** — a governed
change that iterates in place, is submitted for approval, rolled out, and retired — or a **lightweight stream**, a tracker for work that isn't (yet) a formal
change to canonical content. **Nothing reaches a canonical zone (`Admin/` — the base's own operating model — `Pillars/`, and `Resources/`) except through an
approved proposal** — authority to work in a stream is granted by its presence in the workspace; authority to edit a canonical zone is granted only by approval
of a `ready` proposal that specifies the change.

The companion `knowledgeislands-kb` skill owns the five-zone model and note CRUD / routing, and **delegates the inside of `Streams/` here**; load it for
anything outside this zone. This skill carries the structure and process as fixed knowledge; only a couple of store-level **bindings** come from the host base.

The full detail lives in the references (progressive disclosure): the structure in
[the Streams structure reference](<references/Streams Structure Reference.md>), the process in
[the Enactment Process reference](<references/Enactment Process Reference.md>). The line-by-line checkable items live in
[the rubric](references/audit-rubric.md); the mechanical checker is [`scripts/audit-streams.ts`](scripts/audit-streams.ts).

## The Streams zone at a glance

A stream lives at `Streams/$Focus/$Category?/$Name…`. **Focus** is mandatory — the level of attention the stream is receiving; moving a stream between Focus
folders is an explicit act. **Category** is optional grouping within a Focus (pick one pattern per Focus: none / destination-path / status sub-grouping).

| Focus        | Meaning                             |
| ------------ | ----------------------------------- |
| `Active`     | Receiving focused attention now     |
| `Background` | Being progressed in the background  |
| `Dormant`    | Paused with intention to return     |
| `Future`     | Planned or ideated; not yet started |
| `Settled`    | Concluded                           |

Each Focus folder carries a **same-name index note** whose `## Streams` table lists each stream by Topic / Status / Priority, ordered by status then priority
(grouped by category where used). The base also keeps a cross-Focus **proposals index** in the `Streams/` zone index note.

**A full proposal carries the `Proposal` suffix** (filename, `# H1`, `title:`); a **lightweight stream** is a plain tracker note under a Focus folder and
carries none (see the Enactment Process reference for the two weights). Folder layout for a full proposal:

```text
Leaf:    Streams/<Focus>/<Category?>/<Name> Proposal/<Name> Proposal.md
Parent:  Streams/<Focus>/<Category?>/<Name>/<Name> Proposal.md          (+ slim <Name>.md index + children)
Multi:   Streams/<Focus>/<Category?>/<Name>/<ProposalName>/<ProposalName> Proposal.md
```

Full structure — Category patterns, leaf/parent/multi, index ordering — in [the structure reference](<references/Streams Structure Reference.md>).

## Status lifecycle and priority

A proposal's `status` is its position in the Enactment Process (distinct from its Focus, which is _attention_):

| Status        | Meaning                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| `draft`       | Work in progress; iterating in the proposal document                                      |
| `ready`       | Stable; no open questions; prerequisites satisfied; submitted for approval                |
| `rejected`    | Rejected; reasons recorded; terminal (may reopen as a new `draft`)                        |
| `in-progress` | Approved; rollout underway                                                                |
| `rolled-out`  | Checklist executed; stream moves to `Settled/`; post-change review pending                |
| `reviewed`    | Post-change review complete                                                               |
| `completed`   | Proven in practice; the proposal document is deleted (its knowledge now lives in a store) |

Order: `draft` → `ready` → (`in-progress` | `rejected`) → `rolled-out` → `reviewed` → `completed`. **Priority** is one of `urgent` · `high` · `medium` · `low`,
set at creation and raised as context shifts.

## Proposal document anatomy

The stream note _is_ the proposal document — a working tracker, not a knowledge store. It carries frontmatter `status`, `priority`, and `dependencies` (an array
of prerequisite proposal filenames — the machine-readable form of the `Prerequisite` rows in Inputs), plus the base's descriptive keys. Sections:

- **Inputs** — what the change draws on: `Document` / `Decision` / `Prerequisite` rows.
- **Outputs** — what it produces: `Decision` / `Artefact` rows. Complete before `ready`.
- **Checklist** — the concrete create/edit/move/delete operations rollout will perform; doubles as rollout status.
- **Open Questions** — unresolved decisions; each closed with a resolution note before `ready`.
- **Design Sections** — the substance: analysis, drafts, tables. May be extensive.
- **Governance** — a short footer declaring adherence to the process and linking back to it. **Required on every stream note.**

## Project bindings

Almost everything is fixed above. Only these come from the host base — take declarative overrides from the base's `.ki-config.toml` `[knowledgeislands-streams]`
table (the shared-file contract is owned by `knowledgeislands-repo`; validate your own table, warn on an unrecognised key, never read another skill's),
otherwise from the auto-loaded `CLAUDE.md`.

- **Process note** — the base's local change-process note that streams' `Governance` footers link to: a thin pointer to **this skill** (the canonical
  definition) plus the base's local specifics. _Default:_ `Enactment Process`. A base may host it under a non-default name or location (e.g. `kit-legal` keeps
  it under `Admin/Operations/Processes/`); declare it as `process_note = "Admin/Operations/Processes/Enactment Process"`. Resolve every `Governance` link
  through it.
- **Frontmatter scheme** — the note-type convention for zone / focus / proposal notes. The canonical scheme is the machine-readable **`type:`** key
  (`type: stream-zone` / `stream-focus` / `stream-proposal`) — `type` is the fundamental note-type marker, and the checker keys on it. A base still carrying the
  legacy `card/*` tag scheme declares `note_type_scheme = "tags"` as a transitional accommodation (like a zone alias), to be retired as it migrates to `type`.
- **Canonical zones** — the zones the gate protects, where a proposal's output lands. The knowledge **stores** a settled stream migrates into are `Pillars/`
  (internal; a base that holds it under a legacy folder name resolves it via the `knowledgeislands-kb` zone alias) and `Resources/` (external knowledge).
  `Admin/` — the base's operating model (its processes, conventions, configuration) — is equally canonical and equally gated, but receives operating-model
  changes rather than migrated subject-knowledge.

## Step 1 — Load context

1. Resolve the bindings: read the base's `.ki-config.toml` `[knowledgeislands-streams]` table and `CLAUDE.md`. **This skill is the canonical definition** of the
   Enactment Process; load the base's bound **process note** if it has one, for its local specifics (it points back here).
2. For any stream work, load the relevant Focus index and the proposal document **fresh** (never act on a cached version), plus the `Streams/` proposals index.

## Operating modes

Like every governance skill this carries **AUDIT · CONFORM · REFRESH**; its Streams-specific modes are the enactment lifecycle **ITERATE · PROPOSE · READY ·
REJECT · REVIEW · ROLLOUT · SETTLE**. Infer the mode from the request; ask if unclear. (Modes are named and alphabetical.)

### Mode AUDIT — check a base's Streams against the model

1. **Run the mechanical checker** — `bun scripts/audit-streams.ts <base-path>`. It reports PASS / WARN / FAIL on the `[M]` criteria: Focus folders under
   `Streams/`, a same-name index per Focus, the `Proposal` suffix (filename + leaf folder), and proposal frontmatter (`status` / `priority` / `dependencies`
   present; `status` and `priority` within their vocabularies). It resolves the `Streams` zone through any `knowledgeislands-kb` zone alias. Capture its output.
2. **Apply the `[J]` criteria by reading** ([the rubric](references/audit-rubric.md)): focus-index tables present and correctly ordered; the proposals index
   matches the streams present and their statuses (no lag); each stream carries a `Governance` section linking the bound process note; `completed` proposals'
   documents have been deleted and their knowledge migrated.
3. **Report** drift, FAILs first, citing paths and the fix. This audit is one part of a base audit — `knowledgeislands-kb`'s AUDIT composes it alongside the
   zone-model checks; run them together so "clean" means every applicable skill's audit passes, not just this one.

### Mode CONFORM — bring a base's Streams into line

1. Run **AUDIT** first for the gap list.
2. Apply the fixes: add missing `Proposal` suffixes and Focus/stream index notes; normalise proposal frontmatter and statuses; add missing `Governance`
   sections; reconcile the proposals index; record the process-note binding. **Confirm before moving or renaming notes** (the name-confirmation gate below);
   where the base mandates it, run the conforming itself as a proposal.
3. **Install the gate anchor if `GATE-1` flagged it missing**: add the standing directive to the base's `CLAUDE.md` / `AGENTS.md` (route canonical changes
   through a proposal; load this skill) — otherwise the gate won't fire on a plain edit, so a structurally-conformed base still leaks. But first confirm the
   base _should_ run the Enactment Process at all: a base that uses `Streams/` as a lightweight tracker, not a proposal workflow, should not be force-fitted —
   flag it for a decision rather than conforming it (a lightweight-Streams opt-out is a tracked ROADMAP candidate).
4. Re-run **AUDIT** until clean.

### Mode ITERATE — develop a proposal

Work the proposal in place: advance the Design Sections, close Open Questions with resolution notes, keep Inputs / Outputs / Checklist and `dependencies`
current, update the Focus index and proposals index on any status or priority change. Extract any durable subject-matter content to a store and link back — a
stream note accumulating deep content is a signal that knowledge needs to move.

### Mode PROPOSE — open a stream

1. Choose Focus (and Category if the base uses one) and propose the `<Name> Proposal` name and resulting path. **Wait for user confirmation before creating it**
   (offer an alternative where one is plausible).
2. Create the proposal document (leaf or parent layout) with the frontmatter and section skeleton above, `status: draft`, a priority, and the `Governance`
   footer.
3. Add a row to the Focus index and the proposals index.

### Mode READY — submit for approval

Verify there are no open questions remaining and **every prerequisite in `dependencies` has reached `rolled-out`**; complete Outputs; then set `status: ready`
and submit to the user. `ready` is a necessary condition for rollout, not authorisation to begin it.

### Mode REJECT — record a rejection

A first-class outcome, not a failure. Record the reasons in the proposal, set `status: rejected`, and settle the stream. It may reopen later as a new `draft`;
the prior rejection stays on record.

### Mode REVIEW — post-change review

After rollout, prepare an initial review summary (what went well, issues, lessons) and run it **interactively** — the summary is input, not output. Record the
final review under a `## Post-Change Review` section (or in the process note if the lesson is structural), then set `status: reviewed`. Lessons may spawn new
proposals.

### Mode ROLLOUT — execute an approved proposal

**Do not begin without explicit user authorisation** — exploratory language ("let's look at this") is iteration, not approval. Then:

1. **Re-verify each Checklist item against the live file** — plans drift between drafting and execution; the live file at the moment of execution is
   authoritative.
2. For complex or destructive steps, stage the output as a **working-area preview** first (a review checkpoint and a concrete artefact for the review).
3. Execute every create / edit / move / delete; create index notes for any new folders; update references to moved or renamed content. Use file tools, **not
   state-changing git** — leave `git add` / `commit` to the user unless instructed per-command.
4. Set `status: rolled-out` and move the stream to `Settled/` (source Focus index drops the row; `Settled` gains it). Hand off to **REVIEW**.

### Mode SETTLE — retire a stream

Confirm the stream's output already lives in its canonical zone — durable knowledge migrated to a store (`Pillars/` or `Resources/`), an operating-model change
landed in `Admin/`; mark `completed`; **delete the proposal document** (the settled marker remains, pointing to where the knowledge now lives). Test before
deleting: would any knowledge be lost? If not, delete.

### Mode REFRESH — keep the model current

This skill is the **canonical definition** of the Streams structure and the Enactment Process; REFRESH keeps that definition coherent and current against how
the live bases actually run it (the bases defer to the skill, so there is no separate canonical Model to re-anchor against).

1. **Read [the source list](references/sources.md)** — the live bases that run the process, each with a `last reviewed` date.
2. **Re-anchor against practice**: sample how the live bases run their Streams; look for a genuinely shared pattern the skill does not yet carry, a convention
   that has moved on, or a binding real bases supply that the bindings table doesn't name.
3. **Separate shared from local** — promote a cross-base pattern into the skill (the canonical definition); a single base's quirk stays a binding or its own
   local note, not a model change.
4. **Propose a diff** and confirm before writing.
5. **Update [the source list](references/sources.md)** — bump each `last reviewed` date. The record of what changed is the commit itself — history lives in git,
   not a changelog. Mandatory.

## Working rules

These apply to every change (the discipline that keeps the workspace trustworthy):

- **Name-confirmation gate.** Before creating a stream/sub-proposal or renaming one, propose the name and resulting path and **wait for confirmation** — renames
  ripple through links.
- **Keep the proposal and indexes current.** Update immediately on a decision, status change, or priority change; the canonical state must never lag.
- **Load before editing.** Reload the proposal and indexes before resuming work.
- **No `ready` while a prerequisite is below `rolled-out`.** No rollout without explicit authorisation.
- **Re-verify each rollout item against the live file** before making the edit.
- **Delete the proposal on completion** — once its content is in a store it has no residual value.
- **Out of scope** (no proposal needed): trivial typo / formatting fixes, time-bound `Calendar/` entries, person-file auto-appends, inbound `+/` triage — though
  when in doubt, prefer a proposal: the cost of a lightweight one is low, the cost of an unauthorised change to canonical content is high.

## Installing the gate

The Enactment gate ("nothing reaches a canonical zone except through a `ready` proposal") only bites if it is _consulted_ — and skills load **on demand**, so
this one will not fire on a plain "edit the X note" request that never mentions a proposal. The gate must therefore be **anchored in always-loaded context**:

- A base that runs the Enactment Process carries a standing directive in its **`CLAUDE.md` / `AGENTS.md`**: _substantive changes to a canonical zone (`Admin`,
  `Pillars`, `Resources`) go through a proposal — load `knowledgeislands-streams`; do not edit a canonical zone directly_ (trivial fixes, `Calendar/` entries,
  and `+/` triage exempt).
- `knowledgeislands-kb`'s UPDATE / SAVE modes defer here when the target is a canonical zone and the base runs the gate, rather than writing directly.
- The checker's **GATE-1** verifies the `CLAUDE.md` directive is present — so a base can't quietly lose the gate.

## Notes

- This skill governs the **inside of the `Streams/` zone**. For the five-zone model, routing into the zones, note CRUD, and session digests, use the
  `knowledgeislands-kb` skill — it knows `Streams` is a zone and delegates its internals here.
- If a base does not follow this structure, or a binding cannot be resolved and no default fits, ask rather than guess.
