# Review action routing

This table is the durable action list for `KI-HARNESS-REV-001`. It separates completed review work, captured Harness work, external receiver work, and external observations.

| Action | Outcome | Route | State |
| --- | --- | --- | --- |
| `ACCEPT-REV-001` | Close the review. | [REV-001][rev-001-record] | Done |
| `RENAME-KI-WORK` | Rename the parent. | [GOV-039][gov-039-record] | Now, draft |
| `DECIDE-KB-AUTHORITY` | Choose KB metadata and principal authority. | [GOV-040][gov-040-record] | Next, draft |
| `DECIDE-SPECS-IDENTITY` | Choose Specification identity and activation. | GOV-041 | Done; record pruned |
| `EXTEND-REMOTE-ADAPTERS` | Add remote process execution. | [FND-014](../../roadmap/KI-HARNESS-FND-014-implement-remote-adapters.md) | Future, draft |
| `ROUTE-TOOLS-KI` | Deliver host evidence improvements. | [`TRD-4a875479`](../../../-/_TRADES/knowledgeislands/tools-ki/TRD-4a875479.md) | Preparing † |
| `FIX-USER-MCP` | Repair one MCP transport mapping. | User-owned MCP source | External observation |
| `FIX-CLAUDE-MEMORY` | Repair Claude memory index/date evidence. | User-owned memory; [OPS-002](../../roadmap/KI-HARNESS-OPS-002-reconcile-memory-store-defects.md) | External observation |

† The preparation remains unsent until `tools-ki` accepts and prioritises it. It does not change the asynchronous trade protocol.

[rev-001-record]: https://github.com/knowledgeislands/ki-agentic-harness/blob/38b47cdb5cd5d2618e31c40e55cf652cd77aa5c7/docs/roadmap/KI-HARNESS-REV-001-review-skill-effectiveness.md

[gov-039-record]: https://github.com/knowledgeislands/ki-agentic-harness/blob/66871c50d2ec1015108ba3d4ff37b19682ef5b69/docs/roadmap/KI-HARNESS-GOV-039-rename-change-management.md

[gov-040-record]: https://github.com/knowledgeislands/ki-agentic-harness/blob/3cfaa28926a781474b61d7b0592e2ede30814902/docs/roadmap/KI-HARNESS-GOV-040-resolve-kb-authority.md
