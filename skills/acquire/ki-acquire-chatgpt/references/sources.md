# Sources

**Refresh:** external-spec · quarterly

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Projects in ChatGPT][chatgpt-projects] | Official project grouping, chats, files, and instructions | 2026-09-20 |
| [Exporting ChatGPT history and data][chatgpt-export] | Official readable export and its delivery boundary | 2026-09-20 |
| [ChatGPT housekeeping adapter][housekeeping-adapter] | Installed-store opaque identity and change evidence | 2026-09-20 |

## Last review

On 2026-09-20, the installed-store adapter exposed 177 opaque records across 16 immutable project IDs, with identifiers, timestamps, byte counts, and hashes but no readable conversations or project names. Official ChatGPT documentation established projects as groups of chats, files, and instructions and documented a complete account export, but did not establish a supported incremental conversation-read interface. The acquisition standard therefore treats the local store as content-minimised evidence, prepared capture as a bounded bridge, and a readable incremental source as an unresolved executable dependency.

REFRESH must inspect only privacy-minimised schemas and capability documentation. Never retain account identifiers, project identifiers, conversation identifiers, conversation text, files, credentials, or private URLs in this skill.

[chatgpt-export]: https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt
[chatgpt-projects]: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
[housekeeping-adapter]: https://github.com/knowledgeislands/mcp-housekeeping-chatgpt
