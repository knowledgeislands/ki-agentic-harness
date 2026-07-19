<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — kb-live-artifacts

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical.

## LA — artifact structure

→ [standard](standards.md)

Artifact pairing, index, freshness, and judgment prompts.

- **LA-S-1 [M] — artifact index** — The index note exists when artifact sources are present. (standards.md)
- **LA-S-2 [M] — published sources** — Every Markdown artifact has a same-stem HTML render. (standards.md)
- **LA-S-3 [M] — orphaned renders** — Every HTML render has a same-stem Markdown source. (standards.md)
- **LA-S-4 [M] — render freshness** — Each HTML render is no older than the configured threshold behind its Markdown source. (standards.md)
- **LA-J-1 [J] — useful index descriptions** — The index accurately lists active artifacts with useful one-line descriptions. (standards.md)
  - _Review prompt:_ Does the index accurately list every active artifact with a useful one-line description?
- **LA-J-2 [J] — Markdown authority** — Markdown is the authoritative source and no content exists only in HTML. (standards.md)
  - _Review prompt:_ Is each Markdown artifact authoritative, with no essential content present only in its HTML render?
- **LA-J-3 [J] — archive rationale** — Archived artifacts retain when-and-why context rather than disappearing silently. (standards.md)
  - _Review prompt:_ Do archived artifacts retain a clear when-and-why rationale rather than disappearing silently?
- **LA-J-4 [J] — stable artifact names** — Artifact names are descriptive and stable for published links. (standards.md)
  - _Review prompt:_ Are artifact names descriptive and stable enough to preserve published links?

## LA-F — artifact frontmatter

→ [standard](standards.md)

Required metadata on Markdown artifact sources.

- **LA-F-1 [M] — artifact status** — Each artifact source declares `status: active` or `status: archived`. (standards.md)
- **LA-F-2 [M] — render declaration** — Each frontmatter block declares `renders: html`. (standards.md)
