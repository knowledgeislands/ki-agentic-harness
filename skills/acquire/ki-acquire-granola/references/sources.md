# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Granola MCP documentation][granola-mcp] | Official endpoint, OAuth, scopes, current tool descriptions | 2026-10-01 |
| [Shared-screen snapshots][granola-snapshots] | Source image capture and Images stack | 2026-10-01 |
| [Historical export][granola-export] | CSV export contents and limits | 2026-10-01 |
| [mcporter configuration][mcporter-config] | HTTP transport, OAuth credential boundary, schema and CLI access | 2026-08-27 |

## Last review

On 2026-10-01, the live MCP still exposed six read-only tools for account, folder, meeting, detail, transcript, and query reads. Granola documents experimental shared-screen snapshots attached to notes in an Images stack. Neither the MCP tool surface nor the documented historical CSV export provides a snapshot inventory or image bytes. The acquisition and retirement standards therefore treat snapshot presence as unverified until a supported source read or per-note inspection establishes it.

Refresh must inspect only schemas and privacy-minimised structural evidence. Never retain account identifiers, meeting identifiers, notes, summaries, transcripts, credentials, or media in this skill.

[granola-mcp]: https://docs.granola.ai/help-center/sharing/integrations/mcp
[granola-snapshots]: https://docs.granola.ai/help-center/taking-notes/capture-shared-screens
[granola-export]: https://docs.granola.ai/help-center/sharing/exporting-notes
[mcporter-config]: https://github.com/openclaw/mcporter/blob/main/docs/config.md
