# Prompting guides

How to prompt the leading models — one guide per model, distilled from that vendor's own model-specific prompting page and refreshed when the guidance changes. The harness itself runs Claude; the non-Claude guides are cross-model reference for when you build on, target, self-host, or evaluate another model. Each guide carries only the deltas that are distinctive to its model — the cross-cutting principles are below, stated once.

Filenames carry the model version (`opus-4-8`, `gpt-5-5`, `glm-5-2`) so a new generation adds a file rather than rewriting an old one in place.

## The guides

### Anthropic — the tiers the harness runs

| Model | Guide | When to reach for it |
| --- | --- | --- |
| Claude Fable 5 / Mythos 5 | [fable-5.md](fable-5.md) | The hardest long-horizon, ambiguous, autonomous work — multi-hour runs, subagent orchestrations, unsolved problems |
| Claude Opus 4.8 | [opus-4-8.md](opus-4-8.md) | The heavy-lifting tier: reasoning, coding, agentic work where Fable 5 is overkill |
| Claude Sonnet 5 | [sonnet-5.md](sonnet-5.md) | Fast, cost-efficient tier: well-scoped coding and agentic tasks, high-volume or latency-sensitive workloads |
| Claude Haiku 4.5 | [haiku.md](haiku.md) | Fastest, lowest-cost tier: mechanical/bulk steps, sub-agent fan-out, scaffolding and conform-style edits |

The tier pick — how to trade cost against capability — is governed by the `ki-tokenomics` skill, and plan-at-the-top-tier / execute-at-a-cheaper-tier by `ki-handoffs`.

### Portable model types — one vocabulary across runtimes

The harness declares work by a portable **model type** (purpose), not a vendor's model name; each runtime resolves the type to a concrete model ([ADR-KI-HARNESS-009](../../decisions/ADR-KI-HARNESS-009-portable-model-types.md), governed by `ki-tokenomics`). The type is the stable thing; the columns below are the volatile resolution.

| Type | Purpose | Claude Code | Codex (GPT-5.6) |
| --- | --- | --- | --- |
| `frontier` | Long-horizon, minimally-supervised autonomous execution — multi-hour runs, subagent orchestration | [Fable 5](fable-5.md) | [Sol @ Ultra](gpt-5-6.md) |
| `reasoning` | Hardest one-shot judgment — architecture, research, novel design | [Opus 4.8](opus-4-8.md) | [Sol @ High/Max](gpt-5-6.md) |
| `standard` | Well-scoped default — everyday coding, high-volume or latency-sensitive work | [Sonnet 5](sonnet-5.md) | [Terra @ Medium](gpt-5-6.md) |
| `fast` | Mechanical/bulk steps where full reasoning is wasted | [Haiku 4.5](haiku.md) | [Luna @ Light](gpt-5-6.md) |

Model and effort are two independent axes on both vendors' real pickers — a single config value (`reasoning = "opus, gpt-5.6-sol"`) can list both runtimes' models and each resolves the first it supports.

### Other frontier and open-weight models — cross-model reference

| Model | Guide | When to reach for it |
| --- | --- | --- |
| OpenAI GPT-5.5 | [gpt-5-5.md](gpt-5-5.md) | Building on or comparing against the OpenAI stack: coding, agentic, knowledge work |
| OpenAI GPT-5.6 (Sol / Terra / Luna) | [gpt-5-6.md](gpt-5-6.md) | The Codex CLI tier family (Sol/Terra/Luna × effort); the Codex-side resolution of the portable model types |
| Google Gemini 3 | [gemini-3.md](gemini-3.md) | The Gemini stack: long-context, multimodal, agentic work |
| GLM-5.2 (Z.ai) | [glm-5-2.md](glm-5-2.md) | Leading open-weight model for agentic/coding; self-hostable under MIT |
| DeepSeek V3.2 | [deepseek-v3-2.md](deepseek-v3-2.md) | Open reasoning/maths baseline; low-cost self-hosting |
| Llama 4 (Meta) | [llama-4.md](llama-4.md) | The most-deployed open-weight family; broad tooling and long context |
| Gemma 4 31B | [gemma-4.md](gemma-4.md) | Local/on-device, single-GPU; Google's open, runnable option |
| Qwen3 (small / coder) | [qwen3.md](qwen3.md) | Local all-rounder and local coding on consumer hardware |
| Ministral 3 (Mistral edge) | [ministral-3.md](ministral-3.md) | Local/edge on a laptop or single GPU; instruct + reasoning variants |

## Principles

These hold across current reasoning models regardless of vendor; each guide notes where its model differs.

- **Models take prompts literally.** They do what is asked and won't generalise an instruction across items or infer unrequested work — to apply something broadly, say so, and state scope up front ("do X for every file", not "do X … first").
- **Reasoning effort is the primary lever.** A per-request effort / thinking-level setting (names vary: `effort`, `reasoning_effort`, `thinking_level`) trades intelligence against latency and cost more than prompt wording does. Set it deliberately; re-measure cost when a model or its effort scale changes.
- **Communication is concise by default.** Modern models lead with the outcome and may skip an interim status or a post-tool summary. If you need one, ask explicitly — and remove old scaffolding ("summarise every N tool calls") that assumed a chattier model.
- **Don't force the model to echo its reasoning.** Read structured `thinking`/reasoning blocks for visibility; instructing the model to reproduce or explain its internal reasoning in the response is unnecessary and can trip a safety classifier on some models.
- **Give `max_tokens` headroom.** Where the response cap also covers thinking, a tight limit truncates output (`stop_reason: "max_tokens"`). Size it generously on long agentic runs.

### Anthropic-specific notes

These apply to the Claude guides only:

- **`budget_tokens` is gone; thinking is adaptive.** Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) now 400s on Claude 5-class models. Set [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking) via `effort`; whether adaptive thinking is on by default differs by model (off on Opus 4.8, on on Sonnet 5).
- **Refusal / fallback.** Fable 5 runs safety classifiers and can return a `refusal` stop reason; configure a fallback to Opus 4.8. See the per-model guides.

## Refreshing

Each guide is distilled from the vendor pages its **Sources** table lists — tagged and dated. To update a guide, re-read those pages and re-date the "Last reviewed" column. The cross-cutting Anthropic reference is [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
