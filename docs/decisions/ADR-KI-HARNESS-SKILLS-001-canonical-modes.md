# ADR-KI-HARNESS-SKILLS-001: AUDIT/CONFORM/INIT/REFRESH canonical modes (+ HELP)

**Date:** 2026-06-23

## Context

Each governance skill needed a consistent operating vocabulary — a caller asking a skill to "check" something, versus "fix" something, versus "keep it current" was getting different command names across skills, making the set hard to compose and hard to learn. Skills also had skill-specific modes that had no stable naming or ordering convention.

There was also no consistent way to ask a skill "what are you and how do I drive you?" without invoking one of its acting modes. A bare invocation (no mode) resolved differently per skill, and the answer — a skill's own name, purpose, invocation, modes, and off-ramps — is already declared in its frontmatter and headings, so re-authoring it as prose would only invite drift.

## Decision

Every governance skill exposes the universal four modes — **AUDIT**, **CONFORM**, **INIT**, **REFRESH** — using exactly those names, in alphabetical order. A skill may add skill-specific modes (e.g. OPTIMISE, operational note modes) but must expose the universal four first.

- **AUDIT** — run the checker, capture its output verbatim, then apply judgment criteria; report by location → criterion → fix.
- **CONFORM** — run AUDIT to get the fix list, then apply the fixes in place, then re-run AUDIT until clean.
- **INIT** — scaffold a new conformant artifact, or bring an off-standard one onto the floor from scratch. Its mechanical half is a per-skill `scripts/bootstrap.ts` (the INIT counterpart to `audit-*.ts`) that runs from the remote source with no skill installed, declares and triggers the skills the frontmatter `implies:`, and satisfies the self-sufficiency contract — vendored scripts, per-skill and repo-wide `ki:*` keys — set out as its own decision later in the reading order.
- **REFRESH** — re-anchor the standard to its sources on the skill's declared cadence.

Every governance skill also exposes a fifth universal mode, **HELP** — introspective rather than a governance action, so it sits apart from the acting four but sorts alphabetically alongside them (AUDIT, CONFORM, HELP, INIT, REFRESH) in any listing:

- **HELP** — explain the skill and stop. It surfaces the skill's name, one-line purpose, invocation, mode list, and off-ramps, and takes no action of its own.
  - **Generated, not authored.** HELP reads only what the `SKILL.md` already declares (frontmatter `name`, first sentence of `description`, `argument-hint`, `Mode` headings), so there is no per-skill guide prose to drift. The shared renderer (`scripts/skill-help.ts`) produces the block; it is the in-session mode's content and the CLI surface `ki:skills:help <name>`, and injects HELP into every skill's mode list so no skill authors it. A skill's only footprint is `help` in its `argument-hint` and the no-mode line in its Operating modes section.
  - **`help` / `-h` / `?` is pure explain** — never prompts, never acts. This is the headless-safe form (a subagent or CI run gets the explanation and stops).
  - **No mode given resolves to HELP, then routes** — it emits the same explanation, then, only in an interactive session, offers the mode choice via `AskUserQuestion`. This replaces the earlier "bare invocation → `AskUserQuestion`" behaviour: the caller now learns what the skill _is_ before being asked which mode to run.

**Process skills are exempt.** This decision scopes the universal four modes to **governance skills** (those that hold a standard). A **process skill** — one that drives an action or lifecycle rather than holding a standard ([ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md)) — does **not** carry AUDIT/CONFORM/INIT/REFRESH; its modes follow its own lifecycle (e.g. `ki-plan`'s `new`/`execute`/`done`/`status`, or `ki-recap`'s single mode). It exposes **HELP** only optionally. The skills rubric gates the four-mode and HELP requirements on "governance skill" accordingly (SHAPE-5, SHAPE-11), so a process skill passes with no relaxation of the checker.

The skills rubric enforces that every governance skill exposes this shape.

## Consequences

- A caller can invoke any governance skill with the same four top-level commands.
- Composition is predictable: one skill calls another's AUDIT as a named step; INIT starts the bootstrap chain and pulls the skills it implies.
- Skill-specific modes extend the vocabulary without replacing it; the universal four are always present.
- OPTIMISE remains an accepted optional extension for pushing a compliant artifact from the floor toward excellent.
- HELP gives every skill a uniform, non-acting "what are you" entry — the same block a human reads at the terminal (`ki-skills` renders it via `ki:skills:help`) and in-session — without a hand-maintained per-skill guide. Bare `ki:skills:help` prints a lean index of every skill; the hand-authored editorial catalogue (`docs/guides/user-guide/skill-catalogue.md`) stays authoritative, guarded for coverage by `ki:skills:help:check`.
