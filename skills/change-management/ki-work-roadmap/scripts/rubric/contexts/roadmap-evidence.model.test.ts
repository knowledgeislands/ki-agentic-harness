import { afterEach, expect, test } from 'bun:test'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  isEnforcingTerritoryRepository,
  loadProjectRegistry,
  loadTerritoryRegistry,
  parseRegistryReference
} from './project-registry.ts'
import {
  IDEAS_LIST,
  ISSUE_LEDGER,
  inspectRoadmap,
  issueLedger,
  ledgerAllocation,
  rootRoadmap
} from './roadmap-evidence.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const temporary = (prefix: string): string => {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  temporaryDirectories.push(directory)
  return directory
}

const EXECUTION = `## Current state

Nothing is delivered.

## Steps

- [ ] Deliver the slice.

## Files touched

- \`src/slice.ts\`

## Verify

- \`bun test\`

## Dependencies / blocks

No dependencies.

## Documentation impact

### Decision Records

None.

### Specifications

None.

### Guides

None.

### Roadmap

None.

`

const BASE = 'a'.repeat(40)

const createRepository = (frontmatter: string, body: string, config = 'components = ["checker"]\n'): string => {
  const repository = temporary('ki-work-roadmap-model-')
  mkdirSync(join(repository, 'docs', 'roadmap'), { recursive: true })
  writeFileSync(
    join(repository, '.ki.toml'),
    `[skills.ki-repo]\nrepo_code = "TEST"\n\n[skills.ki-work-roadmap]\n${config}`
  )
  writeFileSync(
    join(repository, 'docs', 'roadmap', 'TEST-001-deliver-the-slice.md'),
    `---\nid: TEST-001\ntitle: Deliver the slice\n${frontmatter}\nblocks: []\nblocked_by: []\ncreated_at: 2026-10-07T12:00:00Z\nupdated_at: 2026-10-07T12:00:00Z\n---\n\n## Goal\n\nDeliver the slice.\n\n## Context\n\nThe slice is needed.\n\n## Boundary\n\nOnly the slice.\n\n${body}## Discussion\n\nNone.\n`
  )
  writeFileSync(join(repository, 'docs', 'roadmap', ISSUE_LEDGER), issueLedger(1))
  writeFileSync(join(repository, 'ROADMAP.md'), rootRoadmap())
  return repository
}

const failures = (repository: string) => inspectRoadmap(repository).filter((finding) => finding.level === 'FAIL')
const warnings = (repository: string) =>
  inspectRoadmap(repository)
    .filter((finding) => finding.level === 'WARN')
    .map((finding) => finding.msg)

test('a triage record carries no horizon, baseline or delivery sections', () => {
  expect(failures(createRepository('status: triage\nbaseline_ref: null', ''))).toEqual([])
  expect(failures(createRepository('status: triage\nhorizon: next\nbaseline_ref: null', ''))).toContainEqual(
    expect.objectContaining({ area: 'ITEM-2', msg: 'a triage record carries no horizon' })
  )
})

test('the horizon table admits each status only at its horizons', () => {
  const ready = (horizon: string) =>
    createRepository(`kind: deliver\nhorizon: ${horizon}\nstatus: ready\nbaseline_ref: null`, EXECUTION)
  expect(failures(ready('next'))).toEqual([])
  expect(failures(ready('soon'))).toContainEqual(
    expect.objectContaining({ area: 'ITEM-2', msg: 'ready record must sit at now, next, hold' })
  )
  expect(failures(createRepository('kind: deliver\nstatus: draft\nbaseline_ref: null', ''))).toContainEqual(
    expect.objectContaining({ msg: 'draft record must declare a horizon' })
  )
})

test('an adopted open record without kind warns', () => {
  const repository = createRepository('horizon: future\nstatus: draft\nbaseline_ref: null', '')
  expect(failures(repository)).toEqual([])
  expect(warnings(repository)).toContain('legacy: an adopted record should declare kind')
})

