import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createPmoSession, isCapital, recordIdentifiers, reportLinkFindings, repositoryIdentity } from './pmo.ts'

const roots: string[] = []

const fixture = (identity: { repository: string; capital: string } | null): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-pmo-'))
  roots.push(root)
  if (identity)
    writeFileSync(
      join(root, '.ki.toml'),
      `[skills.ki-repo]\nrepository = "${identity.repository}"\ncapital = "${identity.capital}"\n`
    )
  return root
}

const checkpoint = (root: string, name: string, fields: Record<string, string>): void => {
  mkdirSync(join(root, '+', '_CHECKPOINTS'), { recursive: true })
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: '${value}'`)
    .join('\n')
  writeFileSync(join(root, '+', '_CHECKPOINTS', `${name}.md`), `---\n${frontmatter}\n---\n\n# ${name}\n`)
}

const report = (root: string, run: string, name: string, body: string): void => {
  mkdirSync(join(root, '+', '_THREADS', run), { recursive: true })
  writeFileSync(join(root, '+', '_THREADS', run, `${name}.report.md`), body)
}

const register = (root: string, kind: 'Projects' | 'Initiatives', slug: string): void => {
  mkdirSync(join(root, 'Streams', kind, slug), { recursive: true })
  writeFileSync(join(root, 'Streams', kind, slug, `${slug}.md`), `# ${slug}\n`)
}

const context = (root: string) => {
  const session = createPmoSession({ mode: 'audit', repository: root, userHome: root, configuration: {} })
  return session.subjects[0]!.context()
}

const statuses = (outcomes: readonly { status: string }[]) => outcomes.map((outcome) => outcome.status)

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('repository identity', () => {
  test('a repository whose capital is itself is a Capital', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    expect(isCapital(repositoryIdentity(root))).toBe(true)
  })

  test('a repository naming another capital is not', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    expect(isCapital(repositoryIdentity(root))).toBe(false)
  })

  test('a missing configuration yields no identity', () => {
    expect(isCapital(repositoryIdentity(fixture(null)))).toBe(false)
  })
})

describe('state-of-play checkpoint', () => {
  test('a Capital without _state-of-play.md is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    expect(statuses(context(root).master.outcomes)).toEqual(['VIOLATION'])
  })

  test('a Capital with a labelled state-of-play checkpoint passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    expect(statuses(context(root).master.outcomes)).toEqual(['PASS'])
  })

  test('a state-of-play checkpoint outside a Capital is a violation', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    const [outcome] = context(root).master.outcomes
    expect(outcome?.status).toBe('VIOLATION')
    expect(outcome?.subject).toBe(join('+', '_CHECKPOINTS', '_state-of-play.md'))
  })

  test('no checkpoints outside a Capital is not applicable', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    const ctx = context(root)
    expect(statuses(ctx.master.outcomes)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(ctx.labels.outcomes)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(ctx.cap.outcomes)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(ctx.links.outcomes)).toEqual(['NOT_APPLICABLE'])
  })
})

describe('coordination thread checkpoints', () => {
  test('a label ending in the Project name that resolves in the registry passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
  })

  test('a label not ending in the Project name is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'Ways of working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    const outcomes = context(root).labels.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain('ends in its Project name')
  })

  test('an unregistered Project or Initiative is a violation on a Capital', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    mkdirSync(join(root, 'Streams', 'Projects'), { recursive: true })
    mkdirSync(join(root, 'Streams', 'Initiatives'), { recursive: true })
    expect(statuses(context(root).labels.outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
  })

  test('the registry is not consulted outside a Capital', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
  })
})

describe('active thread cap', () => {
  test('four active coordination threads are within the cap', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })

  test('five active coordination threads exceed the cap', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four', 'five'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    const outcomes = context(root).cap.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain('5 coordination threads')
  })

  test('a closed thread does not count', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    checkpoint(root, 'initiative.five', { label: 'Initiative: five', state: 'closed' })
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })
})

