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
const heading = '### 🤖 → 👤 Handoff to supervisor · at 21:10 GMT'
const counts = '🤖 0 running · ⏳ 0 queued · 👤 1 with you · ⛔ 0 blocked · 🅿️ 0 parked'
const roadmap = '🗺️ roadmap · 6 records · 3 open · 2 done awaiting prune · 1 idea'
const pkg = '📦 package · inbox 0 · outbox 1 · held 0 · awaiting ACK 1'
const items = '- [with you] FOOTER-HOOK · owner · at 21:10'
const listening = '🔇 not listening'
const thread = '🧵 ki.prj.demo'
const summaryBody = [
  '# [Demo](/tmp/demo.md)',
  '',
  '**Summary at 21:10 GMT · last mark 20:00 GMT**',
  '',
  '---',
  '',
  '## Summary',
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
const fullSummary = summary(art, heading, counts, roadmap, pkg, items, listening, thread)
const rebootstrap = (...banner: string[]): string =>
  ['# [Demo](/tmp/demo.md)', '', '**Bootstrap at 21:10 GMT · last mark 20:00 GMT**', '', '---', '', '## Done', '', 'Coordinator for ki.prj.demo.', ...banner].join('\n\n')
const shortBanner = [heading, counts, items, listening, thread].join('\n\n')

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
  readonly warning?: string
}