test('hold requires a valid mapping and is forbidden elsewhere', () => {
  const held = (hold: string, status = 'in-progress', baseline = BASE) =>
    createRepository(`kind: deliver\nhorizon: hold\n${hold}\nstatus: ${status}\nbaseline_ref: ${baseline}`, EXECUTION)
  expect(
    failures(
      held(
        'hold:\n  reason: waiting-for\n  condition: The upstream release ships.\n  review: 2026-11-01\n  trades: [TRD-1234abcd]'
      )
    )
  ).toEqual([])
  expect(failures(held(''))).toContainEqual(
    expect.objectContaining({ msg: 'horizon hold requires a hold mapping with reason and condition' })
  )
  expect(failures(held('hold:\n  reason: someday\n  condition: ""\n  trades: [TRD-X, TRD-X]'))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ msg: 'hold.reason must be waiting-for or parked' }),
      expect.objectContaining({ msg: 'hold.condition must name the release condition' }),
      expect.objectContaining({ area: 'TRADE-2', msg: 'hold.trades must contain only canonical trade identities' }),
      expect.objectContaining({ area: 'TRADE-2', msg: 'hold.trades must not repeat a trade identity' })
    ])
  )
  expect(
    failures(
      createRepository(
        'kind: deliver\nhorizon: now\nhold:\n  reason: parked\n  condition: Later.\nstatus: draft\nbaseline_ref: null',
        EXECUTION
      )
    )
  ).toContainEqual(expect.objectContaining({ msg: 'hold is valid only at horizon hold' }))
})

test('a stale in-progress hold warns', () => {
  const repository = createRepository(
    `kind: deliver\nhorizon: hold\nhold:\n  reason: parked\n  condition: Kris resumes it.\nstatus: in-progress\nbaseline_ref: ${BASE}`,
    EXECUTION
  )
  expect(warnings(repository).some((message) => message.startsWith('in-progress hold has not been updated'))).toBe(
    Date.now() - Date.parse('2026-10-07T12:00:00Z') > 31 * 86_400_000
  )
})

test('a cancelled record needs a resolution, a qualified target and a terminal Cancelled section', () => {
  const cancelled = (fields: string, body = '## Cancelled\n\nApproved by Kris Brown on 2026-10-07.\n\n') =>
    createRepository(`status: cancelled\n${fields}\nbaseline_ref: null`, body)
  expect(failures(cancelled('resolution: obsolete'))).toEqual([])
  expect(failures(cancelled('resolution: duplicate\nresolution_target: KI-OTHER-012'))).toEqual([])
  expect(warnings(cancelled('resolution: merged\nresolution_target: TEST-009'))).toContain(
    "resolution_target 'TEST-009' does not resolve to a retained work item; cite its revision in ## Cancelled"
  )
  expect(failures(cancelled(''))).toContainEqual(
    expect.objectContaining({ msg: 'cancelled record requires a resolution' })
  )
  expect(failures(cancelled('resolution: superseded'))).toContainEqual(
    expect.objectContaining({ msg: 'superseded resolution requires resolution_target' })
  )
  expect(failures(cancelled('resolution: rejected\nresolution_target: TEST-002'))).toContainEqual(
    expect.objectContaining({
      msg: 'resolution_target is valid only for a duplicate, merged or superseded resolution'
    })
  )
  expect(failures(cancelled('resolution: duplicate\nresolution_target: TEST-001'))).toContainEqual(
    expect.objectContaining({ msg: 'resolution_target must differ from the cancelled record' })
  )
  expect(failures(cancelled('resolution: obsolete', ''))).toContainEqual(
    expect.objectContaining({ msg: 'body must contain Goal → Context → Boundary → Cancelled → Discussion in order' })
  )
  expect(
    failures(cancelled('resolution: obsolete', `${EXECUTION}## Cancelled\n\nApproved by Kris Brown.\n\n`))
  ).toContainEqual(
    expect.objectContaining({
      msg: 'a record cancelled before it started must not contain delivery sections: Current state, Steps, Files touched, Verify, Dependencies / blocks, Documentation impact'
    })
  )
  expect(
    failures(
      createRepository('status: draft\nkind: deliver\nhorizon: future\nresolution: obsolete\nbaseline_ref: null', '')
    )
  ).toContainEqual(expect.objectContaining({ msg: 'resolution is valid only on a cancelled record' }))
})

