# hooks

Knowledge Islands **Claude Code hooks**. **Empty for now**.

This directory is where the harness's hook scripts consolidate — the `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`, and similar handlers that a consuming repo wires into its `.claude/settings.json`. It is an empty shelf today, reserving the five-part structure ahead of the harness shipping hooks; a shelf is not a gap.

Hooks have no dedicated governing skill yet — they are advisory, like [evals/](../evals). The bundle layout is fixed by ADR-KI-HARNESS-002 and governed by the **`ki-harness`** skill under [skills/](../skills).
