#!/usr/bin/env bun
import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const helper = join(dirname(fileURLToPath(import.meta.url)), 'recap-grounding.ts')
const fixture = () => mkdtempSync(join(tmpdir(), 'ki-work-recap-'))
const claudeToolUse = (name: string, input: unknown) =>
  JSON.stringify({ message: { content: [{ type: 'tool_use', name, input }] } })
const claudeToolResult = (text: string) =>
  JSON.stringify({ message: { content: [{ type: 'tool_result', content: text }] } })
const codexMeta = (cwd: string) => JSON.stringify({ type: 'session_meta', payload: { cwd } })
const codexFunction = (name: string, arguments_: unknown) =>
  JSON.stringify({
    type: 'response_item',
    payload: { type: 'function_call', name, arguments: JSON.stringify(arguments_) }
  })
const codexCustom = (name: string, input: unknown) =>
  JSON.stringify({ type: 'response_item', payload: { type: 'custom_tool_call', name, input } })
const codexOutput = (text: string) =>
  JSON.stringify({
    type: 'response_item',
    payload: { type: 'custom_tool_call_output', output: [{ type: 'input_text', text }] }
  })
const evidence = (repo: string, head: string | null, worktree: 'clean' | 'dirty') =>
  JSON.stringify({ 'ki-work-recap-repository-evidence/v1': { repo, head, worktree } })

const physical = (path: string): string => realpathSync(resolve(path))

/**
 * A child environment that cannot reach the real `~/.claude` or `~/.codex`, and does not
 * inherit the invoking runtime's identity. `home` defaults to the transcripts fixture's parent.
 */
const isolatedEnvironment = (home: string, overrides: Record<string, string> = {}): NodeJS.ProcessEnv => {
  const environment: NodeJS.ProcessEnv = { ...process.env, HOME: home }
  for (const name of ['CLAUDECODE', 'CLAUDE_CODE_SESSION_ID', 'CLAUDE_CONFIG_DIR', 'CLAUDE_CODE_PROJECT_DIR_NAME'])
    delete environment[name]
  return { ...environment, ...overrides }
}

type RunOptions = { transcripts?: string | null; home?: string; env?: Record<string, string> }