test('classification values are validated and components come from configuration', () => {
  const classified = (fields: string, config?: string) =>
    createRepository(`horizon: future\nstatus: draft\nbaseline_ref: null\n${fields}`, '', config)
  expect(failures(classified('kind: decide\npurpose: governance\ncomponent: checker'))).toEqual([])
  expect(failures(classified('kind: build\npurpose: fun\ncomponent: Checker\nproject: Not_A_Slug'))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ msg: 'kind must be one canonical value' }),
      expect.objectContaining({ msg: 'purpose must be one canonical value' }),
      expect.objectContaining({ msg: 'component must be a lowercase kebab-case slug' }),
      expect.objectContaining({
        msg: 'project must be a lowercase kebab-case slug, optionally qualified as <territory>/<slug>'
      })
    ])
  )
  expect(failures(classified('kind: deliver\ncomponent: website'))).toContainEqual(
    expect.objectContaining({ msg: "component 'website' must be declared in ki-work-roadmap components" })
  )
  expect(failures(classified('kind: deliver', 'components = ["Bad"]\n'))).toContainEqual(
    expect.objectContaining({
      area: 'ROAD-6',
      msg: 'ki-work-roadmap components must be a list of lowercase kebab-case names'
    })
  )
})

test('fixed areas map codes to titles; a bare list fails in Arcadia territory and warns outside it', () => {
  const repository = createRepository('kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null', '')
  const configure = (repo: string, roadmap: string) =>
    writeFileSync(
      join(repository, '.ki.toml'),
      `[skills.ki-repo]\nrepo_code = "TEST"\n${repo}\n[skills.ki-work-roadmap]\n${roadmap}`
    )
  const legacyList = 'a bare areas list is the legacy form; map each code to its title, e.g. GOV = "Governance"'
  configure('', 'themes = ["tooling"]\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ area: 'ROAD-6', msg: 'retired: ki-work-roadmap themes; remove the themes list' })
  )
  configure('', 'areas = ["core"]\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ area: 'ROAD-6', msg: 'ki-work-roadmap areas must map uppercase area codes to titles' })
  )
  configure('', 'areas = "CORE"\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ area: 'ROAD-6', msg: 'ki-work-roadmap areas must map uppercase area codes to titles' })
  )
  configure('', 'areas = ["CORE"]\n')
  expect(warnings(repository)).toContain(`outside Arcadia territory, ${legacyList}`)
  configure(
    'repository = "https://github.com/knowledgeislands/ki-arcadia-principal"\ncapital = "https://github.com/knowledgeislands/ki-arcadia-principal"\nterritory_members = ["https://github.com/knowledgeislands/ki-arcadia-principal"]\n',
    'areas = ["CORE"]\n'
  )
  expect(failures(repository)).toContainEqual(expect.objectContaining({ area: 'ROAD-6', msg: legacyList }))
  configure('', 'areas.CORE = "Core delivery"\n')
  expect(inspectRoadmap(repository).filter((finding) => finding.area === 'ROAD-6')).toEqual([])
  configure('', 'areas.CORE = "foundation-tooling"\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({
      msg: "area CORE maps to theme 'foundation-tooling'; the area-to-theme map is retired, so map the code to its title"
    })
  )
  configure('', 'areas.CORE = "  "\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ msg: 'area CORE must map to a title that starts with a capital letter' })
  )
  configure('', 'areas.CORE = 1\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ msg: 'area CORE must map to a title that starts with a capital letter' })
  )
  const areaGrammar = 'roadmap area codes must be uppercase alphanumeric with at least one letter'
  configure('', 'areas.core = "Core"\n')
  expect(failures(repository)).toContainEqual(expect.objectContaining({ msg: areaGrammar }))
  configure('', 'areas.555 = "Numbered delivery"\n')
  expect(failures(repository)).toContainEqual(expect.objectContaining({ msg: areaGrammar }))
  configure('', 'areas.5GE = "5G Emerge delivery"\n')
  expect(inspectRoadmap(repository).filter((finding) => finding.area === 'ROAD-6')).toEqual([])
  configure('', 'areas = ["555"]\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ area: 'ROAD-6', msg: 'ki-work-roadmap areas must map uppercase area codes to titles' })
  )
  configure('', 'areas = {}\n')
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({ msg: 'ki-work-roadmap areas must not be empty when declared' })
  )
})

