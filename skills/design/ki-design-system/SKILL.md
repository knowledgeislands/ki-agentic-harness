---
name: ki-design-system
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: ['.ki.toml']
description: >
  Create, audit or refresh how a repository keeps its user-interface design: the token source, the design
  guide, design Specifications and Decision Records, the checks, and design work from brief to rule. Use for
  design-system method; use `ki-design-inspiration` for visual references and `ki-work-design` for project shape.
argument-hint: 'audit [dir] | conform [dir] | help | educate [dir] | refresh'
---

# Knowledge Islands Design System standard

You are applying the **Knowledge Islands Design System standard** - one way to keep the knowledge behind a user interface: values in the token source, the practical how in a design guide, stable behaviour in Specifications, the why in Decision Records, and checks that keep them true. Read [the Design System standard](references/standards-design-system.md) before establishing, auditing or changing a design system; [the rubric](references/rubric.md) publishes its checkable criteria, [exemplars](references/exemplars.md) point at a conforming repository, and [sources](references/sources.md) records its provenance.

## What this skill owns

1. **The placement model** - which home holds each kind of design knowledge: values, how, what, why, when and proof.
2. **The design work method** - brief, options, decision, build, consolidate and retire, and what each stage leaves behind.
3. **The floor** - four requirements every adopting design system meets: one home for values, readable contrast, meaning never by colour alone, and keyboard parity.
4. **The mechanical checker** - `ki repo audit --skill ki-design-system` checks the `.ki.toml` declaration, that the token sources, design guide and design checks exist, that the guide names its token sources, and that the guide repeats no literal colour value.

A repository's own design guide, tokens and decisions stay with that repository. The formats of guides, Specifications, Decision Records and work records stay with `ki-guides`, `ki-specs`, `ki-decision-records` and `ki-work-roadmap`; token build mechanics for content sites stay with `ki-repo-website-content`.

## Operating modes

Carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH**. Invoked as `help` / `-h` / `?`, it explains itself and stops - the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows.

### Mode EDUCATE

→ Read [references/mode-educate.md](references/mode-educate.md)

### Mode AUDIT

→ Read [references/mode-audit.md](references/mode-audit.md)

### Mode CONFORM

→ Read [references/mode-conform.md](references/mode-conform.md)

### Mode REFRESH

→ Read [references/mode-refresh.md](references/mode-refresh.md)

## Notes

- **Method, not content** - this skill never prescribes how an interface looks. A repository's guide, tokens and decisions do that; the skill says where they live and how they stay true.
- **Design work** - when a request changes what readers see, follow the stages in [Design work, from brief to rule](references/standards-design-system.md#design-work-from-brief-to-rule): brief, options and an owner's decision come before the build, and consolidation into the guide, Specifications, Decision Records and checks comes after it.
- **Projections** - a design tool outside the repository, such as a design-system artifact or a canvas, is refreshed from the token source and the guide and is never edited as the source.
- The `ki` host owns findings, dry-run publication, reporting, and post-conform verification; judgment aspects are counted as unevaluated rather than emitted as synthetic mechanical findings.
