# Recap sources

**Refresh:** external-spec · monthly

| Source | Last reviewed | Governs |
| --- | --- | --- |
| [OpenAI Codex developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) | 2026-09-21 | User-invocable `/compact` and current Codex session controls |
| [OpenAI Codex hooks](https://learn.chatgpt.com/docs/hooks) | 2026-09-21 | Manual/automatic compaction hooks and transcript-format stability boundary |
| [Claude Code sessions](https://code.claude.com/docs/en/sessions) | 2026-09-21 | Session storage, compaction, and transcript parsing boundary |
| [Claude Code hooks](https://code.claude.com/docs/en/hooks) | 2026-09-21 | Manual/automatic compaction events |

## Last review

2026-09-21 — Claude Code sessions and hooks re-fetched live: `/compact [instructions]` is still documented; `PreCompact`/`PostCompact` hooks remain available with `manual`/`auto` matchers; transcript JSONL at `~/.claude/projects/<project>/<session-id>.jsonl` is still the internal format and remains version-sensitive. Codex sources (learn.chatgpt.com) were unreachable via the session network proxy; Codex claims unchanged pending a successful re-fetch. No drift on Claude Code side. Open watch-item: re-fetch Codex developer commands and hooks on a session with unrestricted egress.
