# Tuning the context surface

How to make a session lean — which tools, skills, and MCP servers actually load, and where to cut. This is the operator _how_; the _why_ and the normative budget live in the `ki-tokenomics` skill and its tokenomics standard, which this guide defers to throughout.

## The one distinction that matters

Every token in a session is either **standing surface** or **runtime**.

- **Standing surface** — the tool definitions, skill descriptions, MCP tool schemas, `CLAUDE.md`, and memory index that are sent in the request prefix on _every_ turn. This dominates a long session because it is re-paid each turn, and it is part of the cacheable prefix. You shrink it by _not loading things_, not by compressing them.
- **Runtime** — the tool results, logs, and conversation that accrue as the session runs. You shrink this by compression (Headroom), verbosity discipline, and compaction.

The levers below are grouped by which of the two they act on. The single biggest mistake is reaching for a runtime tool (a compression proxy) to solve a standing-surface problem (too many MCP schemas loaded) — see [Why a compression proxy is the wrong tool for MCP schemas](#why-a-compression-proxy-is-the-wrong-tool-for-mcp-schemas).

## Standing surface — cut what the session does not need

### Disable built-in tools you never use

Claude Code's own built-in tools (Workflow, Artifact, the advisor, background tasks, …) are not connectors with a settings menu — they ship with the client. A subset can be **fully removed** from the toolset — not just permission-gated — via environment variables in the `env` block of `~/.claude/settings.json`. Because the `env` block is read once at startup and is stable for the whole session, disabling here shrinks the fixed prefix without churning the prompt cache.

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_WORKFLOWS": "1",
    "CLAUDE_CODE_DISABLE_ARTIFACT": "1"
  }
}
```

The context-relevant toggles, each verified to exist as a literal string in the shipped CLI binary:

| Environment variable | Removes from the toolset | Notes |
| --- | --- | --- |
| `CLAUDE_CODE_DISABLE_WORKFLOWS` | The `Workflow` tool | Largest single built-in description — it inlines a scripting DSL |
| `CLAUDE_CODE_DISABLE_ARTIFACT` | The `Artifact` tool | Drop if you never publish claude.ai artifacts |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` | The advisor tool | — |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | `Monitor` and background-shell tooling | Keep if you rely on long-running watches |
| `CLAUDE_CODE_DISABLE_CRON` | `CronCreate` / `CronList` / `CronDelete` | — |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | Background-agent view / `--bg` support | — |
| `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` | _All_ of Claude Code's own bundled skills | This repo's own `ki-*` skills are unaffected † |
| `CLAUDE_CODE_DISABLE_CLAUDE_API_SKILL` | Just the bundled `claude-api` skill | Finer-grained than the all-or-nothing flag above |
| `CLAUDE_CODE_DISABLE_CLAUDE_CODE_SKILL` | Just the bundled `claude-code` guide skill | — |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | The git-guidance block of the system prompt | Drop if you don't want git conventions in-session |

† The bundled skills are Claude Code's own (dataviz, web-perf, and the like), discovered separately from the `~/.claude/skills/` and project-local `.claude/skills/` links this harness installs.

The flag _names_ are confirmed present in the binary; each flag's precise effect is inferred from its name and the settings schema. After setting any of them, restart and confirm the tool or skill has actually left the surface with `/context`.

**Do not disable these** — they save tokens but break the harness:

- `CLAUDE_CODE_SAFE_MODE` — the blunt instrument: also stops `CLAUDE.md`, hooks, MCP servers, and custom commands from loading.
- `CLAUDE_CODE_DISABLE_AUTO_MEMORY` — drops the whole `memory_*` tool block; this harness relies on per-project auto-memory.
- `CLAUDE_CODE_DISABLE_CLAUDE_MDS` — drops `CLAUDE.md` loading, i.e. the harness's entire always-on orientation.

### Load only the MCP servers a surface needs

MCP tool schemas are the **largest standing cost** in a session with several servers connected. The lever is _not loading the server_, not compressing it:

