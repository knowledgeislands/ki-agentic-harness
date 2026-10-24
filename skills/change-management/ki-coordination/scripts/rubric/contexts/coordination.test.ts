import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  awaitingAcceptanceCounts,
  bindingOutcomes,
  createCoordinationSession,
  isCapital,
  recordIdentifiers,
  reportConfidenceFindings,
  reportHasGlyphForm,
  reportIssuedDay,
  reportLinkFindings,
  reportOpensWithHeading,
  repositoryIdentity,
  workLevel
} from './coordination.ts'

const roots: string[] = []
/** An audited checkout root that does not exist, so a link inside it is checked for existence and fails. */
const CHECKOUT = '/checkout'

const fixture = (identity: { repository: string; capital: string } | null): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-coordination-'))
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

const work = (root: string, id: string, fields: Record<string, string>): string => {
  const folder = join(root, '+', '_WORK', id)
  mkdirSync(folder, { recursive: true })
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: '${value}'`)
    .join('\n')
  writeFileSync(join(folder, 'work.md'), `---\n${frontmatter}\n---\n\n# ${id}\n`)
  return folder
}

/** A flat registry page, `Streams/<kind>/<slug>.md`, the work-model shape. */
const page = (root: string, kind: 'Projects' | 'Themes', slug: string): void => {
  mkdirSync(join(root, 'Streams', kind), { recursive: true })
  writeFileSync(join(root, 'Streams', kind, `${slug}.md`), `# ${slug}\n`)
}

const register = (root: string, kind: 'Projects' | 'Initiatives', slug: string): void => {
  mkdirSync(join(root, 'Streams', kind, slug), { recursive: true })
  writeFileSync(join(root, 'Streams', kind, slug, `${slug}.md`), `# ${slug}\n`)
}

const context = (root: string) => {
  const session = createCoordinationSession({ mode: 'audit', repository: root, userHome: root, configuration: {} })
  return session.subjects[0]!.context()
}

