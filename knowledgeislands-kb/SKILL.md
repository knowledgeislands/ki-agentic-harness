---
name: knowledgeislands-kb
description: >
  Interact with a Knowledge Islands knowledge base: save AI outputs as notes, update existing notes, query the base, distil a conversation into notes, or write
  a session digest. Targets the Knowledge Islands structure (Calendar / Pillars / Resources / Streams, plus inbound `+` and outbound `-`), so it assumes the
  zone model rather than asking for it; only a few store-level bindings come from the host project. Triggers: "save to my notes", "save to the knowledge base",
  "add to the KB", "what do my notes say about", "search my notes", "update the note on", "capture this", "write a session digest". Where a knowledge base ships
  its own named extension skill, prefer that skill; it extends this one.
argument-hint: 'save | update <note> | query <question> | extract | digest'
---

# Knowledge Islands KB

You are helping the user interact with a **Knowledge Islands** knowledge base - a markdown store organised to the Knowledge Islands structure. This skill
carries the operating modes and the structure itself; only a handful of store-level details come from the host project. It assumes the zone model below and does
not ask the project to redefine it.

## The Knowledge Islands structure

A Knowledge Islands base is one markdown store with a fixed set of zones. Each top-level folder carries an index note of the same name.

| Zone         | Holds                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `+/`         | Inbound - unfiled captures awaiting routing. Exempt from most conventions.                      |
| `Calendar/`  | Time-stamped records: daily, meeting, session, weekly, monthly notes.                           |
| `Pillars/`   | Internal canonical knowledge - the base's primary subject matter. One folder per pillar.        |
| `Resources/` | External reference material that exists independently of this base.                             |
| `Streams/`   | Work in motion - active workstreams and evolving projects; migrates to `Pillars/` once settled. |
| `-/`         | Outbound - produced artefacts (session digests, compiled outputs).                              |
| `Admin/`     | Base-agnostic governance and operations.                                                        |

**Pillars** are the second-level unit of organisation: each whole knowledge base is an "island"; within it, a Pillar is a major strand of its subject matter (a
case, a client, a domain, a theme). A base may use one Pillar or many.

### Routing test

Most-specific match wins:

1. Time-bound record -> `Calendar/`.
2. Active, in-progress work -> `Streams/`.
3. Settled internal knowledge -> `Pillars/<Pillar>/`.
4. External reference (would exist without this base) -> `Resources/`.
5. Unsure -> `+/<Title>.md` at the most specific applicable level.

### Memory cascade

Root index `Admin/MEMORY.md` lists the active Pillars. Where the base is Pillar-scoped, scope a session to one Pillar and load `Pillars/<Pillar>/MEMORY.md` (and
any per-Pillar profile index) before substantive work. Treat other Pillars as off-limits unless the user switches.

## Project bindings

Almost everything is fixed by the structure above. Only these come from the host project - take them from the auto-loaded `CLAUDE.md`, then the root memory
index, then the project's extension skill if it ships one:

| Binding           | What the project supplies                                                                    | Default if absent                                 |
| ----------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Notes store       | Canonical alias and location of the notes store                                              | The connected base; refer to it as "the base"     |
| Sources store     | Whether a paired sources store exists, and how note extracts mirror its paths                | None                                              |
| Scope usage       | Whether the base is Pillar-scoped (declare an active Pillar) or single-Pillar / flat         | Pillar-scoped                                     |
| Writing standards | Language variant, citation format, structural norms                                          | British English; cite source paths; concise prose |
| Domain pre-flight | Any extra reads before drafting (profiles, domain context) - usually via the extension skill | None beyond the memory cascade                    |

## Step 1 - Load context

1. The host `CLAUDE.md` (auto-loaded) is the authority on the bindings above; follow it. Read the root `Admin/MEMORY.md` for active Pillars.
2. If the base is Pillar-scoped, declare or confirm the active Pillar, then load `Pillars/<Pillar>/MEMORY.md` and any profile index. Confirm: "Session scoped to
   [Pillar]." If the user switches Pillar mid-session, re-scope before proceeding.
3. Pre-flight before writing anything substantive: scope cascade loaded; if the work engages a named person/entity with a profile note, read it first; run any
   domain pre-flight the host `CLAUDE.md` or extension mandates.

## Step 2 - Determine mode

Infer the mode from the request, or ask if unclear.

### Mode A: SAVE - write a new note

1. Run pre-flight.
2. Determine the destination zone using the routing test.
3. Propose a filename per the base's naming convention (dated for `Calendar/`; descriptive title elsewhere; mirror the paired sources-store path for source
   extracts).
4. Draft per the project's writing standards. Cite every fact to a source path or reference; label analysis explicitly where the base distinguishes fact from
   analysis.
5. Confirm, then write.

### Mode B: UPDATE - enrich an existing note

1. Run pre-flight.
2. Find and read the existing note.
3. Draft a merged version - enrich, do not replace. Preserve structure.
4. For profile / person notes: auto-append unambiguous factual updates from authoritative sources; propose a diff first for tactical or evaluative content.
5. Cite the source of every update; confirm, then write.

### Mode C: QUERY - answer from the base

1. Search and read the relevant notes (memory index, profile notes, the topical zones).
2. Answer, citing the path to the source note or paired source document.
3. If the base cannot answer it, capture the researched answer as a new note (fall through to Mode A).

### Mode D: EXTRACT - distil a conversation

1. Identify distinct reusable pieces of knowledge.
2. For each, propose a title, destination zone (per the routing test), and draft.
3. Confirm, then write the approved notes.

### Mode E: DIGEST - session digest

1. Write the digest to `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp `YYYY-MM-DDTHHMMSSZ`; topic in Title Case).
2. Carry `type: session-digest` and `retain_until: YYYY-MM-DD` (default 30 days out).
3. Structure: Context, Decisions, Facts Learned, Related Work, Keywords.

## Notes

- This skill assumes the Knowledge Islands structure. If a base does not follow it, or a binding cannot be resolved and no default fits, ask the user rather
  than guess.
- Where a base ships a named extension skill (one named for the base, e.g. `<base>-kb`), that skill takes precedence and supplies the base-specific pre-flight
  and scope rules; it delegates these five modes back here.

Reference detail: [Knowledge Islands KB Reference](<references/Knowledge Islands KB Reference.md>).
