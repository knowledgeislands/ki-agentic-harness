---
name: ki-harness
ki-depends-on: [ki-skills, ki-agents, ki-decision-records, ki-repo-roadmap]
ki-shared-dependencies: [ki-skills:rubric, ki-skills:checker, ki-skills:reporter, ki-bootstrap:educator, ki-skills:govern]
description: >
  Audit, conform, and scaffold Knowledge Islands agentic harnesses — repos that bundle skills, agents, MCP servers, evals, and hooks together for versioned, co-installed deployment. Use when creating a new harness, checking an existing harness's five-part layout (`skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`), verifying its CLAUDE.md covers required orientation sections, checking its package.json script families, or auditing its `.ki-config.toml` harness table. Triggers: "audit the harness", "scaffold a new harness", "does this repo follow the harness standard", "refresh the harness standard", "is this a valid harness". Governs the **container** (directory structure, CLAUDE.md, package.json script families, installation conventions, `.ki-config.toml` table) — not the **contents**: skill quality → `ki-skills`; agent quality → `ki-agents`; repository roadmap → `ki-repo-roadmap`; MCP server code → `ki-mcp`; engineering toolchain → `ki-engineering`; GitHub repo settings → `ki-repo`.
argument-hint: 'audit [path] | conform [path] | help | educate <name> | refresh'
---

# Knowledge Islands Harness

You are helping audit, conform, or scaffold a **Knowledge Islands agentic harness** — a single versioned repository that co-locates the five parts an agent is equipped with: skills (`skills/`), agents (`agents/`), MCP servers (`mcp/`), evals (`evals/`), and hooks (`hooks/`). The canonical reference implementation is [ki-agentic-harness](../../../README.md).

This skill governs the **container** — the harness's directory layout, its `CLAUDE.md` orientation, its `package.json` script families, and its `.ki-config.toml` compliance table. It does not govern the _contents_: skill quality routes to `ki-skills`, agent definitions to `ki-agents`, roadmap content to `ki-repo-roadmap`, MCP server code to `ki-mcp`, the engineering toolchain to `ki-engineering`, and GitHub-side settings to `ki-repo`. The harness is the bridge into those skills — it tells you _what the container must look like_ so the contents are findable, installable, and auditable; the sibling skills each tell you _what quality looks like_ inside their part.

The full canonical standard — what each part must contain and why — lives in [the harness standard](references/standards.md). The structured TypeScript items under `scripts/rubric/items/` are the canonical rubric; [the published rubric](references/rubric.md) is generated from them for human review. The thin [`scripts/govern.ts`](scripts/govern.ts) and [`scripts/govern.ts`](scripts/govern.ts) entry points run those items through the vendored canonical checker and reporter. Load the standard and published rubric when you need detail; this file is the operating procedure.

## Operating modes

Modes: **AUDIT · CONFORM · EDUCATE · REFRESH** (named, alphabetical). Invoked as `help` / `-h` / `?`, it explains itself and stops — the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows.

### Mode AUDIT — check a harness against the standard

1. **Run the mechanical checker.** `bun scripts/govern.ts [path]` from this skill's directory (or `bun run ki:harness:audit` at the harness root, if wired). It checks: the five-part directory presence, each directory's `README.md`, root `CLAUDE.md` / `ROADMAP.md`, `package.json` script families, `.ki-config.toml` `[ki-harness]` table presence, and each `skills/<dir>` name matching its `SKILL.md` `name:` frontmatter. Its default output is canonical JSONL. Add `--reporter=terminal` for the human view; the terminal reporter shows FAIL and WARN by default, while `--reporter-levels=all` includes every outcome. Judgment items are counted as unevaluated in the summary rather than emitted as synthetic findings.
2. **Compose on sibling skills via subagent isolation** ([ADR-KI-HARNESS-AGENTS-001](../../../docs/decisions/ADR-KI-HARNESS-AGENTS-001-subagent-isolation-for-multi-skill-invocation.md)). A harness audit is layered — fan out one `agent()` per concern in `parallel()` after the COLL checks:
   - `ki-repo` — GitHub settings and the `.ki-config.toml` contract
   - `ki-engineering` — aggregate entrypoints and internal code toolchain (package.json, tsconfig, biome)
   - `ki-repo-roadmap` — non-KB roadmap profile, content discipline, and thematic projections
   - `ki-skills` linter (`bun run ki:skills:audit`) — if `skills/` is populated
   - `ki-agents` linter — if `agents/` is populated
   - `ki-mcp` audit — if `mcp/` has server code. For a large judgment review, `ki-delegate` may fan out independent concerns after the aggregate mechanical result is captured; see [ADR-KI-HARNESS-AGENTS-001](../../../docs/decisions/ADR-KI-HARNESS-AGENTS-001-subagent-isolation-for-multi-skill-invocation.md).
