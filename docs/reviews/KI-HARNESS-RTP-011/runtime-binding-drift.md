# Runtime binding drift review

## Scope and boundary

This review compares the canonical portable MCP inventory with readable Claude and Codex native configuration. It records names and non-secret structural differences only. It does not reproduce environment values, modify configuration, prove activation, or claim runtime health.

## Evidence

The portable `ki-binding` audit passes. The selected canonical source is valid and every expected registration is present.

Claude Code targets `ki-mcporter` and matches its complete non-secret definition.

Claude Desktop contains all six targeted registrations:

- `hnr-mcp-ki-kb-notion-mirror`
- `hnr-mcp-m365`
- `kit-mcp-git-audit`
- `kit-mcp-gsuite`
- `kit-mcp-housekeeping-claude`
- `kit-mcp-ki-kb-fs`

For each registration, arguments and environment structure match. The only reported difference is `command`: the canonical bare `node` command is deliberately rendered as the stable mise shim, while the audit resolves it to the currently selected versioned Node executable. Both resolved to Node `v24.21.0` during inspection.

Codex contains both targeted registrations. `ki-mcporter` matches. `kit-mcp-housekeeping-chatgpt` differs only where rendering is expected to transform the portable source: the bare command becomes the stable mise shim, its home-relative argument becomes an absolute path, and secret references become non-empty runtime values. The unrelated `computer-use`, `headroom`, and `node_repl` entries remain outside the KI binding ownership boundary.

## Classification

- Missing registration: none.
- Stale registration: none evidenced.
- Intentional representation: six Claude Desktop command projections and the Codex command, argument, and secret-reference projections.
- Unavailable evidence: activation and runtime health, which these audits deliberately do not prove.

The two warnings therefore describe comparator drift against the accepted renderer representation, not configuration that should be conformed.

## Recommendation

Do not modify user-level configuration. [KI-HARNESS-GOV-059][gov-059-record] captures the bounded audit-normalisation change. Its implementation should align Claude and Codex comparison semantics while retaining strict detection for genuinely missing or stale registrations.

## Verification

- `ki repo audit --skill ki-binding --repo .` passed.
- `ki repo audit --skill ki-binding-claude --repo .` reproduced one diagnostic warning covering Claude Desktop.
- `ki repo audit --skill ki-binding-codex --repo .` reproduced one diagnostic warning covering Codex TOML.
- Sanitised structural inspection found no missing targeted registrations or unexpected KI-owned extras.
- At the primary implementation boundary, pre-change and post-change hashes of the canonical source and three readable runtime configuration files matched.
- A later post-commit recheck found only the whole-file hash of app-owned `~/.claude.json` had changed. The Claude Code binding comparison still passed, so its targeted MCP definition remained conforming. No implementation command wrote a runtime configuration file; unrelated application-file churn makes a whole-file hash unsuitable as evidence across an extended review window.

[gov-059-record]: https://github.com/knowledgeislands/ki-agentic-harness/blob/654ded9770680a8e720a729430d343503f9e58e0/docs/roadmap/KI-HARNESS-GOV-059-normalise-binding-comparisons.md
