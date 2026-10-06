import { afterEach, expect, test } from 'bun:test'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { AUTH } from '../items/authority.ts'
import { CONFIG } from '../items/configuration.ts'
import { POLICY } from '../items/policy.ts'
import { RECORD } from '../items/records.ts'
import { RELEASE } from '../items/release.ts'
import { ROUTE } from '../items/routes.ts'
import { SCAFFOLD } from '../items/scaffold.ts'
import { STANDING } from '../items/standing.ts'
import { STATUS } from '../items/status.ts'
import { createTradesSession, tradeReadmes } from './trades.ts'

const temporaryDirectories: string[] = []
const initialStateHome = process.env.KI_STATE_HOME

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
  if (initialStateHome === undefined) delete process.env.KI_STATE_HOME
  else process.env.KI_STATE_HOME = initialStateHome
})

const temporaryDirectory = (prefix: string): string => {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  temporaryDirectories.push(directory)
  return directory
}

const repositoryUrl = (identity: string): string => `https://github.com/${identity}`
const CAPITAL = repositoryUrl('capital/repo')
const LOCAL = repositoryUrl('local/repo')
const PEER = repositoryUrl('peer/repo')

type Kind = 'work' | 'knowledge'
type Channel = {
  readonly id: string
  readonly from: readonly string[]
  readonly to: readonly string[]
  readonly kinds: readonly unknown[]
  readonly [key: string]: unknown
}
type Standing = { readonly subtype: string; readonly from: readonly string[]; readonly to: readonly string[] }
type Policy = {
  readonly subtypes?: Readonly<Record<string, string>>
  readonly channels?: readonly Channel[]
  readonly standing?: readonly Standing[]
}

/** Channels in both directions between the local repository and its peer for the given kinds. */
const exchange = (kinds: readonly Kind[] = ['work', 'knowledge']): Policy => ({
  channels: [
    { id: 'local-to-peer', from: [LOCAL], to: [PEER], kinds },
    { id: 'peer-to-local', from: [PEER], to: [LOCAL], kinds }
  ]
})

// Strings and string arrays serialise identically in JSON and TOML.
const toml = (value: unknown): string => JSON.stringify(value)

const policyToml = (policy: Policy): readonly string[] => [
  '[skills.ki-trades.territory]',
  '',
  ...(policy.subtypes
    ? [
        '[skills.ki-trades.territory.subtypes]',
        ...Object.entries(policy.subtypes).map(([subtype, description]) => `${toml(subtype)} = ${toml(description)}`),
        ''
      ]
    : []),
  ...(policy.channels ?? []).flatMap((channel) => [
    '[[skills.ki-trades.territory.channels]]',
    ...Object.entries({ purpose: 'Test exchange.', ...channel }).map(([key, value]) => `${key} = ${toml(value)}`),
    ''
  ]),
  ...(policy.standing ?? []).flatMap((grant) => [
    '[[skills.ki-trades.territory.standing]]',
    ...Object.entries(grant).map(([key, value]) => `${key} = ${toml(value)}`),
    ''
  ])
]

const writeConfiguration = (
  root: string,
  settings: {
    readonly repository: string
    readonly capital?: string
    readonly territory?: readonly string[]
    readonly trades?: boolean
    readonly policy?: Policy
  }
): void => {
  writeFileSync(
    join(root, '.ki.toml'),
    [
      '[skills.ki-repo]',
      `repository = ${toml(settings.repository)}`,
      ...(settings.capital === undefined ? [] : [`capital = ${toml(settings.capital)}`]),
      '',
      ...(settings.territory
        ? [
            '[skills.ki-repo.territory]',
            'name = "Test territory"',
            `members = ${toml([...settings.territory].sort())}`,
            ''
          ]
        : []),
      ...(settings.trades === false ? [] : ['[skills.ki-trades]', '']),
      ...(settings.policy ? policyToml(settings.policy) : [])
    ].join('\n')
  )
}

/** The ki-trades table a checkout declares, as the host passes it to the session. */
const ownTrades = (root: string): Record<string, unknown> => {
  const document = Bun.TOML.parse(readFileSync(join(root, '.ki.toml'), 'utf8')) as {
    skills?: Record<string, Record<string, unknown>>
  }
  return document.skills?.['ki-trades'] ?? {}
}

const scaffold = (root: string): void => {
  mkdirSync(join(root, '+'), { recursive: true })
  mkdirSync(join(root, '-'), { recursive: true })
  for (const readme of tradeReadmes) {
    mkdirSync(join(root, readme.path, '..'), { recursive: true })
    writeFileSync(join(root, readme.path), readme.content)
  }
}

const stateHome = (home: string): string => join(home, 'state')

const registry = (home: string, roots: readonly string[]): void => {
  mkdirSync(stateHome(home), { recursive: true })
  writeFileSync(
    join(stateHome(home), 'registry.toml'),
    [
      'schema = 1',
      '',
      ...roots.flatMap((root, index) => [
        `[repositories.${JSON.stringify(`repository-${index + 1}`)}]`,
        `path = ${JSON.stringify(root)}`,
        ''
      ])
    ].join('\n')
  )
}

type FixtureOptions = {
  readonly peerIdentity?: string
  readonly peerTrades?: boolean
  readonly peerCapital?: string
  readonly policy?: Policy
  readonly members?: readonly string[]
  readonly registerCapital?: boolean
}

/**
 * A territory of three registered checkouts: a Capital hosting the trade policy, the local
 * member under audit, and its peer. Each member reaches the policy through its own `capital`.
 */
