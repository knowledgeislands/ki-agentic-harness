import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The banner frame is normative text: every coordinating thread renders it
// byte-identical in shape, so the standard, the output style and ki-recap's
// DONE frame must agree. This test is the mechanical check the PMO rubric
// cannot run against a repository, because the transcripts the banner appears
// in are not tracked.

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
/** The live top border: `╭─ <thread type> `, `─` fill, ` <form> <issued UTC> ─╮`. */
const TOP_BORDER = new RegExp(
  `^╭─ (coordination|state-of-play) (─+) (summary|recap|full summary|re-bootstrap) ${UTC} ─╮$`
)
/** The live bottom border: `╰`, `─` fill, then ` mark <mark UTC> ─╯`. */
const BOTTOM_BORDER = new RegExp(`^╰─+ mark ${UTC} ─╯$`)
/** A blank body line: the bar, spaces, the bar. */
const BLANK_BODY = /^│ +│$/
/** The label line: the bar, padding, the label with ` - ` as its separator, padding, the bar. */
const LABEL_BODY = /^│( +)(\S.* - .*\S)( +)│$/
/** The DONE top border, which keeps the earlier block-letter frame: `╭─ issued <UTC> ─` padded with `─`. */
const DONE_TOP_BORDER = new RegExp(`^╭─ issued ${UTC} ─+╮$`)
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

/** The width a live frame takes: 52, or more when the top border needs more than the minimum fill at 52. */
const widthFor = (threadType: string, form: string): number =>
  Math.max(FRAME_COLUMNS, 29 + MIN_FILL + threadType.length + form.length)

const expectLiveFrame = (frame: string[] | undefined): void => {
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

test('the standard carries the REST, BUSY and widened examples in the one live frame and the DONE frame', () => {
  const found = frames(standard)
  expect(found).toHaveLength(4)
  expectLiveFrame(found[0])
  expectLiveFrame(found[1])
  expectLiveFrame(found[2])
  const done = found[3]
  expect(done).toBeDefined()
  if (!done) return
  for (const line of done) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(done[0]).toMatch(DONE_TOP_BORDER)
  expect(done[1]).toContain('· project closed')
})

test('the live frame carries the thread type, form and issued time above, the centred label within and the mark below, nowhere else', () => {
  const [rest, busy, wide] = frames(standard)
  for (const frame of [rest, busy]) {
    expect(frame?.[0]).toBe('╭─ coordination ──── summary 2026-10-14T17:03:02Z ─╮')
    expect(frame?.[2]).toBe('│            KI Model - ways-of-working            │')
    expect(frame?.[4]).toBe('╰────────────────────── mark 2026-10-14T13:54:34Z ─╯')
  }
  expect(wide?.[0]).toBe('╭─ state-of-play ──── full summary 2026-10-14T17:03:02Z ─╮')
  expect(wide?.[2]).toBe('│               KI Capital - state of play               │')
  expect(wide?.[4]).toBe('╰──────────────────────────── mark 2026-10-14T13:54:34Z ─╯')
  for (const line of wide ?? []) expect(codePoints(line)).toBe(58)
  for (const line of [...beneath(standard, 0), ...beneath(standard, 1), ...beneath(standard, 2)]) {
    expect(line).not.toContain('mark ')
    expect(line).not.toContain('issued ')
    expect(line).not.toContain('summary')
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

test('the output style carries the REST and BUSY examples byte-identical to the standard', () => {
  const [rest, busy] = frames(standard)
  const styled = frames(outputStyle)
  expect(styled).toHaveLength(2)
  expect(styled[0]).toEqual(rest)
  expect(styled[1]).toEqual(busy)
  expect(beneath(outputStyle, 0)).toEqual(beneath(standard, 0))
  expect(beneath(outputStyle, 1)).toEqual(beneath(standard, 1))
  for (const frame of styled) expectLiveFrame(frame)
})

test('a blank line follows the frame, a thread at rest says so first and every item carries a bracketed state', () => {
  const rest = beneath(standard, 0)
  const busy = beneath(standard, 1)
  const wide = beneath(standard, 2)
  for (const list of [rest, busy, wide]) expectList(list)
  expect(rest[1]).toBe(REST_ITEM)
  expect(wide[1]).toBe(REST_ITEM)
  expect(busy).not.toContain(REST_ITEM)
  expect(busy.filter((line) => line.startsWith('- [running]'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('- [queued]'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('- [waiting]'))).toHaveLength(3)
  expect(busy).toContain('- [blocked] thread folder commit by the gate, commit-gate fixing')
  expect(rest.filter((line) => line.startsWith('- [waiting]'))).toHaveLength(2)
  expect(rest).toContain('- [committed] checkpoint and thread folder, pushed')
  expect(rest).toContain('- [held] PAPERCLIP-REQ until Wave F')
  expect(rest).toContain('- [parked] 1')
  for (const line of [...rest, ...busy, ...wide]) expect(line.startsWith('   ')).toBe(false)
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

test('the resume line is one sentence shared by the standard and the output style', () => {
  expect(standard).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
  expect(outputStyle).toContain(`\`\`\`text\n${RESUME_LINE}\n\`\`\``)
})

test('the hook line names the banner, the bracketed-state list, the thread folder and the prefilled reply block', () => {
  expect(hook).toContain('Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo banner')
  expect(hook).toContain(
    'the thread type, the report form and the issued time in its top border, the label centred in its body and the mark in its bottom border'
  )
  expect(hook).toContain('widened equally when the top border needs more than 52')
  expect(hook).toContain('one Markdown list with a bracketed state per item')
  expect(hook).toContain('- [at rest] nothing running or queued')
  expect(hook).toContain('stacks its tag on one line, a blank line, then the recommended instruction')
  expect(hook).toContain('never a menu of options')
  expect(hook).toContain('with --- between entries')
  expect(hook).toContain('Commit and push the thread folder under +/_THREADS/')
  expect(hook).toContain('Re-anchoring after compaction')
})