- **Per surface** — the `ki-binding` skill governs which servers enable on which surface (Claude Code, Desktop, Cowork, web) from the single `mcps.yaml` source, via each server's `clients:` targeting field. A server the current surface never uses should not be enabled on it.
- **Per project** — scope servers to the repos that need them rather than enabling them globally.
- **Connectors vs plugins** — on claude.ai / Desktop, the MCP tools bucket is driven by _connectors_ (e.g. Google Calendar / Drive / Slack), toggled per-conversation in the compose-bar tools menu. These are distinct from _plugins_ (which surface under Skills / Custom agents). Turn off a connector for a conversation that does not need it.
- **The mcporter caveat** — mcporter (see [Installation](installation.md)) consolidates the `~/.claude.json` `mcpServers` block from many entries to one URL. That trims _config_, not the in-session tool _schemas_ — every consolidated server's tools still load into the prefix. mcporter and schema curation are complementary, not substitutes.

### Manage the MCP inventory

The list lives across several layers, and the `/mcp` command only touches one of them:

- **This session (transient)** — `/mcp reconnect|enable|disable [<server>|all]` retries or toggles a server for the current session only. A "not connected" server usually means it is not _authorized_ rather than misconfigured; run `/mcp` in the interactive terminal to complete the OAuth flow (it cannot run in a non-interactive session).
- **Local Claude Code config (`~/.claude.json`)** — the machine-local, per-user Claude Code state file. Among other things it holds the `mcpServers` block; in this setup that block is reduced to a single `ki-mcporter` URL entry, because the KI-owned servers are consolidated behind mcporter rather than listed one by one. It is not chezmoi-managed, so treat it as generated — do not hand-edit the `mcpServers` block.
- **mcporter config (`~/.mcporter/mcporter.json`, chezmoi-managed)** — the inventory of local KI servers the daemon keeps alive; `mcporter daemon status` lists them. Add or remove a _local_ server here, not in `~/.claude.json`.
- **Source of truth (chezmoi `mcps.yaml`, governed by `ki-binding`)** — the single list carrying each server's `clients:` targeting, which renders both the mcporter and Desktop configs. Edit here, `chezmoi apply`, restart. This is the durable "manage the list" surface; `ki-binding` audits that every surface agrees.
- **Cloud connectors (claude.ai settings)** — Calendar / Drive / Slack / M365 / Notion-type connectors are managed in claude.ai connector settings and the compose-bar tools menu, not in any local file.

### Defer tool schemas with the Tool Search Tool — and beware the proxy gap

Claude Code has a native **Tool Search Tool**: rather than materialising every built-in and MCP schema into the prefix up front, it defers them server-side and loads each on demand when a task needs it. The `Workflow` tool relies on the same mechanism ("Workflow agents can reach all session-connected MCP tools via ToolSearch — schemas load on demand per agent"). At the protocol level an MCP server can also vary its advertised surface at runtime via `tools/list_changed`, and Claude Code has a tool-availability lifecycle (`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`).

**The gap that bites this harness:** a custom `ANTHROPIC_BASE_URL` — which this setup sets to point Claude Code at the local headroom proxy — **silently disables the deferral** unless `ENABLE_TOOL_SEARCH` is _also_ set explicitly. Without it, every schema (built-in plus every connected MCP server) is eagerly loaded on every session. One observed session spent **71.1k tokens (≈36% of a 200k window) on tool definitions alone** — 44.1k built-in plus 27.0k MCP — before any conversation content. The fix is one line in the `env` block of `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8787",
    "ENABLE_TOOL_SEARCH": "true"
  }
}
```

