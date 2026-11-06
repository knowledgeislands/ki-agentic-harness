# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Granola MCP documentation][granola-mcp] | Official endpoint, OAuth, scopes, current tool descriptions | 2026-10-16 |
| [Shared-screen snapshots][granola-snapshots] | Source image capture and Images stack | 2026-10-01 |
| [Historical export][granola-export] | CSV export contents and limits | 2026-10-01 |
| [mcporter configuration][mcporter-config] | HTTP transport, OAuth credential boundary, schema and CLI access | 2026-08-27 |

## Last review

On 6 November 2026, under INBOX-RENAME from `personal.reg.inbox-terra`, at Kris's word ("Do full rename to inbox now and coordinate that"), the assistant repository became the Inbox: `krisb/assistant` is now `krisb/inbox`, its packages `personal.reg.inbox-terra` and `personal.reg.inbox-sol`, and its store `sources-inbox`. Live wording here follows; older lines below keep the names they had.

On 2026-11-05, under ATER-027, the how-to was pointed at the assistant's `ki-muninn` after tools-ki `4faf9724` removed `ki acquire`: the `ki-acquire-*` adapter front matter, which only tools-ki read, was removed, `capture_moves` is now shown in `[muninn.granola]`, and repeat runs name the recent-changes window `ki-muninn` runs by default. The provider method is otherwise unchanged; no external source was re-fetched and no live schema was inspected.

On 2026-11-03, the skill took up tools-ki `e4fbd81c` and `d85feb4a` (GRANOLA-MOVE): a repository may declare `capture_moves` instead of `acquired_folder_id`, and the confirmed move adds Captured and reads it back before invoking `remove_note_from_folder` on Triaged and reading back again. The removal tool was among the thirteen seen on 2026-10-16; no external source was re-fetched and no live schema was inspected for this change.

On 2026-10-20, the skill was cut to the ledger-free importer in tools-ki `26c754f3` (ACQUIRE-019): Acquired membership alone skips a meeting, captures are found by UUID, `status`, `reconcile`, `reset` and `--refresh-transcripts` are gone, and the retirement standard was folded into the acquisition standard. No external source was re-fetched; the MCP surface below stands as reviewed on 2026-10-16.

On 2026-10-16, official documentation confirmed owned/shared scopes, screenshot reads, and account tools. Separately authorised live schema inspection exposed thirteen tools, including additive/removal membership and folder administration. Structural reads verified owned-note filtering, paged folders and transcripts, listing screenshot counts, detail attachment UUIDs, and image-plus-metadata responses. A bounded authorised additive-marker spike preserved existing memberships. No documented release date establishes when these capabilities arrived. Acquisition allowlists reads; the separate confirmed marker permits only additive membership in an owner-controlled private folder. Screenshot evidence establishes exact returned MCP bytes, not byte equivalence with desktop originals. Retirement retains the independent export gate. Refresh must inspect only schemas and privacy-minimised structural evidence. Never retain account identifiers, meeting identifiers, notes, summaries, transcripts, credentials, or media in this skill.

[granola-mcp]: https://docs.granola.ai/help-center/sharing/integrations/mcp
[granola-snapshots]: https://docs.granola.ai/help-center/taking-notes/capture-shared-screens
[granola-export]: https://docs.granola.ai/help-center/sharing/exporting-notes
[mcporter-config]: https://github.com/openclaw/mcporter/blob/main/docs/config.md
