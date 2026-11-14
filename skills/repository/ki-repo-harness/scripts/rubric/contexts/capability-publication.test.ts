import { expect, test } from 'bun:test'
import {
  CAPABILITY_CATALOGUE_END,
  CAPABILITY_CATALOGUE_START,
  type CapabilitySource,
  parseCapabilitySource,
  prepareCapabilityPublication,
  renderCapabilityCatalogue
} from './capability-publication.ts'

const source = (
  name: string,
  overrides: {
    path?: string
    kind?: 'governance' | 'process' | 'knowledge'
    applicability?: 'baseline' | 'detected' | 'declaration-only' | 'invocation-only'
    detects?: readonly string[]
    description?: string
    dependencies?: readonly string[]
    argumentHint?: string
    runtimeBinding?: boolean
    supportedRuntimes?: readonly string[]
  } = {}
): CapabilitySource => ({
  path: overrides.path ?? `skills/governance/${name}/SKILL.md`,
  content: `---
name: ${name}
ki-kind: ${overrides.kind ?? 'governance'}
ki-applicability: ${overrides.applicability ?? (overrides.kind === 'process' ? 'invocation-only' : 'declaration-only')}
${overrides.detects === undefined ? '' : `ki-detects: [${overrides.detects.join(', ')}]\n`}ki-depends-on: [${(overrides.dependencies ?? []).join(', ')}]
${overrides.runtimeBinding === undefined ? '' : `ki-runtime-binding: ${overrides.runtimeBinding}\n`}${overrides.supportedRuntimes === undefined ? '' : `ki-supported-runtimes: [${overrides.supportedRuntimes.join(', ')}]\n`}description: >
  ${overrides.description ?? `Use ${name} for its governed outcome.`}
${overrides.argumentHint === undefined ? '' : `argument-hint: '${overrides.argumentHint}'\n`}---

# ${name}
`
})

const estate = (sources: readonly CapabilitySource[]): readonly CapabilitySource[] => {
  const detected = sources.flatMap((candidate) => {
    const parsed = parseCapabilitySource(candidate)
    return parsed.entry?.applicability === 'detected' ? [parsed.entry.name] : []
  })
  return [
    source('ki-authoring', { applicability: 'baseline' }),
    source('ki-keystone', { applicability: 'baseline' }),
    source('ki-repo', { applicability: 'baseline', detects: ['ki-detected', ...detected] }),
    source('ki-detected', { applicability: 'detected' }),
    ...sources
  ]
}

const exactReadme = (sources: readonly CapabilitySource[], before = '# Skills\n', after = ''): string =>
  `${before.trimEnd()}\n\n${prepareCapabilityPublication(undefined, estate(sources)).rendered}${after}`

const entry = (capabilitySource: CapabilitySource) => {
  const parsed = parseCapabilitySource(capabilitySource)
  if (!parsed.entry) throw new Error(parsed.issue)
  return parsed.entry
}

test('parses folded frontmatter into normalized capability facts', () => {
  expect(
    parseCapabilitySource(
      source('ki-example', {
        path: 'skills/agentic-systems/ki-example/SKILL.md',
        kind: 'process',
        description: 'Use ki-example for a folded\n  outcome.',
        dependencies: ['ki-base'],
        argumentHint: 'run <target>',
        runtimeBinding: true,
        supportedRuntimes: ['chatgpt-codex']
      })
    )
  ).toEqual({
    entry: {
      path: 'skills/agentic-systems/ki-example/SKILL.md',
      domain: 'agentic-systems',
      name: 'ki-example',
      kind: 'process',
      applicability: 'invocation-only',
      detects: [],
      description: 'Use ki-example for a folded outcome.',
      argumentHint: 'run <target>',
      dependencies: ['ki-base'],
      runtimeBinding: true,
      supportedRuntimes: ['chatgpt-codex']
    }
  })
})

test('fails closed on malformed or incomplete frontmatter', () => {
  expect(parseCapabilitySource({ path: 'skills/broken/SKILL.md', content: '---\nname: [\n---\n' }).issue).toContain(
    'invalid YAML'
  )
  expect(parseCapabilitySource({ path: 'skills/broken/SKILL.md', content: '# Missing' }).issue).toContain(
    'no complete YAML frontmatter'
  )
})

