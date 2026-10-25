import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generate } from './generate/index.ts'

// The report heading and the glyph banner are normative text: every
// coordinator renders both the same way, so the standard and the output style
// must agree. The report heading is the rich-text heading Kris asked for on
// 2026-10-14, "a better heading that is the actual just normal text, so it can
// be rich text rather than fixed width text", with its single rule since
// 2026-10-17, "we can just go single horizontal rule", so no saved report opens
// with `---`. Its form line leads with the work's state in glyphs. The banner
// is the Work Process note's, set with BANNER-GLYPH and REPLY-BLOCK on 18
// October and TARGET-GLYPH the same day: the glyphs come first and the last
// glyph is whose move it is, a settled state shows its holder's glyph alone,
// an arrow appears only in a handoff state, and no report carries a reply
// block. The block-letter frames retired with the work model. This test is the
// mechanical check the COORD rubric cannot run against a repository, because the
// transcripts the banners appear in are not tracked.

const skillRoot = resolve(import.meta.dir, '..')
const harnessRoot = resolve(skillRoot, '..', '..', '..')
const standard = readFileSync(resolve(skillRoot, 'references', 'standards-coordination.md'), 'utf8')
const outputStyle = readFileSync(resolve(harnessRoot, 'output-styles', 'ki-coordinator.md'), 'utf8')
const hook = readFileSync(resolve(harnessRoot, 'hooks', 'coordinator-reminder.sh'), 'utf8')

const THEME_PAGE = '/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Themes/model.md'
const PROJECT_NOTE = '/Users/krisbrown/workspaces/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md'
/** The report heading opening a Summary, as the standard and the output style draw it. */
const HEADING_EXAMPLE = [
  `# [Model](${THEME_PAGE}) › [Ways of working](${PROJECT_NOTE})`,
  '',
  '**🤖 → 👤 Handoff to supervisor · Summary at 23:52 BST · last mark 22:34 BST**',
  '',
  '---',
  '',
  '## Done'
].join('\n')
/** The `#` heading: a linked theme, ` › `, a linked Project, and for a run report ` › <run name>`. */
const HEADING_LINE = /^# \[[^\]]+\]\(\/[^)]+\) › \[[^\]]+\]\(\/[^)]+\)( › [a-z0-9-]+)?$/
/** Territory work's heading: a linked territory or theme, then ` › State of play`. */
const STATE_OF_PLAY_LINE = /^# \[[^\]]+\]\([^)]+\) › State of play$/
/** A glyph state: a settled holder's glyph alone, or an arrow in a handoff state, with an optional reason. */
const GLYPH_STATE = String.raw`(?:🤖 With worker|👤 With supervisor|🤖 → 👤 Handoff to supervisor(?: · blocked)?|👤 → 🤖 Handoff to worker|→ 🎯 Handoff to [^·*]+|⏸️ On hold(?: · (?:paused until [^·*]+|more expected))?|🏁 Finished)`
/** The form line: the glyph state, the form, the local issued time and the last mark, bold; a hold report names the hold's mark. */
const FORM_LINE = new RegExp(
  String.raw`^\*\*${GLYPH_STATE} · (?:(?:Summary|Recap|Full summary|Re-bootstrap|Run report) at \d{2}:\d{2} [A-Z]{3,4} · last mark|Hold report at \d{2}:\d{2} [A-Z]{3,4} · mark) \d{2}:\d{2} [A-Z]{3,4}\*\*$`,
  'u'
)
/** The banner heading: `### <glyph state> · since <time>`, or Finished's close line. */
const BANNER_HEADING = new RegExp(
  String.raw`^### (?:${GLYPH_STATE} · since \d{2}:\d{2} [A-Z]{3,4}|🏁 Finished · .+ closed at \d{2}:\d{2} [A-Z]{3,4})$`,
  'u'
)
/** A banner item: `- [<state>] <what>`, the live items naming a holder and a since. */
const ITEM =
  /^- \[(running|queued|with you|stuck|blocked|handoff|parked|on hold|release|committed|uncommitted|recovered|unlogged|finished)\] .+$/
