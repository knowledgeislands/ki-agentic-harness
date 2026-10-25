import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { markedBlock } from '../skills/change-management/ki-coordination/scripts/generate/index.ts'

const script = resolve(import.meta.dir, 'coordinator-reminder.sh')
const line = markedBlock(
  readFileSync(resolve(import.meta.dir, '../skills/change-management/ki-coordination/references/standards-coordination.md'), 'utf8'),
  'source',
  'hook-line'
).body
const pointer =
  'Context was compacted. While coordinating work, before replying, follow "Re-anchoring after compaction" in the ki-coordination coordinating-work standard (skills/change-management/ki-coordination/references/standards-coordination.md): re-read the standard, the harness output style output-styles/ki-coordinator.md from disk and all five files of your work package in full, and follow the style file wherever it differs from the loaded style; run ki agent status and read its messages.md queue, IMPORTANT lines first, then confirm in one line and answer in owner-report form with the report heading and the glyph banner and its closing thread line, with no send or resume line. Re-anchoring moves no mark. In a conversational session, re-read your work package if you have one and carry on with a conversational reply.'

const root = mkdtempSync(join(tmpdir(), 'ki-coordinator-reminder-'))
const coordinating = join(root, 'capital')
const undeclared = join(root, 'undeclared')
const ordinary = join(root, 'ordinary')
mkdirSync(join(coordinating, '+', '_CHECKPOINTS'), { recursive: true })
mkdirSync(join(coordinating, 'Streams', 'Projects'), { recursive: true })
writeFileSync(join(coordinating, '.ki.toml'), '[skills.ki-repo]\nrepository = "capital"\n\n[skills.ki-delegation]\n\n[skills.ki-coordination]\n\n[skills.ki-work-package]\n')
spawnSync('git', ['init', '--quiet'], { cwd: coordinating })
// Checkpoints without the declaration: the signal is the `[skills.ki-coordination]` table, not `+/_CHECKPOINTS/`.
mkdirSync(join(undeclared, '+', '_CHECKPOINTS'), { recursive: true })
writeFileSync(join(undeclared, '.ki.toml'), '[skills.ki-repo]\nrepository = "undeclared"\n\n[skills.ki-work-package]\n')
spawnSync('git', ['init', '--quiet'], { cwd: undeclared })
mkdirSync(ordinary, { recursive: true })

process.on('exit', () => rmSync(root, { recursive: true, force: true }))

interface Outcome {
  readonly status: number | null
  readonly stdout: string
  readonly context?: string
  readonly event?: string
}

const run = (input: string, extraEnv: Record<string, string> = {}, hook = script): Outcome => {
  const env: Record<string, string> = { ...(process.env as Record<string, string>), ...extraEnv }
  delete env.KI_AGENT_RUN
  delete env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS
  // The suite may itself run inside Claude Code; the runtime split is driven per test.
  delete env.CLAUDECODE
  Object.assign(env, extraEnv)
  const result = spawnSync('bash', [hook], { input, encoding: 'utf8', env, cwd: ordinary })
  const stdout = result.stdout ?? ''
  if (stdout.trim() === '') return { status: result.status, stdout }
  const parsed = JSON.parse(stdout) as { hookSpecificOutput: { hookEventName: string; additionalContext: string } }
  return {
    status: result.status,
    stdout,
    context: parsed.hookSpecificOutput.additionalContext,
    event: parsed.hookSpecificOutput.hookEventName
  }
}

const claudePrompt = (cwd: string, prompt = 'Where are we?'): string =>
  JSON.stringify({
    session_id: 'abc123',
    transcript_path: join(root, 'transcript.jsonl'),
    cwd,
    permission_mode: 'default',
    hook_event_name: 'UserPromptSubmit',
    prompt
  })

const codexPrompt = (cwd: string): string =>
  JSON.stringify({
    session_id: 'thread-1',
    transcript_path: join(root, 'rollout.jsonl'),
    cwd,
    hook_event_name: 'UserPromptSubmit',
    model: 'gpt-6.1-sol',
    permission_mode: 'default',
    prompt: 'Status?'
  })

const sessionStart = (cwd: string, source: string): string =>
  JSON.stringify({ session_id: 'abc123', transcript_path: join(root, 't.jsonl'), cwd, hook_event_name: 'SessionStart', source })

test('a Claude Code owner message in coordinating work gets the one line', () => {
  const outcome = run(claudePrompt(coordinating))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('UserPromptSubmit')
  expect(outcome.context).toBe(line)
})

test('a Codex owner message in coordinating work gets the same line', () => {
  const outcome = run(codexPrompt(coordinating))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('UserPromptSubmit')
  expect(outcome.context).toBe(line)
})

test('a subdirectory of a coordinating checkout still counts', () => {
  const outcome = run(claudePrompt(join(coordinating, 'Streams', 'Projects')))
  expect(outcome.status).toBe(0)
  expect(outcome.context).toBe(line)
})

test('a checkout holding checkpoints but not declaring ki-coordination gets nothing', () => {
  const outcome = run(claudePrompt(undeclared))
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
  expect(run(claudePrompt(join(undeclared, '+', '_CHECKPOINTS'))).stdout).toBe('')
})

