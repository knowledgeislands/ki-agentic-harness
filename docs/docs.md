# Documentation

The map of `docs/`, and how the guide relates to the other sources it deliberately does not link to.

## The guides

The **user guide** is the one-sitting account of what the harness is and how to use it. It is self-contained — it explains the harness on its own terms and does not send you into the decision records or the skill code to follow the narrative.

- [Overview](guides/user-guide/overview.md) — what the harness is, what it does for its owner, how the parts fit.
- [The skills](guides/user-guide/skills.md) — what a skill is, the six clusters, their interdependencies, and the shared governance-skill shape.
- [The skill catalogue](guides/user-guide/skill-catalogue.md) — every skill, one by one, grouped by cluster.
- [Onboarding](guides/user-guide/onboarding.md) — bringing a repo under governance: the bootstrap chain, the four modes, and the greenfield / legacy / remote-run flows.
- [Skill design](guides/user-guide/skill-design.md) — how the skills fit: where they don't overlap, the three knowledge loops, and the principles across the set.
- [Installation](guides/user-guide/installation.md) — installing, using, and linking the skills, and the development toolchain.

## How the guide relates to other sources

The guide is the _how it fits and how to use it_ layer. When you need the layers underneath — the _why_, the _what_, or the code itself — they live here:

- **Decisions — the _why_.** The Decision Records behind the design are in [`docs/decisions/`](decisions/) (governed by the `ki-decision-records` standard). The guide names the relevant DR by ID (e.g. `ADR-KI-HARNESS-SKILLS-006`); the record itself is here.
- **Feature definitions — the _what_.** The behaviour-level specification of what the harness does is in [`docs/features/`](features/index.md).
- **Plans — the _how, sequenced_.** In-flight and past implementation plans are in [`docs/plans/`](plans/README.md); the forward view is the [roadmap](../ROADMAP.md).
- **The skills themselves — the code.** The guide refers to each skill by its `name` (e.g. `ki-kb`); the skill directories, `SKILL.md` bodies, references, and checkers are under [`skills/`](../skills/).
- **The Knowledge Islands concept.** The knowledge-base model several skills assume is a project in its own right — [knowledgeislands.info](https://knowledgeislands.info).
