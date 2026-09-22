# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Projects in ChatGPT][chatgpt-projects] | Official project grouping, chats, files, and instructions | 2026-09-20 |
| [Exporting ChatGPT history and data][chatgpt-export] | Official readable export and its delivery boundary | 2026-09-22 |
| [ChatGPT housekeeping adapter][housekeeping-adapter] | Installed-store opaque identity and change evidence | 2026-09-20 |

## Last review

On 2026-09-22, official ChatGPT documentation confirmed that an eligible signed-in account can request an export whose ZIP includes chat history and other account data. Delivery may take up to seven days and the download link expires after 24 hours. The documentation does not establish a supported incremental conversation-read interface or guarantee that the archive exposes complete project membership, write-ups, assets, and stable project identifiers. The acquisition standard therefore selects the export as an authorised bootstrap snapshot while retaining the local store as content-minimised evidence, prepared capture as the bounded executable bridge, and incremental readable acquisition as an unresolved dependency.

REFRESH must inspect only privacy-minimised schemas and capability documentation. Never retain account identifiers, project identifiers, conversation identifiers, conversation text, files, credentials, or private URLs in this skill.

[chatgpt-export]: https://help.openai.com/en/articles/7260999
[chatgpt-projects]: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
[housekeeping-adapter]: https://github.com/knowledgeislands/mcp-housekeeping-chatgpt