const fixture = ({
  peerIdentity = 'peer/repo',
  peerTrades = true,
  peerCapital = CAPITAL,
  policy = exchange(),
  members = [CAPITAL, LOCAL, PEER],
  registerCapital = true
}: FixtureOptions = {}) => {
  const home = temporaryDirectory('ki-trades-home-')
  const capital = temporaryDirectory('ki-trades-capital-')
  const local = temporaryDirectory('ki-trades-local-')
  const peer = temporaryDirectory('ki-trades-peer-')
  scaffold(local)
  scaffold(peer)
  writeConfiguration(capital, { repository: CAPITAL, capital: CAPITAL, territory: members, policy })
  writeConfiguration(local, { repository: LOCAL, capital: CAPITAL })
  writeConfiguration(peer, { repository: repositoryUrl(peerIdentity), capital: peerCapital, trades: peerTrades })
  registry(home, registerCapital ? [local, peer, capital] : [local, peer])
  return { home, capital, local, peer }
}

const options = (
  repository: string,
  userHome: string,
  configuration: Record<string, unknown> = ownTrades(repository),
  mode: 'audit' | 'conform' = 'audit'
): RubricContextOptions => {
  process.env.KI_STATE_HOME = stateHome(userHome)
  return {
    mode,
    repository,
    userHome,
    configuration
  }
}

const record = (
  id: string,
  sender: string,
  receiver: string,
  receiverFields: readonly string[] = [],
  submission = 'Please consider the proposed local outcome.',
  kind: 'work' | 'knowledge' = 'work',
  observation: 'unattended' | 'receipt' | 'decision' | 'completion' | undefined = 'decision',
  preparing = false
): string =>
  [
    '---',
    `id: ${id}`,
    "title: 'Submission title'",
    "created_at: '2026-08-03T12:00:00Z'",
    `sender: ${sender}`,
    `receiver: ${receiver}`,
    `kind: ${kind}`,
    'source_ref: KI-SOURCE-FND-001',
    ...(observation ? [`observation: ${observation}`] : []),
    ...(preparing ? ['phase: preparing'] : []),
    ...receiverFields,
    '---',
    '',
    `# ${id}: Submission title`,
    '',
    '## Context',
    '',
    'The sender has relevant originating evidence.',
    '',
    '## Submission',
    '',
    submission,
    '',
    '## Constraints',
    '',
    'The receiver retains roadmap, priority, implementation, and acceptance authority.',
    ''
  ].join('\n')

/** A record declares the phase of the copy it is; the fixture supplies the resting value unless a test states one. */
const writeRecord = (root: string, direction: '+' | '-', peerIdentity: string, id: string, content: string): void => {
  const directory = join(root, direction, '_TRADES', ...peerIdentity.split('/'))
  mkdirSync(directory, { recursive: true })
  const phased = /^phase: /m.test(content)
    ? content
    : content.replace('\n---\n', `\nphase: ${direction === '+' ? 'received' : 'submitted'}\n---\n`)
  writeFileSync(join(directory, `${id}.md`), phased)
}

const mechanicalOutcomes = (
  session: ReturnType<typeof createTradesSession>,
  family:
    | typeof CONFIG
    | typeof ROUTE
    | typeof POLICY
    | typeof SCAFFOLD
    | typeof RECORD
    | typeof AUTH
    | typeof STATUS
    | typeof RELEASE
    | typeof STANDING,
  code?: string
) => {
  const item = code ? family.items.find((candidate) => candidate.code === code) : family.items[0]
  if (!item?.mechanical) throw new Error(`${family.code} has no mechanical item ${code ?? ''}`)
  return item.mechanical.audit.run(family.selectContext(session.subjects[0]?.context() as never) as never)
}

const messagesOf = (outcomes: readonly { readonly message: string }[]): readonly string[] =>
  outcomes.map((outcome) => outcome.message)

test('the member table is bare: retired route and subtype keys fail', () => {
  const { home, local } = fixture()
  const session = createTradesSession(
    options(local, home, {
      routes: { 'peer/repo': { export: ['work'] } },
      subtypes: { knowledge: { known: 'Known receiver vocabulary.' } },
      territory: {},
      gossip: true
    })
  )
  const outcomes = mechanicalOutcomes(session, CONFIG)

  expect(outcomes).toContainEqual({
    status: 'VIOLATION',
    message: `ki-trades routes is retired: routes and knowledge subtypes now come from the Capital's territory trade policy in ${CAPITAL}`,
    subject: '.ki.toml'
  })
  expect(outcomes).toContainEqual({
    status: 'VIOLATION',
    message: `ki-trades subtypes is retired: routes and knowledge subtypes now come from the Capital's territory trade policy in ${CAPITAL}`,
    subject: '.ki.toml'
  })
  expect(messagesOf(outcomes)).toContain(
    'ki-trades territory is the Capital trade policy and is permitted only where capital equals repository'
  )
  expect(outcomes).toContainEqual({
    status: 'VIOLATION',
    message: 'unrecognised ki-trades configuration key gossip; a member table carries only map_bonus',
    subject: '.ki.toml'
  })
})

test('retired keys never contribute routes', () => {
  const { home, local } = fixture({ policy: {} })
  const session = createTradesSession(options(local, home, { routes: { 'peer/repo': { export: ['work'] } } }))

  expect(mechanicalOutcomes(session, ROUTE)).toEqual([
    { status: 'PASS', message: `The territory trade policy in ${CAPITAL} grants this repository no routes.` }
  ])
})

test('map bonus is bounded presentation metadata', () => {
  const { home, local } = fixture()
  const valid = createTradesSession(options(local, home, { map_bonus: 1 }))
  expect(mechanicalOutcomes(valid, CONFIG)).toEqual([
    { status: 'PASS', message: 'The ki-trades member table is canonical.' }
  ])

  const invalid = createTradesSession(options(local, home, { map_bonus: 4 }))
  expect(mechanicalOutcomes(invalid, CONFIG)).toContainEqual({
    status: 'VIOLATION',
    message: 'map_bonus must be an integer from 0 through 3',
    subject: '.ki.toml'
  })
})

