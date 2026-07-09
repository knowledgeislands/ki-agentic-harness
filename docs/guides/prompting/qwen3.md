# Prompting Qwen3 (small / coder)

How to prompt Alibaba's smaller Qwen3 models — the dense 4B/8B/14B/32B variants and the coder builds — sized for local and single-GPU use under Apache 2.0. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Qwen3. The harness runs Claude — this is reference for when you run Qwen3 locally, target it, or evaluate it.

## When to reach for it

Qwen3 is the versatile open-weight all-rounder, and its coder variants are a strong local coding pick. Reach for a small Qwen3 when you want a permissively-licensed model that runs on consumer hardware, with a hybrid thinking mode you can switch off for cheap, latency-sensitive turns.

## Prompting principles

- **Switch thinking with the mode toggle.** Qwen3 has a hybrid thinking mode: `enable_thinking=True` (default) for reasoning, and `enable_thinking=False` — or the soft `/no_think` tag in the prompt — for a direct answer. Match the sampling to the mode (below), and use `/think` mid-conversation to re-enable it for a hard turn.
- **Set sampling by mode, and never greedy-decode while thinking.** Qwen recommends temperature `0.6` / top-p `0.95` in thinking mode and temperature `0.7` / top-p `0.8` in non-thinking mode. Greedy decoding (temp `0`) in thinking mode causes repetition and degraded output — avoid it.
- **Keep it lean for coder variants.** Name the language, framework, and versions and give the exact deliverable; the coder builds respond well to concrete, well-scoped tasks rather than open-ended prose.
- **Mind the local context budget.** The small variants run in tight VRAM — keep prompts focused and cap output length so a long thinking trace doesn't exhaust the window on-device.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Qwen documentation — Quickstart](https://qwen.readthedocs.io/en/latest/getting_started/quickstart.html) | BP | Thinking modes, chat template, generation settings | 2026-07-09 |
| [Qwen3-32B model card (Hugging Face)](https://huggingface.co/Qwen/Qwen3-32B) | BP | Recommended sampling per mode, `enable_thinking` | 2026-07-09 |
