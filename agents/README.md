# agents

Knowledge Islands **Claude subagents** live here — one `.md` file per agent, grouped by domain.

## Convention

Each agent is a Markdown file with YAML frontmatter (`name` and `description` required; `model`/`tools`/`disallowedTools`/`permissionMode`/`color` optional) followed by a system-prompt body, per the wider [subagents spec](https://code.claude.com/docs/en/sub-agents). The `name` field must be unique across the whole tree.

The governing skill for what makes a good agent definition is **`ki-agents`** (under [skills/](../skills/)) — the agents twin of `ki-skills`. Run its AUDIT mode over any agent, or the whole set, before shipping.

## governance/

KI governance-domain agents. Each is grounded in the ki-arcadia-principal KB and the harness skill set; each defers to its siblings for adjacent concerns.

| Agent                   | Lane                                                     |
| ----------------------- | -------------------------------------------------------- |
| `ki-skills-lead`        | SKILL.md authoring, auditing, and conformance            |
| `ki-engineering-lead`   | Toolchain compliance and repo structure                  |
| `ki-kb-curator`         | KB zone health, note structure, and link integrity       |
| `ki-decision-author`    | DR authoring (SDR / GDR / ADR) and the Decisions index   |
| `ki-kb-streams-curator` | Enactment process, proposals pipeline, and streams state |

## Adding an agent

1. Group it in a domain subdirectory.
2. Add `<role>.md` with `name` and `description` frontmatter.
3. Audit with `ki-agents` and resolve findings.
