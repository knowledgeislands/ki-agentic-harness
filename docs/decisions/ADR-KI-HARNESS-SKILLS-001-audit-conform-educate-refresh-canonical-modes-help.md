---
id: ADR-KI-HARNESS-SKILLS-001
title: 'AUDIT/CONFORM/EDUCATE/REFRESH canonical modes (+ HELP)'
date: 2026-08-13
status: current
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-SKILLS-001: AUDIT/CONFORM/EDUCATE/REFRESH canonical modes (+ HELP)

## Context

Each governance skill needed a consistent operating vocabulary — a caller asking a skill to "check" something, versus "fix" something, versus "keep it current" was getting different command names across skills, making the set hard to compose and hard to learn. Skills also had skill-specific modes that had no stable naming or ordering convention.

There was also no consistent way to ask a skill "what are you and how do I drive you?" without invoking one of its acting modes. A bare invocation (no mode) resolved differently per skill, and the answer — a skill's own name, purpose, invocation, modes, and off-ramps — is already declared in its frontmatter and headings, so re-authoring it as prose would only invite drift.

## Decision

Every governance skill exposes the four universal acting modes — **AUDIT**, **CONFORM**, **EDUCATE**, **REFRESH** — using exactly those names, in alphabetical order. A skill may add skill-specific modes (e.g. OPTIMISE, operational note modes) but must expose the universal four first.

- **AUDIT** — run the checker, capture its output verbatim, then apply judgment criteria; report by location → criterion → fix.
- **CONFORM** — run AUDIT to get the fix list, then apply the fixes in place, then re-run AUDIT until clean.
- **EDUCATE** — explain or bring the skill's governance into being in a target. The installed `ki` host exposes the selected skill's structured catalogue and owns generic execution; a skill may describe authored scaffolding, but it does not ship a private executor, vendor a runner, or create a package alias merely to expose this mode. **EDUCATE is mandatory for every governance skill, even when it scaffolds no standalone artifact**: in that case it explains the standard, boundary, and path to a conformable subject without inventing a write.
- **REFRESH** — re-anchor the standard to its sources on the skill's declared cadence. Its write target is always the skill's own canonical files under `skills/<name>/` in `ki-agentic-harness` — so it is only executable inside that repo. Invoked from a repo where the skill is merely vendored, REFRESH stops immediately, names the harness as where to run it, and, for a pattern recurring across bases rather than a one-off, points at `ki-repo-kb`'s IMPROVE mode instead — the base-side half of the same promotion loop.

Every governance skill also exposes a required universal non-acting entry point, **HELP**. HELP is not a fifth mode: it explains the capability and stops rather than performing or governing an operation.

- **HELP** — explain the skill and stop. It surfaces the skill's name, one-line purpose, invocation, mode list, and off-ramps, and takes no action of its own.
  - **Derived from the skill, not a second guide.** HELP uses the skill's own frontmatter and Operating modes section: `name`, purpose and selection cues from `description`, invocation from `argument-hint`, named modes, and off-ramps. Each `SKILL.md` carries enough concise prose to answer those questions in-session. There is no separate HELP renderer, package alias, or CLI index. Cross-skill discovery instead uses the Harness's generated capability catalogue and authored skills-by-outcome guide.
  - **`help` / `-h` / `?` is pure explain** — never prompts, never acts. This is the headless-safe form (a subagent or CI run gets the explanation and stops).
  - **No mode given resolves to HELP, then routes** — it emits the same explanation, then, only in an interactive session, offers the mode choice via `AskUserQuestion`. This replaces the earlier "bare invocation → `AskUserQuestion`" behaviour: the caller now learns what the skill _is_ before being asked which mode to run.

Beyond the four universal modes and the HELP entry point, two **core-optional** modes have fixed meanings wherever they appear, and router skills carry their own operational verbs:

- **NEW** — author one **new instance** into a collection the skill governs (a decision record, a feature requirement, an activity note, a live-artifact pair). It appears only in collection skills, presupposes EDUCATE has already established the collection, and is never a substitute for EDUCATE: a collection skill exposes both.
- **OPTIMISE** — push an already-compliant artifact from the standard floor toward excellent.
- **Operational modes** — a router skill's own verbs (note operations, stream lifecycle steps and the like) extend the vocabulary after the universal set, never replacing it.

A mode name means the same thing in every skill that carries it — the contracts above are the authoritative per-mode definitions the rubric enforces.

**Heading standard.** Each governance skill presents its modes under a single `## Operating modes` H2 — the home for the shared no-mode/HELP intro — with each mode as a `### Mode <NAME>` H3, or, for router skills with many operational verbs, a `| Mode | … |` dispatch table inside that section. Every verb in the skill's `argument-hint` appears in that body section.

**Process skills are exempt.** This decision scopes the four universal acting modes to **governance skills** (those that hold a standard). A **process skill** — one that drives an action or lifecycle rather than holding a standard — does **not** carry AUDIT/CONFORM/EDUCATE/REFRESH; its modes follow its own lifecycle, such as `ki-next` queue operations, `ki-plan` readiness shaping, `ki-implement` delivery, `ki-accept` closure, or `ki-recap` session recap. It exposes the **HELP** entry point only optionally. The skills rubric gates the four-mode and HELP-entry-point requirements on "governance skill" accordingly, so a process skill passes with no relaxation of the checker.

The skills rubric enforces that every governance skill exposes this shape.

## Consequences

- A caller can invoke any governance skill with the same four top-level commands.
- Composition is predictable: a skill declares required prerequisites in `ki-depends-on`, and the host executes compatible operations in dependency order.
- Skill-specific modes extend the vocabulary without replacing it; the universal four are always present.
- OPTIMISE remains an accepted optional extension for pushing a compliant artifact from the floor toward excellent.
- The HELP entry point gives each governance skill a uniform, non-acting "what are you" route in-session without a second per-skill guide. The generated Harness capability catalogue supplies the exact cross-skill inventory and declared dependency facts; the authored skills-by-outcome guide supplies task-oriented selection without duplicating all entries.
