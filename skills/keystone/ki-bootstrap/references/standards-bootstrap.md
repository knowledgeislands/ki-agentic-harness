# Bootstrap standard

This standard implements the architecture in [ADR-KI-HARNESS-012](../../../../docs/decisions/ADR-KI-HARNESS-012-compatible-harness-publication-and-governed-rubric-boundary.md).

## Contents

- [Scope and ownership](#scope-and-ownership)
- [Authoritative installed harnesses](#authoritative-installed-harnesses)
- [Declarative repository selection](#declarative-repository-selection)
- [Explicit activation scopes](#explicit-activation-scopes)
- [Skill access in delegated work](#skill-access-in-delegated-work)
- [Native repository operations](#native-repository-operations)
- [First-time bootstrap](#first-time-bootstrap)
- [Machine readiness for coordinating work](#machine-readiness-for-coordinating-work)
- [Local harness development](#local-harness-development)
- [Managed-state recovery](#managed-state-recovery)
- [Unowned repository state](#unowned-repository-state)
- [CI and direct automation](#ci-and-direct-automation)
- [Scope and safety separation](#scope-and-safety-separation)

## Scope and ownership

`ki-bootstrap` is guidance for the delivered user setup and capability-activation model. It does not publish a rubric, register a native repository operation, or own public command grammar.

`tools-ki` owns the executable, harness acquisition and inventory, activation, repository resolution, governed-rubric host, transactions, reporting, and diagnostics. Compatible harnesses own their published capability content and domain semantics.

Run `ki --help` for the installed command grammar. This standard explains the boundaries those commands preserve.

## Authoritative installed harnesses

One verified, XDG-managed harness set exists per user. The canonical `knowledgeislands/ki-agentic-harness` is always registered and installed by `ki bootstrap`; each additional compatible harness is installed explicitly.

The harness payload, configuration, cache, and mutable state occupy separate XDG-owned locations. `ki diag --full` reports the effective paths.

`ki harness install <harness-id>` acquires or atomically replaces the selected harness from immutable release evidence verified by the installed `ki` release. `ki harness list` and `ki harness info <harness-id>` inspect the installed set.

Verified installed compatible harnesses are the sole source of registered capabilities and operations.

A local harness checkout, a cached temporary acquisition, a repository `.ki/` directory, or a runtime-discovery link cannot supply a missing capability or substitute for integrity verification.

If a required harness is unavailable, untrusted, or incompatible, the command must fail with recovery guidance before repository or runtime state changes.

The canonical harness cannot be uninstalled. `ki harness uninstall <harness-id>` applies only to an installed non-canonical harness and removes it only after ownership checks pass.

## Declarative repository selection

`.ki.toml` declares the governance coverage of one repository through explicit `[ki-<skill>]` tables.

`ki-repo` owns the file's schema, creation, and declared coverage.

The native resolver physically resolves the selected repository, reads those declarations, validates every explicit dependency, and resolves only the selected skills from verified installed compatible harnesses.

Dependencies must be declared explicitly; a resolver must not inject a baseline, infer an undeclared skill, or silently rename a declaration.

Missing, incompatible, undeclared, or untrusted skills are fail-closed errors before an operation writes.

## Explicit activation scopes

Harness installation and skill activation are separate. Installing a harness does not activate all its skills.

`ki skill add <skill>` and `ki skill remove <skill>` change only the managed discovery links and configuration for the detected user runtimes.

`ki repo skill add <skill>` and `ki repo skill remove <skill>` change only the selected repository: its `.ki.toml` declaration and managed repository-runtime discovery links. They do not alter user activation or uninstall a harness.

Activation resolves a bare skill name only when one installed harness provides it. Ambiguous, missing, foreign, altered, or escaping targets fail closed. Existing KI-managed links are re-pointed only through the command's explicit replacement option.

## Skill access in delegated work

A session can invoke only the user-scope skills (the process skills) and the skills projected into the repository it started in. It does not gain the target repository's declared skills by working there, so a recipient sent into another repository may lack a governance skill that repository declares. Observed for Claude Code (`.claude/skills/`) and Codex (`.agents/skills/`) on 2026-10-04; Cowork has not been verified.

A delegator sending work into another repository therefore names each governance skill the work needs with a readable source: the target's projection (`<target>/.agents/skills/<name>/SKILL.md` or `<target>/.claude/skills/<name>/SKILL.md`) or the canonical harness source. The recipient reads that file when the skill is absent from its own list, rather than discovering the gap by a failed invocation. `ki repo audit --skill <name>` runs from the target repository without runtime invocation. A missing or dangling projection is reported as an activation repair, not repaired by the recipient. Paperclip runs apply the same rule through [repository skills as the execution baseline](../../../agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md#repository-skills-are-the-execution-baseline).

## Native repository operations

A governance skill may publish a compatible in-process rubric catalogue for its mechanical operations. `ki repo educate`, `ki repo audit`, and `ki repo conform` resolve the selected repository's declarations and execute the applicable catalogues in dependency order through one host-owned model.

Scoped execution may run only a compatible skill declared by that repository. A clean clone therefore needs the verified installed harnesses that provide its declarations before native maintenance can run.

AUDIT is read-only. CONFORM validates the complete proposed write set, preserves the physical repository boundary, honours dry-run, commits safe writes transactionally, and re-audits.

The host never executes `scripts/govern.ts`, `.ki/bin` wrappers, copied checkers, a nearby harness checkout, or an ad hoc child process as a fallback.

## First-time bootstrap

`ki bootstrap` establishes the minimum user environment:

- detect supported local agent runtimes;
- create the KI user configuration when absent;
- install or restore the verified canonical harness; and
- activate the core `ki-bootstrap`, `ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-batch`, and `ki-recap` skills for each detected runtime.

Repeated bootstrap is idempotent over correctly managed state. `ki bootstrap --refresh` redetects runtimes and rebuilds the recorded installed-harness and managed user-skill inventory from current state.

Bootstrap does not declare governance in any repository and does not activate every skill in the canonical harness.

## Machine readiness for coordinating work

This checklist is the one path from a fresh machine to a working coordinator. Kris homed it in this skill under BOOT-HOME on 26 October 2026, so that a hook or an output style that fails silently has one accountable place; `ki-coordination`'s Bootstrap begins at the opener and cites this as its "Before the opener" step. Run it on a fresh machine, after a chezmoi, harness or runtime change, and whenever a coordinator looks right but drifts. Each step says what to check and who repairs a failure; no step copies or edits files across the source, installed and runtime-discovery surfaces.

1. **Tools and checkouts.** Workstation tooling has installed `ki`; the Capital and its repositories are cloned at the paths `ki registry` records; each checkout is fetched and level with its remote, because a work package behind its remote bootstraps on stale state. Repair: the workstation tooling for tools, `ki registry` for paths, a fast-forward pull for a checkout behind.
2. **User environment.** `chezmoi apply` has placed the runtime files for Claude Code and Codex, registered the harness `hooks/coordinator-reminder.sh` at `SessionStart` and `UserPromptSubmit` for each runtime, and linked the Claude Code output style `~/.claude/output-styles/ki-coordinator.md` to the primary harness checkout's `output-styles/ki-coordinator.md`; Codex has no output style, so its binding is the hook alone. Check: `readlink ~/.claude/output-styles/ki-coordinator.md` resolves into that checkout and `chezmoi diff` shows nothing pending for those targets. Repair: chezmoi, never a hand edit under `~/.claude` or `~/.codex`.
3. **Harness and process skills.** `ki bootstrap` has installed the canonical harness and activated the core skills, and `ki skill add ki-work-design` has added the design skill, which the core set does not carry. Check: `ki bootstrap --refresh` runs clean and `ki skill` lists `ki-work-design`. Repair: `ki`.
4. **Package-home declarations.** The package-home repository's `.ki.toml` declares `ki-work`, `ki-work-roadmap`, `ki-work-package`, `ki-delegation` and `ki-coordination`; `ki repo skill add` has projected them; and the package-home repository's tracked `.claude/settings.json` selects `"outputStyle": "ki-coordinator"`. Check: `ki repo audit --skill ki-coordination --repo <package-home>` and `ki repo audit --skill ki-work-package --repo <package-home>` pass. Repair: the package-home repository's own committed configuration.
5. **The hook works.** From the actual package-home checkout, outside any run, feed the hook a synthetic owner message and read its line back:

   ```bash
   printf '{"hook_event_name":"UserPromptSubmit","cwd":"%s"}' "$PWD" | env -u KI_AGENT_RUN <harness>/hooks/coordinator-reminder.sh
   ```

   It prints one JSON object whose `additionalContext` opens "In coordinating work only". Silence from the package home means `jq` is missing, the checkout does not declare `ki-coordination`, or the script is not where chezmoi registered it; silence from a repository that does not declare `ki-coordination` is correct.
6. **The style works.** Open a session in the actual package-home repository and send a message: the hook's line is present and the reply takes the `ki-coordinator` shape, the reply forms in a conversational session and the heading and banner after a coordinating opener. In an open Claude Code session, `/output-style` shows `ki-coordinator` selected; a Codex session has no style and shows readiness by the hook's line alone. A reply without heading and banner after a coordinating opener means the style link or the settings selection is wrong: return to steps 2 and 4.
7. **The opener.** `ki agent prompts <territory>` prints each work's opener with its launch command, `claude --name "<label> (<id>)"`, read from `work.md`. Start the session in the actual package-home checkout with that command and paste the explicitly owner-approved opener, including regular/ad hoc work without changing its level; `ki-coordination`'s Bootstrap takes it from there.

A member home must be the existing deliberately approved regular/ad hoc exception, declared in Scope and discoverable through its parent's coverage/home reference; no Project-home exception or package move is implied. An explicitly opened regular coordinator needs the same capability checks, unless its specific owner-approved exception covers the opening, as Acquire intake already has. A package, regular level or successful checklist never opens a coordinator; conversational capture remains available. Missing or ambiguous reader/home evidence is surfaced rather than guessed.

**Ready to coordinate** is the result when every step passes; the first reply after the opener is then the full re-bootstrap report, heading and banner exact. Any failing step is not ready: name it, repair it with its owner's tool, and run the checklist again. A later `ki doctor` check in `tools-ki` may carry steps 1 to 5; readiness never depends on it before it exists.

## Local harness development

Installed verified payloads remain authoritative during ordinary use.

`ki dev local set <harness-id> <local-harness-path>` validates and remembers the local checkout without enabling it. `ki dev local on [harness-id]` is the explicit development-only exception for one configured harness; it switches that harness's payload to the recorded source. `ki dev local off [harness-id]` restores the verified archive.

A nearby checkout is never selected implicitly.

While `ki dev local on [harness-id]` is active the selected checkout is live, so every `ki` invocation on the machine resolves governance through its **working tree**, uncommitted edits included. Governance is then no longer a fixed input: editing the harness changes how `ki repo audit` and `ki repo conform` behave everywhere, immediately, including in sessions that did not make the edit. A rubric criterion can appear, change level, or acquire a new dependency underneath work already in progress, and a repository's audit result can move with no change to that repository at all.

The exposure is widest where harness edits and harness-dependent verification overlap in time, which is most likely when either is delegated: a worker editing the harness and a worker auditing repositories against it are, in development mode, sharing one mutable input. Separating them in time removes the interaction, and `ki dev local off [harness-id]` removes it entirely by resolving the run against the verified archive, which is what makes a result reproducible or comparable across sessions.

`ki diag --full` distinguishes the two cases after the fact. `Installation` and the local harness `source` and `mode` lines say whether governance came from a mutable tree, so an audit or conform result that moved while the target repository did not is explained there rather than in the repository.

## Managed-state recovery

Harness source, installed payloads, runtime-discovery links, and repository declarations are separate owned surfaces. A command refuses unfamiliar, altered, escaping, or unsafe managed state before it overwrites or removes anything. Treat that refusal as a diagnostic: inspect it with `ki diag --full`, `ki doctor`, or the applicable `ki harness`, `ki skill`, or `ki repo skill` command rather than copying or deleting files across surfaces.

After a command changes a managed skill link or switches the selected development source, start a new agent session so the runtime re-scans its discovery directories. An already-running session is not evidence that the new activation is loaded.

## Unowned repository state

Native operations execute only the declared catalogues resolved from verified installed harnesses. A repository directory, executable, manifest, or runtime payload does not become an operation source merely by being present.

Normal repository operations leave unowned material unchanged. They never infer ownership, run it as a fallback, or turn repository maintenance into a broad cleanup operation.

## CI and direct automation

CI and direct automation explicitly establish the verified installed harnesses, then invoke the native `ki repo` operation required by the repository declaration.

They must pin or otherwise verify immutable release evidence according to the installed CLI's trust contract.

If acquisition, verification, registry loading, or declared-skill resolution fails, automation fails rather than falling back to vendored files or a checkout-local executor.

Recovery guidance must identify the failed layer: CLI release, harness acquisition, harness integrity, repository declaration, compatibility, or operation availability.

## Scope and safety separation

User state comprises the XDG-owned harness registry and data, configuration, cache, state, and user-runtime activation.

Repository state comprises `.ki.toml`, repository-scope activation links, and registered native-operation writes.

No unscoped operation infers or crosses either boundary.

Every mutating operation resolves its selected scope first, calculates and validates its complete write or removal set, and refuses unsafe state before any partial change.