3. **Judge the prose the script can't.** Walk the [J]-tagged criteria in [the rubric](references/rubric.md):
   - **CLAUDE.md coverage** — does it open with a what-the-harness-is paragraph covering all five parts? Is the skill map present (if skills exist) and does it reflect current reality? Are working conventions documented for each part? Are the key `bun run *` commands listed?
   - **Freshness** — do the skill count, shelf statuses, and command names in `CLAUDE.md` still match the actual repo state?
   - **ROADMAP.md discipline** — does it show only open work? If the repository uses the thematic profile, is the root an exact generated portfolio rather than a second home for item prose? Are continuous practices absent (they belong in `ki-skills`' enforcement framework, not the roadmap)?
4. **Report** through the canonical checker reporter. Mechanical violations are FAIL or WARN; successful CONFORM actions are FIXED; non-violations are INFO, NOT_APPLICABLE, or PASS. Judgment findings come from the human/model review, not the mechanical JSONL run.

### Mode CONFORM — bring a harness into line

1. Run **AUDIT** first to get the fix list.
2. **Apply the fixes:** create missing directories with stub `README.md`s, add or correct `CLAUDE.md` sections, update `ROADMAP.md`, add missing `.ki-config.toml` tables, fix `package.json` script families — per [the rubric](references/rubric.md) and [the standard](references/standards.md), touching only what a criterion calls for.
3. **Re-run AUDIT** until it is clean.

### Mode EDUCATE — scaffold a new harness

1. **Name the harness.** The repository name is the harness identity; agree on it before creating.
2. **Scaffold the five parts.** Create `skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`, each with a `README.md` describing what it holds — marking any part an empty shelf if it starts unpopulated.
3. **Write `CLAUDE.md`** using [the standard](references/standards.md) §CLAUDE.md required sections as the template: what-the-harness-is paragraph, five-part directory table with current status, working conventions per part, key `bun run *` commands.
4. **Add `ROADMAP.md`.** Start with the known open work; mark items open-only. Note: continuous practices are not roadmap items — they belong in `ki-skills`' enforcement framework or `CLAUDE.md`.
5. **Scaffold `package.json`** with the harness-specific required scripts: `ki:skills:copy:project` and `ki:skills:audit`. `ki-bootstrap` publishes ordinary repositories as portable copies and recognises a harness target as the source of its own skills, publishing those runtime entries as links. The cross-skill operational keys point at the generated tools `ki-bootstrap` vendors into `.ki/bin/` for a harness-shaped target — `ki:skills:graph` (`bun .ki/bin/skill-graph.ts --tree`) and `ki:skills:help` (`bun .ki/bin/skill-help.ts`). The global user installation is `/harness/install`, not a package script. Compose `ki-engineering` and `ki-authoring` for the aggregate entrypoints and toolchain passes; this skill does not duplicate their checks.
6. **Add `.ki-config.toml`** with at minimum `[ki-repo]`, `[ki-engineering]`, and `[ki-harness]`. Add `[ki-skills]` once `skills/` is populated.
7. **Self-audit.** Run Mode AUDIT on the new harness before handing it off.

### Mode REFRESH — re-anchor the standard

**Precondition:** REFRESH edits this skill's own canonical files, which exist only in `ki-agentic-harness`. Invoked from a repo where the skill is vendored, it stops here and names the harness as where to run it — or, for a pattern recurring across bases, routes it through `ki-kb`'s IMPROVE mode instead.

The harness standard is a KI architectural convention, not an external spec — it is grounded in the [ki-agentic-harness](../../../README.md) as the reference implementation. REFRESH means verifying the standard reflects current practice, and checking the external sources it builds on (Agent Skills, Claude Code subagent docs) for changes that affect the harness contract.

1. **Read [the source list](references/sources.md)** — tracked sources, each with a `last reviewed` date.
2. **Re-fetch external sources** (Agent Skills specification, Claude Code subagent docs) and diff against [the standard](references/standards.md): new required SKILL.md fields, changed skill-install conventions, new subagent format requirements.
3. **Check the reference implementation** — read [ki-agentic-harness](../../../README.md) and its `CLAUDE.md`; does the standard still match current practice? Promote uncodified patterns that work well; flag any drift between the standard and the reference.
4. **Propose a diff** to [the standard](references/standards.md) and the canonical TypeScript items under `scripts/rubric/items/`. Confirm before writing, then regenerate [the published rubric](references/rubric.md) with `bun scripts/rubric/publish.ts`.
5. **Update [the source list](references/sources.md)** — bump `last reviewed` dates and refresh the `## Last review` block (what's confirmed, open watch-items). The record of _what changed_ is the commit, not a changelog here.

Run REFRESH on this skill's declared cadence (the `**Refresh:**` marker in [`references/sources.md`](references/sources.md) — `external-spec · monthly`). If it's invoked while still within that window, confirm before forcing (interactive) or skip (scheduled), per the enforcement framework's REFRESH gate.

## Notes

- Auditing a harness runs the harness _delta_ on top of the sibling skills' checks — AUDIT step 2 lists the composition order. Don't double-report what a sibling's checker already surfaces. The root `ROADMAP.md` exists by the harness contract; its non-KB content and profile belong to `ki-repo-roadmap`.
- A harness that has empty shelves (`agents/`, `mcp/`, `evals/` with no real content) is a valid harness — the shelves exist to mark intent and reserve the structure. A shelf is not a gap.
- The `ki:skills:copy:project` install convention is the harness's primary project delivery mechanism — verifying it is wired in `package.json` is a FAIL criterion, not advisory. Bootstrap links a harness's own runtime skill entries and copies those for ordinary repositories.
