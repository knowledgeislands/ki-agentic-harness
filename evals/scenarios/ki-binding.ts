/**
 * Eval scenarios for the `ki-binding` skill — cross-surface binding.
 *
 * Design note: a capable model can reason generically about "sync config across apps". These
 * scenarios target house-ARBITRARY specifics a baseline cannot derive: that the single source
 * is chezmoi's `mcps.yaml` with a per-server `clients:` field (not a new file), that the
 * file-editable surfaces are conformed via chezmoi (never a hand-written per-surface config,
 * which would drift), and that Cowork is gated on an external-edit verification before wiring.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-binding',
    id: 'binding-single-source',
    prompt:
      'In the Knowledge Islands harness, what is the single source that decides which MCP servers are enabled on which surface (Claude Code, Desktop, mcporter), and what field on each server carries that targeting?',
    assertions: [
      { name: 'source is chezmoi mcps.yaml', re: /mcps\.yaml|\.chezmoidata/i },
      { name: 'per-server clients field', re: /\bclients\b/i },
      { name: 'not a new/second source', re: /single source|not a (new|second) (file|source)|already/i }
    ],
    rubric:
      "House model: the single source is chezmoi's `.chezmoidata/mcps.yaml` — one `mcpServers` list where each entry declares a `clients:` list (`code` / `desktop` / `mcporter` / `cowork`) naming the surfaces it targets. chezmoi renders that into each surface. A correct answer names `mcps.yaml` as the source and the per-server `clients` field as the targeting lever, and does not invent a second source file."
  },
  {
    skill: 'ki-binding',
    id: 'binding-chezmoi-not-handwrite',
    prompt:
      "To enable an existing KI MCP server on Claude Desktop when it's currently only on mcporter, what do you edit — and why not just add it directly to Desktop's `claude_desktop_config.json`?",
    assertions: [
      { name: 'edit clients in mcps.yaml', re: /clients|mcps\.yaml/i },
      { name: 'chezmoi apply', re: /chezmoi apply|chezmoi/i },
      { name: 'hand-edit would drift from source', re: /drift|diverge|single source|overwritten|regenerat/i }
    ],
    rubric:
      'House rule: add `desktop` to that server\'s `clients` list in `mcps.yaml`, then `chezmoi apply` — the rendered surface configs are generated from the single source. Hand-editing `claude_desktop_config.json` directly is drift: it diverges from the source and is clobbered on the next render. A correct answer names the `clients`-field edit + `chezmoi apply` and explains that a direct hand-edit drifts from the single source.'
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
