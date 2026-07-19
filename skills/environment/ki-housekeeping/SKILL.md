---
name: ki-housekeeping
depends-on: []
vendors: [educate, audit, conform, help]
checker-dependencies: [ki-skills:rubric, ki-skills:checker, ki-skills:reporter]
description: >
  Governs the hygiene of accumulated Claude state on a machine — the files Claude Desktop / Cowork sessions, Claude Code (`~/.claude/`), and VSCode chat sessions leave behind: stored sessions, artifacts and outputs, backups, plugins, project cache, and per-project auto-memory. Owns the standard and the judgment; the paired `mcp-claude-housekeeping` MCP server is its mechanical arm (codified per-area filesystem audits + access-gated cleanup tools). The memory area also carries a local checker (`audit.ts`): the `memory/*.md` + `MEMORY.md` format, the four types (user/feedback/project/reference), index agreement, and promote-then-delete reconciliation. Triggers: "audit memory", "memory hygiene", "clean up Claude storage", "obsolete Cowork sessions", "housekeeping audit", "check ~/.claude". Not a Knowledge Islands base's own memory cascade (`ki-kb`'s MEM-2, the root `Admin/MEMORY.md`) — that is KB content, not machine state. Not the token cost of the context surface — that is `ki-tokenomics`.
argument-hint: 'audit [repo-path] | conform [repo-path] | help | educate [repo-path] | refresh'
---

# ki-housekeeping

**Standard:** the hygiene of accumulated Claude state across the surfaces where it collects — the areas and the skill↔server pairing in [standards.md](references/standards.md); the memory area's file format in [memory-format.md](references/memory-format.md); line-by-line criteria in [rubric.md](references/rubric.md); tracked sources in [sources.md](references/sources.md).

## What this skill owns

The **standard and judgment** over the state Claude accumulates on a machine, across three surfaces — Claude Desktop / Cowork sessions, Claude Code (`~/.claude/`), and VSCode chat sessions — spanning the areas: **sessions**, **artifacts / outputs**, **backups**, **plugins**, **project cache**, and **auto-memory**. Full model in [standards.md](references/standards.md).

The **mechanical arm** is split by area:

1. **Memory** — governed locally, in full. The index/file contract (every `memory/*.md` listed in `MEMORY.md`, every entry resolving to a file), the frontmatter schema (`name` / `description` / `metadata.type` ∈ `user` / `feedback` / `project` / `reference`), the four-type doctrine and promote-then-delete reconciliation, checked by [`scripts/audit.ts`](scripts/audit.ts). Detail in [memory-format.md](references/memory-format.md).
2. **Every other area** — the mechanical arm is the paired **`mcp-claude-housekeeping`** MCP server (`@knowledgeislands/mcp-claude-housekeeping`): its codified per-surface audits (e.g. the Cowork filesystem audit) and its access-gated read/destructive tools. The skill states what healthy looks like and applies judgment over the server's findings; the server holds the macOS-filesystem tools that gather them. This skill never re-implements those tools — the pairing is skill-as-standard, server-as-tools.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH**. Invoked as `help` / `-h` / `?`, it explains itself and stops — the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows.

| Mode | What it does |
| --- | --- |
| AUDIT | For the memory area run `audit.ts`, which also checks the runtime-neutral `ki-self` companion contract for a governed repository; for the other areas run the `mcp-claude-housekeeping` server's codified audits (its audit tools / reports); then apply the judgment criteria in [rubric.md](references/rubric.md). Procedure in [mode-audit-conform.md](references/mode-audit-conform.md). |
| CONFORM | AUDIT, then fix each finding: memory in place per the rubric; other areas via the server's access-gated cleanup tools (destructive tools require the server's access level). It does not invent a repository's local concerns or `ki-self` body; use that repository's local EDUCATE/CONFORM process. Re-AUDIT until clean. Same procedure file as AUDIT. |
| EDUCATE | Scaffolds no standalone artifact — the state this skill governs already accumulates outside the repo tree. It vendors the skill's declared mechanical unit (the frontmatter `vendors:` declaration, `audit.ts`) into the target's `.ki-meta/` via the central bootstrap chain: [`scripts/educate.ts`](scripts/educate.ts) is a thin delegator into the `ki-bootstrap` engine. |
| REFRESH | Re-check the standard against its sources: Headroom's memory-feature behavior for the memory format, and the `mcp-claude-housekeeping` server's tool surface for the other areas, per [mode-refresh.md](references/mode-refresh.md). |

## Notes

- The state this skill governs lives **outside the repo tree** — under `~/.claude/`, `~/Library/Application Support/Claude/`, and VSCode's `workspaceStorage/`. A repo opts a machine into the memory-area check via a `[ki-housekeeping]` table in its `.ki-config.toml`; the session / artifact / storage areas are machine-level and audited directly through the server, not per-repo.
- Every governed repository is expected to carry a repo-local `ki-self` governance skill for its **local concerns**. The mechanical check reads only the runtimes declared by `[ki-repo].supported_runtimes`: Claude Code resolves to `.claude/skills/ki-self/SKILL.md`; Codex resolves to `.agents/skills/ki-self/SKILL.md`. Each must be an owned regular file declaring `name: ki-self`, and all declared runtime payloads must be identical. `ki-self audit` is that repository's local-housekeeping audit; `ki-housekeeping` remains the machine-state audit and does not absorb, install, or author the local skill. The shared taxonomy records the boundary in [The skills](../../../docs/guides/user-guide/skills.md#ki-self-local-governance-for-local-concerns).
- A repo with no `memory/` directory yet (never used auto-memory) is an **NA**, not a FAIL.
- Composes on `ki-authoring` for the Markdown formatting delta of the memory files; the mechanical-checker contract and severity ladder are `ki-skills`' [checker contract](../../general-governance/ki-skills/references/checker-contract.md).
- Does not assume any particular personal `~/.claude/CLAUDE.md` content — the doctrines checked are the systems' own universal instructions, not one user's private elaboration of them.
