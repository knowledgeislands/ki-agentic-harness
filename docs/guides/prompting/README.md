# Prompting guides

The **how** of prompting the models we actually run. One guide per model, each distilled from Anthropic's model-specific prompting page and carrying a **Sources** section so it can be refreshed when that page changes or when our own experience diverges. This page holds the principles that hold _across_ the current model line; each per-model guide carries only its deltas.

Filenames carry the model version (`fable-5`, `opus-4-8`, `sonnet-5`) because the guidance turns over per model generation — a new generation adds a new file rather than rewriting an old one in place.

## The guides

| Model | Guide | When to reach for it |
| --- | --- | --- |
| Claude Fable 5 / Mythos 5 | [fable-5.md](fable-5.md) | The hardest long-horizon, ambiguous, autonomous work — multi-hour runs, subagent orchestrations, unsolved problems |
| Claude Opus 4.8 | [opus-4-8.md](opus-4-8.md) | The default heavy-lifting tier: complex reasoning, coding, and agentic work where Fable 5 would be overkill |
| Claude Sonnet 5 | [sonnet-5.md](sonnet-5.md) | The fast, cost-efficient tier: well-scoped coding and agentic tasks, high-volume or latency-sensitive workloads |

Which tier to pick — the cost and capability trade — is governed by the `ki-tokenomics` skill, and the plan-at-the-top-tier / execute-at-a-cheaper-tier split by `ki-handoffs`. This area governs how to _prompt_ whichever tier you land on, not which one to choose.

## Principles across the current line

These hold for all three models; the per-model guides note where a model differs.

- **Be literal and specific.** The current models interpret prompts literally and do not silently generalise an instruction from one item to another or infer requests you did not make. If an instruction should apply broadly, say so ("apply this to every section, not just the first"). Vague prompts get scoped, not generalised.
- **Effort is the primary lever, set on the request not the prompt.** The [`effort`](https://platform.claude.com/docs/en/build-with-claude/effort) parameter trades intelligence against latency and cost. If you see shallow reasoning on a complex task, raise effort rather than prompting around it. The models respect effort strictly at the low end — `low`/`medium` scope the work to exactly what was asked.
- **`budget_tokens` is gone; thinking is adaptive.** Manual extended thinking (`thinking: {type: "enabled", budget_tokens: N}`) returns a 400 error on the current models. Use [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking) plus `effort` instead. Whether adaptive thinking is on by default differs by model (see each guide).
- **Communication is concise by default.** The models lead with the outcome and may skip a verbal summary after tool calls, jumping to the next action. If you need interim status or a post-tool summary, ask for it explicitly — and try _removing_ scaffolding written for older models that forced periodic status messages.
- **Do not ask the model to echo its reasoning.** Read structured `thinking` blocks if you need visibility; instructing the model to reproduce or explain its internal reasoning in the response is both unnecessary and, on Fable 5, can trip a safety classifier.
- **Leave output headroom.** `max_tokens` caps thinking plus response together. At high effort, adaptive thinking can consume a large share of the budget; a tight limit yields a truncated answer with `stop_reason: "max_tokens"`. Size it generously on long agentic runs.

## Refreshing a guide

Each guide's **Sources** table lists the Anthropic pages it was distilled from, tagged and dated. To refresh: re-read the listed pages, diff against the guide, update the steers and the "last reviewed" date. The cross-cutting source for the principles above is Anthropic's [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
