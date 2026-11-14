# Sources

**Refresh:** external-spec · monthly

The adapter contract and the work subcommands are house practice, reviewed when an adapter, a subcommand or the authority model for a tracker changes. The `recap` subcommand also tracks runtime documentation that moves, so the file is reviewed monthly. Each subcommand's local authority and earlier reviews follow, as the separate skills recorded them before they folded into this one; their lines keep the names the skills had then.

## Local authority

### Adapters

The adapter contract is a Harness-owned boundary. Its current local sources are the [repository kind contract](../../../keystone/ki-repo/references/standard-repository.md#42-repository-kind-and-knowledge-base-stores) and the [KB Streams placement contract](../../../repository/ki-repo-kb-streams/references/standards-streams-structure.md#roadmap). Review them when adding or changing an adapter, a shared process skill, or the authority model for a tracker. Remote adapter documentation is adapter-owned and must be refreshed by the owning adapter skill.

### implement

The [change-management adapter standard](standards-change-management-adapters.md) is normative for selected-adapter resolution and the remote no-execution boundary.

The [repository work-item format](../../../work/ki-work-roadmap/references/standards-work-item-format.md#awaiting-review) is normative for the roadmap review packet: its six headings, exact order, and producer/consumer semantics.

The [repository-roadmap lifecycle](../../../work/ki-work-roadmap/references/standards-repository-roadmaps.md#work-item-discipline) is normative for the local record lifecycle and `baseline_ref` evidence.

### accept

The [change-management adapter standard](standards-change-management-adapters.md) is normative for selected-adapter resolution and the remote no-execution boundary.

The [work-item format](../../../work/ki-work-roadmap/references/standards-work-item-format.md#awaiting-review) is normative for the exact six-part review packet and its producer/consumer semantics.

The [roadmap lifecycle and trade-retention rule](../../../work/ki-work-roadmap/references/standards-repository-roadmaps.md#work-item-discipline) is normative for closure, selected pruning, and completion-observation retention.

The [housekeeping template state machine](../../../work/ki-work-recurring/references/standards-recurring-work.md#due-run-procedure) is normative for template shape and the division between spawning and successful completion.

### recap

The runtime documentation behind the transcript and compaction claims:

| Source | Last reviewed | Governs |
| --- | --- | --- |
| [OpenAI Codex developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) | 2026-09-26 | User-invocable `/compact` and current Codex session controls |
| [OpenAI Codex hooks](https://learn.chatgpt.com/docs/hooks) | 2026-09-26 | Manual/automatic compaction hooks and transcript-format stability boundary |
| [Claude Code sessions](https://code.claude.com/docs/en/sessions) | 2026-10-06 | Session storage, compaction, and transcript parsing boundary |
| [Claude Code hooks](https://code.claude.com/docs/en/hooks) | 2026-09-26 | Manual/automatic compaction events |
| [Claude Code environment variables](https://code.claude.com/docs/en/env-vars) | 2026-10-06 | `CLAUDE_CODE_SESSION_ID`, `CLAUDECODE`, `CLAUDE_CONFIG_DIR`, and `CLAUDE_CODE_PROJECT_DIR_NAME` for live-session transcript location |

### design

The loop is house practice, recorded from its first full run rather than imported from an external method.

| Source | Retained idea | Explicitly not adopted | Last reviewed |
| --- | --- | --- | --- |
| The roadmap-model design run of 7 October 2026, whose outcome Knowledge Islands Principal consolidated into one Decision Record | Five stages; a brief with a numbered reflection; three independent reviewers on different models, one also fact-checking the brief; a merged report settling disputes on evidence; the owner's decisions with an authority grant; a pilot record before parallel waves | Its particular reviewer roster, keeping the artefacts in an untracked local folder, and later filing them as permanent supporting files in the decisions collection | 2026-10-07 |
| DOC-TYPES a and STD-BASE a, Kris's word at 22:05 CET on 8 November 2026, relayed by `personal.reg.inbox` | The design is written as a change document, `<slug>.change.md`, carrying `Base: ki-agent-backpack@<commit>` and `Touches:`, and rebased from `git diff <base>..main -- <touched files>` | A separate design type, version numbers and per-file hashes | 2026-11-08 |

## Last review

On 14 November 2026, under PROCESS-SUBCOMMANDS and RENAME-NOW in the Cairn summit's change 25, the `ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-recap` and `ki-work-design` process skills folded into this skill as the `next`, `plan`, `implement`, `accept`, `recap` and `design` subcommands, and this skill now leads the Work guild. Each skill's body became its `mode-<verb>.md` reference, loaded only when the subcommand is called, and its standard, scripts and templates moved here unchanged in substance. The kept boundaries survive as rules of their subcommands: `implement` never accepts its own work, and `accept` needs the owner's approval. No external source was refreshed.

### implement

On 2026-08-12, the selected-adapter standard continued to make remote execution fail closed pending `KI-HARNESS-FND-014`; the roadmap work-item format continued to own the six-part review packet. This skill consumes those contracts and does not redefine them.

Kris's 13 October 2026 coordinating-work rule, carried by [Coordinator responsiveness](../../../work/ki-coordination/references/standards-coordination.md#coordinator-responsiveness), requires detached background runs for implementation units. His 16 October separation of [conversational bounded work](../../../work/ki-coordination/references/standards-reporting.md#conversational-bounded-work) preserves direct work in an ordinary session; bounded subagents inside an authorised delivering run do not replace the coordinator's detached run.

### accept

On 2026-10-05, the owner approved the cross-repository reference preflight after a Done record remained linked from an archived, deregistered peer. Pruning now distinguishes mechanically discovered references from surviving dependencies, records search coverage, verifies immutable history links, and retains affected records when evidence or repair authority is unavailable. The change grants no peer mutation or publication authority.

On 2026-08-12, the integrated local standards retained selected-adapter resolution, the exact six-heading review packet, completion-observation retention, and the successful-run boundary. `ki-accept` consumes those contracts without creating a remote execution path or a second tracker.

### recap

A 2026-11-07 in-house review under `cm-tidy` applies RECAP-NARROW, which Kris took that day as option a): the skill keeps only the conversational session recap and its learning routes. The `checkpoint <work id>` composition and its preflight model are removed, since `ki-work-package` owns every package write, and so is the batch-retention housekeeping, since `ki-batch` is retired under BATCH-RETIRE. The RECAP-NAME paragraph below records the argument's earlier name only.

A 2026-10-26 in-house review under `wow-harness-a` applies RECAP-NAME, which Kris decided that day: the composition argument is `checkpoint <work id>`, because the work model made work the unit and the argument already resolves a work id; `checkpoint <thread>` is accepted through the tolerance window. Runtime sources were not re-fetched.

A 2026-10-21 in-house review under `wow-day-push-reporting` applies Kris's instruction to omit routine push state and other sessions' stacked commits from reports, preserving a report of a failed push that prevented publication of the session's own unit. The recap now follows the aligned `ki-git` and `ki-coordination` rule. Runtime sources were not re-fetched; implementation history is in Git.

On 2026-09-26, current official documentation still showed both Codex and Claude Code exposing user-invocable `/compact` alongside automatic compaction. Codex also documents explicit pre- and post-compaction hook events. These controls do not grant an agent standing authority to invoke compaction. Both vendors expose transcript paths or files, but their structured formats remain version-sensitive convenience surfaces; Git remains the authoritative repository-grounding source.

On 2026-10-06, Claude Code documented `CLAUDE_CODE_SESSION_ID` as set in Bash, PowerShell, hook, and stdio MCP subprocesses, matching the hook `session_id` and updated on `/clear`; after `--continue` or an ID-less `--resume` it may carry the initial startup ID. Transcripts live at `<config>/projects/<project>/<session-id>.jsonl`. `<config>` is `CLAUDE_CONFIG_DIR` or `~/.claude`. `<project>` replaces every non-alphanumeric character of the working directory with `-`, is truncated with a hash beyond 200 characters, or is named by `CLAUDE_CODE_PROJECT_DIR_NAME`, and `/cd` relocates it. The helper therefore probes every project directory for the identified session rather than deriving the launch slug. The Codex documentation reviewed exposes no equivalent session-identity variable, so Codex selection remains bounded repository-matched discovery.

On 2026-10-14, under the `pmo-simplify` brief, the coordinating-thread hand-off was removed from this skill, which keeps the ordinary session recap only, after Kris decided in the `ways-of-working` thread, as received: "RECAP-OWNER - ki-recap keeps the ordinary session recap only, and ki-coordination's standard carries the one sentence saying so".

### design

On 2026-10-07 the run's brief, three reviews, merged report and decisions file shaped the stage contracts and templates. The run first kept its artefacts only in local state, and then beside its Decision Record in the decisions collection. The owner then ruled that design artefacts are temporary working material kept beside the subject Project or Initiative and deleted once consolidated, and that the decisions collection holds only Decision Records and their index; the artefact-home rule follows that ruling.

Kris's 14 October 2026 decision-tag rule, carried by the [coordination decisions life cycle](../../../work/ki-coordination/references/standards-decisions.md#decisions-life-cycle), supersedes numbered decision entries. Reports and the owner's decisions use matching tags; numbered reflection points remain claims.

On 2026-11-08 Kris took DOC-TYPES a and STD-BASE a at 22:05 CET, relayed by `personal.reg.inbox`: two document types only, the change document (`.change.md`) and the standard, a design note becoming a change document; and every change document carries `Base: ki-agent-backpack@<commit>` and a `Touches:` line, rebased by reading `git diff <base>..main -- <touched files>`. The [artefact home](standards-work-design.md#artefact-home) now names the change document; `ki-authoring` owns the type and its header.
