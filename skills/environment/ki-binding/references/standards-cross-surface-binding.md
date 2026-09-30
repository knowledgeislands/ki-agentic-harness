# Canonical MCP binding standard

The portable contract is one `mcpServers:` YAML inventory at `$XDG_CONFIG_HOME/ki/mcp-servers.yaml` (default `~/.config/ki/mcp-servers.yaml`). `$KI_MCP_SOURCE` may explicitly override that path.

Every entry has a unique non-empty `name`, a non-empty unique `clients:` list, and exactly one definition. A stdio definition is `command`, optional `args:` strings, and optional literal-string or 1Password-reference `env:` values. A URL definition is `url`, optional literal-string or 1Password-reference `headers:`, plus one `transports:` mapping for every targeted client: `http` or `sse` for `mcporter`, `claude-code`, and `claude-desktop`; `streamable_http` for `chatgpt-codex`. A 1Password reference is an exact `{ op: "op://..." }` mapping. Either definition may carry a `lifecycle` of `ephemeral` or `keep-alive` for renderers that manage connection retention. No other fields are portable. Recognised client tokens are `mcporter`, `claude-code`, `claude-desktop`, and `chatgpt-codex`.

`ki-binding` compares an explicitly selected, readable mcporter configuration with entries targeting `mcporter`; literal header values and lifecycle must match, while a secret-derived header value is checked only for non-empty presence and is never reported. Without that evidence, target and runtime parity are unavailable. `ki-binding-claude` owns Claude Code, Desktop, Cowork, and web convention. `ki-binding-chatgpt` owns native Codex TOML. A renderer such as `ki-binding-chezmoi` owns source-structure evidence, while render, apply, activation, and runtime health remain distinct evidence classes.

Edits flow through the canonical source and its selected renderer or adapter. Never hand-edit a rendered target as a substitute for changing its source.

## Host surface selection

A host-bound runtime reaches KI MCP servers through its own host's mcporter bridge. Claude Code, Claude Desktop, Codex and a Paperclip run are host-bound on whichever host they run on. claude.ai connectors belong to cloud sessions. An unauthorised connector in a host-bound session is expected state; report it only when a task needs that service and no bridge route provides it.

Each host owns its canonical inventory, bridge and secret store. A runtime never depends on another host's loopback bridge. Reaching a bridge across hosts is an exposure decision for the host's owner, not a binding default. A runtime isolated from user configuration, such as a Paperclip run, needs its coordination platform's supported route to the bridge; `ki-agent-coordination-paperclip` owns that route.