const HOLDER_ITEM =
  /^- \[(running|queued|with you|stuck|handoff)\] [^·]+ · (owner|agent|run\/[\w-]+|work\/[\w.-]+|person\/[\w-]+|repo\/[\w-]+) · since \d{2}:\d{2}$/
const PROJECT_THREAD_LINE = '🧵 Coordination thread · KI > Model > Ways of working (ki.ways-of-working)'
const TERRITORY_THREAD_LINE = '🧵 State of play thread · KI > SoP (ki)'
const THREAD_LINE =
  /^🧵 (?:Coordination thread · .+ \([a-z0-9-]+\.(?!regular(?:\.|\)))[a-z0-9-]+\)|State of play thread · .+ \([a-z0-9-]+\))$/u

/** The standard less its Generated surfaces sources, whose text is checked through what they render. */
const withoutSources = (text: string): string =>
  text.replace(/<!-- ki-coordination:source [\w-]+ -->\n\n(`{3,})[a-z]*\n[\s\S]*?\n\1\n/g, '')

/** Every fenced `markdown` block in a document, as lines. */
const markdownBlocks = (text: string): string[][] =>
  withoutSources(text)
    .split('```markdown\n')
    .slice(1)
    .map((block) => block.split('\n```')[0]?.split('\n') ?? [])

/** The blocks that open with a `#` report heading. */
const headings = (text: string): string[][] =>
  markdownBlocks(text).filter((lines) => lines.some((line) => line.startsWith('# ')))

/** The blocks that open with a `###` glyph banner heading. */
const banners = (text: string): string[][] =>
  markdownBlocks(text).filter((lines) => BANNER_HEADING.test(lines[0] ?? ''))

/** A report heading: the `#` heading, a blank line, the form line, a blank line, one rule, a blank line, then the first section. */
const expectReportHeading = (lines: string[] | undefined): void => {
  expect(lines).toBeDefined()
  if (!lines) return
  expect(lines[0]?.match(HEADING_LINE) ?? lines[0]?.match(STATE_OF_PLAY_LINE)).not.toBeNull()
  expect(lines[1]).toBe('')
  expect(lines[2]).toMatch(FORM_LINE)
  expect(lines[3]).toBe('')
  expect(lines[4]).toBe('---')
  expect(lines[5]).toBe('')
  expect(lines[6]).toMatch(/^## (Done|Decided)$/)
  expect(lines.slice(7).filter((line) => line !== '')).toEqual([])
}

/** A banner: the heading, a blank line, a counts line where live, a blank line, then bracketed-state items only. */
const expectBanner = (lines: string[]): void => {
  expect(lines[0]).toMatch(BANNER_HEADING)
  expect(lines[1]).toBe('')
  const finished = lines[0]?.startsWith('### 🏁') ?? false
  expect(lines.at(-1)).toMatch(THREAD_LINE)
  expect(lines.filter((line) => line.startsWith('🧵 '))).toHaveLength(1)
  expect(lines.at(-2)).toBe('')
  const items = lines.slice(finished ? 2 : 4, -2)
  if (!finished) {
    expect(lines[2]).toMatch(/^\S+ [a-z0-9 ]+( · \S+ [a-z0-9 ]+)*$/u)
    expect(lines[3]).toBe('')
  }
  expect(items.length).toBeGreaterThan(0)
  for (const item of items) expect(item).toMatch(ITEM)
  for (const item of items.filter((line) => /^- \[(running|queued|with you|stuck|handoff)\]/.test(line)))
    expect(item).toMatch(HOLDER_ITEM)
  for (const item of items) expect(item).not.toMatch(/decision \d|#\d/)
}

test('the standard carries the report heading as a linked theme › Project heading, the glyph form line and one rule', () => {
  const found = headings(standard)
  expect(found).toHaveLength(3)
  const [summary, territory, runReport] = found
  expect(summary?.join('\n')).toBe(HEADING_EXAMPLE)
  expectReportHeading(summary)
  expect(territory?.[0]).toBe('# [<territory or theme>](<its local note>) › State of play')
  expect(territory?.[2]).toBe('**👤 With supervisor · Full summary at 19:13 BST · last mark 14:54 BST**')
  expectReportHeading(territory)
  expect(runReport?.[0]).toBe(`# [Model](${THEME_PAGE}) › [Ways of working](${PROJECT_NOTE}) › migrate-phase1`)
  expect(runReport?.[2]).toBe('**🤖 → 👤 Handoff to supervisor · Run report at 20:40 BST · last mark 14:54 BST**')
  expectReportHeading(runReport)
})

test('the form line leads with the glyph state, then the form, the local issued time and the last mark', () => {
  expect('**🤖 With worker · Summary at 19:13 BST · last mark 14:54 BST**').toMatch(FORM_LINE)
  expect('**🤖 → 👤 Handoff to supervisor · blocked · Recap at 09:05 GMT · last mark 14:54 BST**').toMatch(FORM_LINE)
  expect('**→ 🎯 Handoff to KI > Tools burndown · Summary at 23:10 BST · last mark 22:00 BST**').toMatch(FORM_LINE)
  expect('**⏸️ On hold · Hold report at 15:02 BST · mark 14:58 BST**').toMatch(FORM_LINE)
  expect('**⏸️ On hold · Hold report at 15:02 BST · last mark 14:58 BST**').not.toMatch(FORM_LINE)
  expect('**Summary at 19:13 BST · last mark 14:54 BST**').not.toMatch(FORM_LINE)
  expect('**👤 With supervisor · Summary at 2026-10-14T17:03:02Z · last mark 14:54 BST**').not.toMatch(FORM_LINE)
  expect('# [Ways of working](/a/b.md)').not.toMatch(HEADING_LINE)
  expect('# [KI Capital](/a/b.md) › State of play').toMatch(STATE_OF_PLAY_LINE)
})

test('the glyph banner shows a settled holder alone and an arrow only in a handoff state', () => {
  for (const settled of ['🤖 With worker', '👤 With supervisor', '⏸️ On hold · more expected'])
    expect(`### ${settled} · since 07:40 BST`).toMatch(BANNER_HEADING)
  for (const handoff of ['🤖 → 👤 Handoff to supervisor', '👤 → 🤖 Handoff to worker', '→ 🎯 Handoff to run/obs-push'])
    expect(`### ${handoff} · since 07:55 BST`).toMatch(BANNER_HEADING)
  expect('### 👤 → 👤 With supervisor · since 07:40 BST').not.toMatch(BANNER_HEADING)
  expect('### 🤖 Handoff to supervisor · since 07:40 BST').not.toMatch(BANNER_HEADING)
  expect('### 🏁 Finished · Ways of working closed at 18:00 BST').toMatch(BANNER_HEADING)
})

test('the standard carries the With worker, handoff, On hold and Finished banners, in that order', () => {
  const found = banners(standard)
  expect(found.map((lines) => lines[0]?.split(' · ')[0])).toEqual([
    '### 🤖 With worker',
    '### 🤖 → 👤 Handoff to supervisor',
    '### ⏸️ On hold',
    '### 🏁 Finished'
  ])
  for (const lines of found) expectBanner(lines)
  const [withWorker, handoff, hold] = found
  expect(withWorker?.[2]).toBe('🤖 2 running · 👤 1 with you · ⛔ 1 blocked')
  expect(withWorker).toContain('- [running] work-model · run/work-model · since 23:20')
  expect(handoff).toContain('- [committed] work folder')
  expect(handoff?.some((line) => line.startsWith('- [running]'))).toBe(false)
  expect(hold?.[0]).toBe('### ⏸️ On hold · paused until the harness migration lands · since 00:10 BST')
  expect(hold).toContain('- [release] after the harness migration lands, or `resume`')
  expect(hold?.[2]).toBe('⏸️ drained · 🅿️ 9 queries parked')
  expect(hold?.slice(4, -2).every((line) => /^- \[(parked|release)\] /.test(line))).toBe(true)
})

test('reports omit routine push state, and an On hold banner lists nothing waiting', () => {
  for (const text of [standard, outputStyle]) {
    expect(text).not.toContain('who decides the push')
    expect(text).not.toContain('- [on hold] committed')
    expect(text).toContain('`⏸️ drained · 🅿️ <n> queries parked`')
    expect(text).toContain('items are only `[parked]` and `[release]`')
    for (const lines of banners(text)) {
      for (const item of lines.filter((line) => line.startsWith('- ['))) expect(item).not.toMatch(/push/i)
      if (!lines[0]?.startsWith('### ⏸️')) continue
      expect(lines[2]).not.toContain('with you')
      expect(lines.some((line) => /^- \[(with you|running|queued|on hold)\]/.test(line))).toBe(false)
    }
  }
  expect(standard).toContain('**Push state stays out of reports.**')
  expect(standard).toContain('**A hold lists nothing waiting.**')
  expect(standard).toContain('PUSH-NOT-WITH-YOU')
  expect(standard).toContain('HOLD-CLEAN')
  expect(standard).toContain('A hold report keeps nothing about pushes beyond a failure.')
  for (const text of [standard, outputStyle]) {
    expect(text).toContain('own unit could not be published because its push failed')
    expect(text).not.toMatch(/names? the other sessions' stacked commits once|show them only as `\[unpushed\]`/)
  }
})

test('the output style carries the report heading and the live banners byte-identical to the standard', () => {
  const styledHeadings = headings(outputStyle)
  expect(styledHeadings).toHaveLength(1)
  expect(styledHeadings[0]?.join('\n')).toBe(HEADING_EXAMPLE)
  const styled = banners(outputStyle)
  expect(styled).toEqual(banners(standard).slice(0, 3))
})

test('every banner closes with its work identity and never emits a send or resume prompt', () => {
  for (const text of [standard, outputStyle]) {
    for (const lines of banners(text)) expect(lines.at(-1)).toBe(PROJECT_THREAD_LINE)
    expect(text).toContain('`🧵 Coordination thread · <label> (<id>)` for Project work')
    expect(text).toContain('`🧵 State of play thread · <label> (<id>)` for territory work')
    expect(text).not.toMatch(/^(?:Send|Resume) <label>/m)
    expect(text).not.toContain('To bring this work back and continue it, paste this:')
    expect(text).not.toContain('{{send-line}}')
    expect(text).not.toContain('{{hold-send-line}}')
    expect(text).toContain('**⏸️ On hold · Hold report at <local time> · mark <local time>**')
  }
  expect(PROJECT_THREAD_LINE).toMatch(THREAD_LINE)
  expect(TERRITORY_THREAD_LINE).toMatch(THREAD_LINE)
  for (const invalid of [
    '🧵 State of play thread · Ways of working (ki.ways-of-working)',
    '🧵 Coordination thread · KI > SoP (ki)',
    '🧵 Coordination thread · Regular work (ki.regular)',
    '🧵 Coordination thread · Missing id'
  ])
    expect(invalid).not.toMatch(THREAD_LINE)
  for (const surface of generate(harnessRoot)) {
    expect(surface.content).not.toMatch(/^(?:Send|Resume) <label>/m)
    if (surface.path.includes('ki-delegation/assets/')) {
      expect(surface.content).toContain('🧵 Coordination thread · <label> (<id>)')
      expect(surface.content).toContain('🧵 State of play thread · <label> (<id>)')
      expect(surface.content).toContain('using the work you report to')
    }
  }
  expect(standard).toContain('### Putting work on hold')
  expect(standard).toContain('### Picking work up')
  expect(standard).toContain('### Pushing beneath other sessions')
})

test('the standard and the output style retire the reply block and the block-letter frames', () => {
  for (const text of [standard, outputStyle]) {
    expect(text).toContain('REPLY-BLOCK')
    expect(withoutSources(text)).not.toMatch(/^╭─/m)
    expect(text).not.toContain('- [at rest]')
  }
  expect(standard).toContain('### Answers')
  expect(standard).toContain('Taken as: <the instruction it will act on>')
})

test('a coordinator reply that moves the mark, changes the state or answers where the work stands ends with the banner', () => {
  expect(standard).toContain('**When it appears.**')
  for (const text of [standard, outputStyle]) {
    expect(text).toContain(
      "moves the mark, changes the work's state or answers where the work stands ends with the banner"
    )
    expect(text).toContain('a plain answer that does none of these needs none')
  }
})

test('the hook line points at the standard and carries only its five hard rules', () => {
  const line = /^line='(.*)'$/m.exec(hook)?.[1] ?? ''
  expect(line).toContain(
    'Follow the coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md) and the Work Process note it cites'
  )
  expect(line).toContain(
    'Hard rules: 1) delegate every unit of work to a detached background agent and stay responsive'
  )
  expect(line).toContain(
    '2) an owner message never pre-empts work in flight: stop an agent only when the owner names it and says stop'
  )
  expect(line).toContain(
    '3) while work lies with a worker, give timed one-to-two-line updates and keep a background check armed that wakes you at least every 5 minutes, and no heartbeat otherwise'
  )
  expect(line).toContain(
    '4) give every Summary, recap, full summary, re-bootstrap and hold report in the owner-report shape, heading and form line to glyph banner'
  )
  expect(line).toContain('with no reply block')
  expect(line).toContain('a re-bootstrap report and a full summary restating every open query in full')
  expect(line).toContain(
    'end any other reply that moves the mark, changes the state or answers where the work stands with the banner'
  )
  expect(line).toContain(
    'every medium- or low-confidence query, and any high-confidence destructive, deletion or publication one, goes to one blind review before it reaches the owner'
  )
  expect(line).toContain(
    '5) commit your own work by explicit path at every send, and act on each messages.md line, IMPORTANT first, then in queue order'
  )
  expect(line).not.toContain('6)')
  // The shape itself lives in the standard and the output style; the line does not restate it.
  expect(line).not.toContain('Hold report at')
  expect(line).not.toContain('checkpoint')
  expect(line.length).toBeLessThan(1500)
})

test('the run-report and footer-report sources carry the quiet-tools rule and no reply block', () => {
  expect(standard).toContain('### Quiet tools')
  const quiet = 'run Git with `-q`, never paste gate, audit or Git output, and report each outcome in one line.'
  for (const surface of generate(harnessRoot).filter(({ path }) => path.includes('ki-delegation/assets/'))) {
    expect(surface.content).toContain(quiet)
    expect(surface.content).toContain('🤖 → 👤 Handoff to supervisor · Run report at')
    expect(surface.content).toContain('no reply block')
  }
})

test('the hook line, the pointer and the output style confine the coordinator forms to coordinating work', () => {
  expect(hook).toContain("line='In coordinating work only,")
  expect(hook).toContain('elsewhere ignore this line and use the ki-coordination Reply forms')
  expect(hook).toContain('In a conversational session, re-read your work package if you have one')
  expect(outputStyle).toContain('This style applies only while a session coordinates work')
  expect(standard).toContain('## Reply forms')
})

test('every generated surface matches what the standard renders, so none is edited by hand', () => {
  const surfaces = generate(harnessRoot)
  for (const tier of ['none', 'push', 'prune', 'release']) {
    const footer = surfaces.find((surface) => surface.path.endsWith(`rules-${tier}.md`))
    expect(footer).toBeDefined()
    expect(footer?.content).toContain('Owner reports, run reports and banners omit routine push state')
    expect(footer?.content).toContain('own unit could not be published because its push failed')
  }
  const prompt = surfaces.find((surface) => surface.path.endsWith('run-prompt.md'))
  expect(prompt?.content).toContain('Owner reports, run reports and banners omit routine push state')
  expect(prompt?.content).toContain('own unit could not be published because its push failed')
  for (const surface of surfaces)
    expect({
      path: surface.path,
      content: readFileSync(resolve(harnessRoot, surface.path), 'utf8')
    }).toEqual({
      path: surface.path,
      content: surface.content
    })
})

test('active banner guidance carries behind findings and all level-check triggers', () => {
  const orderedBanner = standard.split('**Glyph banner.**')[1]?.split('\n')[0] ?? ''
  expect(orderedBanner).toContain('`- [behind] <repository>: <count> commits`')
  expect(orderedBanner.indexOf('[behind]')).toBeGreaterThan(orderedBanner.indexOf('[unlogged]'))
  expect(outputStyle).toContain('`[behind]` naming no holder')
  expect(outputStyle).toContain('before a cross-host resume, at every mark and before leaving a host')
  expect(outputStyle).toContain('A failed check remains unknown')
})
