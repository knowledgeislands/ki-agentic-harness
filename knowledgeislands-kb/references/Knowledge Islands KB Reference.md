# Knowledge Islands KB Reference

Long-form detail for the [Knowledge Islands KB](../SKILL.md) skill. Loaded on demand (progressive disclosure) so the `SKILL.md` body stays lean.

## The Knowledge Islands model

A Knowledge Islands base is a single markdown store organised into five fixed zones - `Calendar/`, `Pillars/`, `Resources/`, `Streams/`, and `Admin/` - flanked
by an inbound staging area (`+/`) and an outbound one (`-/`). The `+/` and `-/` folders are staging, not zones: material lands or leaves through them but is not
canonical there. The zone set is part of the standard, so the skill does not ask a base to define it; it only needs a few store-level bindings.

- **Island vs Pillar.** Each whole knowledge base is an "island" (a legal base, a personal base, a research base). Within a base, a **Pillar** is a major strand
  of subject matter - a case, a client, a domain, a theme. `Pillars/` replaces what some bases historically called `Matters/`; a base still mid-rename keeps the
  old folder and declares it as a [zone alias](#zone-aliases-and-the-knowledgeislands-kb-config-table) rather than counting as a different zone.
- **Settling.** `Streams/` holds work in motion; once settled it migrates into `Pillars/` (internal) or `Resources/` (external). The discriminating question for
  internal vs external: _would this knowledge exist without this base?_ If yes, it is a resource.

## Linking within a base

Within a base, notes link to one another and to their zone index notes with Obsidian `[[wikilinks]]`, not relative markdown paths. The five index-carrying zones
resolve as `[[Calendar]]`, `[[Pillars]]`, `[[Resources]]`, `[[Streams]]`, and `[[Admin]]`; the inbound `+/` and outbound `-/` are staging, not zones, with no
same-name index. Body links use the shortest unique path — a bare filename when it is unique, the minimum disambiguating prefix when it is not — and check for
filename collisions before writing a bare link; a `## Contents` list always uses the full path with an alias (`[[Full/Path/Note|Note Name]]`).

This is the convention for **note content inside a base**. It is deliberately distinct from how the skill files in this repository link to one another (relative
markdown links, per the arcadia-skills `README.md` under "Linking inside skills") — the two never meet, so a base using wikilinks does not break the skills that
use markdown links.

## Onboarding a base to this skill

Because the zone model is fixed, onboarding is small - resolve only the **project bindings**, ideally in the base's auto-loaded `CLAUDE.md`:

1. **Notes store** - the canonical alias and location of the notes store, and the alias rule (always use the alias, never the raw mount).
2. **Sources store** - whether a paired sources store exists, and how note extracts mirror its paths.
3. **Scope usage** - whether the base is Pillar-scoped (declare an active Pillar each session) or single-Pillar / flat.
4. **Writing standards** - language variant, citation format, structural norms (defaults: British English, cite source paths, concise prose).
5. **Domain pre-flight** - any extra reads before drafting, usually supplied by the base's extension skill.
6. **Zone names** - only if a folder diverges from its canonical name during a migration; declared in `.ki-config.toml`, not `CLAUDE.md` (see
   [Zone aliases](#zone-aliases-and-the-knowledgeislands-kb-config-table)).

A base that follows the structure and defines the notes store needs nothing more; the rest runs on defaults.

## Zone aliases and the `[knowledgeislands-kb]` config table

The zone set is fixed, but a base **mid-migration** may not yet have renamed a folder to its canonical name - the live exemplar is `kit-legal`, which holds its
Pillars zone under the legacy `Matters/` while it renames toward `Pillars/`. So that the skill works against the real layout without hard-coding any one base's
quirk, the local folder name is a declared, reviewable override rather than a model change.

It lives in the base's `.ki-config.toml` under the skill's own table (the shared-file contract is owned by `knowledgeislands-repo`; this skill owns the keys
inside its table):

```toml
[knowledgeislands-kb.zones]
# Canonical zone = this base's local folder. Drop the line once the folder is
# renamed to the canonical name; omit the table entirely when none diverge.
Pillars = "Matters"
```

Rules, following the `.ki-config.toml` contract:

- **Resolve every zone reference through the alias.** When the table maps `Pillars = "Matters"`, read, route, and write the Pillars zone at `Matters/`; the
  routing test, memory cascade, and digest paths all use the resolved folder.
- **Validate down, ignore across.** Warn on an unrecognised key under `[knowledgeislands-kb]` (a typo or stale option should surface) and advise dropping one
  that merely restates a default (a zone mapped to its own canonical name). Never read or validate another skill's table.
- **It is transitional.** A zone alias records an in-progress rename, not a permanent fork. Once the base renames the folder, the entry is removed and the base
  is back on the canonical names.

## Session digest structure

Destination `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp `YYYY-MM-DDTHHMMSSZ`; topic in Title Case). Frontmatter `type: session-digest` and
`retain_until: YYYY-MM-DD` (default 30 days from the write date). Body sections:

- **Context** - what the session was about.
- **Decisions** - choices made and their rationale.
- **Facts Learned** - durable facts surfaced during the session.
- **Related Work** - links to the notes, Pillars, or streams touched.
- **Keywords** - retrieval terms.

## Extension-skill pattern

A base that needs base-specific pre-flight (declaring an active scope, loading domain context) ships a thin extension skill named for the base (e.g.
`<base>-kb`). The extension:

- Carries its own `name` and trigger phrases.
- Adds only the base-specific Step 1 / pre-flight (scope declaration, profile reads, domain pre-flight) and the project bindings.
- Delegates the five operating modes (SAVE / UPDATE / QUERY / EXTRACT / DIGEST) back to the `knowledgeislands-kb` skill **by name** rather than restating them.
  Both skills load into the session, so the reference is by `name`, not a file path.

This keeps the mode logic in one place and the base specifics in the extension.
