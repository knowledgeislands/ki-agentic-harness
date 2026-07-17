#!/usr/bin/env bun
// Lint Claude Code subagents against the MECHANICAL criteria of the ki-agents rubric.
//
// This is the deterministic half of the rubric (see ../references/rubric.md). The JUDGMENT
// half — description as a delegation signal, role/lane quality, grounding, own-vs-defer — needs a
// model and is NOT checked here. Run this first, then apply the judgment criteria by reading.
//
// Usage:
//   bun scripts/audit.ts [path ...]   # an agent .md file, or a dir of agents
//
// An agent is a single .md file (frontmatter + system prompt). A path to a .md file lints that
// file; a directory is walked recursively for *.md (README.md excluded). An existing dir with no
// agents is a clean pass (exit 0); a path that does not exist is an error (exit 1). Exits non-zero
// if any FAIL is reported (WARN never fails the run). The canonical checker reporter is the only
// output transport; terminal rendering belongs to the bootstrap aggregate.
//
// With >= 2 agents in scope it also runs cross-agent checks: duplicate `name` (NAME-5, FAIL) and
// shared quoted trigger phrases between descriptions (COLL-1, WARN).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

type Severity = 'fail' | 'warn'
type Finding = { severity: Severity; criterion: string; message: string }

// --- limits (from references/standards.md — keep in sync) ---------------------
// NAME_MAX and RESERVED derive from the skills `name` spec (BP), not the CC subagents page — that
// page states only "lowercase letters and hyphens, unique" for a subagent name. We carry the caps
// for consistency with skills; do not "correct" them against the CC subagents docs.
const NAME_MAX = 64
const DESC_MAX = 1024 // soft cap → WARN
const RESERVED = ['anthropic', 'claude']
// FM-11 — model-tier agnosticism. `inherit`/omitted is agnostic; a Claude alias is a portable pin
// (advisory WARN — a reason is a judgment call the linter can't see, FM-2); anything else is a
// rot-prone full model id (FAIL). Keep in sync with standards.md §5 `model`.
const MODEL_ALIASES = ['sonnet', 'opus', 'haiku', 'fable']

// --- minimal frontmatter parser (shared shape with audit.ts) -----------
// Handles top-level scalar keys and `>`/`|` block scalars. Avoids a YAML dependency.
type Frontmatter = { keys: Map<string, string>; present: Set<string>; raw: string | null }

function parseFrontmatter(content: string): Frontmatter {
  const keys = new Map<string, string>()
  const present = new Set<string>()
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { keys, present, raw: null }
  const block = m[1] as string
  const lines = block.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      i++
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):(.*)$/)
    if (!kv) {
      i++
      continue
    }
    const key = kv[1] as string
    const rest = (kv[2] as string).trim()
    present.add(key)
    if (rest === '>' || rest === '|' || rest.startsWith('> ') || rest.startsWith('| ') || /^[>|][-+]?\d*\s*$/.test(rest)) {
      const folded = rest[0] === '>'
      const collected: string[] = []
      i++
      while (i < lines.length) {
        const l = lines[i] as string
        if (l.trim() !== '' && !/^\s/.test(l)) break
        if (l.trim() !== '') collected.push(l.trim())
        i++
      }
      keys.set(key, folded ? collected.join(' ') : collected.join('\n'))
      continue
    }
    if (rest === '') {
      i++
      while (i < lines.length && /^\s+\S/.test(lines[i] as string)) i++
      keys.set(key, '')
      continue
    }
    keys.set(key, stripQuotes(rest))
    i++
  }
  return { keys, present, raw: block }
}

function stripQuotes(s: string): string {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1)
  return t
}

const hasXmlTag = (s: string): boolean => /<\/?[a-zA-Z][^>]*>/.test(s)
const stripCode = (md: string): string => md.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

// --- markdown link extraction (relative targets only; wikilinks are NOT matched here, and are
// allowed for agents per LINK-2) ---------------------------------------------------------------
function relativeLinkTargets(md: string): string[] {
  const out: string[] = []
  const re = /\[[^\]]*\]\(([^)]+)\)/g
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((m = re.exec(md)) !== null) {
    let target = (m[1] as string).trim()
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1).trim()
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('mailto:') || target.startsWith('#')) continue
    const hash = target.indexOf('#')
    if (hash !== -1) target = target.slice(0, hash)
    if (target) out.push(target)
  }
  return out
}

