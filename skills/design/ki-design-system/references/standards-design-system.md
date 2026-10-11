# Design system standard

This standard defines how a Knowledge Islands repository keeps the knowledge behind its user interface: where each kind of design knowledge lives, how a design question moves from a brief to a settled rule, and what keeps those rules true as the interface changes. It governs the method, not the content: a repository's own design guide, decisions and checks say what its interface looks like. The hosted rubric enforces the mechanical criteria; the generated [rubric](rubric.md) publishes every criterion, and [exemplars](exemplars.md) point at a conforming repository. It was established by the 5G-EMERGE Phase 3 calendars page in October 2026.

## Contents

- [Scope and boundary](#scope-and-boundary)
- [Where design knowledge lives](#where-design-knowledge-lives)
- [The token source](#the-token-source)
- [The design guide](#the-design-guide)
- [Design Specifications](#design-specifications)
- [Design Decision Records](#design-decision-records)
- [Design work, from brief to rule](#design-work-from-brief-to-rule)
- [Checks](#checks)
- [The floor](#the-floor)
- [Projections](#projections)
- [Configuration](#configuration)
- [Judgment boundary](#judgment-boundary)

## Scope and boundary

A design system here is the set of visual and interaction rules one product surface follows: its colours, type, layout, components, how it shows state, and how it behaves for a keyboard, a screen reader or a reader without script. Any repository with a user interface may adopt it: a website, an application or a documentation site. A repository adopts it by declaring `[skills.ki-design-system]` in `.ki.toml`.

| Concern                                                         | Owner                  |
| --------------------------------------------------------------- | ---------------------- |
| Where design knowledge lives, design work, design checks        | **this skill**         |
| Visual references and inspiration for a new direction           | `ki-design-inspiration` |
| The shape of a new Project, Initiative or cross-cutting model   | `ki-design-loop`       |
| How tokens are built into an Eleventy and Tailwind site         | `ki-repo-website-content` |
| The format of a guide, Specification, Decision Record or record | `ki-guides`, `ki-specs`, `ki-decision-records`, `ki-work-roadmap` |
| Living diagrams of the system                                   | `ki-diagrams`          |
| Prose style                                                     | `ki-authoring`         |

This standard routes design knowledge into those instruments. It never forks their formats: a design guide is an ordinary guide, a design Specification an ordinary Specification, and a design decision an ordinary Decision Record.

## Where design knowledge lives

Each kind of design knowledge has one home, so a reader knows where to look and nothing is said twice.

| Question                          | Home                                                       | Instrument               |
| --------------------------------- | ---------------------------------------------------------- | ------------------------ |
| What is the value?                | The token source, such as `tokens.css`                     | Code                     |
| How do I build a page?            | The design guide, under `docs/guides/<audience>/`          | `ki-guides`              |
| What must the interface do?       | Design Specifications, under `docs/specs/`                 | `ki-specs`               |
| Why is it this way?               | Design Decision Records, under `docs/decisions/`           | `ki-decision-records`    |
| When will it change?              | Design work records, under `docs/roadmap/`                 | `ki-work-roadmap`        |
| Is it still true?                 | Checks, in the repository's test and check scripts         | Code                     |

The rule for every home is the same: state a thing once, in its home, and elsewhere name it. A guide names a token rather than repeating its value; a Decision Record states a decision rather than restating the guide's procedure; a check enforces a rule rather than redefining it.

## The token source

The token source is the canonical home of every design value: colour, type, spacing, radius, shadow, motion and breakpoints where the platform allows. Every other artefact, including the design guide, names a token and never repeats its value, because a repeated value drifts the first time the token changes. A value the token source does not yet hold may be stated in the guide until it gets a token; colour always has one.

- Values are composed, not listed, wherever the platform allows it: a theme supplies hue and chroma anchors, a mode supplies lightness steps, and each colour is computed from them, so a theme or mode cannot drift on one token alone.
- A colour that carries meaning, such as a status or a category, belongs to a meaning palette that does not change with the reader's chosen theme.
- A categorical palette, one colour per category, assigns numbered slots. The category's registry names its slot and a short text code, and the code appears wherever the colour does.
- A repository with several token files declares each one. A generated token file is acceptable when its generator is the declared source.

## The design guide

The design guide is the practical how: the rules a maintainer follows to design or change a page so it looks and behaves like the rest. It is an ordinary guide under `ki-guides`, in the audience folder of the people who build the interface, usually `docs/guides/developer/`, and listed in the collection's `docs/guides/README.md`. A product with several distinct surfaces may keep one guide per surface.

`ki-guides` audits the guide's form alongside this skill: its outcome-first opening, its audience folder and its self-containment. So the guide names a Decision Record or Specification by its identifier and never links it, links sibling guides freely, and links any code it explains, such as the token source and the check scripts. This skill audits what the guide says, not how it is shaped.

The guide states current rules in the present tense. It holds no history and no rationale beyond the one clause a reader needs to apply a rule well; the reason lives in a Decision Record the guide may name. It repeats no token value. A guide's sections follow the reader's work, and a complete guide covers:

1. **Principles** - the few rules every page follows, each one checkable or reviewable.
2. **Colour** - which tokens to use for chrome, meaning and selection, and how a categorical palette is assigned.
3. **Type** - the scale by role, weights and numeric styles.
4. **Layout** - page structure, widths, breakpoints and spacing.
5. **Components** - the reusable pieces, each with its name, where it lives and when to use it.
6. **State** - how each state is shown, with its second, non-colour carrier.
7. **Interaction and accessibility** - keyboard, focus, roles and touch targets.
8. **Enhancement** - what is rendered without script and what script adds.
9. **Words** - the voice and terms of interface text.
10. **Before you merge** - the checks and the manual review a change needs. Where the collection has a definition-of-done guide, this section holds the design steps only and that guide links it.

A section the product does not need may be left out. [The guide skeleton](../assets/design-guide.md) gives the headings without content.

## Design Specifications

A design rule becomes a Specification when it is a stable, verifiable behaviour that something outside the guide depends on: a contrast threshold across every theme and mode, a rule that no meaning is carried by colour alone, a rule that a page's content is complete without script, or a keyboard behaviour. Its verification names the check that proves it. A rule that is only a convention for maintainers, such as a spacing step, stays in the guide.

Do not write a speculative design Specification to make the system look complete. Where a guide rule has no Specification and something depends on it, route the gap to `ki-specs`.

## Design Decision Records

A design decision gets a Decision Record when a future maintainer could reasonably undo it without knowing why it was made: how tokens are composed, why a category keeps its colour across themes, why a provisional status is never drawn solid, or why content is rendered at build time.

- Use `ADR-` for the structure of the design system: token architecture, theming axes, the component model.
- Use `PDR-` for how the product presents itself to its users: state encodings, density, what is shown first.
- Before writing one, find the record that already owns the concern and refine it in place. A record states the decision as it stands, without rejected options, history or a link to working material; `ki-decision-records` owns its shape.

## Design work, from brief to rule

A design question that changes what readers see moves through six stages. Each produces something, and only the last two leave anything durable.

1. **Brief.** The purpose, the audience and their devices, the real data the design must hold (including its awkward cases: empty, provisional, imprecise), the constraints, what success looks like, and the open questions. The owner writes or approves it.
2. **Options.** Two or three directions that differ in their trade-offs, not only in style, drawn on the real tokens and the real data. Each names what it gains and what it costs against the brief. `ki-design-inspiration` may supply references.
3. **Decision.** The owner chooses, combines or rejects. The choice and its reasons are recorded in the work record's Discussion.
4. **Build.** The chosen design is built in the repository against the guide and checks.
5. **Consolidate.** The outcome moves to its homes: new values to the token source, new rules to the design guide, new stable behaviour to a Specification, a new or changed decision to a Decision Record, and every new checkable rule to a check.
6. **Retire.** The brief, option boards, canvases and screenshots are working material. Once consolidated, they are not kept as documents: the work record that summarised them is pruned with the rest of the roadmap, and Git history keeps what was considered.

A design question about the shape of a Project or a model that several repositories share follows `ki-design-loop` instead. A small change that needs no options, such as applying an existing component, goes straight to build and consolidate.

## Checks

A design rule that a machine can check has a check, and the guide's merge section names it. Rules that need a person are listed there as review steps. Checks fall into four groups:

- **Token checks** - contrast for every text and non-text pair in every theme and mode, hue held across modes, every colour mix measured or recorded with a reason, every categorical slot covered, and no theme or mode changing layout, which `ki-repo-website-content` already requires of a content site.
- **Content checks** - the page's facts and links are present without script; a registry and its rendered pages agree.
- **Behaviour checks** - keyboard operation, focus handling and an automated accessibility scan of each view.
- **Visual checks** - screenshots of key pages across themes, modes and widths, compared on change.

A repository declares the files that hold its design checks. A check that cannot run in the repository's own test or check commands is a review step, not a check.

## The floor

Every design system that adopts this standard meets four requirements, whatever it looks like:

1. **One home for values.** Every design value comes from the token source.
2. **Readable contrast.** Text meets WCAG 2.2 AA (4.5:1, or 3:1 for large text) and meaningful non-text marks meet 3:1, in every theme and mode the product offers, and a check proves it.
3. **Meaning is never carried by colour alone.** Each meaningful colour has a second carrier: a word, a code, a shape or a line style.
4. **Keyboard parity.** Everything a pointer can do, a keyboard can do, with visible focus.

## Projections

A design tool outside the repository, such as a design-system artifact, a Figma library or a design canvas, is a projection of the token source and the guide. It is refreshed from them and never edited as the source. The guide names each projection and where it lives; the projection carries the date and source revision it was last refreshed from, so the guide holds no state that dates. A projection that disagrees with the token source is stale, whatever its date.

## Configuration

A repository declares the skill and its locations in `.ki.toml`:

```toml
[skills.ki-design-system]
tokens = ["apps/site/src/assets/css/tokens.css"]
guide = "docs/guides/developer/site-design.md"
checks = ["apps/site/scripts/check-contrast.ts", "apps/site/tests/calendars.test.ts"]
```

| Key      | Type             | Meaning                                                                 |
| -------- | ---------------- | ----------------------------------------------------------------------- |
| `tokens` | list of paths    | The token source files, repository-relative; at least one              |
| `guide`  | path             | The design guide, a Markdown file below `docs/guides/<audience>/`       |
| `checks` | list of paths    | Files that hold design checks; at least one                             |

All three keys are required, and no other key is recognised.

## Judgment boundary

The checker can prove that the declared files exist, that the guide names its token sources, and that the guide repeats no literal colour value. It cannot prove that knowledge sits in its right home, that the floor holds on every page, that every checkable rule has a check, or that working material has been consolidated and retired. Review asks those questions, page by page and rule by rule.