test('renders exact counts and runtime-neutral source facts without a diagram', () => {
  const rendered = renderCapabilityCatalogue([
    entry(source('ki-base')),
    entry(
      source('ki-run', {
        kind: 'process',
        dependencies: ['ki-base'],
        argumentHint: 'run <target>',
        runtimeBinding: true,
        supportedRuntimes: ['claude-code']
      })
    )
  ])
  expect(rendered).toContain('2 skills: 1 governance skill and 1 process skill')
  expect(rendered).toContain('- **Arguments:** `run <target>`')
  expect(rendered).toContain('- **Applicability:** Invocation Only')
  expect(rendered).toContain('- **Dependencies:** `ki-base`')
  expect(rendered).toContain('Runtime-bound: `claude-code`')
  expect(rendered).not.toContain('/ki-run')
  expect(rendered).not.toContain('```mermaid')
})

test('add, rename, remove, kind, domain, dependency, runtime, and argument changes stale the publication', () => {
  const baseline = [source('ki-base'), source('ki-example', { dependencies: ['ki-base'] })]
  const base = baseline[0]
  if (!base) throw new Error('baseline source is missing')
  const readme = exactReadme(baseline)
  const variants: readonly CapabilitySource[][] = [
    [...baseline, source('ki-added')],
    [base, source('ki-renamed', { dependencies: ['ki-base'] })],
    [base],
    [base, source('ki-example', { kind: 'process', dependencies: ['ki-base'] })],
    [base, source('ki-example', { path: 'skills/environment/ki-example/SKILL.md', dependencies: ['ki-base'] })],
    [base, source('ki-example')],
    [base, source('ki-example', { dependencies: ['ki-base'], runtimeBinding: true })],
    [base, source('ki-example', { dependencies: ['ki-base'], argumentHint: 'audit <repo>' })]
  ]
  for (const variant of variants) expect(prepareCapabilityPublication(readme, estate(variant)).state).toBe('stale')
})

test('preserves authored content around one marker-bounded replacement', () => {
  const original = exactReadme([source('ki-example')], '# Skills\n\nAuthored before.', '\nAuthored after.\n')
  const draft = prepareCapabilityPublication(original, estate([source('ki-example', { description: 'Changed.' })]))
  expect(draft.state).toBe('stale')
  expect(draft.merged).toStartWith('# Skills\n\nAuthored before.\n\n')
  expect(draft.merged).toEndWith('\nAuthored after.\n')
  expect(draft.merged?.split(CAPABILITY_CATALOGUE_START)).toHaveLength(2)
  expect(draft.merged?.split(CAPABILITY_CATALOGUE_END)).toHaveLength(2)
})

test('fails closed when applicability collection invariants drift', () => {
  const invalid = [
    [source('ki-example')],
    estate([source('ki-run', { kind: 'process', applicability: 'declaration-only' })]),
    [
      source('ki-authoring', { applicability: 'baseline' }),
      source('ki-repo', { applicability: 'baseline', detects: ['ki-detected'] }),
      source('ki-detected', { applicability: 'detected' }),
      source('ki-example', { applicability: 'detected' })
    ],
    [
      source('ki-authoring', { applicability: 'baseline' }),
      source('ki-repo', { applicability: 'baseline', detects: ['ki-example'] }),
      source('ki-example')
    ],
    estate([source('ki-example', { detects: ['ki-other'] })])
  ]
  for (const sources of invalid)
    expect(prepareCapabilityPublication(undefined, sources)).toMatchObject({ state: 'unsafe' })
})

test('a non-KI provider publishes its own capabilities without republishing the KI baseline', () => {
  const sources = [source('hnr-backend'), source('hnr-review', { kind: 'process' })]
  const draft = prepareCapabilityPublication('# Skills\n', sources, 'hnr')
  expect(draft.state).toBe('missing')
  expect(draft.issues).toEqual([])
  expect(draft.counts).toEqual({ total: 2, governance: 1, process: 1, knowledge: 0 })
  expect(prepareCapabilityPublication(draft.merged, sources, 'hnr').state).toBe('in-sync')
})

test('a non-KI provider still rejects invalid applicability and detector ownership', () => {
  const invalid = [
    [source('hnr-backend', { applicability: 'baseline' })],
    [source('hnr-backend', { applicability: 'invocation-only' })],
    [source('hnr-review', { kind: 'process', applicability: 'declaration-only' })],
    [source('hnr-backend', { detects: ['hnr-other'] })],
    [source('hnr-backend', { dependencies: ['hnr-missing'] })],
    [{ path: 'skills/hnr-backend/SKILL.md', content: '# Missing metadata\n' }]
  ]
  for (const sources of invalid) expect(prepareCapabilityPublication(undefined, sources, 'hnr').state).toBe('unsafe')
})