const runIsolated = (repo: string, args: readonly string[], { transcripts, home, env }: RunOptions) => {
  const root = home ?? dirname(transcripts ?? repo)
  const transcriptArgs = transcripts ? ['--transcripts-dir', transcripts] : []
  const result = spawnSync('bun', [helper, repo, '--json', ...transcriptArgs, ...args], {
    encoding: 'utf8',
    env: isolatedEnvironment(root, env)
  })
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`
  }
}

const run = (repo: string, transcripts: string, args: readonly string[] = []) =>
  runIsolated(repo, args, { transcripts })

const git = (repository: string, args: readonly string[]): string => {
  const result = spawnSync('git', ['-C', repository, ...args], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  return result.stdout.trim()
}

const initialiseRepository = (repository: string): string => {
  mkdirSync(repository, { recursive: true })
  git(repository, ['init', '--quiet'])
  writeFileSync(join(repository, 'evidence.txt'), 'initial\n')
  git(repository, ['add', 'evidence.txt'])
  git(repository, ['-c', 'user.email=test@example.com', '-c', 'user.name=Test', 'commit', '--quiet', '-m', 'initial'])
  return git(repository, ['rev-parse', 'HEAD'])
}

describe('recap grounding runtime selection', () => {
  test('detect chooses the newest eligible Claude or Codex transcript and normalizes Codex calls', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other-repo')
    const transcripts = join(root, 'transcripts')
    const claude = join(transcripts, 'claude.jsonl')
    const codex = join(transcripts, '2026', '07', 'codex.jsonl')
    const irrelevant = join(transcripts, '2026', '07', 'other.jsonl')
    try {
      initialiseRepository(repo)
      initialiseRepository(otherRepo)
      mkdirSync(dirname(codex), { recursive: true })
      writeFileSync(claude, `${claudeToolUse('Read', { file_path: '/x/claude.md' })}\n`)
      writeFileSync(
        codex,
        `${codexMeta(physical(repo))}\nmalformed JSON\n${codexFunction('Bash', { command: 'pwd' })}\n${codexCustom('Read', { file_path: '/x/codex.md' })}\n`
      )
      writeFileSync(
        irrelevant,
        `${codexMeta(physical(otherRepo))}\n${codexFunction('Edit', { file_path: '/x/other.md' })}\n`
      )
      const now = Date.now() / 1000
      utimesSync(claude, now - 20, now - 20)
      utimesSync(codex, now, now)
      utimesSync(irrelevant, now + 20, now + 20)

      const result = run(repo, transcripts)
      const grounded = JSON.parse(result.stdout) as {
        runtime: string
        transcript: string
        toolTally: Record<string, number>
      }
      expect(result.status).toBe(0)
      expect(grounded.runtime).toBe('codex')
      expect(grounded.transcript).toBe(codex)
      expect(grounded.toolTally).toEqual({ Bash: 1, Read: 1 })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('forced runtime selects only that runtime and explicit basename selects only eligible candidates', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    const claude = join(transcripts, 'claude.jsonl')
    const codexOld = join(transcripts, 'sessions', 'codex-old.jsonl')
    const codexNew = join(transcripts, 'sessions', 'codex-new.jsonl')
    try {
      initialiseRepository(repo)
      mkdirSync(dirname(codexOld), { recursive: true })
      writeFileSync(claude, `${claudeToolUse('Read', { file_path: '/x/claude.md' })}\n`)
      writeFileSync(codexOld, `${codexMeta(physical(repo))}\n${codexFunction('Bash', { command: 'old' })}\n`)
      writeFileSync(codexNew, `${codexMeta(physical(repo))}\n${codexFunction('Bash', { command: 'new' })}\n`)
      const now = Date.now() / 1000
      utimesSync(claude, now - 30, now - 30)
      utimesSync(codexOld, now - 20, now - 20)
      utimesSync(codexNew, now, now)

      const forcedClaude = JSON.parse(run(repo, transcripts, ['--runtime', 'claude']).stdout) as {
        runtime: string
        transcript: string
      }
      expect(forcedClaude.runtime).toBe('claude')
      expect(forcedClaude.transcript).toBe(claude)

      const explicitCodex = run(repo, transcripts, ['--runtime', 'codex', '--transcript', 'codex-old.jsonl'])
      const grounded = JSON.parse(explicitCodex.stdout) as { runtime: string; transcript: string }
      expect(explicitCodex.status).toBe(0)
      expect(grounded.runtime).toBe('codex')
      expect(grounded.transcript).toBe(codexOld)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('Codex filtering selects only transcripts whose session metadata names the requested repository', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other-repo')
    const transcripts = join(root, 'transcripts')
    const matching = join(transcripts, 'matching.jsonl')
    const other = join(transcripts, 'other.jsonl')
    try {
      initialiseRepository(repo)
      initialiseRepository(otherRepo)
      mkdirSync(transcripts, { recursive: true })
      writeFileSync(
        matching,
        `${codexMeta(physical(repo))}\n${codexFunction('Read', { file_path: '/x/matching.md' })}\n`
      )
      writeFileSync(
        other,
        `${codexMeta(physical(otherRepo))}\n${codexFunction('Read', { file_path: '/x/other.md' })}\n`
      )
      const result = run(repo, transcripts, ['--runtime', 'codex'])
      const grounded = JSON.parse(result.stdout) as { runtime: string; transcript: string }
      expect(result.status).toBe(0)
      expect(grounded.runtime).toBe('codex')
      expect(grounded.transcript).toBe(matching)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('rejects unsafe or ineligible explicit selectors', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    const valid = join(transcripts, 'valid.jsonl')
    try {
      mkdirSync(repo, { recursive: true })
      mkdirSync(transcripts, { recursive: true })
      writeFileSync(valid, `${claudeToolUse('Read', { file_path: '/x/valid.md' })}\n`)
      mkdirSync(join(transcripts, 'directory.jsonl'))
      symlinkSync(valid, join(transcripts, 'linked.jsonl'))
      for (const selector of ['../valid.jsonl', valid, 'valid.txt', 'missing.jsonl', 'directory.jsonl', 'linked.jsonl'])
        expect(run(repo, transcripts, ['--transcript', selector]).status).not.toBe(0)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('help and no-transcript paths remain successful', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    try {
      mkdirSync(repo, { recursive: true })
      mkdirSync(transcripts, { recursive: true })
      const help = spawnSync('bun', [helper, '--help'], { encoding: 'utf8', env: isolatedEnvironment(root) })
      expect(help.status).toBe(0)
      expect(help.stdout).toContain('--runtime detect|claude|codex')
      const result = run(repo, transcripts)
      const grounded = JSON.parse(result.stdout) as { runtime: null; transcript: null }
      expect(result.status).toBe(0)
      expect(grounded.runtime).toBeNull()
      expect(grounded.transcript).toBeNull()
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('emits and compares an exact Codex repository-evidence marker', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    const codex = join(transcripts, 'codex.jsonl')
    try {
      const baseline = initialiseRepository(repo)
      mkdirSync(transcripts, { recursive: true })
      writeFileSync(codex, [codexMeta(repo), codexOutput(evidence(physical(repo), baseline, 'clean')), ''].join('\n'))

      const unchanged = JSON.parse(run(repo, transcripts, ['--runtime', 'codex']).stdout) as {
        'ki-work-recap-repository-evidence/v1': { repo: string; head: string; worktree: string }
        transcriptEvidence: { status: string; baseline: { head: string } }
      }
      expect(unchanged['ki-work-recap-repository-evidence/v1']).toEqual({
        repo: physical(repo),
        head: baseline,
        worktree: 'clean'
      })
      expect(unchanged.transcriptEvidence).toMatchObject({ status: 'unchanged', baseline: { head: baseline } })

      writeFileSync(join(repo, 'evidence.txt'), 'changed\n')
      git(repo, ['add', 'evidence.txt'])
      git(repo, ['-c', 'user.email=test@example.com', '-c', 'user.name=Test', 'commit', '--quiet', '-m', 'changed'])
      const changed = JSON.parse(run(repo, transcripts, ['--runtime', 'codex']).stdout) as {
        transcriptEvidence: { status: string; commitRange?: string; changedPaths?: string[] }
      }
      expect(changed.transcriptEvidence.status).toBe('changed')
      expect(changed.transcriptEvidence.commitRange).toStartWith(`${baseline}..`)
      expect(changed.transcriptEvidence.changedPaths).toEqual(['evidence.txt'])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('rejects malformed, foreign, and uncertain transcript evidence', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other-repo')
    const transcripts = join(root, 'transcripts')
    const claude = join(transcripts, 'claude.jsonl')
    try {
      const baseline = initialiseRepository(repo)
      mkdirSync(otherRepo, { recursive: true })
      mkdirSync(transcripts, { recursive: true })
      writeFileSync(
        claude,
        [
          claudeToolResult('{not json}'),
          claudeToolResult(evidence(physical(otherRepo), baseline, 'clean')),
          claudeToolResult(evidence(physical(repo), baseline, 'dirty')),
          ''
        ].join('\n')
      )
      writeFileSync(join(repo, 'uncommitted.txt'), 'current dirty state\n')
      const uncertain = JSON.parse(run(repo, transcripts, ['--runtime', 'claude']).stdout) as {
        transcriptEvidence: { status: string; baseline: { head: string; worktree: string } }
      }
      expect(uncertain.transcriptEvidence).toMatchObject({
        status: 'unavailable',
        baseline: { head: baseline, worktree: 'dirty' }
      })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('grounds the physical Git root and separates staged, unstaged, and untracked changes', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const nested = join(repo, 'nested')
    const transcripts = join(root, 'transcripts')
    try {
      initialiseRepository(repo)
      mkdirSync(nested)
      writeFileSync(join(repo, 'evidence.txt'), 'staged\n')
      git(repo, ['add', 'evidence.txt'])
      writeFileSync(join(repo, 'unstaged.txt'), 'unstaged\n')
      writeFileSync(join(repo, 'untracked.txt'), 'untracked\n')
      mkdirSync(transcripts)

      const grounded = JSON.parse(run(nested, transcripts).stdout) as {
        repo: string
        repository: { status: string; root: string }
        stagedFiles: string[]
        unstagedFiles: string[]
        untrackedFiles: string[]
        diffStat: string
      }
      expect(grounded.repo).toBe(physical(repo))
      expect(grounded.repository).toMatchObject({ status: 'available', root: physical(repo) })
      expect(grounded.stagedFiles).toEqual(['evidence.txt'])
      expect(grounded.unstagedFiles).toEqual([])
      expect(grounded.untrackedFiles).toEqual(['unstaged.txt', 'untracked.txt'])
      expect(grounded.diffStat).toContain('evidence.txt')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('reports Git failure as unavailable rather than clean', () => {
    const root = fixture()
    const transcripts = join(root, 'transcripts')
    try {
      mkdirSync(transcripts, { recursive: true })
      const grounded = JSON.parse(run(root, transcripts).stdout) as {
        repository: { status: string; root: null; reason: string }
        filesTouched: string[]
        'ki-work-recap-repository-evidence/v1': null
        transcriptEvidence: { status: string; current: null }
      }
      expect(grounded.repository).toMatchObject({ status: 'unavailable', root: null })
      expect(grounded.filesTouched).toEqual([])
      expect(grounded['ki-work-recap-repository-evidence/v1']).toBeNull()
      expect(grounded.transcriptEvidence).toMatchObject({ status: 'unavailable', current: null })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

type Selected = {
  runtime: string | null
  transcript: string | null
  transcriptSelection: { method: string; reason?: string; examined: number; limitReached: boolean }
  repository: { status: string; root: string | null }
  untrackedFiles: string[]
  toolTally: Record<string, number>
}

const SESSION = '0b7a9c1e-1111-4222-8333-944455556666'

/** Write a Codex rollout below `sessions` with the given mtime offset in seconds. */
const writeCodex = (sessions: string, name: string, cwd: string, offset: number, body = ''): string => {
  const path = join(sessions, '2026', '08', '22', name)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${codexMeta(cwd)}\n${codexFunction('Read', { file_path: `/x/${name}` })}\n${body}`)
  const time = Date.now() / 1000 + offset
  utimesSync(path, time, time)
  return path
}