/** Each outcome's status, a tolerance-window warning reading `WARN`. */
const statuses = (outcomes: readonly { status: string; level?: string }[]) =>
  outcomes.map((outcome) => (outcome.level === 'WARN' ? 'WARN' : outcome.status))

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

  test('a Capital with a labelled state-of-play checkpoint passes with the tolerance warning', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    expect(statuses(context(root).master.outcomes)).toEqual(['WARN'])
  })

  test('a state-of-play checkpoint labelled `<Space> > SoP` passes with the tolerance warning', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP' })
    expect(statuses(context(root).master.outcomes)).toEqual(['WARN'])
  })

  test('a state-of-play checkpoint with another label is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI state of play' })
    expect(statuses(context(root).master.outcomes)).toEqual(['VIOLATION', 'WARN'])
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
    expect(statuses(context(root).labels.outcomes)).toEqual(['WARN'])
  })

  test('a `<Space> > <Initiative> > <project in words>` label passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'KI > SoP' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI > Model > ways of working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    expect(statuses(context(root).labels.outcomes)).toEqual(['WARN'])
  })

  test('a label not ending in the Project name is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'Ways of working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    const outcomes = context(root).labels.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION', 'WARN'])
    expect(outcomes[0]?.message).toContain('ends in its Project name')
  })

  test('an unregistered Project or Initiative is a violation on a Capital', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    mkdirSync(join(root, 'Streams', 'Projects'), { recursive: true })
    mkdirSync(join(root, 'Streams', 'Initiatives'), { recursive: true })
    expect(statuses(context(root).labels.outcomes)).toEqual(['VIOLATION', 'VIOLATION', 'WARN'])
  })

  test('the registry is not consulted outside a Capital', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    expect(statuses(context(root).labels.outcomes)).toEqual(['WARN'])
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
    expect(outcomes[0]?.message).toContain('5 pieces of Project work')
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
      '- Accepted [KI-HARNESS-GOV-187](/checkout/KI-HARNESS-GOV-187.md) and KI-HARNESS-GOV-188; see [`KI-PRINCIPAL-ECO-013`](https://example.invalid/ECO-013).\n',
      CHECKOUT
    )
    expect(findings.bare).toEqual(['KI-HARNESS-GOV-188'])
    expect(findings.missing).toEqual(['KI-HARNESS-GOV-187 -> /checkout/KI-HARNESS-GOV-187.md'])
  })

  test('a fenced reply block is not prose', () => {
    const findings = reportLinkFindings('Prose.\n\n```text\nACCEPT-188\n\naccept KI-HARNESS-GOV-188\n```\n', CHECKOUT)
    expect(findings).toEqual({ bare: [], missing: [], misshapen: [] })
  })

  test('an inline code span is not prose, but an identifier beside one is', () => {
    const findings = reportLinkFindings(
      'Committed `docs(roadmap): close KI-HARNESS-GOV-206` and ``a `quoted` KI-HARNESS-GOV-207``, spanning `a\nKI-HARNESS-GOV-208`; KI-HARNESS-GOV-209 is bare.\n',
      CHECKOUT
    )
    expect(findings).toEqual({ bare: ['KI-HARNESS-GOV-209'], missing: [], misshapen: [] })
  })

  test('an unclosed backtick or a span across a blank line does not hide an identifier', () => {
    expect(reportLinkFindings('A stray ` before KI-HARNESS-GOV-210.\n', CHECKOUT).bare).toEqual(['KI-HARNESS-GOV-210'])
    expect(reportLinkFindings('Opens `here\n\nKI-HARNESS-GOV-211 then` closes.\n', CHECKOUT).bare).toEqual([
      'KI-HARNESS-GOV-211'
    ])
  })

  test('a link whose text is a code span still has its target checked', () => {
    const findings = reportLinkFindings('See [`KI-HARNESS-GOV-212`](/checkout/KI-HARNESS-GOV-212.md).\n', CHECKOUT)
    expect(findings).toEqual({
      bare: [],
      missing: ['KI-HARNESS-GOV-212 -> /checkout/KI-HARNESS-GOV-212.md'],
      misshapen: []
    })
  })

  test('a link outside the checkout whose folder is absent is checked for shape only', () => {
    const findings = reportLinkFindings(
      '- [KI-TOOL-KI-CLI-123](/Users/nobody/workspaces/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-123-channel.md#goal) and [ADR-KI-HARNESS-010](/Users/nobody/workspaces/ki-agentic-harness/docs/decisions/ADR-KI-HARNESS-010.md) pass;\n- [KI-TOOL-KI-CLI-124](/Users/nobody/workspaces/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-125-other.md), [KI-TOOL-KI-CLI-126](/Users/nobody/workspaces/tools-ki/docs/roadmap/) and [KI-TOOL-KI-CLI-127](/Users/nobody/workspaces/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-1270-x.md) do not.\n',
      CHECKOUT
    )
    expect(findings).toEqual({
      bare: [],
      missing: [],
      misshapen: [
        'KI-TOOL-KI-CLI-124 -> /Users/nobody/workspaces/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-125-other.md',
        'KI-TOOL-KI-CLI-126 -> /Users/nobody/workspaces/tools-ki/docs/roadmap/',
        'KI-TOOL-KI-CLI-127 -> /Users/nobody/workspaces/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-1270-x.md'
      ]
    })
  })

  test('a link outside the checkout whose folder is present on this machine is checked for existence', () => {
    const checkout = fixture(null)
    const other = fixture(null)
    writeFileSync(join(other, 'KI-TOOL-KI-CLI-123-channel.md'), '# record\n')
    const live = join(other, 'KI-TOOL-KI-CLI-123-channel.md')
    const gone = join(other, 'KI-TOOL-KI-CLI-124-gone.md')
    const findings = reportLinkFindings(
      `- [KI-TOOL-KI-CLI-123](${live}) and [KI-TOOL-KI-CLI-124](${gone}).\n`,
      checkout
    )
    expect(findings).toEqual({ bare: [], missing: [`KI-TOOL-KI-CLI-124 -> ${gone}`], misshapen: [] })
  })

  test('a link inside the checkout is checked for existence even when its folder is absent', () => {
    const target = '/checkout/docs/roadmap/KI-HARNESS-GOV-213-gone.md'
    const findings = reportLinkFindings(`- [KI-HARNESS-GOV-213](${target}).\n`, CHECKOUT)
    expect(findings).toEqual({ bare: [], missing: [`KI-HARNESS-GOV-213 -> ${target}`], misshapen: [] })
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
    expect(outcomes[0]?.message).toContain('1 work report')
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
      '# Report\n\n- Pruned [KI-HARNESS-GOV-181 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/50dc6a56/docs/roadmap/KI-HARNESS-GOV-181-link-rule.md) and [KI-HARNESS-GOV-185 (pruned)](https://github.com/knowledgeislands/ki-agentic-harness/blob/50dc6a56/docs/roadmap/KI-HARNESS-GOV-185-ki-coordination-extraction.md).\n'
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

  test('a link to another checkout absent from this machine passes by shape and a misshapen one is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    const elsewhere = '/Users/nobody/workspaces/ki-agentic-harness/docs/roadmap'
    report(
      root,
      'ways-of-working',
      'runner',
      `# Report\n\n- Planned [KI-HARNESS-GOV-197](${elsewhere}/KI-HARNESS-GOV-197-pmo-7-outside-checkout-links.md).\n`
    )
    expect(statuses(context(root).links.outcomes)).toEqual(['PASS'])
    report(root, 'ways-of-working', 'misshapen', `# Report\n\n- Planned [KI-HARNESS-GOV-197](${elsewhere}/notes.md).\n`)
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_THREADS', 'ways-of-working', 'misshapen.report.md'))
    expect(outcomes[0]?.message).toContain(`misshapen: KI-HARNESS-GOV-197 -> ${elsewhere}/notes.md`)
  })

  test('a thread folder with no reports, and files that are not reports, pass', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    mkdirSync(join(root, '+', '_THREADS', 'ways-of-working'), { recursive: true })
    writeFileSync(join(root, '+', '_THREADS', 'ways-of-working', 'decisions.md'), '- accept KI-HARNESS-GOV-187\n')
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['PASS'])
    expect(outcomes[0]?.message).toContain('No work report')
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

describe('report heading', () => {
  test('a report opens with its heading, after front matter if it has any', () => {
    expect(
      reportOpensWithHeading('# [Model](/m.md) › run\n\n**🤖 → 👤 Handoff to supervisor · Run report at 08:00 BST**\n')
    ).toBe(true)
    expect(reportOpensWithHeading('\n\n# Report\n')).toBe(true)
    expect(reportOpensWithHeading('---\nid: KI-HARNESS-GOV-175\nstatus: draft\n---\n\n# Report\n')).toBe(true)
  })

  test('a frame, a lint directive, a form line or unclosed front matter first does not', () => {
    expect(reportOpensWithHeading('---\n\n**Run report at 00:50 BST**\n\n---\n\n## Done\n')).toBe(false)
    expect(reportOpensWithHeading('<!-- rumdl-disable-file MD041 -->\n# Report\n')).toBe(false)
    expect(reportOpensWithHeading('**Run report at 00:50 BST**\n\n# Report\n')).toBe(false)
    expect(reportOpensWithHeading('## Done\n')).toBe(false)
    expect(reportOpensWithHeading('---\nid: KI-HARNESS-GOV-175\n\n# Report\n')).toBe(false)
    expect(reportOpensWithHeading('')).toBe(false)
  })

  test('a work report that does not open with its heading is a violation naming it', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    const folder = work(root, 'ki.ways-of-working', { id: 'ki.ways-of-working' })
    writeFileSync(join(folder, 'framed.report.md'), '---\n\n**Run report at 00:50 BST**\n\n---\n\n## Done\n')
    writeFileSync(join(folder, 'headed.report.md'), '# Report\n\n## Done\n')
    const outcomes = context(root).headings.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(join('+', '_WORK', 'ki.ways-of-working', 'framed.report.md'))
  })

  test('headed reports pass, and no work or thread folder is not applicable', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    report(root, 'ways-of-working', 'headed', '# Report\n\n## Done\n')
    expect(statuses(context(root).headings.outcomes)).toEqual(['PASS'])
    expect(statuses(context(fixture(null)).headings.outcomes)).toEqual(['NOT_APPLICABLE'])
  })
})

