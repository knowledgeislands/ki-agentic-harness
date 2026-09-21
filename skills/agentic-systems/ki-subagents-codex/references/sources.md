# Sources — Codex adapter

**Refresh:** external-spec · monthly

**Last reviewed:** 2026-09-21

## Normative

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| CODEX | [OpenAI Codex Subagents documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents.md) | TOML locations, required fields, supported source keys, and runtime boundaries | 2026-09-21 |

The checked official OpenAI manual cache contains the same Subagents section at lines 1973–2385. It confirms source paths and native fields, while leaving effective runtime behavior outside file evidence.

## Local boundary

| Tag | Source | Governs | Last reviewed |
| --- | --- | --- | --- |
| HOST | Harness host capability inspection recorded in the Round 25 packet | Codex has no subagent capability/path and no generic subagent publisher exists | 2026-09-21 |

## Last review

2026-09-21 — learn.chatgpt.com was unreachable via the session network proxy; the CODEX source could not be re-fetched. Host capability inspection (HOST) confirmed no Codex subagent capability or publisher. The standard is unchanged pending a successful re-fetch. Open watch-item: re-fetch CODEX on a session with unrestricted egress.
