import { describe, expect, test } from 'bun:test'
import { inspectConfigurationLayout, inspectConfigurationPresentation } from './configuration-presentation.ts'

const header = `# Knowledge Islands repository configuration.
# Its presence declares conformance with the Knowledge Islands repository standard.

`

const banner = (
  name: string
): string => `# -----------------------------------------------------------------------------
# ${name}
# -----------------------------------------------------------------------------
`

describe('configuration presentation', () => {
  test('permits a compact foundation without banners', () => {
    const result = inspectConfigurationPresentation(`${header}[repo]
harnesses = ["example/harness"]

[skills.ki-repo]

[skills.ki-authoring]

[skills.ki-engineering]
`)

    expect(result).toEqual({ substantial: false, issues: [] })
  })

  test('accepts canonical banners and contiguous owner blocks in a substantial file', () => {
    const result = inspectConfigurationPresentation(`${header}${banner('Foundation')}[repo]
harnesses = ["example/harness"]

[skills.ki-repo]

[skills.ki-repo.checks]
wiki = false

[skills.ki-authoring]

${banner('Governance and runtime')}[skills.ki-engineering]

[skills.ki-binding]

[skills.ki-binding.clients.codex]
enabled = true

${banner('Change management')}[skills.ki-work]
adapter = "roadmap"
`)

    expect(result).toEqual({ substantial: true, issues: [] })
  })

  test('diagnoses missing and malformed substantial-file banners', () => {
    const missing = inspectConfigurationPresentation(`${header}[repo]

[skills.ki-repo]

[skills.ki-authoring]

[skills.ki-engineering]

[skills.ki-binding]

[skills.ki-work]
`)
    expect(missing.substantial).toBe(true)
    expect(missing.issues).toContain(
      'substantial .ki.toml must use Foundation and at least one additional neighbourhood banner'
    )

    const malformed = inspectConfigurationPresentation(`${header}# ---
# Foundation
# ---
[repo]

[skills.ki-repo]

[skills.ki-authoring]
`)
    expect(malformed.issues).toContain('line 5: Foundation banner must use the exact three-line comment form')
  })

  test('diagnoses foundation, owner, and banner-order drift', () => {
    const result = inspectConfigurationPresentation(`${header}${banner('Governance and runtime')}[skills.ki-engineering]

[skills.ki-repo]

[skills.ki-authoring]

${banner('Foundation')}[repo]

[skills.ki-engineering.settings]
enabled = true

${banner('Relationships')}[skills.ki-trades.territory.subtypes]
shared-maintenance = "Example subtype."
`)

    expect(result.issues).toEqual(
      expect.arrayContaining([
        'line 7: [repo] must be the first table',
        'line 7: [skills.ki-repo] must be the first skill root',
        'line 11: [skills.ki-authoring] must follow [skills.ki-repo]',
        'line 13: Foundation banner is out of canonical order',
        '[skills.ki-engineering] is split across neighbourhood banners',
        'line 24: [skills.ki-trades] must be declared before its child tables'
      ])
    )
  })

  test('ignores banner-like text inside multiline strings', () => {
    const result = inspectConfigurationPresentation(`${header}[repo]

[skills.ki-repo]
description = """
# -----------------------------------------------------------------------------
# Foundation
# -----------------------------------------------------------------------------
"""

[skills.ki-authoring]
`)

    expect(result).toEqual({ substantial: false, issues: [] })
  })
})

describe('configuration layout', () => {
  test('accepts the six-rule layout', () => {
    expect(
      inspectConfigurationLayout(`${header}${banner('Foundation')}
[repo]
harnesses = [
  "example/harness",
]

# Owner comment
[skills.ki-repo]

${banner('Relationships')}
[skills.ki-agora]

[skills.ki-trades]
`)
    ).toEqual([])
  })

  test('reports blank-line, array and ordering faults', () => {
    const issues = inspectConfigurationLayout(`${header}[repo]
harnesses = ["a", "b"]
[skills.ki-repo]
list = [
  "a", "b",
  "c"]


${banner('Relationships')}
[skills.ki-trades]

[skills.ki-agora]
`)
    expect(issues).toEqual([
      'line 6: [skills.ki-repo] must follow exactly one blank line',
      'line 12: neighbourhood banner must follow exactly one blank line',
      'line 5: arrays must be multiline, one element per line with a trailing comma',
      'line 8: write each array element on its own line with a trailing comma',
      'line 9: the closing bracket of the array opened on line 7 needs its own line',
      'line 18: [skills.ki-trades] must be the last table in the file',
      'line 18: [skills.ki-agora] must be the first table under Relationships'
    ])
  })

  test('reserves skill subtables for data maps and leaves only the trade-policy territory alone', () => {
    const issues = inspectConfigurationLayout(`${header}[repo]

[skills.ki-repo]

[skills.ki-repo.territory]
mode = "example"

[skills.ki-authoring]

[skills.ki-authoring.owned_file_exceptions]
".rumdl.toml" = "Reason."

[skills.ki-work-roadmap]

[skills.ki-work-roadmap.areas]
GOV = "Governance"

[skills.ki-engineering]

[skills."ki-engineering".settings]
enabled = true

[skills.ki-agora]

[skills.ki-agora.kis]
capital = "example/capital"

[skills.ki-trades]

[skills.ki-trades.territory.subtypes]
shared = "Example."
`)
    expect(issues).toEqual([
      'line 8: [skills.ki-repo.territory] groups fields in a subtable; use a subtable only for a data map, and put fixed keys in [skills.ki-repo]',
      'line 13: [skills.ki-authoring.owned_file_exceptions] groups fields in a subtable; use a subtable only for a data map, and put fixed keys in [skills.ki-authoring]',
      'line 23: [skills.ki-engineering.settings] groups fields in a subtable; use a subtable only for a data map, and put fixed keys in [skills.ki-engineering]'
    ])
  })
})
