# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Paperclip agent skill][paperclip-skill] | Control-plane skill boundary and run context | 2026-09-25 |
| [Paperclip skills guide][skills-guide] | Company and agent skill model | 2026-09-25 |
| [Execution workspaces][workspaces] | Workspace binding and runtime relationship | 2026-09-25 |
| [Chat-style tasks][task-chat] | Direct conversational task behaviour | 2026-09-25 |
| [Paperclip server build][server-build] | Retirement gates, archived-inclusive project listing, run isolation and remote MCP endpoints | 2026-09-30 |
| [Bundled PARA memory skill][server-build] | Agent-local capture, recall, planning and retention instructions | 2026-10-01 |

## Last review

2026-10-01: inspected `skills/para-memory-files/SKILL.md` and `references/schemas.md` in the installed `@paperclipai/server` 2026.916.1 payload. They direct facts and daily notes into agent-local memory, separate project plans into `plans/`, and retained facts into superseding records. The KI memory boundary constrains those instructions without modifying the bundled skill: repositories retain durable knowledge and work authority, and an employee knowledge-return check reconciles useful discoveries. This was an instruction review, not an audit of agents' stored memories or retrieval indexes. Recheck these instructions after upgrades.

Reviewed 2026-09-25. Paperclip's official agent skill remains the owner of API mechanics and coordination mutations. The documentation distinguishes reusable skills, execution workspaces, and chat-style tasks, supporting a KI overlay that keeps role, run, workspace, and worker identities separate. Chat-style tasks are experimental, so this skill depends only on the durable principle that direct conversation can coexist with coordinated execution, not on a specific chat API shape.

Reviewed 2026-09-26 for workspace retirement only. The automatic sweep gates, configured cooldown, and separate warned early-close readiness path were read from the installed `@paperclipai/server` 2026.916.1 build rather than public documentation. The standard states both paths in runtime-neutral terms and requires each arrangement to record its own cooldown, so a later version change must be reviewed rather than silently assumed.

Reviewed 2026-09-29 for project inventory on installed Paperclip 2026.916.1. The server route reads `includeArchived=true` and its service includes archived rows when requested; without the query, the route requests active projects only. The CLI `project list` calls the route without the query, and generated OpenAPI describes no query parameter. Project rows are filtered by actor read access. A board-operator call against the live local instance returned archived rows for KIS and HNR, confirming the option works here; the VA archived-inclusive result contained four projects, none archived. Recheck the route, schema and caller visibility after an upgrade before treating a negative result as complete coverage.

2026-09-30: the installed `@paperclipai/server` `2026.916.1` build replaces run `HOME`, XDG base directories, `CLAUDE_CONFIG_DIR` and `CODEX_HOME` (`dist/services/ai-connection-runtime.js`), and admits private remote MCP endpoints unless the deployment is authenticated and public (`allowPrivateRemoteEndpoints` in `dist/services/tool-access.js` and `dist/services/tool-gateway.js`). The local instance was loopback-bound with private exposure. No bridge connection or run was exercised; recheck both after upgrade.

[paperclip-skill]: https://github.com/paperclipai/paperclip/blob/master/skills/paperclip/SKILL.md
[server-build]: https://www.npmjs.com/package/@paperclipai/server/v/2026.916.1
[skills-guide]: https://docs.paperclip.ing/guides/org/skills/
[task-chat]: https://docs.paperclip.ing/experimental/task-chat/
[workspaces]: https://docs.paperclip.ing/guides/projects-workflow/workspaces/
