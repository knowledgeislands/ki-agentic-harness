---
name: knowledgeislands-tokenomics
description: >
  Audit, codify, and optimise the tokenomics of a Claude Code environment — the standing context surface paid on every turn, composed across
  the user-wide (`~/.claude`) and project-local layers and any Knowledge Islands base, plus the runtime levers (caching, model tier,
  compaction, sub-agent fan-out, verbosity). Measures each layer's CLAUDE.md (+`@imports`), memory, installed-skill descriptions, MCP tool
  definitions, and settings against budgets, and checks context-compression tooling such as Headroom is set up optimally. Use when context
  feels heavy or token costs climb. Triggers: "audit my token usage", "why is my context so big", "reduce my token costs", "trim my
  context", "too many MCP tools", "is Headroom set up right". For the volatile numbers (model ids, prices, cache TTLs, window sizes) use
  `claude-api`; for a base's structure/content use `knowledgeislands-kb`; for one skill's quality use `knowledgeislands-skills`; for an MCP
  server's code use `knowledgeislands-mcp`.
argument-hint: 'audit | conform | init | refresh'
---

# Knowledge Islands tokenomics

You are helping hold a Claude Code working environment to one budget for its **tokenomics** — the cost of the context the model carries,
paid not once but on **every turn**, and re-paid by every sub-agent. The premise of this skill is that this cost is rarely one file's fault:
it is the **composition** of two configuration layers — the **user-wide** `~/.claude` and the **project-local** `.claude` / `CLAUDE.md` —
over any **Knowledge Islands base** in play. You measure that composed surface, attribute it to its layers, hold it to a budget, and tune
the runtime levers that multiply it.

This is a **standard, base-agnostic Process skill**: it hard-codes no single environment, resolving the user layer from `~/.claude` at
runtime and taking the project or base as its target. Its quotable standard is [the standard](references/tokenomics-standard.md); the
line-by-line criteria (each tagged mechanical/judgment) are [the rubric](references/audit-rubric.md); the mechanical checker is
[`scripts/audit-tokenomics.ts`](scripts/audit-tokenomics.ts). How it sits beside the other skills is documented once in the
arcadia-agentic-harness `README.md`, not repeated here.

## What it governs — two halves

**1. The standing surface** — everything in context before the user types a word, paid every turn:

- **`CLAUDE.md` (+ its `@imports`)** at each layer — global, project, base.
- **Memory** — the `MEMORY.md` index and the memory files the system loads.
- **Installed-skill descriptions** — every skill's `name` + `description` sits in the selection surface, user-wide and project-local.
- **MCP tool definitions** — usually the **largest** standing cost: every configured server's full tool schemas load up front.
- **Settings & output styles** — anything `settings.json` injects (a custom output style, an `env` block, a status line).

**2. The runtime levers** — what each turn and each sub-agent then costs:

- **Prompt caching** — is the stable prefix actually cacheable, and being hit?
- **Model tier** — is the work on the right-cost model?
- **Compaction** — is a long conversation compacted before it bloats?
- **Sub-agent fan-out** — each sub-agent re-pays the standing surface; is the fan-out worth it?
- **Tool-result verbosity** — raw logs / JSON dumps re-read every turn; this is where context-**compression** tooling earns its place.

The full catalogue, the budget table, and the rationale (curate context as a finite resource; keep tool sets minimal) are in
[the standard](references/tokenomics-standard.md). The volatile reference numbers it leans on — model ids, prices, cache TTLs,
context-window sizes — are **not** restated here; resolve them through the `claude-api` skill.

## Context-compression tooling (Headroom)

Tool-result bloat is the runtime cost a **context-compression layer** attacks. The house default treats one such layer as a **recommended**
best practice and checks that, where configured, it is set up well. The seeded entry is **Headroom** (the chopratejas / extraheadroom
compression proxy / MCP server): the checker detects it across both layers — an `mcpServers` `headroom` entry exposing `headroom_compress` /
`headroom_retrieve` / `headroom_stats`, a `headroom proxy`, or `HEADROOM_*` env — and reports whether its reversible store and cache-aligned
prefixes look sound. The registry is **extensible**: add other projects alongside it. Whether the layer is `required`, `recommended`, or
`off` is declared per environment (below).

## The config table — overridable budgets

