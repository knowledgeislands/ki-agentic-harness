import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const script = resolve(import.meta.dir, 'coordinator-footer.sh')
const root = mkdtempSync(join(tmpdir(), 'ki-coordinator-footer-'))
// A coordinating checkout with a roadmap, one without, and an ordinary directory.
const coordinating = join(root, 'harness')
const roadless = join(root, 'capital')
const ordinary = join(root, 'ordinary')
for (const checkout of [coordinating, roadless]) {
  mkdirSync(join(checkout, '+', '_WORK', 'ki.prj.demo'), { recursive: true })
  writeFileSync(join(checkout, '.ki.toml'), '[skills.ki-repo]\n\n[skills.ki-coordination]\n')
  spawnSync('git', ['init', '--quiet'], { cwd: checkout })
}
mkdirSync(join(coordinating, 'docs', 'roadmap'), { recursive: true })
mkdirSync(ordinary, { recursive: true })

process.on('exit', () => rmSync(root, { recursive: true, force: true }))

const art = [
  '```text',
  '  /==================================================================================\\',
  ' /                                 KNOWLEDGE  ISLANDS                                 \\',
  '|======================================================================================|',
  '```'
].join('\n')
const heading = '### 🤖 → 👤 Handoff to supervisor · since 21:10 GMT'
const counts = '👤 1 with you'
const roadmap = '🗺️ roadmap · 6 records · 3 open · 2 done awaiting prune · 1 idea'
const pkg = '📦 package · inbox 0 · outbox 1 · held 0 · awaiting ACK 1'
const items = '- [with you] FOOTER-HOOK · owner · since 21:10\n- [awaiting ACK] MSG-1 · to ki.reg.guilds · since 20:35'
const thread = '🧵 ki.prj.demo'
const summaryBody = [
  '# [Demo](/tmp/demo.md)',
  '',
  '**🤖 → 👤 Handoff to supervisor · Summary at 21:10 GMT · since 20:00 GMT**',
  '',
  '---',
  '',
  '## Summary since 20:00 GMT',
  '',
  '**The hook landed.**',
  '',
  '## Status',
  '',
  '## Queries',
  '',
  'None.'
].join('\n')
const summary = (...footer: string[]): string => [summaryBody, ...footer].join('\n\n')
const fullSummary = summary(art, heading, counts, roadmap, pkg, items, thread)
const rebootstrap = (...banner: string[]): string =>
  ['# [Demo](/tmp/demo.md)', '', '**👤 With supervisor · Re-bootstrap at 21:10 GMT · last mark 20:00 GMT**', '', '---', '', '## Done', '', 'Coordinator for ki.prj.demo.', ...banner].join('\n\n')
const shortBanner = [heading, counts, items, thread].join('\n\n')

interface Turn {
  readonly owner?: string | readonly unknown[]
  readonly meta?: boolean
  readonly reply?: string
}

let transcripts = 0
const transcript = (turns: readonly Turn[]): string => {
  const path = join(root, `t-${++transcripts}.jsonl`)
  const lines: string[] = []
  for (const turn of turns) {
    if (turn.owner !== undefined)
      lines.push(JSON.stringify({ type: 'user', ...(turn.meta ? { isMeta: true } : {}), message: { role: 'user', content: turn.owner } }))
    if (turn.reply !== undefined) {
      lines.push(JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', name: 'Bash', input: {} }] } }))
      lines.push(JSON.stringify({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', content: 'mark' }] } }))
      lines.push(JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: turn.reply }] } }))
    }
  }
  // A partly written last line must not stop the reader.
  writeFileSync(path, `${lines.join('\n')}\n{"type":"user","message":`)
  return path
}

// An earlier banner-closing reply makes the session a coordinating one.
const coordinated = (owner: Turn['owner'], meta = false): string =>
  transcript([{ owner: 'Open ki.prj.demo', reply: rebootstrap(shortBanner) }, { owner, meta }])

