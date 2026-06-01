---
name: knowledgeislands-kb
description: >
  Interact with a Knowledge Islands knowledge base: save AI outputs as notes, update existing notes, query the base, distil a conversation into notes, or write
  a session digest — and audit a base against the structure model, bring it into line, or scaffold a new one. Targets the Knowledge Islands structure (Calendar
  / Pillars / Resources / Streams, plus inbound `+` and outbound `-`), so it assumes the zone model rather than asking for it; only a few store-level bindings
  come from the host project. Triggers: "save to my notes", "save to the knowledge base", "add to the KB", "what do my notes say about", "search my notes",
  "update the note on", "capture this", "write a session digest", "audit my knowledge base", "is my base structured right", "set up a new knowledge base". Where
  a knowledge base ships its own named extension skill, prefer that skill; it extends this one. For general Markdown or TOML house style (not note content), use
  the `knowledgeislands-authoring` skill.
argument-hint: 'audit | conform | digest | extract | init | query <question> | refresh | save | update <note>'
---

# Knowledge Islands KB

You are helping the user interact with a **Knowledge Islands** knowledge base - a markdown store organised to the Knowledge Islands structure. This skill
carries the operating modes and the structure itself; only a handful of store-level details come from the host project. It assumes the zone model below and does
not ask the project to redefine it.

## The Knowledge Islands structure

A Knowledge Islands base is one markdown store with a fixed set of five zones, flanked by an inbound and an outbound staging area. The five zones — `Calendar/`,
`Pillars/`, `Resources/`, `Streams/`, `Admin/` — each carry an index note of the same name; `+/` (inbound) and `-/` (outbound) are staging areas, not zones, and
carry no such index.

| Folder       | Holds                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `+/`         | Inbound staging - unfiled captures awaiting routing. Exempt from most conventions. Not a zone.  |
| `Calendar/`  | Time-stamped records: daily, meeting, session, weekly, monthly notes.                           |
| `Pillars/`   | Internal canonical knowledge - the base's primary subject matter. One folder per pillar.†       |
| `Resources/` | External reference material that exists independently of this base.                             |
| `Streams/`   | Work in motion - active workstreams and evolving projects; migrates to `Pillars/` once settled. |
| `-/`         | Outbound staging - produced artefacts (session digests, compiled outputs). Not a zone.          |
| `Admin/`     | Base-agnostic governance and operations.                                                        |

