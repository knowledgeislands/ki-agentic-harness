---
areas: { FND: 28, GOV: 230, OPS: 11, REV: 12, RTP: 19 }
---

# Roadmap issue ledger

This ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Reserve a number by committing this ledger's advance on its own before writing the record. Areas are not mutable themes or groups.

- `FND` reserves through `028`.
- `GOV` reserves through `230`.
- `OPS` reserves through `011`.
- `REV` reserves through `012`.
- `RTP` reserves through `019`.
