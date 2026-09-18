---
areas: { FND: 25, GOV: 76, OPS: 7, REV: 9, RTP: 12 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `025`.
- `GOV` reserves through `076`.
- `OPS` reserves through `007`.
- `REV` reserves through `009`.
- `RTP` reserves through `012`.