test('routes come only from the Capital policy resolved through the declared capital', () => {
  const { home, local } = fixture()
  const session = createTradesSession(options(local, home))

  const outcomes = mechanicalOutcomes(session, ROUTE)
  for (const kind of ['work', 'knowledge'])
    for (const [direction, arrow] of [
      ['export', '→'],
      ['import', '←']
    ])
      expect(outcomes).toContainEqual({
        status: 'PASS',
        message: `${kind} ${direction} trade route ${LOCAL} ${arrow} ${PEER} is active`,
        subject: PEER
      })
  expect(outcomes.every((outcome) => outcome.status === 'PASS')).toBe(true)
  expect(mechanicalOutcomes(session, ROUTE, 'ROUTE-2')).toEqual([
    { status: 'PASS', message: 'The territory trade policy names this repository in a channel.' }
  ])
})

test('a route is granted only for the kinds its channel carries', () => {
  const { home, local } = fixture({ policy: exchange(['work']) })
  const messages = messagesOf(mechanicalOutcomes(createTradesSession(options(local, home)), ROUTE))

  expect(messages).toContain(`work export trade route ${LOCAL} → ${PEER} is active`)
  expect(messages.some((message) => message.startsWith('knowledge'))).toBe(false)
})

test('an unregistered Capital warns that the policy is not available here', () => {
  const { home, local } = fixture({ registerCapital: false })
  const session = createTradesSession(options(local, home))

  expect(mechanicalOutcomes(session, ROUTE)).toEqual([
    {
      status: 'VIOLATION',
      level: 'WARN',
      message: `territory policy lives in ${CAPITAL}, not available here`,
      subject: CAPITAL
    }
  ])
  expect(mechanicalOutcomes(session, ROUTE, 'ROUTE-2')).toEqual([
    { status: 'NOT_APPLICABLE', message: 'the territory trade policy is not resolved; ROUTE-1 reports it' }
  ])
})

test('an ambiguous, malformed, or non-listing Capital fails closed', () => {
  const ambiguous = fixture()
  const copy = temporaryDirectory('ki-trades-capital-copy-')
  cpSync(join(ambiguous.capital, '.ki.toml'), join(copy, '.ki.toml'))
  registry(ambiguous.home, [ambiguous.local, ambiguous.peer, ambiguous.capital, copy])
  expect(mechanicalOutcomes(createTradesSession(options(ambiguous.local, ambiguous.home)), ROUTE)).toEqual([
    {
      status: 'VIOLATION',
      message: `territory policy in ${CAPITAL} is ambiguous across 2 registered checkouts; no routes are granted`,
      subject: CAPITAL
    }
  ])

  const malformed = fixture({
    policy: { channels: [{ id: 'stranger', from: [LOCAL], to: [repositoryUrl('stranger/repo')], kinds: ['work'] }] }
  })
  expect(mechanicalOutcomes(createTradesSession(options(malformed.local, malformed.home)), ROUTE)).toEqual([
    {
      status: 'VIOLATION',
      message: `territory trade policy in ${CAPITAL} is malformed and fails closed; no routes are granted`,
      subject: CAPITAL
    }
  ])

  const unlisted = fixture({ members: [CAPITAL, PEER], policy: {} })
  expect(mechanicalOutcomes(createTradesSession(options(unlisted.local, unlisted.home)), ROUTE)).toEqual([
    {
      status: 'VIOLATION',
      message: `Capital ${CAPITAL} does not list ${LOCAL} as a territory member; no routes are granted`,
      subject: CAPITAL
    }
  ])
})

test('a participating member named in no channel is warned', () => {
  const { home, local } = fixture({ policy: {} })
  const session = createTradesSession(options(local, home))

  expect(mechanicalOutcomes(session, ROUTE, 'ROUTE-2')).toEqual([
    {
      status: 'VIOLATION',
      message: `ki-trades is declared but the territory trade policy in ${CAPITAL} names this repository in no channel`,
      subject: '.ki.toml'
    }
  ])
  expect(ROUTE.items.find((item) => item.code === 'ROUTE-2')?.mechanical?.level).toBe('WARN')
})

test('a granted route stays pending until the peer registers, participates, and shares the Capital', () => {
  const unregistered = fixture({ peerIdentity: 'peer/other' })
  expect(mechanicalOutcomes(createTradesSession(options(unregistered.local, unregistered.home)), ROUTE)).toContainEqual(
    {
      status: 'INFO',
      message: `work export route ${PEER} awaits receiver registration`,
      subject: PEER
    }
  )

  const silent = fixture({ peerTrades: false })
  expect(mechanicalOutcomes(createTradesSession(options(silent.local, silent.home)), ROUTE)).toContainEqual({
    status: 'INFO',
    message: `work import route ${PEER} awaits sender ki-trades participation`,
    subject: PEER
  })

  const elsewhere = repositoryUrl('elsewhere/capital')
  const foreign = fixture({ peerCapital: elsewhere })
  expect(mechanicalOutcomes(createTradesSession(options(foreign.local, foreign.home)), ROUTE)).toContainEqual({
    status: 'VIOLATION',
    message: `work export route ${PEER} is inactive: ${PEER} names capital ${JSON.stringify(elsewhere)}, not ${CAPITAL}`,
    subject: PEER
  })
})

test('standing intake activates only for an exact-subtype grant in the Capital policy', () => {
  const { home, local } = fixture({
    policy: {
      ...exchange(['knowledge']),
      subtypes: { 'shared-maintenance': 'Territory-defined shared maintenance evidence.' },
      standing: [{ subtype: 'shared-maintenance', from: [PEER], to: [LOCAL] }]
    }
  })

  const outcomes = mechanicalOutcomes(createTradesSession(options(local, home)), ROUTE)
  expect(outcomes).toContainEqual({
    status: 'PASS',
    message: `standing knowledge shared-maintenance ${LOCAL} ← ${PEER} active`,
    subject: PEER
  })
  expect(messagesOf(outcomes).filter((message) => message.startsWith('standing'))).toHaveLength(1)
})