test('territorial enforcement uses the canonical Capital roster and warns for unresolved policy', () => {
  const capital = createCapital()
  const island = temporary('ki-island-')
  const arcadia = 'https://github.com/knowledgeislands/ki-arcadia-principal'
  writeFileSync(
    join(island, '.ki.toml'),
    `[skills.ki-repo]\nrepository = "https://example.test/island"\ncapital = "${arcadia}"\n`
  )
  const state = temporary('ki-state-')
  writeFileSync(
    join(state, 'registry.toml'),
    `[repositories."capital"]\nrepository = "${arcadia}"\npath = "${capital}"\n`
  )
  const environment = { KI_STATE_HOME: state }
  const config = join(capital, '.ki.toml')
  const policy = `[skills.ki-repo]\nrepository = "${arcadia}"\ncapital = "${arcadia}"\nterritory_name = "Knowledge Islands"\n`
  expect(isEnforcingTerritoryRepository(island, environment)).toBe(false)
  writeFileSync(config, `${policy}territory_members = ["${arcadia}", "https://example.test/island"]\n`)
  expect(isEnforcingTerritoryRepository(island, environment)).toBe(true)
  expect(isEnforcingTerritoryRepository(capital, environment)).toBe(true)
  writeFileSync(
    config,
    `${policy}territory_members = ["${arcadia}"]\n\n[skills.ki-agora.kis]\nmembers = ["https://example.test/island"]\n`
  )
  expect(isEnforcingTerritoryRepository(island, environment)).toBe(false)
  expect(isEnforcingTerritoryRepository(island, {})).toBe(false)
  expect(isEnforcingTerritoryRepository(temporary('ki-bare-'), environment)).toBe(false)
  writeFileSync(config, `${policy}territory_members = [\n`)
  expect(isEnforcingTerritoryRepository(capital, environment)).toBe(false)
})

test('the ideas list beside the ledger is not a record', () => {
  const repository = createRepository('kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null', '')
  writeFileSync(join(repository, 'docs', 'roadmap', IDEAS_LIST), '# Ideas\n\n- Try a faster parser.\n')
  expect(failures(repository)).toEqual([])
})

const createCapital = (): string => {
  const capital = temporary('ki-capital-')
  writeFileSync(
    join(capital, '.ki.toml'),
    '[skills.ki-repo]\nrepository = "https://example.test/capital"\ncapital = "https://example.test/capital"\nrepo_code = "CAP"\n'
  )
  mkdirSync(join(capital, 'Streams', 'Projects'), { recursive: true })
  mkdirSync(join(capital, 'Streams', 'Initiatives'), { recursive: true })
  writeFileSync(
    join(capital, 'Streams', 'Initiatives', 'Initiatives.md'),
    '---\nnote_type: streams/initiatives\n---\n\n# Initiatives\n\n- [[platform-foundations]]\n- [[techne]]\n'
  )
  for (const [slug, title] of [
    ['platform-foundations', 'Platform foundations'],
    ['techne', 'Techne']
  ])
    writeFileSync(
      join(capital, 'Streams', 'Initiatives', `${slug}.md`),
      `---\nnote_type: streams/initiative\nslug: ${slug}\ntitle: ${title}\ndirection: A long-lived direction.\nlifecycle: active\nlead: Kris Brown\n---\n\n# ${title}\n`
    )
  writeFileSync(
    join(capital, 'Streams', 'Projects', 'baseline-rollout.md'),
    '---\nnote_type: streams/project\nslug: baseline-rollout\ntitle: Baseline rollout\ninitiative: platform-foundations\nlifecycle: active\n---\n\n# Baseline rollout\n'
  )
  return capital
}

