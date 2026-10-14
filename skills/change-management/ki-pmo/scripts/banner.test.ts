import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The heading frame and the footer banner are normative text: every
// coordinating thread renders both byte-identical in shape, so the standard,
// the output style and ki-recap's DONE frame must agree. The heading frame is
// the framed label Kris drew on 2026-10-14 and placed with "This is for the
// heading, not the footer banner"; the footer is the block-letter REST or BUSY
// frame he restored with "The footer banner needs to be like it was before,
// with the large ascii text", held here exactly as harness revision e60b4e45
// carried it. This test is the mechanical check the PMO rubric cannot run
// against a repository, because the transcripts the frames appear in are not
// tracked.

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
const MIN_FILL = 4
const UTC = String.raw`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z`
/** The heading frame's top border: `╭─ <thread type> `, `─` fill, ` <form> <issued UTC> ─╮`. */
const TOP_BORDER = new RegExp(
  `^╭─ (coordination|state-of-play) (─+) (summary|recap|full summary|re-bootstrap) ${UTC} ─╮$`
)
/** The heading frame's bottom border: `╰`, `─` fill, then ` mark <mark UTC> ─╯`. */
const BOTTOM_BORDER = new RegExp(`^╰─+ mark ${UTC} ─╯$`)
/** The footer banner's top border, shared with DONE: `╭─ issued <UTC> ─` padded with `─`. */
const ISSUED_TOP_BORDER = new RegExp(`^╭─ issued ${UTC} ─+╮$`)
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
/** A blank body line: the bar, spaces, the bar. */
const BLANK_BODY = /^│ +│$/
/** The label line: the bar, padding, the label with ` - ` as its separator, padding, the bar. */
const LABEL_BODY = /^│( +)(\S.* - .*\S)( +)│$/
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

/** Every fenced frame in a document: the five framed lines, from `╭` to `╰`. */
const frames = (text: string): string[][] => {
  const lines = text.split('\n')
  const found: string[][] = []
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index]?.startsWith('╭')) {
      const frame = lines.slice(index, index + 5)
      expect(frame[4]?.startsWith('╰')).toBe(true)
      found.push(frame)
    }
  }
  return found
}

const word = (frame: string[]): string =>
  frame
    .slice(1, 4)
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
    for (let cursor = index + 5; cursor < lines.length && !lines[cursor]?.startsWith('```'); cursor += 1)
      found.push(lines[cursor] ?? '')
    return found
  }
  return []
}

/** The width a heading frame takes: 52, or more when the top border needs more than the minimum fill at 52. */
const widthFor = (threadType: string, form: string): number =>
  Math.max(FRAME_COLUMNS, 29 + MIN_FILL + threadType.length + form.length)

/** A footer banner: the issued top border, the three fixed block-letter rows and the fixed bottom border, 52 wide. */
const expectFooterFrame = (frame: string[] | undefined, rows: string[]): void => {
  expect(frame).toBeDefined()
  if (!frame) return
  for (const line of frame) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(frame[0]).toMatch(ISSUED_TOP_BORDER)
  expect(frame.slice(1, 4)).toEqual(rows)
  expect(frame[4]).toBe(FOOTER_BOTTOM_BORDER)
}

