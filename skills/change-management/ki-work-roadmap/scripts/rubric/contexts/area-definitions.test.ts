import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { AREA_INDEX_KB, AREA_INDEX_PROJECT, areasSection, inspectAreaDefinitions } from './area-definitions.ts'
import { workItemsFor } from './roadmap-evidence.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const repository = (config: string, index?: { path: string; text: string }): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-area-definitions-'))
  temporaryDirectories.push(root)
  writeFileSync(join(root, '.ki.toml'), config)
  if (index) {
    mkdirSync(join(root, index.path, '..'), { recursive: true })
    writeFileSync(join(root, index.path), index.text)
  }
  return root
}

const PROJECT = '[skills.ki-repo]\nrepo_code = "DEMO"\n\n[skills.ki-work-roadmap]\nareas = ["FND", "GOV"]\n'
const KB = '[skills.ki-repo]\nrepo_type = "kb"\nrepo_code = "DEMO"\n\n[skills.ki-work-roadmap]\nareas = ["GOV"]\n'

test('a project repository with every area defined in docs/roadmap/README.md passes', () => {
  const root = repository(PROJECT, {
    path: AREA_INDEX_PROJECT,
    text: '# Roadmap areas\n\n## Areas\n\n- `FND` covers foundations.\n- `GOV` covers governance.\n'
  })
  expect(inspectAreaDefinitions(root)).toEqual([])
})

test('each undefined area warns once under ROAD-6', () => {
  const root = repository(PROJECT, {
    path: AREA_INDEX_PROJECT,
    text: '# Roadmap areas\n\n## Areas\n\n- `FND` covers foundations.\n'
  })
  const findings = inspectAreaDefinitions(root)
  expect(findings).toHaveLength(1)
  expect(findings[0]).toMatchObject({ level: 'WARN', area: 'ROAD-6', file: AREA_INDEX_PROJECT })
  expect(findings[0]?.msg).toContain("'GOV'")
})

test('a missing index warns for every declared area', () => {
  expect(inspectAreaDefinitions(repository(PROJECT)).map((finding) => finding.msg)).toHaveLength(2)
})

test('a code named outside the Areas section is not a definition', () => {
  const root = repository(PROJECT, {
    path: AREA_INDEX_PROJECT,
    text: '# Roadmap areas\n\nSee `GOV`.\n\n## Areas\n\n- `FND` covers foundations.\n\n## Other\n\n`GOV`\n'
  })
  expect(inspectAreaDefinitions(root).map((finding) => finding.msg)).toEqual([
    `area 'GOV' has no definition; name it in backticks under ## Areas in ${AREA_INDEX_PROJECT}`
  ])
})

test('a Knowledge Base defines its areas in the Streams roadmap index note', () => {
  const defined = repository(KB, { path: AREA_INDEX_KB, text: '# Roadmap\n\n## Areas\n\n`GOV` covers governance.\n' })
  expect(inspectAreaDefinitions(defined).filter((finding) => finding.file !== '.ki.toml')).toEqual([])
  const undefinedArea = repository(KB, { path: AREA_INDEX_PROJECT, text: '## Areas\n\n`GOV`\n' })
  expect(inspectAreaDefinitions(undefinedArea)[1]?.file).toBe(AREA_INDEX_KB)
})

test('a Knowledge Base bare areas list fails in Arcadia territory and warns outside it', () => {
  const legacyList = 'a bare areas list is the legacy form; map each code to its title, e.g. GOV = "Governance"'
  const outside = repository(KB, { path: AREA_INDEX_KB, text: '## Areas\n\n`GOV`\n' })
  expect(inspectAreaDefinitions(outside)).toEqual([
    {
      level: 'WARN',
      area: 'ROAD-6',
      msg: `outside Arcadia territory, ${legacyList}`,
      ref: expect.any(String),
      file: '.ki.toml'
    }
  ])
  const capital = repository(
    '[skills.ki-repo]\nrepo_type = "kb"\nrepo_code = "DEMO"\nrepository = "https://github.com/knowledgeislands/ki-arcadia-principal"\ncapital = "https://github.com/knowledgeislands/ki-arcadia-principal"\nterritory_members = ["https://github.com/knowledgeislands/ki-arcadia-principal"]\n\n[skills.ki-work-roadmap]\nareas = ["GOV"]\n',
    { path: AREA_INDEX_KB, text: '## Areas\n\n`GOV`\n' }
  )
  expect(inspectAreaDefinitions(capital)).toEqual([
    { level: 'FAIL', area: 'ROAD-6', msg: legacyList, ref: expect.any(String), file: '.ki.toml' }
  ])
  const mapped = repository(
    '[skills.ki-repo]\nrepo_type = "kb"\nrepo_code = "DEMO"\n\n[skills.ki-work-roadmap.areas]\nGOV = "Governance"\n'
  )
  expect(inspectAreaDefinitions(mapped)).toEqual([])
})

test('repository-wide mode and malformed configuration produce no area findings', () => {
  expect(inspectAreaDefinitions(repository('[skills.ki-work-roadmap]\n'))).toEqual([])
  expect(inspectAreaDefinitions(repository('[skills.ki-work-roadmap]\nareas.FND = "foundation"\n'))).toEqual([])
  expect(inspectAreaDefinitions(repository('not toml ['))).toEqual([])
})

test('the Areas section ends at the next heading of the same or higher level', () => {
  expect(areasSection('## Areas\n\n### Detail\n\n`A`\n\n## Next\n\n`B`\n')).toBe('\n### Detail\n\n`A`\n')
  expect(areasSection('# Title\n')).toBeUndefined()
})

test('docs/roadmap/README.md is an index, not a work record', () => {
  const root = repository(PROJECT, { path: AREA_INDEX_PROJECT, text: '# Roadmap areas\n\n## Areas\n\n`FND` `GOV`\n' })
  expect(workItemsFor(root)).toEqual([])
})
