import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { COV } from '../items/coverage.ts'
import { TERR } from '../items/territory.ts'
import { createRepoSession } from './repository.ts'
import { declareCapital, territoryEvidence } from './territory.ts'

const CAPITAL = 'https://github.com/example/capital'
const MEMBER = 'https://github.com/example/member'
const OTHER = 'https://github.com/example/other'

const roots: string[] = []
let stateHome = ''
const previous = process.env.KI_STATE_HOME

beforeEach(() => {
  stateHome = mkdtempSync(join(tmpdir(), 'ki-repo-territory-state-'))
  roots.push(stateHome)
  process.env.KI_STATE_HOME = stateHome
})

afterEach(() => {
  if (previous === undefined) delete process.env.KI_STATE_HOME
  else process.env.KI_STATE_HOME = previous
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const checkout = (config: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-territory-'))
  roots.push(root)
  writeFileSync(join(root, '.ki.toml'), config)
  return root
}

const register = (...paths: string[]): void => {
  mkdirSync(stateHome, { recursive: true })
  writeFileSync(
    join(stateHome, 'registry.toml'),
    paths.map((path, index) => `[repositories."r${index}"]\npath = ${JSON.stringify(path)}\n`).join('\n')
  )
}

const repo = (repository: string, extra = ''): string =>
  `[skills.ki-repo]\nrepository = "${repository}"\ntitle = "Example"\n${extra}`

const capitalConfig = (members: readonly string[], trades = ''): string =>
  `${repo(CAPITAL, `capital = "${CAPITAL}"\n`)}\n[skills.ki-repo.territory]\nname = "Example"\nmembers = ${JSON.stringify(members)}\n${trades}`

const channel = (from: string, to: string): string =>
  `\n[skills.ki-trades]\n\n[[skills.ki-trades.territory.channels]]\nid = "c"\npurpose = "p"\nfrom = ["${from}"]\nto = ["${to}"]\nkinds = ["work"]\n`

const statuses = (outcomes: readonly { status: string; level?: string }[]) =>
  outcomes.map(({ status, level }) => (level ? `${status}:${level}` : status))

describe('TERR-1 capital declaration', () => {
  test('a missing capital fails and is inferred from the unique registered Capital listing this repository', () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER])))
    const evidence = territoryEvidence(repo(MEMBER), '/nonexistent')
    expect(statuses(evidence.terr1)).toEqual(['VIOLATION'])
    expect(evidence.inferredCapital).toBe(CAPITAL)
  })

  test('a repository declaring a territory infers itself', () => {
    const evidence = territoryEvidence(
      `${repo(CAPITAL)}\n[skills.ki-repo.territory]\nname = "x"\nmembers = ["${CAPITAL}"]\n`,
      '/nonexistent'
    )
    expect(evidence.inferredCapital).toBe(CAPITAL)
  })

  test('no inference without a unique Capital, with diagnostic guidance', () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER])), checkout(capitalConfig([CAPITAL, MEMBER])))
    const evidence = territoryEvidence(repo(MEMBER), '/nonexistent')
    expect(evidence.inferredCapital).toBeUndefined()
    expect(evidence.terr1[0]?.message).toContain('several registered Capitals')
    expect(territoryEvidence(repo(OTHER), '/nonexistent').terr1[0]?.message).toContain('no registered Capital lists')
  })

  test('a non-canonical capital fails without inference', () => {
    const evidence = territoryEvidence(repo(MEMBER, 'capital = "example/capital"\n'), '/nonexistent')
    expect(statuses(evidence.terr1)).toEqual(['VIOLATION'])
    expect(evidence.terr1[0]?.message).toContain('full canonical HTTPS GitHub URL')
    expect(evidence.inferredCapital).toBeUndefined()
  })

  test('conform inserts capital after title, else after repository, and fills an empty placeholder', () => {
    expect(declareCapital(`${repo(MEMBER)}description = "d"\n`, CAPITAL)).toBe(
      `[skills.ki-repo]\nrepository = "${MEMBER}"\ntitle = "Example"\ncapital = "${CAPITAL}"\ndescription = "d"\n`
    )
    expect(declareCapital(`[skills.ki-repo]\nrepository = "${MEMBER}"\nlicense = "MIT"\n`, CAPITAL)).toBe(
      `[skills.ki-repo]\nrepository = "${MEMBER}"\ncapital = "${CAPITAL}"\nlicense = "MIT"\n`
    )
    expect(
      declareCapital(`[skills.ki-repo]\ntitle = "t"\ncapital = ""            # required\n[skills.x]\n`, CAPITAL)
    ).toBe(`[skills.ki-repo]\ntitle = "t"\ncapital = "${CAPITAL}"\n[skills.x]\n`)
    expect(declareCapital('[skills.other]\ntitle = "t"\n', CAPITAL)).toBeUndefined()
  })

  test('the session proposes the inferred capital through TERR-1 conform', async () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER])))
    const root = checkout(repo(MEMBER))
    const options: RubricContextOptions = { mode: 'conform', repository: root, userHome: root, configuration: {} }
    const session = await createRepoSession(options, (target) => ({ target, findings: [] }))
    const subject = session.subjects.find(({ families }) => families.includes('TERR'))
    if (!subject) throw new Error('ki-repo session did not expose TERR')
    const context = TERR.selectContext(subject.context())
    for (const item of TERR.items) item.mechanical?.conform?.run(context)
    const write = session.proposal().writes.find(({ path }) => path === '.ki.toml')
    expect(write?.content).toBe(`${repo(MEMBER)}capital = "${CAPITAL}"\n`)
  })
})

