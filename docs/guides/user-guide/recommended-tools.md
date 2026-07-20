# Recommended tools

Optional system-level tools that affect a person's machine rather than a governed repository. Skills, MCP servers, and day-to-day sessions can benefit from them, but none is required merely to read or audit the harness. [Install and get started](getting-started.md) explains when repository bootstrap or optional user-environment setup is appropriate.

## chezmoi (dotfile and machine-config management)

[chezmoi](https://www.chezmoi.io) manages the dotfiles and machine-level config this guide references — the per-repo `CLAUDE.md` imports, the `headroom-ai` and `mcporter` LaunchAgent plists, and the harness-mode notes chezmoi templates into `CLAUDE.md`. Machine-specific state (which `headroom-ai` mode is active, OAuth client secrets resolved from 1Password) is chezmoi-templated rather than hand-edited, so `chezmoi diff` / `chezmoi apply` is the way to pick up drift rather than editing the rendered files directly.

```bash
brew install chezmoi
chezmoi init <your-dotfiles-repo>
chezmoi apply
```

## headroom-ai

headroom-ai provides context compaction management (`PreCompact` hook) and shell-output compression via its bundled RTK component.

```bash
brew install headroom-ai
```

headroom-ai runs in one of two modes:

- **Proxy mode** — `headroom proxy` starts a local proxy on port 8787; Claude Code is pointed at it via `ANTHROPIC_BASE_URL=http://127.0.0.1:8787`.
- **Wrap mode** — `headroom claude` wraps the Claude CLI directly without a separate proxy process.

The harness CLAUDE.md notes which mode is active in the current machine's chezmoi config.

### Coverage by runtime

Headroom is not a machine-wide or generic desktop-application proxy.

Treat an agent as covered only when its model requests appear in Headroom's proxy statistics or logs.

An installed Headroom MCP server, a running local proxy, or a healthy `/health` response does not establish model-traffic coverage.

| Runtime                      | Current model-traffic coverage | Evidence                                |
| ---------------------------- | ------------------------------ | --------------------------------------- |
| Claude Code                  | Routed once configured         | Proxy statistics or logs                |
| Claude Desktop               | Direct — not covered           | No desktop proxy route                  |
| ChatGPT / Codex Desktop      | Direct — not covered           | No active proxy route                   |
| Other API-compatible clients | Conditional                    | Explicit proxy or wrapper configuration |

Claude Code is the supported, measured path: `ANTHROPIC_BASE_URL` or the Headroom wrapper points its CLI at the local proxy.

Claude Desktop's subscription-backed traffic is not routed by the CLI integration.

Its MCP configuration is separate and does not proxy chat traffic.

The formerly managed ChatGPT/Codex proxy route is intentionally disabled until a supported path proves reliable telemetry and meaningful savings.

Verify every other client separately; coverage never carries over from another runtime.

Check a claimed route with `headroom perf --hours 1 --format json` or the local `/stats` endpoint, and confirm the relevant client appears in the result before relying on it for token savings.

## Codex skill discovery and experiments

The `skills` command-line tool can install third-party skills into a user's Codex skill directory. These are personal, user-scope additions: they do not become part of a governed repository or alter its declared KI skill set. Review a skill's source and behaviour before adding it, especially if it installs hooks or changes agent instructions.

To try [caveman](https://github.com/JuliusBrussee/caveman) in Codex:

```bash
npx skills add JuliusBrussee/caveman -a codex
```

To add the `find-skills` discovery skill:

```bash
npx skills add vercel-labs/skills@find-skills
```

Start a new Codex turn after installation so the newly installed skills are available for selection.

## mcporter (MCP proxy daemon)

mcporter consolidates all KI-owned MCP servers behind a single keep-alive daemon and exposes them through a single HTTP MCP endpoint, reducing the `~/.claude.json` `mcpServers` block from many stdio entries to one URL entry.

```bash
brew install steipete/tap/mcporter
```

Two LaunchAgents are deployed and activated by chezmoi:

| LaunchAgent label         | Command                              | Purpose                                          |
| ------------------------- | ------------------------------------ | ------------------------------------------------ |
| `sh.mcporter.daemon`      | `mcporter daemon start --foreground` | Keep-alive process manager for all servers       |
| `sh.mcporter.http-bridge` | `mcporter serve --http 3333`         | HTTP MCP endpoint at `http://localhost:3333/mcp` |

mcporter's config lives at `~/.mcporter/mcporter.json` (chezmoi-managed). It embeds full server definitions with `"lifecycle": "keep-alive"` for each server, resolved from the same `mcp-servers-json` chezmoi template that generates the Claude Desktop config.

After `chezmoi apply` loads the plists, activate them:

```bash
launchctl load ~/Library/LaunchAgents/sh.mcporter.daemon.plist
launchctl load ~/Library/LaunchAgents/sh.mcporter.http-bridge.plist
```

Tools are exposed as `server__tool` (double underscore). `~/.claude.json` should contain only a single `ki-mcporter` URL entry under `mcpServers`:

```json
"ki-mcporter": { "type": "url", "url": "http://localhost:3333/mcp" }
```

Verify with:

```bash
mcporter daemon status          # all servers idle/running
curl http://localhost:3333/mcp  # should return a valid MCP JSON response
```

Both mcporter's `config add` and Claude Code's own `claude mcp add` only accept `http` / `sse` / `stdio` transports — a server that speaks raw WebSocket only (no HTTP/SSE/stdio front end) cannot be registered through either, mcporter included. It is not a universal bridge between transports; confirm a candidate server's transport before assuming mcporter can front it.

## claude.ai connectors — the managed alternative

For a third-party SaaS integration (GitHub, Linear, Slack, Notion, the Google and Microsoft suites, and the like) there are two ways to get its tools into a session, and a local MCP server is only one of them. The other is a **claude.ai managed connector**, authorised once in claude.ai connector settings. Given this setup, the managed route is often the lower-friction one: Anthropic handles the OAuth, so there is no local OAuth flow to complete, no keep-alive daemon or secrets on the machine, and it works on surfaces where an interactive OAuth flow cannot run (a non-interactive Claude Code session, for instance, cannot complete one — it can only use a connector that is already authorised). Managed-connector schemas load on the claude.ai web / Desktop surface, where you toggle them per-conversation in the compose-bar tools menu, rather than into the Claude Code local surface.

Which route to prefer, per integration:

| Prefer                  | When                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **claude.ai connector** | A hosted connector exists and you mainly use that integration on claude.ai web / Desktop — least setup, no local OAuth. |
| **Local MCP server**    | You need it in the Claude Code CLI, need tools no connector offers, or need a KI server's own access gate + audit log † |

† The KI-owned `mcp-*` servers (workspace MCPs with the annotation-driven access-level gate and audit logging) are always the local route — there is no managed equivalent.

Do not wire the same integration **both** ways on the same surface — that loads two copies of its tool schemas. `ki-binding` governs which surface runs which server from the single `mcps.yaml` source and audits that the surfaces agree; see [Tuning](tuning.md) for the leanness view of the same choice.

## VS Code command-execution MCP servers — evaluate before installing

A recurring want on this surface: letting the agent trigger a VS Code command directly (e.g. "Developer: Reload Web Views" after a session `/rename`, since the extension does not refresh its own UI on rename). Community MCP servers exist that expose `vscode.commands.executeCommand()` as a callable tool — for example `louisfghbvc/mcp-vscode-commands`. Before adopting one, check two things: whether it ships a signed `.vsix`/verified publisher (unsigned third-party extensions granting arbitrary command execution over an unauthenticated local socket are a real trust boundary, not a formality), and which transport it speaks — Claude Code's `claude mcp add` and mcporter's `config add` both only accept `http` / `sse` / `stdio`, so a WebSocket-only server (as `mcp-vscode-commands` currently is) cannot be wired into either regardless of how it is packaged. No such server is currently adopted here; this is a note for the next time the want resurfaces, not a recommendation.