test('the project registry resolves through the capital and the local ki registry', () => {
  const capital = createCapital()
  const own = loadProjectRegistry(capital, {})
  expect('registry' in own && [...own.registry.projects]).toEqual([['baseline-rollout', 'platform-foundations']])
  expect('registry' in own && [...own.registry.initiatives].sort()).toEqual(['platform-foundations', 'techne'])
  expect('registry' in own && own.registry.legacyInitiativesIndex).toBe(false)

  const island = temporary('ki-island-')
  writeFileSync(
    join(island, '.ki.toml'),
    '[skills.ki-repo]\nrepository = "https://example.test/island"\ncapital = "https://example.test/capital"\n'
  )
  const state = temporary('ki-state-')
  expect(loadProjectRegistry(island, { KI_STATE_HOME: state })).toEqual({
    unavailable: `the local ki registry ${join(state, 'registry.toml')} is missing`
  })
  writeFileSync(
    join(state, 'registry.toml'),
    `[repositories."capital"]\nrepository = "https://example.test/capital"\npath = "${capital}"\n`
  )
  expect('registry' in loadProjectRegistry(island, { KI_STATE_HOME: state })).toBe(true)
  expect(loadProjectRegistry(temporary('ki-bare-'), {})).toEqual({
    unavailable: 'the repository declares no ki-repo capital'
  })
})

test('a registry note holding a design folder is read as its folder note', () => {
  const capital = createCapital()
  const folder = join(capital, 'Streams', 'Projects', 'agent-host')
  mkdirSync(join(folder, 'design'), { recursive: true })
  writeFileSync(
    join(folder, 'agent-host.md'),
    '---\nnote_type: streams/project\nslug: agent-host\ntitle: Agent host\ninitiative: techne\nlifecycle: active\n---\n\n# Agent host\n'
  )
  writeFileSync(join(folder, 'design', 'design.md'), '# Design\n')
  writeFileSync(join(folder, 'design', 'agent-host-brief.md'), '---\nnote_type: streams/project\nslug: stray\n---\n')
  const lookup = loadProjectRegistry(capital, {})
  expect('registry' in lookup && [...lookup.registry.projects].sort()).toEqual([
    ['agent-host', 'techne'],
    ['baseline-rollout', 'platform-foundations']
  ])
})

test('project membership warns on unknown slugs and fails only on a contradicted initiative', () => {
  const capital = createCapital()
  const member = (fields: string, registry = true): string => {
    const repository = createRepository(
      `kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null\n${fields}`,
      ''
    )
    writeFileSync(
      join(repository, '.ki.toml'),
      '[skills.ki-repo]\nrepo_code = "TEST"\nrepository = "https://example.test/own"\ncapital = "https://example.test/own"\n'
    )
    if (registry) cpSync(join(capital, 'Streams'), join(repository, 'Streams'), { recursive: true })
    return repository
  }
  const unavailable = member('project: baseline-rollout', false)
  expect(failures(unavailable)).toEqual([])
  expect(warnings(unavailable)).toContain(
    'project registry is unavailable: the capital has no Streams/Projects/ or Streams/Initiatives/ registry'
  )

  expect(failures(member('project: baseline-rollout'))).toEqual([])
  expect(warnings(member('project: baseline-rollout'))).not.toContain(
    "project 'baseline-rollout' is not in the project registry"
  )
  expect(warnings(member('project: unknown-project\ninitiative: unknown-initiative'))).toEqual(
    expect.arrayContaining([
      "project 'unknown-project' is not in the project registry",
      "initiative 'unknown-initiative' is not in the project registry"
    ])
  )
  expect(warnings(member('project: baseline-rollout\ninitiative: platform-foundations'))).toContain(
    'initiative is redundant beside a registered project'
  )
  expect(failures(member('project: baseline-rollout\ninitiative: techne'))).toContainEqual(
    expect.objectContaining({
      area: 'ITEM-2',
      msg: "initiative 'techne' contradicts project 'baseline-rollout', which serves 'platform-foundations'"
    })
  )
  expect(failures(member('initiative: techne'))).toEqual([])
})

