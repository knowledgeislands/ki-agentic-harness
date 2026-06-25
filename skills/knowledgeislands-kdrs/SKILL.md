---
name: knowledgeislands-kdrs
description: >
  Codify, audit, and maintain Knowledge Decision Records in any Knowledge Islands island — the format standard (Nygard's five sections plus
  the house `type` field), the naming convention (`KDR-<SCOPE>-NNN`), the status lifecycle (Proposed → Accepted → Deprecated → Superseded),
  the `card/kdr` tag, and the index in `Admin/Decisions/Decisions.md`. Use when writing a KDR about island structure, governance, taxonomy,
  naming, process, or product scope; auditing existing KDRs; bringing them into line; or refreshing the standard. Triggers: "write a KDR",
  "create a decision record", "audit the KDRs", "what decisions have been made", "is this KDR well-formed", "document this decision".
  KB/island repos only — for code/software repos use `knowledgeislands-adrs`. Off-ramps: `knowledgeislands-adrs` (code repos),
  `knowledgeislands-streams` (Enactment Process), `knowledgeislands-kb` (island structure).
argument-hint: 'audit [dir] | conform [dir] | new <scope> "<title>" | refresh'
---

# Knowledge Islands KDR standard

You are applying the **Knowledge Islands KDR standard** — how Knowledge Decision Records are written, named, maintained, and indexed in a
Knowledge Islands island. KDRs are the decision record instrument for KB/island repos; ADRs (governed by `knowledgeislands-adrs`) remain the
instrument for code/software repos. The distinction is domain, not format: both use Nygard's five sections, but KDRs are placed in the
island's governance zone (`Admin/Decisions/`), carry a `type` field covering the full decision surface of a knowledge island, and are the
formal artifact for significant `Decision` outputs from Enactment Process proposals. The full format with rationale lives in
[the format standard](references/kdr-format.md); the line-by-line checkable criteria live in [the rubric](references/audit-rubric.md); the
canonical sources are in [sources](references/sources.md).

## What this skill owns

1. **The format standard** — the five Nygard sections (Title, Status/Date, Context, Decision, Consequences) plus the house `type`
   frontmatter field and optional `## References` section, with exact writing guidance (active voice for Decision, value-neutral Context).
2. **The type taxonomy** — six valid `type` values covering the full decision surface of a knowledge island: `architecture` (structure,
   zones, repo relationships), `product` (purpose, scope, outputs), `governance` (processes, authority, change mechanisms), `taxonomy` (tag
   hierarchies, classification schemes, vocabularies), `naming` (naming conventions for notes, files, identifiers), `process` (operational
   procedures, workflows, activity design).
3. **The naming convention** — `KDR-<SCOPE>-NNN`: open scope (any uppercase alpha-leading token, multi-level), NNN is zero-padded (≥ 3
   digits), monotonically increasing within its scope, never reused.
4. **The status lifecycle** — `Proposed → Accepted → Deprecated → Superseded by KDR-…`; superseded records are retained with a bidirectional
   reference; accepted records are never modified, only superseded.
5. **The index rule** — `Admin/Decisions/Decisions.md` (the same-name index note for `Admin/Decisions/`) must contain a table with one row
   per KDR (KDR-ID · Title · Status · Date · Type), ordered by filename, kept current as KDRs are added or superseded.
6. **The Enactment Process integration** — a KDR is the formal artifact for an Enactment Process proposal whose `Decision` output warrants a
   standalone record; the proposal's output row cites the KDR by ID. Not every proposal requires a KDR — only those with significant
   standalone decisions.
7. **The mechanical checker** — [`scripts/audit-kdrs.ts`](scripts/audit-kdrs.ts) validates filenames, required sections, Status/Date/type
   fields, `card/kdr` tag, superseded links, serial uniqueness, and index completeness/sync.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**, plus **NEW** (draft a new KDR). Infer the mode from the request; ask if unclear.

### Mode AUDIT — check KDRs against the standard

1. **Run the mechanical checker**: `bun <skill>/scripts/audit-kdrs.ts <dir>` where `<dir>` is the decisions directory (default:
   `Admin/Decisions`). It validates filename pattern, required sections, Status/Date/type fields, `card/kdr` tag, superseded links, serial
   uniqueness, and index completeness/sync. Findings are graded on the unified severity ladder (FAIL / WARN / POLISH / ADVISORY / INFO /
   SKIP / PASS — defined in `knowledgeislands-engineering`'s enforcement-framework §2); exits non-zero on any FAIL. Capture its output
   verbatim.
2. **Apply the judgment items** in [the rubric](references/audit-rubric.md): each section has real substance, Context is value-neutral
   forces not advocacy, Decision is in active voice, each KDR is one to two pages, `type` correctly categorises the decision.
3. **Report** by `KDR · check · fix`, lead with FAILs.

### Mode CONFORM — bring KDRs into line

1. Run **AUDIT** first.
2. **File renames** — if a filename does not match the pattern, confirm the intended `SCOPE` + `NNN` with the user before renaming (a rename
   changes the canonical ID).
3. **Section repairs** — add missing section stubs; leave content for the author to fill in.
4. **Index repair** — add missing rows, correct stale titles/statuses, restore ordering, fill missing Type column.
5. **Superseded links** — if two KDRs supersede each other, confirm both carry the bidirectional reference.
6. Re-run **AUDIT** to confirm convergence.

### Mode NEW — draft a new KDR

1. Determine the `SCOPE` (use the island's identifier from its `.ki-config.toml`, e.g. `ARCADIA`) and `type` (one of the six valid values).
   Derive the next available `NNN` from existing files in the decisions directory.
2. Write the KDR using [the template](references/kdr-format.md#template) — full sections, `type` frontmatter, `card/kdr` tag. Status starts
   as `Proposed`.
3. Add a row to `Admin/Decisions/Decisions.md` in filename order.
4. If this KDR supersedes an existing one, update the old KDR's `**Status:**` line to `Superseded by KDR-<SCOPE>-NNN` and update its index
   row.
5. Run **AUDIT** to confirm the new file is well-formed.

### Mode REFRESH — re-anchor the standard to its sources

Run when asked "is the KDR standard current" or when a source appears to have moved.

1. **Read [sources.md](references/sources.md)** — tracked sources with `last reviewed` dates.
2. **Re-fetch each** (WebFetch; fall back to WebSearch if blocked) and diff against [the format standard](references/kdr-format.md) and the
   rubric: new section recommendations, status-value changes, tooling conventions.
3. **Propose a diff** to the standard, the rubric, and this file; confirm before writing.
4. **Update [sources.md](references/sources.md)** — bump each `last reviewed` date and refresh the `## Last review` block.

## Notes

- **Never modify an accepted KDR** — only supersede it. An `Accepted` record is immutable history; correctness lives in the superseding KDR.
- **Scope convention** — use the island's identifier from `.ki-config.toml` as the primary scope segment (e.g. `ARCADIA`). Multi-level
  scopes are valid for sub-domain decisions (e.g. `ARCADIA-TOOLS`). Scope segments match `[A-Z][A-Z0-9]*`.
- **Not every proposal needs a KDR** — routine content additions, typo fixes, and minor configuration changes do not warrant one. Reserve
  KDRs for decisions with standalone standing: structural choices, adoption of tools or formats, cross-repo boundaries.
- **ADR vs KDR** — if the repo is a code/software project, use `knowledgeislands-adrs` instead. The format is identical; the instrument
  differs by domain.
- **`Admin/Decisions/` is the default path** but configurable in `.ki-config.toml` (`path = "…"`). Pass the actual path to the checker.
