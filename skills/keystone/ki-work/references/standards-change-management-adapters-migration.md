# Change-management adapter migration

This file holds the transition [the adapter standard](standards-change-management-adapters.md) leaves out, so that the standard describes only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. The standard wins wherever the two differ. Delete this file whole once every step below has landed.

Kris took BATCH-RETIRE a) on 7 November 2026: `ki-batch` is retired, and an unattended window's grant in the coordinating package's decisions log is the one authority record for autonomous delivery, under `ki-coordination`. The harness no longer checks or restores a batch scaffold, and its authority footers no longer name `ki-batch`. What remains lies outside the harness:

- **The retired skill is gone.** tools-ki 0.16.0 no longer requires `ki-batch` at bootstrap and treats it as a retired user skill, so the harness removed the `skills/work/ki-batch/` folder, its entries in the function map and identifier test, and its diagram nodes on 14 November 2026, under RENAME-NOW in the Cairn summit's change 25.
- **Existing batch records stay readable.** A record still under `+/_BATCHES/` in another repository is read under the retired skill until that repository removes it, and `ki-repo-kb` still delegates such a record's metadata to its owner until no Knowledge Base holds one.
- **Leftover scaffolds go.** A `+/_BATCHES/README.md` left in another repository is no longer checked or restored; each repository removes its folder.

Once no repository holds a batch record, delete `ki-repo-kb`'s batch-record delegation and this file.
