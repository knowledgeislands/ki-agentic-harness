# Harness Standard

The normative, quotable reference for a **Knowledge Islands agentic harness**. Every harness must conform to this. Rationale is inline so a reader knows not just what, but why — and can judge edge cases rather than apply rules blindly.

The rubric ([`rubric.md`](rubric.md)) is the line-by-line checkable form of this document, with [M] / [J] tags and criterion codes. The sources behind these decisions are in [`sources.md`](sources.md).

## Contents

- [What a harness is](#what-a-harness-is)
- [§Capability publication](#capability-publication)
- [§Layout — the five-part directory requirement](#layout--the-five-part-directory-requirement)
- [§Skills directory — the naming convention](#skills-directory--the-naming-convention)
- [§Harness-local source links](#harness-local-source-links)
- [§CLAUDE.md required sections](#claudemd-required-sections)
- [§ROADMAP.md](#roadmapmd)
- [§package.json required scripts](#packagejson-required-scripts)
- [§.ki-config.toml tables](#ki-configtoml-tables)
- [§Boundary declarations](#boundary-declarations)

---

## What a harness is

An **agentic harness** is a single versioned git repository that co-locates the five parts an agent is equipped with:

| Directory | What it holds                                            | Install path                                                |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| `skills/` | [Agent Skills][as-spec] — one directory per skill        | Copied into a repo's selected runtime skill directory †     |
| `agents/` | Claude Code subagent definitions — one `.md` per agent   | Symlinked or copied by the Claude Code agent runner         |
| `mcp/`    | Workspace MCP server packages ‡                          | Referenced by `.claude/settings.json` / `mcp_settings.json` |
| `evals/`  | Behavioural eval scenarios — advisory signal, not a gate | Run on demand, not in CI                                    |
| `hooks/`  | Claude Code hook scripts — advisory, no governing skill  | Wired into a repo's `.claude/settings.json`                 |

† Via repository bootstrap or `bun run ki:skills:copy:project` (`ki-bootstrap`).

‡ Or a shelf pointing to external `mcp-*` repos.

The value of co-location: the five parts are versioned together, reviewed together, and installed together — rather than scattered across the bases and projects that consume them. A change to a skill and the agent that invokes it ships as one PR, not two.

A harness does **not** have to host every part actively. Empty shelves (`agents/`, `mcp/`, `evals/`, `hooks/` populated only by a `README.md`) are a valid, encouraged starting state — the directory structure commits to the five-part intent even before all parts are built. A shelf is not a gap.

---

## §Capability publication

A **harness capability** is a typed published member of a compatible harness. Skills, agents, MCP servers, hooks, and evals are capability kinds; a future kind must be registered rather than treated as an untyped directory payload.

The common term establishes a harness inventory and installation boundary without replacing each kind's own standard. `ki-skills` governs skills, `ki-agents` governs agents, and the relevant sibling owns every other kind's content and runtime integration. A harness must make each populated shelf and its capabilities discoverable through its shelf documentation.

An installed harness is a verified regular-file source. Native capability activation is a separate, managed runtime projection: `vendor` writes a regular-file copy and `symlink` writes a contained managed link to that installed source. Neither mode permits a repository-vendored `.ki/bin` executor or an arbitrary checkout to become an operation source. The native CLI surface remains planned until `tools-ki` releases it.

The initial installed-harness selection is `latest`; user-selectable versions are deferred. A later contract may retain `latest` alongside sibling records for each version in use, with explicit compatibility and integrity evidence.

---

## §Layout — the five-part directory requirement

Every harness MUST have these five directories at the repo root, each containing a `README.md`:

```text
skills/       README.md  (+ one directory per skill)
agents/       README.md  (+ one .md per agent, or empty shelf)
mcp/          README.md  (+ server packages, or shelf pointing to mcp-* repos)
evals/        README.md  (+ scenario files, or rough advisory shelf)
hooks/        README.md  (+ hook scripts wired via .claude/settings.json, or empty shelf)
```

**Why:** discovery. Any tool or agent navigating the harness can reliably find each part without reading prose. The `README.md` in each directory distinguishes an intentional empty shelf from an accidental missing directory — and gives a human reader the context to understand it.

The root of the harness MUST also contain:

- `CLAUDE.md` — the always-loaded orientation (see §CLAUDE.md required sections)
- `ROADMAP.md` — the open work (see §ROADMAP.md discipline)
- `package.json` — with the required script families (see §package.json required scripts)
- `.ki-config.toml` — the KI compliance declaration (see §.ki-config.toml tables)

---

## §Skills directory — the naming convention

Every directory under `skills/` MUST be a valid skill: it must contain a `SKILL.md` with YAML frontmatter, and the **directory name must exactly match the `name:` frontmatter field**.

```text
skills/
  ki-kb/        ← directory name
    SKILL.md                  ← name: ki-kb  ← must match
```

**Why:** agents and the Agent Skills runtime discover a skill by its `name` — not by path. If the directory name and the frontmatter drift, the skill loads under the wrong name or fails to load at all. The `ki:skills:copy:project` script (see §package.json) publishes regular-file copies named by the directory, so the directory name is the one the agent resolves.

The quality of the skill's prose, description richness, and adherence to the Agent Skills rubric are governed by `ki-skills`, not here.

---

## §Harness-local source links

`ki-harness` owns whether source linking is eligible: only this harness's own physical repository root may use its canonical `skills/` tree as a link source. A nested harness, an external harness, or another repository is never a source, even where skill names match.

When eligible, a source harness may link its runtime skill payloads and its declared `scripts/vendored/` shared-module payloads to the canonical skill tree under that same root. `ki-bootstrap` owns the physical resolution and guarded transaction. It must resolve only a named canonical descendant carrying `SKILL.md`.

All ordinary runtime payloads and every `.ki/bootstrap/` payload remain dereferenced regular-file copies. Development links never cross checkouts, so a consumer remains usable after its bootstrap acquisition source disappears.

**Why:** a harness benefits from live, local authoring feedback without making a consumer checkout depend on an unrelated working tree. The boundary preserves both that convenience and the standalone self-sufficiency contract.

---

## §CLAUDE.md required sections

The harness `CLAUDE.md` is the **always-loaded orientation** — every agent session in the harness repo reads it. It must cover these sections (in order, though the exact headings are flexible):

1. **What this harness is** — one paragraph: what the harness holds, who it's for, why it's a single repo rather than scattered files. Name all five parts.
2. **The five parts** — a directory table (or equivalent structured block) with each of the five directories, what it holds today, and its current status (populated / empty shelf). Keep this current as shelves become populated.
3. **Working conventions per part** — how to add, change, or audit each part: which command to run, which skill governs it, any install step. Brief; route detail to `docs/` or the relevant skill.
4. **Toolchain** — the key `bun run *` commands: at minimum `ki:skills:copy:project`, `ki:skills:audit`, `ki:audit`, and `ki:conform`. Enough to orient a contributor on day one.

Optional but encouraged:

- **The skill map** — a visual or tabular overview of how the skills in `skills/` relate (which compose on which, which delegate to which). Keeps the map near the skills it describes.
- **Docs table** — pointers to any `docs/` files that elaborate the design.

**Freshness rule:** `CLAUDE.md` MUST reflect current state. A skill count that's off-by-one, a shelf marked as empty when it's now populated, or a command name that no longer exists in `package.json` are all WARN findings. Run Mode AUDIT regularly to catch drift.

---

## §ROADMAP.md

A harness carries `ROADMAP.md` as part of its root layout (LAY-4). `ki-repo-roadmap` owns the non-KB roadmap profiles, content discipline, and horizon vocabulary; see its [repository-roadmap standard](../../../general-governance/ki-repo-roadmap/references/standards.md). This skill does not govern the file beyond its existence.

---

## §package.json required scripts

Every harness `package.json` MUST declare these harness-specific scripts:

| Script                   | What it does                                           | Why required                           |
| ------------------------ | ------------------------------------------------------ | -------------------------------------- |
| `ki:skills:copy:project` | Publishes this repo's declared runtime skill copies §  | The primary project delivery mechanism |
| `ki:skills:audit`        | Runs the `ki-skills` mechanical checker over `skills/` | The gate for skill quality             |

§ The `ki-bootstrap` publisher; the harness copies its own declared coverage, like any repo (ADR-KI-HARNESS-007).

The aggregate entrypoints are the public toolchain contract, but they are not harness-specific. `ki-engineering` owns their package-script shape and internal code checks (Biome, TypeScript, knip, syncpack), while `ki-authoring` owns the Markdown pass. A complete harness audit composes those skills; this standard does not duplicate their findings.

The harness-specific scripts are `ki:skills:copy:project` and `ki:skills:audit` — these are the project delivery and quality mechanisms the harness concept depends on. Absence of either is a FAIL. The harness additionally carries the development / eval surface (PKG-4, WARN): `ki:skills:link:global` for explicit local-checkout links to the six global core skills, `ki:skills:refresh-status` (refresh the skills status block), and `ki:eval` (run the `evals/` suite). `/harness/install` installs the global keystone and process skills as regular copies; bootstrap publishes an ordinary repository's declared coverage as copies and a harness's own source skills as runtime links.

**Docs invocation discipline.** Every `ki:<skill>:<mode>` key is convenience sugar over a vendored entry point any bootstrapped repo already has — `bun run ki:tokenomics:audit` is `bun .ki/bootstrap/checkers/ki-tokenomics/scripts/govern.ts .`, and `./.ki/bin/ki-audit` is the aggregate — so a `package.json` is never required to run the checks (ADR-KI-HARNESS-006). Harness documentation whose audience includes governed repos (the user guide especially) MUST NOT present a `package.json` key as _the_ invocation of a vendored checker: state the equivalence (or link to where it is stated) and make clear the `.ki` path is the canonical form, the key the harness-local alias. A key may stand alone only in a doc that is explicitly harness-repo-only (e.g. `ki:skills:graph`).

---

## §.ki-config.toml tables

Every harness carrying a `.ki-config.toml` (which all KI-governed repos do) MUST declare:

```toml
[ki-repo]        # this is a KI-governed repo
[ki-engineering] # the common toolchain governs this repo
[ki-harness]     # this repo is a KI agentic harness
[ki-skills]      # once skills/ is populated
```

The `[ki-harness]` table is the **compliance marker** — `ki-repo`'s coverage cascade detects the five-part harness layout and WARNs if this table is absent. Declaring it is the repo's opt-in to the harness standard.

Currently no per-harness config keys are defined under `[ki-harness]` — the table presence alone is the declaration.

---

## §Boundary declarations

This standard governs the container. The parts inside it each have a governing skill:

| What                                        | Who governs it                      |
| ------------------------------------------- | ----------------------------------- |
| `skills/*/SKILL.md` prose                   | `ki-skills`                         |
| `agents/*.md` definitions                   | `ki-agents`                         |
| `mcp/*/src/` server code                    | `ki-mcp`                            |
| `evals/` test harness                       | No dedicated skill today — advisory |
| `hooks/` scripts + settings wiring          | No dedicated skill today — advisory |
| Repository roadmap content and profiles     | `ki-repo-roadmap`                   |
| Engineering toolchain                       | `ki-engineering`                    |
| GitHub settings, `.ki-config.toml` contract | `ki-repo`                           |

An audit of a harness runs the harness delta **on top of** the applicable sibling skills — it composes, it does not replace them.

[as-spec]: https://agentskills.io/specification
