# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Paperclip agent skill][paperclip-skill] | Control-plane skill boundary and run context | 2026-09-25 |
| [Paperclip skills guide][skills-guide] | Company and agent skill model | 2026-09-25 |
| [Execution workspaces][workspaces] | Workspace binding and runtime relationship | 2026-09-25 |
| [Chat-style tasks][task-chat] | Direct conversational task behaviour | 2026-09-25 |

## Last review

Reviewed 2026-09-25. Paperclip's official agent skill remains the owner of API mechanics and coordination mutations. The documentation distinguishes reusable skills, execution workspaces, and chat-style tasks, supporting a KI overlay that keeps role, run, workspace, and worker identities separate. Chat-style tasks are experimental, so this skill depends only on the durable principle that direct conversation can coexist with coordinated execution, not on a specific chat API shape.

[paperclip-skill]: https://github.com/paperclipai/paperclip/blob/master/skills/paperclip/SKILL.md
[skills-guide]: https://docs.paperclip.ing/guides/org/skills/
[task-chat]: https://docs.paperclip.ing/experimental/task-chat/
[workspaces]: https://docs.paperclip.ing/guides/projects-workflow/workspaces/
