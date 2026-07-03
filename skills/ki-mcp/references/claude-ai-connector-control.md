# Controlling claude.ai MCP connectors

How MCP connectors added through **claude.ai** are governed — the levers, where each one persists, and how they interact with Claude Code. This is the claude.ai leg of the per-surface enablement question in [cross-surface MCP/skill enablement](../../../docs/plans/mcp/002-cross-surface-enablement.md); it supersedes that spike's preliminary "manual-only until proven otherwise" verdict for this surface.

## The one thing to know first

claude.ai connectors are **installed and managed only in the claude.ai web interface**, at the account or organization level — not from within any chat, and not from a Claude Code session. A conversation can only _enable or disable_ what the account already carries; it cannot add or remove a connector. Claude Code, likewise, cannot install a claude.ai connector — it can only _filter_ which of them it exposes (§5).

So "control" is really four layers at three different persistence scopes.

## The layers

| Layer | Where | Scope | Persists beyond one chat? |
| --- | --- | --- | --- |
| Per-conversation toggles | Composer **+** / `/` → Connectors | This chat only | No |
| Per-tool permission mode | Tool menu (Always allow / Needs approval / Blocked) | Account default | Yes |
| Account connectors | [claude.ai/settings/connectors](https://claude.ai/settings/connectors) | Whole account, all clients | Yes |
| Org admin governance | Admin Console → Policies; Organization settings → Connectors | Every member | Yes |

Only the first row is "just this session." Everything that is actual _control_ — what is installed, what is blocked, what an org may use — lives in persistent state (account UI, admin console, or on-disk config), never in a single conversation.

## 1. Per-conversation — scope the surface per task

Open the tools menu (composer **+**, or `/` → **Connectors**) to toggle which connectors and which individual tools are live for that chat. This is how a crowded connector set is kept from flooding context: enable only what the task needs. Resets each conversation.

Watch the tool-count ceiling — connecting many connectors (≈10+) on one account can make chats fail immediately by exceeding Claude's per-request tool limit.† Keep the enabled set lean at the account level rather than relying on per-chat toggles to rescue an overloaded account.

## 2. Per-tool permission mode — the fatigue-vs-safety dial

Each tool can be set to **Always allow**, **Needs approval**, or **Blocked**. Read-only tools default to auto-run; write tools prompt. This default is account-wide and persists across chats.

## 3. Account connectors — the only install point

[claude.ai/settings/connectors](https://claude.ai/settings/connectors) adds or removes prebuilt (Directory) and custom remote-MCP connectors (a remote MCP server URL, with optional OAuth client ID/secret). A connector enabled here appears across web, Desktop, and mobile for that account.

## 4. Organization / admin — governance for Team & Enterprise

The strong levers are admin-side:

- **Organization settings → Connectors** — an Owner/Primary Owner adds an org connector (Browse → **Add to your team**) or a custom remote MCP URL; members then authenticate individually.
- **Admin Console → Policies** — push MCP allowlists and tool permissions to every member with no MDM. Server-managed settings require a direct connection to `api.anthropic.com` and are **bypassed** when traffic is routed through a gateway via `ANTHROPIC_BASE_URL`.
- **Enterprise-managed auth** — provision connectors centrally through the org's IdP, so members do not authenticate each one by hand (beta, Team/Enterprise).
- **Verified-domain restriction** — Enterprise Owners/Primary Owners can prevent services on their verified domains from being connected to accounts _outside_ the organization.

## 5. How claude.ai connectors surface in Claude Code

This is the leg that matters most for the harness. Claude Code applies its own allow/deny over whatever claude.ai exposes, written to on-disk settings (so it outlives the session and cannot be overridden by user or project settings):

- `allowedMcpServers` / `deniedMcpServers` — the denylist always wins, matched by URL, command, or name. Use `serverUrl` to target a claude.ai connector (`serverName` is limited to letters, numbers, hyphens, underscores).
- `allowManagedMcpServersOnly: true` — only the managed allowlist survives the merge.
- **Suppression gotcha** — deploying `managed-mcp.json` _suppresses claude.ai connectors by default_, including ones an admin configured for the org. Restore them with `allowAllClaudeAiMcps: true` (Claude Code v2.1.149+); allow/deny still apply, so specific ones can still be blocked. Disable them entirely with `disableClaudeAiConnectors`.
- `forceRemoteSettingsRefresh` makes enforcement fail-closed — Claude Code refuses to start if managed settings cannot be fetched.

## Picking a lever

- **Individual, day to day** — per-chat tools menu (§1) + per-tool permission modes (§2).
- **Individual, durable** — prune the account connector set (§3); fewer connectors beats more toggling.
- **Org governance** — admin console allowlist and/or Enterprise-managed auth (§4).
- **Governing how they land in Claude Code** — `allowedMcpServers` / `deniedMcpServers` and the `managed-mcp.json` interaction (§5).

## Sources

- [Use connectors to extend Claude's capabilities](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)
- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [Authorize MCP connectors for your entire organization](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)
- [Control MCP server access for your organization (Claude Code)](https://code.claude.com/docs/en/managed-mcp)

---

† Reported behaviour, not a documented hard number — treat ≈10 as a caution threshold, not a spec.
