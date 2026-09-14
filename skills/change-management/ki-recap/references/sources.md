# Recap sources

**Refresh:** external-spec · monthly

| Source | Last reviewed | Governs |
| --- | --- | --- |
| [OpenAI Codex developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) | 2026-08-12 | User-invocable `/compact` and current Codex session controls |
| [OpenAI Codex hooks](https://learn.chatgpt.com/docs/hooks) | 2026-08-12 | Manual/automatic compaction hooks and transcript-format stability boundary |
| [Claude Code sessions](https://code.claude.com/docs/en/sessions) | 2026-09-14 | Session storage, compaction, and transcript parsing boundary |
| [Claude Code hooks](https://code.claude.com/docs/en/hooks) | 2026-09-14 | Manual/automatic compaction events |

## Last review

REFRESH last run **2026-09-14** (previous: 2026-08-12). Codex sources (`learn.chatgpt.com`) were unreachable from the refresh environment this cycle; their review dates remain at 2026-08-12.

**Confirmed (Claude Code):**

- Claude Code sessions page (latest cited: v2.1.257): `/compact` now accepts optional `[instructions]` to focus the summary. A new **resume-time compaction pathway** was added: for Pro/Max users, when a session has been inactive more than ~1 hour and exceeds 100 000 tokens, Claude Code presents a resume dialog with three options — _Resume from summary_ (runs `/compact` immediately), _Resume full session as-is_, and _Don't ask me again_. This is a distinct third compaction entry point alongside manual `/compact` and in-session context overflow; it is user-presented, not agent-invoked, so the existing "The command does not grant an agent standing authority to invoke it" boundary holds.
- Claude Code hooks page (latest cited: v2.1.267): `SessionStart` now accepts a `compact` matcher value, meaning it fires when a session starts as the result of compaction. This is the hook-level correlate of the resume-time compaction dialog. The `PreCompact`/`PostCompact` hooks with `manual`/`auto` matchers are unchanged. New hook event types and `prompt`/`agent` hook types were added outside the compaction scope.
- A new env var `CLAUDE_CODE_SKIP_PROMPT_HISTORY` suppresses transcript writes entirely; this may affect the grounding helper if a session produces no transcript.
- Both vendors continue to expose version-sensitive transcript JSONL formats; Git remains the authoritative repository-grounding source.

**Open watch-items:**

- Codex sources (`learn.chatgpt.com`) were egress-blocked this cycle. Retry at next refresh from an environment with access.
- Monitor for any change to Codex `/compact` availability or hook matchers once the Codex sources are reachable again.
