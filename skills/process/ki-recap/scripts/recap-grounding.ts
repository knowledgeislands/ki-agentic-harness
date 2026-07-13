#!/usr/bin/env bun

/**
 * Grounding helper for ki-recap (not a checker — no severity ladder, no FAIL/exit-1 contract).
 *
 * Usage: bun skills/ki-recap/scripts/recap-grounding.ts [repo-path] [--json] [--transcripts-dir <dir>]
 *
 * Resolves the Claude Code project directory for a repo
 * (~/.claude/projects/<slug>, slug = repo's absolute path with "/" -> "-" — the same
 * convention ki-housekeeping's audit.ts uses for the memory/ subdirectory),
 * reads the newest session .jsonl, and emits JSON grounding data: files touched
 * (git status / git diff --stat), a tool-call tally, and high-cost candidates
 * (repeated identical calls, large-file re-reads, clarification round-trips).
 * The recap procedure (skills/ki-recap/references/recap.md) combines this output
 * with warm in-session context — it does not replace judgment, it grounds it.
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

interface ToolCall {
  name: string
  input: unknown
}

interface Grounding {
  repo: string
  transcript: string | null
  filesTouched: string[]
  diffStat: string
  toolTally: Record<string, number>
  highCostCandidates: string[]
}

function slugifyRepoPath(absPath: string): string {
  return absPath.replace(/\//g, '-')
}

function resolveProjectDir(repoArg: string | undefined): string {
  const repoAbs = resolve(repoArg ?? process.cwd())
  const slug = slugifyRepoPath(repoAbs)
  return join(homedir(), '.claude', 'projects', slug)
}

function newestTranscript(projectDir: string): string | null {
  let entries: string[]
  try {
    entries = readdirSync(projectDir).filter((f) => f.endsWith('.jsonl'))
  } catch {
    return null
  }
  if (entries.length === 0) return null
  const withTimes = entries.map((f) => {
    const full = join(projectDir, f)
    return { full, mtime: statSync(full).mtimeMs }
  })
  withTimes.sort((a, b) => b.mtime - a.mtime)
  return withTimes[0].full
}

function readToolCalls(transcriptPath: string): ToolCall[] {
  const lines = readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean)
  const calls: ToolCall[] = []
  for (const line of lines) {
    let event: unknown
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    const content = (event as { message?: { content?: unknown[] } })?.message?.content
    if (!Array.isArray(content)) continue
    for (const block of content) {
      const b = block as { type?: string; name?: string; input?: unknown }
      if (b?.type === 'tool_use' && typeof b.name === 'string') {
        calls.push({ name: b.name, input: b.input })
      }
    }
  }
  return calls
}

function gitOutput(repoAbs: string, args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: repoAbs, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

function findHighCostCandidates(calls: ToolCall[]): string[] {
  const candidates: string[] = []
  const signatureTally = new Map<string, number>()
  for (const call of calls) {
    const signature = `${call.name}:${JSON.stringify(call.input)}`
    signatureTally.set(signature, (signatureTally.get(signature) ?? 0) + 1)
  }
  for (const [signature, count] of signatureTally) {
    if (count >= 3) {
      const [name] = signature.split(':')
      candidates.push(`repeated identical ${name} call (${count}x)`)
    }
  }
  const readTally = new Map<string, number>()
  for (const call of calls) {
    if (call.name !== 'Read') continue
    const path = (call.input as { file_path?: string })?.file_path
    if (typeof path !== 'string') continue
    readTally.set(path, (readTally.get(path) ?? 0) + 1)
  }
  for (const [path, count] of readTally) {
    if (count >= 2) candidates.push(`re-read of ${path} (${count}x)`)
  }
  return candidates
}

function main() {
  const args = process.argv.slice(2)
  const jsonMode = args.includes('--json')
  const dirIdx = args.indexOf('--transcripts-dir')
  const dirArg = dirIdx !== -1 ? args[dirIdx + 1] : undefined
  const repoArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--transcripts-dir')

  const repoAbs = resolve(repoArg ?? process.cwd())
  const projectDir = dirArg ? resolve(dirArg) : resolveProjectDir(repoArg)
  const transcript = newestTranscript(projectDir)

  const filesTouched = gitOutput(repoAbs, ['status', '--porcelain'])
    .split('\n')
    .filter(Boolean)
    .map((l) => l.trim())
  const diffStat = gitOutput(repoAbs, ['diff', '--stat'])

  const toolTally: Record<string, number> = {}
  let highCostCandidates: string[] = []
  if (transcript) {
    const calls = readToolCalls(transcript)
    for (const call of calls) toolTally[call.name] = (toolTally[call.name] ?? 0) + 1
    highCostCandidates = findHighCostCandidates(calls)
  }

  const grounding: Grounding = {
    repo: repoAbs,
    transcript,
    filesTouched,
    diffStat,
    toolTally,
    highCostCandidates
  }

  if (jsonMode) {
    console.log(JSON.stringify(grounding, null, 2))
  } else {
    console.log(`repo: ${grounding.repo}`)
    console.log(`transcript: ${grounding.transcript ?? '(none found)'}`)
    console.log(`files touched: ${grounding.filesTouched.length}`)
    console.log(grounding.diffStat || '(no diff)')
    console.log(`tool tally: ${JSON.stringify(grounding.toolTally)}`)
    if (grounding.highCostCandidates.length > 0) {
      console.log('high-cost candidates:')
      for (const c of grounding.highCostCandidates) console.log(`  - ${c}`)
    }
  }
}

main()
