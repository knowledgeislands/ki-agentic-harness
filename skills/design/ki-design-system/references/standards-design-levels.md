# Design levels

An interface is designed three times, each time at a finer grain, and the coarser level is agreed before the finer one is drawn. Changing a name at the first level costs a line; at the last it costs every screen. Kris, 13 November 2026: "the things you defined really good, is information architecture, wireframes and mock-ups. That's exactly the sort of three levels of things I want." This standard sets the three levels and how a round of design runs through them. A round sits between the brief and the decision in [design work](standards-design-system.md#design-work-from-brief-to-rule); [the annotated board](standards-annotated-board.md) shows the interface as built, and [the component library](standards-design-system.md#the-component-library) names the parts every level draws.

## Contents

- [The three levels](#the-three-levels)
- [Names](#names)
- [How a round runs](#how-a-round-runs)
- [Seeing what was drawn](#seeing-what-was-drawn)

## The three levels

| Level | Answers | Shows | Leaves out | File name |
| --- | --- | --- | --- | --- |
| Information architecture | What is there, what is it called, and who owns it? | The site map, routes, the kind and shape of navigation, [the shells](standards-design-system.md#shells-and-their-state), and the inventory of parts with their names and atomic levels | Layout, colour and real content | `rN-ia-<subject>` |
| Wireframe | Where does each part sit, and how do you get about? | Grey boxes with real labels and real structure, the same coded regions on every frame, and something to click where movement matters | Final type, colour and icons | `rN-wire-<subject>` |
| Mock-up | What does it look like, in each state? | Each screen in the design language, with the real tokens and icons, in every theme and mode, and every state side by side: resting, hover, focus, reading, empty and failed | Nothing: it is what is built from | `rN-<subject>` |

`N` is the round's number. A subject that already has an agreed architecture, such as a new view inside a settled frame, may start at the wireframe; nothing starts at the mock-up.

## Names

- **The code's names are current.** A part's name is its file name in kebab case; in prose it is the same words in sentence case.
- **A new name is a proposal** until the owner agrees it, shown as "today → proposed" with its status: current, proposed or goes.
- **Nothing is named, given a meaning or given an icon without asking.** An unknown goes in square brackets, such as "[sync state]"; an icon that does not exist yet is a plain stand-in, named in the page note.
- **Each part is named at its atomic level,** as the component library sorts it, and the board that names parts keeps each level's one-sentence test.

## How a round runs

1. **Read the brief and the code's names first,** then the design system and this skill: the page notes, the coded regions, and lettered alternatives with the preferred one marked.
2. **Draw the architecture, and stop for agreement** on names and structure before anything finer is drawn.
3. **Draw the wireframes that share a shape together,** side by side with the same region codes, so that what stays and what changes are both plain.
4. **Mock up in every state.** Loading, empty and failed are part of the first mock-up, not a later round.
5. **Review before posting.** A second reader checks each file against the brief's rules and this skill's rubric, and the fixes are made before the round is called final.
6. **Say what has not been checked.** A board nobody has seen rendered is posted as such.

## Seeing what was drawn

Whoever draws may be able to check only the markup, not the picture: an agent that writes a board's HTML does not see it rendered. Until the drawing side can see its render, a reviewer looks at it by eye, and the round's report says which boards have been seen and by whom.
