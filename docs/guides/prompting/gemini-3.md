# Prompting Google Gemini 3

How to prompt Google's Gemini 3 line (3.1 Pro, 3 Flash, 3.5 Flash). Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Gemini 3. The harness runs Claude — this guide is reference for cross-model work: building on, targeting, or evaluating Gemini 3.

## When to reach for it

Gemini 3 is Google's frontier reasoning line, reached for long-context, multimodal, and agentic work when you are building on the Gemini stack or comparing against it. It is a reasoning model by default, which changes how you prompt it: the prompt-engineering scaffolding that older Gemini needed now works against it.

## Prompting principles

- **Simplify — let it reason.** Drop the chain-of-thought scaffolding you used to force reasoning on Gemini 2.5. Set `thinking_level: "high"` and give a simplified prompt without step-by-step instructions on how to think. Verbose, over-engineered prompts cause over-analysis.
- **Tune `thinking_level`.** Values `minimal` / `low` / `medium` / `high`; default `high` (dynamic) on Pro and Flash. Lower it for latency; pair `minimal`/`low` with a "think silently" instruction for fast paths. Don't combine `thinking_level` with the legacy `thinking_budget` in one request — that 400s.
- **Keep `temperature` at 1.0.** Google strongly recommends the default. Lowering it (a common habit for "deterministic" output) can cause looping or degraded performance on math/reasoning. Remove explicit low-temperature settings when migrating.
- **Steer verbosity up if needed.** It defaults to terse, direct answers. For a conversational or chatty persona you must explicitly ask for it (e.g. "explain this as a friendly, talkative assistant").
- **Put instructions last for long context.** For books, codebases, or long videos, place the question/instructions _after_ the data, and anchor reasoning to it ("Based on the preceding information…").
- **One consistent format.** Use XML _or_ Markdown, not both — mixing the two confuses it. Keep structure uniform and define ambiguous terms explicitly.
- **Objective constraints, no manipulation.** Give measurable constraints ("a summary of 3 sentences or less", not "a brief summary"). Strip emotional appeals, flattery, and artificial pressure — they don't help.
- **Avoid blanket negatives.** Broad "do not infer" / "do not guess" instructions make it over-index and fail basic logic or arithmetic. For grounding, tell it explicitly to rely on the provided context and to flag missing data rather than fabricate — don't just forbid outside knowledge wholesale.
- **Don't overload one prompt.** If a single pass asks it to summarise, extract, translate, and draft all at once, split into separate prompts.

## API notes

- **Media resolution.** Test `media_resolution_high` for dense document parsing. Gemini 3 defaults may raise token usage on PDFs but lower it on video; reduce media resolution explicitly if a request exceeds the context window.
- **Effort mapping.** An OpenAI-style `reasoning_effort` auto-maps to `thinking_level`, easing cross-model harnesses.
- **Knowledge cutoff.** January 2025 — for time-sensitive queries, state the current date in the system instruction and have it follow that when forming search queries.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Gemini 3 prompting guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/gemini-3-prompting-guide) | BP | The prompting patterns and steers above | 2026-07-09 |
| [Gemini 3 developer guide](https://ai.google.dev/gemini-api/docs/gemini-3) | BP | `thinking_level`, temperature, media resolution, migration | 2026-07-09 |
| [Prompt design strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) | BP | Cross-model prompt structure and grounding | 2026-07-09 |