test('a qualified reference parses a territory handle or prefix-less Capital registry key', () => {
  expect(parseRegistryReference('agent-host')).toEqual({ slug: 'agent-host' })
  expect(parseRegistryReference('ki-arcadia-principal/agent-host')).toEqual({
    territory: 'ki-arcadia-principal',
    slug: 'agent-host'
  })
  expect(parseRegistryReference('kit-kris.me.uk/site')).toEqual({ territory: 'kit-kris.me.uk', slug: 'site' })
  for (const value of ['Agent_Host', 'a/b/c', 'Capital/agent-host', '/agent-host', 'capital/', 'capital/Agent'])
    expect(parseRegistryReference(value)).toBeUndefined()
})

test('a territory registry resolves only a registered Capital checkout', () => {
  const capital = createCapital()
  const island = temporary('ki-island-')
  writeFileSync(
    join(island, '.ki.toml'),
    '[skills.ki-repo]\nrepository = "https://example.test/island"\ncapital = "https://example.test/capital"\n'
  )
  const state = temporary('ki-state-')
  const environment = { KI_STATE_HOME: state }
  expect(loadTerritoryRegistry('capital', environment)).toEqual({
    unavailable: `the local ki registry ${join(state, 'registry.toml')} is missing`
  })
  writeFileSync(
    join(state, 'registry.toml'),
    `[repositories."capital"]\nrepository = "https://example.test/capital"\npath = "${capital}"\n\n[repositories."island"]\nrepository = "https://example.test/island"\npath = "${island}"\n`
  )
  const resolved = loadTerritoryRegistry('capital', environment)
  expect('registry' in resolved && [...resolved.registry.projects.keys()]).toEqual(['baseline-rollout'])
  expect(loadTerritoryRegistry('island', environment)).toEqual({
    unavailable: "territory 'island' is not a registered Capital handle"
  })
  expect(loadTerritoryRegistry('nowhere', environment)).toEqual({
    unavailable: "territory 'nowhere' is not in the local ki registry"
  })
})

test('territory handles use explicit prefixes, reject aliases and detect prefix/fallback collisions', () => {
  const capital = createCapital()
  writeFileSync(
    join(capital, '.ki.toml'),
    `${readFileSync(join(capital, '.ki.toml'), 'utf8')}territory_prefix = "ki"\n`
  )
  const state = temporary('ki-state-')
  const environment = { KI_STATE_HOME: state }
  const registered = `[repositories."capital-local"]\npath = "${capital}"\n`
  writeFileSync(join(state, 'registry.toml'), registered)
  expect('registry' in loadTerritoryRegistry('ki', environment)).toBe(true)
  expect(loadTerritoryRegistry('capital-local', environment)).toEqual({
    unavailable: "territory 'capital-local' is not a registered Capital handle"
  })
  expect(loadTerritoryRegistry('ki-extra', environment)).toEqual({
    unavailable: "territory 'ki-extra' is not in the local ki registry"
  })

  const other = createCapital()
  writeFileSync(
    join(other, '.ki.toml'),
    '[skills.ki-repo]\nrepository = "https://example.test/other"\ncapital = "https://example.test/other"\n'
  )
  writeFileSync(join(state, 'registry.toml'), `${registered}\n[repositories."ki"]\npath = "${other}"\n`)
  expect(loadTerritoryRegistry('ki', environment)).toEqual({
    unavailable: "territory handle 'ki' is ambiguous in the local ki registry"
  })
  writeFileSync(
    join(other, '.ki.toml'),
    '[skills.ki-repo]\nrepository = "https://example.test/other"\ncapital = "https://example.test/other"\nterritory_prefix = "ki"\n'
  )
  writeFileSync(join(state, 'registry.toml'), `${registered}\n[repositories."other"]\npath = "${other}"\n`)
  expect(loadTerritoryRegistry('ki', environment)).toEqual({
    unavailable: "territory handle 'ki' is ambiguous in the local ki registry"
  })
})

