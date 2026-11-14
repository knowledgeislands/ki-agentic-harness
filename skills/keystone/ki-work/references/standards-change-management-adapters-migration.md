# Change-management adapter migration

This file holds the transition [the adapter standard](standards-change-management-adapters.md) leaves out, so that the standard describes only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. The standard wins wherever the two differ. Delete this file whole once every step below has landed.

Kris took BATCH-RETIRE a) on 7 November 2026: `ki-batch` is retired, and an unattended window's grant in the coordinating package's decisions log is the one authority record for autonomous delivery, under `ki-coordination`. The harness no longer checks or restores a batch scaffold, and its authority footers no longer name `ki-batch`. What remains lies outside the harness:

- **The retired skill stays installed.** `ki bootstrap` in tools-ki still requires `ki-batch` among its core user skills, and a harness refresh still requires every capability the installed harness carried, so the harness keeps the retired `skills/work/ki-batch/` folder until tools-ki drops it from both. The `ki repo batch` command keeps reading existing batch records and creates no new one; it is removed from `ki` in the same change.
- **Existing batch records stay readable.** A record still under `+/_BATCHES/` in another repository is read under the retired skill until that repository removes it, and `ki-repo-kb` still delegates such a record's metadata to its owner until no Knowledge Base holds one.
- **Leftover scaffolds go.** A `+/_BATCHES/README.md` left in another repository is no longer checked or restored; each repository removes its folder.

Once tools-ki has dropped `ki-batch` and no repository holds a batch record, delete the `ki-batch` folder, `ki-repo-kb`'s batch-record delegation, the skill's entries in the harness's function map and identifier test, its diagram nodes and this file.
