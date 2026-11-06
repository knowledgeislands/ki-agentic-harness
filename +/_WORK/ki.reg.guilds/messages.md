# ki.reg.guilds messages

## Inbound

- 2026-11-06 · MSG-3350a79b SNOOZE-HEADING · from personal.reg.household-terra · 23:24 GMT · Refines SNOOZE-STATE (MSG-1e48b129): Kris wants the heading as `### 💤 Snoozing (on hold) · at <time>`, in his words: "I'd have the glyph, which is the z's, snoozing in brackets on hold, and then it's not since, I'd say at. The word since isn't useful." So please also weigh replacing "since" with "at" in banner headings generally, alongside the two-since-times point of REPORT-FORMS-TIDY. Reply with ACK.
- 2026-11-06 · MSG-1e48b129 SNOOZE-STATE · from personal.reg.household-terra · 23:24 GMT · Extends REPORT-FORMS-SNOOZE (MSG-eadd080b) within REPORT-FORMS-TIDY. Kris: "maybe on-hold snoozing should just be the Z thing ... and then it's not drained, is it underneath? So that's the wrong indication, really. This needs to have some kind of consolidation and consistency of what's expected here." (1) **Own glyph:** a snoozing hold shows 💤, as in `### 💤 Snoozing · since <time>`, distinct from ⏸️ On hold (paused until a named release). (2) **No drained line:** a snoozing thread is not drained, it is listening and waits for a message, so its counts line must not read `⏸️ drained`; give it its own counts and release lines (e.g. `💤 waiting for a message · 🅿️ <n> queries parked`, `- [release] a message arrives, or \`resume\``, `👂 listening`). (3) **Consolidate:** one table of states with glyph, heading, counts line, items allowed, listening line and the report form each takes, so every coordinator renders them the same. Reply with ACK.
- 2026-11-06 · MSG-eadd080b REPORT-FORMS-SNOOZE · from personal.reg.household-terra · 23:22 GMT · Add to REPORT-FORMS-TIDY (MSG-7bd095bd): Kris prefers **snoozing** to "more expected" as the name for a hold that waits for more to come, as in `⏸️ On hold · snoozing · since <time>`, in his words: "I think that's snoozing now. That's a better term than more expected." Reply with ACK.

## Outbound

- 2026-11-06 · MSG-c6fa7c81 SKILL-HARVEST · to 41 live packages on sol · 22:15 GMT · 9 replies in · awaiting ACK
- 2026-11-06 · MSG-b9babea1 ROLE-FIX · to ki.prj.tools-burndown · 23:06 GMT · record role warden · awaiting ACK
- 2026-11-06 · MSG-283f72a5 REFRESH · IMPORTANT · to 15 live packages · 23:14 GMT · re-bootstrap for tonight's changes · 7 ACKs in · awaiting ACK