function triggerPhrases(desc: string): string[] {
  const out = new Set<string>()
  const re = /"([^"]{2,})"/g
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((m = re.exec(desc)) !== null) {
    const t = (m[1] as string).toLowerCase().replace(/\s+/g, ' ').trim()
    if (t) out.add(t)
  }
  return [...out]
}

// --- the lint (single agent file) ------------------------------------------
type Agent = { file: string; name: string | undefined; desc: string | undefined }

function lintAgent(file: string): { findings: Finding[]; agent: Agent } {
  const f: Finding[] = []
  const fail = (criterion: string, message: string): void => void f.push({ severity: 'fail', criterion, message })
  const warn = (criterion: string, message: string): void => void f.push({ severity: 'warn', criterion, message })

  const content = readFileSync(file, 'utf8')
  const stem = basename(file).replace(/\.md$/, '')

  const fm = parseFrontmatter(content)
  if (fm.raw === null) {
    fail('LAY-1', 'no YAML frontmatter block (--- ... ---) at the top of the file')
    return { findings: f, agent: { file, name: undefined, desc: undefined } }
  }
  const name = fm.keys.get('name')
  const desc = fm.keys.get('description')

  // name (NAME-1..4, NAME-6 mechanical-ish; NAME-5 uniqueness is cross-set)
  if (!name) fail('NAME-1', '`name` is missing from frontmatter')
  else {
    if (name.length > NAME_MAX) fail('NAME-2', `\`name\` is ${name.length} chars (max ${NAME_MAX})`)
    if (!/^[a-z0-9-]+$/.test(name)) fail('NAME-2', `\`name\` "${name}" must be lowercase letters, digits, and hyphens only`)
    if (name.startsWith('-') || name.endsWith('-') || name.includes('--'))
      fail('NAME-3', `\`name\` "${name}" must not start/end with a hyphen or contain "--"`)
    if (hasXmlTag(name)) fail('NAME-4', '`name` contains an XML tag')
    for (const r of RESERVED) if (name.includes(r)) fail('NAME-4', `\`name\` contains the reserved word "${r}"`)
    if (name !== stem) warn('LAY-3', `\`name\` "${name}" does not match the filename stem "${stem}" — rename one so they agree`)
  }

  // description (DESC-1..3 mechanical)
  if (!desc || desc.trim() === '') fail('DESC-1', '`description` is missing or empty')
  else {
    if (desc.length > DESC_MAX) warn('DESC-2', `\`description\` is ${desc.length} chars (recommended ≤ ${DESC_MAX})`)
    if (hasXmlTag(stripCode(desc))) fail('DESC-3', '`description` contains an XML tag')
  }

  // model tier agnosticism (FM-11 mechanical) — the model analogue of a skill hardcoding a runtime.
  // `inherit`/omitted is agnostic (OK); a Claude alias is a portable pin acceptable only with a
  // stated reason the linter can't see (advisory WARN, FM-2); a full model id rots (FAIL).
  const model = fm.keys.get('model')
  if (model !== undefined && model !== '' && model !== 'inherit') {
    if (MODEL_ALIASES.includes(model))
      warn(
        'FM-11',
        `\`model: ${model}\` pins a Claude alias — acceptable only with a stated reason (FM-2); prefer \`inherit\` for model-agnosticism`
      )
    else fail('FM-11', `\`model: ${model}\` is a rot-prone full model id — prefer an alias (${MODEL_ALIASES.join('/')}) or \`inherit\``)
  }

  // body present (PROMPT-1)
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)
  if (body.trim() === '') fail('PROMPT-1', 'no system-prompt body after the frontmatter')

  // relative links resolve (LINK-1); wikilinks are intentionally NOT checked (LINK-2 allows them)
  const text = stripCode(body)
  for (const target of relativeLinkTargets(text)) {
    if (!existsSync(resolve(dirname(file), target))) fail('LINK-1', `broken relative link → "${target}"`)
  }

  return { findings: f, agent: { file, name, desc } }
}

