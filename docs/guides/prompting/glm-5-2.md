# Prompting GLM-5.2

How to prompt Z.ai's GLM-5.2, the leading open-weight model for agentic and coding work (MIT-licensed, ~750B-parameter MoE, 1M-token context). Read the shared [Prompting guides](README.md) principles first; this guide carries only what is distinctive to GLM-5.2. The harness runs Claude — this is reference for when you target, self-host, or evaluate GLM-5.2.

## When to reach for it

GLM-5.2 is the open-weight choice for agentic software engineering and long-horizon coding, where it is competitive with the frontier closed models on SWE-bench-style tasks while being self-hostable under a permissive licence. Reach for it when licence, cost, or on-prem control rule out a closed model — or as the open-weight baseline in a cross-model evaluation.

## Prompting principles

- **Keep tool output in context.** On agentic runs, preserve prior tool calls and their results across turns — GLM-5.2 uses them for reasoning continuity and to keep cache hit rates high. Don't strip the trace between steps.
- **Control thinking per turn.** Thinking is turn-level. Disable it for lightweight tasks (`reasoning={"enabled": false}`, or `clear_thinking: false` in content) to get a direct answer; keep it on for hard, multi-step work.
- **Escalate effort for hard coding.** Switch to deeper/Max compute for complex, multi-step engineering — it produces markedly better results there. Reserve lower effort for simple queries, documentation, and review. In Claude Code the `/effort` levels (`xhigh`, `max`, `ultracode`) map onto its Max effort mode.
- **Structure the prompt explicitly.** Reduce ambiguity with a consistent skeleton — goal, context, constraints, inputs, output format, success criteria — rather than an aspirational free-text ask.
- **Be concrete on coding specifics.** Name the language, framework, and versions, the project structure, and the exact deliverable. For agentic work, give the tools available and a rough decomposition.

## Sources

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [GLM-5 repository (zai-org/GLM-5)](https://github.com/zai-org/GLM-5) | BP | Model card, thinking controls, agentic tool guidance | 2026-07-09 |
| [GLM-5.2 quickstart (Together AI)](https://docs.together.ai/docs/glm-5.2-quickstart) | REF | Hosted-inference parameters and effort mapping | 2026-07-09 |
