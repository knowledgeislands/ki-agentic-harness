# Prompting OpenAI GPT-5.6 (Sol / Terra / Luna)

How to prompt OpenAI's GPT-5.6 family in Codex CLI. Read the shared [Prompting guides](README.md) principles first, then [gpt-5-5.md](gpt-5-5.md) — GPT-5.6 inherits the GPT-5-line prompt contract (outcome-first, effort-as-lever, verbosity param, tool preambles); this guide carries only what is distinctive to the 5.6 tiers. The harness runs Claude — this is cross-model reference, and the canonical mapping of the portable model _types_ ([`ki-tokenomics`](../../../skills/environment/ki-tokenomics/references/standards.md), ADR-KI-HARNESS-009) onto a Codex-hosted runtime.

> **Limited preview (2026-07).** GPT-5.6 is in limited preview (a small set of approved orgs; broader access expected shortly). Tier names, effort rungs, and pricing here are preview-sourced and **volatile** — reconfirm against OpenAI's own docs before relying on them (this file's Sources, and `ki-tokenomics`' `sources.md`, track the reconfirmation).

## The two axes: tier × effort

GPT-5.6 exposes model choice and reasoning effort as two separate, independently-set controls — the same two-axis shape as Claude Code's `model` + `effort` (agent frontmatter `FM-2`/`FM-8`) and Claude Cowork's model + effort pickers.

**Tier (model line):**

| Tier      | Positioning                  | Portable type                              | OpenAI's recommended routing                         |
| --------- | ---------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| **Sol**   | Flagship — deepest reasoning | `reasoning` (and `frontier` in Ultra mode) | Architecture, security, hard refactors, novel design |
| **Terra** | Balanced default             | `standard`                                 | Standard feature work, everyday engineering          |
| **Luna**  | Volume / cheap               | `fast`                                     | Docs, formatting, mechanical and sub-agent tasks     |

**Effort (per request):** `Light` → `Medium` → `High` → `Extra High`, plus two special modes — `Max` (more thinking time on a single task) and `Ultra` (subagent-parallel work; consumes usage limits fastest).

## Mapping the portable types

There is no separate Codex model for long-horizon autonomy the way Claude has Fable — `frontier` and `reasoning` both resolve to **Sol**, separated by mode/effort rather than by a distinct model name. This is a real cross-vendor asymmetry, not an error: Claude draws the frontier/reasoning line with a model family (Fable vs Opus); Codex draws it within Sol via Ultra mode.

| Portable type | Codex resolution                  |
| ------------- | --------------------------------- |
| `frontier`    | Sol @ `Ultra` (subagent-parallel) |
| `reasoning`   | Sol @ `High` / `Max`              |
| `standard`    | Terra @ `Medium`                  |
| `fast`        | Luna @ `Light` / `Low`            |

A repo running under Codex declares these in `[ki-tokenomics.model_tier_bindings]` (e.g. `reasoning = "gpt-5.6-sol"`); a config that lists both Claude and Codex models per type (`reasoning = "opus, gpt-5.6-sol"`) is portable across both runtimes, each resolving to the first model it supports.

## Prompting notes

- **Re-evaluate effort downward first.** As with GPT-5.5, a sharper prompt plus clear stop rules often recovers what a higher effort would buy — reach for `Extra High` / `Max` / `Ultra` only when the task genuinely needs it, since the top modes consume usage limits fastest.
- **Match tier to the step, not the session.** Run a bulk fan-out on Luna and escalate only the irreducible reasoning step to Sol — the same barbell discipline `ki-tokenomics` prescribes for Claude tiers.
- **Everything in [gpt-5-5.md](gpt-5-5.md) still applies** — the Responses API, `phase` field, verbosity param, and tool-preamble guidance are unchanged across the GPT-5 line.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [GPT-5.6 Sol, Terra, Luna: Skills Setup for Codex CLI](https://www.agensi.io/learn/gpt-5-6-sol-terra-luna-skills-guide) | BP | Tier positioning and Codex CLI routing | 2026-07-13 |
| [GPT-5.6 Sol, Terra, and Luna — Codex CLI model tiers, pricing, Ultra mode, configuration](https://codex.danielvaughan.com/2026/06/26/gpt-5-6-sol-terra-luna-preview-codex-cli-model-tiers-pricing-ultra-mode-configuration/) | BP | Tiers, effort/mode axis, pricing, preview status | 2026-07-13 |
| [Prompting OpenAI GPT-5.5](gpt-5-5.md) | — | The GPT-5-line prompt contract GPT-5.6 inherits | 2026-07-13 |
