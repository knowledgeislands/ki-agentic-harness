# Prompting DeepSeek V3.2

How to prompt DeepSeek V3.2, an open-weight reasoning-and-general model with a 1M-token context. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to V3.2. The harness runs Claude — this is reference for when you target, self-host, or evaluate DeepSeek. (DeepSeek V4, released April 2026, is the newer flagship; V3.2 remains a widely-deployed open-weight baseline.)

## When to reach for it

DeepSeek V3.2 is a strong open-weight pick for multi-step reasoning and maths, and a common self-hosted baseline where its permissive weights and low inference cost matter. Reach for it as an open reasoning baseline or when comparing reasoning traces across models.

## Prompting principles

- **Don't add chain-of-thought scaffolding.** It is a reasoning model — it already deliberates internally. "Think step by step" instructions add verbosity and can distract it; DeepSeek's own guidance discourages them on the reasoning path.
- **Set temperature by task.** DeepSeek publishes task-specific temperatures: `0.0` for coding and maths (determinism), ~~`1.0` for general conversation, higher (~~`1.3`) for translation, and higher still for creative writing. The API also remaps temperature internally, so tune against observed behaviour.
- **Constrain JSON tightly.** For structured output, instruct JSON-only in the system prompt, give a tight schema, avoid stray delimiter sequences, and lower the temperature.
- **Put documents before the question.** For search/RAG over supplied documents, place the document block first and the instruction after it.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Temperature & parameter settings](https://api-docs.deepseek.com/quick_start/parameter_settings) | BP | Task-specific temperature and sampling guidance | 2026-07-09 |
| [DeepSeek-V3.2 model card (Hugging Face)](https://huggingface.co/deepseek-ai/DeepSeek-V3.2) | BP | Weights, `generation_config.json` defaults, prompt template | 2026-07-09 |
