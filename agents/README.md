# agents

Knowledge Islands agent definitions live here, grouped by domain. Today these are **Claude Code subagents** — one `.md` file per agent — which is the current, validated shape. Whether other runtimes' subagent formats (e.g. OpenAI Codex CLI) share that shape is a provisional, open question pending a research spike; see [SDR-KI-HARNESS-002](../docs/decisions/SDR-KI-HARNESS-002-runtime-portable-contracts.md) for the multi-runtime intent and `ki-agents` (its portable-core framing) for what is expected to carry across.

## Convention

Under Claude Code — the current runtime — each agent is a Markdown file with YAML frontmatter (`name` and `description` required; `model`/`tools`/`disallowedTools`/`permissionMode`/`color` optional) followed by a system-prompt body, per the [Claude Code subagents spec](https://code.claude.com/docs/en/sub-agents). The `name` field must be unique across the whole tree. A future runtime may express the same agent differently; `name`, `description`, the system prompt, and coarse tool-scoping are the provisional portable core, and the rest is Claude Code-specific (see `ki-agents`).

The governing skill for what makes a good agent definition is **`ki-agents`** (under [skills/](../skills)) — the agents twin of `ki-skills`. Run its AUDIT mode over any agent, or the whole set, before shipping.

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
