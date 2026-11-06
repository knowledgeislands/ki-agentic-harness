# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Projects in ChatGPT][chatgpt-projects] | Official project grouping, chats, files, and instructions | 2026-09-20 |
| [Exporting ChatGPT history and data][chatgpt-export] | Official readable export and its delivery boundary | 2026-09-22 |
| [ChatGPT housekeeping adapter][housekeeping-adapter] | Opaque local-store evidence, never conversation content | 2026-09-20 |

## Last review

On 6 November 2026, under INBOX-RENAME from `personal.reg.inbox-terra`, at Kris's word ("Do full rename to inbox now and coordinate that"), the assistant repository became the Inbox: `krisb/assistant` is now `krisb/inbox`, its packages `personal.reg.inbox-terra` and `personal.reg.inbox-sol`, and its store `sources-inbox`. Live wording here follows; older lines below keep the names they had.

On 2026-11-05, under ATER-027, the executable bridge was pointed at the assistant's `ki-muninn chatgpt import` and `export` after tools-ki `4faf9724` removed `ki acquire`, and the `ki-acquire-*` adapter front matter, which only tools-ki read, was removed. The provider method is unchanged; no external source was re-fetched.

On 2026-10-20, the skill was cut to the owner's simplified capture model: the end point lives in the digest's README front matter, with no `capture-mark.json`, checkpoint or intake receipt, and the incremental project-acquisition design and opaque-store pairing were removed. No external source was re-fetched; the entries below stand as reviewed on 2026-09-22.

On 2026-09-22, official ChatGPT documentation confirmed that an eligible signed-in account can request an export whose ZIP includes chat history and other account data. Delivery may take up to seven days and the download link expires after 24 hours. The documentation does not establish a supported incremental conversation-read interface or guarantee that the archive exposes complete project membership, write-ups, assets, and stable project identifiers. The acquisition standard therefore selects the export as an authorised bootstrap snapshot while retaining the local store as content-minimised evidence, prepared capture as the bounded executable bridge, and incremental readable acquisition as an unresolved dependency.

REFRESH must inspect only privacy-minimised schemas and capability documentation. Never retain account identifiers, project identifiers, conversation identifiers, conversation text, files, credentials, or private URLs in this skill.

[chatgpt-export]: https://help.openai.com/en/articles/7260999
[chatgpt-projects]: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
[housekeeping-adapter]: https://github.com/knowledgeislands/mcp-housekeeping-chatgpt
