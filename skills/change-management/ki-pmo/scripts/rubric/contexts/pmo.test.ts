import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  bindingOutcomes,
  createPmoSession,
  isCapital,
  recordIdentifiers,
  reportConfidenceFindings,
  reportIssuedDay,
  reportLinkFindings,
  reportQueryTags,
  repositoryIdentity
} from './pmo.ts'

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

  test('a state-of-play checkpoint labelled `<Space> > SoP` passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP' })
    expect(statuses(context(root).master.outcomes)).toEqual(['PASS'])
  })

  test('a state-of-play checkpoint with another label is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI state of play' })
    expect(statuses(context(root).master.outcomes)).toEqual(['VIOLATION'])
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

  test('a `<Space> > <Initiative> > <project in words>` label passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI > Model > ways of working' })
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

describe('coordinating thread roles', () => {
  test('coordinating checkpoints that declare their role pass', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP', role: 'state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', {
      label: 'KI > Model > ways of working',
      role: 'coordination'
    })
    checkpoint(root, 'knowledge-islands-model.mics', { label: 'KI > mics', role: 'conversational' })
    checkpoint(root, 'mics-webcams', { label: 'KI > mics / webcams' })
    expect(statuses(context(root).roles.outcomes)).toEqual(['PASS'])
  })

  test('a coordinating checkpoint without a role is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI > Model > ways of working' })
    const outcomes = context(root).roles.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
    expect(outcomes[1]?.message).toContain('role: coordination')
  })

  test('only the state-of-play checkpoint declares state-of-play', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP', role: 'coordination' })
    checkpoint(root, 'mics-webcams', { label: 'KI > mics / webcams', role: 'state-of-play' })
    expect(statuses(context(root).roles.outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
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

describe('recommendation confidence', () => {
  const footer = (issued: string): string => `\n\`\`\`text\n╭─ run report · ${issued} ─────────────╮\n\`\`\`\n`
  const options = (...lines: string[]): string =>
    `# Report\n\n## Queries\n\n### TAG - title\n\n**Options:**\n\n${lines.join('\n')}\n\n\`\`\`text\nTAG\n\na) (recommended) do it\n\`\`\`\n`

  test('the latest footer border dates a report, and a report with no footer has no date', () => {
    expect(reportIssuedDay(`${footer('2026-10-17T22:00:00Z')}${footer('2026-10-18T01:00:00Z')}`)).toBe('2026-10-18')
    expect(reportIssuedDay('# Report\n')).toBeUndefined()
  })

  test('only a recommended option without the confidence form is flagged, never in a fenced block', () => {
    const text = options(
      'a) (recommended, confidence high - already on main) push it',
      'a) (recommended) push it',
      '**Options:** a) (recommended, confidence) push it',
      'b) leave it'
    )
    expect(reportConfidenceFindings(text)).toEqual([
      'a) (recommended) push it',
      '**Options:** a) (recommended, confidence) push it'
    ])
    expect(reportConfidenceFindings('# Report\n\n## Done\n\na) (recommended) outside Queries\n')).toEqual([])
  })

  test('a report issued on or after 18 October with a bare recommendation is a violation naming it', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    report(root, 'ways-of-working', 'bare', options('a) (recommended) push it') + footer('2026-10-18T09:00:00Z'))
    const outcomes = context(root).confidence.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_THREADS', 'ways-of-working', 'bare.report.md'))
    expect(outcomes[0]?.message).toContain('a) (recommended) push it')
  })

  test('an earlier or undated report is not checked, and a confident one passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    report(root, 'ways-of-working', 'old', options('a) (recommended) push it') + footer('2026-10-17T23:59:59Z'))
    report(root, 'ways-of-working', 'undated', options('a) (recommended) push it'))
    report(
      root,
      'ways-of-working',
      'new',
      options('a) (recommended, confidence low - not verified) push it') + footer('2026-10-18T09:00:00Z')
    )
    expect(statuses(context(root).confidence.outcomes)).toEqual(['PASS'])
  })

  test('no thread folder is not applicable', () => {
    expect(statuses(context(fixture(null)).confidence.outcomes)).toEqual(['NOT_APPLICABLE'])
  })
})