const stop = (reply: string | undefined, path: string, cwd = coordinating, extra: Record<string, unknown> = {}): string =>
  JSON.stringify({
    session_id: 'abc123',
    transcript_path: path,
    cwd,
    permission_mode: 'default',
    hook_event_name: 'Stop',
    stop_hook_active: false,
    ...(reply === undefined ? {} : { last_assistant_message: reply }),
    ...extra
  })

interface Outcome {
  readonly status: number | null
  readonly stdout: string
  readonly reason?: string
}

const run = (input: string, extraEnv: Record<string, string> = {}, shell = 'bash'): Outcome => {
  const env: Record<string, string> = { ...(process.env as Record<string, string>) }
  delete env.KI_AGENT_RUN
  delete env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS
  Object.assign(env, extraEnv)
  const result = spawnSync(shell, [script], { input, encoding: 'utf8', env, cwd: ordinary })
  const stdout = result.stdout ?? ''
  if (stdout.trim() === '') return { status: result.status, stdout }
  const parsed = JSON.parse(stdout) as { decision: string; reason: string }
  expect(parsed.decision).toBe('block')
  return { status: result.status, stdout, reason: parsed.reason }
}

const silent = { status: 0, stdout: '' }
const plain = transcript([{ owner: 'summary' }])

test('the hook ships executable', () => {
  expect(statSync(script).mode & 0o111).toBe(0o111)
})

test('a Summary with its whole footer passes', () => {
  expect(run(stop(fullSummary, plain))).toEqual(silent)
})

// Kris, under REPORT-FORMS-TIDY on 6 November 2026, asked to mark and get the status table without the history: the
// Status is the Summary without `## Summary since`, and takes the same long footer.
test('a Status takes the long footer, as a Summary does', () => {
  const status = (...footer: string[]): string =>
    [
      summaryBody
        .replace('Summary at 21:10 GMT · since 20:00 GMT', 'Status at 21:10 GMT · last mark 20:00 GMT')
        .replace('## Summary since 20:00 GMT\n\n**The hook landed.**\n\n', ''),
      ...footer
    ].join('\n\n')
  expect(run(stop(status(art, heading, counts, roadmap, pkg, items, thread), plain))).toEqual(silent)
  expect(run(stop(status(heading, counts, roadmap, pkg, items, thread), plain)).reason).toStartWith(
    "This Summary's footer lacks the Knowledge Islands art above the banner, "
  )
})

test('a Summary without the art is held back, naming it', () => {
  const outcome = run(stop(summary(heading, counts, roadmap, pkg, items, thread), plain))
  expect(outcome.status).toBe(0)
  expect(outcome.reason).toStartWith("This Summary's footer lacks the Knowledge Islands art above the banner, ")
  expect(outcome.reason).toContain('Give the reply again in full')
})

test('art drawn below the banner heading does not count', () => {
  expect(run(stop(summary(heading, counts, roadmap, pkg, art, items, thread), plain)).reason).toContain('the Knowledge Islands art')
})

test('no art, asked for plainly or through the command, leaves the art out', () => {
  const footer = summary(heading, counts, roadmap, pkg, items, thread)
  expect(run(stop(footer, transcript([{ owner: 'mark no art' }])))).toEqual(silent)
  const command = '<command-name>/ki-coordination</command-name>\n<command-args>summary since 14:00 no art</command-args>'
  expect(run(stop(footer, transcript([{ owner: [{ type: 'text', text: command }] }])))).toEqual(silent)
})

test('an unreadable transcript leaves the art unasked but still checks the rest', () => {
  expect(run(stop(summary(heading, counts, roadmap, pkg, items, thread), join(root, 'gone.jsonl')))).toEqual(silent)
  expect(run(stop(summary(heading, counts, roadmap, items, thread), join(root, 'gone.jsonl'))).reason).toContain('the 📦 package line')
})

