# Exemplars

## Minimal active artifact

`Admin/Operations/Live Artifacts/Status Board.md`:

```yaml
---
type: admin/operations/live-artifact
status: active
renders: html
author: Written with Claude
---
```

```markdown
# Status Board

| Area    | Status  | Last updated |
| ------- | ------- | ------------ |
| Streams | 2 open  | 2026-06-27   |
| Inbox   | 0 items | 2026-06-27   |
```

The paired `Status Board.html` is generated from this source and lives in the same directory.

## Index entry

`Admin/Operations/Live Artifacts/Live Artifacts.md` entry:

```markdown
| Status Board | active | Current open streams and inbox count. |
```

## Inactive artifact

```yaml
---
type: admin/operations/live-artifact
status: inactive
renders: html
inactive_since: 2026-06-01
inactive_reason: Replaced by the consolidated Status Board.
author: Written with Claude
---
```