describe('thread folder tidy', () => {
  const queries = (...tags: string[]): string =>
    `# Run\n\n## Done\n\nWork.\n\n## Queries\n\n${tags.map((tag) => `### ${tag} - a question\n\n**Query:** Which?\n\n`).join('')}\`\`\`text\n### FENCED - not a query\n\`\`\`\n`
  const log = (root: string, body: string): void => {
    mkdirSync(join(root, '+', '_THREADS', 'ways-of-working'), { recursive: true })
    writeFileSync(join(root, '+', '_THREADS', 'ways-of-working', 'decisions.md'), body)
  }

  test('query tags are read from the Queries headings, linked or not, and never from a fenced block', () => {
    expect(reportQueryTags(queries('PMO-CI', '[THREADS-TRIM](/x.md)'))).toEqual(['PMO-CI', 'THREADS-TRIM'])
    expect(reportQueryTags('# Run\n\n## Queries\n\nNo outstanding queries\n')).toEqual([])
  })

  test('a folder of the closed list whose reports carry open queries passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    log(root, '- ROUTINE - "Take option a) for PMO-CI"\n')
    report(root, 'ways-of-working', 'open', queries('PMO-CI', 'THREADS-TRIM'))
    expect(statuses(context(root).tidy.outcomes)).toEqual(['PASS'])
  })

  test('a report whose every query the log names, or with none, is listed for the tidy', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    log(root, '- ROUTINE - "Take option a) for PMO-CI and THREADS-TRIM"\n')
    report(root, 'ways-of-working', 'answered', queries('PMO-CI', 'THREADS-TRIM'))
    report(root, 'ways-of-working', 'quiet', '# Run\n\n## Queries\n\nNo outstanding queries\n')
    report(root, 'ways-of-working', 'partial', queries('PMO-CI', 'PMO-CIX'))
    const outcomes = context(root).tidy.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_THREADS', 'ways-of-working'))
    expect(outcomes[0]?.message).toEndWith(': answered.report.md, quiet.report.md')
  })

  test('a file or folder outside the closed list is a violation naming it', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    log(root, '')
    report(root, 'ways-of-working', 'open', queries('PMO-CI'))
    writeFileSync(join(root, '+', '_THREADS', 'ways-of-working', 'brief.md'), 'brief\n')
    mkdirSync(join(root, '+', '_THREADS', 'ways-of-working', 'shots'))
    const outcomes = context(root).tidy.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toEndWith('outside the closed list: brief.md, shots/')
  })

  test('no thread folder is not applicable', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    expect(statuses(context(root).tidy.outcomes)).toEqual(['NOT_APPLICABLE'])
  })
})

describe('coordinator binding', () => {
  const claude = (root: string, file: string, content: string): void => {
    mkdirSync(join(root, '.claude', 'output-styles'), { recursive: true })
    writeFileSync(join(root, '.claude', file), content)
  }
  const hooked = (command: string) => ({ hooks: [{ type: 'command', command }] })
  const userSettings = (events: readonly string[]): string =>
    JSON.stringify({
      hooks: Object.fromEntries(events.map((event) => [event, [hooked('$HOME/ki/hooks/coordinator-reminder.sh')]]))
    })

  test('a repository that does not select the output style is a violation', () => {
    const root = fixture(null)
    expect(statuses(context(root).binding.outcomes)).toEqual(['VIOLATION', 'INFO'])
  })

  test('the repository style is checked and the user half is not checked without user settings', () => {
    const root = fixture(null)
    claude(root, 'settings.json', JSON.stringify({ outputStyle: 'ki-coordinator' }))
    const home = fixture(null)
    expect(statuses(bindingOutcomes(root, home))).toEqual(['PASS', 'INFO'])
  })

  test('user settings that bind both events and a deployed style pass', () => {
    const root = fixture(null)
    claude(root, 'settings.json', JSON.stringify({ outputStyle: 'ki-coordinator' }))
    const home = fixture(null)
    claude(home, 'settings.json', userSettings(['UserPromptSubmit', 'SessionStart']))
    claude(home, join('output-styles', 'ki-coordinator.md'), '---\nname: ki-coordinator\n---\n')
    expect(statuses(bindingOutcomes(root, home))).toEqual(['PASS', 'PASS'])
  })

  test('a missing hook event and an undeployed style are each a violation', () => {
    const root = fixture(null)
    claude(root, 'settings.json', JSON.stringify({ outputStyle: 'ki-coordinator' }))
    const home = fixture(null)
    claude(home, 'settings.json', userSettings(['UserPromptSubmit']))
    const outcomes = bindingOutcomes(root, home)
    expect(statuses(outcomes)).toEqual(['PASS', 'VIOLATION', 'VIOLATION'])
    expect(outcomes[1]?.message).toContain('`SessionStart`')
    expect(outcomes[1]?.message).not.toContain('`UserPromptSubmit`')
  })

  test('unreadable user settings are a violation, never printed', () => {
    const root = fixture(null)
    const home = fixture(null)
    claude(home, 'settings.json', '{ not json')
    claude(home, join('output-styles', 'ki-coordinator.md'), '')
    const outcomes = bindingOutcomes(root, home)
    expect(statuses(outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
    expect(outcomes.map((outcome) => outcome.message).join(' ')).not.toContain('not json')
  })
})