describe('recap grounding live-session selection', () => {
  test('an identified Claude Code session selects its own transcript, not newer Codex history', () => {
    const root = fixture()
    const repo = join(root, 'target_repo')
    const config = join(root, 'claude-config')
    const live = join(config, 'projects', '-launch-root', `${SESSION}.jsonl`)
    try {
      initialiseRepository(repo)
      writeFileSync(join(repo, 'untracked.txt'), 'untracked\n')
      mkdirSync(dirname(live), { recursive: true })
      writeFileSync(live, `${claudeToolUse('Edit', { file_path: '/x/live.md' })}\n`)
      utimesSync(live, Date.now() / 1000 - 600, Date.now() / 1000 - 600)
      writeCodex(join(root, '.codex', 'sessions'), 'rollout-newer.jsonl', physical(repo), 60)

      const env = { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: SESSION, CLAUDE_CONFIG_DIR: config }
      const result = runIsolated(repo, [], { home: root, env })
      const grounded = JSON.parse(result.stdout) as Selected
      expect(result.status).toBe(0)
      expect(grounded.runtime).toBe('claude')
      expect(grounded.transcript).toBe(live)
      expect(grounded.toolTally).toEqual({ Edit: 1 })
      expect(grounded.transcriptSelection).toEqual({ method: 'live-session', examined: 0, limitReached: false })
      expect(grounded.repository).toMatchObject({ status: 'available', root: physical(repo) })
      expect(grounded.untrackedFiles).toEqual(['untracked.txt'])

      // Without CLAUDE_CONFIG_DIR, the projects root is the (fixture) home's .claude directory.
      const homeLive = join(root, '.claude', 'projects', 'another-launch-root', `${SESSION}.jsonl`)
      mkdirSync(dirname(homeLive), { recursive: true })
      writeFileSync(homeLive, `${claudeToolUse('Read', { file_path: '/x/home.md' })}\n`)
      const fromHome = JSON.parse(
        runIsolated(repo, ['--runtime', 'claude'], {
          home: root,
          env: { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: SESSION }
        }).stdout
      ) as Selected
      expect(fromHome.transcript).toBe(homeLive)
      expect(fromHome.transcriptSelection.method).toBe('live-session')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('declines rather than substitutes when the live transcript is missing, duplicated, or unidentifiable', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const config = join(root, 'claude-config')
    try {
      initialiseRepository(repo)
      writeFileSync(join(repo, 'untracked.txt'), 'untracked\n')
      mkdirSync(join(config, 'projects', '-launch-root'), { recursive: true })
      writeFileSync(join(config, 'projects', '-launch-root', 'other-session.jsonl'), `${claudeToolUse('Read', {})}\n`)
      writeCodex(join(root, '.codex', 'sessions'), 'rollout-target.jsonl', physical(repo), 0)
      const declined = (sessionId: string): Selected =>
        JSON.parse(
          runIsolated(repo, [], {
            home: root,
            env: { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: sessionId, CLAUDE_CONFIG_DIR: config }
          }).stdout
        ) as Selected

      const missing = declined(SESSION)
      expect(missing.runtime).toBeNull()
      expect(missing.transcript).toBeNull()
      expect(missing.toolTally).toEqual({})
      expect(missing.transcriptSelection).toMatchObject({ method: 'none', reason: 'live-session-transcript-not-found' })
      expect(missing.repository.status).toBe('available')
      expect(missing.untrackedFiles).toEqual(['untracked.txt'])

      for (const project of ['-first', '-second']) {
        mkdirSync(join(config, 'projects', project), { recursive: true })
        writeFileSync(join(config, 'projects', project, `${SESSION}.jsonl`), `${claudeToolUse('Read', {})}\n`)
      }
      expect(declined(SESSION).transcriptSelection).toMatchObject({
        method: 'none',
        reason: 'live-session-transcript-ambiguous'
      })
      expect(declined('../escape').transcriptSelection).toMatchObject({
        method: 'none',
        reason: 'live-session-identity-invalid'
      })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('a Claude Code runtime without an identity searches only the target Claude project', () => {
    const root = fixture()
    const repo = join(root, 'my_repo.v2')
    const config = join(root, 'claude-config')
    try {
      initialiseRepository(repo)
      writeCodex(join(root, '.codex', 'sessions'), 'rollout-target.jsonl', physical(repo), 0)
      const env = { CLAUDECODE: '1', CLAUDE_CONFIG_DIR: config }
      const withoutProject = JSON.parse(runIsolated(repo, [], { home: root, env }).stdout) as Selected
      expect(withoutProject.runtime).toBeNull()
      expect(withoutProject.transcriptSelection).toMatchObject({ method: 'none', reason: 'no-eligible-transcript' })

      // The documented slug replaces every non-alphanumeric character, including `_`.
      const project = join(config, 'projects', physical(repo).replace(/[^A-Za-z0-9]/g, '-'))
      mkdirSync(project, { recursive: true })
      writeFileSync(join(project, 'target.jsonl'), `${claudeToolUse('Read', { file_path: '/x/target.md' })}\n`)
      const withProject = JSON.parse(runIsolated(repo, [], { home: root, env }).stdout) as Selected
      expect(withProject.runtime).toBe('claude')
      expect(withProject.transcript).toBe(join(project, 'target.jsonl'))
      expect(withProject.transcriptSelection).toEqual({ method: 'newest-eligible', examined: 1, limitReached: false })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('explicit Codex runtime and transcript selectors bypass the live-session locator', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    try {
      initialiseRepository(repo)
      const codex = writeCodex(transcripts, 'rollout-explicit.jsonl', physical(repo), 0)
      const env = { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: SESSION }
      const forced = JSON.parse(runIsolated(repo, ['--runtime', 'codex'], { transcripts, env }).stdout) as Selected
      expect(forced.runtime).toBe('codex')
      expect(forced.transcript).toBe(codex)
      expect(forced.transcriptSelection.method).toBe('newest-eligible')

      const claude = join(transcripts, 'chosen.jsonl')
      writeFileSync(claude, `${claudeToolUse('Read', { file_path: '/x/chosen.md' })}\n`)
      const explicit = JSON.parse(
        runIsolated(repo, ['--transcript', 'chosen.jsonl'], { transcripts, env }).stdout
      ) as Selected
      expect(explicit.transcript).toBe(claude)
      expect(explicit.transcriptSelection).toMatchObject({ method: 'explicit', limitReached: false })

      // Under `detect`, a selector still reaches Codex candidates inside Claude Code.
      const codexByName = JSON.parse(
        runIsolated(repo, ['--transcript', 'rollout-explicit.jsonl'], { transcripts, env }).stdout
      ) as Selected
      expect(codexByName.runtime).toBe('codex')
      expect(codexByName.transcript).toBe(codex)
      expect(codexByName.transcriptSelection.method).toBe('explicit')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('recap grounding live-session overrides', () => {
  test('--runtime claude with an identity declines rather than falling back to repository discovery', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const config = join(root, 'claude-config')
    try {
      initialiseRepository(repo)
      const project = join(config, 'projects', physical(repo).replace(/[^A-Za-z0-9]/g, '-'))
      mkdirSync(project, { recursive: true })
      writeFileSync(join(project, 'other-session.jsonl'), `${claudeToolUse('Read', {})}\n`)
      const env = { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: SESSION, CLAUDE_CONFIG_DIR: config }
      const forced = JSON.parse(runIsolated(repo, ['--runtime', 'claude'], { home: root, env }).stdout) as Selected
      expect(forced.transcript).toBeNull()
      expect(forced.transcriptSelection).toMatchObject({
        method: 'none',
        reason: 'live-session-transcript-not-found'
      })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('--transcripts-dir confines the live-session locator to that directory', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const transcripts = join(root, 'transcripts')
    const config = join(root, 'claude-config')
    try {
      initialiseRepository(repo)
      mkdirSync(transcripts, { recursive: true })
      // A live transcript elsewhere under the configured root must not be found.
      const elsewhere = join(config, 'projects', '-launch-root', `${SESSION}.jsonl`)
      mkdirSync(dirname(elsewhere), { recursive: true })
      writeFileSync(elsewhere, `${claudeToolUse('Read', {})}\n`)
      const env = { CLAUDECODE: '1', CLAUDE_CODE_SESSION_ID: SESSION, CLAUDE_CONFIG_DIR: config }
      const missing = JSON.parse(runIsolated(repo, [], { transcripts, env }).stdout) as Selected
      expect(missing.transcript).toBeNull()
      expect(missing.transcriptSelection).toMatchObject({
        method: 'none',
        reason: 'live-session-transcript-not-found'
      })

      const live = join(transcripts, `${SESSION}.jsonl`)
      writeFileSync(live, `${claudeToolUse('Edit', { file_path: '/x/live.md' })}\n`)
      const found = JSON.parse(runIsolated(repo, [], { transcripts, env }).stdout) as Selected
      expect(found.transcript).toBe(live)
      expect(found.transcriptSelection).toEqual({ method: 'live-session', examined: 0, limitReached: false })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('recap grounding bounded discovery', () => {
  test('stops at the newest eligible header without parsing older or large transcript bodies', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other-repo')
    const sessions = join(root, 'sessions')
    try {
      initialiseRepository(repo)
      initialiseRepository(otherRepo)
      for (let index = 0; index < 40; index += 1)
        writeCodex(sessions, `rollout-older-${index}.jsonl`, physical(repo), -1000 - index)
      for (let index = 0; index < 5; index += 1)
        writeCodex(sessions, `rollout-unrelated-${index}.jsonl`, physical(otherRepo), 100 + index)
      const largeBody = `${codexFunction('Bash', { command: 'x'.repeat(1024) })}\n`.repeat(8 * 1024)
      const newest = writeCodex(sessions, 'rollout-large.jsonl', physical(repo), 50, largeBody)

      const grounded = JSON.parse(run(repo, sessions, ['--runtime', 'codex']).stdout) as Selected
      expect(grounded.transcript).toBe(newest)
      expect(grounded.toolTally).toEqual({ Read: 1, Bash: 8 * 1024 })
      // Five newer unrelated headers, then the eligible one; no older candidate is inspected.
      expect(grounded.transcriptSelection).toEqual({ method: 'newest-eligible', examined: 6, limitReached: false })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('declines explicitly when the header limit is reached before an eligible transcript', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other-repo')
    const sessions = join(root, 'sessions')
    try {
      initialiseRepository(repo)
      initialiseRepository(otherRepo)
      for (let index = 0; index < 260; index += 1)
        writeCodex(sessions, `rollout-unrelated-${index}.jsonl`, physical(otherRepo), 100 + index)
      writeCodex(sessions, 'rollout-oldest-match.jsonl', physical(repo), -1000)

      const grounded = JSON.parse(run(repo, sessions, ['--runtime', 'codex']).stdout) as Selected
      expect(grounded.transcript).toBeNull()
      expect(grounded.transcriptSelection).toEqual({
        method: 'none',
        reason: 'discovery-limit',
        examined: 256,
        limitReached: true
      })
      expect(grounded.repository).toMatchObject({ status: 'available', root: physical(repo) })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('treats a header without a complete line inside the bounded prefix as ineligible', () => {
    const root = fixture()
    const repo = join(root, 'repo')
    const sessions = join(root, 'sessions')
    const oversized = join(sessions, 'rollout-oversized.jsonl')
    try {
      initialiseRepository(repo)
      mkdirSync(sessions, { recursive: true })
      writeFileSync(
        oversized,
        `${JSON.stringify({ type: 'session_meta', payload: { cwd: physical(repo), padding: 'x'.repeat(70 * 1024) } })}\n`
      )
      const grounded = JSON.parse(run(repo, sessions, ['--runtime', 'codex']).stdout) as Selected
      expect(grounded.transcript).toBeNull()
      expect(grounded.transcriptSelection).toEqual({
        method: 'none',
        reason: 'no-eligible-transcript',
        examined: 1,
        limitReached: false
      })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
