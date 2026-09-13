# Codex binding standard

`ki-binding-codex` owns the native Codex surface after `ki-binding` establishes the canonical source.

The target is `~/.codex/config.toml` and its `[mcp_servers.*]` entries. This is application-owned TOML that can contain non-KI entries, including app-provided servers. Compare full non-secret targeted definitions read-only during audit. Render only canonical entries targeting `chatgpt-codex`, using `codex mcp add` so Codex owns its merge and formatting behavior. Do not template or rewrite the complete TOML file; do not remove unrecognised entries. Repository selection and hosted Codex activation are coordinator-owned; configuration parity never proves either activation or runtime health.

For comparison, a command containing `/` matches only the exact source value. A bare command matches its exact source token or current `Bun.which` result; bare `node` also matches the deterministic `<home>/.local/share/mise/shims/node` projection. The comparison never executes a configured command or accepts basename equivalence. Each argument matches its exact source value or, for `~` and `~/`, its deterministic selected-home expansion. Environment keys are exact, literal values are exact, and an `{ op: ... }` source requires the same key with a non-empty rendered string without reading or comparing its secret value. URLs remain exact. Unrelated native servers are outside comparison scope.

## Partial-update recovery

`codex mcp` has no transaction for a replacement. Before replacing an existing KI-managed entry, the renderer reads `codex mcp get <name> --json` and accepts a snapshot only when it can replay every configured field with `codex mcp add`.

The supported snapshot subset is an enabled stdio server with only `command`, `args`, and literal `env`, or an enabled streamable-HTTP server with only `url`. `cwd`, environment-variable indirection, headers, bearer-token references, timeouts, tool filters, disabled state, and unknown native fields are not replayable by this renderer. It must stop before `remove` for any such record.

After a supported snapshot is captured, the renderer removes the old entry, adds the canonical entry, and reads it again to verify the expected supported shape. If the add or verification fails after a successful removal, it makes one native replay attempt from the captured snapshot. The result reports the primary and recovery outcome, never serialises native JSON or command failures into findings, and never calls a native command in `--check` mode.
