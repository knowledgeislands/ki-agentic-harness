# Prompting Claude Opus 4.8

How to prompt Claude Opus 4.8, the default heavy-lifting tier. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Opus 4.8. It performs well out of the box on existing Opus 4.7 prompts — the steers below are the behaviours that most often need tuning.

## When to reach for it

Opus 4.8 is the strong general tier for complex reasoning, knowledge work, coding, and agentic work — the model to reach for when a task is hard but does not need Fable 5's long-horizon autonomy. It is also the recommended fallback target when Fable 5 declines a request. For high-volume or latency-sensitive work, Sonnet 5 is the better trade.

## Prompting principles

| Principle | Steer |
| --- | --- |
| Effort is the main lever | Start at `xhigh` for coding and agentic use; use at least `high` for the most intelligence-sensitive work. Effort matters more here than on any prior Opus — experiment actively on upgrade. |
| Re-baseline effort | Effort levels were re-tuned vs 4.7 (`medium` allows more thinking, `high` somewhat less, `xhigh` substantially more). Cost and latency you tuned against 4.7 will not map over — re-measure. |
| Adaptive thinking is opt-in | Thinking is **off** unless you set `thinking: {type: "adaptive"}`. If it thinks more than you want (common with large system prompts), steer it down; if it under-thinks at `medium`, raise effort first. |
| Be literal, state scope | It interprets prompts literally and will not generalise an instruction across items or infer unrequested work. To apply something broadly, say so. This precision is an asset for tuned prompts and structured extraction. |
| Effort drives tool use | It favours reasoning over tool calls, which is usually better. To get more tool usage (e.g. web search in knowledge work), raise effort to `high`/`xhigh` or instruct explicitly when and how to use the tool. |
| Trust the built-in updates | It gives regular, well-calibrated user-facing progress updates on long traces. Remove scaffolding like "summarise every 3 tool calls"; if updates are miscalibrated, describe what you want and show an example. |
| Ask for summaries you need | Its concise style means it may skip a verbal summary after tool calls and jump to the next action. If you need one, request it explicitly. |
| Control subagents | It does not spawn subagents by default but does so readily under prompting. Steer explicitly whether to complete work in a single turn or fan out across subagents. |
| Specify the design brief | It has a strong default house style (warm cream backgrounds, serif display type) that suits editorial/hospitality briefs but reads wrong for dashboards, dev tools, fintech, or enterprise. Generic "don't use cream" just shifts it to another fixed palette — instead give a concrete spec, or have it propose 3–4 distinct directions and pick one. |

## Coding and review harnesses

- **Interactive coding.** Opus 4.8 uses more tokens in interactive, multi-turn sessions (it reasons more after each user turn). To maximise both performance and efficiency, use `xhigh`/`high` effort, add an auto mode, and specify the task, intent, and constraints fully in the _first_ turn rather than dribbling them out.
- **Code review.** It is meaningfully better at finding bugs, but a harness tuned for an older model may show _lower_ reported recall: it follows "only report high-severity" instructions more faithfully and drops findings below your stated bar. Tell the finding stage its job is coverage — report everything with a confidence and severity — and filter in a separate step, or set a concrete bar rather than a vague "important".

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) | BP | The prompting patterns and steers above | 2026-07-09 |
| [What's new in Claude Opus 4.8](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8) | BP | Capabilities and API changes (effort, thinking) | 2026-07-09 |
| [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | BP | The cross-model principles in the area index | 2026-07-09 |
