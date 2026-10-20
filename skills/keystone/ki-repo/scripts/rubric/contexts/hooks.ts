import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

export const HOOK_DIRECTORY = '.githooks'
export const PRE_COMMIT_HOOK = '.githooks/pre-commit'
export const COMMIT_MSG_HOOK = '.githooks/commit-msg'
export const HOOK_BINDING = `git config core.hooksPath ${HOOK_DIRECTORY}`
const HOOKS = [PRE_COMMIT_HOOK, COMMIT_MSG_HOOK] as const
const HUSKY_BINDING = '.husky/_'

export type HooksRubricContext = {
  hook1: readonly AuditOutcome[]
  hook2: readonly AuditOutcome[]
  hook3: readonly AuditOutcome[]
  hook4: readonly AuditOutcome[]
  hook5: readonly AuditOutcome[]
}

const git = (target: string, args: readonly string[]): string | undefined => {
  try {
    return execFileSync('git', ['-C', target, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return undefined
  }
}

const one = (outcome: AuditOutcome): readonly AuditOutcome[] => [outcome]

const stateOf = (path: string): ReturnType<typeof lstatSync> | undefined => {
  try {
    return lstatSync(path)
  } catch {
    return undefined
  }
}

const isSafeRegularFile = (path: string): boolean => {
  const state = stateOf(path)
  return Boolean(state?.isFile() && !state.isSymbolicLink())
}

// Existence only: what the hook runs belongs to the shape skill that knows the toolchain.
const trackedExecutable = (target: string, hook: string, absent: AuditOutcome): readonly AuditOutcome[] => {
  const state = stateOf(join(target, hook))
  if (!state) return one(absent)
  if (!state.isFile() || state.isSymbolicLink())
    return one({ status: 'VIOLATION', message: `${hook} is not a safe regular file`, subject: hook })
  const staged = git(target, ['ls-files', '--stage', '--', hook])
  if (!staged) return one({ status: 'VIOLATION', message: `${hook} is not tracked`, subject: hook })
  if (!staged.startsWith('100755 '))
    return one({
      status: 'VIOLATION',
      message: `${hook} is tracked without executable mode; run \`git update-index --chmod=+x ${hook}\``,
      subject: hook
    })
  return one({ status: 'PASS', message: `${hook} is tracked and executable`, subject: hook })
}

const existence = (target: string): readonly AuditOutcome[] =>
  trackedExecutable(target, PRE_COMMIT_HOOK, {
    status: 'VIOLATION',
    message: `no committed ${PRE_COMMIT_HOOK} gate; the repository's checks run only when remembered`,
    subject: PRE_COMMIT_HOOK
  })

// A package-backed repository already validates messages with Commitlint; elsewhere the
// hook waits for `ki git check-message` (KI-TOOL-KI-CLI-161).
const messageHook = (target: string): readonly AuditOutcome[] =>
  trackedExecutable(
    target,
    COMMIT_MSG_HOOK,
    isSafeRegularFile(join(target, 'package.json'))
      ? {
          status: 'VIOLATION',
          message: `no committed ${COMMIT_MSG_HOOK}; a package-backed repository validates proposed messages there`,
          subject: COMMIT_MSG_HOOK
        }
      : {
          status: 'NOT_APPLICABLE',
          message: `no ${COMMIT_MSG_HOOK} is required without a package until \`ki git check-message\` ships`
        }
  )

// The binding lives in each clone's Git configuration, so CI without one has nothing to bind.
// `git config --get` run in the audited working tree also sees a worktree-scoped override.
const binding = (
  target: string,
  hookPresent: boolean,
  environment: Readonly<Record<string, string | undefined>>
): readonly AuditOutcome[] => {
  if (!hookPresent) return one({ status: 'NOT_APPLICABLE', message: `no committed ${PRE_COMMIT_HOOK} to bind` })
  const value = git(target, ['config', '--get', 'core.hooksPath'])
  if (value && resolve(target, value) === resolve(target, HOOK_DIRECTORY))
    return one({ status: 'PASS', message: `core.hooksPath resolves to ${HOOK_DIRECTORY}` })
  if (!value && environment.CI)
    return one({ status: 'NOT_APPLICABLE', message: 'CI checkout carries no local hook binding' })
  const husky = value !== undefined && resolve(target, value) === resolve(target, HUSKY_BINDING)
  return one({
    status: 'VIOLATION',
    message: `core.hooksPath is ${value ? JSON.stringify(value) : 'unset'}${husky ? ", Husky's retired binding," : ','} so the committed gate never runs; run \`${HOOK_BINDING}\``,
    subject: '.git/config'
  })
}

// Lines of the common frame: shebang, root, the missing-tool refusal and the PATH step.
const FRAME_LINE =
  /^(?:#|$|root=|missing=|for\s+tool\s+in\b|done\b|\[|test\s|if\b|then\b|elif\b|else\b|fi\b|echo\b|printf\b|exit\b|(?:export\s+)?PATH=|export\s+PATH\b)/
const TOOL_TEST = /\bcommand\s+-v\b|node_modules\/\.bin\//
const BYPASS = /--no-verify/
const BYPASS_REFUSED = /\b(?:do not|don't|never|not)\b.*--no-verify/i

const refusal = (hook: string, source: string): AuditOutcome => {
  const lines = source.split(/\r?\n/).map((line) => line.trim())
  if (lines[0] !== '#!/bin/sh')
    return { status: 'VIOLATION', message: `${hook} must start with \`#!/bin/sh\``, subject: hook }
  if (lines.some((line) => BYPASS.test(line) && !BYPASS_REFUSED.test(line)))
    return {
      status: 'VIOLATION',
      message: `${hook} suggests \`--no-verify\`; a gate that cannot run refuses`,
      subject: hook
    }
  const content = lines.findIndex((line, index) => index > 0 && !FRAME_LINE.test(line))
  const frame = content < 0 ? lines : lines.slice(0, content)
  const test = frame.findIndex((line) => TOOL_TEST.test(line))
  if (test < 0 || !frame.slice(test + 1).some((line) => /^exit\s+[1-9]/.test(line)))
    return {
      status: 'VIOLATION',
      message: `${hook} must refuse when a required tool is missing before its first command`,
      subject: hook
    }
  const tested = testedTools(frame)
  const untested = calledTools(lines).filter((tool) => !tested.has(tool))
  if (untested.length)
    return {
      status: 'VIOLATION',
      message: `${hook} calls ${untested.map((tool) => `\`${tool}\``).join(', ')} without testing for it in its refusal frame`,
      subject: hook
    }
  return { status: 'PASS', message: `${hook} refuses on a missing tool before its first command`, subject: hook }
}

// Tools every hook may call untested: shell keywords and builtins, Git, and the POSIX utilities.
const SHELL_KEYWORD = new Set(['!', 'if', 'then', 'elif', 'else', 'fi', 'do', 'done', 'while', 'until', 'time'])
const ALWAYS_PRESENT = new Set([
  '.',
  ':',
  '[',
  'cd',
  'command',
  'echo',
  'eval',
  'exec',
  'exit',
  'export',
  'false',
  'local',
  'printf',
  'read',
  'return',
  'set',
  'shift',
  'test',
  'trap',
  'true',
  'umask',
  'unset',
  'wait',
  'awk',
  'basename',
  'cat',
  'chmod',
  'cmp',
  'cp',
  'cut',
  'date',
  'diff',
  'dirname',
  'env',
  'find',
  'git',
  'grep',
  'head',
  'ln',
  'ls',
  'mkdir',
  'mktemp',
  'mv',
  'rm',
  'rmdir',
  'sed',
  'sh',
  'sleep',
  'sort',
  'tail',
  'tee',
  'touch',
  'tr',
  'uname',
  'uniq',
  'wc',
  'xargs'
])

// The tools a refusal frame tests: a `for tool in ...` list, `command -v <tool>` and `node_modules/.bin/<tool>`.
const testedTools = (frame: readonly string[]): Set<string> => {
  const tools = new Set<string>()
  for (const line of frame) {
    const list = /^for\s+tool\s+in\s+([^;]*?)\s*;/.exec(line)
    for (const tool of list?.[1]?.split(/\s+/) ?? []) tools.add(tool)
    for (const match of line.matchAll(/(?:\bcommand\s+-v\s+|node_modules\/\.bin\/)"?([\w.+-]+)/g))
      if (match[1]) tools.add(match[1])
  }
  return tools
}

// Every command a hook calls, conditional branches and function bodies included. A path is
// the repository's own script, and a name the hook defines as a function is its own.
const calledTools = (lines: readonly string[]): string[] => {
  const joined = lines.join('\n').replace(/\\\n/g, ' ').split('\n').slice(1)
  const functions = new Set(joined.flatMap((line) => /^([\w-]+)\s*\(\)/.exec(line)?.[1] ?? []))
  const tools = new Set<string>()
  for (const line of joined) {
    if (line.startsWith('#')) continue
    const substitutions = [...line.matchAll(/\$\(([^()]*)\)/g)].map((match) => match[1] ?? '')
    const unquoted = line.replace(/"(?:[^"\\]|\\.)*"/g, ' ').replace(/'[^']*'/g, ' ')
    for (const segment of [unquoted, ...substitutions].flatMap((part) => part.split(/;|&&|\|\||\||[(){}]/))) {
      const words = segment.trim().split(/\s+/)
      while (words[0] && (SHELL_KEYWORD.has(words[0]) || /^\w+=/.test(words[0]))) words.shift()
      const word = words[0]
      if (!word || word === 'for' || word === 'case' || word.startsWith('#')) continue
      if (word.includes('/') || word.includes('$') || !/^[\w.+-]+$/.test(word)) continue
      if (!ALWAYS_PRESENT.has(word) && !functions.has(word)) tools.add(word)
    }
  }
  return [...tools]
}

const refusals = (target: string): readonly AuditOutcome[] => {
  const present = HOOKS.filter((hook) => isSafeRegularFile(join(target, hook)))
  if (!present.length) return one({ status: 'NOT_APPLICABLE', message: 'no committed hook to inspect' })
  return present.map((hook) => refusal(hook, readFileSync(join(target, hook), 'utf8')))
}

const manifest = (target: string): Record<string, unknown> | undefined => {
  if (!isSafeRegularFile(join(target, 'package.json'))) return undefined
  try {
    const value = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8')) as unknown
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined
  } catch {
    return undefined
  }
}

const declares = (block: unknown, name: string): boolean =>
  Boolean(block && typeof block === 'object' && name in (block as Record<string, unknown>))

// Husky is retired: the committed `.githooks/` holds every hook and `prepare` binds it directly.
const husky = (target: string, environment: Readonly<Record<string, string | undefined>>): readonly AuditOutcome[] => {
  const findings: AuditOutcome[] = []
  const violation = (message: string, subject: string): void => {
    findings.push({ status: 'VIOLATION', message, subject })
  }
  const tracked = git(target, ['ls-files', '--', '.husky'])
  if (tracked) violation(`tracked Husky files remain: ${tracked.split('\n').join(', ')}`, '.husky')
  const pkg = manifest(target)
  if (pkg) {
    if (declares(pkg.dependencies, 'husky') || declares(pkg.devDependencies, 'husky'))
      violation('package.json still declares `husky`', 'package.json')
    const prepare = (pkg.scripts as Record<string, unknown> | undefined)?.prepare
    if (typeof prepare === 'string' && /\bhusky\b/.test(prepare))
      violation(`prepare calls Husky; use \`${HOOK_BINDING}\``, 'package.json')
  }
  for (const hook of HOOKS.filter((path) => isSafeRegularFile(join(target, path)))) {
    const lines = readFileSync(join(target, hook), 'utf8')
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith('#'))
    if (lines.some((line) => line.includes('.husky/')))
      violation(`${hook} delegates to .husky/; move the hook content into it`, hook)
  }
  if (!environment.CI && stateOf(join(target, HUSKY_BINDING)))
    violation(`untracked ${HUSKY_BINDING} is left from a Husky install; remove it`, HUSKY_BINDING)
  return findings.length
    ? findings
    : one({ status: 'PASS', message: 'no Husky files, dependency, call or binding remain' })
}

export const hookEvidence = (
  target: string,
  environment: Readonly<Record<string, string | undefined>> = process.env
): HooksRubricContext => {
  const hook1 = existence(target)
  return {
    hook1,
    hook2: binding(target, hook1[0]?.status === 'PASS', environment),
    hook3: messageHook(target),
    hook4: refusals(target),
    hook5: husky(target, environment)
  }
}
