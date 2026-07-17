#!/usr/bin/env bun
/**
 * Mechanical checker for ki-housekeeping.
 *
 * Usage: bun skills/environment/ki-housekeeping/scripts/audit.ts [repo-path] [--json] [--report [dir]] [--memory-dir <dir>]
 *
 * Resolves the Claude Code auto-memory directory for a repo
 * (~/.claude/projects/<slug>/memory, slug = repo's absolute path with "/" and "." -> "-")
 * and checks index/frontmatter agreement per skills/environment/ki-housekeeping/references/rubric.md.
 * See skills/foundations/ki-engineering/references/checker-contract.md for the severity ladder,
 * exit-code, and flag contract every checker in this repo follows.
 */

import { readFileSync } from 'node:fs'
import { lstat, readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  type CheckerLevel,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

enum Sev {
  FAIL = 0,
  WARN = 1,
  POLISH = 2,
  ADVISORY = 3,
  INFO = 4,
  NA = 5,
  PASS = 6
}

const SEV_LABELS: Record<Sev, string> = {
  [Sev.FAIL]: 'FAIL',
  [Sev.WARN]: 'WARN',
  [Sev.POLISH]: 'POLISH',
  [Sev.ADVISORY]: 'ADVISORY',
  [Sev.INFO]: 'INFO',
  [Sev.NA]: 'NA',
  [Sev.PASS]: 'PASS'
}

const VALID_TYPES = new Set(['user', 'feedback', 'project', 'reference'])

// A governed repository may declare either runtime. This is deliberately a small
// consumer contract rather than a bootstrap implementation: ki-self is authored
// locally, and its two runtime payloads are committed regular files.
const RUNTIME_SKILL_PATHS: Record<string, string> = {
  'claude-code': '.claude/skills/ki-self/SKILL.md',
  codex: '.agents/skills/ki-self/SKILL.md'
}

interface Finding {
  id: string
  severity: Sev
  file: string
  message: string
  ref?: string
}

// Reference-doc pointer per criterion (the cited-finding standard). The memory-area
// index/frontmatter criteria are specified in memory-format.md; the DIR-1 store-resolution
// rule in the standard; the SUMMARY roll-up in the rubric itself.
const REF_MEMORY_FORMAT = 'references/memory-format.md'
const REF_STANDARD = 'references/standards.md'
const REF_RUBRIC = 'references/rubric.md'
const REF_BY_ID: Record<string, string> = {
  'DIR-1': REF_STANDARD,
  'IDX-1': REF_MEMORY_FORMAT,
  'IDX-2': REF_MEMORY_FORMAT,
  'IDX-3': REF_MEMORY_FORMAT,
  'IDX-4': REF_MEMORY_FORMAT,
  'IDX-5': REF_MEMORY_FORMAT,
  'IDX-6': REF_MEMORY_FORMAT,
  'FM-1': REF_MEMORY_FORMAT,
  'FM-2': REF_MEMORY_FORMAT,
  'FM-3': REF_MEMORY_FORMAT,
  'FM-4': REF_MEMORY_FORMAT,
  'FM-5': REF_MEMORY_FORMAT,
  'LINK-1': REF_MEMORY_FORMAT,
  'SELF-1': REF_STANDARD,
  'SELF-2': REF_STANDARD,
  'SELF-3': REF_STANDARD,
  SUMMARY: REF_RUBRIC
}

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function canonicalFindings(findings: Finding[]): CheckerFinding[] {
  return findings.map((finding) => ({
    type: 'M',
    level: SEV_LABELS[finding.severity] as CheckerLevel,
    code: finding.id,
    message: finding.message,
    ref: finding.ref,
    file: finding.file
  }))
}

function slugifyRepoPath(absPath: string): string {
  return absPath.replace(/[/.]/g, '-')
}

function resolveMemoryDir(repoArg: string | undefined): string {
  const repoAbs = resolve(repoArg ?? process.cwd())
  const slug = slugifyRepoPath(repoAbs)
  return join(homedir(), '.claude', 'projects', slug, 'memory')
}

function declaredTargetRuntimes(repoRoot: string): string[] | null {
  let config: string
  try {
    config = readFileSync(join(repoRoot, '.ki-config.toml'), 'utf8')
  } catch {
    return null
  }

  const match = config.match(/^target_runtimes\s*=\s*\[([^\]]*)\]/m)
  if (!match) return ['claude-code']
  const runtimes = [...match[1].matchAll(/["']([^"']+)["']/g)].map((entry) => entry[1])
  return runtimes.length > 0 ? runtimes : ['claude-code']
}