test('qualified membership resolves in the named territory and warns when it cannot', () => {
  const capital = createCapital()
  const state = temporary('ki-state-')
  writeFileSync(
    join(state, 'registry.toml'),
    `[repositories."capital"]\nrepository = "https://example.test/capital"\npath = "${capital}"\n`
  )
  const member = (fields: string): string => {
    const repository = createRepository(
      `kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null\n${fields}`,
      ''
    )
    writeFileSync(
      join(repository, '.ki.toml'),
      '[skills.ki-repo]\nrepo_code = "TEST"\nrepository = "https://example.test/own"\ncapital = "https://example.test/own"\n'
    )
    return repository
  }
  const previous = process.env.KI_STATE_HOME
  process.env.KI_STATE_HOME = state
  try {
    const resolved = member('project: capital/baseline-rollout')
    expect(failures(resolved)).toEqual([])
    expect(warnings(resolved)).toEqual([])
    expect(warnings(member('project: capital/unknown-project\ninitiative: capital/unknown-initiative'))).toEqual(
      expect.arrayContaining([
        "project 'capital/unknown-project' is not in the project registry",
        "initiative 'capital/unknown-initiative' is not in the project registry"
      ])
    )
    const absent = member('project: nowhere/agent-host')
    expect(failures(absent)).toEqual([])
    expect(warnings(absent)).toContain(
      "territory 'nowhere' registry is unavailable: territory 'nowhere' is not in the local ki registry"
    )
    expect(warnings(member('initiative: capital/techne'))).toEqual([])
    expect(warnings(member('project: capital/baseline-rollout\ninitiative: capital/platform-foundations'))).toContain(
      'initiative is redundant beside a registered project'
    )
    expect(failures(member('project: capital/baseline-rollout\ninitiative: capital/techne'))).toContainEqual(
      expect.objectContaining({
        msg: "initiative 'capital/techne' contradicts project 'capital/baseline-rollout', which serves 'capital/platform-foundations'"
      })
    )
    const local = member('project: capital/baseline-rollout\ninitiative: platform-foundations')
    cpSync(join(capital, 'Streams'), join(local, 'Streams'), { recursive: true })
    expect(failures(local)).toContainEqual(
      expect.objectContaining({
        msg: "initiative 'platform-foundations' contradicts project 'capital/baseline-rollout', which serves 'capital/platform-foundations'"
      })
    )
  } finally {
    if (previous === undefined) delete process.env.KI_STATE_HOME
    else process.env.KI_STATE_HOME = previous
  }
})

test('the retired Initiatives index inside Projects still resolves slugs with a migration warning', () => {
  const capital = createCapital()
  rmSync(join(capital, 'Streams', 'Initiatives'), { recursive: true })
  writeFileSync(
    join(capital, 'Streams', 'Projects', 'Initiatives.md'),
    '---\nnote_type: streams/initiatives\n---\n\n# Initiatives\n\n## Platform foundations\n\nSlug `platform-foundations`. The shared base.\n\n## Techne\n\nSlug `techne`. Agent work.\n'
  )
  const legacy = loadProjectRegistry(capital, {})
  expect('registry' in legacy && [...legacy.registry.initiatives].sort()).toEqual(['platform-foundations', 'techne'])
  expect('registry' in legacy && legacy.registry.legacyInitiativesIndex).toBe(true)

  const repository = createRepository(
    'kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null\ninitiative: techne',
    ''
  )
  writeFileSync(
    join(repository, '.ki.toml'),
    '[skills.ki-repo]\nrepo_code = "TEST"\nrepository = "https://example.test/own"\ncapital = "https://example.test/own"\n'
  )
  cpSync(join(capital, 'Streams'), join(repository, 'Streams'), { recursive: true })
  expect(failures(repository)).toEqual([])
  expect(warnings(repository)).toContain(
    'legacy: Streams/Projects/Initiatives.md is retired; keep one note per Initiative in Streams/Initiatives/'
  )
  expect(warnings(repository)).not.toContain("initiative 'techne' is not in the project registry")
})

test('the issue ledger accepts a digit-leading area code but not an all-digit one', () => {
  const ledger = issueLedger(
    new Map([
      ['5GE', 12],
      ['ENG', 3]
    ])
  )
  expect(ledgerAllocation(ledger)?.allocation).toEqual(
    new Map([
      ['5GE', 12],
      ['ENG', 3]
    ])
  )
  expect(ledgerAllocation(ledger.replace('5GE: 12', '555: 12'))).toBeUndefined()
})
