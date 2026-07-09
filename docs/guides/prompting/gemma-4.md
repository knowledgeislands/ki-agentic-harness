# Prompting Gemma 4 (31B)

How to prompt Google's Gemma 4 31B, an open-weight model sized for local and single-GPU deployment. Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to Gemma 4. The harness runs Claude — this is reference for when you run Gemma 4 locally, target it, or evaluate it. (The family also ships smaller instruct variants — E2B/E4B/12B/26B-A4B — that share the format.)

## When to reach for it

Gemma 4 31B is a capable local model for a workstation or single accelerator, reached when data must stay on-device, or for offline and cost-free inference. Reach for it as the open, locally-runnable Google option; step up to Gemini 3 when you need frontier reasoning or long context.

## Prompting principles

- **Use the native system role.** Gemma 4 adds first-class `system`-role support (unlike Gemma 1–3, which folded system text into the user turn). Put role and behavioural rules in a clean system message.
- **Apply the chat template.** Drive it through the tokenizer's `apply_chat_template()` rather than hand-assembling control tokens — the template inserts the right boundaries and thinking/tool tokens.
- **Steer thinking via the system prompt.** Chain-of-thought runs on internal `<|think|>`/channel tokens and is nominally boolean, but instruction-following is flexible: a "LOW"-style system instruction cuts thinking (~20% fewer thinking tokens) for latency-sensitive local runs.
- **Pass tools through the template.** Provide tools via the `tools=` argument to `apply_chat_template()` (name, description, JSON args from docstrings); it emits dedicated `tool_call`/`tool_response` tokens for the handshake.
- **Watch the inference stack.** Tool-use and system-prompt reliability depend on the runtime, not just the weights — some stacks (e.g. certain llama.cpp builds) mishandle Gemma's tool-response tokens. Verify tool round-trips on your actual stack.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Gemma 4 prompt formatting](https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4) | BP | Chat template, roles, control tokens | 2026-07-09 |
| [Gemma prompt structure](https://ai.google.dev/gemma/docs/core/prompt-structure) | BP | System/user/model turn structure | 2026-07-09 |
| [Function calling with Gemma 4](https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4) | BP | Tool-calling tokens and handshake | 2026-07-09 |
