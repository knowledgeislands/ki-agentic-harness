import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generate } from './generate/index.ts'

// The report heading and the footer banner are normative text: every
// coordinating thread renders both byte-identical in shape, so the standard,
// the output style and ki-recap's DONE frame must agree. The report heading is
// the rich-text heading Kris asked for on 2026-10-14, "a better heading that is
// the actual just normal text, so it can be rich text rather than fixed width
// text", agreed with "Actually, that is really good." and amended with "a
// single HR alignment after the summary and last mark part"; it replaced the
// framed label of the same day. The three rules that stood before it went on
// 2026-10-17, "we can just go single horizontal rule", so no saved report
// opens with `---`. The footer is the block-letter REST or BUSY frame he restored with "The
// footer banner needs to be like it was before, with the large ascii text",
// its word rows held here exactly as harness revision e60b4e45 carried them,
// padded with one blank framed line inside each border and carrying the
// report's form word on its top border since Kris asked "What about with some
// spaces around it, so that it's got a bit more impact?" and approved with
// "Okay, I'm really happy with that. Yeah, let's go with it." This test is the
// mechanical check the PMO rubric cannot run against a repository, because the
// transcripts the frames appear in are not tracked. The HOLD frame, its list,
// closing line and resume line are the restart-model design note's of
// 2026-10-15, which Kris's HOLD-BANNER set: "the drain report becomes **hold
// report**", the frame replacing DRAINED, held here exactly as drawn.

const skillRoot = resolve(import.meta.dir, '..')
const harnessRoot = resolve(skillRoot, '..', '..', '..')
const standard = readFileSync(resolve(skillRoot, 'references', 'standards-pmo.md'), 'utf8')
const outputStyle = readFileSync(resolve(harnessRoot, 'output-styles', 'ki-coordinator.md'), 'utf8')
const recapStandard = readFileSync(
  resolve(harnessRoot, 'skills', 'change-management', 'ki-recap', 'references', 'standards-session-recap.md'),
  'utf8'
)
const hook = readFileSync(resolve(harnessRoot, 'hooks', 'coordinator-reminder.sh'), 'utf8')

const FRAME_COLUMNS = 52
const UTC = String.raw`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z`
const INITIATIVE_NOTE =
  '/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Initiatives/knowledge-islands-model/knowledge-islands-model.md'
const PROJECT_NOTE =
  '/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working/ways-of-working.md'
/** The report heading opening a Summary, as the standard and the output style draw it. */
const HEADING_EXAMPLE = [
  `# [Knowledge Islands model](${INITIATIVE_NOTE}) › [Ways of working](${PROJECT_NOTE})`,
  '',
  '**Summary at 19:13 BST · last mark 14:54 BST**',
  '',
  '---',
  '',
  '## Done'
].join('\n')
/** The `#` heading: a linked Initiative, ` › `, a linked Project, and for a run report ` › <run name>`. */
const HEADING_LINE = /^# \[[^\]]+\]\(\/[^)]+\) › \[[^\]]+\]\(\/[^)]+\)( › [a-z0-9-]+)?$/
/** The state-of-play thread's heading: a linked territory or Initiative, then ` › State of play`. */
const STATE_OF_PLAY_LINE = /^# \[[^\]]+\]\([^)]+\) › State of play$/
/** The form line: the form, the local issued time and the last mark, bold; a hold report names the hold's mark. */
const FORM_LINE =
  /^\*\*((Summary|Recap|Full summary|Re-bootstrap|Run report) at \d{2}:\d{2} [A-Z]{3,4} · last mark|Hold report at \d{2}:\d{2} [A-Z]{3,4} · mark) \d{2}:\d{2} [A-Z]{3,4}\*\*$/
