---
id: model
title: Model
type: system-layer
territory: knowledge-islands
island: ki-agentic-harness
status: agreed
origin: Cairn summit change 22, CARDS-AGENT (Kris, 12 November 2026)
---

# Model

A model, in agentic systems a large language model (LLM), takes text and images in and gives text out. It acts on nothing by itself: it reads no file, runs no command and keeps nothing from one call to the next. It is the one thing every other layer of an agentic system is built from.

## Examples by vendor

| | Anthropic | OpenAI | Google | Microsoft and GitHub |
| --- | --- | --- | --- | --- |
| **Current models** | Claude Opus 5.5, Claude Sonnet 5.5, Claude Haiku 5.5 and Claude Fable 5.2, with Claude Mythos 5.2 in limited access; ids such as `claude-opus-5-5` | GPT-6.1 Sol, GPT-6.1 Terra, GPT-6 Astra and GPT-6 Luna; still listed are GPT-5.5 (retiring), GPT-5.4 and GPT-5.3-Codex | Gemini 4 Carbon (generally available from 10 November 2026), Gemini 4 Argon, Gemini 3.8 Flash and Gemini 3.1 Pro (preview) | MAI Thinking and MAI Code of its own; GitHub Copilot mostly serves other vendors' models |
| **Their word** | "a family of … large language models" | "models that power ChatGPT Work and Codex" | "Gemini models" | "model", chosen in Copilot's model picker |
| **Sources** | [A1][a1] | [O1][o1], [O2][o2] | [G1][g1] | [M1][m1], [M2][m2] |

Every vendor uses the word in this sense. The sources and the dates they were checked are in [the skill's sources](sources.md).

## Where a name has more than one sense

- **Claude** names the model family and also an app, a harness and an agent, and **Codex** names an agent and its harness and also appears in model names such as GPT-5.3-Codex, and historically named a 2021 language model. On this card, each means only the model.
- **Gemini** names the model family and also the Gemini app and Gemini CLI. On this card it means the model family.
- **Copilot** is not a model: it chooses among other vendors' models and its own.

## Our conventions

The Knowledge Islands system uses "model" in this sense and has no convention of its own to map onto it.

## Next

The [agent harness][next] turns a model into an agent.

[next]: ./term-agent-harness.md
[a1]: https://platform.claude.com/docs/en/about-claude/models/overview
[o1]: https://learn.chatgpt.com/docs/models.md
[o2]: https://learn.chatgpt.com/docs/enterprise/workspace-model-availability.md
[g1]: https://aistudio.google.com/docs/models
[m1]: https://microsoft.ai/models/
[m2]: https://docs.github.com/en/copilot/reference/ai-models/supported-models