test('marked standing intake blocks fail closed on malformed provenance', () => {
  const { home, local } = fixture()
  const directory = join(local, 'docs')
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    join(directory, 'capture.md'),
    [
      '# Capture',
      '',
      '<!-- ki-trades:standing-intake -->',
      '```toml',
      'schema = "unknown"',
      'id = "STI-NOTHEX"',
      'source = "not-a-repository"',
      'source_ref = "floating"',
      'receiver = "https://github.com/other/repo"',
      'kind = "work"',
      'subtype = "Bad Subtype"',
      'captured_at = "tomorrow"',
      'capture = "elsewhere.md#capture"',
      '```',
      ''
    ].join('\n')
  )

  const session = createTradesSession(options(local, home))
  const messages = messagesOf(mechanicalOutcomes(session, STANDING))
  expect(messages).toContain('standing intake schema must be ki-trades/standing-intake/v1')
  expect(messages).toContain('standing intake id must use STI plus eight lower-case hexadecimal characters')
  expect(messages).toContain('standing intake kind must be knowledge')
  expect(messages).toContain('standing intake capture must point into docs/capture.md')
})

test('the Capital validates its trade policy schema and fails closed', () => {
  const { home, capital } = fixture({
    policy: {
      subtypes: { 'Bad Subtype': '' },
      channels: [
        { id: 'one', from: [LOCAL], to: [PEER, LOCAL], kinds: ['work', 'gossip'] },
        { id: 'two', from: [LOCAL], to: [PEER], kinds: ['work'], extra: true },
        { id: 'three', from: ['not-a-url'], to: [repositoryUrl('stranger/repo')], kinds: [] }
      ],
      standing: [{ subtype: 'undefined-subtype', from: [PEER], to: [LOCAL] }]
    }
  })
  const session = createTradesSession(options(capital, home))
  const outcomes = mechanicalOutcomes(session, POLICY)

  const subject = `${CAPITAL} [skills.ki-trades.territory]`
  expect(outcomes).toEqual(
    [
      'knowledge subtype Bad Subtype must be a lower-case hyphenated identifier',
      'knowledge subtype Bad Subtype must have a non-empty description',
      `channel one names ${LOCAL} on both sides; a repository cannot trade with itself`,
      'channel one kind "gossip" is not work or knowledge',
      'channel two key extra is not allowed',
      `channel two repeats the work route ${LOCAL} -> ${PEER} already granted by channel one`,
      'channel three from endpoint "not-a-url" is not a canonical HTTPS GitHub URL',
      'channel three kinds must be a non-empty array',
      'standing grant 1 subtype "undefined-subtype" is not defined in territory subtypes',
      `standing grant 1 undefined-subtype ${PEER} -> ${LOCAL} has no knowledge channel`,
      `${repositoryUrl('stranger/repo')} is named by the trade policy but is not a territory member`
    ].map((message) => ({ status: 'VIOLATION', message, subject }))
  )
  expect(mechanicalOutcomes(session, ROUTE)).toEqual([
    {
      status: 'VIOLATION',
      message: `territory trade policy in ${CAPITAL} is malformed and fails closed; no routes are granted`,
      subject: CAPITAL
    }
  ])
})

test('the Capital hosts a well-formed policy and checks that named islands declare ki-trades', () => {
  const { home, capital } = fixture({ peerTrades: false })
  const conforming = createTradesSession(options(capital, home))
  expect(mechanicalOutcomes(conforming, POLICY)).toEqual([
    { status: 'PASS', message: 'The territory trade policy is well formed.' }
  ])
  expect(mechanicalOutcomes(conforming, POLICY, 'POLICY-2')).toEqual([
    {
      status: 'VIOLATION',
      message: `${PEER} is named by the territory trade policy but declares no [skills.ki-trades]`,
      subject: PEER
    }
  ])
  expect(mechanicalOutcomes(conforming, ROUTE, 'ROUTE-2')).toEqual([
    { status: 'NOT_APPLICABLE', message: 'the Capital hosts the territory trade policy' }
  ])

  registry(home, [capital])
  expect(mechanicalOutcomes(createTradesSession(options(capital, home)), POLICY, 'POLICY-2')).toEqual([
    { status: 'PASS', message: 'Every locally registered island the policy names declares ki-trades.' },
    { status: 'INFO', message: `${LOCAL} not checked out here`, subject: LOCAL },
    { status: 'INFO', message: `${PEER} not checked out here`, subject: PEER }
  ])
})

test('policy checks do not apply to a member', () => {
  const { home, local } = fixture()
  const session = createTradesSession(options(local, home))
  for (const code of ['POLICY-1', 'POLICY-2'])
    expect(mechanicalOutcomes(session, POLICY, code)).toEqual([
      { status: 'NOT_APPLICABLE', message: 'not a Capital; the territory trade policy lives in the Capital' }
    ])
})

test('outbound records are valid on a granted export route while receiver participation is pending', () => {
  const { home, local } = fixture({ peerTrades: false })
  const id = 'TRD-000000aa'
  writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo'))

  const session = createTradesSession(options(local, home))
  expect(mechanicalOutcomes(session, ROUTE)).toContainEqual({
    status: 'INFO',
    message: `work export route ${PEER} awaits receiver ki-trades participation`,
    subject: PEER
  })
  expect(mechanicalOutcomes(session, AUTH)).toEqual([
    {
      status: 'PASS',
      message: 'Trade records preserve sender and receiver write boundaries.'
    }
  ])
  expect(mechanicalOutcomes(session, RELEASE)).toEqual([
    {
      status: 'PASS',
      message: 'receiver has not created an inbound copy; sender retains the outbound record',
      subject: `-/_TRADES/peer/repo/${id}.md`
    }
  ])
})

