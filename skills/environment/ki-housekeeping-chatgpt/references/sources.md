# Sources

**Refresh:** external-spec · quarterly

| Source | Contract used | Last reviewed |
| --- | --- | --- |
| [Codex CLI command reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli#cli-codex-delete) | Stable one-session `codex delete` fallback. | 2026-08-18 |
| [Codex app-server reference](https://developers.openai.com/codex/app-server) | Initialization, experimental capability, paginated inventory, exact `cwd`, descendant filtering, and permanent deletion. | 2026-08-18 |

## Last review

On 2026-08-18, the CLI documented stable permanent deletion by saved-session ID or name. App-server documented `thread/list`, experimental `ancestorThreadId`, and `thread/delete`, including deletion of spawned descendants. The adapter remains opt-in and version-negotiated because app-server and the descendant filter are experimental.
