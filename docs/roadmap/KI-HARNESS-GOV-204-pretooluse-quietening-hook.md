---
id: KI-HARNESS-GOV-204
area: GOV
title: PreToolUse quietening hook
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-17T22:06:58Z
updated_at: 2026-10-17T22:06:58Z
---

# KI-HARNESS-GOV-204: PreToolUse Quietening Hook

## Goal

The harness decides, on a week's evidence from the source-level cuts, whether to ship a Claude Code hook that quietens noisy tool calls as a backstop: a `PreToolUse` hook that rewrites a known noisy command into its quiet form, or a `PostToolUse` hook that condenses a successful result, so that gate, audit and Git output stays out of an agent's context when a brief or a skill has not already made the call quiet.

## Context

Kris Brown answered QUIET-HOOK on 17 October 2026 at 22:50 BST in the ways-of-working thread: "Yes: capture an unadopted tools-ki record for a KI_QUIET setting implying --concise --progress never, and an unadopted ki-agentic-harness record for a PreToolUse quietening hook, first checking the current Claude Code hooks reference; decide whether to build them after a week of the source-level cuts." This record is the harness half; the `tools-ki` `KI_QUIET` record is captured separately in that repository.

The source-level cuts landed on 17 October 2026: the harness pre-commit gate went quiet on success, ki-principal's gate followed, and the `ki-coordination` quiet-tools rule tells agents to run Git with `-q` and report each outcome in one line. The hook is a backstop for calls that escape those cuts, not a replacement for them.

### Hooks reference, checked 17 October 2026

Checked against [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks), which shows no date; the newest version it cites is v2.1.295. The installed Claude Code here is 2.1.292.

- `PreToolUse` returns `hookSpecificOutput` with `permissionDecision` (`allow`, `deny`, `ask` or `defer`), `permissionDecisionReason`, `updatedInput` and `additionalContext`. `updatedInput` "replaces the entire input object, so include unchanged fields alongside modified ones": a rewritten Bash call must resend `command` with any `description`, `timeout` and `run_in_background`. Permission rules and Bash auto-background eligibility are evaluated against the rewritten input, and deny and ask rules still apply whatever the hook returns. Paired with `allow` it skips the prompt; with `ask` it shows the rewritten input to the user; `defer` ignores it.
- When several `PreToolUse` hooks disagree, `deny` beats `defer`, `ask` and `allow`. Exit 2 is a deny with stderr as the reason.
- `PostToolUse` cannot block the call, which has already run. `updatedToolOutput` replaces what Claude sees; for built-in tools it must match the tool's output schema, Bash's being `stdout`, `stderr`, `interrupted` and `isImage`, or it is ignored and the original output used. MCP output is passed through without validation. Telemetry still records the original output. `decision: "block"` only adds `reason` beside the original output.
- Matchers filter on `tool_name`, with `Bash|PowerShell` advised for shell hooks; the `if` field takes one permission rule such as `Bash(git *)`, is checked per subcommand and is best-effort, not an enforcement boundary.
- Command hooks default to a 600-second timeout. A timed-out or failed `PreToolUse` hook does not block; the call goes through the normal permission flow unless `onFailure: "block"` is set, which needs v2.1.295. `additionalContext` and stdout are capped at 10,000 characters.

So both routes are available: a `PreToolUse` rewrite changes what runs, adding `-q` or `--concise` before the call, and a `PostToolUse` replacement changes only what the model reads afterwards, which hides output from the agent without changing the command or its exit status.

## Boundary

- In: the decision whether to build; if built, one hook payload in `hooks/` with its tests, the noisy-command list it acts on, and its documentation; the choice between rewrite and replacement.
- Out: the source-level cuts themselves, already delivered; the `tools-ki` `KI_QUIET` setting; writing `.claude/settings.json`, which `ki` does not do and a user-environment manager binds; any hook that hides a failure, a non-zero exit or a gate's failing findings.

## Discussion

Captured on Kris Brown's QUIET-HOOK answer. Decision due on 24 October 2026, one week after the quiet gates landed on 17 October 2026. Evidence for the decision: how often agent sessions and run reports in that week still carried pasted gate, audit or Git output.

Questions for that decision: whether a rewrite is safe enough to auto-`allow`, or should only `ask`; whether replacing output for the agent while telemetry keeps the original is acceptable; how the hook keeps failures and non-zero exits visible in full; and whether the backstop is needed at all once the `KI_QUIET` setting exists.
