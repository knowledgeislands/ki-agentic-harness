# The housekeeping standard — hygiene of accumulated Claude state

What this skill governs, why, and how it splits work with the `mcp-claude-housekeeping` MCP server. The line-by-line checkable criteria are in [rubric.md](rubric.md); the memory area's file format is in [memory-format.md](memory-format.md).

## 1. The domain

Every Claude surface leaves state on the machine, and it accumulates: sessions pile up, artifacts and uploads are never garbage-collected, backups multiply, plugins and project caches go stale, and per-project auto-memory drifts from the code it describes. None of this is the repo's concern — it lives outside any repo tree — so no repo-structure skill governs it. This skill does: it owns the **standard** for what healthy accumulated state looks like, and the **judgment** to decide when state is obsolete, orphaned, or oversized.

The state spans three surfaces on macOS:

- **Claude Desktop / Cowork sessions** — `~/Library/Application Support/Claude/`, including `local-agent-mode-sessions/<account>/<workspace>/`.
- **Claude Code** — `~/.claude/` (projects, memory, plugins, cache, debug).
- **VSCode chat sessions** — `workspaceStorage/<id>/chatSessions/`.

## 2. The areas

| Area                    | What it covers                                                          | Mechanical arm                            |
| ----------------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| **Sessions**            | Stored session transcripts; obsolete / superseded sessions              | Server                                    |
| **Artifacts / outputs** | Generated artifacts, uploads, downloaded outputs; orphaned or oversized | Server                                    |
| **Backups**             | Automatic backups that multiply without bound                           | Server                                    |
| **Plugins**             | Installed-plugin inventory and staleness                                | Server                                    |
| **Project cache**       | Per-project caches and debug info                                       | Server                                    |
| **Auto-memory**         | The per-project `memory/*.md` + `MEMORY.md` Headroom writes             | **Local** (`audit.ts`) + memory-format.md |

## 3. The skill↔server pairing

The mechanical arm is split by area, on one principle: **the skill is the standard and the judgment; the server is the tools.**

- For **memory**, the skill governs the area in full — the format is a file convention the skill fully specifies ([memory-format.md](memory-format.md)) and checks with its own [`audit.ts`](../scripts/govern.ts). No server tool is needed to read a `memory/` directory a repo points at.
- For **every other area**, the state lives in macOS application-support paths that need dedicated, access-gated filesystem tools to inspect and clean safely. Those tools are the paired **`mcp-claude-housekeeping`** server (`@knowledgeislands/mcp-claude-housekeeping`) — codified per-surface audits plus read/`destructive` access-gated tools under the `<app>_<resource>_<action>` naming scheme. The skill reads the server's audit findings and applies judgment (is this session obsolete? is this backup safe to drop?); it never re-implements the tools.

The server is governed as an MCP server by `ki-mcp`; this skill is its standard-and-judgment counterpart. Neither owns the other: the server ships tools with no opinion on when to use them; the skill holds the opinion and no tools beyond the memory checker.

## 4. Boundaries

- **Not** a Knowledge Islands base's own memory cascade — a KB's root `Admin/MEMORY.md` indexing its Pillars is KB content read at session start (`ki-kb`'s MEM-2), not machine state.
- **Not** the token cost of the standing-context surface — that is `ki-tokenomics`, which measures what the loaded surface costs per turn rather than the hygiene of what accumulates on disk.
- **Not** the MCP server's own code quality — that is `ki-mcp`, which audits `mcp-claude-housekeeping` as server code.
- **Not** a repository's own local concerns — repeatable repository checks, semi-regular human review, and repository-specific maintenance belong to its repo-local `ki-self` governance skill. `ki-self audit` is the local-housekeeping audit for those concerns; a pattern that repeats across repositories graduates into a named shared Knowledge Islands skill. `ki-housekeeping` expects this companion boundary but does not install or manage a repo's local skill.

### The `ki-self` companion contract

Every governed repository is expected to carry `ki-self` as a committed local governance skill for its local concerns. The contract is runtime-neutral: read only `[ki-repo].supported_runtimes`, never scan runtime directories for an inferred “latest” or preferred location. The discovery paths are `.claude/skills/ki-self/SKILL.md` for `claude-code` and `.agents/skills/ki-self/SKILL.md` for `codex`.

Each declared runtime's payload is an owned regular file, never a symlink, with `name: ki-self`. When more than one declared runtime is supported, the payload bytes are identical so the same local governance interface travels with the repository. The `ki-housekeeping` checker reports absence as a WARN, unsafe or misidentified payloads as FAIL, and does not inspect the repository-specific local concerns themselves.

CONFORM does not manufacture a local ledger, audit procedures, or a `ki-self` body: those are local authoring decisions. `ki-self EDUCATE` establishes them when the repository needs them, and `ki-self CONFORM` handles their later source-state remediation.