It takes effect on the _next_ session start — it does not shrink an already-loaded context. Confirm with `/context`: the deferred tools move out of the standing surface and appear only once searched. In one measured before/after, built-in tools fell from **44.1k to ≈9k** tokens and the MCP schemas dropped out of the standing surface entirely. (The silent-disable is a known headroom interaction, tracked upstream as chopratejas/headroom issue #746.)

The trade-off is the prompt cache: deferral shifts cost from a fixed standing tax to a per-first-use discovery cost. With a large surface that is mostly idle — the common case here — it is a decisive win; it only approaches a wash if nearly every tool is used every turn.

### Trim CLAUDE.md, memory, and skill descriptions

The prose surface — `CLAUDE.md` and its `@imports`, the `MEMORY.md` index, and each installed skill's `description` — is standing cost too. The `ki-tokenomics` skill catalogues and budgets it; `bun run ki:tokenomics:audit` measures it. Keeping the keystone-plus-project-local install model (see [Installation](installation.md)) is what keeps unrelated skills' descriptions out of a session in the first place.

Memory is the one layer where two different audits apply, and they are complementary — do the hygiene pass first, because it usually shrinks the surface the cost pass then measures:

- **Hygiene (housekeeping)** — whether the `memory/*.md` entries are still true, correctly typed (user / feedback / project / reference), agree with the index, and are reconciled (a fact promoted to a `CLAUDE.md` must be _deleted_ from memory, not left in both). `bun run ki:housekeeping:audit` runs the memory checker (`audit-memory.ts`) over the per-project store.
- **Cost (tokenomics)** — how many tokens the `MEMORY.md` index and the injected memory block add to the standing prefix. `bun run ki:tokenomics:audit` measures it against the budget.

The scope rule the hygiene pass enforces is also the cheapest way to keep the index small: repo-specific guidance belongs in that repo's `CLAUDE.md`, cross-project personal preferences in `~/.claude/*.md`, and only genuine user/reference facts stay in memory. Machine-generated noise — stale "learned patterns" blocks, another repo's paths — is both a hygiene failure and dead standing cost; prune it here rather than compressing it at runtime.

### When the hygiene audit reports issues

`bun run ki:housekeeping:audit` is only the mechanical, read-only half — it reports; it does not fix. When it flags anything, hand the store to the skill's CONFORM mode rather than hand-editing against the findings: `/ki-housekeeping` CONFORM applies the judgment the checker can't — deciding whether an entry is still true, which layer it belongs in (memory vs. a `CLAUDE.md`), and what to prune vs. reword. Re-running the audit afterwards confirms `FAIL=0`; a `bun run ki:tokenomics:audit` then shows whether the prune moved the cost number.

### Watch what `headroom learn` writes into the prefix

Headroom's `--learn` mode (the `proxy_args` lever, not a runtime one) mines live traffic for command-substitution and error-recovery patterns and writes them back — between `<!-- headroom:learn:start -->` / `<!-- headroom:learn:end -->` markers — into `MEMORY.md` and the project `CLAUDE.md`. This is the one Headroom feature that _adds_ to the standing surface rather than compressing runtime: every learned line is re-paid on every turn. Left unattended the block grows, and because it is machine-generated from whatever repo you happened to be in, it accumulates cross-repo paths and stale commands — dead weight in the always-on prefix (this harness's `MEMORY.md` had picked up ~1.5k tokens of another repo's entries).

Treat it as a curated cache, not an append-only log:

- **Keep, don't hand-tune** the entries — the block regenerates, so edits inside the markers are lost. Prune by clearing the content and leaving the two markers in place (that preserves the injection point and keeps the hygiene checker's `IDX-5` marker check green).
- **Re-learn after moving repos** so the patterns reflect where you actually work, rather than carrying another island's recovery commands.
- **Fold it into the audits above** — the learned block counts against the `MEMORY.md` / `CLAUDE.md` budget (tokenomics) and is exactly the "machine-generated noise" the hygiene pass prunes. If either audit flags the memory or `CLAUDE.md` layer, check this block first.

## Runtime — compress and cache what does load

- **Headroom** compresses tool _results_ — it reversibly substitutes large output blocks it has already seen in the stream (see [Installation](installation.md) for proxy vs wrap mode). This is a runtime lever; it does not touch tool definitions.
- **Prompt caching** rewards a stable prefix. Set your `env` disables once and leave them; avoid anything that mutates the tool list mid-session.
- **Model tier, compaction, verbosity** — right-cost model for the work, compaction hygiene on long conversations, and not dumping raw logs into the turn. The `ki-tokenomics` standard covers each.

## Why a compression proxy is the wrong tool for MCP schemas

A recurring temptation is to have Headroom (or any `ANTHROPIC_BASE_URL` proxy) strip MCP tool definitions from the request when the session's task does not need them. It does not do this, and should not:

- A proxy sees bytes, not intent — it cannot safely know which tools a task will call. Strip one the model then invokes and the turn errors.
- The `tools` array is part of the cacheable prefix. Mutating it per turn busts the prompt cache for everything downstream, trading a fixed standing cost for repeated cache-miss costs.

"This session does not need these tools" is answered by _not loading the server_ (per-surface `ki-binding`, per-project scoping) or by deferred loading (ToolSearch) — both above — not by compressing a schema that was loaded anyway.

## When the cost audit reports issues

`ki:tokenomics:audit` groups its output by the rubric's section codes and prints `info` / `warn` / `fail` lines. Budgets are **WARN-only** — a `warn` is a prompt to look, not a build break — and every figure is a `~chars/4` estimate, so treat them as directional. Work each flagged line back to the lever that fixes it:

- **SURF-2** `MEMORY.md … > budget — prune` — run the [hygiene audit](#when-the-hygiene-audit-reports-issues) and prune: stale entries, auto-generated "learned patterns" blocks from other repos, anything promotable to a `CLAUDE.md`. The index shrinks and the number drops.
- **SURF-1** `CLAUDE.md ~N tok` high — lift detail into an `@import` topic file loaded on demand, or move repo-specific prose into a scoped doc the README indexes; keep the always-on anchor short.
- **SURF-3** `M skill description(s) ~N tok` — don't shorten descriptions (discovery needs them); unload skills the surface doesn't need. Keep the keystone-plus-project-local model so unrelated skills never link in.
- **MCP** `K server(s) …` large — structural, not compression: scope servers per-surface via `ki-binding` and per-project, and toggle off connectors a conversation doesn't need. See [Why a compression proxy is the wrong tool](#why-a-compression-proxy-is-the-wrong-tool-for-mcp-schemas).
- **BUDG** `total standing surface ~N` — over budget is a judgment call (BUDG-3): either cut via the SURF/MCP levers above, or record it as a deliberate, accepted overage. Don't silently normalise it.
- **RUN-2** `default model pinned …` — confirm the tier matches the work. A mismatch here — e.g. session pinned to `opus[1m]` while `preferred_model = "sonnet"` — is worth resolving so the declared intent and the running tier agree.
- **TOOL-3** `headroom detected …` — judgment, keys undocumented: confirm the reversible store and cache-aligner are on and that compression isn't busting prompt-cache prefixes. Cross-check the Headroom setup against the `ki-tokenomics` exemplars.
- **CFG** `[ki-tokenomics] present …` — informational: the config table is found. `preferred_model` here is checked only for _presence_ (CFG-4); its _appropriateness_ is the RUN-2 judgment above.

The `warn` you hit is `SURF-2`: the memory index is over its ~1,000-tok budget. That is the same content the hygiene pass prunes — so the fix is upstream, in the `memory/*.md` store, not a runtime lever. Fix there, then re-run this audit to confirm the number moved.

## A starting profile for this harness

This repo is a governance-skills repo: it does not lean on `Workflow`, and it keeps several MCP servers connected. A reasonable, fully reversible starting point:

1. **First, and highest-value:** because this setup points `ANTHROPIC_BASE_URL` at headroom, set `ENABLE_TOOL_SEARCH: "true"` in the `env` block so tool-schema deferral is not silently off. This alone reclaims tens of thousands of standing tokens.
2. Optionally disable built-ins you never use — `WORKFLOWS`, `ARTIFACT`, `ADVISOR_TOOL`, and the two bundled guide skills (`CLAUDE_API_SKILL`, `CLAUDE_CODE_SKILL`). With deferral on this matters less, but it removes them from discovery entirely.
3. Keep memory, `CLAUDE.md`, and background/cron tooling unless you have measured they go unused.
4. Treat MCP curation via `ki-binding` (and per-conversation connector toggles) as the structural lever — audit which servers each surface actually needs.
5. Restart, confirm with `/context`, then re-measure with `bun run ki:tokenomics:audit` and iterate against the budgets in the `ki-tokenomics` standard.