test('an ordinary interactive session gets nothing', () => {
  const outcome = run(claudePrompt(ordinary))
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('a background child carrying the run marker gets nothing under either runtime', () => {
  const outcome = run(claudePrompt(coordinating), { KI_AGENT_RUN: 'ways-of-working', CLAUDECODE: '1' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
  expect(run(codexPrompt(coordinating), { KI_AGENT_RUN: 'ways-of-working' })).toEqual({ status: 0, stdout: '' })
  expect(run(sessionStart(coordinating, 'compact'), { KI_AGENT_RUN: 'ways-of-working', CLAUDECODE: '1' })).toEqual({ status: 0, stdout: '' })
})

test('a Claude child from an older launcher is recognised by its print-mode ceiling', () => {
  const outcome = run(claudePrompt(coordinating), { CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: '0' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('the post-compaction session start injects the re-anchoring pointer', () => {
  const outcome = run(sessionStart(coordinating, 'compact'), { CLAUDECODE: '1' })
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('SessionStart')
  expect(outcome.context).toBe(pointer)
  expect(run(sessionStart(coordinating, 'compact')).context).toBe(pointer)
})

test('other session starts and other events stay silent', () => {
  expect(run(sessionStart(coordinating, 'startup')).stdout).toBe('')
  expect(run(sessionStart(coordinating, 'resume')).stdout).toBe('')
  const other = JSON.stringify({ hook_event_name: 'PreToolUse', cwd: coordinating, tool_name: 'Bash' })
  expect(run(other).stdout).toBe('')
})

test('malformed, empty or cwd-less input fails open without blocking', () => {
  expect(run('{not json')).toEqual({ status: 0, stdout: '' })
  expect(run('')).toEqual({ status: 0, stdout: '' })
  const missingCwd = JSON.stringify({ hook_event_name: 'UserPromptSubmit', cwd: join(root, 'gone') })
  expect(run(missingCwd)).toEqual({ status: 0, stdout: '' })
})

test.each([
  'skills/change-management/ki-coordination/method.md',
  'skills/governance/ki-work-package/method.md',
  'skills/governance/ki-delegation/method.md',
  'output-styles/ki-coordinator.md'
])('method warnings track %s independently of unrelated harness changes', (methodPath) => {
  const suffix = methodPath.replaceAll('/', '-')
  const harness = join(root, `method-harness-${suffix}`)
  const hook = join(harness, 'hooks/coordinator-reminder.sh')
  mkdirSync(join(harness, 'hooks'), { recursive: true })
  mkdirSync(join(harness, dirname(methodPath)), { recursive: true })
  copyFileSync(script, hook)
  const git = (...args: string[]): string => {
    const result = spawnSync('git', args, { cwd: harness, encoding: 'utf8' })
    expect(result.status).toBe(0)
    return result.stdout.trim()
  }
  git('init', '--quiet')
  const commit = (path: string, content: string): string => {
    writeFileSync(join(harness, path), content)
    git('add', '--', path)
    git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'test: fixture')
    return git('rev-parse', '--short', 'HEAD')
  }
  const old = commit(methodPath, 'old\n')
  const current = commit(methodPath, 'current\n')
  const unrelated = commit('unrelated.md', 'unrelated\n')
  const checkout = join(root, `method-capital-${suffix}`)
  mkdirSync(checkout)
  writeFileSync(join(checkout, '.ki.toml'), '[skills.ki-coordination]\n')
  const packageState = (id: string, level: string, state: string, revision: string): void => {
    const folder = join(checkout, '+/_WORK', id)
    mkdirSync(folder, { recursive: true })
    writeFileSync(join(folder, 'work.md'), `---\nlevel: ${level}\n---\n`)
    writeFileSync(join(folder, 'state.md'), `---\nstate: ${state}\nmethod_read: ${revision}\n---\n`)
  }
  packageState('ki.stale', 'project', 'with-worker', old)
  packageState('ki', 'territory', 'with-supervisor', old)
  packageState('ki.current', 'project', 'with-worker', `"${current}" # checked`)
  packageState('ki.held', 'project', 'on-hold', old)
  packageState('ki.finished', 'project', 'finished', old)
  packageState('ki.regular', 'regular', 'with-worker', old)
  packageState('ki.unreadable', 'project', 'with-worker', 'not-a-revision')
  symlinkSync(join(checkout, '+/_WORK/ki.stale'), join(checkout, '+/_WORK/ki.link'))
  const outcome = run(claudePrompt(checkout), {}, hook)
  expect(outcome.status).toBe(0)
  expect(outcome.context?.split('\n')[0]).toBe(line)
  expect(outcome.context?.split('\n').slice(1).sort()).toEqual([
    `METHOD-NUDGE: ki method_read ${old}; current method ${current}. Follow Refreshing this guidance.`,
    `METHOD-NUDGE: ki.stale method_read ${old}; current method ${current}. Follow Refreshing this guidance.`
  ])
  expect(outcome.context).not.toContain(unrelated)
  expect(run(sessionStart(checkout, 'compact'), {}, hook).context).toBe(pointer)
  expect(run(claudePrompt(checkout), { KI_AGENT_RUN: 'run' }, hook).stdout).toBe('')
  rmSync(join(harness, '.git'), { recursive: true })
  expect(run(claudePrompt(checkout), {}, hook).context).toBe(line)
})
