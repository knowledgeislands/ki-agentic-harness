# Harness structure — `HARN`

The behaviour of the harness as a repository: the four-part container and the invariants a Knowledge Islands harness must satisfy so its skills, agents, and checkers are discoverable and self-describing. Part of the Specifications corpus; see [index.md](index.md).

> **Status:** accepted contract; conformance is declared per requirement.

## The four-part harness

### HARN-001 — Four part-directories exist

The repo root MUST contain `skills/`, `subagents/`, `evals/`, and `hooks/` as directories. MCP servers remain independently released repositories outside the harness.

_Conformance:_ conforming

_Verify:_ `ki repo audit --skill ki-repo-harness --repo .` — LAY-1 PASSes only when all four directories are present (a missing one is a FAIL).

_Evidence:_ `ki repo audit --skill ki-repo-harness --repo .` — LAY-1 checks the four required physical directories.

### HARN-002 — Each part declares its status

Each of the four part-directories MUST contain a `README.md` that declares whether the part is populated or an empty shelf.

_Conformance:_ conforming

_Verify:_ `ki repo audit --skill ki-repo-harness --repo .` — LAY-2 checks a `README.md` in each of `skills/`, `subagents/`, `evals/`, and `hooks/`.

_Evidence:_ `ki-repo-harness` LAY-2 checks all four shelf descriptions.

## Root anchors

### HARN-003 — Root orientation and config files

The repo root MUST carry `CLAUDE.md` (always-loaded orientation), `.ki.toml` (the KI compliance declaration), and SHOULD carry `ROADMAP.md` (the open-work signal).

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

The effective root orientation MUST explain the four-part harness (`skills/`, `subagents/`, `evals/`, `hooks/`) and state the current status of every part, per the `ki-repo-harness` standard.

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

### HARN-012 — Coordinator reminder hook

The harness MUST ship `hooks/coordinator-reminder.sh` as a `UserPromptSubmit` and `SessionStart(compact)` hook that injects one line restating the `ki-pmo` responsive-coordinator rules, including the coordinator's update cadence, naming the owner-report form without restating it, the `ki-pmo` report heading that opens it, the closing block-letter `ki-pmo` footer banner with its bracketed-state list, the resume line at rest and the prefilled reply block, in a coordinating thread, meaning one whose working directory or Git top level holds a `.ki.toml` declaring `[skills.ki-pmo]`, and that stays silent in any agent `ki agent` launches; at a `SessionStart` with `source: compact` it MUST inject instead a one-line pointer to the `ki-pmo` re-anchoring steps. Under Claude Code, where `CLAUDECODE` is set, it MUST NOT require a controlling terminal; under Codex it keeps the terminal check until the Codex launcher sets `KI_AGENT_RUN`. `ki-pmo` owns the hook's lines: its standard's generated surfaces hold their text, and `ki dev skill generate ki-pmo --write` renders them into the script. It MUST fail open. The same script MUST serve Claude Code and Codex CLI; a user-environment manager owns its registration on each runtime.

_Conformance:_ conforming

_Verify:_ `bun test hooks/coordinator-reminder.test.ts` replays sample Claude Code and Codex payloads for a coordinating message in a declaring checkout, a checkout holding checkpoints without the declaration, an ordinary repository, a marked background child under either runtime, a terminal-less Codex process, a terminal-less Claude Code session, post-compaction `SessionStart` with the pointer, and malformed input.

_Evidence:_ `bun test hooks/coordinator-reminder.test.ts` passes; headless `claude -p` and `codex exec` runs from a scratch checkout holding `+/_CHECKPOINTS/` quoted the injected line, and a child carrying `KI_AGENT_RUN` received nothing. On 2026-10-14, after the cadence clause was added, the script replayed by hand with a terminal in its ancestry printed the new line for a coordinating checkout and nothing with `KI_AGENT_RUN` set or in an ordinary repository; the Codex trust hashes cover the handler entry, not the script, so the registration was unchanged. On 2026-10-14 the signal moved from `+/_CHECKPOINTS/` to the `[skills.ki-pmo]` declaration under KI-PRINCIPAL-ECO-013, Kris's words "HOOK-OWNER - (a). A repository that doesn't delegate then never gets the hook, and removing ki-pmo disables it."; the test suite covers both the declaring and the undeclared checkout. On 2026-10-14, under KI-HARNESS-GOV-187 and Kris's "approve the hook runtime split", the terminal check became Codex-only and the compact session start gained the re-anchoring pointer; the suite covers a terminal-less Claude Code session, a terminal-less Codex process and the pointer.

### HARN-013 — Coordinator output style

The harness MUST ship `output-styles/ki-coordinator.md`, a Claude Code output style whose text is the `ki-pmo` responsive-coordinator rules in Kris's words, the owner-report shape with its prefilled reply block, the report heading byte-identical to the `ki-pmo` standard, three rules, the Initiative and the Project linked, the form line and one rule, and the closing block-letter footer banner with the REST, BUSY and DRAINED examples byte-identical to the standard, the the lower-case form word and the issued time in its top border, one blank framed line inside each border, a blank line, then one Markdown list of bracketed-state items, `- [running]`, `- [queued]`, `- [waiting]` or `- [at rest]`, with the housekeeping items of the same kind and no label-and-mark line, and, at rest, the resume line, so that the style a coordinating thread runs under and the coordinating-thread standard are one document; the style is rendered whole from the standard's generated surfaces by `ki dev skill generate ki-pmo --write`, and the banner test fails while it is stale. A repository that declares `ki-pmo` selects it with `outputStyle` in its tracked `.claude/settings.json`, and the harness does so itself. The style MUST NOT shorten any section, query or reply block of an owner report. Deploying the file into a user's `~/.claude/output-styles/` belongs to the user-environment manager, not the harness.

_Conformance:_ conforming

_Verify:_ `output-styles/ki-coordinator.md` exists with `name: ki-coordinator` frontmatter and carries the three rules, the owner-report shape, the report heading and the footer frames, which `bun test skills/change-management/ki-pmo/scripts/banner.test.ts` compares with the standard, asserting the report heading example byte-identical to the standard's, and the footer's issued top border, its three block-letter rows as revision `e60b4e45` carried them, the blank line, the `[at rest]` item and the bracketed-state items; `.claude/settings.json` carries `"outputStyle": "ki-coordinator"`.

_Evidence:_ both files are tracked in this repository; the pilot's live acceptance in a coordinating thread is recorded by KI-PRINCIPAL-ECO-013 in Knowledge Islands Principal.
