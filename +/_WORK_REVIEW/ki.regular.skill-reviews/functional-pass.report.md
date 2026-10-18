<!-- rumdl-disable-file MD041 -->
---

---

---

# [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md) › functional-pass

**Run report at 23:35 BST · last mark 23:12 BST**

---

## Done

- **Functional-area diagrams.** Committed locally as `9a495773` on `main` in `ki-agentic-harness`, citing [KI-HARNESS-GOV-193 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/c092431687d3542e55058cecd545e816a1dbadcf/docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md). It is not pushed.
- **Functional areas and members.** † marks a skill drawn in two areas; its first area is its home.
  - **Fundamentals**:
    - Repository and writing: ki-repo, ki-authoring †, ki-diagrams †, ki-git.
    - Skills and harness: ki-skills, ki-repo-harness †.
    - ki-bootstrap, ungrouped.
  - **Records and code**:
    - Records: ki-decision-records, ki-specs, ki-guides.
    - Writing and figures: ki-authoring †, ki-diagrams †.
    - Code: ki-engineering.
  - **Coordination**:
    - Delegation and programme: ki-delegation, ki-checkpoint, ki-pmo, ki-pmo-design.
    - Trades: ki-trades, ki-trade.
  - **Work and delivery**:
    - Work items: ki-work, ki-work-roadmap, ki-work-github-issues, ki-work-linear, ki-work-recurring.
    - Delivery cycle: ki-next, ki-plan, ki-batch, ki-implement, ki-accept, ki-recap.
  - **Repository types**:
    - Websites: ki-repo-website, -website-content, -website-app, -website-cloudflare.
    - Knowledge bases: ki-repo-kb, -kb-streams, -kb-activities, -kb-live-artifacts, -kb-principal.
    - Projects: ki-repo-project.
    - Single-type repositories: ki-repo-specifications, -mcp, -harness †, -tools, -homebrew-tap, -dotfiles-chezmoi.
  - **Agentic systems**: ki-subagents, ki-subagents-claude, ki-subagents-chatgpt, ki-agent-coordination-paperclip.
  - **Environment**:
    - MCP binding: ki-binding, -claude, -chatgpt, -chezmoi.
    - Tokenomics: ki-tokenomics, -claude, -chatgpt.
    - Housekeeping: ki-housekeeping-claude, -chatgpt.
  - **Acquire**: ki-acquire-chatgpt, ki-acquire-granola.
  - **Signals**: ki-pulse, ki-agentic-radar, ki-model-radar. No folder moved.
  - **Design**: ki-design-system, ki-design-inspiration.
- **Coverage.** A new test fails if any skill is in no functional area. A second test reads the committed area diagrams and fails if any skill is missing from all of them. The keystone, governance, change-management and repo-structure diagrams are retired. Their files and `diagrams.toml` entries are removed, and ten `skill-area-<area>` entries replace them.
- **Skill map overlay.** The outer regions stay the source folders. Where one folder's skills belong to different home areas, nested regions are titled `<Area> · <Group>`, for example "Coordination · Trades" inside Governance. Each box's second line names every area the skill serves, then when it applies, for example "fundamentals + records · always on". The overlay sits in place and passes the Archify gates: no crossings, and 1392 px wide against the 1395 px limit.
- **What the complex diagrams show now, and why.**
  - I drew Records and code, Coordination, Work and delivery and Repository types without groupings first and studied the edges.
  - The declared graph is sparse. ki-delegation is the hub of planning and delivery, and pmo, pmo-design, plan, batch and implement all rely on it.
  - The work-item skills have no edges to the delivery cycle. Governance's only internal edge was trade → trades.
  - Governance and Change Management therefore split by function:
    - **Coordination**: delegation, programme and trades.
    - **Work and delivery**: work items, then the delivery cycle.
    - **Records and code**: records, writing and engineering.
  - ki-repo-harness no longer dominates. A skill drawn outside its home area keeps only the edges inside that area, and its home diagram draws the rest. Repository types now shows ki-repo-harness as a quiet single-type member.
- **Repository-types grouping.** Websites, Knowledge bases, Projects (ki-repo-project alone) and Single-type repositories. ki-repo-dotfiles-chezmoi is now the only member with an arrow from ki-binding-chezmoi and an arrow to ki-authoring. ki-repo-homebrew-tap sits with the single-type repositories, because your note named only ki-repo-project as the Projects group.
- **Other notes honoured.**
  - Acquire, Agentic systems, Design and Environment keep their layout.
  - Every box shows the full `ki-` name, and boxes are taller so the name clears the viewer's SRC badge and icon.
  - The plain labels (always on, automatic, opt-in, command) are kept.
  - The click-through to each SKILL.md is unchanged.