test('a Summary without its roadmap and package lines is held back, naming both', () => {
  const outcome = run(stop(summary(art, heading, counts, items, thread), plain))
  expect(outcome.reason).toStartWith("This Summary's footer lacks the 🗺️ roadmap line and the 📦 package line, ")
})

test('a repository without a roadmap needs no roadmap line', () => {
  expect(run(stop(summary(art, heading, counts, pkg, items, thread), plain, roadless))).toEqual(silent)
  expect(run(stop(summary(art, heading, counts, items, thread), plain, roadless)).reason).toStartWith("This Summary's footer lacks the 📦 package line, ")
})

test('footer lines above the banner heading do not count', () => {
  expect(run(stop(summary(art, roadmap, pkg, heading, counts, items, thread), plain)).reason).toContain('the 🗺️ roadmap line and the 📦 package line')
})

test('a Summary whose banner is missing names every part', () => {
  const outcome = run(stop(summaryBody, plain))
  expect(outcome.reason).toStartWith(
    "This Summary's footer lacks the Knowledge Islands art above the banner, the ### state heading of the banner, the counts line beneath the state heading, the 🗺️ roadmap line, the 📦 package line and the 🧵 <work-id> thread line, last, "
  )
})

test('the thread line must close the reply', () => {
  expect(run(stop(`${fullSummary}\n\nAnything else?`, plain)).reason).toStartWith("This Summary's footer lacks the 🧵 thread line as the very last line, ")
  expect(run(stop(`${fullSummary}\n\n`, plain))).toEqual(silent)
})

test('a list straight after the heading is no counts line', () => {
  expect(run(stop(summary(art, heading, items, roadmap, pkg, thread), plain)).reason).toContain('the counts line beneath the state heading')
})

test('a re-bootstrap report needs the short banner only', () => {
  expect(run(stop(rebootstrap(shortBanner), plain))).toEqual(silent)
  const outcome = run(stop(rebootstrap(), plain))
  expect(outcome.reason).toStartWith(
    "This reply's banner lacks the ### state heading of the banner, the counts line beneath the state heading and the 🧵 <work-id> thread line, last, "
  )
})

test('a hold report and a Finished banner pass in their own shapes', () => {
  const hold = [
    '**⏸️ On hold · Hold report at 21:10 GMT · mark 21:10 GMT**',
    '## Done',
    '### ⏸️ On hold · paused until Monday · since 21:10 GMT',
    '⏸️ drained · 🅿️ 2 queries parked',
    '- [parked] 2 queries in `discussions.md`',
    thread
  ].join('\n\n')
  expect(run(stop(hold, plain))).toEqual(silent)
  // A Finished banner carries no counts line.
  expect(run(stop(['### 🏁 Finished · Demo closed at 18:00 GMT', '- [finished] 3 work items accepted', thread].join('\n\n'), plain))).toEqual(silent)
  expect(run(stop(hold.replace('⏸️ drained · 🅿️ 2 queries parked\n\n', ''), plain)).reason).toContain('the counts line')
})

test('a reply that opens a banner but leaves it unfinished is held back', () => {
  expect(run(stop(`Launched the run.\n\n${heading}\n\n${counts}`, plain)).reason).toStartWith("This reply's banner lacks the 🧵 <work-id> thread line, last, ")
  expect(run(stop(`Launched the run.\n\n${thread}`, plain)).reason).toContain('the ### state heading')
})

test("an owner's mark or state word in a coordinating session needs the banner", () => {
  for (const word of ['mark', 'Mark.', 'mark only', 'mark, status only', 'pause', 'done for now', 'with me', 'status', 'summary since 14:00']) {
    const outcome = run(stop('Mark struck at 21:10.', coordinated(word)))
    expect(outcome.reason).toStartWith("This reply's banner lacks the ### state heading of the banner, ")
  }
  const command = '<command-name>/ki-coordination</command-name>\n<command-args>drain</command-args>'
  expect(run(stop('Draining.', coordinated(command))).reason).toContain('the counts line')
  expect(run(stop(`Mark struck.\n\n${shortBanner}`, coordinated('mark')))).toEqual(silent)
  // A subdirectory of the coordinating checkout counts.
  expect(run(stop('Mark noted.', coordinated('mark'), join(coordinating, '+', '_WORK'))).reason).toContain('the ### state heading')
})

