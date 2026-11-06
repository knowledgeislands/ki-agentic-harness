# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › footer-counts

**🤖 → 👤 Handoff to supervisor · Run report at 20:38 GMT · last mark none**

---

## Done

- FOOTER-COUNTS is in the `ki-coordination` standard and on `main` and `origin` as `27833e5b` (`feat(ki-coordination): add roadmap and package count lines to the Summary footer`). It covers the Banner section's new **Roadmap and package lines** paragraph and banner order, the Summary's footer, the output-style source and the regenerated `output-styles/ki-coordinator.md`. The change is recorded in the skill's sources review.
- The two lines as landed, each after a blank line, directly beneath the banner's counts line:
  - `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas`. The counts come from `ki repo roadmap summary` in the package's repository, not `ki repo roadmap list`, which gives no counts. Records is the total, ideas the `triage` horizon, done awaiting prune the done and cancelled records, and open everything else. A count of one is written in the singular (`1 record`, `1 idea`). The line is left out where the repository has no roadmap.
  - `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`. Inbox is the `## Inbound` lines in `messages.md` and outbox the `## Outbound` lines. Held is the items under `## Held` in `state.md`. Awaiting ACK is the Outbound lines with no ACK yet, so it always matches the `[awaiting ACK]` items.
- Placement: the order is the heading, the counts line, the roadmap line, the package line, the list, the heading-for line, the mode lines and then the thread line, which stays last. "The hold line" is the counts line of an On hold banner, `⏸️ drained · 🅿️ <n> queries parked`, so on held work the two lines sit beneath it, matching household-terra's "after the hold line".
- Scope narrowed after a later guild decision: the brief asked for the lines on every banner that closes a Summary, re-bootstrap or hold report. Before pushing, I read the guild's later FOOTER-NAMES entry (20:31 GMT) in its decisions log. It recommends, at high confidence, that the lines sit in the Summary footer only, and asks this run to name both footer forms in the standard. That steer never reached this run as a message, but I applied it as logged. The standard now names the **long form** (the Summary's footer: art, then the glyph banner with the two lines) and the **short form** (the glyph banner alone, which closes re-bootstrap, hold, run and Finished reports and every other banner reply).
- `scripts/banner.test.ts`: the Summary banner examples (With worker and handoff) carry both lines, and the draining, On hold and Finished examples carry neither. The output style stays byte-identical with the standard. A new test checks the lines' shape, singular forms, placement and absence from the short form. The awaiting-ACK count is checked against the `[awaiting ACK]` items.
- Checks, each run on the final rebased commit:
  - `bun run test`: passed, 1557 tests.
  - `bunx tsc --noEmit`: passed.
  - `ki repo audit --skill ki-coordination` in an isolated home: no failures. Its 5 warnings are outside this change: COORD-8 bindings are absent in the isolated home, and the `ki.reg.guilds` package has tidy and query-count warnings.
  - `ki-git` checks before committing: `rumdl fmt` and `rumdl check` and `biome check` were clean on every committed file, the hook passed, and the committed paths are clean.
- Ready-to-send REFRESH line for ki.sop.main to broadcast:

  ```text
  REFRESH · ki-coordination 27833e5b · FOOTER-COUNTS (Kris, 6 Nov): a Summary's footer now carries, beneath its counts line (the hold line when On hold), `🗺️ roadmap · <n> records · <n> open · <n> done awaiting prune · <n> ideas` from `ki repo roadmap summary`, left out without a roadmap, then `📦 package · inbox <n> · outbox <n> · held <n> · awaiting ACK <n>`. Long form: art plus banner with these lines; short form: banner alone, for every other report. Reread Banner › Roadmap and package lines.
  ```

## In Progress

Nothing is running. The worktree `footer-counts` at `/Users/krisbrown/.local/state/ki/agents/wow-open/footer-counts/worktrees/ki-agentic-harness` is clean and left for `ki agent close`.

Outstanding - no action requested now:

- Telling household-terra and broadcasting the REFRESH is the guild's next step, using the line above.
- The FOOTER-HOOK message (MSG-e7b839ee) now in the guild's inbox asks for a `Stop` hook that enforces the footer. That is separate guild work, and this run did not touch it.

## Queries

No outstanding queries.

### 🤖 → 👤 Handoff to supervisor · since 20:38 GMT

🤖 0 running · 👤 0 with you

- [finished] footer-counts · run/footer-counts · since 20:38

🧵 ki.reg.guilds