async function auditKiSelf(repoRoot: string, add: (id: string, severity: Sev, file: string, message: string) => void): Promise<void> {
  const runtimes = declaredTargetRuntimes(repoRoot)
  if (!runtimes) {
    add('SELF-1', Sev.NA, '.ki-config.toml', 'no governed-repository config — repo-local ki-self companion is not applicable')
    return
  }

  const payloads = new Map<string, string>()
  for (const runtime of runtimes) {
    const relativePath = RUNTIME_SKILL_PATHS[runtime]
    if (!relativePath) continue // ki-repo owns validation of an unknown runtime declaration.
    const payloadPath = join(repoRoot, relativePath)
    let payload: string
    try {
      const kind = await lstat(payloadPath)
      if (!kind.isFile() || kind.isSymbolicLink()) {
        add(
          'SELF-1',
          Sev.FAIL,
          relativePath,
          `ki-self payload for declared ${runtime} runtime must be an owned regular file, not a symlink`
        )
        continue
      }
      payload = await readFile(payloadPath, 'utf8')
    } catch {
      add('SELF-1', Sev.WARN, relativePath, `missing repo-local ki-self payload for declared ${runtime} runtime`)
      continue
    }
    if (!/^name:\s*ki-self\s*$/m.test(payload)) {
      add('SELF-2', Sev.FAIL, relativePath, 'repo-local skill payload must declare name: ki-self')
      continue
    }
    payloads.set(runtime, payload)
  }

  if (payloads.size === runtimes.filter((runtime) => RUNTIME_SKILL_PATHS[runtime]).length && payloads.size > 0) {
    const [canonicalRuntime, canonicalPayload] = payloads.entries().next().value as [string, string]
    const mismatched = [...payloads.entries()].filter(([, payload]) => payload !== canonicalPayload).map(([runtime]) => runtime)
    if (mismatched.length > 0) {
      add('SELF-3', Sev.FAIL, 'ki-self', `runtime payloads differ: ${canonicalRuntime} is not identical to ${mismatched.join(', ')}`)
    } else {
      add('SELF-1', Sev.PASS, 'ki-self', `repo-local ki-self payload present for declared runtime(s): ${[...payloads.keys()].join(', ')}`)
    }
  }
}

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const lines = match[1].split('\n')
  const out: Record<string, unknown> = {}
  let currentKey: string | null = null
  for (const line of lines) {
    const topLevel = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (topLevel) {
      currentKey = topLevel[1]
      const value = topLevel[2].trim()
      out[currentKey] = value === '' ? {} : value.replace(/^["']|["']$/g, '')
      continue
    }
    const nested = line.match(/^\s+([a-zA-Z_]+):\s*(.*)$/)
    if (nested && currentKey && typeof out[currentKey] === 'object') {
      ;(out[currentKey] as Record<string, string>)[nested[1]] = nested[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return out
}

async function main() {
  const args = process.argv.slice(2)
  const memDirIdx = args.indexOf('--memory-dir')
  const memDirArg = memDirIdx !== -1 ? args[memDirIdx + 1] : undefined
  const repoArg = args.find((arg, index) => !arg.startsWith('-') && args[index - 1] !== '--memory-dir')

  // --memory-dir points the checker at an explicit store (used by the test harness and
  // for auditing a memory directory directly); otherwise derive it from the repo path.
  const memoryDir = memDirArg ? resolve(memDirArg) : resolveMemoryDir(repoArg)
  const repoRoot = resolve(repoArg ?? process.cwd())
  const repoName = basename(resolve(repoArg ?? process.cwd()))
  const findings: Finding[] = []
  const add = (id: string, severity: Sev, file: string, message: string) =>
    findings.push({ id, severity, file, message, ref: REF_BY_ID[id] })

  await auditKiSelf(repoRoot, add)

  let dirExists = true
  try {
    await stat(memoryDir)
  } catch {
    dirExists = false
  }

  if (!dirExists) {
    add('DIR-1', Sev.NA, memoryDir, 'no memory/ directory for this repo yet — not a failure')
    const reporterFindings = canonicalFindings(findings)
    reporterFindings.push(...judgmentFindingsFromRubric(localRubricPath(), REF_RUBRIC))
    emitCheckerReporter({ mode: 'audit', concern: 'housekeeping', target: memoryDir, findings: reporterFindings })
    process.exitCode = checkerReporterExitCode(reporterFindings)
    return
  }

  const entries = await readdir(memoryDir)
  const mdFiles = entries.filter((f) => f.endsWith('.md'))
  const indexFile = 'MEMORY.md'
  const hasIndex = mdFiles.includes(indexFile)

  if (!hasIndex) {
    add('IDX-1', Sev.FAIL, indexFile, `${indexFile} not found in ${memoryDir}`)
  }

  const memoryFiles = mdFiles.filter((f) => f !== indexFile)
  const indexedFiles = new Set<string>()

  if (hasIndex) {
    const indexContent = await readFile(join(memoryDir, indexFile), 'utf8')
    const entryLines = indexContent.split('\n').filter((l) => /^-\s*\[.+\]\(.+\.md\)/.test(l))

    for (const line of entryLines) {
      if (line.length > 150) {
        add('IDX-4', Sev.POLISH, indexFile, `index line exceeds 150 chars: ${line.slice(0, 60)}...`)
      }
      const linkMatch = line.match(/\]\(([^)]+\.md)\)/)
      if (!linkMatch) continue
      const target = linkMatch[1]
      indexedFiles.add(target)
      if (!memoryFiles.includes(target)) {
        add('IDX-2', Sev.FAIL, indexFile, `index entry points to missing file: ${target}`)
      }
    }

    for (const file of memoryFiles) {
      if (!indexedFiles.has(file)) {
        add('IDX-3', Sev.WARN, file, `${file} is not listed in ${indexFile}`)
      }
    }

    const startMarker = indexContent.includes('<!-- headroom:learn:start -->')
    const endMarker = indexContent.includes('<!-- headroom:learn:end -->')
    if (startMarker !== endMarker) {
      add('IDX-5', Sev.WARN, indexFile, 'headroom:learn block has a start marker without a matching end marker (or vice versa)')
    } else if (startMarker && endMarker) {
      const startPos = indexContent.indexOf('<!-- headroom:learn:start -->')
      const endPos = indexContent.indexOf('<!-- headroom:learn:end -->')
      if (endPos < startPos) {
        add('IDX-5', Sev.WARN, indexFile, 'headroom:learn end marker appears before start marker')
      } else {
        add('IDX-5', Sev.PASS, indexFile, 'headroom:learn block markers well-formed')
        // IDX-6 — entries inside the learn block that are rooted in another repo are
        // stale cross-repo captures (headroom learned them in a different island).
        // Heuristic: absolute `knowledgeislands/<repo>` paths whose <repo> ≠ this repo.
        const block = indexContent.slice(startPos, endPos)
        const foreign = new Set<string>()
        let foreignLines = 0
        for (const line of block.split('\n')) {
          const names = [...line.matchAll(/knowledgeislands\/([A-Za-z0-9_-]+)/g)].map((mm) => mm[1]).filter((n) => n !== repoName)
          if (names.length > 0) {
            foreignLines++
            for (const n of names) foreign.add(n)
          }
        }
        if (foreign.size > 0) {
          add(
            'IDX-6',
            Sev.WARN,
            indexFile,
            `headroom:learn block has ${foreignLines} line(s) rooted in other repo(s) (${[...foreign].join(', ')}) — remove the source with headroom memory list/show/delete --db-path; re-learn here if still useful`
          )
        }
      }
    }
  }

  const seenNames = new Map<string, string>()
  let danglingLinks = 0
  const definedNames = new Set<string>()

  const parsed = new Map<string, { fm: Record<string, unknown> | null; content: string }>()
  for (const file of memoryFiles) {
    const content = await readFile(join(memoryDir, file), 'utf8')
    const fm = parseFrontmatter(content)
    parsed.set(file, { fm, content })
    if (fm && typeof fm.name === 'string') definedNames.add(fm.name)
  }

  for (const file of memoryFiles) {
    const entry = parsed.get(file)
    if (!entry) continue
    const { fm, content } = entry
    const expectedName = file.replace(/\.md$/, '')

    if (!fm) {
      add('FM-1', Sev.FAIL, file, 'no frontmatter block found')
      continue
    }

    const name = fm.name
    if (typeof name !== 'string' || name.length === 0) {
      add('FM-2', Sev.FAIL, file, 'missing name field')
    } else if (name !== expectedName) {
      add('FM-2', Sev.FAIL, file, `name '${name}' does not match filename slug '${expectedName}'`)
    } else if (seenNames.has(name)) {
      add('FM-5', Sev.FAIL, file, `duplicate name '${name}' also used by ${seenNames.get(name)}`)
    } else {
      seenNames.set(name, file)
    }

    const description = fm.description
    if (typeof description !== 'string' || description.trim().length === 0) {
      add('FM-3', Sev.FAIL, file, 'missing or empty description field')
    }

    const metadata = fm.metadata
    const type = metadata && typeof metadata === 'object' ? (metadata as Record<string, string>).type : undefined
    if (!type || !VALID_TYPES.has(type)) {
      add('FM-4', Sev.FAIL, file, `metadata.type is '${type ?? '(missing)'}', must be one of ${[...VALID_TYPES].join(', ')}`)
    }

    const links = content.match(/\[\[([a-z0-9-]+)\]\]/g) ?? []
    for (const link of links) {
      const target = link.slice(2, -2)
      if (!definedNames.has(target) && target !== expectedName) danglingLinks++
    }
  }

  if (danglingLinks > 0) {
    add(
      'LINK-1',
      Sev.INFO,
      memoryDir,
      `${danglingLinks} [[wikilink]] reference(s) point to a memory not yet written — treated as intentional forward references, not errors`
    )
  }

  if (findings.length === 0 || findings.every((f) => f.severity === Sev.PASS)) {
    add('SUMMARY', Sev.PASS, memoryDir, `all ${memoryFiles.length} memory file(s) pass mechanical checks`)
  }

  const reporterFindings = canonicalFindings(findings)
  reporterFindings.push(...judgmentFindingsFromRubric(localRubricPath(), REF_RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'housekeeping', target: memoryDir, findings: reporterFindings })
  process.exitCode = checkerReporterExitCode(reporterFindings)
}

main().catch((err) => {
  const target = resolve(process.argv.slice(2).find((arg) => !arg.startsWith('-')) ?? '.')
  emitCheckerReporter({
    mode: 'audit',
    concern: 'housekeeping',
    target,
    findings: [{ type: 'M', level: 'FAIL', code: 'DIR-1', message: `Audit failed: ${String(err)}`, ref: REF_STANDARD }]
  })
  process.exitCode = 1
})
