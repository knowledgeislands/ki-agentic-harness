---
name: knowledgeislands-adrs
description: >
  Codify, audit, and maintain Architecture Decision Records in any repo — the format standard (Nygard's five sections plus the house
  References addition), the naming convention (`ADR-<SCOPE>-NNN`, open scope, multi-level), the status lifecycle (Proposed → Accepted →
  Deprecated → Superseded), and the index table in `docs/decisions/README.md`. Use to check whether ADRs are well-formed and the index is
  current, bring them into line, write a new ADR from scratch, or refresh the standard against its canonical sources. Triggers: "audit the
  ADRs", "write an ADR", "is this ADR well-formed", "check the decisions index", "what's our ADR format", "create an ADR for this decision",
  "supersede ADR-KI-…". For the TypeScript/Bun toolchain use `knowledgeislands-engineering`; for Markdown/TOML authoring style use
  `knowledgeislands-authoring`.
argument-hint: 'audit <dir> | conform <dir> | new <scope> "<title>" | refresh'
---

# Knowledge Islands ADR standard

You are applying the **Knowledge Islands ADR standard** — how Architecture Decision Records are written, named, maintained, and indexed in
any repo. It is scope-agnostic: the format and naming rules apply to every repo that records decisions this way; specific repos may declare
their scope prefix convention in their `CLAUDE.md`. The full, quotable format with rationale lives in
[the format standard](references/adr-format.md); the line-by-line checkable criteria (each tagged mechanical/judgment) live in
[the rubric](references/audit-rubric.md); the canonical sources behind the standard are in [sources](references/sources.md).

## What this skill owns

1. **The format standard** — the five Nygard sections (Title, Context, Decision, Status, Consequences) plus the house `## References`
   addition, with the exact writing guidance (active voice for Decision, value-neutral Context, full sentences) and valid Status values.
2. **The naming convention** — `ADR-<SCOPE>-NNN`: open scope (any uppercase alpha-leading segments, multi-level), NNN is zero-padded,
   monotonically increasing, never reused. KI repos use `KI` as the first scope segment by convention.
3. **The status lifecycle** — `Proposed → Accepted → Deprecated → Superseded by ADR-…`; superseded records are retained with a bidirectional
   reference; accepted records are never modified, only superseded.
4. **The index rule** — `docs/decisions/README.md` must contain a table with one row per ADR (ID · Title · Status · Date), ordered by
   filename, kept current as ADRs are added or superseded.
5. **The mechanical checker** — [`scripts/audit-adrs.ts`](scripts/audit-adrs.ts) validates filenames, required sections, Status/Date fields,
   superseded links, and index completeness/sync.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**, plus **NEW** (draft a new ADR). Infer the mode from the request; ask if unclear. (Modes
are named and alphabetical.)

### Mode AUDIT — check ADRs against the standard

1. **Run the mechanical checker**: `bun <skill>/scripts/audit-adrs.ts <dir>` where `<dir>` is the decisions directory (default:
   `docs/decisions`). It validates filename pattern, required sections, Status/Date fields, superseded links, serial uniqueness, and index
   completeness/sync. It grades findings on the unified severity ladder (FAIL / WARN / POLISH / ADVISORY / INFO / SKIP / PASS — defined in
   `knowledgeislands-engineering`'s enforcement-framework §2) and exits non-zero on any FAIL. Capture its output verbatim.
2. **Apply the judgment items** in [the rubric](references/audit-rubric.md): each section has real substance (not a placeholder), Context is
   value-neutral forces not advocacy, Decision is in active voice, each ADR is one to two pages.
3. **Report** by `ADR · check · fix`, lead with FAILs.

### Mode CONFORM — bring ADRs into line

1. Run **AUDIT** first.
2. **File renames** — if a filename doesn't match the pattern, confirm the intended `SCOPE` + `NNN` with the user before renaming (a rename
   changes the canonical ID).
3. **Section repairs** — add missing `## Context` / `## Decision` / `## Consequences` / `**Status:**` / `**Date:**` stubs; leave the content
   for the author to fill in.
4. **Index repair** — add missing rows, correct stale titles/statuses, restore ordering.
5. **Superseded links** — if two ADRs supersede each other, confirm both carry the bidirectional reference.
6. Re-run **AUDIT** to confirm convergence.

### Mode NEW — draft a new ADR

1. Determine the `SCOPE` (e.g. `KI-HARNESS`, `KI-MCP`, `KI-HARNESS-SKILLS`). Use the naming convention in
   [the format standard](references/adr-format.md) and derive the next available `NNN` from the existing files.
2. Write the ADR using [the template](references/adr-format.md#template) — full Nygard sections plus `## References`. Status starts as
   `Proposed`.
3. Add a row to `docs/decisions/README.md` in filename order.
4. If this ADR supersedes an existing one, update the old ADR's Status line to `Superseded by ADR-<SCOPE>-NNN` and update its index row.
5. Run **AUDIT** to confirm the new file is well-formed.

### Mode REFRESH — re-anchor the standard to its sources

Run when asked "is the ADR standard current" or when a source appears to have moved.

1. **Read [sources.md](references/sources.md)** — the three tracked sources with `last reviewed` dates.
2. **Re-fetch each** (WebFetch; fall back to WebSearch if blocked) and diff against [the format standard](references/adr-format.md) and the
   rubric: new section recommendations, status-value changes, tooling conventions.
3. **Propose a diff** to the standard, the rubric, and this file; confirm before writing.
4. **Update [sources.md](references/sources.md)** — bump each `last reviewed` date and refresh the `## Last review` block.

## Notes

- **Never modify an accepted ADR** — only supersede it. An `Accepted` record is immutable history; correctness lives in the superseding ADR.
- **Scope is open** — any uppercase alpha-leading token is valid; there is no fixed enumeration. KI repos use `KI` as the first segment by
  convention, but the standard does not mandate it.
- **NNN is repo-scoped per SCOPE path** — `ADR-KI-HARNESS-001` and `ADR-KI-MCP-001` are distinct; the serial is unique within each
  `ADR-<SCOPE-PATH>` namespace.
- **`docs/decisions/` is the default path** but not required — a repo may store ADRs elsewhere (e.g. `doc/adr`). Pass the actual path to the
  checker.
