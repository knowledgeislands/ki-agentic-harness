# Modes AUDIT and CONFORM

_On-demand procedure for activities' AUDIT and CONFORM modes (CONFORM runs AUDIT first, so they share this file). The activity model — required frontmatter, realization types, realization-specific fields, and the Activities.md index — lives in [`SKILL.md`](../SKILL.md) and is already loaded; this file is the procedure only._

## Mode AUDIT — check the base's activity notes

1. **Run the mechanical checker** — `bun scripts/audit.ts <base-path> --reporter=terminal` (optionally with `--harness <path>`). The default output is canonical JSONL; the terminal reporter shows actionable results. It checks the activity index, declared `status` and `realization`, realization-specific fields, and an explicitly supplied harness path. Unknown realizations and external scheduled-task registration are non-blocking `INFO`; the summary counts the judgment criteria to apply by reading. Exit code is non-zero on any FAIL.
2. **Apply the judgment layer** — read the **[J]** criteria in [the rubric](rubric.md): whether each note body describes the activity clearly (ACT-J-1), whether the index is current (ACT-J-2), whether retired activities carry a retirement rationale (ACT-J-3), and realization-specific narrative checks (ACT-J-4, ACT-J-5).
3. **Compose on `ki-kb`** — zone and zone-index checks are owned by `ki-kb`; run its audit for the base first and note its result rather than re-deriving zone structure here.
4. **Report** by location → criterion → fix, leading with FAILs then WARNs.

## Mode CONFORM — bring the base's activity notes into line

1. Run **AUDIT** first for the gap list.
2. Create `Admin/Operations/Activities/Activities.md` stub if absent.
3. For activity notes missing required frontmatter fields: prompt to fill them in — do not guess `realization` or `status` values.
4. For a `slash-command` activity whose skill is absent from the harness: offer to scaffold the SKILL.md stub (invoke `ki-skills` NEW mode) — confirm before creating.
5. For a `scheduled-task` activity missing `schedule_name`: prompt the user to provide it and register it in the external system; the checker cannot do this.
6. Re-run **AUDIT** until it is clean.
