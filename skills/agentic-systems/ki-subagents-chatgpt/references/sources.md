# Sources — Codex adapter

**Refresh:** external-spec · monthly

**Last reviewed:** 2026-09-26

## Normative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| CODEX | [OpenAI Codex Subagents documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) | TOML locations, required fields, supported source keys, and runtime boundaries | 2026-09-26 |

The refreshed official OpenAI documentation confirms source paths, native fields, and default runtime availability. Repository evidence still cannot prove effective installation, activation, or execution.

## Local boundary

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HOST | Current repository and KI host capability inspection | KI harness has no Codex subagent publication path or generic subagent publisher | 2026-09-26 |

## Last review

On 2026-09-26, current Codex documentation established that subagents are enabled by default and discovered from `.codex/agents/` or `~/.codex/agents/`. A conforming TOML source file still does not prove that the KI harness publishes, installs, or activates it. The current KI host has no Codex subagent publication path or generic subagent publisher, so this adapter continues to report source conformance only; the runtime-versus-host gap is routed to `KI-HARNESS-GOV-112`.
