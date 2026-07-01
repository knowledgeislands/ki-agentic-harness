---
name: knowledgeislands-decision-records
description: >
  Codify, audit, and maintain Decision Records in any Knowledge Islands repo — the unified instrument replacing knowledgeislands-adrs and knowledgeislands-kdrs. Each decision_type has its own prefix: GDR- (governance), ADR- (architecture), KDR- (knowledge), SDR- (strategy), PDR- (product), DDR- (data), XDR- (security), ODR- (operations), RDR- (research). Serials are global within scope. Governs the Nygard five-section format, status lifecycle, and placement: docs/decisions/ for code repos, Admin/Governance/Decisions/ for KB repos. In KB repos DRs carry type: admin/governance/decision plus decision_type, per the KI-wide frontmatter standard in knowledgeislands-kb. Use when writing, auditing, or conforming decision records. Triggers: "write a DR", "create a decision record", "document this decision", "audit the DRs". Off-ramps: knowledgeislands-kb (island structure and frontmatter standard), knowledgeislands-streams (Enactment Process).
argument-hint: 'audit [dir] | conform [dir] | new <scope> "<title>" | refresh'
---

# Knowledge Islands Decision Records standard

You are applying the **Knowledge Islands Decision Records standard** — how Decision Records are written, named, maintained, and indexed in any Knowledge Islands repo, code or KB. DRs are the single instrument for significant standalone decisions; each `decision_type` has its own prefix so the kind of decision is readable from the filename alone. The full format with rationale lives in [the format standard](references/dr-format.md); the line-by-line checkable criteria live in [the rubric](references/audit-rubric.md); the canonical sources are in [sources](references/sources.md).

## What this skill owns

1. **The format standard** — the five Nygard sections (Title, Status/Date, Context, Decision, Consequences) plus the optional `## References` section, with exact writing guidance (active voice for Decision, value-neutral Context).
2. **The prefix table** — nine type-specific prefixes, one per `decision_type`:

   | Prefix | `decision_type` |
   | ------ | --------------- |
   | `SDR-` | `strategy`      |
   | `PDR-` | `product`       |
   | `ADR-` | `architecture`  |
   | `DDR-` | `data`          |
   | `XDR-` | `security`      |
   | `ODR-` | `operations`    |
   | `GDR-` | `governance`    |
   | `RDR-` | `research`      |
   | `KDR-` | `knowledge`     |

3. **The naming convention** — `<PREFIX>-<SCOPE>-NNN`: open scope (any uppercase alpha-leading token, multi-level), NNN is zero-padded (≥ 3 digits), monotonically increasing **within the scope** (global across all prefixes — no two DRs in the same scope share a serial).
4. **The status lifecycle** — `Proposed → Accepted → Deprecated → Superseded by <ID>`; superseded records are retained with a bidirectional reference; accepted records are never modified, only superseded.
5. **The index rule** — `Decisions.md` (code: `README.md` or `Decisions.md`) must contain a table with one row per DR, ordered by filename.
6. **The placement rule** — `repo_type = "kb"` in `.ki-config.toml` → `Admin/Governance/Decisions/`; all others → `docs/decisions/`. Pass the actual path to the checker.
7. **The Enactment Process integration** — a DR is the formal artifact for an Enactment Process proposal whose `Decision` output warrants a standalone record.
8. **The mechanical checker** — [`scripts/audit-drs.ts`](scripts/audit-drs.ts) validates filenames, prefix–type agreement, required sections, Status/Date fields, `type`/`decision_type` fields (KB mode), superseded links, serial uniqueness, and index completeness/sync. Detects KB vs code mode automatically from `.ki-config.toml`.

## Operating modes

Carries the universal **AUDIT · CONFORM · REFRESH**, plus **NEW** (draft a new DR). Infer the mode from the request; ask if unclear.

### Mode AUDIT

→ Read [references/mode-audit-conform.md](references/mode-audit-conform.md)

### Mode CONFORM

→ Read [references/mode-audit-conform.md](references/mode-audit-conform.md)

### Mode NEW

→ Read [references/mode-new.md](references/mode-new.md)

### Mode REFRESH

→ Read [references/mode-refresh.md](references/mode-refresh.md)

## Notes

- **Never modify an accepted DR** — only supersede it. An `Accepted` record is immutable history.
- **Scope convention** — use the island/repo identifier from `.ki-config.toml` as the primary scope segment (e.g. `ARCADIA`). Multi-level scopes are valid for sub-domain decisions (e.g. `ARCADIA-TOOLS`).
- **Serials are global** — NNN is unique within a `<SCOPE>` namespace across all prefixes. There will never be both an `ADR-ARCADIA-003` and a `GDR-ARCADIA-003`.
- **Not every proposal needs a DR** — routine content additions, typo fixes, and minor configuration changes do not warrant one. Reserve DRs for decisions with standalone standing.
- **KB repos** use `Admin/Governance/Decisions/` and require frontmatter (`type`, `decision_type`, `status`, `author`). **Code repos** use `docs/decisions/` and frontmatter is optional.
- The KI-wide frontmatter standard (universal fields and the `type` taxonomy) lives in `knowledgeislands-kb`'s [frontmatter-standard.md](../knowledgeislands-kb/references/frontmatter-standard.md).
