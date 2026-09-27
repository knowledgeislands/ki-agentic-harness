# Codex standalone subagent source projections

## Runtime binding

## Source format

Codex custom agents are standalone TOML files in `.codex/agents/` (repository) or `~/.codex/agents/` (user). This adapter treats an authorised physical `.codex/agents/` directory as candidate source only. Symbolic links, unreadable paths, malformed TOML, and non-table roots fail closed.

## Required fields

Every custom Codex agent file defines non-empty string `name`, `description`, and `developer_instructions`. The documented simple convention is to make the filename match `name`; the declared name remains source identity.

## Supported keys

The supported custom-agent projection keys are `name`, `description`, `developer_instructions`, `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, and `skills`. Global `[agents]` settings are not custom-agent source fields and are not inferred from the file.

## Host boundary

Candidate source conformance does not establish discovery, publication, installation, activation, effective model/profile/MCP configuration, permissions, or execution. The current Harness host publishes Codex skills only and has neither a Codex subagent capability/path nor a generic publisher. Route activation evidence to a future authorised host/runtime owner.
