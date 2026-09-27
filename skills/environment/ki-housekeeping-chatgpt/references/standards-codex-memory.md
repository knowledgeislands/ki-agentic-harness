# Codex local-memory policy

Codex local memory is generated state, not the durable Knowledge Islands record. Keep standing guidance in reviewed repository files and route useful learning through existing repository or KB intake and approval rules. ChatGPT web memory is a separate account or workspace feature and is not represented by this filesystem check. [OpenAI's memory documentation](https://learn.chatgpt.com/docs/customization/memories) distinguishes these stores.

## Repository policy

Every repository declaring `ki-housekeeping-chatgpt` sets `auto_memory = "disabled" | "transition" | "enabled"` in its skill table. An unset or invalid value is a **FAIL**, even though local Codex memory is off by default. The declaration records a reviewed repository decision rather than relying on a vendor default.

- `disabled` is the ordinary resolved state. A selected store with files still warns for reconciliation; do not delete or rewrite them automatically.
- `transition` is temporary and always warns. Inspect existing files, route durable value to reviewed repository guidance or KB notes, and then explicitly declare `disabled`.
- `enabled` requires express human approval and a project-scoped Codex setting. It is an exception, not a remediation inferred from existing files.

The shared Codex home store cannot establish which repository owns a memory file. An enabled project setting controls behaviour for that trusted project but does not prove file isolation. Do not present global store contents as this repository's knowledge.

## Runtime settings

The checker reads the selected `$CODEX_HOME` or default `~/.codex` and the repository's `.codex/config.toml`, without reading memory contents. It compares readable user and project `[features] memories` values, with project configuration taking precedence. It does not change either file. A project-level enable is required for an `enabled` declaration; a user-wide enable alone is insufficient. The checked project file must actually load in a trusted project. [OpenAI's configuration precedence](https://learn.chatgpt.com/docs/config-file/config-basic) also includes command-line overrides, profiles, cloud-managed and system defaults; desktop and per-chat controls can change the live state. Therefore a static audit is not proof of effective session memory. Verify an approved opt-in or disablement in the active client before relying on it.

An untrusted project skips its project configuration. If trust or an override cannot be established from available evidence, do not claim a verified project opt-in. Keep chezmoi-managed user settings under separate review rather than changing them as a checker repair.

## Reconciliation

Inspect only the selected Codex home `memories/` directory. The checker counts regular files without reading content or following symlinks. Files under an unset or disabled policy warn for review, and `transition` warns even if the store is empty. Do not create empty memory files, delete existing files, or copy unreviewed memory into Git. The KB's tracked `Admin/MEMORY.md` is repository knowledge, not Codex local memory.
