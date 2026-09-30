---
areas: { FND: 28, GOV: 121, OPS: 7, REV: 10, RTP: 13 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `028`.
- `GOV` reserves through `121`.
- `OPS` reserves through `007`.
- `REV` reserves through `010`.
- `RTP` reserves through `013`.
