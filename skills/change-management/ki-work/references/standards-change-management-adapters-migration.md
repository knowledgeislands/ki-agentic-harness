# Change-management adapter migration

This file holds the transition [the adapter standard](standards-change-management-adapters.md) leaves out, so that the standard describes only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. The standard wins wherever the two differ. Delete this file whole once every step below has landed.

Kris took BATCH-RETIRE a) on 7 November 2026: `ki-batch` is retired, and an unattended window's grant in the coordinating package's decisions log is the one authority record for autonomous delivery, under `ki-coordination`. Until the retirement finishes:

- **The batch scaffold stays checked.** A repository declaring `ki-work` still carries `+/_BATCHES/README.md`, which this skill owns, its SCAFFOLD rubric item still checks and CONFORM still restores. Remove the folder from each repository, then the `owns` entry, the scaffold check and its conform proposal, in one change.
- **The `ki batch` command stays.** `ki repo batch` keeps reading existing batch records; create no new one. It is removed from `ki` with the scaffold.
- **Existing batch records stay readable.** A record still under `+/_BATCHES/` is read under the retired `ki-batch` skill until it is removed with its folder.
- **Brief footers still name `ki-batch`.** Until the `ki-delegation` footers lose their `ki-batch` clause, read a footer's "repository-local `ki-batch` authorisation ... with `completion_target: done`" as a recorded window grant naming closure for a frozen wave, under `ki-accept`.
