/**
 * Eval scenarios for the `ki-housekeeping` skill — Headroom's auto-memory files
 * (MEMORY.md index + one-fact-per-file memory/*.md), which live outside the repo.
 *
 * Design note: a baseline invents a plausible in-repo memory store and generic
 * frontmatter. These scenarios target house-ARBITRARY specifics: the
 * outside-the-repo path with the `/`→`-` slug, the metadata.type enum with the
 * feedback/project body structure, and the promote-to-CLAUDE.md reconciliation.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-housekeeping',
    id: 'mem-path-slug',
    prompt:
      "Where does Claude Code's auto-memory for the repo at `/Users/kris/proj` actually get stored on disk? Give the exact path.",
    assertions: [
      { name: 'projects dir under ~/.claude', re: /~\/\.claude\/projects|\.claude\/projects/i },
      { name: 'memory subdir', re: /\/memory\/?/i },
      { name: 'MEMORY.md index', re: /MEMORY\.md/ },
      { name: 'slugified absolute path', re: /-Users-kris-proj/ }
    ],
    rubric:
      'House fact: memory lives OUTSIDE the repo tree at `~/.claude/projects/<slug>/memory/` with a `MEMORY.md` index, where `<slug>` is the repo\'s absolute path with every `/` replaced by `-` (so `/Users/kris/proj` → `-Users-kris-proj`). A correct answer gives that path and derives the slug correctly, not a `.claude/` folder inside the repo.'
  },
  {
    skill: 'ki-housekeeping',
    id: 'mem-type-enum',
    prompt:
      'Save a memory that the user corrected us yesterday: they always want the test suite run before we commit. Write the memory file.',
    assertions: [
      { name: 'metadata block', re: /metadata/i },
      { name: 'feedback type', re: /feedback/i },
      { name: 'Why line', re: /why:/i },
      { name: 'How to apply line', re: /how to apply/i }
    ],
    rubric:
      'House fact: memory frontmatter is `name`, `description`, and `metadata.type` ∈ `user | feedback | project | reference`; **feedback** and **project** bodies follow the fact with `**Why:**` and `**How to apply:**` lines, and project memories convert relative dates to absolute at save time. A correct answer files this as `metadata.type: feedback` with the Why / How-to-apply structure (and, if dated, an absolute date rather than "yesterday").'
  },
  {
    skill: 'ki-housekeeping',
    id: 'mem-index-promote',
    prompt:
      "One of our memory files just records our import-path and file-layout conventions. Is that fine to keep? And what maintenance does MEMORY.md need?",
    assertions: [
      { name: 'MEMORY.md index', re: /MEMORY\.md/ },
      { name: 'belongs in CLAUDE.md', re: /CLAUDE\.md/ },
      { name: 'promote', re: /promote/i },
      { name: 'delete the duplicate memory', re: /delet|remove/i }
    ],
    rubric:
      "House fact: repo conventions (code structure, import paths) do NOT belong in memory — they are promoted to a `CLAUDE.md` and the memory deleted, not left to duplicate it; and every `memory/*.md` must have a matching `MEMORY.md` index entry (`- [Title](file.md) — hook`). A correct answer says to promote the conventions to `CLAUDE.md` and delete the memory, and that the index and files stay in sync bidirectionally."
  }
]
