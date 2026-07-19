# Harness structure — `HARN`

The behaviour of the harness as a repository: the five-part bundle and the container invariants a Knowledge Islands harness must satisfy so its skills, agents, and checkers are discoverable and self-describing. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## The five-part bundle

### HARN-001 — Five part-directories exist

The repo root MUST contain `skills/`, `agents/`, `mcp/`, `evals/`, and `hooks/` as directories, per [ADR-KI-HARNESS-001](../decisions/ADR-KI-HARNESS-001-repository-structure.md).

_Verify:_ `bun skills/repo-structure/ki-harness/scripts/audit-harness.ts .` — LAY-1 PASSes only when all five directories are present (a missing one is a FAIL).

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

### HARN-005 — Harness delivery and skill-quality scripts

`package.json` MUST expose the normal `ki-bootstrap` project delivery script `ki:skills:copy:project` and the skill quality gate `ki:skills:audit`. Aggregate toolchain entrypoints belong separately to `ki-engineering` rather than being duplicated in the harness contract.

_Verify:_ `bun skills/repo-structure/ki-harness/scripts/audit.ts .` — PKG-1 / PKG-2 FAIL when the two harness-specific scripts are missing and emit no duplicate PKG-3 toolchain finding.

## Skills convention

### HARN-006 — Directory name is the skill name

For every `skills/<dir>/` containing a `SKILL.md`, the directory name MUST equal the `name:` frontmatter field, and no two skills MUST share a `name:`.

_Verify:_ `audit-harness.ts` SKILLS-1 FAILs on any directory-name/`name:` mismatch; the `ki-skills` cross-skill pass (COLL-1) FAILs on a duplicate `name:`.

## Discipline

### HARN-007 — Repository roadmaps hold only open work in one authoritative home

The repository roadmap MUST list only open work — no completed items, no ticked checkboxes, no `~~struck~~` entries — items being removed when done rather than checked off. In the thematic profile, each item's prose MUST live only in its canonical `docs/roadmap/<theme>/ROADMAP.md`, while the root `ROADMAP.md` MUST be the exact generated linked portfolio.

_Verify:_ `ki-repo-roadmap`'s [repository-roadmap standard](../../skills/general-governance/ki-repo-roadmap/references/standards.md), plus its mechanical audit of the exact root projection.

### HARN-008 — CLAUDE.md orientation coverage

`CLAUDE.md` MUST open with a paragraph naming all five part-directories (`skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`) and MUST carry a five-part status table marking each part populated or an empty shelf, per the `ki-harness` standard.

_Verify:_ `ki-harness`'s rubric CLAUDE-1 and CLAUDE-2 ([`skills/repo-structure/ki-harness/references/rubric.md`](../../skills/repo-structure/ki-harness/references/rubric.md)), applied by reading (judgment-graded).

### HARN-009 — Claude Code plan lifecycle hooks

The harness MUST ship `hooks/plan-stamp.sh` and `hooks/plan-sync.sh` as a Claude-Code-specific lifecycle pair and expose `ki:hooks:install` to install the complete hook payload as manifest-verified executable regular files under an owned content-addressed `~/.claude/hooks/knowledgeislands/ki-agentic-harness/` namespace. Its active manifest MUST declare stable regular `current/<hook-name>` command copies, each matching the manifest checksum, for a user-environment manager to register without embedding a payload hash. It MUST NOT write Claude settings or create hook symlinks.

_Verify:_ `bun hooks/plan-stamp.test.ts && bun hooks/plan-sync.test.ts` exercises the pair; `bun skills/keystone/ki-bootstrap/scripts/internal/user-install/install-claude-hook-payload.test.ts` exercises payload ownership, durability, and settings non-mutation.

### HARN-010 — Claude Code stale Git-lock guard

The harness MUST ship `hooks/git-lock-check.sh` as a Claude-Code-specific `Stop(*)` hook that removes stale lock files only from the current worktree's physical Git directory and only when no relevant Git process is active. The payload installer MUST carry it with the lifecycle pair and provide an active, manifest-verified payload for a separate user-environment binding to register.

_Verify:_ `bun hooks/git-lock-check.test.ts` exercises repository, process, path, and symlink safety; `bun skills/keystone/ki-bootstrap/scripts/internal/user-install/install-claude-hook-payload.test.ts` exercises the payload installer.

## Gaps

- The `mcp/` shelf is scaffolded but empty; no requirement yet describes a populated MCP server because none ships here.
