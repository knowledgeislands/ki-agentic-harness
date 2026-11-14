---
name: ki-keystone
ki-kind: governance
ki-applicability: baseline
ki-guild: keystone
ki-leads: keystone
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Lead the Keystone guild, the guild of guilds: the guild map of every KI skill by guild and lead, where a session
  starts in a repository, and the rule for joining Keystone. Use to find which guild and lead skill own a piece of
  work, or to audit a skill collection's guild tree; `ki-skills` owns the guild rules and skill shape.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | help | refresh'
---

# Keystone

Keystone is the guild of guilds: it holds what every other guild rests on, and each guild's lead. This skill mostly signposts. Find the guild whose purpose fits the work, open its lead, and let the lead disclose the member you need. [The Keystone standard](references/standard-keystone.md) holds the rules this skill audits; `ki-skills`' guilds standard sets what a guild and a lead are.

## Where to start

A session in a repository starts with three skills:

- **`ki-repo`** for the repository itself: its `.ki.toml`, its shape and the skills it declares.
- **`ki-authoring`** for anything written down: formats, READMEs, decisions and knowledge placement.
- **`ki-agentic-systems`** for the words: what an agent, a session, a subagent or a skill is.

## The guilds

Each guild's purpose, in a line:

| Guild | What it is for |
| --- | --- |
| Keystone | What every other guild rests on, and each guild's lead |
| Repository | The repository contract and each kind of repository's structure |
| Work | How work is chosen, planned, done, accepted and coordinated |
| Agentic systems | Its words, and agents at work: subagents, delegation, and watching the field |
| Acquire | Bringing knowledge in from outside |
| Environment | Where agents run: tools and access, limits, and the state agent hosts leave |
| Design | All design, technical as well as visual: how a design is shaped, before Authoring's skills write it down |
| Authoring | Documents and writing things down: formats, READMEs, decisions, specifications, guides and diagrams |

## The guild map

Generated from every skill's frontmatter, the guild it declares and the guild it leads; never edit it by hand. Each lead is also a member of Keystone, so it appears there too.

<!-- ki-keystone:guild-map:start -->

| Guild | Lead | Members |
| --- | --- | --- |
| Keystone | `ki-keystone` | `ki-acquire`, `ki-agentic-systems`, `ki-authoring`, `ki-bootstrap`, `ki-knowledge-graph`, `ki-repo`, `ki-skills`, `ki-work` |
| Acquire | `ki-acquire` | `ki-acquire-chatgpt`, `ki-acquire-granola`, `ki-dodecakrisis`, `ki-exchange-dynamics`, `ki-pulse` |
| Agentic systems | `ki-agentic-systems` | `ki-agentic-radar`, `ki-delegation`, `ki-delegation-orca`, `ki-model-radar`, `ki-subagents`, `ki-subagents-chatgpt`, `ki-subagents-claude` |
| Authoring | `ki-authoring` | `ki-decision-records`, `ki-diagrams`, `ki-guides`, `ki-specs` |
| Design | None | `ki-design-inspiration`, `ki-design-system` |
| Environment | None | `ki-binding`, `ki-binding-chatgpt`, `ki-binding-chezmoi`, `ki-binding-claude`, `ki-housekeeping-chatgpt`, `ki-housekeeping-claude`, `ki-tokenomics`, `ki-tokenomics-chatgpt`, `ki-tokenomics-claude` |
| Repository | `ki-repo` | `ki-engineering`, `ki-git`, `ki-repo-dotfiles-chezmoi`, `ki-repo-harness`, `ki-repo-homebrew-tap`, `ki-repo-kb`, `ki-repo-kb-activities`, `ki-repo-kb-live-artifacts`, `ki-repo-kb-principal`, `ki-repo-kb-streams`, `ki-repo-mcp`, `ki-repo-packages`, `ki-repo-project`, `ki-repo-specifications`, `ki-repo-tools`, `ki-repo-website`, `ki-repo-website-app`, `ki-repo-website-cloudflare`, `ki-repo-website-content` |
| Work | `ki-work` | `ki-accept`, `ki-batch`, `ki-coordination`, `ki-implement`, `ki-meeting`, `ki-next`, `ki-plan`, `ki-recap`, `ki-trade`, `ki-trades`, `ki-work-design`, `ki-work-github-issues`, `ki-work-linear`, `ki-work-package`, `ki-work-recurring`, `ki-work-roadmap` |

<!-- ki-keystone:guild-map:end -->

## Joining Keystone

A skill joins Keystone only when it leads a guild, or when every guild rests on it, as `ki-skills` and `ki-knowledge-graph` do. A skill that serves one guild joins that guild, however widely it is used. Keystone stays minimal; `ki-skills`' guilds standard has the rest of the guild rules.

## Boundaries

- **`ki-skills`** owns what a guild and a lead are, how skills are named and how membership is declared.
- **Each lead** owns its own guild: which members it has and when to use each.
- **`ki-repo-harness`** owns how a harness publishes its skills, including the catalogue in its `skills/README.md`, grouped by the same guilds.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain Keystone, where to start, the guilds and the joining rule without changing anything; offer a mode choice only in an interactive session.

### Mode AUDIT

Run `ki repo audit --skill ki-keystone --repo <repo>`. In a repository with no skill collection, every criterion is not applicable. In a harness, the audit checks that each skill declares its guild, that each guild has one lead in Keystone, and that the guild map is current; then review the joining rule and each lead's disclosure against [the standard](references/standard-keystone.md).

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-keystone --repo <repo> --dry-run`. The host may regenerate the rubric publication; regenerate the guild map with `ki dev skill generate ki-keystone`. This mode never moves a skill between guilds; that is decided, then declared in the skill's frontmatter.

### Mode EDUCATE

Name the guild and the lead for the work in hand, from the guild map, and say where a session starts. For a new skill, say which guild it joins and why, under the joining rule.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the guild purposes and the joining rule with the decisions they come from, then make and verify the smallest correction and regenerate the guild map.
