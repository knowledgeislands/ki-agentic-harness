# The tokenomics standard — what a lean, well-composed context budget looks like

The normative, quotable reference behind [the rubric](audit-rubric.md) and
[`../scripts/audit-tokenomics.ts`](../scripts/audit-tokenomics.ts). It governs the **tokenomics** of a Claude Code working environment: the
cost of the context the model carries, paid on every turn, as produced by the **composition** of the user-wide and project-local
configuration layers over any base in play. It deliberately holds **no** volatile reference numbers (model ids, prices, cache TTLs,
context-window sizes) — those live in the `claude-api` skill and are resolved at runtime; this standard governs the _shape_ of the budget,
not the figures of the day.

## Contents

- [1. The composition model — why standing context dominates](#1-the-composition-model--why-standing-context-dominates)
- [2. The standing surface — the catalogue](#2-the-standing-surface--the-catalogue)
- [3. Budgets and the config table](#3-budgets-and-the-config-table)
- [4. The runtime levers](#4-the-runtime-levers)
- [5. Context-compression tooling (Headroom) and the registry](#5-context-compression-tooling-headroom-and-the-registry)
- [6. Best practice — context as a finite resource](#6-best-practice--context-as-a-finite-resource)
- [7. The boundary with claude-api](#7-the-boundary-with-claude-api)

## 1. The composition model — why standing context dominates

Two facts make the standing context surface the first place to look:

- **It is paid on every turn.** A multi-step agent loop does not cost _N_ times one call; it costs far more, because each step re-sends the
  accumulated system prompt, tool definitions, memory, and history. The bill concentrates on the **input** side — for most agent workloads
  the large majority of spend is input/context, not generation. A token added to the standing surface is therefore paid once per turn, once
  per sub-agent, and once more on every retry.
- **It is a composition, not a file.** What loads is the **union** of two configuration layers — the **user-wide** `~/.claude` (global
  `CLAUDE.md` and its `@imports`, user `settings.json`, user-global skills, user-scoped MCP servers, memory) and the **project-local**
  `.claude` / `CLAUDE.md` / `.mcp.json` of the working directory — over any **Knowledge Islands base** (its `CLAUDE.md` and `MEMORY.md`
  cascade). A surface that looks lean in the project alone can be heavy once the user layer composes onto it, and vice versa. The first job
  of an audit is therefore to **attribute** cost to its layer, so the user fixes it where it actually lives.

The corollary: optimise the standing surface before the runtime levers, and within it, attack the largest line item first (almost always the
MCP tool definitions — §2).

## 2. The standing surface — the catalogue

Everything below is in context before the user's first word. The checker measures each it can locate, in both layers (and the base), and
attributes the cost; sizes are a `chars / 4` token **estimate** for budgeting, never billing (§7), and every figure is marked `~`.

| Component                    | Where it lives (per layer)                                   | Why it costs          |
| ---------------------------- | ------------------------------------------------------------ | --------------------- |
| `CLAUDE.md` (+ `@imports`)   | `~/.claude/CLAUDE.md`, project `CLAUDE.md`, base `CLAUDE.md` | re-sent every turn †  |
| Memory                       | `MEMORY.md` index + loaded memory files                      | re-sent every turn    |
| Installed-skill descriptions | `~/.claude/skills/*`, project `.claude/skills/*`             | selection surface ‡   |
| MCP tool definitions         | `~/.claude.json`, project `.mcp.json`, `settings.json`       | usually the largest § |
| Settings / output style      | user + project `settings.json`                               | injected per turn     |

† `@import` lines pull other files inline; the cost is the resolved total, and an unresolved `@import` is a defect (a broken include), not
merely waste. ‡ Every installed skill's `name` + `description` sits in the selection surface so the model can choose it — the body loads
only on demand, but the description is always paid; an over-long or duplicative description is a standing cost across the whole set. § MCP
tool **definitions** (the full JSON schema of every tool of every configured server) load up front. Their exact token weight needs a live
connection to measure, so the checker counts **servers** as the deterministic proxy and leaves per-tool weighing to judgment — but this is
reliably the biggest lever, so it leads the report.

## 3. Budgets and the config table

The budgets are **guide-rails, not gates**: an overage is a WARN, never a FAIL. They are deliberately conservative defaults, overridable per
environment. The only FAILs in this standard are genuine defects — an unresolved `@import`, a malformed budget value, or a `required`
compression layer that is absent (§5).

| Component (per layer unless noted)            | Default budget (~tokens) | Over → |
| --------------------------------------------- | ------------------------ | ------ |
| each `CLAUDE.md` incl. `@imports`             | 2,500                    | WARN   |
| `MEMORY.md` index                             | 1,000                    | WARN   |
| installed-skill descriptions (sum, per layer) | 4,000                    | WARN   |
| configured MCP servers (count, all layers)    | 5                        | WARN ¶ |
| total standing surface (all layers)           | 30,000                   | WARN ‖ |

¶ The count is the deterministic proxy for the tool-definition cost (§2); Anthropic's guidance is to keep three-to-five tools always loaded
and dynamic-discover beyond ~10, so a high server count is a prompt to prune, not an automatic fault. ‖ A rough fraction of a typical
context window; the window size itself is volatile (resolve via the `claude-api` skill), so the default is an absolute figure. Declaring
`context_window_tokens` lets the checker convert the total into a headroom **percentage**.

**The config table.** A target opts in with a `[knowledgeislands-tokenomics]` table in its `.ki-config.toml`, read **validate-down**: the
checker validates only its own table, WARNs on a key it does not recognise, and never reads another skill's table. Shape (all keys optional;
`--init` scaffolds them):

```toml
[knowledgeislands-tokenomics]
headroom = "recommended"          # "required" | "recommended" | "off"
context_window_tokens = 200000    # optional — turns the total budget into a headroom %

[knowledgeislands-tokenomics.budgets]
# one key per overridable budget; omit any to take the default above
claude_md = 2500
memory_index = 1000
skills_surface = 4000
mcp_servers = 5
total = 30000
```

## 4. The runtime levers

Once the standing surface is lean, these govern what each turn and each sub-agent then costs. Most are runtime judgment (the checker reports
only the config-level signals it can see, e.g. a pinned default model):

- **Prompt caching.** The stable prefix (system prompt, tool definitions) should be cacheable and actually **hit** — which means not
  invalidating it by placing volatile content (timestamps, per-turn ids) high in the prompt. Caching turns the re-paid standing surface from
  full price into cache-read price; it is the single highest-leverage runtime move.
- **Model tier.** Match the model to the work's value — a cheap tier for mechanical or bulk steps, the top tier reserved for the hard ones.
- **Compaction.** A long conversation should be compacted before history bloats the window; know where the compaction boundary is.
- **Sub-agent fan-out.** Each sub-agent re-pays the whole standing surface, so fan-out multiplies the §2 cost — worth it for genuine
  parallel/independent work, wasteful for what one context could hold.
- **Tool-result verbosity.** Raw logs, JSON dumps, and file reads are re-read on every subsequent turn. Keeping them lean (or compressing
  them — §5) is what stops a single noisy tool call from taxing the rest of the session.

## 5. Context-compression tooling (Headroom) and the registry

Tool-result and log bloat (§4) is exactly what a **context-compression layer** removes before content reaches the model, reversibly, so the
model can still retrieve the original on demand. The house default treats one such layer as a **recommended** best practice; the expectation
is set per environment (`headroom = "required" | "recommended" | "off"`).

The seeded registry entry is **Headroom** (chopratejas/headroom and the extraheadroom.com app) — a reversible context-compression proxy /
MCP server. It is detected across both layers by any of:

- an `mcpServers` entry named `headroom` (or whose command is `headroom`) exposing `headroom_compress` / `headroom_retrieve` /
  `headroom_stats` (installed via `headroom mcp install`);
- a `headroom proxy --port <n>` drop-in proxy the agent points at;
- `HEADROOM_*` environment keys in a settings `env` block (e.g. `HEADROOM_OUTPUT_SHAPER`, `HEADROOM_OUTPUT_HOLDOUT`).

**Optimal setup** — once detected — means: the reversible store (Content-Compressed Retrieval) is on with a sane TTL so nothing is lost; the
cache-aligner is active so compression does not break prompt-cache hits (§4); and any output-shaper / holdout is set deliberately, not left
at an accidental value. The checker confirms **presence and wiring** mechanically; the precise config keys, TTL, and store path are **not
documented** upstream at the time of writing, so judging "sane TTL / aligner on" is a **judgment** item and a pinned REFRESH watch-item (see
[the source list](sources.md)) — to be promoted to a mechanical check the moment those keys are published. Expect realistic savings of
~20–30% on mixed coding and more only on tool-heavy, high-redundancy work; do not budget against the headline figures.

The registry is **extensible**: other compression / context projects are added as new entries with their own detection signals and
optimal-setup notes, so "leverage best practices like Headroom and other projects" stays a list, not a hard-coded single tool.

## 6. Best practice — context as a finite resource

The standard tracks Anthropic's context-engineering guidance and the wider community practice; the durable principles:

- **Treat context as a precious, finite resource.** Every token in the standing surface competes with the work; aim for the smallest set
  that fully supports the task ("right altitude" — neither a brittle wall of rules nor vague hand-waving).
- **Keep tool sets minimal.** Bloated tool sets create ambiguous decision points and cost tokens up front; if a human engineer cannot say
  which tool applies, the model will not do better. Keep the few most-used tools always loaded and lean on dynamic discovery beyond ~10.
- **Order context deliberately.** System instructions, then durable memory, then tool definitions, then history — and prune history before
  it dominates.
- **Curate, do not enumerate.** A few canonical examples beat an exhaustive rule list, and cost fewer tokens.

These are the _why_ behind the budgets: the numbers are a proxy for "is this surface curated, or accreted".

## 7. The boundary with claude-api

This standard names volatile facts but **holds none of them**. Model ids, per-token prices, cache write/read multipliers and TTLs, and
context-window sizes change on Anthropic's cadence, not this skill's; they live in the `claude-api` skill and are resolved at runtime. When
an audit needs a real number — to convert an estimate to a cost, or a token total to a headroom percentage against the true window — it
draws it from `claude-api`. Keeping the figures out of this standard is what lets the _shape_ of the budget stay stable while the numbers
move.
