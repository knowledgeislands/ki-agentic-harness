# Coordinating-work migration

This file holds temporary adjustments to [the coordinating-work standard](standards-coordination.md), which describes only the final state, under MIGRATION-OVERLAY. Read the standard first; it wins wherever the two differ. Delete each adjustment once its condition is met, and the file whole once it is empty, with no edit to the standard.

## Thread model

The model replaced the thread model of 13 to 17 October. Kris agreed it on 18 October and launched its migration the same day; the harness half is [KI-HARNESS-GOV-210 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/08468196/docs/roadmap/KI-HARNESS-GOV-210-work-model-write-in.md). The old words map to the new:

| Thread model | Work model |
| --- | --- |
| state-of-play thread, `_state-of-play.md`, id `<territory>.sop` | territory work, `+/_WORK/<territory>/work.md`, id `<territory>` |
| coordination thread, `<initiative>.<project>.md`, id `<territory>.<initiative>.<project>` | Project work, `+/_WORK/<territory>.<project>/work.md`, id `<territory>.<project>` |
| conversational thread with a checkpoint | ad hoc work, `+/_WORK/<territory>.regular.<slug>/`, under regular work |
| recurring work homed in an Initiative | regular work, `<territory>.regular`, self-coordinating |
| Initiative, `Streams/Initiatives/`, `initiative:` | theme, `Streams/Themes/<theme>.md`, an optional `theme:` |
| thread folder `+/_THREADS/<run>/` | the work folder `+/_WORK/<id>/` |
| checkpoint, pick-up block, moves | the work package: `work.md` for the definition, `state.md` for the state; Git as the logbook |
| REST, BUSY, HOLD and DONE frames; resume line | the glyph banner and its closing thread line |
| the copyable stacked reply block | none; the owner answers in speech |
| hold | On hold, paused or snoozing |
| `+/_DESIGN/<subject>/`, `Streams/**/design/` | `+/_WORK/<id>/design/` |

**The tolerance window.** Until every territory has moved, which phase 5 of the migration closes, the checkers and every reader accept both shapes: a `+/_CHECKPOINTS/` checkpoint, a `+/_THREADS/<run>/` folder, `Streams/Initiatives/` and an `initiative:` key are read as before, each with a warning that names its new home, and the new shape passes without one. The `Streams/Initiatives/` and `initiative:` warnings become failures on 7 November 2026, or earlier once a scan finds no residue, as Kris chose THEME-CLOSE's dated cutover on 25 October 2026; the checker messages name the date. A session working old-shape work keeps to this standard through the mapping above; it moves its own files only when its territory's migration moves them. A report written before 18 October keeps its block-letter frame and reply block, and anything that reads past reports accepts both.
