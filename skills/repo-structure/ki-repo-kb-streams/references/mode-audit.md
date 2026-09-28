# Mode AUDIT — check a base's Streams against the model

_On-demand procedure for Streams AUDIT. The shared model lives in [`SKILL.md`](../SKILL.md) and is already loaded._

1. **Run the mechanical checker** — `ki repo audit --skill ki-repo-kb-streams`. It resolves the `Streams` zone through any `ki-repo-kb` zone alias. Capture its output.
2. **Apply the `[J]` criteria by reading** ([the rubric](rubric.md)): `Streams/` contains only the agreed operational areas; retained state/focus trees and former housekeeping definitions have an owner-approved reconciliation disposition; roadmap work is flat under `Streams/Roadmap/`; and recurring definitions belong in the configured Activity collection, not duplicated in Streams.
3. **Report** drift, FAILs first, citing paths and the fix. This audit is one part of a base audit: selecting `ki-repo-kb` runs this capability as a declared prerequisite before the zone-model checks, so "clean" means every applicable skill's audit passes.
