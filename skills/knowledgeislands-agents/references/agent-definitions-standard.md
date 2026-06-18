# Agent Definitions Standard

The normative reference behind `knowledgeislands-agents`: what a _good_ Claude Code subagent definition looks like, and why. The
[Audit Rubric](audit-rubric.md) is the line-by-line checklist derived from this — each rubric criterion (`NAME-1`, `DESC-2`, …) verifies a
convention stated here. Read the standard to understand or quote a convention; run the rubric (and its [linter](../scripts/lint-agents.ts))
to check an agent against it.

A subagent is a single Markdown file — YAML frontmatter + a system-prompt body — installed into a Claude agents directory
(`~/.claude/agents` or a project's `.claude/agents`). Source abbreviations (CC, HOUSE, BP) resolve in [the source list](sources.md).

## Contents

- [1. Two-layer model](#1-two-layer-model)
- [2. Layout](#2-layout)
- [3. Frontmatter: name](#3-frontmatter-name)
- [4. Frontmatter: description](#4-frontmatter-description)
- [5. Frontmatter: optional fields](#5-frontmatter-optional-fields)
- [6. System prompt: size & focus](#6-system-prompt-size--focus)
- [7. System prompt: structure & quality](#7-system-prompt-structure--quality)
- [8. Tools & model](#8-tools--model)
- [9. Lane & delegation](#9-lane--delegation)
- [10. Linking](#10-linking)
- [11. Process / evaluation](#11-process--evaluation)
- [12. Longevity](#12-longevity)
- [13. Cross-agent collision](#13-cross-agent-collision)

## 1. Two-layer model

Every convention is one of two kinds, and the distinction is a contract with the [linter](../scripts/lint-agents.ts):

- **Mechanical** — deterministically checkable (frontmatter parses, a name is unique, a length cap holds, a link resolves). The bundled
  linter owns these.
- **Judgment** — needs a model reading the agent (is the description a strong delegation signal, is the prompt a focused role, is the lane
  clear). The linter cannot assess these.

The rubric tags each criterion `[M]` or `[J]`. If a `[J]` check becomes mechanically enforceable, it moves into the linter and its tag
flips.

## 2. Layout

A subagent is **one Markdown file**: a YAML frontmatter block followed by the system prompt. Files may be grouped into subdirectories (e.g.
by domain or Pillar) for human organisation, but **identity is the `name` field, not the path** — so `name` must be unique across the whole
tree. The filename stem should match `name` (`product-manager.md` → `name: product-manager`) so a reader can find an agent by either. A
`README.md` in an agents tree documents the convention and is not itself an agent. (CC, HOUSE)

## 3. Frontmatter: name

`name` is required and is the agent's **identity** — how it is invoked and referenced. It is lowercase letters, digits, and hyphens only (no
uppercase, spaces, or underscores); has no leading/trailing or consecutive hyphens; carries no XML tags or reserved words (`anthropic`,
`claude`); and is **unique across the agent set** (two agents sharing a name collide at selection time). Make it a specific role, not a
generic label — `engineering-lead`, not `helper`. (CC, BP)

## 4. Frontmatter: description

The `description` is the **delegation signal**: the orchestrating agent reads it to decide _whether to hand this task to this subagent_, so
it is the highest-leverage field. It is present and non-empty, free of XML tags, and within a sensible length (≤ ~1024 chars — long enough
to scope the role, short enough to scan). It must state **both what the agent owns and when to delegate to it** (capability + trigger, never
one alone); be written in the **third person** ("Owns architecture and ADRs…", never "I/You…"); include concrete cues a request would carry
(the role's nouns and verbs); and avoid vague phrasing ("helps with engineering"). Where a sibling agent is adjacent, it may end by naming
the boundary ("…not what to build — that is the product-manager's"). To encourage Claude to **auto-delegate proactively**, the description
may use the CC-blessed idiom "use proactively" / "use immediately after…" as a when-to-delegate cue — permitted, not required. (CC, BP)

## 5. Frontmatter: optional fields

Validated when present, per the Claude Code subagents spec. Only `name` and `description` are required; everything below is optional:

- **`model`** — `inherit` (use the main thread's model — a sensible default), an alias (`sonnet`, `opus`, `haiku`, `fable`), or a pinned
  model id. Defaults to `inherit` when omitted. Pin only with a reason (a cheap model for a mechanical role, a stronger one for hard
  reasoning); otherwise prefer `inherit` — a pinned full model id is a longevity risk (it rots), so prefer the alias or `inherit`.
- **`tools`** — an allow-list of tool names. **Omitting it inherits all tools**; specifying it restricts the agent to exactly those. Grant
  **least privilege**: a read/advise agent does not need write or execution tools.
- **`disallowedTools`** — a deny-list: tools removed from the inherited (or `tools`-specified) set. Applied **first**, then `tools` is
  resolved against what remains; a tool named in both is removed. Either field can express least privilege — an allow-list when the role
  needs a few tools, a deny-list when it needs all-but-a-few.
- **`color`** — a display hint only; cosmetic.

Beyond these, the current subagents spec defines a wider field set — `permissionMode` (`default` / `acceptEdits` / `auto` / `dontAsk` /
`bypassPermissions` / `plan`; use `bypassPermissions` only with a stated reason, as it skips permission prompts), plus `skills` (preload
skill content), `mcpServers`, `hooks`, `memory` (`user` / `project` / `local` cross-session learning), `maxTurns`, `background`, `effort`,
`isolation` (`worktree`), and `initialPrompt`. The house uses only a subset, but **all of these are valid** — so a field is a portability
risk and flagged **only when it is not in this spec set** (`name`, `description`, `tools`, `disallowedTools`, `model`, `permissionMode`,
`maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`). Note that `hooks` /
`mcpServers` / `permissionMode` are ignored for plugin-distributed subagents. (CC)

## 6. System prompt: size & focus

The system-prompt body **is the agent's brain** — it loads in full whenever the agent runs. Keep it **focused on the one role**: enough to
establish identity, lane, grounding, and procedure, without restating what a competent Claude already knows. A sprawling prompt that wanders
outside the role dilutes it; if the prompt needs several unrelated lanes, that is two agents. (BP, HOUSE)

## 7. System prompt: structure & quality

A good role prompt follows a recognisable shape (the house pattern):

- **Role & lane** — open by stating who the agent is, what it **owns**, and — explicitly — what it does **not** own.
- **Grounding** — name the sources it must read before acting (KB notes, ADRs, prior decisions) and require it to cite them rather than
  reason from memory. An ungrounded role invents; a grounded one defers to the record.
- **When invoked** — a short, ordered procedure: clarify the request, read the relevant sources, reason from the role's lens, produce a
  concrete output.
- **Own vs defer** — an explicit list of what it owns and what it hands to which sibling.
- **Authoring/output conventions** — if the agent may write (notes, ADRs, code), require it to confirm before writing and to follow the
  house conventions; state the _why_ alongside each rule, not bare imperatives.

Use **consistent terminology** (one term per concept). (BP, HOUSE)

## 8. Tools & model

Three levers shape an agent's cost and blast radius:

- **Tools** — restrict to least privilege. An advisory agent (reads, recommends) should not carry write/exec tools; an authoring agent needs
  write but rarely shell. Omitting `tools` inherits everything, which is the wrong default for a narrow role. Express the restriction with
  **either** `tools` (an allow-list) **or** `disallowedTools` (a deny-list applied first) — whichever is shorter for the role. Both accept
  MCP server-level patterns (`mcp__<server>`, `mcp__<server>__*`, and `mcp__*` to remove all MCP tools), and `tools` accepts the
  `Agent(type)` spawn-allow-list that restricts which subagents this agent may itself spawn.
- **Model** — `inherit` unless the role justifies a pin: a high-volume mechanical role can use a cheaper model; a deep-reasoning role a
  stronger one. Pin via an alias (`sonnet`, `opus`, `haiku`, `fable`) rather than a full model id, which rots. State the reason where it is
  not obvious.
- **Permission mode** — `permissionMode` is the third lever: it sets how the agent handles permission prompts (`default` / `acceptEdits` /
  `auto` / `dontAsk` / `bypassPermissions` / `plan`). Leave it unset (inherit) unless the role needs a specific posture; `bypassPermissions`
  widens blast radius and needs a stated reason. (CC, BP)

## 9. Lane & delegation

Agents are selected the way skills are: by their `description` at delegation time. The collision guard is **design** — each agent owns a
distinct **lane**, and its prompt's own-vs-defer boundary keeps it there. Where two agents are genuinely adjacent (e.g. product-manager vs
product-owner, engineering-lead vs delivery-lead), **each** description and boundary names the other as the hand-off — the **reciprocal**
off-ramp; a one-directional guard is a half-fix. Two agents competing for the same request is a design problem to fix at the lane, not to
paper over. (HOUSE, BP)

## 10. Linking

Agents reference the knowledge base they work over. **`[[wikilinks]]` to KB notes are allowed and idiomatic** here — they are how a grounded
agent cites the notes it reads (this is the deliberate divergence from the `SKILL.md` standard, which forbids wikilinks because skills are
relocatable artifacts, not base-resident prompts). For any **bundled file** an agent ships alongside itself, use standard relative markdown
links that resolve on disk. Refer to another agent or skill by its `name`, never by a file path. (HOUSE)

## 11. Process / evaluation

Not checkable from the file alone. A good agent is **exercised on representative tasks** in its lane before it is relied on — does it stay
in lane, ground itself, and defer correctly? — and tested across the models it will run under. (BP)

## 12. Longevity

Agents rot like skills do. A prompt that hard-codes volatile facts — model IDs, tool names, specific note paths, dated specifics — must
either resolve them at runtime (read the live KB, prefer `model: inherit`) or be covered by a refresh path. Prefer grounding-at-runtime over
baked-in facts: an agent that reads its Pillar each session never goes stale; one that quotes a note's contents inline does. (BP, HOUSE)

## 13. Cross-agent collision

These check an agent against its **siblings** (so an audit runs the linter over the whole set, not one file). No two `name`s may be equal
(identity collision). No two `description`s should declare the **same quoted trigger phrase** — two agents firing on the identical cue
compete at delegation time. Beyond exact strings, where two agents could plausibly take one request, **each** names the other as the
off-ramp. (HOUSE)
