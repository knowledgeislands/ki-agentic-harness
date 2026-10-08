# Mode AUDIT - check a diagram set

Read [the Diagrams standard](standards-diagrams.md) and [the rubric](rubric.md) first.

1. Run `ki repo audit --skill ki-diagrams --repo <repo>`. It checks that `docs/diagrams/diagrams.toml` and the committed files agree both ways (DIAG-1), that no source or SVG carries a local path, file URL or address (DIAG-2), that each SVG is self-contained (DIAG-3), and warns where a traced path changed since `last_checked` (DIAG-4). It writes nothing and needs neither Archify nor Playwright.
2. For each DIAG-4 warning, compare the reported changes with the diagram's `stale_when`. A matching change is a gap for [REFRESH](mode-refresh.md); a non-matching one is conforming once `last_checked` advances.
3. Review DIAG-2's judgment: does any label, card or citation name a private repository, a person, note content or a commit subject?
4. Review DIAG-5: with Archify installed, does each source pass `finalize --quality showcase`, and does its type answer its question as the standard maps questions to types? Without Archify, record DIAG-5 as unevaluated with the Rig install instruction.
5. Report gaps by slug. Route a prose problem in `README.md` to `ki-authoring` and an embedding question in a guide to `ki-guides`.
