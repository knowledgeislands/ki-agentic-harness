# Sources — ki-handoffs

**Refresh:** canonical · on-change

The doctrine this skill governs is an in-house methodology, not a tracked external specification, so it carries no clock cadence: it is re-anchored **on change** — when the reasoning-layer split, the quality bar, or the composition boundary with `ki-tokenomics` moves in practice. The record of _what_ changed is the REFRESH commit, not a changelog here.

| Source | Tag | Governs | Last reviewed |
| --- | --- | --- | --- |
| [Prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) | BP | The reasoning-layer split; self-verification; tiered execution | 2026-07-02 |
| `ki-plans` — plan format & lifecycle | IN-HOUSE | The host artifact in a code repo; the base quality bar | 2026-07-02 |
| `ki-streams` — Enactment Process & proposal Checklist | IN-HOUSE | The host artifact in a KB | 2026-07-02 |
| `ki-tokenomics` — model-tier lever (standard §4, §8) | IN-HOUSE | Tier cost and selection (the boundary this skill defers to) | 2026-07-02 |

## Last review

- **Pinned:** initial authoring, 2026-07-02.
- **Confirmed:** the split owns _how to make work delegable_; `ki-tokenomics` owns _which tier costs what_. Tiers are named semantically; concrete model ids defer to `claude-api`.
- **Watch-items:** the Fable-5 prompting guidance is external and may move — on a REFRESH, re-fetch it and diff the split / self-verification advice against this standard. If it starts driving the standard continuously, reconsider the `canonical · on-change` class.
