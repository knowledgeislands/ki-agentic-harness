<!-- rumdl-disable-file MD041 -->
---

---

---

# [Knowledge Islands model](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md) › [Ways of working](/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md) › area-layout

**Run report at 22:51 BST · last mark 22:51 BST**

---

## Done

- **New layout rule** in `skills/repo-structure/ki-repo-harness/scripts/rubric/contexts/skill-areas.ts`, applied to all eight area diagrams. Each area's own skills form a compact grid that is close to square. Each group of linked skills starts at its hub (the skill with the most links inside the area) and works outward to its neighbours. Skills linked from above sit at the top of a column, and skills linking below sit at the bottom of one. A skill with both kinds of link gets a column of its own on the right. The rest fill down one column, then up the next.
- **Agentic-systems grid**, exactly as requested:
  - row 1: repo-harness
  - row 2: subagents, subagents-claude
  - row 3: agent-coordination-paperclip, subagents-chatgpt
  - row 4: git

  repo-harness, subagents, paperclip and git share column 1.
- **Tests**: two added to `skill-areas.test.ts`. One checks the agentic-systems grid on a fixture; the other checks that a skill with links both above and below gets its own column. The "every edge downward" test now covers only edges between regions, because edges inside a region now run sideways or up to the hub.
- **Regenerated files**: all eight area sources, plus their committed HTML and SVGs. `last_checked` for the eight areas now points to `fcad8a1e`, the commit whose frontmatter they were generated from. The skill map did not change.
- **Diagram text**: the module comment and the "Reading the diagram" card now say arrows run downward _between_ regions.
- **Roadmap note**: [KI-HARNESS-GOV-193](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md) has a dated note under Discussion saying the layout was revised at your request. Its status is still awaiting-review.
- **Checks**:
  - `bun run test`: 1178 pass, 0 fail.
  - `bunx tsc --noEmit`: clean.
  - `ki repo audit --skill ki-diagrams`: 0 FAIL. Two DIAG-4 warnings were already there, both outside this change (skill-map and thread-model).
  - `ki repo audit --skill ki-repo-harness`: 1 FAIL. It is CAP-2 on `skills/README.md` and was already there (see CATALOGUE-CAP2). CAP-4 passes.
  - `ki dev skill rubric ki-repo-harness`: in sync.
  - All eight areas pass Archify's showcase finalize gates.
- **Commit**: `a830b6ed` `feat(ki-repo-harness): lay each area out as a compact hub-first block`, 28 paths staged by name, not pushed. The commit hooks ran; commitlint gave one non-blocking warning (`footer-leading-blank`).
- **Screenshots** are in `/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/+/_THREADS/skill-reviews/screens/`:
  - `skill-area-agentic-systems.png`
  - `skill-area-governance.png`
  - `skill-area-change-management.png`
  - `skill-area-repo-structure.png`
  - `skill-area-environment.png`
  - `skill-area-keystone.png`
  - `skill-area-acquire.png`
  - `skill-area-design.png`

  For comparison, the old layouts of four of them are in `+/_THREADS/skill-reviews/scratch/old-png/`. The skill map did not change, so it has no screenshot.
- **Limits**:
  - I did not fetch first. The brief's rules forbid any remote call, so the commit sits on the local `main` as I found it.
  - Some diagrams got worse:
    - **keystone**: bootstrap now sits beside repo in the lower row, which leaves an empty cell at top right.
    - **governance**: seven skills are linked from above, but there are only five columns. git and diagrams can't sit at the top, so their incoming edges go around the left side.
    - **repo-structure**: the area grew to five columns because repo-dotfiles-chezmoi has its own column, and the prerequisites below now wrap onto three bands.
    - **change-management**: plan sits alone in the fifth column, and its edge to delegation goes around the right side.

  All four still pass the gates. The agentic-systems, environment and acquire diagrams improved.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- Two prototype tweaks were tried and dropped. In one, the most-linked skills took the top-of-column and bottom-of-column cells first; it failed governance's gate, so I reverted it.
- The `agent-coordination-paperclip` label still overflows its box slightly, as it already did before this change.

## Queries

### AREA-LAYOUT-REVIEW - approve the revised area layout for push

**Context:** Commit `a830b6ed` is local and has not been pushed. The agentic-systems diagram now matches your grid exactly. claude sits above chatgpt because of how the rule fills columns: chatgpt comes first by name, and the second column fills upward, so chatgpt lands at the bottom. Nothing special-cases that diagram. The four diagrams that got worse are listed under Done; all eight pass Archify's gates.

**Query:** Do you approve the new layout, as the screenshots show it, for push?

**Options:**

a) (recommended) Approve the layout and push `a830b6ed` to origin/main from this machine.

b) Keep the commit local and name the diagrams whose layout should change first.

### CATALOGUE-CAP2 - regenerate the stale skills catalogue

**Context:** `ki repo audit --skill ki-repo-harness` fails CAP-2 because `skills/README.md` still has the old `ki-pmo` description. That was already true at `fcad8a1e`, and [KI-HARNESS-GOV-193](/Users/krisbrown/workspaces/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-193-area-diagrams-with-html.md) leaves the fix to the thread that changed `ki-pmo`. The conform run in this task rewrote the file, but I restored it, because the fix was out of scope.

**Query:** Should a separate commit regenerate the catalogue now?

**Options:**

a) (recommended) Run `ki repo conform --skill ki-repo-harness` and commit only `skills/README.md` as `chore(skills): regenerate capability catalogue`.

b) Leave it to the thread that changed `ki-pmo`.

```text
AREA-LAYOUT-REVIEW

Approve the revised area layout in a830b6ed (KI-HARNESS-GOV-193) and push it to origin/main from this machine.

---

CATALOGUE-CAP2

Run ki repo conform --skill ki-repo-harness in ki-agentic-harness and commit only skills/README.md as chore(skills): regenerate capability catalogue, local only.
```

```text
╭─ run report · 2026-10-14T21:51:20Z ──────────────╮
│                                                  │
│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │
│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │
│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │
│                                                  │
╰──────────────────────────────────────────────────╯
```

- [at rest] nothing running or queued
- [waiting] AREA-LAYOUT-REVIEW
- [waiting] CATALOGUE-CAP2
- [unpushed] a830b6ed on ki-agentic-harness local main, this machine

```text
Resume area-layout under current ki-pmo and ki-delegation since 22:51 BST: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.
```