† A base mid-migration may still hold this zone under a legacy folder name (e.g. `Matters/` for `Pillars/`). That is declared as a **zone alias** in the base's
config, not treated as a different zone - see [Project bindings](#project-bindings).

**Pillars** are the second-level unit of organisation: each whole knowledge base is an "island"; within it, a Pillar is a major strand of its subject matter (a
case, a client, a domain, a theme). A base may use one Pillar or many.

### Linking within a base

Notes inside a base link to one another and to their zone index notes with Obsidian `[[wikilinks]]`, not relative markdown paths — the five index-carrying zones
are `[[Calendar]]`, `[[Pillars]]`, `[[Resources]]`, `[[Streams]]`, and `[[Admin]]`. Body links use the shortest unique path (bare filename if unique, the
minimum disambiguating prefix otherwise); a `## Contents` list uses the full path with an alias (`[[Full/Path/Note|Note Name]]`). This governs **note content
inside a base** — it is independent of, and does not conflict with, the relative-markdown-link convention these skill files themselves use (see the
arcadia-skills `README.md`, "Linking inside skills").

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
index, then the project's extension skill if it ships one. **Declarative overrides** (the zone alias below) are read from the base's `.ki-config.toml`
`[knowledgeislands-kb]` table instead — see the `knowledgeislands-repo` skill for the shared-file contract; validate your own table (warn on an unrecognised
key) and never read another skill's.

- **Notes store** — canonical alias and location of the notes store. _Default:_ the connected base; refer to it as "the base".
- **Sources store** — whether a paired sources store exists, and how note extracts mirror its paths. _Default:_ none.
- **Scope usage** — whether the base is Pillar-scoped (declare an active Pillar) or single-Pillar / flat. _Default:_ Pillar-scoped.
- **Zone names** — the canonical folder per zone, overridable for a base mid-migration. A `[knowledgeislands-kb.zones]` sub-table maps a canonical zone to this
  base's local folder (`Pillars = "Matters"`); resolve every zone reference through it, and drop the entry once the folder is renamed. _Default:_ the canonical
  names (`Calendar` / `Pillars` / `Resources` / `Streams` / `Admin`).
- **Writing standards** — language variant, citation format, structural norms. _Default:_ British English; cite source paths; concise prose.
- **Domain pre-flight** — any extra reads before drafting (profiles, domain context), usually via the extension skill. _Default:_ none beyond the memory
  cascade.

## Step 1 - Load context

1. The host `CLAUDE.md` (auto-loaded) is the authority on the bindings above; follow it. Read the root `Admin/MEMORY.md` for active Pillars.
2. If the base is Pillar-scoped, declare or confirm the active Pillar, then load `Pillars/<Pillar>/MEMORY.md` and any profile index. Confirm: "Session scoped to
   [Pillar]." If the user switches Pillar mid-session, re-scope before proceeding.
3. Pre-flight before writing anything substantive: scope cascade loaded; if the work engages a named person/entity with a profile note, read it first; run any
   domain pre-flight the host `CLAUDE.md` or extension mandates.

## Step 2 - Determine mode

Infer the mode from the request, or ask if unclear. Like every governance skill it carries **AUDIT · CONFORM · REFRESH**; its base-specific modes are **INIT**
(scaffold a base) and the note-ops **DIGEST · EXTRACT · QUERY · SAVE · UPDATE**. Modes are named and alphabetical.

### Mode AUDIT - check the base against the structure model

1. **Run the mechanical checker** - `bun scripts/audit-kb.ts <base-path>` (from this skill's directory). It reports the deterministic layer as PASS / WARN /
   FAIL and exits non-zero on a FAIL: the five zones present (resolved through any `[knowledgeislands-kb.zones]` alias), a same-name index note per zone, the
   root `Admin/MEMORY.md`, and the base's own `[knowledgeislands-kb]` table validated _down_. Capture its output; do not re-derive what it checks.
2. **Apply the judgment layer by reading** - the **[J]** criteria in [the rubric](references/audit-rubric.md) that the script cannot judge: notes filed in the
   wrong zone (per the routing test), note frontmatter and naming quality, whether the memory index's active-Pillar list is actually accurate, and
   fact-vs-analysis labelling where the base distinguishes them.
3. **Report** drift, leading with FAILs then WARNs: misrouted or mis-zoned notes, missing zones, notes lacking required frontmatter, stale memory-index entries.
   Cite paths and give the fix.

### Mode CONFORM - bring the base into line

1. Run **AUDIT** first for the gap list.
2. Apply the fixes: refile misrouted notes (per the routing test), create any missing zone, repair note frontmatter and naming, reconcile the memory index.
   Confirm before moving or rewriting notes.
3. Re-run **AUDIT** until it is clean.

### Mode DIGEST - session digest

1. Write the digest to `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp `YYYY-MM-DDTHHMMSSZ`; topic in Title Case).
2. Carry `type: session-digest` and `retain_until: YYYY-MM-DD` (default 30 days out).
3. Structure: Context, Decisions, Facts Learned, Related Work, Keywords.

### Mode EXTRACT - distil a conversation

1. Identify distinct reusable pieces of knowledge.
2. For each, propose a title, destination zone (per the routing test), and draft.
3. Confirm, then write the approved notes.

### Mode INIT - scaffold a new base's structure

1. Create the zone skeleton — Calendar / Pillars / Resources / Streams, plus the inbound `+` and outbound `-` zones — and the root `Admin/MEMORY.md`.
2. Seed each zone's note conventions (frontmatter, naming) from the structure model.
3. Hand ongoing capture to the SAVE / EXTRACT / DIGEST modes.

### Mode QUERY - answer from the base

1. Search and read the relevant notes (memory index, profile notes, the topical zones).
2. Answer, citing the path to the source note or paired source document.
3. If the base cannot answer it, capture the researched answer as a new note (fall through to Mode SAVE).

### Mode REFRESH - keep the structure model current

This skill carries the zone model, routing test, and project-bindings table as fixed knowledge; it must not drift from how the bases that use it are really
organised - especially once installed into a shared/cloud catalogue, where it is long-lived and far from its author. Run this periodically, or when someone asks
"is the KB skill still current".

1. **Read [the source list](references/sources.md)** - the canonical structure definition (the arcadia-skills `README.md`), the bases actively using this skill,
   and any base-coupled `<base>-kb` extensions, each with a `last reviewed` date.
2. **Re-anchor against reality.** Re-read the README's structure section, and sample how the live bases are actually laid out (their root `Admin/MEMORY.md` and
   top-level folders). Diff against this skill's zone table, routing test, and bindings table. Look for: a zone or convention the bases now use that the model
   omits; a binding real bases supply that the bindings table doesn't name; a default that no longer matches practice; a tool surface the host MCP server has
   changed under the skill (it resolves tools at runtime - confirm that assumption still holds).
3. **Separate canonical from local.** A change is only a model change if it traces to the canonical structure or to a pattern shared across bases; a single
   base's quirk belongs in that base's extension skill, not here.
4. **Propose a diff** to the zone table / routing test / bindings, and confirm before writing.
5. **Update [the source list](references/sources.md)** - bump each `last reviewed` date and record what changed (or "no change") in the changelog. This step is
   mandatory: the source list is the skill's memory of where its structure model comes from.

### Mode SAVE - write a new note

1. Run pre-flight.
2. Determine the destination zone using the routing test.
3. Propose a filename per the base's naming convention (dated for `Calendar/`; descriptive title elsewhere; mirror the paired sources-store path for source
   extracts).
4. Draft per the project's writing standards. Cite every fact to a source path or reference; label analysis explicitly where the base distinguishes fact from
   analysis.
5. Confirm, then write.

### Mode UPDATE - enrich an existing note

1. Run pre-flight.
2. Find and read the existing note.
3. Draft a merged version - enrich, do not replace. Preserve structure.
4. For profile / person notes: auto-append unambiguous factual updates from authoritative sources; propose a diff first for tactical or evaluative content.
5. Cite the source of every update; confirm, then write.

## Notes

- This skill assumes the Knowledge Islands structure. If a base does not follow it, or a binding cannot be resolved and no default fits, ask the user rather
  than guess.
- Where a base ships a named extension skill (one named for the base, e.g. `<base>-kb`), that skill takes precedence and supplies the base-specific pre-flight
  and scope rules; it delegates these five modes back here.

Reference detail: [Knowledge Islands KB Reference](<references/Knowledge Islands KB Reference.md>). Checkable criteria:
[the audit rubric](references/audit-rubric.md), enforced mechanically by [`scripts/audit-kb.ts`](scripts/audit-kb.ts).
