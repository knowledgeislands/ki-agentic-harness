import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The report heading and the footer banner are normative text: every
// coordinating thread renders both byte-identical in shape, so the standard,
// the output style and ki-recap's DONE frame must agree. The report heading is
// the rich-text heading Kris asked for on 2026-10-14, "a better heading that is
// the actual just normal text, so it can be rich text rather than fixed width
// text", agreed with "Actually, that is really good." and amended with "a
// tripple HR element Before the main heading" and "a single HR alignment after
// the summary and last mark part"; it replaced the framed label of the same
// day. The footer is the block-letter REST or BUSY frame he restored with "The
// footer banner needs to be like it was before, with the large ascii text",
// its word rows held here exactly as harness revision e60b4e45 carried them,
// padded with one blank framed line inside each border and carrying the
// report's form word on its top border since Kris asked "What about with some
// spaces around it, so that it's got a bit more impact?" and approved with
// "Okay, I'm really happy with that. Yeah, let's go with it." This test is the
// mechanical check the PMO rubric cannot run against a repository, because the
// transcripts the frames appear in are not tracked.

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
  '---',
  '',
  '---',
  '',
  '---',
  '',
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
/** The form line: the form, the local issued time and the last mark, bold. */
const FORM_LINE =
  /^\*\*(Summary|Recap|Full summary|Re-bootstrap|Run report) at \d{2}:\d{2} [A-Z]{3,4} · last mark \d{2}:\d{2} [A-Z]{3,4}\*\*$/
/** The footer banner's top border, shared with DONE: `╭─ <form> · <UTC> ─` filled with `─`. */
const FORM_TOP_BORDER = new RegExp(`^╭─ (summary|recap|full summary|re-bootstrap|run report) · ${UTC} ─+╮$`)
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
/** An item in the list beneath: `- [<state>] <what>`. */
const ITEM =
  /^- \[(at rest|running|queued|waiting|committed|uncommitted|unpushed|blocked|held|parked|recovered|unlogged)\] .+$/
/** A running or queued item names one agent, without a comma, then ` - ` and what it does. */
const AGENT_ITEM = /^- \[(running|queued)\] [^,]+ - .+$/
/** A waiting item carries the Needs tag alone. */
const WAITING_ITEM = /^- \[waiting\] [A-Z][A-Z0-9-]*$/
const REST_ITEM = '- [at rest] nothing running or queued'
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

/** Every fenced `markdown` block in a document whose first heading line is a `#` heading. */
const headings = (text: string): string[][] => {
  const found: string[][] = []
  for (const block of text.split('```markdown\n').slice(1)) {
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

test('the standard carries the REST and BUSY footers and the DONE frame, in that order, and no heading frame', () => {
  const found = frames(standard)
  expect(found).toHaveLength(3)
  expectFooterFrame(found[0], REST_ROWS)
  expectFooterFrame(found[1], BUSY_ROWS)
  const done = found[2]
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

test('the report heading is three rules, the linked Initiative › Project heading, the bold form line and one rule, then the first section', () => {
  const [summary, stateOfPlay, runReport] = headings(standard)
  expect(headings(standard)).toHaveLength(3)
  expect(summary?.join('\n')).toBe(HEADING_EXAMPLE)
  expectReportHeading(summary, 3)
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
  for (const form of ['summary', 'recap', 'full summary', 're-bootstrap', 'run report']) {
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

test('the output style carries the report heading and the REST and BUSY footers byte-identical to the standard', () => {
  const [rest, busy] = frames(standard)
  const styled = frames(outputStyle)
  expect(styled).toHaveLength(2)
  expect(styled[0]).toEqual(rest)
  expect(styled[1]).toEqual(busy)
  expectFooterFrame(styled[0], REST_ROWS)
  expectFooterFrame(styled[1], BUSY_ROWS)
  expect(beneath(outputStyle, 0)).toEqual(beneath(standard, 0))
  expect(beneath(outputStyle, 1)).toEqual(beneath(standard, 1))
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
  const done = frames(standard)[2]
  const recap = frames(recapStandard)
  expect(recap).toHaveLength(1)
  const recapDone = recap[0]
  expect(done).toBeDefined()
  expect(recapDone).toBeDefined()
  if (!done || !recapDone) return
  expect(word(done)).toBe(word(recapDone))
  expect(done).not.toEqual(recapDone)
})

test('the resume line is one sentence shared by the standard and the output style', () => {
  expect(standard).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
  expect(outputStyle).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
})

test('the hook line names the report heading, the block-letter footer, the bracketed-state list, the thread folder and the prefilled reply block', () => {
  expect(hook).toContain('opening with the ki-pmo report heading: three --- rules')
  expect(hook).toContain(
    'one # heading of the Initiative linked to its local note, then ›, then the Project linked to its local note, both as display names'
  )
  expect(hook).toContain('a bold <Form> at <local time> · last mark <local time> line, then one --- rule')
  expect(hook).toContain('no frame, thread type, window or state line')
  expect(hook).not.toContain('heading frame')
  expect(hook).not.toContain('Project · Initiative')
  expect(hook).toContain(
    'Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo footer banner'
  )
  expect(hook).toContain(
    'the block-letter REST or BUSY frame exactly as the standard prints it, the lower-case form word and issued time in its top border and one blank framed line inside each border'
  )
  expect(hook).toContain('with no label-and-mark line')
  expect(hook).toContain('one Markdown list with a bracketed state per item')
  expect(hook).toContain('- [at rest] nothing running or queued')
  expect(hook).toContain(
    'Context, a one-sentence Query and lettered Options with a) (recommended) first and no bullets'
  )
  expect(hook).toContain('stacks its tag on one line, a blank line, then the option a) instruction in full')
  expect(hook).toContain('never a menu of options')
  expect(hook).toContain('a bare letter in reply being accepted')
  expect(hook).toContain('with --- between entries')
  expect(hook).toContain('Commit and push the thread folder under +/_THREADS/')
  expect(hook).toContain('Re-anchoring after compaction')
})
