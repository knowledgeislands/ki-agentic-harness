# Knowledge Islands KB Reference

Long-form detail for the [Knowledge Islands KB](<../SKILL.md>) skill. Loaded on demand (progressive disclosure) so the `SKILL.md` body stays
lean.

## The Knowledge Islands model

A Knowledge Islands base is a single markdown store organised into fixed zones - `+/` (inbound), `Calendar/`, `Pillars/`, `Resources/`,
`Streams/`, `-/` (outbound), and `Admin/`. The zone set is part of the standard, so the skill does not ask a base to define it; it only needs
a few store-level bindings.

- **Island vs Pillar.** Each whole knowledge base is an "island" (a legal base, a personal base, a research base). Within a base, a **Pillar**
  is a major strand of subject matter - a case, a client, a domain, a theme. `Pillars/` replaces what some bases historically called
  `Matters/`.
- **Settling.** `Streams/` holds work in motion; once settled it migrates into `Pillars/` (internal) or `Resources/` (external). The
  discriminating question for internal vs external: *would this knowledge exist without this base?* If yes, it is a resource.

## Onboarding a base to this skill

Because the zone model is fixed, onboarding is small - resolve only the **project bindings**, ideally in the base's auto-loaded `CLAUDE.md`:

1. **Notes store** - the canonical alias and location of the notes store, and the alias rule (always use the alias, never the raw mount).
2. **Sources store** - whether a paired sources store exists, and how note extracts mirror its paths.
3. **Scope usage** - whether the base is Pillar-scoped (declare an active Pillar each session) or single-Pillar / flat.
4. **Writing standards** - language variant, citation format, structural norms (defaults: British English, cite source paths, concise prose).
5. **Domain pre-flight** - any extra reads before drafting, usually supplied by the base's extension skill.

A base that follows the structure and defines the notes store needs nothing more; the rest runs on defaults.

## Session digest structure

Destination `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp `YYYY-MM-DDTHHMMSSZ`; topic in Title Case). Frontmatter
`type: session-digest` and `retain_until: YYYY-MM-DD` (default 30 days from the write date). Body sections:

- **Context** - what the session was about.
- **Decisions** - choices made and their rationale.
- **Facts Learned** - durable facts surfaced during the session.
- **Related Work** - links to the notes, Pillars, or streams touched.
- **Keywords** - retrieval terms.

## Extension-skill pattern

A base that needs base-specific pre-flight (declaring an active scope, loading domain context) ships a thin extension skill named for the
base (e.g. `<base>-kb`). The extension:

- Carries its own `name` and trigger phrases.
- Adds only the base-specific Step 1 / pre-flight (scope declaration, profile reads, domain pre-flight) and the project bindings.
- Delegates the five operating modes (SAVE / UPDATE / QUERY / EXTRACT / DIGEST) back to the `knowledgeislands-kb` skill **by name** rather
  than restating them. Both skills load into the session, so the reference is by `name`, not a file path.

This keeps the mode logic in one place and the base specifics in the extension.
