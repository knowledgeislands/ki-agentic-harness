# Tracked sources

**Refresh:** external-spec · quarterly

[The Design System standard](standards-design-system.md) is Knowledge Islands house policy, derived from the 5G-EMERGE Phase 3 calendars page of October 2026 and adopted as a harness standard by `KI-HARNESS-GOV-173`. The floor cites WCAG; the placement model rests on the harness's own documentation standards.

| Source                                                                                       | Bears on                                                   | last reviewed |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                    | The floor: 1.4.1 Use of Color, 1.4.3 and 1.4.11 contrast, 2.1.1 Keyboard, 2.4.7 Focus Visible | 2026-10-11    |
| [The Guides standard](../../../authoring/ki-guides/references/standards-guides.md)          | The design guide's home and form                           | 2026-10-11    |
| [The Specifications standard](../../../authoring/ki-specs/references/standards-specs.md)    | When a design rule becomes a Specification                 | 2026-10-11    |
| [The Decision Records standard](../../../authoring/ki-decision-records/references/standards-decision-records.md) | Prefix choice and the living-record rule for design decisions | 2026-10-11    |
| [The design-loop standard](../../../keystone/ki-work/references/standards-work-design.md) | The boundary with shape-level design, and temporary artefacts | 2026-10-11    |
| `5g-emerge-phase3` at `ceaf95344da3564693302a359d3a20959f0b0a19`                             | The pilot: tokens, guide, decision record and checks       | 2026-10-11    |
| An annotated design board for a knowledge-base viewer, 2 and 3 November 2026                | The annotated board: numbering, shells and components, region codes, measuring, and the first board tooling | 2026-11-03    |
| Claude Design's note "Designing at three levels", from the Cairn Wayfinder design meeting of 13 November 2026, in Kris's Cairn store | The design levels, how a round runs, the onion of shells, and the `S` codes | 2026-11-14    |
| The Cairn Wayfinder's [component library](https://github.com/knowledgeislands/apps-cairn.local/blob/main/docs/design/ui/wayfinder-components.md) at `c096f3d` | The components document: atomic levels, and a row per component with its signature, owns, does not own and hand-offs | 2026-11-14    |
| The Cairn summit's changes 20 and 25, in Kris's Cairn store                                  | DESIGN-LEVELS (13 November 2026), ATOMIC-DESIGN and COMPONENT-LIBRARY (14 November 2026) | 2026-11-14    |

## Last review

- 2026-11-14 - Under GUILDS-REMIT in the Cairn summit's change 25: ATOMIC-DESIGN and COMPONENT-LIBRARY became the component library section and DSYS-9; DESIGN-LEVELS folded in the three-levels note as the design levels standard and DSYS-10, put the onion of shells and each shell's state in the design-system standard, and added the `S` prefix to the annotated board and its script. The level names follow Brad Frost's atomic design, with tokens added beneath atoms; it was not fetched.
- 2026-11-03 - Added the annotated board from its first use: Review as stage 0 of design work, the board as a projection of the running interface, DSYS-8 asking whether it was refreshed, and `scripts/annotate-board.ts`, generalised from the first board's tooling, with its pages, selectors and canvas format left to each site.
- 2026-10-11 - Created from the 5G-EMERGE Phase 3 pilot. Confirmed the placement model against the current Guides, Specifications, Decision Records and design-loop standards, and the floor against WCAG 2.2.
