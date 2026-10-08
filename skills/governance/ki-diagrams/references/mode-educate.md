# Mode EDUCATE - start a diagram set

1. Confirm Archify is installed (`[skill.archify]` in the Rig skills configuration, source `tt-a1i/archify`). Without it, stop and give that install instruction.
2. Activate the skill with `ki repo skill add ki-diagrams`.
3. Choose the starter set with the owner. No set is mandatory; recommend by repository shape:

   | Shape                    | Recommended starter set                       |
   | ------------------------ | --------------------------------------------- |
   | Project or harness       | One `architecture` and one `workflow`         |
   | MCP server               | One `architecture` and one request `sequence` |
   | Knowledge Base           | None by default                               |

4. Copy `docs/diagrams/diagrams.toml` and `docs/diagrams/README.md` from the skill's [`assets/`](../assets/), and write one manifest table and one README section per chosen diagram before authoring it. Choose each type from its question as [the standard](standards-diagrams.md#choosing-a-diagram-type) maps it.
5. Author each source with the Archify skill, tracing every node to a repository-relative file and line, then finalize, export and set `last_checked` exactly as [REFRESH](mode-refresh.md) does.
6. Add Playwright as a development dependency only if the repository exports its own SVGs, and keep `+/diagrams/` out of version control unless the repository serves its HTML.
7. Run [AUDIT](mode-audit.md).