test('the same words are quiet in a conversational session, an ordinary checkout or a launched agent', () => {
  expect(run(stop('Mark noted.', transcript([{ owner: 'mark' }])))).toEqual(silent)
  expect(run(stop('Mark noted.', coordinated('mark'), ordinary))).toEqual(silent)
  expect(run(stop('Mark noted.', coordinated('mark')), { KI_AGENT_RUN: 'footer-hook' })).toEqual(silent)
})

test('a plain answer, a wake and a meta line in a coordinating session stay quiet', () => {
  expect(run(stop('The run is still going.', coordinated('how is the run doing?')))).toEqual(silent)
  expect(run(stop('21:10 GMT - footer-hook finished.', coordinated('<task-notification>\n<task-id>b1</task-id>\nmark</task-notification>')))).toEqual(silent)
  const metaLast = transcript([{ owner: 'Open ki.prj.demo', reply: rebootstrap(shortBanner) }, { owner: 'what next?' }, { owner: 'mark', meta: true }])
  expect(run(stop('Next is the review.', metaLast))).toEqual(silent)
})

test('a banner quoted in a code fence is not a footer', () => {
  const quoted = ['The banner looks like this:', '```markdown', '## Summary since 20:00 GMT', heading, thread, '```', 'Shall I adopt it?'].join('\n\n')
  expect(run(stop(quoted, plain))).toEqual(silent)
})

test('a launched agent never checks, under either signal', () => {
  const bare = stop(summaryBody, plain)
  expect(run(bare, { KI_AGENT_RUN: 'footer-hook' })).toEqual(silent)
  expect(run(bare, { CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: '0' })).toEqual(silent)
})

test('a session already continuing from a Stop hook is never held back again', () => {
  expect(run(stop(summaryBody, plain, coordinating, { stop_hook_active: true }))).toEqual(silent)
  expect(run(stop('Mark struck.', coordinated('mark'), coordinating, { stop_hook_active: true }))).toEqual(silent)
})

test('without the reply text the hook reads the last reply from the transcript', () => {
  const path = transcript([{ owner: 'summary', reply: summary(art, heading, counts, items, thread) }])
  expect(run(stop(undefined, path)).reason).toContain('the 🗺️ roadmap line and the 📦 package line')
  expect(run(stop(undefined, transcript([{ owner: 'summary', reply: fullSummary }])))).toEqual(silent)
  expect(run(stop(undefined, join(root, 'gone.jsonl')))).toEqual(silent)
  expect(run(stop('', plain))).toEqual(silent)
})

test.each([
  '',
  '{not json',
  'null',
  '[]',
  '42',
  '"text"',
  '{"hook_event_name":"UserPromptSubmit","prompt":"mark"}',
  '{"hook_event_name":"SubagentStop","last_assistant_message":"## Summary since 20:00 GMT"}',
  '{"hook_event_name":"Stop","last_assistant_message":{}}',
  '{"hook_event_name":"Stop","stop_hook_active":"yes","last_assistant_message":"## Summary since 20:00 GMT"}'
])('unusable or foreign input %s fails open', (input) => {
  expect(run(input)).toEqual(silent)
})

test('a missing jq fails open', () => {
  expect(run(stop(summaryBody, plain), { PATH: '/nonexistent' }, '/bin/bash')).toEqual(silent)
})

test('the system Bash runs the same checks', () => {
  expect(run(stop(fullSummary, plain), {}, '/bin/bash')).toEqual(silent)
  expect(run(stop('Mark struck.', coordinated('mark')), {}, '/bin/bash').reason).toContain('the counts line')
})
