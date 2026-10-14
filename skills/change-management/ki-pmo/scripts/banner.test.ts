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
const UTC = String.raw`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z`
/** The live top border: `╭─ <thread type> `, `─` fill, then ` <issued UTC> ─╮`. */
const TOP_BORDER = new RegExp(`^╭─ (coordination|state-of-play) ─+ ${UTC} ─╮$`)
/** The live bottom border: `╰`, `─` fill, then ` mark <mark UTC> ─╯`. */
const BOTTOM_BORDER = new RegExp(`^╰─+ mark ${UTC} ─╯$`)
/** A blank body line: the bar, 50 spaces, the bar. */
const BLANK_BODY = /^│ {50}│$/
/** The label line: the bar, one space, the label with ` - ` as its separator, padding, the bar. */
const LABEL_BODY = /^│ \S.* - \S.*[^ ] +│$/
/** The DONE top border, which keeps the earlier block-letter frame: `╭─ issued <UTC> ─` padded with `─`. */
const DONE_TOP_BORDER = new RegExp(`^╭─ issued ${UTC} ─+╮$`)
/** A line beneath the frame carrying exactly one item: a prefix, one name without a comma, ` - ` and what it is. */
const ITEM_LINE = /^ {3}(running|queued|waiting on you): [^,]+ - .+$/
const REST_LINE = '   at rest: nothing running or queued'
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

const expectLiveFrame = (frame: string[] | undefined): void => {
  expect(frame).toBeDefined()
  if (!frame) return
  for (const line of frame) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(frame[0]).toMatch(TOP_BORDER)
  expect(frame[1]).toMatch(BLANK_BODY)
  expect(frame[2]).toMatch(LABEL_BODY)
  expect(frame[3]).toMatch(BLANK_BODY)
  expect(frame[4]).toMatch(BOTTOM_BORDER)
}

test('the standard carries the REST and BUSY examples in the one live frame and the DONE frame, all at 52 code points', () => {
  const found = frames(standard)
  expect(found).toHaveLength(3)
  expectLiveFrame(found[0])
  expectLiveFrame(found[1])
  const done = found[2]
  expect(done).toBeDefined()
  if (!done) return
  for (const line of done) expect(codePoints(line)).toBe(FRAME_COLUMNS)
  expect(done[0]).toMatch(DONE_TOP_BORDER)
  expect(done[1]).toContain('· project closed')
})

test('the live frame carries the thread type and issued time above, the label within and the mark below, nowhere else', () => {
  const [rest, busy] = frames(standard)
  for (const frame of [rest, busy]) {
    expect(frame?.[0]).toContain('╭─ coordination ')
    expect(frame?.[2]).toContain('│ KI Model - ways-of-working')
    expect(frame?.[4]).toContain(' mark ')
  }
  for (const line of [...beneath(standard, 0), ...beneath(standard, 1)]) {
    expect(line).not.toContain('· mark ')
    expect(line).not.toContain('issued ')
    expect(line).not.toContain('· banner ')
  }
  expect(standard).toContain('╭─ state-of-play ─────────── 2026-10-14T16:54:52Z ─╮')
  expect(codePoints('╭─ state-of-play ─────────── 2026-10-14T16:54:52Z ─╮')).toBe(FRAME_COLUMNS)
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

test('a thread at rest says so on the first line beneath and a busy thread lists each item on its own line', () => {
  const rest = beneath(standard, 0)
  const busy = beneath(standard, 1)
  expect(rest[0]).toBe(REST_LINE)
  expect(busy).not.toContain(REST_LINE)
  const items = [...rest, ...busy].filter((line) => /^ {3}(running|queued|waiting on you):/.test(line))
  expect(items.length).toBeGreaterThanOrEqual(5)
  for (const line of items) expect(line).toMatch(ITEM_LINE)
  expect(busy.filter((line) => line.startsWith('   running:'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('   queued:'))).toHaveLength(2)
  expect(busy.filter((line) => line.startsWith('   waiting on you:'))).toHaveLength(3)
  expect(rest.filter((line) => line.startsWith('   waiting on you:'))).toHaveLength(2)
  expect(standard).toContain('thread folder committed and pushed')
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

test('the hook line names the banner, the per-item lines, the thread folder and the prefilled reply block', () => {
  expect(hook).toContain('Close every Summary, recap, full summary and re-bootstrap report with the ki-pmo banner')
  expect(hook).toContain(
    'the thread type and issued time in its top border, the label in its body and the mark in its bottom border'
  )
  expect(hook).toContain('one line per running, queued or waiting item')
  expect(hook).toContain('at rest: nothing running or queued')
  expect(hook).toContain('stacks its tag on one line, a blank line, then the recommended instruction')
  expect(hook).toContain('never a menu of options')
  expect(hook).toContain('with --- between entries')
  expect(hook).toContain('Commit and push the thread folder under +/_THREADS/')
  expect(hook).toContain('Re-anchoring after compaction')
})