test('records outside a granted route are refused, and unverifiable when the policy is not available', () => {
  const ungranted = fixture({ policy: exchange(['knowledge']) })
  const id = 'TRD-000000a1'
  writeRecord(ungranted.local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo'))
  const refused = mechanicalOutcomes(createTradesSession(options(ungranted.local, ungranted.home)), AUTH)
  expect(refused).toEqual([
    {
      status: 'VIOLATION',
      message: 'work outbound record has no route to peer/repo granted by the territory trade policy',
      subject: `-/_TRADES/peer/repo/${id}.md`
    }
  ])

  const unavailable = fixture({ registerCapital: false })
  writeRecord(unavailable.local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo'))
  const unverifiable = mechanicalOutcomes(createTradesSession(options(unavailable.local, unavailable.home)), AUTH)
  expect(unverifiable).toEqual([
    {
      status: 'INFO',
      message: `route authority is unverifiable: territory policy lives in ${CAPITAL}, not available here`,
      subject: `-/_TRADES/peer/repo/${id}.md`
    }
  ])
})

test('a committed preparation is valid on a granted export and is not receivable', () => {
  const { home, local } = fixture({ peerTrades: false })
  const id = 'TRD-000000ab'
  writeRecord(
    local,
    '-',
    'peer/repo',
    id,
    record(id, 'local/repo', 'peer/repo', [], undefined, 'knowledge', 'receipt', true)
  )

  const session = createTradesSession(options(local, home))
  expect(mechanicalOutcomes(session, RECORD)).toEqual([
    {
      status: 'PASS',
      message: 'Trade record identity and payload shape are valid.'
    }
  ])
  expect(mechanicalOutcomes(session, AUTH)).toEqual([
    {
      status: 'PASS',
      message: 'Trade records preserve sender and receiver write boundaries.'
    }
  ])
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toEqual([
    {
      status: 'PASS',
      message: 'Every trade record declares the phase its copy holds.'
    }
  ])
})

test('a preparation and its submitted successor share one peer path and differ only by phase', () => {
  const { home, local } = fixture()
  const preparingId = 'TRD-000000ac'
  const submittedId = 'TRD-000000ad'
  writeRecord(
    local,
    '-',
    'peer/repo',
    preparingId,
    record(preparingId, 'local/repo', 'peer/repo', [], undefined, 'work', 'decision', true)
  )
  writeRecord(local, '-', 'peer/repo', submittedId, record(submittedId, 'local/repo', 'peer/repo'))

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toEqual([
    {
      status: 'PASS',
      message: 'Every trade record declares the phase its copy holds.'
    }
  ])
  expect(mechanicalOutcomes(session, RECORD)).toEqual([
    {
      status: 'PASS',
      message: 'Trade record identity and payload shape are valid.'
    }
  ])
})

test('a missing, invalid, or misplaced phase is refused on every copy', () => {
  const { home, local, peer } = fixture()
  const absentId = 'TRD-000000b0'
  writeRecord(
    local,
    '-',
    'peer/repo',
    absentId,
    record(absentId, 'local/repo', 'peer/repo').replace('\n---\n', '\nphase: \n---\n')
  )
  const invalidId = 'TRD-000000b1'
  writeRecord(
    local,
    '-',
    'peer/repo',
    invalidId,
    record(invalidId, 'local/repo', 'peer/repo').replace('\n---\n', '\nphase: released\n---\n')
  )
  const misplacedId = 'TRD-000000b2'
  writeRecord(peer, '-', 'local/repo', misplacedId, record(misplacedId, 'peer/repo', 'local/repo'))
  writeRecord(
    local,
    '+',
    'peer/repo',
    misplacedId,
    record(misplacedId, 'peer/repo', 'local/repo', ['decision_status: unconsidered']).replace(
      '\n---\n',
      '\nphase: submitted\n---\n'
    )
  )

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toContainEqual({
    status: 'VIOLATION',
    message: 'phase must be one of preparing, submitted, received',
    subject: `-/_TRADES/peer/repo/${absentId}.md`
  })
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toContainEqual({
    status: 'VIOLATION',
    message: 'phase must be one of preparing, submitted, received',
    subject: `-/_TRADES/peer/repo/${invalidId}.md`
  })
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toContainEqual({
    status: 'VIOLATION',
    message: 'an inbound record must declare phase: received',
    subject: `+/_TRADES/peer/repo/${misplacedId}.md`
  })
})

test('the retired _PREPARATIONS directory is refused', () => {
  const { home, local } = fixture()
  mkdirSync(join(local, '-', '_TRADES', '_PREPARATIONS'), { recursive: true })

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD, 'RECORD-2')).toContainEqual({
    status: 'VIOLATION',
    message:
      'the reserved -/_TRADES/_PREPARATIONS/ directory is retired; a preparation shares the submitted record peer path and declares phase: preparing',
    subject: '-/_TRADES/_PREPARATIONS/'
  })
})

test('phase carries the copy state without disturbing the immutable sender projection', () => {
  const { home, local, peer } = fixture()
  const id = 'TRD-000000b3'
  writeRecord(peer, '-', 'local/repo', id, record(id, 'peer/repo', 'local/repo'))
  writeRecord(local, '+', 'peer/repo', id, record(id, 'peer/repo', 'local/repo', ['decision_status: unconsidered']))

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, AUTH)).toEqual([
    {
      status: 'PASS',
      message: 'Trade records preserve sender and receiver write boundaries.'
    }
  ])
})

