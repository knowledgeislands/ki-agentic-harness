# Streams Structure Reference

Long-form detail on how the `Streams` zone is laid out, for the [Knowledge Islands Streams](../SKILL.md) skill. Loaded on demand so the `SKILL.md` body stays
lean. The process that runs over this structure is in [the Enactment Process reference](<Enactment Process Reference.md>).

## Contents

- [The zone](#the-zone)
- [Path: Focus and Category](#path-focus-and-category)
- [Leaf, parent, and multi-proposal layout](#leaf-parent-and-multi-proposal-layout)
- [The `Proposal` suffix](#the-proposal-suffix)
- [Index notes](#index-notes)
- [What lives in a stream note](#what-lives-in-a-stream-note)

## The zone

`Streams/` carries knowledge **in motion**: active projects, evolving ideas, ongoing work. Its content is _not_ canonical — durable knowledge lives in
`Pillars/` (internal; a base mid-rename may resolve this to `Matters/` via the `knowledgeislands-kb` zone alias) or `Resources/` (external). The lifecycle of a
stream is: emerge → mature through work → stabilise into a store → the stream is retired. A stream is a **status tracker and proposal document**, never a
knowledge store; a stream note that accumulates deep subject-matter content is a signal that the content needs to move out.

The defining contrast across the in-motion vs. settled zones:

- `Pillars/` / `Resources/` hold durable knowledge — what is _known_.
- `Streams/` holds working knowledge — what is _in progress_.
- `Calendar/` holds time-bound records — what _happened_ on a date.

## Path: Focus and Category

Every stream sits at `Streams/$Focus/$Category?/$Name…`.

**Focus** is mandatory and expresses the level of attention the stream is currently receiving. Moving a stream between Focus folders is an explicit act — it
signals a shift in what the project is paying attention to.

| Focus        | Meaning                             |
| ------------ | ----------------------------------- |
| `Active`     | Receiving focused attention now     |
| `Background` | Being progressed in the background  |
| `Dormant`    | Paused with intention to return     |
| `Future`     | Planned or ideated; not yet started |
| `Settled`    | Concluded                           |

Focus describes **attention**, not maturity: a `draft` proposal may sit in `Active/` or `Future/`. Be honest about attention — a stream in `Active/` without
movement belongs in `Background/` or `Dormant/`.

**Category** is optional grouping within a Focus, for navigability. Pick one pattern per Focus and stick to it:

- **No category** — flat; best for a base with few concurrent streams.
- **Destination path** — the category mirrors the stream's destination in the store (e.g. `Active/Knowledge Islands/`); scales at volume and echoes where the
  knowledge is heading.
- **Status sub-grouping** — the category expresses status; useful when many streams sit at similar levels across one domain.

The guiding principle is easy navigation: too much depth is as unhelpful as too much breadth at one level.

## Leaf, parent, and multi-proposal layout

A stream's layout depends on whether it is a **leaf** (a single proposal) or a **parent** (it has child notes or sub-proposals):

```text
Leaf:    Streams/<Focus>/<Category?>/<Name> Proposal/<Name> Proposal.md
Parent:  Streams/<Focus>/<Category?>/<Name>/<Name> Proposal.md          (+ slim <Name>.md index + children)
Multi:   Streams/<Focus>/<Category?>/<Name>/<ProposalName>/<ProposalName> Proposal.md
```

- In a **leaf** stream the folder carries the `Proposal` suffix too, and the proposal note doubles as the folder index.
- In a **parent** stream the folder is the bare topic; a slim same-named index note (note-type `stream-index`) sits alongside the proposal, and children live
  beneath.
- Use the **multi-proposal** layout only when a single stream genuinely encompasses several proposals each with its own approval cycle; the parent note then
  becomes a coordinating index over its child proposals. Most streams do not need this.

A **convention rollout** (sweeping the base to apply a newly-introduced rule) is best bundled into a single consolidated stream so inventory, sweep, and
verification run in one coordinated pass; each rollout is an independently approvable workstream inside it, lifted into its own `Proposal` sub-folder only when
its checklist diverges enough to justify a separate approval document.

## The `Proposal` suffix

The proposal note's name **always** ends with a space and the word `Proposal` — e.g. `Form E Proposal` — on its filename, its `# H1`, and its `title:`
frontmatter. The name itself (the part before the `Proposal` suffix) follows the base's naming conventions: Title Case, a scope-tight noun phrase, no dates, no
case codes, no attention-level baked in (the Focus folder already carries attention).

Why the suffix: it marks every stream as a proposal under the Enactment Process at a glance, keeps the folder index and the proposal document identifiable as
one artefact, and makes the proposal documents mechanically findable (the checker keys on it). Before creating or renaming a proposal, **propose the name and
resulting path and wait for user confirmation** — renames ripple through links.

## Index notes

Every Focus folder carries an **index note same-named as the folder** (e.g. `Active/Active.md`, note-type `stream-focus`). Its `## Streams` section is a table:

| Column   | Content                                                                       |
| -------- | ----------------------------------------------------------------------------- |
| Topic    | A bare-basename link to the stream note (e.g. an `Admin Audit Proposal` link) |
| Status   | The proposal's lifecycle position (`draft` … `completed` / `rejected`)        |
| Priority | `urgent` / `high` / `medium` / `low`                                          |

**Ordering.** In `Active/`, `Background/`, `Dormant/`, `Future/`: `in-progress` → `ready` → `draft`, then by priority within each group. In `Settled/`:
`rolled-out` → `reviewed` → `completed` → `rejected`. Group by category before sorting where categories are in use.

The `Streams/` zone index note (note-type `stream-zone`) also carries a cross-Focus **proposals index** — a live triage view of every proposal by Topic / Focus
/ Status / Priority. It has no value if it lags: update it on creation, status change, and priority change. (Note-content links inside a base use Obsidian
`[[wikilinks]]` per the `knowledgeislands-kb` convention; this skill's own files use relative markdown links.)

## What lives in a stream note

A stream note is a proposal document and status tracker. Inside the [proposal anatomy](<Enactment Process Reference.md>) frame it holds: current status,
progress updates, decisions made within the stream, next steps, blockers, and links out to the stores. What does **not** belong: durable analysis, drafting work
product, reusable methodology (→ `Pillars/` / `Matters/`); external reference material (→ `Resources/`); time-bound records (→ `Calendar/`). When a stream
produces lasting insight, extract it to the store and link back; a settled stream should have its durable knowledge already in a store, the settled note a
marker pointing to where it now lives.
