---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-13T17:19:10Z
status: in force
---

# Workshop

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 What a workshop produces](#41-what-a-workshop-produces)
  - [4.2 The brief](#42-the-brief)
  - [4.3 Rounds and review passes](#43-rounds-and-review-passes)
  - [4.4 Closing a workshop](#44-closing-a-workshop)

## 1. Introduction

A workshop is the type of meeting that makes something together, such as designs. It runs by [the meeting standard](standard-meeting.md); this standard adds only what a workshop produces and how it gets there. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

[Back to contents](#contents)

## 2. Scope

What a workshop produces, what its brief holds, and how its work is checked and closed.

### 2.1 In scope

- The output of a workshop and where it is kept.
- What a workshop's brief holds beyond the meeting standard's.
- Rounds of work, review passes and the choices each round leaves.

[Back to contents](#contents)

### 2.2 Out of scope

- Everything every meeting shares: [the meeting standard](standard-meeting.md).
- How the output is named, which belongs to the kind of work.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Workshop** | A meeting that makes something together. **Standard:** this one, [1](#1-introduction) |
| **Maker** | A participant that makes the workshop's output. **Standard:** this one, [4.1](#41-what-a-workshop-produces) |
| **Round** | One batch of work by the makers, ended by a review pass. **Standard:** this one, [4.3](#43-rounds-and-review-passes) |
| **Final** | A part the review pass finds no fault in. **Standard:** this one, [4.3](#43-rounds-and-review-passes) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 What a workshop produces

1. **The thing made,** by its makers, in the meeting's output folder, named for the work, such as `designs/`.
2. **Each part ends final,** or with the choices it leaves to the owner listed, each with its recommendation.
3. **No decision.** A workshop produces options and finished parts; the owner's decisions on them go to the change document, as for every meeting.

[Back to contents](#contents)

### 4.2 The brief

Beyond what every brief holds, a workshop's says:

1. **What to make,** part by part, and what is already settled, so the makers draw answers rather than options wherever they can.
2. **What the makers work from,** in `brief/`: the design language, the code or data the output must fit, and real samples to fill it with. Private samples stay in the folder ([the meeting standard](standard-meeting.md#412-git-and-private-data)).
3. **The names to keep exactly** as the owner has them; a maker asks before inventing a name, a meaning or an icon.
4. **Which choices are still open** with the owner, and that until they are answered the makers draw with the recommended option and mark where a different answer would change the part.

[Back to contents](#contents)

### 4.3 Rounds and review passes

1. **Work runs in rounds,** each a batch of parts the agenda lists.
2. **Each round ends with a review pass.** The caller checks every new part with its own reviewer, such as a render check, kept across passes, and reports each fault so the maker can find it, such as by a region code on the part. The maker fixes it, and the pass repeats until every part is final.
3. **Each round's choices.** At the end of each round, the makers list the choices the round leaves to the owner, each with its recommendation, and the caller carries them into the change document's open questions.

[Back to contents](#contents)

### 4.4 Closing a workshop

A workshop closes when every part on its agenda is final or waits only on the owner's choices, and the caller's closing message names the output and the change document holding those choices.

[Back to contents](#contents)
