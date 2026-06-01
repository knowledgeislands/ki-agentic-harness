/**
 * Eval scenarios for the `knowledgeislands-repo` skill — the repo standard and the
 * `.ki-config.toml` contract. Each probes a house-specific rule (the compliance
 * marker, merge policy, the one-table-per-skill model) a baseline wouldn't know.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'knowledgeislands-repo',
    id: 'repo-compliance-marker',
    prompt: 'What single file marks a git repository as Knowledge Islands–compliant, and what is its role?',
    assertions: [
      { name: 'names .ki-config.toml', re: /\.ki-config\.toml/ },
      { name: 'presence = compliance marker', re: /(presence|marker|compliance|opt(ed|s)? in|declares)/i }
    ],
    rubric:
      'House rule: a repo is Knowledge Islands–compliant by carrying a `.ki-config.toml` at its root — its PRESENCE is the compliance marker, and it is the shared, skill-sectioned config file. A correct answer names `.ki-config.toml` and explains its presence marks compliance.'
  },
  {
    skill: 'knowledgeislands-repo',
    id: 'repo-merge-policy',
    prompt: 'What are the house GitHub settings for merging and the default branch on our repos?',
    assertions: [
      { name: 'squash-only merges', re: /squash/i },
      { name: 'auto-delete branch on merge', re: /(delete|auto-delete)[^.\n]{0,30}branch|branch[^.\n]{0,30}(delete)/i },
      { name: 'default branch main', re: /\bmain\b/ }
    ],
    rubric:
      'House standard: squash-only merges (merge commits and rebase OFF), auto-delete head branch on merge, default branch `main`, Issues on / Wiki+Projects off, MIT license. A correct answer states squash-only, auto-delete-branch, and main.'
  },
  {
    skill: 'knowledgeislands-repo',
    id: 'repo-config-table-model',
    prompt:
      'Several of our skills need per-repo settings. How is that stored in `.ki-config.toml`, and what may a skill read or validate in that file?',
    assertions: [
      { name: 'one table per skill, named for the skill', re: /(one )?table per skill|\[<?skill>?\]|named (for|after) the skill/i },
      { name: 'validate/read only its own table', re: /(own|its own) (table|section)|validate down|never[^.\n]{0,30}other/i }
    ],
    rubric:
      'House contract: each skill that needs config owns exactly ONE table named for the skill (e.g. [knowledgeislands-repo]), with sub-tables nested under it; a skill reads and validates ONLY its own table (warns on an unrecognised key in it) and never inspects another skill\'s — "validate down, ignore across". A correct answer states the one-table-per-skill model and the own-table-only rule.'
  }
]
