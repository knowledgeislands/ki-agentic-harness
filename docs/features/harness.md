# Harness structure — `HARN`

The behaviour of the harness as a repository: the five-part bundle and the container invariants a Knowledge Islands harness must satisfy so its skills, agents, and checkers are discoverable and self-describing. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## The five-part bundle

### HARN-001 — Five part-directories exist

The repo root MUST contain `skills/`, `agents/`, `mcp/`, `evals/`, and `hooks/` as directories, per [ADR-KI-HARNESS-001](../decisions/ADR-KI-HARNESS-001-repository-structure.md).

_Verify:_ `bun skills/ki-harness/scripts/audit-harness.ts .` — LAY-1 PASSes only when all five directories are present (a missing one is a FAIL).

### HARN-002 — Each part declares its status

Each of the five part-directories MUST contain a `README.md` that declares whether the part is populated or an empty shelf.

_Verify:_ `audit-harness.ts` LAY-2 checks a `README.md` in each of `skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`.

## Root anchors

### HARN-003 — Root orientation and config files

The repo root MUST carry `CLAUDE.md` (always-loaded orientation), `.ki-config.toml` (the KI compliance declaration), and SHOULD carry `ROADMAP.md` (the open-work signal), per [ADR-KI-HARNESS-001](../decisions/ADR-KI-HARNESS-001-repository-structure.md).

_Verify:_ `audit-harness.ts` LAY-3 (`CLAUDE.md`) and LAY-5 (`.ki-config.toml`) FAIL when absent; LAY-4 (`ROADMAP.md`) WARNs.

### HARN-004 — Harness compliance table

`.ki-config.toml` MUST contain a `[ki-harness]` table marking the repo as a harness, and MUST contain a `[ki-repo]` table opting into KI governance, per [ADR-KI-HARNESS-005](../decisions/ADR-KI-HARNESS-005-validate-down-ki-config-contract.md).

_Verify:_ `audit-harness.ts` CONFIG-1 (`[ki-harness]`, FAIL if absent) and CONFIG-2 (`[ki-repo]`, WARN if absent).

## Toolchain surface

### HARN-005 — Install and lint script families

`package.json` MUST expose the `ki-bootstrap` delivery script `ki:skills:link:project` and the skill quality gate `ki:skills:audit`, and SHOULD expose the engineering families `ki:lint:check`, `ki:lint:types`, `ki:lint:md`, `ki:lint:md:check`.

_Verify:_ `audit-harness.ts` PKG-1 / PKG-2 FAIL when the two install/gate scripts are missing; PKG-3 WARNs per missing engineering script.

## Skills convention

### HARN-006 — Directory name is the skill name

For every `skills/<dir>/` containing a `SKILL.md`, the directory name MUST equal the `name:` frontmatter field, and no two skills MUST share a `name:`.

_Verify:_ `audit-harness.ts` SKILLS-1 FAILs on any directory-name/`name:` mismatch; the `ki-skills` cross-skill pass (COLL-1) FAILs on a duplicate `name:`.

## Discipline

### HARN-007 — ROADMAP.md holds only open work

`ROADMAP.md` MUST list only open work — no completed items, no ticked checkboxes, no `~~struck~~` entries — items being removed when done rather than checked off, per the `ki-harness` standard.

_Verify:_ `ki-harness`'s rubric ROAD-1 ([`skills/ki-harness/references/audit-rubric.md`](../../skills/ki-harness/references/audit-rubric.md)), applied by reading (judgment-graded).

### HARN-008 — CLAUDE.md orientation coverage

`CLAUDE.md` MUST open with a paragraph naming all five part-directories (`skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`) and MUST carry a five-part status table marking each part populated or an empty shelf, per the `ki-harness` standard.

_Verify:_ `ki-harness`'s rubric CLAUDE-1 and CLAUDE-2 ([`skills/ki-harness/references/audit-rubric.md`](../../skills/ki-harness/references/audit-rubric.md)), applied by reading (judgment-graded).

## Gaps

- The `mcp/` and `hooks/` shelves are scaffolded but empty; no requirement yet describes a populated MCP server or hook, since none ships.