- **Not honoured: the SRC badge.** The Archify viewer draws the badge itself from the source count, with no option to replace it, and changing Archify is outside this run. SRC-BADGE below asks how to proceed.
- **Not honoured: the dated roadmap note.** KI-HARNESS-GOV-193 was accepted (`c0924316`) and pruned (`b7f35cdf`) by another thread while this ran, so I added no note and recreated no record. GOV193-FOLLOWUP below asks how to record this pass.
- **Docs.** I updated the diagrams README, the docs index, the generated-diagrams section of the harness standard, CAP-4 in the rubric and its item text, the SKILL.md conform step and the script header. The rubric is in sync.
- **Checks**, run in sequence after the last change:
  - `bun run test`: 1188 pass, 0 fail.
  - `bunx tsc --noEmit`: clean.
  - `ki repo audit --skill ki-repo-harness`: FAIL=0. The CAP-2 failure that predated this run has cleared, because commit `5ec6ad28` regenerated the catalogue.
  - `ki repo audit --skill ki-diagrams`: FAIL=0. One warning is not from this run: DIAG-4 says thread-model's traced standards changed after its last check.
  - `ki repo conform --skill ki-repo-harness`: nothing to rewrite. `skills/README.md` was left untouched.
  - The skill-graph check shows every source in sync.
- **Screenshots** (not committed):
  - Current set: `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/+/_THREADS/skill-reviews/screens/`
  - Edge-study versions without groupings: `screens/ungrouped/`
  - Previous set: `screens/before-functional/`
- **HTML files to open:**
  - `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/diagrams/skill-map.html`
  - `skill-area-fundamentals.html`
  - `skill-area-records-and-code.html`
  - `skill-area-coordination.html`
  - `skill-area-work-and-delivery.html`
  - `skill-area-repository-types.html`
  - `skill-area-agentic-systems.html`
  - `skill-area-environment.html`
  - `skill-area-acquire.html`
  - `skill-area-signals.html`
  - `skill-area-design.html`

  All are in the same folder. The index is `docs/diagrams/README.md`.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- ki-agent-coordination-paperclip is the longest name. It fits its box with almost no margin and passes the label check.
- CATALOGUE-CAP2 from the regroup report is resolved by `5ec6ad28`.
- REGROUP-REVIEW is overtaken by the acceptance of KI-HARNESS-GOV-193. Its two commits are covered by FUNCTIONAL-REVIEW below.

## Queries

### FUNCTIONAL-REVIEW - review the functional-area diagrams and approve the push

**Context:** All the diagrams are regenerated under functional areas and every check passes. You said you would review Governance and Change Management in the next pass; they are now split into Coordination, Work and delivery, and Records and code. Seven commits sit unpushed on local `main` of `ki-agentic-harness` on this machine: `a830b6ed`, `58d41ccc`, `c0924316`, `b7f35cdf`, `5ec6ad28`, `8f400524` and `9a495773`. Some of them are other threads' work.

**Query:** Do the functional-area diagrams stand, and may the local `main` be pushed?

**Options:** a) (recommended) Review the eleven HTML files listed in Done; if they stand, push `ki-agentic-harness` local `main` to `origin/main`. b) Send corrections for another functional pass before any push.

### SRC-BADGE - replace the viewer's SRC badge with stable stats

**Context:** The Archify viewer draws "SRC n" on every node that has sources. It cannot be configured, and the exported SVG does not show it. Stats in the node's `tag` line would add a third line to each box. They would also change the diagrams whenever a rubric rule or reference is added, so CAP-4 would fail until conform runs again. Exact figures could instead go in the source link label, which shows only in the HTML detail view.

**Query:** How should the stats be shown?

**Options:** a) (recommended) Keep the SRC badge and the click-through as they are, and file an Archify request for a configurable node badge through the Rig skill configuration owner. b) Add a generated stats tag (rule count, size bucket S/M/L, reference count) to every node, accepting taller boxes and diagram churn on rubric edits. c) Put the exact figures in each source link's label for the HTML detail view only.

### GOV193-FOLLOWUP - record the functional-area pass

**Context:** [KI-HARNESS-GOV-193 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/c092431687d3542e55058cecd545e816a1dbadcf/docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md) was accepted and pruned while this run worked, so the dated note the brief asked for has no record to go in. Commit `9a495773` cites the pruned identifier.

**Query:** Should the functional-area pass get its own work record?

**Options:** a) (recommended) Have the coordinating thread open a follow-up `ki-agentic-harness` work record for the functional-area diagrams, awaiting review, citing `9a495773` and this report. b) Treat `9a495773` as part of the accepted KI-HARNESS-GOV-193 with no new record.

```text
FUNCTIONAL-REVIEW

Review the eleven HTML files listed in the functional-pass report's Done section; if they stand, push ki-agentic-harness local main to origin/main.

---

SRC-BADGE

Keep the SRC badge and the click-through as they are, and file an Archify request for a configurable node badge through the Rig skill configuration owner.

---

GOV193-FOLLOWUP

Have the coordinating thread open a follow-up ki-agentic-harness work record for the functional-area diagrams, awaiting review, citing 9a495773 and the functional-pass report.
```

```text
╭─ run report · 2026-10-14T22:35:00Z ──────────────╮
│                                                  │
│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │
│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │
│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │
│                                                  │
╰──────────────────────────────────────────────────╯
```

- [at rest] nothing running or queued
- [waiting] FUNCTIONAL-REVIEW
- [waiting] SRC-BADGE
- [waiting] GOV193-FOLLOWUP
- [unpushed] 7 commits, a830b6ed to 9a495773, on ki-agentic-harness local main, this machine

```text
Resume functional-pass under current ki-pmo and ki-delegation since 23:12 BST: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```
