# Recap sources

**Refresh:** external-spec · monthly

| Source | Last reviewed | Governs |
| --- | --- | --- |
| [OpenAI Codex developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) | 2026-09-26 | User-invocable `/compact` and current Codex session controls |
| [OpenAI Codex hooks](https://learn.chatgpt.com/docs/hooks) | 2026-09-26 | Manual/automatic compaction hooks and transcript-format stability boundary |
| [Claude Code sessions](https://code.claude.com/docs/en/sessions) | 2026-10-06 | Session storage, compaction, and transcript parsing boundary |
| [Claude Code hooks](https://code.claude.com/docs/en/hooks) | 2026-09-26 | Manual/automatic compaction events |
| [Claude Code environment variables](https://code.claude.com/docs/en/env-vars) | 2026-10-06 | `CLAUDE_CODE_SESSION_ID`, `CLAUDECODE`, `CLAUDE_CONFIG_DIR`, and `CLAUDE_CODE_PROJECT_DIR_NAME` for live-session transcript location |

## Last review

On 2026-09-26, current official documentation still showed both Codex and Claude Code exposing user-invocable `/compact` alongside automatic compaction. Codex also documents explicit pre- and post-compaction hook events. These controls do not grant an agent standing authority to invoke compaction. Both vendors expose transcript paths or files, but their structured formats remain version-sensitive convenience surfaces; Git remains the authoritative repository-grounding source.

On 2026-10-06, Claude Code documented `CLAUDE_CODE_SESSION_ID` as set in Bash, PowerShell, hook, and stdio MCP subprocesses, matching the hook `session_id` and updated on `/clear`; after `--continue` or an ID-less `--resume` it may carry the initial startup ID. Transcripts live at `<config>/projects/<project>/<session-id>.jsonl`. `<config>` is `CLAUDE_CONFIG_DIR` or `~/.claude`. `<project>` replaces every non-alphanumeric character of the working directory with `-`, is truncated with a hash beyond 200 characters, or is named by `CLAUDE_CODE_PROJECT_DIR_NAME`, and `/cd` relocates it. The helper therefore probes every project directory for the identified session rather than deriving the launch slug. The Codex documentation reviewed exposes no equivalent session-identity variable, so Codex selection remains bounded repository-matched discovery.
