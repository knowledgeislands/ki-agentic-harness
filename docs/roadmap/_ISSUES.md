---
areas: { FND: 27, GOV: 103, OPS: 7, REV: 10, RTP: 13 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `027`.
- `GOV` reserves through `103`.
- `OPS` reserves through `007`.
- `REV` reserves through `010`.
- `RTP` reserves through `013`.
