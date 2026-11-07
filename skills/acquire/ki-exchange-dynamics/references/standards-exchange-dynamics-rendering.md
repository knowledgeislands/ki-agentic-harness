# Exchange dynamics rendering standard

How an exchange dynamics analysis is presented. Read [the exchange dynamics standard](standards-exchange-dynamics.md) first: a rendering reads the analysis and nothing else, adds no reading of its own, and changes only with a fresh analysis. The same analysis can be rendered as a one-page infographic, a Markdown report or a PDF, and the reference layout below can be reproduced by any rendering model.

## Contents

1. [Reference layout](#reference-layout)
2. [Colour](#colour)
3. [Variants](#variants)
4. [Renderers](#renderers)
5. [Design decisions](#design-decisions)
6. [Interactive view](#interactive-view)

## Reference layout

A wide landscape page in three columns.

| Column | Holds |
| --- | --- |
| Left, full height: messages and analysis | The chronology: for each event its numbered marker, speaker, timestamp, key quotation and a one-line analysis of what it contributes. Each marker carries the colour of the matching point on the graph |
| Centre: dynamics | The tension trajectory, with event numbers along the horizontal axis and tension 0 to 10 up the vertical, numbered points joined in order and coloured as their markers; sentiment as a separate secondary line or marker shape, never merged into tension. Below it the phases, each with its event range and a short description, then the key takeaways |
| Right: participants | A card for each participant: the avatar only where one was supplied and is appropriate to show, otherwise initials; the name or identifier; a short communication-style label; an evidence-based description of their role; and an optional relative contribution indicator. The overall read closes the column |

Never invent a photographic likeness or replace a missing avatar with a fictional portrait. Numeric scores are shown only where they help the reader understand, as the analysis's `rendering.show_scores` asks.

## Colour

One colour vocabulary runs through the chronology, the graph and the phases, and it encodes tension only:

| Colour | Tension | Meaning |
| --- | --- | --- |
| Green | 0 to 2 | Low or constructive |
| Yellow | 3 to 4 | Moderate |
| Amber | 5 to 7 | Elevated |
| Red | 8 to 10 | High or confrontational |

Colour never says who was right. Every colour is paired with a text label, so nothing is carried by colour alone, and the palette holds its contrast in both light and dark themes.

## Variants

| Variant | Shape |
| --- | --- |
| Landscape infographic | The reference layout |
| Stacked | For narrow screens: the overall read first, then the graph, the chronology and the participants |
| Markdown report | The same sections in the same order, with an events table in place of the graph |
| PDF | The infographic or the report, printed |

## Renderers

The method draws through renderers it does not own:

- `archify` makes the one-page infographic as an explainer: the conclusion first, structured panels and a native chart, exported as HTML, SVG or image.
- `dataviz` governs the trajectory chart's form, marks and palette, and its colour validator checks the tension scale's contrast in light and dark.
- A Markdown report needs no renderer: it is written straight from the analysis's parts.

Where neither renderer is installed, the Markdown report is the rendering, and the gap is reported rather than filled by hand-drawn graphics.

## Design decisions

Beside each rendering, a `design-decisions.md` records which analysis it rendered, the renderer and its version where known, the variant, the instructions given to the renderer, and any departure from the reference layout with its reason, so that another model can reproduce the same picture from the same analysis.

## Interactive view

A later capability, not yet built: an explorable view where selecting an event reveals its analysis and source evidence, with participant highlighting, filters by participant, phase or sentiment, a comparison of alternative readings, and export of the static infographic or report. It will read the same analysis contract.