test('a blank line after frontmatter does not weaken exact H1 identity validation', () => {
  const { home, local } = fixture()
  const validId = 'TRD-00000003'
  writeRecord(local, '-', 'peer/repo', validId, record(validId, 'local/repo', 'peer/repo'))

  const valid = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(valid, RECORD)).toEqual([
    {
      status: 'PASS',
      message: 'Trade record identity and payload shape are valid.'
    }
  ])

  const invalidId = 'TRD-00000004'
  writeRecord(
    local,
    '-',
    'peer/repo',
    invalidId,
    record(invalidId, 'local/repo', 'peer/repo').replace(
      `# ${invalidId}: Submission title`,
      `# ${invalidId}: Altered title`
    )
  )

  const invalid = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(invalid, RECORD)).toContainEqual({
    status: 'VIOLATION',
    message: 'H1 must exactly repeat the trade id and title',
    subject: `-/_TRADES/peer/repo/${invalidId}.md`
  })
})

test('legacy or extended record identities are rejected', () => {
  const { home, local } = fixture()
  const id = 'HND-00000005'
  writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo'))

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD)).toContainEqual({
    status: 'VIOLATION',
    message: 'id must use canonical TRD plus eight lower-case hexadecimal characters',
    subject: `-/_TRADES/peer/repo/${id}.md`
  })

  const uuidId = 'TRD-00000000-0000-4000-8000-000000000005'
  writeRecord(local, '-', 'peer/repo', uuidId, record(uuidId, 'local/repo', 'peer/repo'))
  const uuidSession = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(uuidSession, RECORD)).toContainEqual({
    status: 'VIOLATION',
    message: 'id must use canonical TRD plus eight lower-case hexadecimal characters',
    subject: `-/_TRADES/peer/repo/${uuidId}.md`
  })
})

test('every submitted trade declares an observation policy', () => {
  const { home, local } = fixture()
  const id = 'TRD-00000006'
  writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo').replace('observation: decision\n', ''))

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD)).toContainEqual({
    status: 'VIOLATION',
    message: 'observation must be a non-empty sender field',
    subject: `-/_TRADES/peer/repo/${id}.md`
  })
})

test('each trade kind accepts only its supported observation policies', () => {
  const { home, local } = fixture()
  const invalid = [
    ['knowledge', 'decision'],
    ['knowledge', 'completion']
  ] as const

  for (const [index, [kind, observation]] of invalid.entries()) {
    const id = `TRD-${String(index + 50).padStart(8, '0')}`
    writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo', [], undefined, kind, observation))
  }

  const messages = mechanicalOutcomes(createTradesSession(options(local, home, {})), RECORD).map(
    (outcome) => outcome.message
  )
  expect(messages).toContain('knowledge trades require observation unattended or receipt')
})

test('itemized subtype classifies knowledge only and never upgrades work', () => {
  const { home, local } = fixture()
  const knowledgeId = 'TRD-000000c1'
  const workId = 'TRD-000000c2'
  writeRecord(
    local,
    '-',
    'peer/repo',
    knowledgeId,
    record(knowledgeId, 'local/repo', 'peer/repo', [], undefined, 'knowledge', 'receipt').replace(
      'source_ref: KI-SOURCE-FND-001',
      'source_ref: KI-SOURCE-FND-001\nsubtype: shared-maintenance'
    )
  )
  writeRecord(
    local,
    '-',
    'peer/repo',
    workId,
    record(workId, 'local/repo', 'peer/repo').replace(
      'source_ref: KI-SOURCE-FND-001',
      'source_ref: KI-SOURCE-FND-001\nsubtype: shared-maintenance'
    )
  )

  const session = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(session, RECORD)).toContainEqual({
    status: 'VIOLATION',
    message: 'subtype is optional classification for itemized knowledge trades only',
    subject: `-/_TRADES/peer/repo/${workId}.md`
  })
  expect(
    mechanicalOutcomes(session, RECORD).some((outcome) => outcome.subject === `-/_TRADES/peer/repo/${knowledgeId}.md`)
  ).toBeFalse()
})

test('each trade kind accepts every supported observation policy', () => {
  const { home, local } = fixture()
  const valid = [
    ['knowledge', 'unattended'],
    ['knowledge', 'receipt'],
    ['work', 'unattended'],
    ['work', 'receipt'],
    ['work', 'decision'],
    ['work', 'completion']
  ] as const

  for (const [index, [kind, observation]] of valid.entries()) {
    const id = `TRD-${String(index + 60).padStart(8, '0')}`
    writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo', [], undefined, kind, observation))
  }

  expect(mechanicalOutcomes(createTradesSession(options(local, home, {})), RECORD)).toEqual([
    {
      status: 'PASS',
      message: 'Trade record identity and payload shape are valid.'
    }
  ])
})

test('sender and receiver write boundaries reject receiver fields outbound and changed inbound payload', () => {
  const { home, local, peer } = fixture()
  const outboundId = 'TRD-00000001'
  writeRecord(
    local,
    '-',
    'peer/repo',
    outboundId,
    record(outboundId, 'local/repo', 'peer/repo', ['decision_status: unconsidered'])
  )

  const inboundId = 'TRD-00000002'
  writeRecord(peer, '-', 'local/repo', inboundId, record(inboundId, 'peer/repo', 'local/repo'))
  writeRecord(
    local,
    '+',
    'peer/repo',
    inboundId,
    record(
      inboundId,
      'peer/repo',
      'local/repo',
      ['decision_status: unconsidered'],
      'The receiver changed the sender payload.'
    )
  )

  const session = createTradesSession(options(local, home, {}))
  const messages = mechanicalOutcomes(session, AUTH).map((outcome) => outcome.message)
  expect(messages).toContain('sender-owned outbound record must not set receiver-local field decision_status')
  expect(messages).toContain('sender projection differs in meaning between outbound and inbound copies')
})

