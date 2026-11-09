---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-09T22:38:25Z
refresh: external-spec · monthly
---

# Sources — where the standard comes from

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
  - [2.1 Authoritative](#21-authoritative)
    - [2.1.1 Portable Agent Skills contract](#211-portable-agent-skills-contract)
    - [2.1.2 Established authoring practice](#212-established-authoring-practice)
    - [2.1.3 Runtime overlay: OpenAI](#213-runtime-overlay-openai)
    - [2.1.4 Knowledge Islands house standard](#214-knowledge-islands-house-standard)
    - [2.1.5 Runtime overlay: Claude Code](#215-runtime-overlay-claude-code)
  - [2.2 Advisory](#22-advisory)
    - [2.2.1 Anthropic practice](#221-anthropic-practice)
    - [2.2.2 OpenAI practice](#222-openai-practice)
    - [2.2.3 Community](#223-community)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

**Refresh:** external-spec · monthly

The authoritative and community sources behind the [Agent Skills](standard-agent-skills.md), [Knowledge Islands](standard-knowledge-islands.md), and [rubric-authoring](standard-rubric-authoring.md) standards and their [rubric](rubric.md). Mode REFRESH reads this file, re-fetches each source, diffs it against those standards and the rubric, then **bumps the `last reviewed` dates** and refreshes the [Last review](#4-last-review) block below (what changed is recorded in the commit, not a changelog). This is the skill's memory of where best practice comes from — keep it current.

Abbreviations match the `(SOURCE)` tags in the standards and [rubric](rubric.md).

[Back to contents](#contents)

## 2. Outside sources

The specifications, practice and runtime documentation the standards follow or draw on. Each source carries its tag, as the standards and rubric cite it.

### 2.1 Authoritative

The portable contract, established practice, the runtime overlays and the house standard.

[Back to contents](#contents)

#### 2.1.1 Portable Agent Skills contract

| Source | Governs | Last reviewed |
| --- | --- | --- |
| SPEC — [Agent Skills specification][spec] | Format and constraints | 2026-09-26 |
| — [`skills-ref validate`][skills-ref]‡ | Demonstration validator | 2026-09-26 |

‡ The reference library explicitly says it is demonstration-only and unsuitable as a production validator; it remains supporting validation evidence subordinate to the specification.

[Back to contents](#contents)

#### 2.1.2 Established authoring practice

The Agent Skills [documentation index][agentskills-index] is the inventory authority for this set. Every REFRESH fetches it first, reconciles this table with its current pages, then reviews every listed page individually. The index currently lists the nine documentation pages below; the index itself is also tracked because it detects additions and removals.

| Source | Governs | Last reviewed |
| --- | --- | --- |
| AS — [Agent Skills documentation index][agentskills-index] | Page inventory | 2026-09-26 |
| AS — [Agent Skills overview][home] | Conceptual overview | 2026-09-26 |
| AS — [Skill-creator quickstart][quickstart] | First-skill workflow | 2026-09-26 |
| AS — [Skill-creator best practices][agentskills-best-practices] | Authoring guidance | 2026-09-26 |
| AS — [Optimising descriptions][optimizing-descriptions] | Description quality | 2026-09-26 |
| AS — [Evaluating skills][evaluating-skills] | Evaluation practice | 2026-09-26 |
| AS — [Using scripts][using-scripts] | Script execution | 2026-09-26 |
| AS — [Client showcase][clients] | Client inventory | 2026-09-26 |
| AS — [Adding skills support][adding-skills-support] | Client implementation | 2026-09-26 |
| BP — [Skill authoring best practices][bp] | Authoring checklist | 2026-09-26 |
| ENG — [Equipping agents with Agent Skills][eng]† | Design rationale | 2026-09-26 |

† Published 2025-10-16; updated to announce the open standard 2025-12-18.

[Back to contents](#contents)

#### 2.1.3 Runtime overlay: OpenAI

| Source | Governs | Last reviewed |
| --- | --- | --- |
| OA — [OpenAI Build skills][openai-skills] | ChatGPT/Codex runtime overlay | 2026-09-26 |

`OA` documents OpenAI runtime discovery, listing, path metadata, implicit invocation, and `agents/openai.yaml`. It qualifies runtime claims but never changes the portable Agent Skills contract.

[Back to contents](#contents)

#### 2.1.4 Knowledge Islands house standard

| Source | Governs | Last reviewed |
| --- | --- | --- |
| ki-agentic-harness README — The repo's own `README.md` | Harness structure | 2026-09-26 |
| ADR-KI-HARNESS-SKILLS-004 — Local decision record | Standalone skills and variation | 2026-09-26 |
| ADR-KI-HARNESS-SKILLS-006 — Local decision record | Kind, taxonomy, and dependencies | 2026-09-26 |

The README is cited only for the harness's four-part structure. Local decision records, rather than the README, support the semantic house claims.

[Back to contents](#contents)

#### 2.1.5 Runtime overlay: Claude Code

| Source | Governs | Last reviewed |
| --- | --- | --- |
| CC — [Claude Code — skills][cc] | Claude runtime overlay† | 2026-09-26 |

† Claude Code extensions and runtime behaviour. This overlay may qualify a portable or Knowledge Islands rule for Claude Code, but never weakens the portable contract.

[Back to contents](#contents)

### 2.2 Advisory

Discovery and community sources: supporting evidence, not normative rules.

[Back to contents](#contents)

#### 2.2.1 Anthropic practice

The Claude blog is a discovery source, not a normative standard. On each REFRESH, scan its landing page for new articles materially relevant to agent skills, agentic practice, or authoring workflows; open and assess only those relevant articles.

| Source | Informs | Last reviewed |
| --- | --- | --- |
| BLOG — [Claude blog][claude-blog] | Agentic-practice and authoring article discovery | 2026-09-26 |

[Back to contents](#contents)

#### 2.2.2 OpenAI practice

The OpenAI News page is a discovery source, not a normative standard. On each REFRESH, scan its landing page for new articles materially relevant to agent skills, agentic practice, or authoring workflows; open and assess only those relevant articles.

| Source | Informs | Last reviewed |
| --- | --- | --- |
| OPENAI — [OpenAI News][openai-news] | Agentic-practice and authoring article discovery | 2026-09-26 |

[Back to contents](#contents)

#### 2.2.3 Community

| Source | Informs | Last reviewed |
| --- | --- | --- |
| COMMUNITY — [Skill Authoring Patterns][patterns] | Patterns and feedback | 2026-09-26 |
| COMMUNITY — [obra/superpowers writing-skills][superpowers]† | Convergent conventions | 2026-09-26 |
| COMMUNITY — [skills.sh — Open Agent Skills Ecosystem][skills-sh] | Registry and security | 2026-09-26 |
| FAFF — [shftwst/faff][faff] | Claude Code delivery-harness and autonomy-gate discovery | 2026-09-26 |

† Community restatement of the best-practices document.

[Back to contents](#contents)

## 3. Decisions

None.

[Back to contents](#contents)

## 4. Last review

REFRESH last run **2026-09-26**. It fetched [the documentation index][agentskills-index] first; it still lists the same nine pages and the specification retains the portable format and budgets. The review found no immediate standard or rubric change; its material follow-ups were dispositioned on 2026-10-06, as recorded below.

- **SPEC:** portable fields and constraints remain current. `allowed-tools` is the only portable tool declaration and remains experimental; `disallowed-tools` is not in the specification.
- **Agent Skills home:** accessible; three-stage progressive disclosure (metadata ~100 tok / instructions < 5000 tok / resources on demand). Spec unchanged.
- **Description voice:** the current Agent Skills description guide prefers direct imperative phrasing, while Anthropic and community guidance retains third person. The portable rule now accepts either activation-oriented form and continues to reject first-/second-person explanation.
- **CC:** `disallowed-tools` and `background` remain Claude Code extensions; the former accepts a string or YAML list, while `background` applies only with `context: fork`.
- **OA:** Targeted evidence was rechecked on 2026-09-26. OpenAI documents `.agents/skills` discovery, initial name/description/path listings, a two-per-cent or 8,000-character initial-list budget, description shortening before possible omission warnings, `agents/openai.yaml`, and `allow_implicit_invocation`. Description remains the primary signal for implicit matching, not the only listed metadata.
- **ENG:** published 2025-10-16 and updated 2025-12-18; it remains rationale, not a normative source.
- **BLOG (Claude blog):** added as a discovery source. Future REFRESH runs scan it for articles materially relevant to agent skills, agentic practice, or authoring workflows; an article is supporting evidence, not a normative rule by itself.
- **OPENAI (OpenAI News):** added as a discovery source. Future REFRESH runs scan it for articles materially relevant to agent skills, agentic practice, or authoring workflows; an article is supporting evidence, not a normative rule by itself.
- **GASCITY retired (2026-10-06):** the former Gas Town Hall source now redirects to Gas City, a Beads-native software-factory platform. A review of its home page and guide index found work-graph, orchestration, and durable-memory positioning but no skill-authoring or harness practice beyond what this standard and the KI work-record skills already cover, so it was removed as a discovery source. The `ki-agentic-radar` Gas City assessment subject is unaffected.
- **FAFF (shftwst/faff):** added as a discovery source. Future REFRESH runs review its delivery-loop contracts, autonomy levels, and gate design for transferable lessons; its Claude Code-specific implementation is supporting evidence, not a portable rule by itself.
- **COMMUNITY:** the reviewed pattern guide, Superpowers guidance, and skills.sh registry remain supporting evidence. They introduce no further portable constraint; the soft ~300-line split suggestion remains below our 500-line WARN and is not adopted as a separate cap.
- **`skills-ref`:** the repository now explicitly labels the reference library demonstration-only and not for production. Keep it as supporting validation evidence; the specification remains the normative baseline.
- **In-house scan:** the then-current governed skill set passed its skill-quality audit, including `ki-skills` itself. Exact commands and fleet counts are intentionally omitted because both change as the host and skill set evolve.
- **Open watch-items:** none; no source disagreement requires a standard or rubric change.

(What past reviews changed in the standard / rubric / linter is in git.)

[Back to contents](#contents)

[spec]: https://agentskills.io/specification
[agentskills-index]: https://agentskills.io/llms.txt
[home]: https://agentskills.io/
[quickstart]: https://agentskills.io/skill-creation/quickstart
[agentskills-best-practices]: https://agentskills.io/skill-creation/best-practices
[optimizing-descriptions]: https://agentskills.io/skill-creation/optimizing-descriptions
[evaluating-skills]: https://agentskills.io/skill-creation/evaluating-skills
[using-scripts]: https://agentskills.io/skill-creation/using-scripts
[clients]: https://agentskills.io/clients
[adding-skills-support]: https://agentskills.io/client-implementation/adding-skills-support
[bp]: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
[cc]: https://code.claude.com/docs/en/skills
[eng]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[claude-blog]: https://claude.com/blog
[openai-news]: https://openai.com/news/
[openai-skills]: https://learn.chatgpt.com/docs/build-skills
[faff]: https://github.com/shftwst/faff
[skills-ref]: https://github.com/agentskills/agentskills/tree/main/skills-ref
[patterns]: https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics
[superpowers]: https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md
[skills-sh]: https://www.skills.sh/
