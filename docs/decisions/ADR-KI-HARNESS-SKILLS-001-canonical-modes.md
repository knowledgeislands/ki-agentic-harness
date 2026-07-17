# ADR-KI-HARNESS-SKILLS-001: AUDIT/CONFORM/EDUCATE/REFRESH canonical modes (+ HELP)

**Date:** 2026-06-23

## Context

Each governance skill needed a consistent operating vocabulary — a caller asking a skill to "check" something, versus "fix" something, versus "keep it current" was getting different command names across skills, making the set hard to compose and hard to learn. Skills also had skill-specific modes that had no stable naming or ordering convention.

There was also no consistent way to ask a skill "what are you and how do I drive you?" without invoking one of its acting modes. A bare invocation (no mode) resolved differently per skill, and the answer — a skill's own name, purpose, invocation, modes, and off-ramps — is already declared in its frontmatter and headings, so re-authoring it as prose would only invite drift.

## Decision

Every governance skill exposes the universal four modes — **AUDIT**, **CONFORM**, **EDUCATE**, **REFRESH** — using exactly those names, in alphabetical order. A skill may add skill-specific modes (e.g. OPTIMISE, operational note modes) but must expose the universal four first.

- **AUDIT** — run the checker, capture its output verbatim, then apply judgment criteria; report by location → criterion → fix.
- **CONFORM** — run AUDIT to get the fix list, then apply the fixes in place, then re-run AUDIT until clean.
- **EDUCATE** — bring the skill's governance into being in a target: scaffold a new conformant artifact, or bring an off-standard one onto the floor from scratch. Its mechanical half is a per-skill `scripts/educate.ts` (the EDUCATE counterpart to `audit-*.ts`, a thin delegator into the central chain engine) that runs from the remote source with no skill installed, declares and triggers the skills the frontmatter `implies:`, and satisfies the self-sufficiency contract — vendored scripts, per-skill and repo-wide `ki:*` keys — set out as its own decision later in the reading order. **EDUCATE is mandatory for every governance skill, even when thin**: a skill that scaffolds no standalone artifact still has an EDUCATE, whose job is to vendor the skill's declared mechanical unit (the frontmatter `vendors:` declaration) into the target's `.ki-meta/` via the chain.
- **REFRESH** — re-anchor the standard to its sources on the skill's declared cadence. Its write target is always the skill's own canonical files under `skills/<name>/` in `ki-agentic-harness` — so it is only executable inside that repo. Invoked from a repo where the skill is merely vendored, REFRESH stops immediately, names the harness as where to run it, and, for a pattern recurring across bases rather than a one-off, points at `ki-kb`'s IMPROVE mode instead — the base-side half of the same promotion loop.

Every governance skill also exposes a fifth universal mode, **HELP** — introspective rather than a governance action, so it sits apart from the acting four but sorts alphabetically alongside them (AUDIT, CONFORM, HELP, EDUCATE, REFRESH) in any listing:

- **HELP** — explain the skill and stop. It surfaces the skill's name, one-line purpose, invocation, mode list, and off-ramps, and takes no action of its own.
  - **Generated, not authored.** HELP reads only what the `SKILL.md` already declares (frontmatter `name`, first sentence of `description`, `argument-hint`, `Mode` headings), so there is no per-skill guide prose to drift. The shared renderer (`skills/keystone/ki-bootstrap/scripts/skill-help.ts`) produces the block; it is the in-session mode's content and the CLI surface `ki:skills:help <name>`, and injects HELP into every skill's mode list so no skill authors it. A skill's only footprint is `help` in its `argument-hint` and the no-mode line in its Operating modes section.
  - **`help` / `-h` / `?` is pure explain** — never prompts, never acts. This is the headless-safe form (a subagent or CI run gets the explanation and stops).
  - **No mode given resolves to HELP, then routes** — it emits the same explanation, then, only in an interactive session, offers the mode choice via `AskUserQuestion`. This replaces the earlier "bare invocation → `AskUserQuestion`" behaviour: the caller now learns what the skill _is_ before being asked which mode to run.

Beyond the universal five, two **core-optional** modes have fixed meanings wherever they appear, and router skills carry their own operational verbs:

- **NEW** — author one **new instance** into a collection the skill governs (a decision record, a feature requirement, an activity note, a live-artifact pair). It appears only in collection skills, presupposes EDUCATE has already established the collection, and is never a substitute for EDUCATE: a collection skill exposes both.
- **OPTIMISE** — push an already-compliant artifact from the standard floor toward excellent.
- **Operational modes** — a router skill's own verbs (note operations, stream lifecycle steps and the like) extend the vocabulary after the universal set, never replacing it.

A mode name means the same thing in every skill that carries it — the contracts above are the authoritative per-mode definitions the rubric enforces.

**Heading standard.** Each governance skill presents its modes under a single `## Operating modes` H2 — the home for the shared no-mode/HELP intro — with each mode as a `### Mode <NAME>` H3, or, for router skills with many operational verbs, a `| Mode | … |` dispatch table inside that section. Every verb in the skill's `argument-hint` appears in that body section.

**Process skills are exempt.** This decision scopes the universal four modes to **governance skills** (those that hold a standard). A **process skill** — one that drives an action or lifecycle rather than holding a standard (the taxonomy in [ADR-KI-HARNESS-SKILLS-006](ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md), later in the reading order) — does **not** carry AUDIT/CONFORM/EDUCATE/REFRESH; its modes follow its own lifecycle (e.g. `ki-plan`'s `new`/`execute`/`done`/`status`, or `ki-recap`'s single mode). It exposes **HELP** only optionally. The skills rubric gates the four-mode and HELP requirements on "governance skill" accordingly, so a process skill passes with no relaxation of the checker.

The skills rubric enforces that every governance skill exposes this shape.

## Consequences

- A caller can invoke any governance skill with the same four top-level commands.
- Composition is predictable: one skill calls another's AUDIT as a named step; EDUCATE starts the bootstrap chain and pulls the skills it implies.
- Skill-specific modes extend the vocabulary without replacing it; the universal four are always present.
- OPTIMISE remains an accepted optional extension for pushing a compliant artifact from the floor toward excellent.
- HELP gives every skill a uniform, non-acting "what are you" entry — the same block a human reads at the terminal (`ki-skills` renders it via `ki:skills:help`) and in-session — without a hand-maintained per-skill guide. Bare `ki:skills:help` prints a lean index of every skill; the hand-authored editorial catalogue (`docs/guides/user-guide/skill-catalogue.md`) stays authoritative, guarded for coverage by `ki:skills:help:check`.