test('sender projection comparison accepts formatting drift with the same parsed values', () => {
  const { home, local, peer } = fixture()
  const id = 'TRD-00000006'
  const outbound = record(id, 'peer/repo', 'local/repo')
  writeRecord(peer, '-', 'local/repo', id, outbound)
  writeRecord(
    local,
    '+',
    'peer/repo',
    id,
    outbound
      .replace("title: 'Submission title'", 'title: "Submission title"')
      .replace('observation: decision', 'observation: decision\ndecision_status: unconsidered')
  )

  // A formatter may requote a scalar without changing what the record says, so this must
  // not read as tampering; only a change to the words may.
  const session = createTradesSession(options(local, home, {}))
  const messages = mechanicalOutcomes(session, AUTH).map((outcome) => outcome.message)
  expect(messages).not.toContain('sender projection differs in meaning between outbound and inbound copies')
})

test('all receiver decision statuses are accepted with their required rationale and linkage', () => {
  const { home, local, peer } = fixture()
  const statuses = [
    ['unconsidered', []],
    ['in_progress', []],
    ['applied', [`applied_commit: ${'a'.repeat(40)}`]],
    ['adopted', ['adopted_as: KI-LOCAL-FND-001']],
    ['retained', ['retained_as: Knowledge/Local/Note']],
    ['parked', ["rationale: 'Wait for dependency.'"]],
    ['clarify', ["rationale: 'Confirm the expected boundary.'"]],
    ['declined', ["rationale: 'The proposal does not fit local scope.'"]],
    ['superseded', ["rationale: 'A newer submission replaces this one.'", 'superseded_by: TRD-00000099']]
  ] as const
  for (const [index, [status, fields]] of statuses.entries()) {
    const id = `TRD-${String(index + 10).padStart(8, '0')}`
    const kind = status === 'retained' ? 'knowledge' : 'work'
    writeRecord(peer, '-', 'local/repo', id, record(id, 'peer/repo', 'local/repo', [], undefined, kind))
    writeRecord(
      local,
      '+',
      'peer/repo',
      id,
      record(id, 'peer/repo', 'local/repo', [`decision_status: ${status}`, ...fields], undefined, kind)
    )
  }

  const valid = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(valid, STATUS)).toEqual([
    {
      status: 'PASS',
      message: 'Receiver decision statuses and local linkage are valid.'
    }
  ])

  const invalidId = 'TRD-00000090'
  writeRecord(peer, '-', 'local/repo', invalidId, record(invalidId, 'peer/repo', 'local/repo'))
  writeRecord(
    local,
    '+',
    'peer/repo',
    invalidId,
    record(invalidId, 'peer/repo', 'local/repo', ['decision_status: accepted'])
  )
  const invalid = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(invalid, STATUS).map((outcome) => outcome.message)).toContain(
    'decision_status must be one of unconsidered, in_progress, parked, clarify, applied, adopted, retained, declined, superseded'
  )

  const wrongKindId = 'TRD-00000091'
  writeRecord(peer, '-', 'local/repo', wrongKindId, record(wrongKindId, 'peer/repo', 'local/repo'))
  writeRecord(
    local,
    '+',
    'peer/repo',
    wrongKindId,
    record(wrongKindId, 'peer/repo', 'local/repo', ['decision_status: retained', 'retained_as: Knowledge/Local/Note'])
  )
  const wrongKind = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(wrongKind, STATUS).map((outcome) => outcome.message)).toContain(
    'retained is valid only for knowledge trades'
  )
})

test('only terminal receiver dispositions permit sender release and receiver pruning observation', () => {
  const { home, local } = fixture()
  const parkedId = 'TRD-00000020'
  writeRecord(
    local,
    '+',
    'peer/repo',
    parkedId,
    record(parkedId, 'peer/repo', 'local/repo', ['decision_status: parked', "rationale: 'Wait.'"])
  )
  const adoptedId = 'TRD-00000021'
  writeRecord(
    local,
    '+',
    'peer/repo',
    adoptedId,
    record(adoptedId, 'peer/repo', 'local/repo', ['decision_status: adopted', 'adopted_as: KI-LOCAL-FND-001'])
  )
  const retainedId = 'TRD-00000022'
  writeRecord(
    local,
    '+',
    'peer/repo',
    retainedId,
    record(
      retainedId,
      'peer/repo',
      'local/repo',
      ['decision_status: retained', 'retained_as: Knowledge/Local/Note'],
      undefined,
      'knowledge'
    )
  )

  const session = createTradesSession(options(local, home, {}))
  const outcomes = mechanicalOutcomes(session, RELEASE)
  expect(outcomes).toContainEqual({
    status: 'VIOLATION',
    message: 'sender released its outbound copy before satisfying the decision observation policy',
    subject: `+/_TRADES/peer/repo/${parkedId}.md`
  })
  expect(outcomes).toContainEqual({
    status: 'INFO',
    message: 'eligible sender release is observable; receiver may prune this inbound copy',
    subject: `+/_TRADES/peer/repo/${adoptedId}.md`
  })
  expect(outcomes).toContainEqual({
    status: 'INFO',
    message: 'eligible sender release is observable; receiver may prune this inbound copy',
    subject: `+/_TRADES/peer/repo/${retainedId}.md`
  })
})

test('unattended requests no response but still waits for evidenced receipt', () => {
  const { home, local, peer } = fixture()
  const id = 'TRD-0000002f'
  writeRecord(local, '-', 'peer/repo', id, record(id, 'local/repo', 'peer/repo', [], undefined, 'work', 'unattended'))

  const beforeReceipt = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(beforeReceipt, RELEASE)).toEqual([
    {
      status: 'PASS',
      message: 'receiver has not created an inbound copy; sender retains the outbound record',
      subject: `-/_TRADES/peer/repo/${id}.md`
    }
  ])

  writeRecord(
    peer,
    '+',
    'local/repo',
    id,
    record(id, 'local/repo', 'peer/repo', ['decision_status: unconsidered'], undefined, 'work', 'unattended')
  )
  const afterReceipt = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(afterReceipt, RELEASE)).toContainEqual({
    status: 'INFO',
    message: 'unattended observation policy permits sender release',
    subject: `-/_TRADES/peer/repo/${id}.md`
  })
})