const run = (input: string, extraEnv: Record<string, string> = {}, shell = 'bash'): Outcome => {
  const env: Record<string, string> = { ...(process.env as Record<string, string>) }
  Object.assign(env, extraEnv)
  const result = spawnSync(shell, [script], { input, encoding: 'utf8', env, cwd: ordinary })
  const stdout = result.stdout ?? ''
  if (stdout.trim() === '') return { status: result.status, stdout }
  const parsed = JSON.parse(stdout) as { decision?: string; reason?: string; systemMessage?: string }
  if (parsed.systemMessage !== undefined) {
    // A warning lets the reply through: it never blocks as well.
    expect(parsed.decision).toBeUndefined()
    return { status: result.status, stdout, warning: parsed.systemMessage }
  }
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

// The Status is the Summary without `## Summary`, and takes the same long footer.
test('a Status takes the long footer, as a Summary does', () => {
  const status = (...footer: string[]): string =>
    [
      summaryBody
        .replace('**Summary at', '**Status at')
        .replace('## Summary\n\n**The hook landed.**\n\n', ''),
      ...footer
    ].join('\n\n')
  expect(run(stop(status(art, heading, counts, roadmap, pkg, items, listening, thread), plain))).toEqual(silent)
  expect(run(stop(status(heading, counts, roadmap, pkg, items, listening, thread), plain)).warning).toStartWith(
    "Footer check: this Summary's footer has no Knowledge Islands art above the banner. "
  )
})

// Kris, relayed on 7 November 2026, asked that the hook "allow it but warn against it and feedback on it to make sure
// it's intentional": only a lost banner or thread line holds a reply back.
test('a Summary without the art passes with a warning naming it', () => {
  const outcome = run(stop(summary(heading, counts, roadmap, pkg, items, listening, thread), plain))
  expect(outcome.status).toBe(0)
  expect(outcome.reason).toBeUndefined()
  expect(outcome.warning).toBe(
    "Footer check: this Summary's footer has no Knowledge Islands art above the banner. It was let through; confirm it was intended, since ki-coordination's Banner section sets the usual form."
  )
})

test('art drawn below the banner heading does not count', () => {
  expect(run(stop(summary(heading, counts, roadmap, pkg, art, items, listening, thread), plain)).warning).toContain('no Knowledge Islands art')
})

test('no art, asked for plainly or through the command, leaves the art out', () => {
  const footer = summary(heading, counts, roadmap, pkg, items, listening, thread)
  expect(run(stop(footer, transcript([{ owner: 'mark no art' }])))).toEqual(silent)
  const command = '<command-name>/ki-coordination</command-name>\n<command-args>summary since 14:00 no art</command-args>'
  expect(run(stop(footer, transcript([{ owner: [{ type: 'text', text: command }] }])))).toEqual(silent)
})

test('an unreadable transcript leaves the art unasked but still checks the rest', () => {
  expect(run(stop(summary(heading, counts, roadmap, pkg, items, listening, thread), join(root, 'gone.jsonl')))).toEqual(silent)
  expect(run(stop(summary(heading, counts, roadmap, items, listening, thread), join(root, 'gone.jsonl'))).warning).toContain('has no 📦 package line.')
})

test('a Summary without its roadmap and package lines passes with a warning naming both', () => {
  const outcome = run(stop(summary(art, heading, counts, items, listening, thread), plain))
  expect(outcome.warning).toStartWith("Footer check: this Summary's footer has no 🗺️ roadmap line and no 📦 package line. ")
})

test('a repository without a roadmap still shows the roadmap line, reading none', () => {
  expect(run(stop(summary(art, heading, counts, '🗺️ roadmap · none', pkg, items, listening, thread), plain, roadless))).toEqual(silent)
  expect(run(stop(summary(art, heading, counts, pkg, items, listening, thread), plain, roadless)).warning).toStartWith("Footer check: this Summary's footer has no 🗺️ roadmap line. ")
})

test('footer lines above the banner heading do not count', () => {
  expect(run(stop(summary(art, roadmap, pkg, heading, counts, items, listening, thread), plain)).warning).toContain('no 🗺️ roadmap line and no 📦 package line')
})

test('a Summary whose banner is missing is held back, naming the lost structure and the rest', () => {
  const outcome = run(stop(summaryBody, plain))
  expect(outcome.reason).toBe(
    "This Summary's footer lacks the banner's ### state heading and the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, under ki-coordination's Banner section. Give the reply again in full with them, since the last text is what the owner reads. It also has no Knowledge Islands art above the banner, no 🗺️ roadmap line and no 📦 package line; keep that only where the owner asked for it."
  )
})

test('the thread line must close the reply', () => {
  expect(run(stop(`${fullSummary}\n\nAnything else?`, plain)).reason).toStartWith("This Summary's footer lacks the thread line as the very last line, ")
  expect(run(stop(`${fullSummary}\n\n`, plain))).toEqual(silent)
})

test('a list straight after the heading is no counts line', () => {
  expect(run(stop(summary(art, heading, items, roadmap, pkg, listening, thread), plain)).warning).toContain('no counts line beneath the state heading')
})

test('an odd counts line or an unrecognised state heading passes with a warning', () => {
  expect(run(stop(summary(art, heading, 'Two runs going', roadmap, pkg, items, listening, thread), plain)).warning).toContain(
    'a counts line opening with none of the counts glyphs'
  )
  const unknown = '### 🌙 Resting · at 21:10 GMT'
  expect(run(stop(rebootstrap(unknown, counts, items, listening, thread), plain)).warning).toStartWith(
    "Footer check: this reply's banner has a state heading the table of states does not name. "
  )
})

test('a query or finding heading is no state heading', () => {
  expect(run(stop(rebootstrap('### FOOTER-HOOK - Relax the hook', thread), plain)).reason).toStartWith(
    "This reply's banner lacks the banner's ### state heading, "
  )
})

test('a re-bootstrap report needs the short banner only', () => {
  expect(run(stop(rebootstrap(shortBanner), plain))).toEqual(silent)
  const outcome = run(stop(rebootstrap(), plain))
  expect(outcome.reason).toStartWith(
    "This reply's banner lacks the banner's ### state heading and the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, "
  )
  expect(run(stop(rebootstrap(heading, items, listening, thread), plain)).warning).toContain('no counts line')
})

test('a Stop and a Finished banner pass in their own shapes', () => {
  const hold = [
    '**Stop at 21:10 GMT · mark 21:10 GMT**',
    '## Done',
    '### ⏸️ On hold · paused until Monday · at 21:10 GMT',
    '⏸️ drained · 🅿️ 2 queries parked',
    '- [parked] 2 queries in `discussions.md`',
    listening,
    thread
  ].join('\n\n')
  expect(run(stop(hold, plain))).toEqual(silent)
  // A Finished banner carries no counts line.
  expect(run(stop(['### 🏁 Finished · Demo closed at 18:00 GMT', '- [finished] 3 work items accepted', thread].join('\n\n'), plain))).toEqual(silent)
  expect(run(stop(hold.replace('⏸️ drained · 🅿️ 2 queries parked\n\n', ''), plain)).warning).toContain('no counts line')
  // Snoozing, under SNOOZE, keeps listening, so its counts line waits for a message rather than saying drained.
  const snoozing = [
    '**Stop at 21:10 GMT · mark 21:10 GMT**',
    '## Done',
    '### 💤 Snoozing (on hold) · at 21:10 GMT',
    '💤 waiting for a message · 🅿️ 2 queries parked',
    '- [parked] 2 queries in `discussions.md`\n- [release] a message arrives, or `resume`',
    '👂 listening',
    thread
  ].join('\n\n')
  expect(run(stop(snoozing, plain))).toEqual(silent)
  expect(run(stop(snoozing.replace('### 💤 Snoozing (on hold) · at 21:10 GMT\n\n', ''), plain)).reason).toContain(
    "the banner's ### state heading"
  )
  // A Snoozing banner closing a Status, at the owner's `mark, status only`, passes as any other state does.
  const snoozingStatus = [
    '**Status at 21:10 GMT · last mark 21:10 GMT**',
    '## Status',
    art,
    '### 💤 Snoozing (on hold) · at 21:10 GMT',
    '💤 waiting for a message · 🅿️ 2 queries parked',
    roadmap,
    pkg,
    '- [parked] 2 queries in `discussions.md`',
    '👂 listening',
    thread
  ].join('\n\n')
  expect(run(stop(snoozingStatus, coordinated('mark, status only')))).toEqual(silent)
  expect(run(stop(snoozingStatus, coordinated('status')))).toEqual(silent)
  // A heading written before SNOOZE-HEADING, with `since`, passes too, and so does an earlier form line with its state.
  expect(run(stop(snoozing.replace('· at 21:10 GMT', '· since 21:10 GMT'), plain))).toEqual(silent)
  expect(run(stop(hold.replace('**Stop at', '**⏸️ On hold · Hold report at'), plain))).toEqual(silent)
})

test('a missing listening line passes with a warning, except at Finished', () => {
  expect(run(stop(rebootstrap(heading, counts, items, thread), plain)).warning).toStartWith(
    "Footer check: this reply's banner has no listening line, 👂 listening or 🔇 not listening. "
  )
  expect(run(stop(rebootstrap(heading, counts, items, '👂 listening', thread), plain))).toEqual(silent)
})

test('a reply that opens a banner but leaves it unfinished is held back', () => {
  expect(run(stop(`Launched the run.\n\n${heading}\n\n${counts}`, plain)).reason).toStartWith("This reply's banner lacks the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, ")
  expect(run(stop(`Launched the run.\n\n${thread}`, plain)).reason).toContain("the banner's ### state heading")
})

test("an owner's mark or state word in a coordinating session needs the banner", () => {
  for (const word of ['mark', 'Mark.', 'mark only', 'mark, status only', 'pause', 'done for now', 'snooze', 'with me', 'status', 'summary since 14:00', 'where are we', "what's the state"]) {
    const outcome = run(stop('Mark struck at 21:10.', coordinated(word)))
    expect(outcome.reason).toStartWith("This reply's banner lacks the banner's ### state heading and the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, ")
  }
  const command = '<command-name>/ki-coordination</command-name>\n<command-args>drain</command-args>'
  expect(run(stop('Draining.', coordinated(command))).reason).toContain('the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>')
  expect(run(stop(`Mark struck.\n\n${shortBanner}`, coordinated('mark')))).toEqual(silent)
  // A subdirectory of the coordinating checkout counts.
  expect(run(stop('Mark noted.', coordinated('mark'), join(coordinating, '+', '_WORK'))).reason).toContain('the banner')
})

test('the same words are quiet in a conversational session or an ordinary checkout', () => {
  expect(run(stop('Mark noted.', transcript([{ owner: 'mark' }])))).toEqual(silent)
  expect(run(stop('Mark noted.', coordinated('mark'), ordinary))).toEqual(silent)
})

test('a plain answer, a wake and a meta line in a coordinating session stay quiet', () => {
  expect(run(stop('The run is still going.', coordinated('how is the run doing?')))).toEqual(silent)
  expect(run(stop('21:10 GMT - footer-hook finished.', coordinated('<task-notification>\n<task-id>b1</task-id>\nmark</task-notification>')))).toEqual(silent)
  const metaLast = transcript([{ owner: 'Open ki.prj.demo', reply: rebootstrap(shortBanner) }, { owner: 'what next?' }, { owner: 'mark', meta: true }])
  expect(run(stop('Next is the review.', metaLast))).toEqual(silent)
})

test('a banner quoted in a code fence is not a footer', () => {
  const quoted = ['The banner looks like this:', '```markdown', '## Summary', heading, thread, '```', 'Shall I adopt it?'].join('\n\n')
  expect(run(stop(quoted, plain))).toEqual(silent)
})

test('a session already continuing from a Stop hook is never held back again, only warned', () => {
  const outcome = run(stop(summaryBody, plain, coordinating, { stop_hook_active: true }))
  expect(outcome.reason).toBeUndefined()
  expect(outcome.warning).toStartWith(
    "Footer check: this Summary's footer has a footer without the banner's ### state heading and the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, and no Knowledge Islands art"
  )
  expect(run(stop('Mark struck.', coordinated('mark'), coordinating, { stop_hook_active: true })).warning).toContain("a footer without the banner's")
  expect(run(stop(fullSummary, plain, coordinating, { stop_hook_active: true }))).toEqual(silent)
})

test('without the reply text the hook reads the last reply from the transcript', () => {
  const path = transcript([{ owner: 'summary', reply: summary(art, heading, counts, items, listening, thread) }])
  expect(run(stop(undefined, path)).warning).toContain('no 🗺️ roadmap line and no 📦 package line')
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
  expect(run(stop('Mark struck.', coordinated('mark')), {}, '/bin/bash').reason).toContain('the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>')
  expect(run(stop(summary(heading, counts, roadmap, pkg, items, listening, thread), plain), {}, '/bin/bash').warning).toContain('no Knowledge Islands art')
})

// Kris, 7 November 2026, under STAGE-C-ROLES: the hook "accepts both forms, blocks only a missing banner heading or
// thread line, warns on the unusual". A seat with a role closes `<role glyph> 🔑 <work-id>`; ⭐, 🔧 and 🧵 in the role
// glyph's place pass with a warning under the role migration file.
const keyThread = '⚒️ 🔑 ki.prj.demo'
const keySummary = summary(art, heading, counts, roadmap, pkg, items, listening, keyThread)

test('a key-form Summary and banner pass, in the session name form of the role standard', () => {
  expect(run(stop(keySummary, plain))).toEqual(silent)
  expect(run(stop(rebootstrap(heading, counts, items, listening, '⚖️ 🔑 ki.reg.guilds'), plain))).toEqual(silent)
  expect(run(stop(rebootstrap(heading, counts, items, listening, '🏛️ 🔑 ki.sop.main'), plain))).toEqual(silent)
})

test('a key-form thread line that is not last is held back', () => {
  expect(run(stop(`${keySummary}\n\nAnything else?`, plain)).reason).toStartWith(
    "This Summary's footer lacks the thread line as the very last line, "
  )
})

test('⭐, 🔧 or 🧵 standing as the role glyph passes with a warning', () => {
  for (const line of ['🦉⭐ 🔑 personal.reg.inbox-terra', '🎨🔧 🔑 ki.prj.demo'])
    expect(run(stop(rebootstrap(heading, counts, items, listening, line), plain)).warning).toContain('⭐ or 🔧 beside the role glyph')
  expect(run(stop(rebootstrap(heading, counts, items, listening, '🧵 🔑 ki.prj.demo'), plain)).warning).toContain(
    "🧵 in the role glyph's place"
  )
})

test("an owner's mark word engages after an earlier key-form reply, and a conversational session stays quiet", () => {
  const keyed = transcript([
    { owner: 'Open ki.prj.demo', reply: rebootstrap(heading, counts, items, listening, keyThread) },
    { owner: 'mark' }
  ])
  expect(run(stop('Mark struck.', keyed)).reason).toContain('the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>')
  const conversational = transcript([{ owner: 'What is a 🔑 for?', reply: 'The keyholder mark.' }, { owner: 'mark' }])
  expect(run(stop('Marked.', conversational))).toEqual(silent)
})

// Kris, 14 November 2026, under REPLY-CHECK: in every session, coordinating or not, a reply asking the owner to decide,
// a fenced `text` block holding `<TAG> <letter>` lines, needs the block to open with a `1 · ` group heading and every
// such line to carry `(high)`, `(medium)` or `(low)` after the letter, an optional `: <gloss>` after it.
const replyId = '**Reply 13:27**'
const decision = (...block: string[]): string =>
  [replyId, 'Two things need your word: whether to push now, and whether to keep the old hook.', ['```text', ...block, '```'].join('\n')].join('\n\n')
const shape =
  "under ki-coordination's owner report, a reply block opens with a 1 · <what the group is> heading and each line reads <TAG> <letter> (high), (medium) or (low), an optional : <gloss> after it"
const conversation = transcript([{ owner: 'Should we push?' }])

test('a conversational reply with a well-formed reply block passes, glosses and all', () => {
  const block = decision("1 · Landing, can run while you're away", 'PUSH a (high)', 'HOOK-KEEP b (low): keep the old hook', '', '2 · Later', '04-RULE2 a (medium)')
  expect(run(stop(block, conversation, ordinary))).toEqual(silent)
  expect(run(stop(block, conversation))).toEqual(silent)
  expect(run(stop(block, join(root, 'gone.jsonl'), join(root, 'missing')))).toEqual(silent)
})

test('a reply block without its first group heading is held back in any session', () => {
  const outcome = run(stop(decision('PUSH a (high)'), conversation, ordinary))
  expect(outcome.reason).toBe(
    `This reply's reply block does not open with its first group heading, 1 · <what the group is>; ${shape}. Give the reply again in full with the reply block put right, since the last text is what the owner reads.`
  )
  expect(run(stop(decision('2 · Later', 'PUSH a (high)'), conversation, ordinary)).reason).toContain('does not open with its first group heading')
})

test('a reply block line without its confidence is held back, naming the line', () => {
  expect(run(stop(decision('1 · Now', 'PUSH a'), conversation, ordinary)).reason).toStartWith(
    "This reply's reply block has a line without (high), (medium) or (low) after the letter: PUSH a; "
  )
  const outcome = run(stop(decision('PUSH a', 'HOOK-KEEP b (certain)', 'GLOSS c: no confidence'), conversation, ordinary))
  expect(outcome.reason).toStartWith(
    "This reply's reply block does not open with its first group heading, 1 · <what the group is> and has lines without (high), (medium) or (low) after the letter: PUSH a, HOOK-KEEP b, GLOSS c; "
  )
})

test('text blocks that ask nothing stay quiet', () => {
  for (const reply of [
    ['Here is the art:', art].join('\n\n'),
    ['The log:', '```text', 'hello world', 'A b', 'TODO write the tests', 'M a', '```'].join('\n'),
    ['The shape:', '```text', '1 · <what the group is>', '<TAG> a (high)', '```'].join('\n'),
    ['Quoted inside another fence:', '````markdown', '```text', 'PUSH a', '```', '````'].join('\n'),
    ['A Markdown block:', '```markdown', 'PUSH a', '```'].join('\n'),
    'No block at all: PUSH a.'
  ])
    expect(run(stop(reply, conversation, ordinary))).toEqual(silent)
})

test('a reply block left unclosed at the end of the reply is still read', () => {
  expect(run(stop(`${replyId}\n\n\`\`\`text\n1 · Now\nPUSH a (high)`, conversation, ordinary))).toEqual(silent)
  expect(run(stop(`${replyId}\n\n\`\`\`text\nPUSH a (high)`, conversation, ordinary)).reason).toContain('does not open with its first group heading')
})

test('a reply block is never held back twice in a row, only warned', () => {
  const outcome = run(stop(decision('1 · Now', 'PUSH a'), conversation, ordinary, { stop_hook_active: true }))
  expect(outcome.warning).toBe(
    `Reply block check: this reply's reply block has a line without (high), (medium) or (low) after the letter: PUSH a; ${shape}. It was let through, since the hook never holds a reply back twice in a row.`
  )
})

test("a coordinating reply's reply block and footer are checked together", () => {
  const withBlock = (block: string): string => fullSummary.replace('None.', `### PUSH - Push now\n\n${block}`)
  expect(run(stop(`${replyId}\n\n${withBlock('```text\n1 · Now\nPUSH a (high)\n```')}`, plain))).toEqual(silent)
  expect(run(stop(withBlock('```text\nPUSH a (high)\n```'), plain)).reason).toStartWith(
    "This reply's reply block does not open with its first group heading, 1 · <what the group is>; "
  )
  const both = run(stop(summaryBody.replace('None.', '```text\n1 · Now\nPUSH a\n```'), plain))
  expect(both.reason).toStartWith(
    "This Summary's footer lacks the banner's ### state heading and the thread line, <role glyph> 🔑 <work-id> or 🧵 <work-id>, last, under ki-coordination's Banner section. This reply's reply block has a line without (high), (medium) or (low) after the letter: PUSH a; "
  )
  expect(both.reason).toContain('Give the reply again in full with them, since the last text is what the owner reads. It also has no Knowledge Islands art')
  const warned = run(stop(withBlock('```text\n1 · Now\nPUSH a\n```').replace(`\n\n${art}`, ''), plain))
  expect(warned.reason).toEndWith(
    "Give the reply again in full with the reply block put right, since the last text is what the owner reads. The Summary's footer also has no Knowledge Islands art above the banner; keep that only where the owner asked for it."
  )
})
