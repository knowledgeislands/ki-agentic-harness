# Sources

**Refresh:** external-spec · quarterly

| Source | Contract used | Last reviewed |
| --- | --- | --- |
| [Codex CLI command reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli#cli-codex-delete) | Stable one-session `codex delete` fallback. | 2026-08-18 |
| [Codex app-server reference](https://developers.openai.com/codex/app-server) | Initialization, experimental capability, paginated inventory, exact `cwd`, descendant filtering, and permanent deletion. | 2026-08-18 |

## Last review

On 6 November 2026, under INBOX-RENAME from `personal.reg.inbox-terra`, at Kris's word ("Do full rename to inbox now and coordinate that"), the assistant repository became the Inbox: `krisb/assistant` is now `krisb/inbox`, its packages `personal.reg.inbox-terra` and `personal.reg.inbox-sol`, and its store `sources-inbox`. Live wording here follows; older lines below keep the names they had.

On 2026-08-18, the CLI documented stable permanent deletion by saved-session ID or name. App-server documented `thread/list`, experimental `ancestorThreadId`, and `thread/delete`, including deletion of spawned descendants. The adapter remains opt-in and version-negotiated because app-server and the descendant filter are experimental.
