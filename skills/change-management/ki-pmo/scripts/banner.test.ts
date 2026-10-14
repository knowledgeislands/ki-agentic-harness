import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The banner frames are normative text: every coordinating thread renders them
// byte-identical, so the standard, the output style and ki-recap's frame must
// agree. This test is the mechanical check the PMO rubric cannot run against a
// repository, because the transcripts the banner appears in are not tracked.

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
/** The top border: `╭─ issued <YYYY-MM-DDTHH:MM:SSZ> ─` padded with `─` to the frame's width. */
const TOP_BORDER = /^╭─ issued \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z ─+╮$/
/** A line beneath the frame carrying exactly one item: a prefix, one name, ` - ` and what it is. */
const ITEM_LINE = /^ {3}(running|queued|waiting on you): [^,]+ - [^,]+$/
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

test('the standard carries the REST, BUSY and DONE frames at 52 code points with the issued top border', () => {
  const found = frames(standard)
  expect(found).toHaveLength(3)
  for (const frame of found) {
    for (const line of frame) expect(codePoints(line)).toBe(FRAME_COLUMNS)
    expect(frame[0]).toMatch(TOP_BORDER)
  }
  expect(found[0]?.[1]).toContain('· thread at rest')
  expect(found[1]?.[1]).toContain('· thread busy')
  expect(found[2]?.[1]).toContain('· project closed')
})

test('the output style carries the REST and BUSY frames byte-identical to the standard below the issued border', () => {
  const [rest, busy] = frames(standard)
  const styled = frames(outputStyle)
  expect(styled).toHaveLength(2)
  expect(styled[0]?.slice(1)).toEqual(rest?.slice(1))
  expect(styled[1]?.slice(1)).toEqual(busy?.slice(1))
  for (const frame of styled) {
    for (const line of frame) expect(codePoints(line)).toBe(FRAME_COLUMNS)
    expect(frame[0]).toMatch(TOP_BORDER)
  }
})

test('every running, queued or waiting item beneath a frame has its own line and the issued time is not repeated', () => {
  const rest = beneath(standard, 0)
  const busy = beneath(standard, 1)
  const items = [...rest, ...busy].filter((line) => /^ {3}(running|queued|waiting on you):/.test(line))
  expect(items.length).toBeGreaterThanOrEqual(5)
  for (const line of items) expect(line).toMatch(ITEM_LINE)
  expect(busy.filter((line) => line.startsWith('   running:'))).toHaveLength(1)
  expect(busy.filter((line) => line.startsWith('   queued:'))).toHaveLength(2)
  expect(rest.filter((line) => line.startsWith('   waiting on you:'))).toHaveLength(2)
  for (const line of [...rest, ...busy]) expect(line).not.toContain('· banner ')
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
  expect(hook).toContain('with the issued time in its top border')
  expect(hook).toContain('one line per running, queued or waiting item')
  expect(hook).toContain('never a menu of options')
  expect(hook).toContain('Commit and push the thread folder under +/_THREADS/')
  expect(hook).toContain('Re-anchoring after compaction')
})