test('receipt and completion policies produce different release eligibility', () => {
  const { home, local, peer } = fixture()
  const receiptId = 'TRD-00000030'
  writeRecord(
    local,
    '-',
    'peer/repo',
    receiptId,
    record(receiptId, 'local/repo', 'peer/repo', [], undefined, 'knowledge', 'receipt')
  )
  writeRecord(
    peer,
    '+',
    'local/repo',
    receiptId,
    record(receiptId, 'local/repo', 'peer/repo', ['decision_status: unconsidered'], undefined, 'knowledge', 'receipt')
  )

  const unavailable = [
    ['TRD-00000031', ['decision_status: applied', `applied_commit: ${'a'.repeat(40)}`]],
    ['TRD-00000032', ['decision_status: adopted', 'adopted_as: KI-PEER-FND-001']]
  ] as const
  for (const [completionId, receiverFields] of unavailable) {
    writeRecord(
      local,
      '-',
      'peer/repo',
      completionId,
      record(completionId, 'local/repo', 'peer/repo', [], undefined, 'work', 'completion')
    )
    writeRecord(
      peer,
      '+',
      'local/repo',
      completionId,
      record(completionId, 'local/repo', 'peer/repo', receiverFields, undefined, 'work', 'completion')
    )
  }

  const waiting = createTradesSession(options(local, home, {}))
  expect(mechanicalOutcomes(waiting, RELEASE)).toContainEqual({
    status: 'INFO',
    message: 'receipt observation policy permits sender release',
    subject: `-/_TRADES/peer/repo/${receiptId}.md`
  })
  for (const [completionId] of unavailable)
    expect(mechanicalOutcomes(waiting, RELEASE)).toContainEqual({
      status: 'NOT_APPLICABLE',
      message: 'completion is unavailable: no selected-adapter owner-valid canonical completion evidence exists',
      subject: `-/_TRADES/peer/repo/${completionId}.md`
    })
})

test('receipt and applied commit references require full lower-case commit ids', () => {
  const { home, local, peer } = fixture()
  const id = 'TRD-00000040'
  writeRecord(peer, '-', 'local/repo', id, record(id, 'peer/repo', 'local/repo'))
  writeRecord(
    local,
    '+',
    'peer/repo',
    id,
    record(id, 'peer/repo', 'local/repo', [
      'decision_status: applied',
      'received_from_ref: short',
      'applied_commit: abc'
    ])
  )

  const session = createTradesSession(options(local, home, {}))
  const messages = mechanicalOutcomes(session, STATUS).map((outcome) => outcome.message)
  expect(messages).toContain('received_from_ref must be a full 40-character lower-case hexadecimal commit locator')
  expect(messages).toContain('applied requires a full lower-case hexadecimal applied_commit locator')
})

test('conform proposes only the local owned README scaffold and never writes a peer', () => {
  const { home, local, peer } = fixture()
  writeFileSync(join(local, '+', '_TRADES', 'README.md'), '# drift\n')
  const peerBefore = readFileSync(join(peer, '+', '_TRADES', 'README.md'), 'utf8')
  const session = createTradesSession(options(local, home, {}, 'conform'))
  const scaffoldItem = SCAFFOLD.items[0]
  if (!scaffoldItem?.mechanical) throw new Error('SCAFFOLD-1 is missing')
  scaffoldItem.mechanical.conform?.run(SCAFFOLD.selectContext(session.subjects[0]?.context() as never))

  expect(session.proposal().writes.map((write) => write.path)).toEqual(['+/_TRADES/README.md'])
  expect(readFileSync(join(peer, '+', '_TRADES', 'README.md'), 'utf8')).toBe(peerBefore)
})

test('a preparation title is capped at six words, while submitted and received copies are exempt', () => {
  const { home, local, peer } = fixture()
  const seven = 'One two three four five six seven'
  const retitle = (contents: string, id: string, title: string): string =>
    contents
      .replace("title: 'Submission title'", `title: '${title}'`)
      .replace(`# ${id}: Submission title`, `# ${id}: ${title}`)
  const preparation = retitle(
    record('TRD-00000010', 'local/repo', 'peer/repo', [], undefined, 'work', 'decision', true),
    'TRD-00000010',
    seven
  )
  writeRecord(local, '-', 'peer/repo', 'TRD-00000010', preparation)

  const messages = () =>
    mechanicalOutcomes(createTradesSession(options(local, home, {})), RECORD, 'RECORD-3').map(
      (outcome) => outcome.message
    )

  expect(messages()).toContain('title must be at most 6 words; this one has 7')

  // The same over-long title on a frozen copy must not be reported: retitling it would be
  // exactly the rewrite AUTH-1 exists to detect.
  writeRecord(local, '-', 'peer/repo', 'TRD-00000010', preparation.replace('phase: preparing', 'phase: submitted'))
  expect(messages()).not.toContain('title must be at most 6 words; this one has 7')

  const inbound = retitle(
    record('TRD-00000011', 'peer/repo', 'local/repo', ['decision_status: unconsidered']),
    'TRD-00000011',
    seven
  )
  writeRecord(
    peer,
    '-',
    'local/repo',
    'TRD-00000011',
    retitle(record('TRD-00000011', 'peer/repo', 'local/repo'), 'TRD-00000011', seven)
  )
  writeRecord(local, '+', 'peer/repo', 'TRD-00000011', inbound)
  expect(messages()).not.toContain('title must be at most 6 words; this one has 7')

  // Exactly six words is the boundary and passes.
  writeRecord(
    local,
    '-',
    'peer/repo',
    'TRD-00000010',
    retitle(preparation, 'TRD-00000010', 'One two three four five six').replace(
      `# TRD-00000010: ${seven}`,
      '# TRD-00000010: One two three four five six'
    )
  )
  expect(messages()).not.toContain('title must be at most 6 words; this one has 6')
})
