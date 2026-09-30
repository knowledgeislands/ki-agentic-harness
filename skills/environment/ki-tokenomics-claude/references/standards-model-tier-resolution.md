# Claude model-tier resolution standard

This is dated provider evidence for considering Claude models, not a portable policy, effective-session observation, or agent default. The portable `ki-tokenomics` purposes remain `frontier`, `reasoning`, `standard`, and `fast`.

| Purpose | Current candidate | Why consider it | Default effort |
| ------- | ----------------- | --------------- | -------------- |
| `frontier` | Claude Fable 5.1 | Demanding reasoning and long-horizon agentic work | `high` |
| `reasoning` | Claude Opus 5.5 | Long-running coding and knowledge work | `medium` |
| `standard` | Claude Sonnet 5.5 | Faster balanced work | `high` |
| `fast` | Claude Haiku 4.5 | Focused work at the fastest tier | Not supported |

The [current Anthropic model overview](https://platform.claude.com/docs/en/models/overview) supports these identities and provider positioning as of 2026-09-30. It recommends starting with Opus 5.5 for most workloads and using Fable 5.1 where demanding work or evaluation warrants it. These rows are candidates, not a claim that KI's Claude Code route exposes or should default to any of them. Haiku 4.5 has a near-term retirement commitment and needs lifecycle rechecking before a durable fast-tier binding.

Effort is model-dependent: `high` is not a universal default, and Haiku 4.5 does not support the same effort control. [Anthropic's versioning guidance](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions) distinguishes fixed model identities from aliases; do not assume a dateless ID silently advances to a newer model.

Before moving a KI route default, verify runtime access and run representative coordination, judgment, and mechanical tasks at supported efforts. Record quality, corrections, latency, and cost evidence; provider claims alone do not establish local fit. Effective model selection belongs to the runtime configuration, not this skill.