/** The footer banner's top border, shared with DONE: `╭─ <form> · <UTC> ─` filled with `─`. */
const FORM_TOP_BORDER = new RegExp(`^╭─ (summary|recap|full summary|re-bootstrap|hold report|run report) · ${UTC} ─+╮$`)
/** The blank framed line directly inside the top and bottom borders. */
const PADDING_LINE = `│${' '.repeat(50)}│`
/** The run of `─` after `╭─ <form> · <UTC> ` that brings the top border to 52 code points. */
const fill = (form: string): number => FRAME_COLUMNS - Array.from(`╭─ ${form} · 2026-10-14T18:24:06Z ╮`).length
/** The footer banner's fixed bottom border. */
const FOOTER_BOTTOM_BORDER = '╰──────────────────────────────────────────────────╯'
/** The REST footer's three rows, as harness revision e60b4e45 carried them. */
const REST_ROWS = [
  '│  █▀▀▄ █▀▀▀ █▀▀▀ ▀▀█▀   · thread at rest          │',
  '│  █▀▀▄ █▀▀  ▀▀▀█   █    · nothing running         │',
  '│  █  █ █▄▄▄ ▄▄▄█   █    · nothing queued          │'
]
/** The BUSY footer's three rows, as harness revision e60b4e45 carried them. */
const BUSY_ROWS = [
  '│  █▀▀▄ █  █ █▀▀▀ █  █   · thread busy             │',
  '│  █▀▀▄ █  █ ▀▀▀█  ▀█▀   · running or queued work  │',
  '│  █▄▄▀ █▄▄█ ▄▄▄█   █    · lines below say which   │'
]
/** The HOLD footer's three rows, as rule 5 of the restart-model design note draws them. */
const HOLD_ROWS = [
  '│  █  █ ▄▀▀▄ █    █▀▀▄   · threads drained         │',
  '│  █▀▀█ █  █ █    █  █   · queries parked          │',
  '│  █  █ ▀▄▄▀ █▄▄▄ █▄▄▀   · fully archived          │'
]
/** The HOLD list, as the design note draws it. */
const HOLD_LIST = [
  '',
  '- [hold] nothing running or queued; committed and pushed',
  '- [parked] <count> queries in the checkpoint',
  '- [left over] <what>, only if any'
]
/** An item in the list beneath: `- [<state>] <what>`. */
const ITEM =
  /^- \[(at rest|running|queued|waiting|committed|uncommitted|unpushed|blocked|held|parked|recovered|unlogged)\] .+$/
/** A running or queued item names one agent, without a comma, then ` - ` and what it does. */
const AGENT_ITEM = /^- \[(running|queued)\] [^,]+ - .+$/
/** A waiting item carries the Needs tag alone. */
const WAITING_ITEM = /^- \[waiting\] [A-Z][A-Z0-9-]*$/
const REST_ITEM = '- [at rest] nothing running or queued'
/** A coordination thread's hold resume line, naming no host. */
const HOLD_RESUME_LINE =
  'Resume <label> from its checkpoint under current ki-pmo and ki-delegation since <mark>: re-bootstrap, read the pick-up block, take stock, put the parked queries back, restart authorised work, then banner.'
const HOLD_CLOSING_LINE = 'To bring this thread back and continue the work, paste this:'
const RESUME_LINE =
  'Resume <label> under current ki-pmo and ki-delegation since <mark>: re-bootstrap, mark, fresh summary with carried-forward open points, take stock, restart authorised work, then banner.'

/** The index of the bottom border closing the frame that opens at `start`. */
const bottomOf = (lines: string[], start: number): number =>
  lines.findIndex((line, cursor) => cursor > start && line.startsWith('╰'))

/** Every fenced frame in a document: the framed lines from `╭` to `╰` inclusive. */
const frames = (text: string): string[][] => {
  const lines = text.split('\n')
  const found: string[][] = []
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index]?.startsWith('╭')) continue
    const end = bottomOf(lines, index)
    expect(end).toBeGreaterThan(index)
    found.push(lines.slice(index, end + 1))
  }
  return found
}

/** The block-letter rows of a frame: the framed lines that are neither borders nor padding. */
const rows = (frame: string[]): string[] => frame.slice(1, -1).filter((line) => line !== PADDING_LINE)

const word = (frame: string[]): string =>
  rows(frame)
    .map((line) => line.slice(1, 24))
    .join('\n')
const codePoints = (line: string): number => Array.from(line).length

/** The lines beneath a frame, up to the closing fence. */
const beneath = (text: string, frameIndex: number): string[] => {
  const lines = text.split('\n')
  let seen = -1
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index]?.startsWith('╭')) continue
    seen += 1
    if (seen !== frameIndex) continue
    const found: string[] = []
    for (
      let cursor = bottomOf(lines, index) + 1;
      cursor < lines.length && !lines[cursor]?.startsWith('```');
      cursor += 1
    )
      found.push(lines[cursor] ?? '')
    return found
  }
  return []
}

