---
areas: { FND: 24, GOV: 65, OPS: 7, REV: 5, RTP: 12 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Areas are not mutable themes or groups.

- `FND` reserves through `024`.
- `GOV` reserves through `065`.
- `OPS` reserves through `007`.
- `REV` reserves through `005`.
- `RTP` reserves through `012`.
