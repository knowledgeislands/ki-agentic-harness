<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — repository design-system knowledge

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-design-system --write`.

Line-by-line criteria for auditing ki-design-system. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [DSYS — design system](#dsys--design-system)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## DSYS — design system

→ [standard](standards-design-system.md#where-design-knowledge-lives)

A repository's design knowledge sits in its homes and stays true through checks.

- **DSYS-1 [M] — the declaration is valid and its token sources exist** — `[skills.ki-design-system]` in `.ki.toml` declares `tokens`, `guide` and `checks` and no other key, and every declared token source is a regular file inside the repository. (standards-design-system.md#configuration, standards-design-system.md#the-token-source)
  - _Remediation:_ diagnostic — Declare `tokens`, `guide` and `checks` under `[skills.ki-design-system]`, remove any other key, and point `tokens` at the files that hold the design values, then rerun the audit.
- **DSYS-2 [M] — the design guide is a guide in an audience folder** — The declared `guide` is a regular Markdown file inside the repository, below `docs/guides/` in an audience folder. (standards-design-system.md#the-design-guide)
  - _Remediation:_ diagnostic — Write the design guide in the audience folder of the people who build the interface, such as `docs/guides/developer/`, from the skill's guide skeleton, declare its path as `guide`, then rerun the audit.
- **DSYS-3 [M] — the declared design checks exist** — At least one design check is declared as `checks`, and every declared check is a regular file inside the repository. (standards-design-system.md#checks)
  - _Remediation:_ diagnostic — Add at least a contrast check over every theme and mode the product offers, declare the files that hold design checks as `checks`, then rerun the audit.
- **DSYS-4 [M] — the guide names its token sources** — The design guide names every declared token source, by its repository path or its file name, so a reader knows where each value lives. (standards-design-system.md#the-design-guide, standards-design-system.md#the-token-source)
  - _Remediation:_ diagnostic — Name each token source in the guide's opening or Colour section, then rerun the audit.
- **DSYS-5 [M + J] — the guide repeats no literal colour value** — The design guide contains no hex colour and no colour function whose first argument is a number; it names tokens, whose values live in the token source. (standards-design-system.md#the-token-source, standards-design-system.md#the-design-guide)
  - _Remediation:_ diagnostic — Replace each literal colour with the name of the token that holds it, adding the token first where none exists, then rerun the audit.
  - _Evidence scope:_ Each value DSYS-5 reports, read in its sentence or code block.
  - _Review prompt:_ Does the value repeat what a token holds, or is it an illustration that names no token, such as a colour in a third-party example the guide quotes?
  - _Outcomes:_ conforming; gap
  - _Conforming guidance:_ A repeated value is a gap: name the token instead. An illustration that names no design value is conforming; prefer rewriting it to name a token where one exists.
- **DSYS-6 [J] — each kind of design knowledge sits in its home** — Values live in the token source, practical rules in the design guide, stable behaviour that something depends on in a Specification, rationale in a Decision Record, and future design work in a work record; nothing is stated in two homes. (standards-design-system.md#where-design-knowledge-lives)
  - _Evidence scope:_ The token sources, the design guide, design Specifications, design Decision Records and open design work records.
  - _Review prompt:_ Does the guide carry rationale, history or values that belong elsewhere? Does a Decision Record restate guide procedure or list rejected options? Is there stable, verifiable design behaviour that something depends on with no Specification? Is anything said in two homes?
  - _Outcomes:_ conforming; move; gap
  - _Conforming guidance:_ Move each misplaced statement to its home, preserving the conclusion before removing the source, and route a missing Specification to `ki-specs` and a missing decision to `ki-decision-records`. Do not change what the interface does.
- **DSYS-7 [J] — the floor holds and every checkable rule has a check** — The interface meets the floor: one home for values, readable contrast proved by a check in every theme and mode, meaning never carried by colour alone, and keyboard parity. Every rule in the guide that a machine can check has a check its merge section names. (standards-design-system.md#the-floor, standards-design-system.md#checks)
  - _Evidence scope:_ The interface's pages in each theme, mode and width it supports, the design guide and the declared checks.
  - _Review prompt:_ Does every meaningful colour have a second carrier? Can every action be done with the keyboard, with visible focus? Does the contrast check cover every theme and mode offered? Which guide rules could a machine check but do not have a check?
  - _Outcomes:_ conforming; gap
  - _Conforming guidance:_ Record each floor failure as a gap against the page and the rule. For each checkable rule without a check, add the check or list the rule as a review step in the guide.
- **DSYS-8 [J] — working material is retired and projections follow the source** — Briefs, option boards, canvases and screenshots from finished design work are consolidated and not kept as durable documents, and every design tool outside the repository is refreshed from the token source and the guide. (standards-design-system.md#design-work-from-brief-to-rule, standards-design-system.md#projections)
  - _Evidence scope:_ Documentation folders and assets that hold design working material, closed design work records, and the projections the guide lists.
  - _Review prompt:_ Is any brief, option board or canvas kept as a document after its outcome reached the guide, a Specification or a Decision Record? Does any projection, such as a design-system artifact or a design library, disagree with the token source?
  - _Outcomes:_ conforming; retire; refresh
  - _Conforming guidance:_ Confirm the outcome is consolidated, then remove the working material; Git history keeps it. Refresh a stale projection from the token source and record the date in the guide.