describe('TERR-2 territory table shape', () => {
  test('a Capital must declare a well-formed territory', () => {
    expect(statuses(territoryEvidence(repo(CAPITAL, `capital = "${CAPITAL}"\n`), '/x').terr2)).toEqual(['VIOLATION'])
    expect(statuses(territoryEvidence(capitalConfig([CAPITAL, MEMBER]), '/x').terr2)).toEqual(['PASS'])
    const messages = territoryEvidence(
      `${repo(CAPITAL, `capital = "${CAPITAL}"\n`)}\n[skills.ki-repo.territory]\nname = ""\nmembers = ["${OTHER}", "${MEMBER}", "${MEMBER}"]\nextra = 1\n`,
      '/x'
    ).terr2.map(({ message }) => message)
    expect(messages.some((message) => message.includes('key extra is not allowed'))).toBe(true)
    expect(messages.some((message) => message.includes('name must be a non-empty string'))).toBe(true)
    expect(messages.some((message) => message.includes('listed more than once'))).toBe(true)
    expect(messages.some((message) => message.includes('sorted in ascending order'))).toBe(true)
    expect(messages.some((message) => message.includes("include the Capital's own repository"))).toBe(true)
  })

  test('a non-Capital may not declare a territory', () => {
    const evidence = territoryEvidence(
      `${repo(MEMBER, `capital = "${CAPITAL}"\n`)}\n[skills.ki-repo.territory]\nname = "x"\nmembers = ["${MEMBER}"]\n`,
      '/x'
    )
    expect(statuses(evidence.terr2)).toEqual(['VIOLATION'])
    expect(statuses(territoryEvidence(repo(MEMBER, `capital = "${CAPITAL}"\n`), '/x').terr2)).toEqual([
      'NOT_APPLICABLE'
    ])
  })
})

describe('TERR-3 agreement', () => {
  const member = repo(MEMBER, `capital = "${CAPITAL}"\n`)

  test('an unregistered Capital warns with the exact unavailable message', () => {
    const [outcome] = territoryEvidence(member, '/x').terr3
    expect(outcome).toEqual({
      status: 'VIOLATION',
      level: 'WARN',
      message: `territory policy lives in ${CAPITAL}, not available here`,
      subject: '.ki.toml [skills.ki-repo].capital'
    })
  })

  test('member-side failures and pass', () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER])), checkout(capitalConfig([CAPITAL, MEMBER])))
    expect(territoryEvidence(member, '/x').terr3[0]?.message).toContain('is ambiguous')
    register(checkout(repo(CAPITAL, `capital = "${OTHER}"\n`)))
    expect(territoryEvidence(member, '/x').terr3[0]?.message).toContain('is not a Capital')
    register(checkout(capitalConfig([CAPITAL])))
    expect(territoryEvidence(member, '/x').terr3[0]?.message).toContain('does not list')
    register(checkout(capitalConfig([CAPITAL, MEMBER])))
    expect(statuses(territoryEvidence(member, '/x').terr3)).toEqual(['PASS'])
  })

  test('capital-side checks registered members and reports unregistered ones', () => {
    register(checkout(repo(MEMBER, `capital = "${OTHER}"\n`)))
    const config = capitalConfig([CAPITAL, MEMBER, OTHER])
    const failing = territoryEvidence(config, '/x').terr3
    expect(statuses(failing)).toEqual(['VIOLATION', 'INFO'])
    expect(failing[1]?.message).toBe(`${OTHER} not checked out here`)
    register(checkout(repo(MEMBER)))
    expect(territoryEvidence(config, '/x').terr3[0]?.message).toContain('declares no capital')
    register(checkout(member))
    expect(statuses(territoryEvidence(config, '/x').terr3)).toEqual(['PASS', 'INFO'])
  })
})

describe('COV-1 trades signal', () => {
  const member = repo(MEMBER, `capital = "${CAPITAL}"\n`)

  test('a member named in a channel without ki-trades fails coverage', () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER, OTHER], channel(MEMBER, OTHER))))
    expect(territoryEvidence(member, '/x').coverage.map(({ level, code }) => `${code}:${level}`)).toEqual([
      'COV-1:FAIL'
    ])
    expect(territoryEvidence(`${member}\n[skills.ki-trades]\n`, '/x').coverage).toEqual([])
  })

  test('unnamed members and unavailable policies are skipped', () => {
    expect(territoryEvidence(member, '/x').coverage).toEqual([])
    register(checkout(capitalConfig([CAPITAL, MEMBER, OTHER], channel(OTHER, CAPITAL))))
    expect(territoryEvidence(member, '/x').coverage).toEqual([])
  })

  test('the session folds the signal into COV-1', async () => {
    register(checkout(capitalConfig([CAPITAL, MEMBER, OTHER], channel(OTHER, MEMBER))))
    const root = checkout(member)
    const session = await createRepoSession(
      { mode: 'audit', repository: root, userHome: root, configuration: {} },
      (target) => ({ target, findings: [] })
    )
    const subject = session.subjects.find(({ families }) => families.includes('COV'))
    if (!subject) throw new Error('ki-repo session did not expose COV')
    const outcomes = COV.items[0]?.mechanical?.audit.run(COV.selectContext(subject.context())) ?? []
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
  })
})