const expectHeadingFrame = (frame: string[] | undefined): void => {
  expect(frame).toBeDefined()
  if (!frame) return
  const top = frame[0]?.match(TOP_BORDER)
  expect(top).not.toBeNull()
  if (!top) return
  const [, threadType, fill, form] = top
  const width = widthFor(threadType ?? '', form ?? '')
  expect(fill?.length).toBeGreaterThanOrEqual(MIN_FILL)
  for (const line of frame) expect(codePoints(line)).toBe(width)
  expect(frame[1]).toMatch(BLANK_BODY)
  expect(frame[3]).toMatch(BLANK_BODY)
  const label = frame[2]?.match(LABEL_BODY)
  expect(label).not.toBeNull()
  if (!label) return
  const [, left, , right] = label
  // The label is centred; where the space is odd, the extra space goes on the right.
  expect((right?.length ?? 0) - (left?.length ?? 0)).toBeGreaterThanOrEqual(0)
  expect((right?.length ?? 0) - (left?.length ?? 0)).toBeLessThanOrEqual(1)
  expect(frame[4]).toMatch(BOTTOM_BORDER)
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

test('the standard carries the heading frame, its widened form, the REST and BUSY footers and the DONE frame, in that order', () => {
  const found = frames(standard)
  expect(found).toHaveLength(5)
  expectHeadingFrame(found[0])
  expectHeadingFrame(found[1])
  expectFooterFrame(found[2], REST_ROWS)
  expectFooterFrame(found[3], BUSY_ROWS)
  const done = found[4]
  expect(done).toBeDefined()
  if (!done) return
  for (const line of done) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(done[0]).toMatch(ISSUED_TOP_BORDER)
  expect(done[1]).toContain('· project closed')
})

test('the heading frame carries the thread type, form and issued time above, the centred label within and the mark below, and nothing beneath', () => {
  const [heading, wide] = frames(standard)
  expect(heading?.[0]).toBe('╭─ coordination ──── summary 2026-10-14T17:03:02Z ─╮')
  expect(heading?.[2]).toBe('│            KI Model - ways-of-working            │')
  expect(heading?.[4]).toBe('╰────────────────────── mark 2026-10-14T13:54:34Z ─╯')
  expect(wide?.[0]).toBe('╭─ state-of-play ──── full summary 2026-10-14T17:03:02Z ─╮')
  expect(wide?.[2]).toBe('│               KI Capital - state of play               │')
  expect(wide?.[4]).toBe('╰──────────────────────────── mark 2026-10-14T13:54:34Z ─╯')
  for (const line of wide ?? []) expect(codePoints(line)).toBe(58)
  expect(beneath(standard, 0)).toEqual([])
  expect(beneath(standard, 1)).toEqual([])
})

test('the footer banner is the block-letter frame as revision e60b4e45 carried it, with the issued time its only variable and no label-and-mark line beneath', () => {
  const [, , rest, busy] = frames(standard)
  expect(rest?.[0]).toBe('╭─ issued 2026-10-14T17:03:02Z ────────────────────╮')
  expect(busy?.[0]).toBe('╭─ issued 2026-10-14T17:03:02Z ────────────────────╮')
  expect(rest?.[1]).toContain('· thread at rest')
  expect(busy?.[1]).toContain('· thread busy')
  for (const line of [...beneath(standard, 2), ...beneath(standard, 3)]) {
    expect(line).not.toContain('mark ')
    expect(line).not.toContain('issued ')
    expect(line).not.toContain('·')
  }
})

test('the frame stays 52 wide while four fill fit and widens equally otherwise, for every thread type and form', () => {
  expect(widthFor('coordination', 'summary')).toBe(52)
  expect(widthFor('coordination', 'recap')).toBe(52)
  expect(widthFor('coordination', 'full summary')).toBe(57)
  expect(widthFor('coordination', 're-bootstrap')).toBe(57)
  expect(widthFor('state-of-play', 'summary')).toBe(53)
  expect(widthFor('state-of-play', 'recap')).toBe(52)
  expect(widthFor('state-of-play', 'full summary')).toBe(58)
  expect(widthFor('state-of-play', 're-bootstrap')).toBe(58)
  expect(codePoints('╭─ coordination ──── summary 2026-10-14T17:03:02Z ─╮')).toBe(52)
  expect(codePoints('╭─ coordination ────── recap 2026-10-14T17:03:02Z ─╮')).toBe(52)
})

test('the output style carries the heading frame and the REST and BUSY footers byte-identical to the standard', () => {
  const [heading, , rest, busy] = frames(standard)
  const styled = frames(outputStyle)
  expect(styled).toHaveLength(3)
  expect(styled[0]).toEqual(heading)
  expect(styled[1]).toEqual(rest)
  expect(styled[2]).toEqual(busy)
  expectHeadingFrame(styled[0])
  expectFooterFrame(styled[1], REST_ROWS)
  expectFooterFrame(styled[2], BUSY_ROWS)
  expect(beneath(outputStyle, 0)).toEqual([])
  expect(beneath(outputStyle, 1)).toEqual(beneath(standard, 2))
  expect(beneath(outputStyle, 2)).toEqual(beneath(standard, 3))
})

test('a blank line follows the footer, a thread at rest says so first and every item carries a bracketed state', () => {
  const rest = beneath(standard, 2)
  const busy = beneath(standard, 3)
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
  const done = frames(standard)[4]
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

test('the hook line names the heading frame, the block-letter footer, the bracketed-state list, the thread folder and the prefilled reply block', () => {
  expect(hook).toContain('opening with the ki-pmo heading frame in its own text block')
  expect(hook).toContain(
    'the thread type, the report form and the issued time in its top border, the label centred in its body and the mark in its bottom border'
  )
  expect(hook).toContain('widened equally when the top border needs more than 52')
  expect(hook).toContain('and the plain Project · Initiative · <window> · <state> line beneath it')
  expect(hook).toContain(
    'Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo footer banner'
  )
  expect(hook).toContain(
    'the block-letter REST or BUSY frame exactly as the standard prints it, issued time in its top border'
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
