---
areas: { FND: 28, GOV: 140, OPS: 7, REV: 11, RTP: 17 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `028`.
- `GOV` reserves through `140`.
- `OPS` reserves through `007`.
- `REV` reserves through `011`.
- `RTP` reserves through `017`.
