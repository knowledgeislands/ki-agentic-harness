# Role migration

This file holds the tolerance for the forms [the role standard](standards-roles.md) replaces, so that the standard describes only the final state, as Kris set under MIGRATION-OVERLAY on 7 November 2026. Each form below is read as shown and warned on, never failed. The standard wins wherever the two differ. Delete this file whole, with the checker's migration warnings, once every territory's governor has brought its packages into line.

| Old form | Read as | Where it is warned on |
| --- | --- | --- |
| `🧵 <work-id>` closing a session whose package names a role | The same session; it moves to `<role glyph> 🔑 <work-id>` at its next bootstrap | The footer hook passes it; reports are judged by `ki-coordination` |
| `_index.md` without `role` | The package's role not yet declared | RECORD-2 warns |
| `role:` or `tier:` at the top level of `state.md` | The package's seat, to be moved into `workers` and `role` into `_index.md` | RECORD-2 warns |
| `role: assistant` | gatekeeper | RECORD-2 warns |
| `role: keeper` | warden | RECORD-2 warns |
| `tier: enablers` | managers | RECORD-2 warns |
| `tier: doers` | makers | RECORD-2 warns |
| `name`, `uri` or `designation` in a `workers` entry | Dropped: the name is derived from the role, and a session address stays out of the package | RECORD-2 warns |
| `listening: agora-call` in a `workers` entry | `listening: on` | RECORD-2 warns |
| ⭐ or 🔧 in a glyph run, as in `🦉⭐ 🔑 personal.reg.inbox-terra` | The role glyph alone; neither is a role, and ⭐ and 🔧 leave the thread line under MARKS-RETIRE | The footer hook warns |
| `🧵 🔑 <work-id>` | `🧵 <work-id>`, or the role glyph's key form once the seat has a role | The footer hook warns |
| A worker register held in `state.md`'s body | The `workers` field, moved into the front matter | Not checked |
