# D12 migration

This file holds the temporary adjustments to [the D12 standard](standards-dodecakrisis.md), [the mailbox standard](standards-mailbox.md) and [the learning standard](standards-learning.md), so that they describe only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. Read the standards first; they win wherever the two differ. Delete each line once its condition is met, and this file whole once it is empty, with no edit to the standards.

| Adjustment | Until |
| --- | --- |
| The Docket has no binding: no mode makes, moves or reads Docket items, and an existing `<root>/12 Docket` label is left as it stands and is not reported as extra. Rule 8 stays a rule of the concept only | Kris answers DOCKET-HOME, parked on 7 November 2026 |
| Neither `mcp-gsuite` nor `mcp-m365` yet declares or enforces a protected list, so no server reports protection switched on, and under the mailbox standard no D12 mode writes to a mailbox. AUDIT and dry runs continue | Each server reports its protected list, and D12 reads it |
| `ki-muninn` has no `d12 sweep` or `d12 learn` command, no list of capture folders per mailbox and no `eml.txt` form, so SWEEP and LEARN can be explained and dry-run by hand but not run | `ki-muninn` ships them |
| `mcp-m365` cannot update or delete a rule, set categories or query mail changes, so a Microsoft 365 mailbox can be audited but not conformed, swept or learnt from | `mcp-m365` ships those tools |
| hnr-principal's Microsoft 365 mailbox is not yet declared | hnr-principal declares it, after the personal Gmail mailbox |