describe('record identifiers in prose', () => {
  test('full identifiers are found once each and Needs tags and short forms are not', () => {
    const text =
      'Accepted KI-HARNESS-GOV-187 and KI-TOOL-KI-CLI-127; KI-HARNESS-GOV-187 again. Kris said "ACCEPT-181" and "GOV-187-REVIEW / accept"; GOV-187 is a short form and KI-HARNESS-HK-012 a run.'
    expect(recordIdentifiers(text)).toEqual(['KI-HARNESS-GOV-187', 'KI-TOOL-KI-CLI-127', 'KI-HARNESS-HK-012'])
  })

  test('an identifier inside a link is linked and one outside is bare', () => {
    const findings = reportLinkFindings(
      '- Accepted [KI-HARNESS-GOV-187](/nowhere/KI-HARNESS-GOV-187.md) and KI-HARNESS-GOV-188; see [`KI-PRINCIPAL-ECO-013`](https://example.invalid/ECO-013).\n'
    )
    expect(findings.bare).toEqual(['KI-HARNESS-GOV-188'])
    expect(findings.missing).toEqual(['KI-HARNESS-GOV-187 -> /nowhere/KI-HARNESS-GOV-187.md'])
  })

  test('a fenced reply block is not prose', () => {
    const findings = reportLinkFindings('Prose.\n\n```text\nACCEPT-188\n\naccept KI-HARNESS-GOV-188\n```\n')
    expect(findings).toEqual({ bare: [], missing: [] })
  })
})

describe('thread report links', () => {
  test('a report whose identifiers are all linked to existing files passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    mkdirSync(join(root, 'docs', 'roadmap'), { recursive: true })
    const record = join(root, 'docs', 'roadmap', 'KI-HARNESS-GOV-187-thread-model-and-banner.md')
    writeFileSync(record, '# record\n')
    report(root, 'ways-of-working', 'links', `# Report\n\n- Accepted [KI-HARNESS-GOV-187](${record}) as done.\n`)
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['PASS'])
    expect(outcomes[0]?.message).toContain('1 thread report')
  })

  test('a bare identifier in a report is a violation naming it', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    report(
      root,
      'ways-of-working',
      'bare',
      '# Report\n\n- Accepted KI-HARNESS-GOV-187 as done; Kris said "ACCEPT-187".\n'
    )
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_THREADS', 'ways-of-working', 'bare.report.md'))
    expect(outcomes[0]?.message).toContain('unlinked: KI-HARNESS-GOV-187')
    expect(outcomes[0]?.message).not.toContain('ACCEPT-187')
  })

  test('a pruned record linked as `<FULL-ID> (pruned)` to its last GitHub revision passes, linked to its deleted file does not', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    report(
      root,
      'ways-of-working',
      'pruned',
      '# Report\n\n- Pruned [KI-HARNESS-GOV-181 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/50dc6a56/docs/roadmap/KI-HARNESS-GOV-181-link-rule.md) and [KI-HARNESS-GOV-185 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/50dc6a56/docs/roadmap/KI-HARNESS-GOV-185-ki-pmo-extraction.md).\n'
    )
    expect(statuses(context(root).links.outcomes)).toEqual(['PASS'])
    report(
      root,
      'ways-of-working',
      'deleted',
      `# Report\n\n- Pruned [KI-HARNESS-GOV-181](${join(root, 'docs', 'roadmap', 'KI-HARNESS-GOV-181-gone.md')}).\n`
    )
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_THREADS', 'ways-of-working', 'deleted.report.md'))
    expect(outcomes[0]?.message).toContain('missing: KI-HARNESS-GOV-181 ->')
  })

  test('a thread folder with no reports, and files that are not reports, pass', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    mkdirSync(join(root, '+', '_THREADS', 'ways-of-working'), { recursive: true })
    writeFileSync(join(root, '+', '_THREADS', 'ways-of-working', 'decisions.md'), '- accept KI-HARNESS-GOV-187\n')
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['PASS'])
    expect(outcomes[0]?.message).toContain('No thread report')
  })
})
