# Prompting Claude Sonnet 5

How to prompt Claude Sonnet 5, the fast, cost-efficient tier. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Sonnet 5. It performs well out of the box on existing Sonnet 4.6 prompts — the steers below are the behaviours that most often need tuning.

## When to reach for it

Sonnet 5 has particular strengths in coding and agentic tasks and is the tier for well-scoped work, high volume, or latency-sensitive workloads — where Opus 4.8 or Fable 5 would spend more than the task warrants. As a rough migration mapping: Sonnet 5 at `medium` is comparable to Sonnet 4.6 at `high`, and Sonnet 5 at `high` to Sonnet 4.6 at `max`.

## Prompting principles

| Principle | Steer |
| --- | --- |
| Effort defaults to `high` | Same default as Sonnet 4.6. Raise to `xhigh` for the hardest coding and agentic tasks; drop to `medium`/`low` for cost- or latency-sensitive work. It respects effort strictly at the low end. |
| Adaptive thinking is **on** by default | Requests with no `thinking` field run with adaptive thinking — a change from 4.6, where they ran without. Pass `thinking: {type: "disabled"}` to turn it off. If it thinks too readily (common with large system prompts), steer it down; if it under-thinks at `medium`, raise effort. |
| Mind the tokenizer + budget | The new tokenizer produces ~30% more tokens for the same text, and `max_tokens` caps thinking plus response together. Budgets tuned for 4.6 may truncate — leave headroom at `high`+ effort or you may see `stop_reason: "max_tokens"`. |
| More agentic than 4.6 | It reaches for tools and self-verification loops more readily. But with thinking _disabled_ it is less likely to consider searching — if you rely on tool calls with thinking off, add an explicit nudge. |
| Be literal, state scope | It interprets prompts literally and will not generalise across items or infer unrequested work. To apply something broadly, say so. |
| Trust the built-in updates | It gives regular, well-calibrated progress updates on long traces. Remove "summarise every N tool calls" scaffolding; if miscalibrated, describe what you want with an example. |
| No sampling params | Setting `temperature`, `top_p`, or `top_k` to a non-default value returns a 400 error — new for Sonnet-class. Steer tone and variety via the system prompt instead. |
| Specify the design brief | Like Opus 4.8, it can settle into a default house style that reads wrong for dashboards, dev tools, fintech, or enterprise briefs. Give a concrete spec, or have it propose 3–4 distinct directions first — the recommended route to variety now that `temperature` is unavailable. |

## Coding and review harnesses

- **Interactive coding.** Use `xhigh`/`high` effort, add an auto mode, and specify task, intent, and constraints fully in the first turn to maximise autonomy and token efficiency.
- **Code review.** As with Opus 4.8, a harness tuned for an older model may show lower reported recall because Sonnet 5 follows "be conservative / high-severity only" instructions more faithfully. Tell the finding stage its job is coverage and filter separately, or set a concrete severity bar.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Prompting Claude Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5) | BP | The prompting patterns and steers above | 2026-07-09 |
| [What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5) | BP | Capabilities and API changes (thinking, tokenizer) | 2026-07-09 |
| [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | BP | The cross-model principles in the area index | 2026-07-09 |
