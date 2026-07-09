---
name: ki-bootstrap
implies: [ki-repo]
description: >
  Wires a Knowledge Islands repo's project-local skills (`.claude/skills/`) from its `.ki-config.toml`. Use when setting up or auditing a repo's skill links, bootstrapping a fresh clone so the right skills load, or adding the `ki:skills:link:project` convention to a repo for the first time. Triggers: "set up this repo's skills", "bootstrap the skills", "add ki:skills:link:project", "wire project-local skills", "why aren't my skills loading in this repo". This is the install keystone — the one knowledgeislands skill kept installed globally, so any repo can self-wire. For the `.ki-config.toml` contents and the coverage cascade (which skills a repo should declare) and GitHub settings use `ki-repo`; for the harness's four-part layout use `ki-harness`.
argument-hint: 'audit [path] | conform [path] | refresh'
---

# Knowledge Islands Bootstrap

You are wiring a Knowledge Islands repo's **project-local skills** — the `.claude/skills/` symlinks that make exactly the right skills load when working in that repo, and no others elsewhere. This is the install mechanism that keeps the standing skill-description cost out of unrelated sessions (the tokenomics reason the skills are project-local rather than global).

This skill governs **one invariant** and is deliberately tiny, because it is the **keystone**: the only `ki-*` skill kept in `~/.claude/skills` (so its `description` is paid on every turn everywhere). Everything else is project-local and loads only where it applies.

**The model — at a glance:**

- A repo's `.claude/skills/` should mirror its **declared coverage** — the `[ki-<skill>]` tables in its `.ki-config.toml` — **plus a baseline of `ki-repo` + `ki-authoring`** (so a greenfield repo with no tables can still reach repo's INIT, and Markdown/TOML style is always governed). The keystone itself is never linked project-local — it is global.
- A repo's `.claude/agents/` should mirror `agents/governance/*.md` **only when** it carries the bare `[ki-agents]` table — no baseline, since no agent is always-on.
- Links are **relative symlinks** into the harness's `skills/`/`agents/governance/`, **gitignored and regenerated** — the committed artifacts are `ki:skills:link:project`/`ki:agents:link:project` package.json scripts and the `.gitignore` lines, never the symlinks (which would dangle on a clone without the harness beside it).
- The **harness** (`ki-agentic-harness`) is the authoring hub: it links **all** skills (`--all`), not a coverage subset.

The skill linker/checker is [`scripts/link-skills.ts`](scripts/link-skills.ts); the agent linker/checker is [`scripts/link-agents.ts`](scripts/link-agents.ts), a direct sibling sharing the same self-location and package.json-splice logic ([`scripts/package-scripts.ts`](scripts/package-scripts.ts)). Both self-locate the harness through their own (symlinked) path. The quotable invariant is [the standard](references/bootstrap-standard.md); the checkable criteria are [the rubric](references/audit-rubric.md). This skill **composes on** `ki-repo`, which owns the `.ki-config.toml` contract it reads — it never edits the config's coverage, only mirrors it.

## Mode AUDIT — check a repo's project-local skills and agents

1. **Run the checkers.** `bun "$HOME/.claude/skills/ki-bootstrap/scripts/link-skills.ts" [path] --check` and `bun "$HOME/.claude/skills/ki-bootstrap/scripts/link-agents.ts" [path] --check` (or `bun run ki:skills:link:project --check` / `bun run ki:agents:link:project --check` if wired). They report on the unified severity ladder (`ki-engineering` enforcement-framework §2): **BOOT-1** `.claude/skills/` matches declared coverage ∪ baseline (and no dangling links), **BOOT-2** a `ki:skills:link:project` script is present, **BOOT-3** `.claude/skills/` is gitignored, **BOOT-5** every linked skill with a checker or conform script has a matching `ki:<suffix>:<verb>` package.json script, **BOOT-6** `.claude/agents/` matches the `[ki-agents]`-gated set, **BOOT-7** a `ki:agents:link:project` script is present (when the table is declared), **BOOT-8** `.claude/agents/` is gitignored.
2. **Judge the [J] criterion (BOOT-4) by reading** — is the repo's _declared_ coverage actually right (does it opt into the skills it uses)? That is `ki-repo`'s coverage cascade, not this skill's; name it as the off-ramp rather than re-deciding it here.
3. **Report** by criterion. A missing/dangling link or absent `ki:skills:link:project`/`ki:agents:link:project`/gitignore is a WARN — all are conformable, none block.

## Mode CONFORM — wire a repo

1. Run **AUDIT** first.
2. **Link** the project-local set: `bun "$HOME/.claude/skills/ki-bootstrap/scripts/link-skills.ts" [path]` (the harness uses `--all`) and `bun "$HOME/.claude/skills/ki-bootstrap/scripts/link-agents.ts" [path]`. Each creates/prunes relative symlinks under `.claude/skills/`/`.claude/agents/` to match its expected set. Preview either with `--dry-run`.
3. **Make it reproducible:** ensure `package.json` has `"ki:skills:link:project"` and (if `[ki-agents]` is declared) `"ki:agents:link:project"` invoking the keystone linkers, and `.gitignore` carries `.claude/skills/` and `.claude/agents/`. (The keystone must be globally installed — `bun scripts/sync-skills.ts link --only ki-bootstrap` from the harness.) The **Link** step above also scaffolds a `ki:<suffix>:<verb>` script per linked skill that carries a discoverable checker or conform script — e.g. `ki:kb:audit`, `ki:repo:conform` — so no separate action is needed for those.
4. **Re-run AUDIT** until clean.

## Mode REFRESH — re-anchor

Canonical, on-change: this skill tracks no external spec. Re-anchor when the install model changes — the coverage-table contract (`ki-repo`), the `[ki-agents]` gating convention, the skill/agent discovery locations Claude Code reads, or the `ki:skills:link:project`/`ki:agents:link:project` conventions. Read [the source list](references/sources.md), confirm the standard still matches the reference implementation, propose a diff, bump the dates.

## Composition

- `ki-repo` — owns the `.ki-config.toml` coverage-cascade contract and the GitHub settings. This skill reads that config but never edits it; for any question about _which_ skills a repo should declare, route to `ki-repo`.
- `ki-tokenomics` — owns the standing-cost rationale for keeping skills project-local (not global). For token-budget questions, route there.

## Notes

- **Why a keystone, not part of `ki-repo`:** the global skill is paid every turn everywhere, so it must be minimal. `repo` is heavy (GitHub settings, security, files). Splitting the bootstrap out keeps the global footprint to one tiny description; `repo` stays project-local and loads only in repos that declare it (which is every ki repo — it's in the baseline).
- **Greenfield:** a repo with no `.ki-config.toml` yet still gets `{repo, authoring}` linked, so `ki-repo` INIT is reachable to scaffold the config; re-run CONFORM afterwards for the full declared set.