test('rejects unknown dependencies and ambiguous marker layouts', () => {
  expect(
    prepareCapabilityPublication(undefined, estate([source('ki-example', { dependencies: ['ki-missing'] })]))
  ).toEqual(
    expect.objectContaining({ state: 'unsafe', issues: [expect.stringContaining('unknown capability ki-missing')] })
  )
  expect(
    prepareCapabilityPublication(
      `${CAPABILITY_CATALOGUE_START}\n${CAPABILITY_CATALOGUE_START}\n${CAPABILITY_CATALOGUE_END}`,
      estate([source('ki-example')])
    )
  ).toEqual(expect.objectContaining({ state: 'unsafe', issues: [expect.stringContaining('ambiguous')] }))
})

test('a knowledge skill is published, counted and must be invocation-only', () => {
  const sources = [
    source('hnr-backend'),
    source('hnr-review', { kind: 'process' }),
    source('hnr-terms', { kind: 'knowledge', applicability: 'invocation-only' })
  ]
  const draft = prepareCapabilityPublication('# Skills\n', sources, 'hnr')
  expect(draft.issues).toEqual([])
  expect(draft.counts).toEqual({ total: 3, governance: 1, process: 1, knowledge: 1 })
  expect(draft.rendered).toContain('3 skills: 1 governance skill, 1 process skill and 1 knowledge skill.')
  expect(draft.rendered).toContain('- **Kind:** Knowledge')

  const opted = prepareCapabilityPublication(
    '# Skills\n',
    [source('hnr-backend'), source('hnr-terms', { kind: 'knowledge', applicability: 'declaration-only' })],
    'hnr'
  )
  expect(opted.state).toBe('unsafe')
  expect(opted.issues.some((issue) => issue.endsWith('knowledge capability must be invocation-only'))).toBe(true)
})

const withGuild = (capabilitySource: CapabilitySource, guild: string, leads?: string): CapabilitySource => ({
  ...capabilitySource,
  content: capabilitySource.content.replace(
    /^ki-applicability: .*$/m,
    (line) => `${line}\nki-guild: ${guild}${leads === undefined ? '' : `\nki-leads: ${leads}`}`
  )
})

test('reads guild keys and groups the catalogue by declared guild, not by folder', () => {
  const lead = entry(withGuild(source('ki-lead', { path: 'skills/anywhere/ki-lead/SKILL.md' }), 'keystone', 'craft'))
  const member = entry(withGuild(source('ki-member', { path: 'skills/anywhere/ki-member/SKILL.md' }), 'craft'))
  expect(lead).toMatchObject({ guild: 'keystone', leads: 'craft', domain: 'anywhere' })
  const rendered = renderCapabilityCatalogue([lead, member])
  expect(rendered).toContain('### Craft\n\n#### `ki-member`')
  expect(rendered).toContain('### Keystone\n\n#### `ki-lead`')
  expect(rendered).toContain('- **Leads:** Craft')
  expect(rendered).not.toContain('### Anywhere')
})

test('fails closed when guild membership drifts', () => {
  expect(parseCapabilitySource(withGuild(source('ki-example'), 'Not A Guild'))).toEqual({
    issue: 'skills/governance/ki-example/SKILL.md has an invalid ki-guild'
  })
  const guilded = estate([]).map((candidate) => withGuild(candidate, 'keystone'))
  expect(prepareCapabilityPublication(undefined, [...guilded, source('ki-loose')]).issues).toEqual([
    'skills/governance/ki-loose/SKILL.md declares no ki-guild'
  ])
  expect(
    prepareCapabilityPublication(undefined, [...guilded, withGuild(source('ki-lead'), 'craft', 'craft')]).issues
  ).toEqual(['skills/governance/ki-lead/SKILL.md leads craft but is not a member of keystone'])
  expect(
    prepareCapabilityPublication(undefined, [
      ...guilded,
      withGuild(source('ki-one'), 'keystone', 'craft'),
      withGuild(source('ki-two'), 'keystone', 'craft')
    ]).issues
  ).toEqual(['guild craft has more than one lead: ki-one, ki-two'])
})
