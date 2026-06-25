# KDR audit rubric

Used by Mode AUDIT. Each criterion is tagged **[M]** (mechanical — the checker runs it) or **[J]** (judgment — you assess by reading). Run
the checker first; do not eyeball what the script validates better.

## File and naming checks

- **[M] FILENAME-1** — filename matches `KDR-[A-Z][A-Z0-9]*(-[A-Z][A-Z0-9]*)*-\d{3,}(-[a-z0-9-]+)?\.md`
- **[M] FILENAME-2** — NNN is unique within its `KDR-<SCOPE>` namespace; no two files share a scope+serial combination
- **[M] FILENAME-3** — NNN is monotonically increasing within its scope; no gaps introduced by deletion

## Frontmatter checks

- **[M] FM-1** — frontmatter is valid YAML
- **[M] FM-2** — `tags` includes `card/kdr`
- **[M] FM-3** — `type` field is present and one of: `architecture`, `product`, `governance`, `taxonomy`, `naming`, `process`
- **[J] FM-4** — `type` correctly categorises the decision (not a stretch fit; the body should make the type obvious)

## Body structure checks

- **[M] BODY-1** — heading matches `# KDR-<SCOPE>-NNN: <title>` (ID prefix present)
- **[M] BODY-2** — `**Status:**` line present with a valid value (Proposed / Accepted / Deprecated / Superseded by KDR-…)
- **[M] BODY-3** — `**Date:**` line present, format `YYYY-MM-DD`
- **[M] BODY-4** — `## Context`, `## Decision`, `## Consequences` sections all present
- **[J] BODY-5** — Context is value-neutral forces, not advocacy ("the island currently…" not "we need to…")
- **[J] BODY-6** — Decision is in active voice ("This island adopts…" or "We will…")
- **[J] BODY-7** — each section has real, non-placeholder substance
- **[J] BODY-8** — length is one to two pages (roughly 200-500 body words)
- **[J] BODY-9** — Title is a short noun phrase, not a question or full sentence

## Superseded checks

- **[M] SUPER-1** — if Status is `Superseded by KDR-X`, the referenced KDR exists in the same decisions directory
- **[M] SUPER-2** — if KDR-A supersedes KDR-B, KDR-B's Status is `Superseded by KDR-A` (bidirectional)

## Index checks

- **[M] INDEX-1** — `Decisions.md` exists in the decisions directory
- **[M] INDEX-2** — every KDR file has exactly one row in `Decisions.md`
- **[M] INDEX-3** — no row in `Decisions.md` references a file that does not exist
- **[M] INDEX-4** — row Status matches the KDR's `**Status:**` field
- **[M] INDEX-5** — row Date matches the KDR's `**Date:**` field
- **[M] INDEX-6** — rows are ordered by filename
- **[J] INDEX-7** — row Title in the index matches the KDR's heading title (excluding the ID prefix)

## Severity mapping

| Criterion                                                                                                 | Severity |
| --------------------------------------------------------------------------------------------------------- | -------- |
| FILENAME-1, FM-1, FM-2, FM-3, BODY-1, BODY-2, BODY-3, BODY-4, SUPER-1, SUPER-2, INDEX-1, INDEX-2, INDEX-3 | FAIL     |
| FILENAME-2, FILENAME-3, INDEX-4, INDEX-5, INDEX-6                                                         | WARN     |
| BODY-5, BODY-6, BODY-7                                                                                    | WARN     |
| FM-4, BODY-8, BODY-9, INDEX-7                                                                             | POLISH   |