describe('work files', () => {
  const capital = { repository: 'ki-principal', capital: 'ki-principal' }
  const project = (state = 'with-worker') => ({
    id: 'ki.ways-of-working',
    level: 'project',
    project: 'ways-of-working',
    theme: 'model',
    title: 'KI > Model > Ways of working',
    state
  })

  test('levels follow the id: one segment territory, `regular` regular, any other Project', () => {
    expect(workLevel('ki')).toBe('territory')
    expect(workLevel('ki.regular')).toBe('regular')
    expect(workLevel('ki.regular.tidy')).toBe('regular')
    expect(workLevel('ki.ways-of-working')).toBe('project')
    expect(workLevel('ki.sop.sites')).toBe('territory')
  })

  test('a Capital holding titled territory work passes with no warning', () => {
    const root = fixture(capital)
    work(root, 'ki', { id: 'ki', level: 'territory', title: 'KI > SoP' })
    expect(statuses(context(root).master.outcomes)).toEqual(['PASS'])
  })

  test('territory work with another title, or outside a Capital, is a violation', () => {
    const titled = fixture(capital)
    work(titled, 'ki', { id: 'ki', level: 'territory', title: 'KI state of play' })
    expect(statuses(context(titled).master.outcomes)).toEqual(['VIOLATION'])
    const outside = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    work(outside, 'ki', { id: 'ki', level: 'territory', title: 'KI > SoP' })
    expect(statuses(context(outside).master.outcomes)).toEqual(['VIOLATION'])
  })

  test('a secondary State of play titled `<Territory> > SoP (<name>)` passes beside the main', () => {
    const root = fixture(capital)
    work(root, 'ki', { id: 'ki', level: 'territory', title: 'KI > SoP' })
    work(root, 'ki.sop.sites', { id: 'ki.sop.sites', level: 'territory', title: 'KI > SoP (sites)', parent: 'ki' })
    expect(statuses(context(root).master.outcomes)).toEqual(['PASS'])
  })

  test('a secondary State of play with another title, or outside a Capital, is a violation', () => {
    const titled = fixture(capital)
    work(titled, 'ki', { id: 'ki', level: 'territory', title: 'KI > SoP' })
    work(titled, 'ki.sop.sites', { id: 'ki.sop.sites', level: 'territory', title: 'KI > SoP (web)', parent: 'ki' })
    expect(statuses(context(titled).master.outcomes)).toEqual(['VIOLATION'])
    const outside = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    work(outside, 'ki.sop.sites', { id: 'ki.sop.sites', level: 'territory', title: 'KI > SoP (sites)', parent: 'ki' })
    expect(statuses(context(outside).master.outcomes)).toEqual(['VIOLATION'])
  })

  test('Project work naming a registered Project and theme in flat pages passes', () => {
    const root = fixture(capital)
    work(root, 'ki', { id: 'ki', level: 'territory', title: 'KI > SoP' })
    work(root, 'ki.ways-of-working', project())
    page(root, 'Projects', 'ways-of-working')
    page(root, 'Themes', 'model')
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
    expect(statuses(context(root).roles.outcomes)).toEqual(['PASS'])
  })

  test('kb.personal-health uses its Project title Stocktake, falling back to the slug only without a title', () => {
    const root = fixture({ repository: 'personal', capital: 'personal' })
    const fields = {
      id: 'kb.personal-health',
      level: 'project',
      project: 'personal-health',
      theme: 'health',
      title: 'Personal > Health > Stocktake'
    }
    work(root, fields.id, fields)
    page(root, 'Themes', fields.theme)
    page(root, 'Projects', fields.project)
    const note = join(root, 'Streams', 'Projects', `${fields.project}.md`)
    writeFileSync(note, '---\ntitle: Stocktake\n---\n\n# Stocktake\n')
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])

    work(root, fields.id, { ...fields, title: 'Personal > Health > Personal health' })
    const outcomes = context(root).labels.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain(' > Stocktake')

    writeFileSync(note, '# Stocktake\n')
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
  })

  test('a theme found only in the legacy Initiatives registry warns', () => {
    const root = fixture(capital)
    work(root, 'ki.ways-of-working', project())
    page(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'model')
    const outcomes = context(root).labels.outcomes
    expect(statuses(outcomes)).toEqual(['WARN'])
    expect(outcomes[0]?.message).toContain('Streams/Themes/model.md')
  })

  test('a mismatched project, title, unregistered Project and unknown theme are each a violation', () => {
    const root = fixture(capital)
    work(root, 'ki.ways-of-working', { ...project(), project: 'other', title: 'KI > Model > Other', theme: 'nowhere' })
    page(root, 'Themes', 'model')
    page(root, 'Projects', 'other')
    expect(statuses(context(root).labels.outcomes)).toEqual(['VIOLATION', 'VIOLATION', 'VIOLATION', 'VIOLATION'])
  })

  test('a level or id that disagrees with the folder is a violation', () => {
    const root = fixture(capital)
    work(root, 'ki.ways-of-working', { ...project(), id: 'ki.other', level: 'regular' })
    work(root, 'Bad_Id', { level: 'project' })
    expect(statuses(context(root).roles.outcomes)).toEqual(['VIOLATION', 'VIOLATION', 'VIOLATION'])
  })

  test('active Project work counts toward the cap and on-hold or finished work does not', () => {
    const root = fixture(capital)
    for (const slug of ['a', 'b', 'c', 'd', 'e']) work(root, `ki.${slug}`, { level: 'project', state: 'with-worker' })
    expect(context(root).cap.outcomes[0]?.message).toContain('5 pieces of Project work')
    work(root, 'ki.e', { level: 'project', state: 'on-hold' })
    work(root, 'ki.f', { level: 'project', state: 'finished' })
    work(root, 'ki.regular', { level: 'regular', state: 'with-worker' })
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })

  test('a work package is read for its state from `state.md`, over the work file', () => {
    const root = fixture(capital)
    for (const slug of ['a', 'b', 'c', 'd']) work(root, `ki.${slug}`, { level: 'project', state: 'with-worker' })
    const folder = work(root, 'ki.e', { id: 'ki.e', level: 'project' })
    writeFileSync(join(folder, 'state.md'), "---\nid: 'ki.e'\nstate: 'with-worker'\n---\n\n# ki.e state\n")
    expect(context(root).cap.outcomes[0]?.message).toContain('5 pieces of Project work')
    writeFileSync(join(folder, 'state.md'), "---\nid: 'ki.e'\nstate: 'on-hold'\n---\n\n# ki.e state\n")
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })

  test('work awaiting review is counted, not checked, and warns while the area holds anything', () => {
    const root = fixture(capital)
    mkdirSync(join(root, '+', '_WORK_REVIEW'), { recursive: true })
    expect(context(root).cap.outcomes.some((outcome) => outcome.level === 'WARN')).toBe(false)
    mkdirSync(join(root, '+', '_WORK_REVIEW', 'ki.old-thread'), { recursive: true })
    const warning = context(root).cap.outcomes.find((outcome) => outcome.level === 'WARN')
    expect(warning?.status).toBe('VIOLATION')
    expect(warning?.message).toContain('1 work folder(s) await review')
    expect(warning?.message).toContain('REVIEW-HOLD')
  })

  test('a report in a work folder has its links checked', () => {
    const root = fixture(capital)
    const folder = work(root, 'ki.ways-of-working', project())
    writeFileSync(join(folder, 'run.report.md'), '# Run\n\nDelivered KI-HARNESS-GOV-210.\n')
    const outcomes = context(root).links.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain('KI-HARNESS-GOV-210')
  })

  test('a report with a glyph form line has its confidence checked whatever its date', () => {
    expect(
      reportHasGlyphForm('**🤖 → 👤 Handoff to supervisor · Run report at 23:10 BST · last mark 22:34 BST**')
    ).toBe(true)
    expect(reportHasGlyphForm('**Summary at 19:13 BST · last mark 14:54 BST**')).toBe(false)
    const root = fixture(capital)
    const folder = work(root, 'ki.ways-of-working', project())
    writeFileSync(
      join(folder, 'run.report.md'),
      '# Run\n\n**🤖 → 👤 Handoff to supervisor · Run report at 23:10 BST · last mark 22:34 BST**\n\n## Queries\n\n### TAG - a question\n\n**Options:**\n\na) (recommended) Do it.\n'
    )
    expect(statuses(context(root).confidence.outcomes)).toEqual(['VIOLATION'])
  })

  test('more than eight records awaiting acceptance for a Project, across the territory, is a warning', () => {
    const parent = mkdtempSync(join(tmpdir(), 'ki-coordination-queue-'))
    roots.push(parent)
    const checkout = (name: string, owner: string): string => {
      const root = join(parent, name)
      mkdirSync(root)
      writeFileSync(join(root, '.ki.toml'), `[skills.ki-repo]\nrepository = "${name}"\ncapital = "${owner}"\n`)
      return root
    }
    const record = (root: string, roadmap: string, name: string, status: string, project = 'ways-of-working'): void => {
      mkdirSync(join(root, roadmap), { recursive: true })
      writeFileSync(
        join(root, roadmap, `${name}.md`),
        `---\nstatus: ${status}\nproject: ${project}\n---\n\n# ${name}\n`
      )
    }
    const root = checkout('ki-principal', 'ki-principal')
    const sibling = checkout('ki-agentic-harness', 'ki-principal')
    const stranger = checkout('er-principal', 'er-principal')
    const folder = work(root, 'ki.ways-of-working', project())
    for (const name of ['decisions.md', 'state.md', 'messages.md', 'queries.md'])
      writeFileSync(join(folder, name), '# x\n')
    for (let at = 0; at < 4; at++)
      record(root, join('Streams', 'Roadmap'), `KI-PRINCIPAL-MODEL-${at}`, 'awaiting-review')
    for (let at = 0; at < 4; at++) record(sibling, join('docs', 'roadmap'), `KI-HARNESS-GOV-${at}`, 'awaiting-review')
    record(sibling, join('docs', 'roadmap'), 'KI-HARNESS-GOV-DRAFT', 'draft')
    record(sibling, join('docs', 'roadmap'), 'KI-HARNESS-GOV-OTHER', 'awaiting-review', 'observatory')
    record(stranger, join('Streams', 'Roadmap'), 'ER-PRINCIPAL-OPS-1', 'awaiting-review')
    expect(awaitingAcceptanceCounts([root, sibling]).get('ways-of-working')).toBe(8)
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
    record(sibling, join('docs', 'roadmap'), 'KI-HARNESS-GOV-9', 'awaiting-review')
    expect(statuses(context(root).cap.outcomes)).toEqual(['VIOLATION'])
    expect(context(root).cap.outcomes[0]?.message).toStartWith('9 roadmap records await acceptance')
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
