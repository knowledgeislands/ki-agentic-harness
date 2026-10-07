import { afterEach, expect, test } from 'bun:test'
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadProjectRegistry } from './project-registry.ts'
import { IDEAS_LIST, ISSUE_LEDGER, inspectRoadmap, issueLedger, rootRoadmap } from './roadmap-evidence.ts'

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
  expect(warnings(repository)).toContain('migration: an adopted record should declare kind')
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
      expect.objectContaining({ msg: 'project must be a lowercase kebab-case slug' })
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

test('fixed areas are a code list; the legacy theme map and themes list warn', () => {
  const repository = createRepository('kind: deliver\nhorizon: future\nstatus: draft\nbaseline_ref: null', '')
  writeFileSync(
    join(repository, '.ki.toml'),
    '[skills.ki-repo]\nrepo_code = "TEST"\n\n[skills.ki-work-roadmap]\nthemes = ["tooling"]\n'
  )
  expect(failures(repository)).toEqual([])
  expect(warnings(repository)).toContain('migration: ki-work-roadmap themes are retired; remove the themes list')
  writeFileSync(
    join(repository, '.ki.toml'),
    '[skills.ki-repo]\nrepo_code = "TEST"\n\n[skills.ki-work-roadmap]\nareas = ["core"]\n'
  )
  expect(failures(repository)).toContainEqual(
    expect.objectContaining({
      area: 'ROAD-6',
      msg: 'ki-work-roadmap areas must be a non-empty list of uppercase area codes'
    })
  )
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
  writeFileSync(
    join(capital, 'Streams', 'Projects', 'Initiatives.md'),
    '---\nnote_type: streams/initiatives\n---\n\n# Initiatives\n\n## Platform foundations\n\nSlug `platform-foundations`. The shared base.\n\n## Techne\n\nSlug `techne`. Agent work.\n'
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
    'project registry is unavailable: the capital has no Streams/Projects/ registry'
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
