# Entry-file migration

This file holds the tolerance for the entry file's earlier name while [the work-package standard](standards-work-package.md) moves from `work.md` to `_index.md`, under INDEX-ENTRY (Kris, 8 November 2026) and MIGRATION-OVERLAY. The standard describes only the final name; the standard wins wherever the two differ.

| Old form | Read as | Where it is checked |
| --- | --- | --- |
| A work folder whose entry file is `work.md` | Its `_index.md`, with the same front matter and content | Read without a warning by every check and hook during the rollout |
| A work folder holding both `work.md` and `_index.md` | Its `_index.md`; the second entry file is a stray | FOLDER-1 fails |

The rename itself, `git mv work.md _index.md` in each package, is the Rig sessions' to brief and run; this file renames nothing.

## When the rollout ends

Once no `+/_WORK/<id>/work.md` remains in any territory, delete:

- this file and its link in the standard's [Work file](standards-work-package.md#work-file) section;
- `LEGACY_ENTRY_FILE` and `entryFiles` in `scripts/rubric/contexts/work-folder.ts`, leaving `entryFile` to return `_index.md`, and their legacy fixtures in `work-folder.test.ts` and `work-package.test.ts`;
- `'work.md'` from `ENTRY_FILES` in `ki-coordination`'s `scripts/rubric/contexts/coordination.ts` and from `WORK_PACKAGE_FILES` in `ki-repo-kb`'s `scripts/rubric/contexts/kb.ts`.

A leftover `work.md` then fails FOLDER-1 as a file outside the closed list.
