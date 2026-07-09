# Prompting Claude Fable 5

How to prompt Claude Fable 5 (and its safeguard-free sibling Mythos 5). Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Fable 5.

## When to reach for it

Fable 5 is built for complex, long-horizon, ambiguous work that can run for minutes to hours — or, autonomously, longer. Reach for it on the hardest tasks: work that would previously have been split across several passes, long autonomous pipelines, and orchestrations that dispatch subagents. Aim it at genuinely hard problems; testing it only on simpler workloads undersells its range. For routine, well-bounded work, a lower effort setting or Opus 4.8 is usually the better trade.

Fable 5 runs safety classifiers (offensive cyber, biology and life sciences, and extraction of its own summarised thinking) and can return a `refusal` stop reason — delivered as a successful HTTP 200, with the declining classifier named. Benign work can occasionally trip these. Configure fallback to Opus 4.8 so declined requests re-route automatically. Mythos 5 is the same model without these classifiers (limited release).

## Prompting principles

Fable 5 follows brief, named instructions well, so each steer is a short instruction rather than a lecture.

| Principle | Steer |
| --- | --- |
| Start at the top | Hand it a task harder than you would give a prior model; let it scope, ask clarifying questions, then execute. |
| Scope discipline | Change only what the task needs; no speculative future-proofing, no error handling for impossible cases, no unrequested tidying or refactoring. |
| Constrain side actions | When the user is describing a problem or thinking aloud rather than requesting a change, the deliverable is your assessment — not an edit, email, or backup branch nobody asked for. |
| Know when to stop | Do the work now with tools; do not end a turn on a statement of intent without issuing the call. Pause only for irreversible actions or input only the user can give. |
| Audit progress claims | Check claims against actual tool results before reporting — this nearly eliminates fabricated status on long runs. If a step failed or was skipped, say so; if verified, state it plainly. |
| Brevity | Lead with the outcome in one sentence; keep supporting detail concise; no fragments, arrow chains, or unexplained jargon. |
| No reasoning echo | Do not ask the model to echo, transcribe, or explain its internal reasoning — it can trip a refusal and fall back to Opus 4.8. |
| Self-verification | On long runs, have fresh-context verifier subagents check the work against the specification at a set interval. |
| Subagents | Delegate readily; prefer asynchronous communication over blocking; keep long-lived subagents alive to reuse cache. Fable 5 is dependable at dispatching and sustaining parallel subagents. |
| Memory system | Give it a place to record lessons — a markdown file is enough — one lesson per entry with a one-line summary; corrections and confirmations alike; don't duplicate what the repo or history already records. |
| State request and intent | Give the goal and the purpose behind it; Fable 5 connects task to intent rather than inferring it on its own. |

## Effort

Effort is the primary intelligence, latency, and cost control, set on the API request. Default `high`; `xhigh` for the most capability-sensitive work; `medium` or `low` for routine work (still strong on Fable 5).

## Operational notes

- **Longer turns.** Hard tasks can run for minutes to hours. Use streaming, raise client timeouts, and prefer asynchronous or scheduled patterns over blocking calls.
- **Refactor legacy prompts.** Instructions written for prior models are often over-prescriptive and can degrade Fable 5. Strip them back and re-test against its default behaviour.
- **Reasoning visibility.** If an application needs the model's reasoning, read structured `thinking` blocks — do not instruct the model to reproduce its reasoning in the response.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) | BP | The prompting patterns and steers above | 2026-07-09 |
| [Introducing Claude Fable 5 and Mythos 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) | BP | Capabilities, safeguards, refusal / fallback behaviour | 2026-07-09 |
| [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | BP | The cross-model principles in the area index | 2026-07-09 |
