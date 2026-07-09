# Prompting OpenAI GPT-5.5

How to prompt OpenAI's GPT-5.5, the current flagship of the GPT-5 line. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to GPT-5.5. The harness runs Claude — this guide is reference for cross-model work: building on, targeting, or evaluating GPT-5.5.

## When to reach for it

GPT-5.5 is OpenAI's strong general reasoning-and-agentic tier, reached for coding, agentic workflows, and knowledge work when you are building on the OpenAI stack or comparing against it. Its cheaper siblings (GPT-5.4, GPT-5.2) share the same prompt contract; the steers below apply across the line. For agentic use OpenAI recommends the **Responses API** over Chat Completions — persisted tool calls compound into more efficient traces.

## Prompting principles

- **Outcome-first, not process-first.** Define the outcome, success criteria, constraints, and stop rules; leave the solution path to the model. Legacy prompts over-specify the process — that now adds noise and narrows its search space.
- **Re-evaluate effort downward.** Reasoning is more efficient — reconsider `low`/`medium` before escalating. A sharper prompt and clear stopping conditions often recover the gains a higher effort would buy.
- **Reserve absolutes for invariants.** Keep `ALWAYS` / `NEVER` / `must` / `only` for true invariants (safety rules, required output fields). For judgment calls (when to search, ask, use a tool, keep iterating) give decision rules, not absolutes.
- **Control verbosity with the param.** Set `text.verbosity` (`low` / `medium` / `high`; default `medium`) rather than begging for brevity in prose. Describe the output shape; reserve heavy structure for where it aids comprehension or gives your UI a stable artifact.
- **Split personality from collaboration style.** Two short, separate controls: _personality_ governs how it sounds (tone, warmth, directness, formality, humour); _collaboration style_ governs how it works (when it asks vs assumes, how proactive, how it handles risk). Neither replaces goals, success criteria, or stop rules.
- **Emit tool preambles.** For multi-step or tool-heavy tasks, have it send a one-to-two-sentence user-visible preamble before tool calls that names the first step — it improves perceived responsiveness in streaming/agentic UIs.
- **Budget retrieval.** Give search an explicit stopping rule: one broad search first, search again only on a specific trigger (a missing fact, an exhaustive request, a named document).
- **Separate facts from wording.** In drafting tasks, cite source-backed facts but don't let creative wording invent metrics or names — state the guardrail explicitly.
- **Have it check its work.** Ask it to validate via tests/lint/build, or by rendering and inspecting visual artifacts, before declaring done.

## API notes

- **`phase` field.** Long-running Responses workflows distinguish intermediate updates from final answers via `phase` (introduced GPT-5.4, unchanged in 5.5). With `previous_response_id`, prior assistant state is preserved automatically; if you replay assistant items manually, preserve `phase` values exactly — `commentary` for interim updates, `final_answer` for completed answers — and never set `phase` on user messages.
- **Prompt skeleton.** Role → Personality → Goal → Success criteria → Constraints → Output → Stop rules. Keep each section short; add detail only where it changes behaviour.
- **Migration.** Codex offers an automated path via the OpenAI Docs skill (`openai-docs migrate this project to gpt-5.5`) rather than hand-porting an older prompt stack.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Prompt guidance](https://developers.openai.com/api/docs/guides/prompt-guidance) | BP | The prompting patterns and steers above | 2026-07-09 |
| [Using GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model) | BP | Model-specific API behaviour (verbosity, phase, Responses API) | 2026-07-09 |
| [GPT-5 prompting guide (cookbook)](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide) | BP | Agentic eagerness, coding-specific tips, GPT-5 → 5.5 deltas | 2026-07-09 |
