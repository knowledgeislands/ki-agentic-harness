# Streams container exemplars

These illustrations show the KB placement contract. They do not prescribe a base's repository code, roadmap areas, topical vocabulary, or historic migration map.

## Target structure

```text
Streams/
  Roadmap/
    _ISSUES.md
    KB-OPS-001-establish-streams-container.md
    KB-GOV-002-record-local-authority.md
Admin/
  Operations/
    Activities/
      Activities.md
      Weekly Knowledge Review.md
```

`Streams/Roadmap/` is flat. Horizon and lifecycle are frontmatter in each record, not folders. The illustrated Activity location is the default; use the base's configured `activities_dir` when different. Weekly Knowledge Review is one authoritative Activity with a `ki-work-housekeeping` profile; its due run becomes a linked roadmap record, not a duplicate recurring definition.

## Legacy migration decision

| Legacy record | Deliberate destination |
| --- | --- |
| `Streams/Active/Review Practice Proposal.md` | Flat roadmap item, if it is finite forward work. |
| `Streams/Background/Monthly Review.md` | One recurring Activity in its configured collection. |
| `Streams/Dormant/Knowledge Model.md` | Canonical knowledge, if it has become settled subject matter. |

The owner confirms every classification. The legacy path never determines the new identifier or optional topical metadata.