/** The standard less its Generated surfaces sources, whose text is checked through what they render. */
const withoutSources = (text: string): string =>
  text.replace(/<!-- ki-pmo:source [\w-]+ -->\n\n(`{3,})[a-z]*\n[\s\S]*?\n\1\n/g, '')

/** Every fenced `markdown` block in a document whose first heading line is a `#` heading. */
const headings = (text: string): string[][] => {
  const found: string[][] = []
  for (const block of withoutSources(text).split('```markdown\n').slice(1)) {
    const lines =
      block
        .split('\n```')[0]
        ?.split('\n')
        .map((line) => line.replace(/^ {2}/, '')) ?? []
    if (lines.some((line) => line.startsWith('# '))) found.push(lines)
  }
  return found
}

/** A report heading: optional rules, the `#` heading, a blank line, the form line, a blank line, one rule, a blank line, then the first section. */
const expectReportHeading = (lines: string[] | undefined, rulesBefore: number): void => {
  expect(lines).toBeDefined()
  if (!lines) return
  const start = lines.findIndex((line) => line.startsWith('# '))
  expect(start).toBe(rulesBefore * 2)
  for (let index = 0; index < start; index += 1) expect(lines[index]).toBe(index % 2 === 0 ? '---' : '')
  const heading = lines[start] ?? ''
  expect(heading.match(HEADING_LINE) ?? heading.match(STATE_OF_PLAY_LINE)).not.toBeNull()
  expect(lines[start + 1]).toBe('')
  expect(lines[start + 2]).toMatch(FORM_LINE)
  expect(lines[start + 3]).toBe('')
  expect(lines[start + 4]).toBe('---')
  expect(lines[start + 5]).toBe('')
  expect(lines[start + 6]).toMatch(/^## (Done|Decided)$/)
  expect(lines.slice(start + 7).filter((line) => line !== '')).toEqual([])
}

/** A footer banner: the form-word top border, a padding line, the three fixed block-letter rows, a padding line and the fixed bottom border, 52 wide. */
const expectFooterFrame = (frame: string[] | undefined, wordRows: string[]): void => {
  expect(frame).toBeDefined()
  if (!frame) return
  expect(frame).toHaveLength(7)
  for (const line of frame) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(frame[0]).toMatch(FORM_TOP_BORDER)
  expect(frame[1]).toBe(PADDING_LINE)
  expect(rows(frame)).toEqual(wordRows)
  expect(frame[5]).toBe(PADDING_LINE)
  expect(frame[6]).toBe(FOOTER_BOTTOM_BORDER)
}

/** The list beneath a live frame: a blank line, then bracketed-state items in the standard's order, nothing else. */
const expectList = (lines: string[]): void => {
  expect(lines[0]).toBe('')
  const items = lines.slice(1)
  expect(items.length).toBeGreaterThan(0)
  for (const item of items) expect(item).toMatch(ITEM)
  const order = [
    'at rest',
    'running',
    'queued',
    'waiting',
    'committed',
    'uncommitted',
    'unpushed',
    'blocked',
    'held',
    'parked',
    'recovered',
    'unlogged'
  ]
  const ranks = items.map((item) => order.indexOf(item.slice(3, item.indexOf(']'))))
  for (let index = 1; index < ranks.length; index += 1)
    expect(ranks[index]).toBeGreaterThanOrEqual(ranks[index - 1] ?? 0)
  for (const item of items.filter((line) => /^- \[(running|queued)\]/.test(line))) expect(item).toMatch(AGENT_ITEM)
  for (const item of items.filter((line) => line.startsWith('- [waiting]'))) expect(item).toMatch(WAITING_ITEM)
}

test('the standard carries the REST, BUSY and HOLD footers and the DONE frame, in that order, and no heading frame', () => {
  const found = frames(standard)
  expect(found).toHaveLength(4)
  expectFooterFrame(found[0], REST_ROWS)
  expectFooterFrame(found[1], BUSY_ROWS)
  expectFooterFrame(found[2], HOLD_ROWS)
  const done = found[3]
  expect(done).toBeDefined()
  if (!done) return
  expect(done).toHaveLength(7)
  for (const line of done) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(done[0]).toMatch(FORM_TOP_BORDER)
  expect(done[1]).toBe(PADDING_LINE)
  expect(done[2]).toContain('· project closed')
  expect(done[5]).toBe(PADDING_LINE)
  expect(done[6]).toBe(FOOTER_BOTTOM_BORDER)
})

test('the report heading is the linked Initiative › Project heading, the bold form line and one rule, then the first section', () => {
  const [summary, stateOfPlay, runReport, ownerReport] = headings(standard)
  expect(headings(standard)).toHaveLength(4)
  expect(ownerReport?.slice(0, runReport?.length)).toEqual(runReport)
  expect(summary?.join('\n')).toBe(HEADING_EXAMPLE)
  expectReportHeading(summary, 0)
  expect(stateOfPlay?.[0]).toBe('# [<territory or Initiative>](<its local note>) › State of play')
  expect(stateOfPlay?.[2]).toBe('**Full summary at 19:13 BST · last mark 14:54 BST**')
  expectReportHeading(stateOfPlay, 0)
  expect(runReport?.[0]).toBe(
    `# [Knowledge Islands model](${INITIATIVE_NOTE}) › [Ways of working](${PROJECT_NOTE}) › heading-rich`
  )
  expect(runReport?.[2]).toBe('**Run report at 20:40 BST · last mark 14:54 BST**')
  expectReportHeading(runReport, 0)
  expect(standard).not.toContain('Project · Initiative · <window> · <state>` line beneath the frame')
})

test('the form line names only the form, the local issued time and the last mark', () => {
  expect('**Summary at 19:13 BST · last mark 14:54 BST**').toMatch(FORM_LINE)
  expect('**Recap at 09:05 GMT · last mark 14:54 BST**').toMatch(FORM_LINE)
  expect('**Re-bootstrap at 19:13 BST · last mark 14:54 BST**').toMatch(FORM_LINE)
  expect('**Hold report at 15:02 BST · mark 14:58 BST**').toMatch(FORM_LINE)
  expect('**Hold report at 15:02 BST · last mark 14:58 BST**').not.toMatch(FORM_LINE)
  expect('**Summary at 2026-10-14T17:03:02Z · last mark 14:54 BST**').not.toMatch(FORM_LINE)
  expect('**Summary at 19:13 BST · since your last message · working**').not.toMatch(FORM_LINE)
  expect('# [Ways of working](/a/b.md)').not.toMatch(HEADING_LINE)
  expect('# [KI Capital](/a/b.md) › State of play').toMatch(STATE_OF_PLAY_LINE)
})

test('the footer banner keeps the word rows of revision e60b4e45, carries the form word and the issued time on its top border, is padded inside each border and has no label-and-mark line beneath', () => {
  const [rest, busy] = frames(standard)
  expect(rest?.[0]).toBe('╭─ summary · 2026-10-14T17:03:02Z ─────────────────╮')
  expect(busy?.[0]).toBe('╭─ summary · 2026-10-14T17:03:02Z ─────────────────╮')
  expect(fill('summary')).toBe(17)
  expect(fill('recap')).toBe(19)
  expect(fill('hold report')).toBe(13)
  for (const form of ['summary', 'recap', 'full summary', 're-bootstrap', 'hold report', 'run report']) {
    const border = `╭─ ${form} · 2026-10-14T18:24:06Z ${'─'.repeat(fill(form))}╮`
    expect(codePoints(border)).toBe(FRAME_COLUMNS)
    expect(border).toMatch(FORM_TOP_BORDER)
  }
  expect('╭─ issued 2026-10-14T17:03:02Z ────────────────────╮').not.toMatch(FORM_TOP_BORDER)
  expect(rest?.[2]).toContain('· thread at rest')
  expect(busy?.[2]).toContain('· thread busy')
  for (const line of [...beneath(standard, 0), ...beneath(standard, 1)]) {
    expect(line).not.toContain('mark ')
    expect(line).not.toContain('issued ')
    expect(line).not.toContain('·')
  }
})

test('the output style carries the report heading and the REST, BUSY and HOLD footers byte-identical to the standard', () => {
  const [rest, busy, hold] = frames(standard)
  const styled = frames(outputStyle)
  expect(styled).toHaveLength(3)
  expect(styled[0]).toEqual(rest)
  expect(styled[1]).toEqual(busy)
  expect(styled[2]).toEqual(hold)
  expectFooterFrame(styled[0], REST_ROWS)
  expectFooterFrame(styled[1], BUSY_ROWS)
  expectFooterFrame(styled[2], HOLD_ROWS)
  for (const index of [0, 1, 2]) expect(beneath(outputStyle, index)).toEqual(beneath(standard, index))
  const styledHeadings = headings(outputStyle)
  expect(styledHeadings).toHaveLength(1)
  expect(styledHeadings[0]?.join('\n')).toBe(HEADING_EXAMPLE)
})

test('a blank line follows the footer, a thread at rest says so first and every item carries a bracketed state', () => {
  const rest = beneath(standard, 0)
  const busy = beneath(standard, 1)
  for (const list of [rest, busy]) expectList(list)
  expect(rest[1]).toBe(REST_ITEM)
  expect(busy).not.toContain(REST_ITEM)
  expect(busy.filter((line) => line.startsWith('- [running]'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('- [queued]'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('- [waiting]'))).toHaveLength(3)
  expect(busy).toContain('- [blocked] thread folder commit by the gate, commit-gate fixing')
  expect(rest.filter((line) => line.startsWith('- [waiting]'))).toHaveLength(2)
  expect(rest).toContain('- [committed] checkpoint and thread folder, pushed')
  expect(rest).toContain('- [held] PAPERCLIP-REQ until Wave F')
  expect(rest).toContain('- [parked] 1')
  for (const line of [...rest, ...busy]) expect(line.startsWith('   ')).toBe(false)
})

test("the DONE frame shares its block word with ki-recap's frame and differs in its side lines", () => {
  const done = frames(standard)[3]
  const recap = frames(recapStandard)
  expect(recap).toHaveLength(1)
  const recapDone = recap[0]
  expect(done).toBeDefined()
  expect(recapDone).toBeDefined()
  if (!done || !recapDone) return
  expect(word(done)).toBe(word(recapDone))
  expect(done).not.toEqual(recapDone)
})

test('the HOLD frame closes a hold report with its hold-report border, its list, the closing line and a resume line naming no host', () => {
  const hold = frames(standard)[2]
  expect(hold?.[0]).toBe('╭─ hold report · 2026-10-15T14:00:00Z ─────────────╮')
  expect(beneath(standard, 2)).toEqual(HOLD_LIST)
  for (const text of [standard, outputStyle]) {
    expect(text).toContain(`${HOLD_CLOSING_LINE}\n\n`)
    expect(text).toContain(`\`\`\`text\n${HOLD_RESUME_LINE}\n\`\`\``)
    expect(text).toContain('**Hold report at <local time> · mark <local time>**')
    expect(text).toContain('the queries live in the checkpoint')
    expect(text).not.toContain('· thread drained')
    expect(text).not.toMatch(/Resume <label> on [a-z]+ /)
  }
  expect(standard).toContain('use the BUSY frame instead and say in one line what is blocking')
  expect(standard).toContain('### Draining a thread')
  expect(standard).toContain('### Picking up a thread')
  expect(standard).toContain('### Pushing beneath other sessions')
})

test('the resume line is one sentence shared by the standard and the output style', () => {
  expect(standard).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
  expect(outputStyle).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
})

test('the hook line points at the standard and carries only its five hard rules', () => {
  const line = /^line='(.*)'$/m.exec(hook)?.[1] ?? ''
  expect(line).toContain(
    'follow the ki-pmo coordinating-thread standard (skills/change-management/ki-pmo/references/standards-pmo.md)'
  )
  expect(line).toContain(
    'whose five hard rules are: 1) delegate every unit of work to a detached background agent and stay responsive'
  )
  expect(line).toContain(
    '2) an owner message never pre-empts work in flight, so stop a running agent only when the owner names it and says stop'
  )
  expect(line).toContain(
    '3) while dispatched work runs, give timed one-to-two-line updates and keep a background check armed that wakes you at least every 5 minutes'
  )
  expect(line).toContain(
    '4) give every Summary, recap, full summary, re-bootstrap and hold report in the owner-report shape, opening with the report heading and closing with the footer banner'
  )
  expect(line).toContain(
    '5) commit your own work by explicit path, and act on each line of the Messages block at the top of the checkpoint, FIRST-STEP first'
  )
  expect(line).not.toContain('6)')
  // The shape itself lives in the standard and the output style; the line no longer restates it.
  expect(line).not.toContain('- [at rest]')
  expect(line).not.toContain('Hold report at')
  expect(line).not.toContain('DRAINED')
  expect(line.length).toBeLessThan(1200)
})

test('the run-report and footer-report sources carry the quiet-tools rule', () => {
  expect(standard).toContain('### Quiet tools')
  const quiet = 'run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line.'
  for (const surface of generate(harnessRoot).filter(({ path }) => path.includes('ki-delegation/assets/')))
    expect(surface.content).toContain(quiet)
})

test('the hook line, the pointer and the output style confine the coordinator forms to coordinating threads', () => {
  expect(hook).toContain("line='In a coordinating thread only,")
  expect(hook).toContain('in a conversational thread ignore this line and reply in the ki-pmo Reply forms')
  expect(hook).toContain('In a conversational thread, re-read your checkpoint if you have one')
  expect(outputStyle).toContain('This style applies only in a coordinating thread')
  expect(standard).toContain('## Reply forms')
})

test('every generated surface matches what the standard renders, so none is edited by hand', () => {
  for (const surface of generate(harnessRoot))
    expect({
      path: surface.path,
      content: readFileSync(resolve(harnessRoot, surface.path), 'utf8')
    }).toEqual({
      path: surface.path,
      content: surface.content
    })
})
