# agents

Knowledge Islands agent definitions live here, grouped by domain. Each is a **Claude Code subagent** file, one `.md` file per agent. That file is the designated primary projection of a portable role and carries the role record itself, as [ADR-KI-HARNESS-AGENTS-002](../docs/decisions/ADR-KI-HARNESS-AGENTS-002-portable-subagent-contract-and-runtime-adapters.md) decides. This repository declares no Codex projection; one would correspond to the primary and never establish the record.

## Convention

Each agent is a Markdown file with YAML frontmatter followed by a system-prompt body, per the [Claude Code subagents spec](https://code.claude.com/docs/en/sub-agents). The **record fields** are `name`, `description`, and the body; `name` must be unique across the whole tree. Every other frontmatter key - `model`, `tools`, `disallowedTools`, `permissionMode`, `color` and the rest - is a **projection field** owned by `ki-subagents-claude`, not part of the role. The partition is defined in `ki-subagents` under [Record and projections](../skills/agentic-systems/ki-subagents/references/standards-portable-subagents.md#record-and-projections).

The governing skill for what makes a good agent definition is **`ki-subagents`** (under [skills/](../skills)) — the agents twin of `ki-skills`. Run its AUDIT mode over any agent, or the whole set, before shipping.

## governance/

KI governance-domain agents. Each is grounded in the ki-arcadia-principal KB and the harness skill set; each defers to its siblings for adjacent concerns.

| Agent                   | Lane                                                     |
| ----------------------- | -------------------------------------------------------- |
| `ki-skills-lead`        | SKILL.md authoring, auditing, and conformance            |
| `ki-engineering-lead`   | Toolchain compliance and repo structure                  |
| `ki-repo-kb-curator`         | KB zone health, note structure, and link integrity       |
| `ki-decision-author`    | DR authoring (SDR / GDR / ADR) and the Decisions index   |
| `ki-repo-kb-streams-curator` | Enactment process, proposals pipeline, and streams state |

## coordination/

KI coordination-lane roles. Each owns one lane of the work cycle — convening, stewardship, crossing, delivery — and defers to its siblings for the other three. They were designed as one interlocking set; each record's hand-offs name the other three.

| Agent          | Lane                                                            |
| -------------- | --------------------------------------------------------------- |
| `ki-convenor`  | Intent into governed work, routing to lanes, and escalation      |
| `ki-steward`   | Repository/coordination-plane boundary, shaping, and audit       |
| `ki-ferryman`  | Remote execution substrate, sessions, and access paths           |
| `ki-wright`    | Delivery under a Ready work record, from baseline to review      |

## Adding an agent

1. Group it in a domain subdirectory.
2. Add `<role>.md` with `name` and `description` frontmatter.
3. Audit with `ki-subagents` and resolve findings.