A target opts in (and tunes) via a `[knowledgeislands-tokenomics]` table in its `.ki-config.toml`, read **validate-down** (warn on a key it
does not recognise; never read another skill's table). It carries the per-component and total token budgets (a `[…budgets]` sub-table), the
`headroom` expectation, and an optional `context_window_tokens` to express headroom as a percentage. Omit any to take the default; `init`
scaffolds the keys. A budget overage is a **WARN**, never a FAIL — these are guide-rails, not gates.

## Operating modes

Every governance skill carries **AUDIT · CONFORM · REFRESH**; this one adds **INIT**. Infer the mode from the request; ask if unclear.
(Modes are named and alphabetical.)

### Mode AUDIT — measure the environment against the budget

1. **Run the checker**: `bun scripts/audit-tokenomics.ts <target>` (a project or base; defaults to the cwd). It also reads the user-wide
   `~/.claude` layer **by design** — tokenomics _is_ the composition of both — unless `--no-user`. It grades each area on the unified
   severity ladder (FAIL / WARN / POLISH / ADVISORY / INFO / SKIP / PASS — see `knowledgeislands-engineering`'s enforcement-framework §2)
   and exits non-zero on any FAIL; with `--json` / `--report` it emits machine-readable findings and writes the latest report to the
   target's `.ki-meta/audits/tokenomics.{md,json}`. Capture its output verbatim, do not re-derive what it measures.
2. **Apply the judgment layer by reading** — the **[J]** criteria in [the rubric](references/audit-rubric.md) the script cannot decide: is a
   big `CLAUDE.md` _earning_ its tokens or restating what the model already knows; are the configured MCP servers actually used by this kind
   of work, or is the tool surface dead weight; are the model tier and sub-agent fan-out proportionate; is Headroom's reversible / cache
   config genuinely optimal (its exact keys are undocumented — see the source list).
3. **Compose sibling audits.** Cost is downstream of artifacts other skills own — name them rather than re-judge them:
   `knowledgeislands-mcp` for an over-broad server's own design, `knowledgeislands-skills` for a bloated skill `description`,
   `knowledgeislands-kb` for a base whose loaded surface is large because it is mis-structured.
4. **Report** by layer → component → cost → fix, leading with FAILs then the biggest WARNs (usually the MCP tool surface). Attribute every
   figure to its layer so the user sees _where_ the budget went.

### Mode CONFORM — bring the environment into budget

Edits local config; confirm before mutating, and remember that turning off an MCP server changes what the agent can do — show the diff.

1. Run **AUDIT** first for the gap list.
2. Trim the biggest line items: lift rarely-read detail out of `CLAUDE.md` into on-demand files (or exclude an irrelevant ancestor
   `CLAUDE.md` via `claudeMdExcludes`); prune stale memory; switch off or scope the MCP servers the work does not use (the largest single
   lever, and keep tool search on so unused servers' schemas stay deferred); consolidate redundant skills.
3. Wire context-compression tooling where it is `recommended` / `required` and absent; turn on prompt caching and pick the right model tier
   where the runtime levers are idle.
4. Add or correct the `[knowledgeislands-tokenomics]` table (or run **INIT**). Re-run **AUDIT** until clean.

### Mode INIT — opt a target in

Scaffold the marker: `bun scripts/audit-tokenomics.ts --init >> .ki-config.toml`, then set the `headroom` expectation, any `[…budgets]`
overrides, and optionally `context_window_tokens`. Local only; no live change.

### Mode REFRESH — re-anchor to current best practice

The numbers and the tooling here move faster than anything else this set tracks — model windows and prices, cache TTLs, Headroom's config
surface, Anthropic's context-engineering guidance. Run on its declared cadence (see `references/sources.md`), or when asked "is the
tokenomics standard current".

1. **Read [the source list](references/sources.md)** — the tracked sources, each dated.
2. **Re-fetch each** (WebFetch / WebSearch) and **diff** against [the standard](references/tokenomics-standard.md),
   [the rubric](references/audit-rubric.md), and [the checker](scripts/audit-tokenomics.ts): changed budgets or defaults, a new
   standing-cost surface (a new auto-loaded file kind), new runtime levers, and especially **Headroom's now-documented config keys** (a
   pinned watch-item) plus any new compression project worth adding to the registry.
3. **Propose a diff**; confirm before writing.
4. **Update [the source list](references/sources.md)** — bump each `last reviewed` date and refresh the `## Last review` block. The record
   of what changed is the commit, not a changelog.

## Notes

- The checker reads `~/.claude` as the user-wide layer **by design** — the standard _is_ the composition of user-wide and project-local
  config. `--no-user` audits the project layer alone; `--user <dir>` points elsewhere (for testing).
- Token figures are a **chars/4 estimate for budgeting, not billing** — every figure is marked `~`. For exact accounting use the model's own
  token counting (the `claude-api` skill).
- This skill measures and tunes cost; it does not own the artifacts that cause it. A finding routes to the owning skill's standard.
