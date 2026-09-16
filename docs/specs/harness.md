# Harness structure — `HARN`

The behaviour of the harness as a repository: the five-part bundle and the container invariants a Knowledge Islands harness must satisfy so its skills, agents, and checkers are discoverable and self-describing. Part of the Specifications corpus; see [index.md](index.md).

> **Status:** accepted contract; conformance is declared per requirement.

## The five-part bundle

### HARN-001 — Five part-directories exist

The repo root MUST contain `skills/`, `subagents/`, `mcp/`, `evals/`, and `hooks/` as directories, per [ADR-KI-HARNESS-001](../decisions/ADR-KI-HARNESS-001-repository-structure-the-five-part-bundle.md).

_Conformance:_ conforming

_Verify:_ `bun skills/repo-structure/ki-repo-harness/scripts/audit-harness.ts .` — LAY-1 PASSes only when all five directories are present (a missing one is a FAIL).

_Evidence:_ `bun skills/repo-structure/ki-repo-harness/scripts/audit-harness.ts .` — LAY-1 PASSes only when all five directories are present (a missing one is a FAIL).

### HARN-002 — Each part declares its status

Each of the five part-directories MUST contain a `README.md` that declares whether the part is populated or an empty shelf.

_Conformance:_ conforming

_Verify:_ `audit-harness.ts` LAY-2 checks a `README.md` in each of `skills/`, `subagents/`, `mcp/`, `evals/`, `hooks/`.

_Evidence:_ `audit-harness.ts` LAY-2 checks a `README.md` in each of `skills/`, `subagents/`, `mcp/`, `evals/`, `hooks/`.

## Root anchors

### HARN-003 — Root orientation and config files

The repo root MUST carry `CLAUDE.md` (always-loaded orientation), `.ki.toml` (the KI compliance declaration), and SHOULD carry `ROADMAP.md` (the open-work signal), per [ADR-KI-HARNESS-001](../decisions/ADR-KI-HARNESS-001-repository-structure-the-five-part-bundle.md).

_Conformance:_ conforming

_Verify:_ `audit-harness.ts` LAY-3 (`CLAUDE.md`) and LAY-5 (`.ki.toml`) FAIL when absent; LAY-4 (`ROADMAP.md`) WARNs.

_Evidence:_ `audit-harness.ts` LAY-3 (`CLAUDE.md`) and LAY-5 (`.ki.toml`) FAIL when absent; LAY-4 (`ROADMAP.md`) WARNs.

### HARN-004 — Harness compliance table

`.ki.toml` MUST contain a `[skills.ki-repo-harness]` table marking the repo as a harness, and MUST contain a `[skills.ki-repo]` table opting into KI governance, per [ADR-KI-HARNESS-005](../decisions/ADR-KI-HARNESS-005-validate-down-ki-toml-contract.md).

_Conformance:_ conforming

_Verify:_ `audit-harness.ts` CONFIG-1 (`[skills.ki-repo-harness]`, FAIL if absent) and CONFIG-2 (`[skills.ki-repo]`, WARN if absent).

_Evidence:_ `audit-harness.ts` CONFIG-1 (`[skills.ki-repo-harness]`, FAIL if absent) and CONFIG-2 (`[skills.ki-repo]`, WARN if absent).

## Toolchain surface

### HARN-005 — Harness test surface

`package.json` MUST expose the harness's appropriate bare `test` entrypoint. Harness delivery, capability activation, and native governance execution belong to the installed `ki` CLI rather than package-script aliases or repository-local bootstrap runners.

_Conformance:_ conforming

_Verify:_ `bun run test` runs the complete harness suite; `ki repo audit --skill ki-engineering --repo .` checks the package-toolchain contract without requiring retired governance aliases.

_Evidence:_ `bun run test` runs the complete harness suite; `ki repo audit --skill ki-engineering --repo .` checks the package-toolchain contract without requiring retired governance aliases.

## Skills convention

### HARN-006 — Directory name is the skill name

For every `skills/<dir>/` containing a `SKILL.md`, the directory name MUST equal the `name:` frontmatter field, and no two skills MUST share a `name:`.

_Conformance:_ conforming

_Verify:_ `audit-harness.ts` SKILLS-1 FAILs on any directory-name/`name:` mismatch; the `ki-skills` cross-skill pass (COLL-1) FAILs on a duplicate `name:`.

