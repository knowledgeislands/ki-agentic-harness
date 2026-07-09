# Prompting Llama 4

How to prompt Meta's Llama 4 (Scout, Maverick), the most widely-deployed open-weight family in enterprise. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Llama 4. The harness runs Claude — this is reference for when you target, self-host, or evaluate Llama 4.

## When to reach for it

Llama 4 is the default "safe" open-weight choice — broadly supported across inference stacks, with Scout's large context window suiting long-document work. Reach for it when enterprise deployment breadth, tooling maturity, or an established open baseline matter more than topping the open-model leaderboard.

## Prompting principles

- **Match the exact chat template.** Llama 4 uses its own header tokens (`<|begin_of_text|>`, `<|start_header_id|>`, `<|eot_id|>`, …) — distinct from Llama 2/3. Let the framework (Ollama, vLLM, llama.cpp) apply the template, and if hand-building, keep the required newlines. Multimodal input needs `<|image_start|>`/`<|image_end|>` boundaries per image.
- **Keep the system prompt short.** 2–4 sentences: define the role, output format, and behavioural constraints, then stop. Long system prompts make it lose focus on later instructions — push extra context into the user message.
- **Use a system prompt deliberately.** A good one measurably reduces false refusals and "preachy"/templated phrasing, and improves conversationality and formatting — Meta calls Llama 4 highly steerable.
- **Few-shot + prefilled structure.** For structured output, give one or two input/output examples and prefill the opening token (`{` for JSON, `<summary>` for XML) to lock the format. Tag sections (`<task>`, `<rules>`) to stop instruction overlap.
- **Frame long documents first.** At long context, precede a large document block with a brief statement of what it is, its format, and what you need — before the content itself.
- **Layer safety at the system level.** Don't rely on prompts alone for safety; pair with Llama Guard 4 as a system-level guardrail.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Llama 4 model cards & prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama4/) | BP | Chat template, tokens, prompt guidance | 2026-07-09 |
| [Prompt engineering how-to](https://www.llama.com/docs/how-to-guides/prompting/) | BP | Zero-/few-shot, role prompts, RAG | 2026-07-09 |
| [Llama API best practices](https://llama.developer.meta.com/docs/guides/best-practices) | BP | Prompting, model selection, moderation | 2026-07-09 |
