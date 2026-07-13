/**
 * Eval scenarios for the `ki-binding` skill — cross-surface binding.
 *
 * Design note: a capable model can reason generically about "sync config across apps". These
 * scenarios target house-ARBITRARY specifics a baseline cannot derive: that the single source
 * is the canonical `~/.config/ki/mcp-servers.yaml` (renderer-neutral) with a per-server
 * `clients:` field (not a new file), that the file-editable surfaces are conformed by editing
 * the source and re-rendering (never a hand-written per-surface config, which would drift) —
 * chezmoi is one renderer (the maintainer's), governed by the composition skill
 * `ki-binding-chezmoi`, not a requirement of `ki-binding` itself — and that Cowork is gated on
 * an external-edit verification before wiring.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-binding',
    id: 'binding-single-source',
    prompt:
      'In the Knowledge Islands harness, what is the single source that decides which MCP servers are enabled on which surface (Claude Code, Desktop, mcporter), and what field on each server carries that targeting?',
    assertions: [
      { name: 'source is the canonical mcp-servers.yaml', re: /mcp-servers\.yaml|mcps\.yaml|\.config\/ki|\.chezmoidata/i },
      { name: 'per-server clients field', re: /\bclients\b/i },
      { name: 'not a new/second source', re: /single source|not a (new|second) (file|source)|already/i }
    ],
    rubric:
      'House model: the single source is the canonical `~/.config/ki/mcp-servers.yaml` — one `mcpServers` list where each entry declares a `clients:` list (`code` / `desktop` / `mcporter` / `cowork`) naming the surfaces it targets. Whatever renders that into each surface (chezmoi\'s `mcp-servers-json` template is one example, the maintainer\'s) is a separate concern; chezmoi is not the identity of the source. A correct answer names the canonical `mcp-servers.yaml` path (or its transitional chezmoi-data fallback) as the source and the per-server `clients` field as the targeting lever, and does not invent a second source file.'
  },
  {
    skill: 'ki-binding',
    id: 'binding-edit-source-not-surface',
    prompt:
      "To enable an existing KI MCP server on Claude Desktop when it's currently only on mcporter, what do you edit — and why not just add it directly to Desktop's `claude_desktop_config.json`?",
    assertions: [
      { name: 'edit clients in the source', re: /clients|mcp-servers\.yaml|mcps\.yaml/i },
      { name: 're-render (renderer-neutral)', re: /re-?render|chezmoi apply|chezmoi|render/i },
      { name: 'hand-edit would drift from source', re: /drift|diverge|single source|overwritten|regenerat/i }
    ],
    rubric:
      "House rule: add `desktop` to that server's `clients` field on the single source, then re-render the surface configs from it — chezmoi's `chezmoi apply` is one example renderer (the maintainer's), not the only valid mechanism. Hand-editing `claude_desktop_config.json` directly is drift: it diverges from the source and is clobbered on the next render. A correct answer names the `clients`-field edit on the source plus a re-render step (however performed) and explains that a direct hand-edit drifts from the single source."
  },
  {
    skill: 'ki-binding',
    id: 'binding-renderer-neutral',
    prompt:
      'Does the `ki-binding` skill require chezmoi (or any particular renderer) to be installed? What does it actually check, and where does chezmoi-specific rendering live instead?',
    assertions: [
      { name: 'renderer-neutral / no renderer required', re: /renderer-neutral|does not require|any renderer|reads the source/i },
      { name: 'names ki-binding-chezmoi', re: /ki-binding-chezmoi/i },
      { name: 'composition relationship to ki-binding', re: /compos|implies|depends/i }
    ],
    rubric:
      "House model: `ki-binding` is renderer-neutral — it reads the canonical source and audits that each surface (Claude Code, Desktop, mcporter) agrees with it, requiring no particular renderer installed. chezmoi is one renderer, now governed by the composition skill `ki-binding-chezmoi`, which implies/depends on `ki-binding` + `ki-dotfiles-chezmoi` and owns the chezmoi-specific render mechanics (the `mcp-servers-json` template, `chezmoi apply`, 1Password refs resolved at apply). A correct answer states `ki-binding` needs no renderer and audits agreement, and names `ki-binding-chezmoi` as the composition skill that owns the chezmoi render path."
  },
  {
    skill: 'ki-binding',
    id: 'binding-cowork-gated',
    prompt:
      'Why does the binding skill not yet write Claude Cowork\'s `enabledPlugins`, even though Cowork is a controllable surface, and what has to happen first?',
    assertions: [
      { name: 'external-edit-honoured verification', re: /external edit|honou?red|next launch|verif/i },
      { name: 'gate before wiring', re: /gate|before[^.\n]{0,30}(wire|write|depend)|first/i },
      { name: 'cowork_settings.json', re: /cowork_settings|enabledPlugins/i }
    ],
    rubric:
      "House sequencing: Cowork is gated on the first build-time check — whether an external edit to `cowork_settings.json` is honoured on next Cowork launch. Until that passes, a `cowork` target is surfaced as declared-but-unwired (WARN), never silently written. A correct answer ties the hold to the external-edit-honoured verification that must pass before `enabledPlugins` is written."
  }
]
