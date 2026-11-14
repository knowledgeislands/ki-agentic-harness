import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { closeOutEvidence, ideaStageEvidence, isIdeaStage } from './closeout.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const directory = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-kb-streams-closeout-'))
  roots.push(root)
  return root
}

const CAPITAL = 'https://github.com/example/capital'

const checkout = (root: string, repository: string, capital = CAPITAL, prefix?: string): void => {
  writeFileSync(
    join(root, '.ki.toml'),
    `[skills.ki-repo]\nrepository = "${repository}"\ncapital = "${capital}"\n${prefix ? `territory_prefix = "${prefix}"\n` : ''}`
  )
}

const project = (capital: string, slug: string, lifecycle: string, notes = ''): void => {
  writeFileSync(
    join(capital, 'Streams', 'Projects', `${slug}.md`),
    `---\nnote_type: streams/project\nslug: ${slug}\nlifecycle: ${lifecycle}\n---\n\n# ${slug}\n\n## Outcome\n\nDone.\n\n## Notes\n\n${notes}`
  )
}

const record = (root: string, area: string, name: string, project: string, status: string): void => {
  mkdirSync(join(root, area), { recursive: true })
  writeFileSync(join(root, area, name), `---\nid: ${name.slice(0, 11)}\nproject: ${project}\nstatus: ${status}\n---\n`)
}

const territory = () => {
  const capital = directory()
  const member = directory()
  const outsider = directory()
  const state = directory()
  mkdirSync(join(capital, 'Streams', 'Projects'), { recursive: true })
  checkout(capital, CAPITAL, CAPITAL, 'ex')
  checkout(member, 'https://github.com/example/member')
  checkout(outsider, 'https://github.com/other/outsider', 'https://github.com/other/capital')
  writeFileSync(
    join(state, 'registry.toml'),
    `[repositories.capital]\npath = "${capital}"\n[repositories.member]\npath = "${member}"\n[repositories.outsider]\npath = "${outsider}"\n`
  )
  return { capital, member, outsider, environment: { KI_STATE_HOME: state } }
}

const levels = (evidence: ReturnType<typeof closeOutEvidence>) =>
  Object.fromEntries(evidence.filter((item) => item.subject).map((item) => [item.subject, item.level]))

test('a Project with no open record anywhere is due for its close-out assessment', () => {
  const { capital, member, outsider, environment } = territory()
  project(capital, 'served-by-member', 'active')
  project(capital, 'served-from-outside', 'active')
  project(capital, 'served-by-registry-key', 'active')
  project(capital, 'finished', 'active')
  project(capital, 'assessed', 'paused', '### Close-out assessment\n\nDelivered.\n')
  project(capital, 'not-started', 'planned')
  project(capital, 'closed-unassessed', 'completed')
  project(capital, 'closed-assessed', 'cancelled', '### Close-out assessment\n\nNothing left.\n')
  record(member, join('docs', 'roadmap'), 'EX-MEM-001-a.md', 'served-by-member', 'draft')
  record(outsider, join('Streams', 'Roadmap'), 'EX-OUT-001-a.md', 'ex/served-from-outside', 'triage')
  record(outsider, join('docs', 'roadmap'), 'EX-OUT-002-a.md', 'finished', 'draft')
  record(outsider, join('docs', 'roadmap'), 'EX-OUT-003-a.md', 'capital/served-by-registry-key', 'ready')
  record(capital, join('Streams', 'Roadmap'), 'EX-CAP-001-a.md', 'finished', 'done')
  const evidence = closeOutEvidence(capital, join(capital, 'Streams'), environment)
  expect(levels(evidence)).toEqual({
    [join('Streams', 'Projects', 'finished.md')]: 'WARN',
    [join('Streams', 'Projects', 'assessed.md')]: 'INFO',
    [join('Streams', 'Projects', 'closed-unassessed.md')]: 'WARN'
  })
})

test('without the local registry a finished-looking Project is only noted', () => {
  const { capital } = territory()
  project(capital, 'finished', 'active')
  const evidence = closeOutEvidence(capital, join(capital, 'Streams'), { KI_STATE_HOME: directory() })
  expect(evidence.map((item) => item.level)).toEqual(['INFO', 'INFO'])
})

test('a base that is not a Capital is not assessed', () => {
  const { member } = territory()
  mkdirSync(join(member, 'Streams', 'Projects'), { recursive: true })
  expect(closeOutEvidence(member, join(member, 'Streams'), {})[0]?.level).toBe('NOT_APPLICABLE')
})

const idea = (
  capital: string,
  slug: string,
  initiative: string,
  outcome = 'Kris decides whether to adopt it.'
): void => {
  writeFileSync(
    join(capital, 'Streams', 'Projects', `${slug}.md`),
    `---\nnote_type: streams/project\nslug: ${slug}\noutcome: ${outcome}\ninitiative: ${initiative}\nlifecycle: planned\nlead: Kris Brown\n---\n\n# ${slug}\n\n## Outcome\n\nA decision.\n\n## Notes\n`
  )
}

test('an idea-stage Project is planned with a decision its lead takes as its outcome', () => {
  const planned = { lifecycle: 'planned', lead: 'Kris Brown' }
  expect(isIdeaStage({ ...planned, outcome: 'Kris decides how hosts are named.' })).toBe(true)
  expect(isIdeaStage({ ...planned, outcome: 'Kris Brown decides how hosts are named.' })).toBe(true)
  expect(isIdeaStage({ ...planned, outcome: 'The territory records work under the model.' })).toBe(false)
  expect(isIdeaStage({ ...planned, outcome: 'Kristen decides it.' })).toBe(false)
  expect(isIdeaStage({ ...planned, lifecycle: 'paused', outcome: 'Kris decides it.' })).toBe(false)
})

test('an idea-stage Project named by an open record, or past a cap, is warned', () => {
  const { capital, member, environment } = territory()
  const projects = join('Streams', 'Projects')
  idea(capital, 'host-network', 'rig')
  idea(capital, 'second-rig', 'rig')
  idea(capital, 'observability', 'platform')
  idea(capital, 'delta', 'techne')
  project(capital, 'not-started', 'planned')
  record(member, join('docs', 'roadmap'), 'EX-MEM-001-a.md', 'delta', 'draft')
  const evidence = ideaStageEvidence(capital, join(capital, 'Streams'), environment)
  expect(evidence.map((item) => [item.level, item.subject])).toEqual([
    ['WARN', join(projects, 'delta.md')],
    ['WARN', projects],
    ['WARN', projects]
  ])
  expect(evidence[1]?.message).toContain("Theme 'rig' has 2 idea-stage Projects (host-network, second-rig)")
  expect(evidence[2]?.message).toBe('The territory has 4 idea-stage Projects; the cap is 3.')
})

test('idea-stage Projects within the caps and without records pass', () => {
  const { capital, environment } = territory()
  idea(capital, 'host-network', 'rig')
  project(capital, 'not-started', 'planned')
  expect(ideaStageEvidence(capital, join(capital, 'Streams'), environment).map((item) => item.level)).toEqual(['PASS'])
  rmSync(join(capital, 'Streams', 'Projects', 'host-network.md'))
  expect(ideaStageEvidence(capital, join(capital, 'Streams'), environment)[0]?.level).toBe('NOT_APPLICABLE')
})
