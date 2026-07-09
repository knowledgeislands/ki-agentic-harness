# Mode REFRESH — re-anchor the standard to its sources

_On-demand procedure for tools' REFRESH mode. The cadence and source list are declared in [`sources.md`](sources.md). The full standard lives in [`tools-standard.md`](tools-standard.md)._

The tool-repo standard sits on top of moving external specs (shellcheck, bats, keep-a-changelog, semver, XDG) and the reference repo `tools-mgit`. This mode keeps the standard honest — it re-fetches each source and diffs it against what the skill codifies, so the audit never green-lights a repo against a spec that has moved on. Run it on the declared cadence (see [`sources.md`](sources.md)), or when someone asks "is our tools standard up to date".

1. **Read [the source list](sources.md)** — the tracked external specs + the in-house reference repo, each with a `Last reviewed` date and what it governs.
2. **Re-fetch each source** (WebFetch/WebSearch) and **diff against the [standard](tools-standard.md) + [rubric](audit-rubric.md) + [`scripts/audit-tools.ts`](../scripts/audit-tools.ts)**. Look for: changed shellcheck defaults/severities, bats-core API or install changes, a new keep-a-changelog / semver revision, XDG spec changes, and any new capability signal the reference repo has adopted.
3. **Scan `tools-mgit`** (and any other `tools-*` repos) for emergent patterns the standard hasn't captured — promote the good ones; flag any that contradict the standard.
4. **Separate spec-driven from house style.** A change is a new _requirement_ only if it traces to an external spec in the source list; otherwise it is a workspace preference and must be labelled as such.
5. **Propose a diff** to the standard, rubric, and (where a check became mechanical) `audit-tools.ts`. Every new **[M]** item must land as a checker check. Confirm before writing.
6. **Update [the source list](sources.md)** — bump each `Last reviewed` date, add/retire sources, and refresh the `## Last review` block. This step is mandatory: the source list is the skill's memory of where the standard comes from.
