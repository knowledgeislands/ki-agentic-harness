# Exemplars

These illustrate [the Design System standard](standards-design-system.md) but do not add requirements.

## The 5G-EMERGE Phase 3 site

`5g-emerge-phase3` at `ceaf95344da3564693302a359d3a20959f0b0a19` is the pilot the standard was drawn from. Its design knowledge sits in the homes the standard names:

- **Values** - `apps/site/src/assets/css/tokens.css` composes every colour from per-theme hue anchors and per-mode lightness steps across six themes and two modes, with two meaning palettes outside the themes: status colours, and eight numbered calendar slots that each calendar names in its registry beside a short text code.
- **How** - `docs/guides/developer/site-design.md` gives principles, colour, type, layout, components, state, interaction, enhancement, words and a merge checklist, naming tokens rather than values.
- **Why** - `ADR-5GE-P3-001` records how colour is composed and that the calendar slots form a meaning palette.
- **Proof** - `apps/site/scripts/check-contrast.ts` measures every text and non-text pair, hue parity and every colour mix in all twelve theme and mode combinations; the smoke suite proves the calendars page is complete without script.
- **Design work** - the calendars page went from an owner's brief, through three directions on a design canvas, to a combined choice, and was consolidated into the guide, the ADR and the checks. Its work record holds the brief and the decision until the record is pruned.

It predates the standard in one way an adopting repository does not copy: it does not yet declare `[skills.ki-design-system]`, because no harness release carried the skill when the pilot ran. With the declaration below, it passes every mechanical criterion.

## A declaration

```toml
[skills.ki-design-system]
tokens = ["apps/site/src/assets/css/tokens.css"]
guide = "docs/guides/developer/site-design.md"
checks = ["apps/site/scripts/check-contrast.ts", "apps/site/tests/calendars.test.ts"]
```

## A state table in a guide

| State       | How it looks                         | Second carrier          |
| ----------- | ------------------------------------ | ----------------------- |
| Confirmed   | Solid fill                           | The status word         |
| Provisional | Hatched or outlined                  | The status word         |
| Past        | Marks stepped back, muted words      | "past" after the date   |
| Selected    | Foreground outline                   | `aria-expanded`         |
