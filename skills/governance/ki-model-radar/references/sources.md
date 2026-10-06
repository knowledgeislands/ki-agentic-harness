# Tracked sources

**Refresh:** external-spec · weekly

This is the refresh ledger for the reviewed sources used by the current snapshot. Evidence identities and claim-level notes live in `radar.toml`.

## Contents

- [Sources](#sources)
- [Last review](#last-review)

## Sources

| Source | Class | Governs | Last reviewed |
| ------ | ----- | ------- | ------------- |
| [Local model-radar roadmap][local-roadmap] | local | Initial route ownership and recommendation (pinned commit) | 2026-10-06 |
| [Thoughtworks Technology Radar FAQ][thoughtworks-radar] | standard | Source ring semantics | 2026-10-06 |
| [Open Source AI Definition 1.0][osi-osaid] | standard | Open Source AI classification | 2026-10-06 |
| [BenchLM methodology][benchlm] | independent | BenchAlign aggregation and uncertainty | 2026-10-06 |
| [AA Intelligence methodology][aa-intelligence] | independent | Intelligence Index v4.3.2 | 2026-10-06 |
| [AA Coding Agent methodology][aa-coding] | independent | Coding Agent Index v1.5 | 2026-10-06 |
| [Arena-Rank methodology][arena-rank] | independent | Bradley–Terry ranking and uncertainty | 2026-10-06 |
| [Arena leaderboard policy][arena-policy] | independent | Public model and data policy | 2026-10-06 |
| [Arena leaderboard changelog][arena-changelog] | independent | Leaderboard method and data changes | 2026-10-06 |
| [SWE-bench leaderboards][swe-bench] | independent | Current benchmark-family shape | 2026-10-06 |
| [Terminal-Bench 4.0][terminal-bench] | independent | Current terminal benchmark | 2026-10-06 |
| [Harbor core concepts][harbor] | independent | Task-environment evaluation unit | 2026-10-06 |
| [HELM repository][helm] | independent | Framework and leaderboard scope | 2026-10-06 |
| [HELM maintenance policy][helm-maintenance] | independent | Maintenance lifecycle | 2026-10-06 |
| [Claude Opus 5 launch][claude-opus] | provider | Identity, access, release | 2026-10-06 |
| [Claude Fable 5.1 model page][claude-fable] | provider | Identity, access, retention | 2026-10-06 |
| [Claude model deprecations][claude-lifecycle] | provider | Opus and Fable lifecycle | 2026-10-06 |
| [Current Claude models][claude-current] | provider | Fable, Opus, Sonnet, and Haiku identities and effort | 2026-10-06 |
| [OpenAI model catalogue][openai-models] | provider | Current flagship identities and access | 2026-10-06 |
| [GPT-6 Astra launch][openai-astra] | provider | Astra release and availability | 2026-09-26 |
| [OpenAI GPT-6 guide][openai-gpt-6] | provider | Current Astra, Sol, and Luna positioning | 2026-10-06 |
| [GPT-5.6 Sol model page][openai-sol] | provider | Previous-family Sol identity, alias, and access | 2026-10-06 |
| [GPT-5.6 Terra model page][openai-terra] | provider | Previous-family Terra identity and access | 2026-09-30 |
| [Gemini 3.8 Flash model page][gemini-flash] | provider | Identity, capability, stable access | 2026-10-06 |
| [Gemini model deprecations][gemini-lifecycle] | provider | Release and shutdown status | 2026-10-06 |
| [GLM-5.3 checkpoint][glm-53] | provider | Identity, weights, deployment | 2026-10-06 |
| [GLM-5.3 licence][glm-53-license] | provider | Exact weights licence | 2026-10-06 |
| [GLM-5.3-Flash release][glm-53-flash] | provider | Identity, scale, deployment | 2026-10-06 |
| [GLM-5.3-Flash licence][glm-53-flash-license] | provider | Exact weights licence | 2026-10-06 |
| [Kimi K3 repository][kimi-k3] | provider | Identity, weights, access | 2026-10-06 |
| [Kimi K3 licence][kimi-k3-license] | provider | Exact weights licence | 2026-10-06 |
| [Qwen3.8 Max model page][qwen-max] | provider | Exact hosted Max identity | 2026-10-06 |
| [Qwen3.8 repository][qwen-family] | provider | Open-model family boundary | 2026-10-06 |
| [Qwen3.8-27B checkpoint][qwen-27b] | provider | Workstation-lane weights and licence | 2026-10-06 |
| [Grok 4.6 launch][grok-launch] | provider | Identity, release, hosted routes | 2026-10-06 |
| [Grok 4.6 model page][grok-model] | provider | API identity and current access | 2026-10-06 |

## Last review

- 2026-09-14 — Replaced the placeholder with individually reviewed primary methodology, benchmark-owner, provider, licence, lifecycle, and local-owner sources.
- 2026-09-17 — Rechecked current provider lifecycle pages and benchmark-owner return triggers. Sol, Astra, Opus 5, and Gemini 3.8 Flash remain active; BenchLM v5.5, Coding Agent Index v1.5, SWE-bench, Terminal-Bench 4.0, and HELM maintenance state did not justify recommendation or lifecycle movement.
- 2026-09-26 — Rechecked every tracked source. Existing model identities remain active, Artificial Analysis advanced to Intelligence Index v4.3.2, and no existing recommendation moved. New model candidates and local route implications were held for a bounded disposition, recorded below on 2026-10-06.
- 2026-09-30 — Targeted release-triggered review added the current Claude and GPT-6 family identities plus GPT-5.6 Terra as an available previous-family option. Existing route defaults and recommendations did not move: provider positioning alone does not establish Codex or Claude Code route fit. Previously tracked sources outside this targeted review retain their earlier review dates.
- 2026-10-06 — Weekly review rechecked every tracked source except the GPT-6 Astra launch post, which returned HTTP 403 and keeps its earlier date. The local Zed agent configuration no longer selects Claude Opus 5 or GPT-5.6 Sol: Claude Code uses the `opus` alias (current Opus 5.5) and Codex uses `gpt-6.1-sol`, so both recorded default routes moved outward to available without adding replacement defaults. The OpenAI catalogue dropped GPT-5.6 Sol, which remains available on its own model page. BenchLM advanced to v5.8 (2026-09-30) with data refreshed 2026-10-05; Terminal-Bench 4.0 was announced 2026-08-28; the Arena policy claim moved from the Arena-Rank post to its own policy and changelog records; Harbor and the Claude deprecations page moved URL; the roadmap evidence is pinned to its last commit after leaving main. Artificial Analysis, SWE-bench, and Terminal-Bench pages show no data date, so those `data_as_of` values are unchanged. Grok 4.7 (2026-09-21) now supersedes Grok 4.6 as the recommended xAI model; Gemini 4 Argon (2026-09-30) is a limited preview only.
- 2026-10-06 — Disposition of the 2026-09-26 candidate-identity follow-up: the 2026-09-30 targeted review discharged it by recording the current Claude and GPT-6 family identities. Route evaluation for any new model needs its own work item with local-fit evidence; this disposition moves no default, route, or recommendation.
- 2026-10-06 — Owner decision: Claude Opus 5.5 through Claude Code and GPT-6.1 Sol through Codex become new Adopt default routes, matching the local Zed agent configuration. Rechecked the current Claude models overview, Claude deprecations page, and OpenAI GPT-6 guide: `claude-opus-5-5` is active with retirement not sooner than 2027-09-22, and `gpt-6.1-sol` remains a current GPT-6 family choice with no deprecation notice. The superseded Claude Opus 5 and GPT-5.6 Sol routes stay available and outward.
- The KI recommendation vocabulary is a documented local adaptation of Thoughtworks' four rings: it preserves Adopt, Trial, Assess, and Caution as Hold rather than claiming an exact reproduction.
- HELM entered maintenance mode on 2026-06-01 and remains watch-level corroborating evidence, not a current frontier-primary source.
- All named initial model identities were substantiated. Hosted-only variants retain a conservative proprietary distribution classification; no public weights licence was found for those exact variants.
- Open watch-item: reassess provider availability, retirement notices, pricing, route support, benchmark versions, and data dates during every weekly refresh.
- Open watch-item: do not promote an open-weight model to Open Source AI Definition conformance without evidence for the definition's data-information, code, and parameter requirements.
- Open watch-item: keep hosted `qwen3.8-max` separate from Apache-2.0 Qwen3.8 open-weight checkpoints.
- Open watch-item: the 2026-10-06 Claude Opus 5.5 and GPT-6.1 Sol defaults rest on the owner decision and runtime configuration rather than a recorded local-fit evaluation; assess them on representative tasks, effort, cost, and effective runtime access before the next default movement.
- Open watch-item: decide whether to add Grok 4.7 and repoint the Grok Build route; track Gemini 4 Argon only once it reaches general availability.
- Open watch-item: re-check the GPT-6 Astra launch post, which blocked automated fetches on 2026-10-06.
- Open watch-item: Claude Haiku 4.5 may retire from 2026-10-15 onwards; it has no route today.

[aa-coding]: https://artificialanalysis.ai/methodology/coding-agents-benchmarking/
[aa-intelligence]: https://artificialanalysis.ai/methodology/intelligence-benchmarking
[arena-changelog]: https://arena.ai/company/leaderboard-changelog
[arena-policy]: https://arena.ai/blog/policy
[arena-rank]: https://arena.ai/blog/arena-rank
[benchlm]: https://benchlm.ai/methodology
[claude-fable]: https://www.anthropic.com/claude/fable
[claude-current]: https://platform.claude.com/docs/en/models/overview
[claude-lifecycle]: https://platform.claude.com/docs/en/about-claude/model-deprecations
[claude-opus]: https://www.anthropic.com/news/claude-opus-5
[gemini-flash]: https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash
[gemini-lifecycle]: https://ai.google.dev/gemini-api/docs/deprecations
[glm-53-flash-license]: https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/LICENSE
[glm-53-flash]: https://autoclaw.z.ai/blog/model/glm-5.3-flash/
[glm-53-license]: https://huggingface.co/zai-org/GLM-5.3/blob/main/LICENSE
[glm-53]: https://huggingface.co/zai-org/GLM-5.3
[grok-launch]: https://x.ai/news/grok-4-6
[grok-model]: https://docs.x.ai/developers/models/grok-4.6
[harbor]: https://docs.harborframework.com/core-concepts/index
[helm-maintenance]: https://github.com/stanford-crfm/helm/blob/main/docs/maintenance_mode.md
[helm]: https://github.com/stanford-crfm/helm
[kimi-k3]: https://github.com/MoonshotAI/Kimi-K3

[kimi-k3-license]: https://github.com/MoonshotAI/Kimi-K3/blob/main/LICENSE
[local-roadmap]: https://github.com/knowledgeislands/ki-agentic-harness/blob/dd45807722a06cf3e54686f4eaa38c1149836e3a/docs/roadmap/KI-HARNESS-REV-003-establish-model-radar.md
[openai-astra]: https://openai.com/index/gpt-6-astra/
[openai-gpt-6]: https://developers.openai.com/api/docs/guides/latest-model
[openai-models]: https://developers.openai.com/api/docs/models
[openai-sol]: https://developers.openai.com/api/docs/models/gpt-5.6-sol
[openai-terra]: https://developers.openai.com/api/docs/models/gpt-5.6-terra
[osi-osaid]: https://opensource.org/ai/open-source-ai-definition
[qwen-27b]: https://huggingface.co/Qwen/Qwen3.8-27B
[qwen-family]: https://github.com/QwenLM/Qwen3.8
[qwen-max]: https://docs.modelstudio.console.alibabacloud.com/en/model-studio/qwen3-8-max
[swe-bench]: https://www.swebench.com/
[terminal-bench]: https://www.tbench.ai/
[thoughtworks-radar]: https://www.thoughtworks.com/radar/faq