_Evidence:_ `audit-harness.ts` SKILLS-1 FAILs on any directory-name/`name:` mismatch; the `ki-skills` cross-skill pass (COLL-1) FAILs on a duplicate `name:`.

## Discipline

### HARN-007 — Repository roadmaps hold only open work in one authoritative home

The repository roadmap MUST list only open work — no completed items, no ticked checkboxes, no `~~struck~~` entries — items being removed when done rather than checked off. Each item's prose MUST live only in its canonical flat `docs/roadmap/<REPO>-<NNN>-<slug>.md` record, while the root `ROADMAP.md` MUST be the exact generated linked index.

_Conformance:_ conforming

_Verify:_ `ki-work-roadmap`'s [repository-roadmap standard](../../skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md), plus its mechanical audit of the root orientation and canonical work items.

_Evidence:_ `ki-work-roadmap`'s [repository-roadmap standard](../../skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md), plus its mechanical audit of the root orientation and canonical work items.

### HARN-008 — CLAUDE.md orientation coverage

`CLAUDE.md` MUST open with a paragraph naming all five part-directories (`skills/`, `subagents/`, `mcp/`, `evals/`, `hooks/`) and MUST carry a five-part status table marking each part populated or an empty shelf, per the `ki-repo-harness` standard.

_Conformance:_ conforming

_Verify:_ `ki-repo-harness`'s rubric CLAUDE-1 and CLAUDE-2 ([`skills/repo-structure/ki-repo-harness/references/rubric.md`](../../skills/repo-structure/ki-repo-harness/references/rubric.md)), applied by reading (judgment-graded).

_Evidence:_ `ki-repo-harness`'s rubric CLAUDE-1 and CLAUDE-2 ([`skills/repo-structure/ki-repo-harness/references/rubric.md`](../../skills/repo-structure/ki-repo-harness/references/rubric.md)), applied by reading (judgment-graded).

### HARN-009 — Claude Code plan lifecycle hooks

The harness MUST ship `hooks/plan-stamp.sh` and `hooks/plan-sync.sh` as a Claude-Code-specific lifecycle pair. The state record is JSON V1 only, with exactly `version`, `session_id`, `plan_file`, and physically resolved `cwd`; malformed, schema-invalid, and plaintext state records MUST fail closed. The compatible harness payload makes hooks available to runtime bindings; the source harness MUST NOT claim a repository-local installer, mutate Claude settings, or create hook symlinks.

_Conformance:_ conforming

_Verify:_ `bun hooks/plan-stamp.test.ts && bun hooks/plan-sync.test.ts` exercises the pair; compatible-harness inventory checks confirm that the hooks payload is published without source-harness installation side effects.

_Evidence:_ `bun hooks/plan-stamp.test.ts && bun hooks/plan-sync.test.ts` exercises the pair; compatible-harness inventory checks confirm that the hooks payload is published without source-harness installation side effects.

### HARN-010 — Claude Code stale Git-lock guard

The harness MUST ship `hooks/git-lock-check.sh` as a Claude-Code-specific `Stop(*)` hook that removes stale lock files only from the current worktree's physical Git directory and only when no relevant Git process is active. `ki-git` owns that portable safety contract. The compatible harness publishes the payload for a separate user-environment binding to register; the source harness does not install it itself.

_Conformance:_ conforming

_Verify:_ `bun hooks/git-lock-check.test.ts` exercises repository, process, path, and symlink safety; compatible-harness inventory checks confirm the hook is present in the published payload.

_Evidence:_ `bun hooks/git-lock-check.test.ts` exercises repository, process, path, and symlink safety; compatible-harness inventory checks confirm the hook is present in the published payload.

### HARN-011 — Exhaustive capability applicability publication

A populated compatible Harness skills shelf MUST classify every canonical skill with valid applicability metadata, MUST reject collection-level baseline or detector-registry inconsistency, and MUST publish each capability's applicability in its generated catalogue.

_Conformance:_ conforming

_Verify:_ `ki-repo-harness` capability-publication tests exercise valid publication and reject missing classification, invalid baseline membership, kind inconsistency, unknown detector targets, and registry-to-skill drift.

_Evidence:_ `skills/README.md` is generated from the complete canonical skill collection and carries an applicability line for every entry.

## Gaps

- The `mcp/` shelf is scaffolded but empty; no requirement yet describes a populated MCP server because none ships here.
