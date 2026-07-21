---
id: ADR-KI-HARNESS-009
title: 'Portable model types, not vendor model names, in governance config'
date: 2026-07-13
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-009: Portable model types, not vendor model names, in governance config

## Context

The harness governed "which model to use" through `preferred_model` in the `[ki-tokenomics]` table of a repo's `.ki-config.toml`, validated mechanically against a closed set `['opus', 'sonnet', 'haiku', 'fable']` in `ki-tokenomics`' `audit.ts`/`conform.ts`, documented across `standards.md` and rubric codes `CFG-4`/`RUN-2`. `ki-agents`' `FM-2` mirrored the same closed alias list for an individual agent's `model:` frontmatter pin.

Every one of those aliases is a **Claude Code-specific model family name**. That is backwards for a harness whose own [SDR-KI-HARNESS-002](SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md) commits to runtime-portable contracts (Claude Code today; Hermes, Pi, Codex tomorrow) and whose best-tool-for-the-job tenet treats model independence as _capability_ independence — the cheapest sufficient tier for mechanical work, frontier reasoning only where judgment is load-bearing. A config key that can only ever hold `"opus"` states a vendor's product name, not a purpose.

The two runtimes in scope draw their tiers differently. Claude Code exposes **four model families** (Fable 5 > Opus 4.8 > Sonnet 5 > Haiku 4.5) crossed with a reasoning-effort axis. OpenAI's Codex CLI (GPT-5.6, limited preview 2026-07) exposes **three families** — Sol / Terra / Luna — crossed with its own effort/mode axis (Light → Extra High, plus Max and Ultra). The shapes differ (4 vs 3 families), but both separate **model** from **effort** as two independent levers — the same split the harness's own `Workflow` tool already exposes as `opts.model` / `opts.effort`, and the same split both vendors' real pickers show. A portable contract must name the axis both share.

## Decision

Governance config declares a **model type** — a purpose — not a model name. Four portable types, ranked by capability:

- **`frontier`** — long-horizon, minimally-supervised autonomous execution (multi-hour runs, subagent orchestration).
- **`reasoning`** — hardest one-shot judgment (architecture, research, novel design, cross-cutting consistency).
- **`standard`** — well-scoped default (everyday coding, high-volume or latency-sensitive work).
- **`fast`** — mechanical/bulk steps where full reasoning is wasted.

Concrete changes:

- **`preferred_model` → `preferred_model_type`**, validated against `['frontier', 'reasoning', 'standard', 'fast']`. `ki-agents`' `FM-2` keeps the Claude `model:` alias (it _is_ the Claude Code subagent spec) but its rationale now traces to the type the role needs, of which the alias is the runtime's resolution.
- **A new optional `[ki-tokenomics.model_tier_bindings]` sub-table** rebinds each type to the concrete model(s) a runtime supports — this is what makes the contract portable rather than a rename. **Keys are strict** (each must be one of the four types; an unknown key is a FAIL — rubric `CFG-5`). **Values are open, comma-separated, ordered preference lists**: `reasoning = "opus, gpt-5.6-sol"`, and each runtime resolves the first model it recognises. A single config is therefore portable across runtimes. Individual model names stay open strings — the checker holds no model ids, which are runtime-specific and volatile.
- **The concrete resolution lives in `docs/guides/prompting/`**, not in the standard or the checker: the Claude column in the per-tier guides (`fable-5.md`/`opus-4-8.md`/`sonnet-5.md`/`haiku.md`), the Codex column in `gpt-5-6.md`, and the cross-runtime table in that area's `README.md`. GPT-5.6 is preview-sourced and flagged for reconfirmation on `ki-tokenomics` REFRESH.
- **Migration is loud, not silent.** A lingering `preferred_model` is recognised only to FAIL with a migration hint (audit) and to emit a concrete "replace with `preferred_model_type = …`" TODO mapping the old alias to its type (conform). The legacy alias→type map is a temporary bridge; its removal is on the ROADMAP once the fleet has migrated.

This operationalises SDR-KI-HARNESS-002: the type is the portable contract the harness declares; the model is the runtime's downstream resolution.

## Consequences

- A repo's `.ki-config.toml` no longer hardcodes a Claude product name. A Codex-hosted environment declares the same types and binds them to GPT-5.6 tiers; a config listing both runtimes' models per type works unchanged in either.
- The checker gains one axis of validation (binding keys) while deliberately declining another (binding values) — consistent with the standard's existing rule that volatile model facts resolve at runtime, never in the checker.
- Two skills stay in lockstep: `ki-tokenomics` owns the type taxonomy and the config contract; `ki-agents`' `FM-2` cites it for the rationale behind a `model:` pin. A change to the type set is cross-skill.
- `docs/guides/prompting/` gains a `haiku.md` (closing a pre-existing gap — Haiku was named across the skills but had no guide) and a `gpt-5-6.md`, and becomes the single home for the volatile type→model resolution.
- The legacy `preferred_model` bridge is intentional debt with a scheduled removal; until then the fleet's sibling repos migrate at their own pace without a hard break.

## References

- [SDR-KI-HARNESS-002](SDR-KI-HARNESS-002-runtime-portable-contracts-and-executor-positioning.md) — runtime-portable contracts; the strategic decision this operationalises.
- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — mechanical-first: keys checked mechanically, appropriateness left to judgment.
- `ki-tokenomics` — the standard, rubric (`CFG-4`, `CFG-5`, `RUN-2`), and checker that own the config contract.
- `ki-agents` — `FM-2`, the per-agent `model:` pin that cites the taxonomy.
- [docs/guides/prompting/](../guides/prompting/README.md) — the type → model resolution per runtime.
