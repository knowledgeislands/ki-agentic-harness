# ki.reg.guilds discussions

## Open

### STALE-ROWS - Retire the two possibly stale items in the standard

**Context:** Item 9 of the split plan says two parts of the standard "may be stale", so I left both unchanged rather than guess. The first is the standard's line about four supporting layers, which counts "the pilot's acceptance tests" as one; I found no current pilot or acceptance test behind it. The second is the `thread.status` row in the Surfaces table, the coordinator's one-line status file. That row says it lasts "until `ki work status` reads the work package directly". `ki work status` now does that, as the row just above it in the same table says, so the row's end condition has been met. However, the `ki-delegation` background-runs standard still lists `thread.status` among the coordinator's runtime files. Retiring it there would be a change of behaviour, not just a wording fix.

**Query:** Should the next stage remove the pilot-tests layer and retire the `thread.status` row, in both standards?

**Options:**

a) (recommended, confidence medium - the row's own end condition is met, but whether any tool still reads `thread.status` was not checked beyond this harness and `tools-ki`) Remove the "pilot's acceptance tests" layer and retire the `thread.status` row in both ki-coordination and ki-delegation, as a small follow-up before the split.

b) Fold both into the split's later stages, leaving them as they are until then.

c) Keep both: the layer and the status line stay in use.

## Parked

- ACQUIRE-ROUTE: acquisition items (GRANOLA-CAPTURED-SKIP MSG-6620cbb7, GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE) to ki.reg.main via State of play; recommended a) high. Kris, 7 November: "We can come back to that later." None.