// --- cross-agent checks (NAME-5 dup names FAIL, COLL-1 shared triggers WARN) ----
function crossAgentFindings(agents: Agent[]): Finding[] {
  if (agents.length < 2) return []
  const out: Finding[] = []

  // NAME-5 — duplicate names
  const byName = new Map<string, string[]>()
  for (const a of agents) {
    if (!a.name) continue
    if (!byName.has(a.name)) byName.set(a.name, [])
    byName.get(a.name)?.push(basename(a.file))
  }
  for (const [name, files] of byName) {
    if (files.length > 1)
      out.push({
        severity: 'fail',
        criterion: 'NAME-5',
        message: `\`name\` "${name}" is used by ${files.sort().join(', ')} — names must be unique across the agent set`
      })
  }

  // COLL-1 — shared quoted trigger phrases
  const byPhrase = new Map<string, Set<string>>()
  for (const a of agents) {
    for (const phrase of triggerPhrases(a.desc ?? '')) {
      if (!byPhrase.has(phrase)) byPhrase.set(phrase, new Set())
      byPhrase.get(phrase)?.add(a.name ?? basename(a.file))
    }
  }
  for (const [phrase, who] of byPhrase) {
    if (who.size > 1)
      out.push({
        severity: 'warn',
        criterion: 'COLL-1',
        message: `trigger "${phrase}" is shared by ${[...who].sort().join(', ')} — confirm each names the other as an off-ramp (COLL-2)`
      })
  }

  return out.sort((a, b) => a.criterion.localeCompare(b.criterion) || a.message.localeCompare(b.message))
}

// --- discovery -------------------------------------------------------------
// Given a repo root (rather than an agents dir itself), prefer its agents/ subdir —
// walking the whole tree otherwise picks up every unrelated .md (READMEs, ADRs,
// skill references) and lints them as agents.
function agentsRoot(abs: string): string {
  if (basename(abs) === 'agents') return abs
  const candidate = join(abs, 'agents')
  return existsSync(candidate) && statSync(candidate).isDirectory() ? candidate : abs
}

function discoverAgentFiles(p: string): string[] {
  const abs = resolve(p)
  if (!existsSync(abs)) return []
  if (statSync(abs).isFile()) return abs.endsWith('.md') ? [abs] : []
  const root = agentsRoot(abs)
  const out: string[] = []
  const walk = (d: string): void => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue
      const fp = join(d, e.name)
      if (e.isDirectory() || e.isSymbolicLink()) {
        try {
          if (statSync(fp).isDirectory()) walk(fp)
        } catch {
          /* dangling symlink */
        }
      } else if (e.name.endsWith('.md') && e.name !== 'README.md') {
        out.push(fp)
      }
    }
  }
  walk(root)
  return out.sort()
}

// --- main ------------------------------------------------------------------
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const roots = args.length ? args : ['.']
const target = resolve(roots[0] ?? '.')
const RUBRIC = 'references/rubric.md'

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function emit(findings: CheckerFinding[]): never {
  emitCheckerReporter({ mode: 'audit', concern: 'agents', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

const missing = roots.filter((root) => !existsSync(resolve(root)))
if (missing.length) {
  emit([
    { type: 'M', level: 'FAIL', code: 'LAY-1', message: 'A requested audit path does not exist.', ref: RUBRIC },
    ...judgmentFindingsFromRubric(localRubricPath(), RUBRIC)
  ])
}

const files = [...new Set(roots.flatMap(discoverAgentFiles))].sort()
const agents: Agent[] = []
const findings: CheckerFinding[] = []
for (const file of files) {
  const { findings: agentFindings, agent } = lintAgent(file)
  agents.push(agent)
  for (const finding of agentFindings)
    findings.push({
      type: 'M',
      level: finding.severity === 'fail' ? 'FAIL' : 'WARN',
      code: finding.criterion,
      message: finding.message,
      ref: RUBRIC,
      file
    })
  if (agentFindings.length === 0)
    findings.push({ type: 'M', level: 'PASS', code: 'LAY-1', message: 'Mechanical checks passed.', ref: RUBRIC, file })
}

for (const finding of crossAgentFindings(agents))
  findings.push({
    type: 'M',
    level: finding.severity === 'fail' ? 'FAIL' : 'WARN',
    code: finding.criterion,
    message: finding.message,
    ref: RUBRIC
  })

findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
emit(findings)
