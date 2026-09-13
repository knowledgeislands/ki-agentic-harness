---
areas: { FND: 22, GOV: 58, OPS: 6, REV: 1, RTP: 12 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `022`.
- `GOV` reserves through `058`.
- `OPS` reserves through `006`.
- `REV` reserves through `001`.
- `RTP` reserves through `012`.
