#!/usr/bin/env bun
// Lint Agent Skills against the MECHANICAL criteria of the ki-skills rubric.
//
// This is the deterministic half of the rubric (see ../references/rubric.md). The
// JUDGMENT half — description quality, altitude, progressive-disclosure sensibility,
// standard-vs-extension shape — needs a model and is NOT checked here. Run this first,
// then apply the judgment criteria by reading.
//
// Usage:
//   bun scripts/audit.ts [path ...]            # a skill dir, or a dir containing skills
//   bun scripts/audit.ts <skill> --footprint   # + per-skill token footprint (SIZE-5, INFO) for Mode OPTIMISE
//   bun scripts/audit.ts skills --refresh-status # + per-skill refresh class/cadence/status (LONG-3/§5, INFO)
//   bun run ki:skills:audit                              # (from the ki-agentic-harness repo root)
//
// A path containing SKILL.md is treated as one skill; otherwise its immediate
// subdirectories that contain a SKILL.md are each linted. Defaults to the current dir.
// Exits non-zero if any FAIL is reported (WARN never fails the run).
//
// With >= 2 skills in scope it also runs a cross-skill collision pass (COLL-1):
// two descriptions declaring the same quoted trigger phrase are WARNed.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { checkerReporterExitCode, emitCheckerReporter, judgmentFindingsFromItems } from './lib/checker-reporter.ts'
import type { RubricFinding, RubricItem } from './lib/rubric/rubric.ts'
import { COLLISION } from './rubrics/collision.ts'
import { DESC } from './rubrics/description.ts'
import { RUBRIC_ITEMS } from './rubrics/index.ts'
import { KI_CHECKER } from './rubrics/ki-checker.ts'
import { KI_SHAPE, type KiShapeSkillContext } from './rubrics/ki-shape.ts'
import { LAYOUT } from './rubrics/layout.ts'
import { LINKS } from './rubrics/link.ts'
import { LONGEVITY, REFRESH_GRACE_DAYS } from './rubrics/longevity.ts'
import { NAME } from './rubrics/name.ts'
import { OPTIONAL } from './rubrics/optional.ts'
import { REFERENCES } from './rubrics/references.ts'
import { SIZE } from './rubrics/size.ts'
import { createRefreshContext } from './rubrics/support/longevity.ts'
import { endorsesRetiredExtension, extractBodyModes, extractSection, hintVerbs, isProcessSkill } from './rubrics/support/modes.ts'
import { discoverSkillDirs, listMarkdownFiles, listScriptFiles } from './rubrics/support/skill-files.ts'
import { stripCode } from './rubrics/support/text.ts'
import { relativeImportSpecifiers } from './rubrics/support/typescript.ts'

type Severity = 'fail' | 'warn'
// area = the rubric code (criterion); ref = the reference-doc pointer the criterion cites
// (this skill's rubric); file = the path a file-scoped finding concerns. The canonical
// reporter transports both separately from the aggregate's eventual presentation.
type Finding = { severity: Severity; criterion: string; message: string; ref?: string; file?: string }

const auditRubricItems = <Context>(items: readonly RubricItem<Context>[], context: Context): RubricFinding[] =>
  items.flatMap((item) => item.audit?.(context) ?? [])

// Every ki-skills criterion is defined in this skill's rubric — the default reference pointer.
const RUBRIC = 'references/rubric.md'

// --- limits (from references/standards.md §16 — keep in sync) ----------------------
const FOOTPRINT_REF_NOTE_TOKENS = 1500 // a single reference this large is a candidate to split — INFO hint only, never a cap

// --- frontmatter parser ----------------------------------------------------
// Handles the scalar fields the audit reads directly. The Bun-built-in YAML
// parser supplies `metadata`'s real value so OPT-2 can inspect its types without
// adding a package dependency.
type Frontmatter = { keys: Map<string, string>; present: Set<string>; raw: string | null; metadata: unknown }
type BunYamlRuntime = { Bun: { YAML: { parse: (source: string) => unknown } } }

function parseFrontmatter(content: string): Frontmatter {
  const keys = new Map<string, string>()
  const present = new Set<string>()
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { keys, present, raw: null, metadata: undefined }
  const block = m[1] as string
  let metadata: unknown
  try {
    const parsed = (globalThis as typeof globalThis & BunYamlRuntime).Bun.YAML.parse(block)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) metadata = (parsed as Record<string, unknown>).metadata
  } catch {
    // Existing scalar checks still report what they can. OPT-2 reports an
    // invalid `metadata` value when that key is present but YAML cannot parse it.
  }
  const lines = block.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      i++
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):(.*)$/) // column-0 top-level key
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
      // Block body = subsequent indented lines (blank lines belong to it too).
      // Stops at the next column-0 key.
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
      // bare key — could head a nested map; skip its indented children
      i++
      while (i < lines.length && /^\s+\S/.test(lines[i] as string)) i++
      keys.set(key, '')
      continue
    }
    keys.set(key, stripQuotes(rest))
    i++
  }
  return { keys, present, raw: block, metadata }
}

function stripQuotes(s: string): string {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1)
  return t
}

// Parses a flow-list frontmatter value (`owns: ['.gitignore', 'x.json']` or
// `contributes: [.ki-config.toml]`) into its bare filenames. Empty/absent → [].
function parseListValue(raw: string | undefined): string[] {
  if (!raw) return []
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (inner.trim() === '') return []
  return inner
    .split(',')
    .map((s) => stripQuotes(s))
    .filter((s) => s.length > 0)
}

const createKiShapeContext = (skillDir: string, frontmatter: Frontmatter, description: string, body: string): KiShapeSkillContext => {
  const argumentHint = frontmatter.keys.get('argument-hint')
  const section = extractSection(body, 'Operating modes')
  const markdownFiles = listMarkdownFiles(skillDir)
  const referenceFiles = markdownFiles.filter((file) => basename(file) !== 'SKILL.md')
  const referenceText = referenceFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
  const skillText = `${body}\n${referenceText}`
  const scriptsDir = join(skillDir, 'scripts')
  const scriptNames = existsSync(scriptsDir) ? readdirSync(scriptsDir) : []
  const refreshReference = join(skillDir, 'references', 'mode-refresh.md')
  const refreshSection = section?.match(/^###\s+Mode\s+REFRESH\b[\s\S]*?(?=^###\s+Mode\s+|$(?![\s\S]))/im)?.[0] ?? ''
  const rubricPath = join(skillDir, 'references', 'rubric.md')
  const rubric = existsSync(rubricPath) ? readFileSync(rubricPath, 'utf8') : ''
  const auditPath = join(scriptsDir, 'audit.ts')
  const conformPath = join(scriptsDir, 'conform.ts')
  const conformSource = existsSync(conformPath) ? readFileSync(conformPath, 'utf8').replace(/\/\/.*$/gm, '') : ''
  const scaffoldedFiles = [...conformSource.matchAll(/\b(?:scaffold|syncOwned)\(\s*['"]([^'"]+)['"]/g)].map((match) => match[1] as string)
  const checkers = scriptNames
    .filter(
      (name) =>
        (name === 'audit.ts' || name.startsWith('audit-') || name.startsWith('lint-')) && name.endsWith('.ts') && !name.endsWith('.test.ts')
    )
    .map((name) => {
      const source = readFileSync(join(scriptsDir, name), 'utf8')
      return {
        name,
        usesReporter: /from\s+['"][^'"]*checker-reporter\.ts['"]/.test(source) && /\bemitCheckerReporter\b/.test(source)
      }
    })

  return {
    governanceSkill: !isProcessSkill(description),
    argumentHint,
    hintVerbs: hintVerbs(argumentHint ?? ''),
    vendorsPresent: frontmatter.present.has('vendors'),
    vendors: (frontmatter.keys.get('vendors') ?? '').trim(),
    scriptNames,
    operatingModesSection: section,
    bodyModes: extractBodyModes(section),
    operatingModesIntro: section?.split(/^###\s+|^\s*\|/m)[0] ?? '',
    flatModeHeadings: [...stripCode(body).matchAll(/^##\s+Mode\s+(\w+)/gim)].map((match) => match[1] as string),
    bareModeHeadings: section
      ? [...stripCode(section).matchAll(/^###\s+(?!Mode\b)(\S[^\n]*)/gim)].map((match) => (match[1] as string).trim())
      : [],
    refreshText: `${refreshSection}${existsSync(refreshReference) ? `\n${readFileSync(refreshReference, 'utf8')}` : ''}`,
    retiredExtensionFiles: markdownFiles
      .filter((file) => endorsesRetiredExtension(basename(file) === 'SKILL.md' ? body : readFileSync(file, 'utf8')))
      .map((file) => file.slice(skillDir.length + 1)),
    strongGate: /do not edit[^.\n]*directly|go through (a )?proposal|standing directive|installing the gate/i.test(stripCode(skillText)),
    anchorMentioned: /CLAUDE\.md|AGENTS\.md|always-loaded|installing the gate|\banchor/i.test(skillText),
    checkerReadsAnchor: scriptNames.some(
      (name) => name.endsWith('.ts') && /CLAUDE\.md|AGENTS\.md/.test(readFileSync(join(scriptsDir, name), 'utf8'))
    ),
    mechanicalRubricCount: (rubric.match(/\[M\]/g) ?? []).length,
    hasChecker: scriptNames.some((name) => name.endsWith('.ts')),
    documentsMechanicalDelegation: /lint:md|toolchain (?:already )?enforces/i.test(rubric),
    checkers,
    dependsOnPresent: frontmatter.present.has('depends-on'),
    dependsOn: (frontmatter.keys.get('depends-on') ?? '').trim(),
    owns: parseListValue(frontmatter.keys.get('owns')),
    contributes: parseListValue(frontmatter.keys.get('contributes')),
    requires: parseListValue(frontmatter.keys.get('requires')),
    scaffoldedFiles,
    auditSource: existsSync(auditPath) ? readFileSync(auditPath, 'utf8') : null
  }
}

// --- footprint (SIZE-5, INFO under --footprint) -----------------------------
// Per-skill token estimate of everything the skill adds to context: the description
// (standing cost — paid every turn in the selection surface), the SKILL.md body
// (loaded when the skill fires), and each references/ file (loaded on demand). Same
// chars/4 method as SIZE-2; never a cap — measurement for Mode OPTIMISE. The
// environment-level aggregate of all descriptions is ki-tokenomics'.
const estTok = (s: string): number => Math.round(s.length / 4)
type FootprintRow = { kind: 'description' | 'body' | 'reference'; path: string; tokens: number }
function footprint(skillDir: string): { rows: FootprintRow[]; total: number } {
  const content = readFileSync(join(skillDir, 'SKILL.md'), 'utf8')
  const desc = parseFrontmatter(content).keys.get('description') ?? ''
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)
  const rows: FootprintRow[] = [
    { kind: 'description', path: 'SKILL.md:description', tokens: estTok(desc) },
    { kind: 'body', path: 'SKILL.md:body', tokens: estTok(body) }
  ]
  for (const file of listMarkdownFiles(skillDir)) {
    if (basename(file) === 'SKILL.md') continue
    rows.push({ kind: 'reference', path: file.slice(skillDir.length + 1), tokens: estTok(readFileSync(file, 'utf8')) })
  }
  return { rows, total: rows.reduce((n, r) => n + r.tokens, 0) }
}

function lintSkill(skillDir: string): Finding[] {
  const f: Finding[] = []
  const fail = (criterion: string, message: string, file?: string): void =>
    void f.push({ severity: 'fail', criterion, message, ref: RUBRIC, file })
  const warn = (criterion: string, message: string, file?: string): void =>
    void f.push({ severity: 'warn', criterion, message, ref: RUBRIC, file })

  const skillMd = join(skillDir, 'SKILL.md')
  if (!existsSync(skillMd)) {
    fail('LAY-1', 'SKILL.md is missing')
    return f
  }
  const content = readFileSync(skillMd, 'utf8')
  const dirName = basename(skillDir)

  // --- frontmatter ---
  const fm = parseFrontmatter(content)
  if (fm.raw === null) {
    fail('LAY-1/NAME-1', 'No YAML frontmatter block (--- ... ---) at the top of SKILL.md')
    return f
  }
  const name = fm.keys.get('name')
  const desc = fm.keys.get('description')

  // name (NAME-1–NAME-7 mechanical)
  for (const finding of auditRubricItems(NAME, { name, directoryName: dirName })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message)
    else warn(finding.code, finding.message)
  }

  // description (DESC-1–DESC-3 mechanical)
  for (const finding of auditRubricItems(DESC, { description: desc })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message)
    else warn(finding.code, finding.message)
  }

  // optional frontmatter (OPT-1 / OPT-2 mechanical)
  const compat = fm.keys.get('compatibility')
  for (const finding of auditRubricItems(OPTIONAL, {
    compatibility: compat,
    metadataPresent: fm.present.has('metadata'),
    metadata: fm.metadata
  })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message)
    else warn(finding.code, finding.message)
  }

  // --- body size (SIZE-1/SIZE-2 soft → WARN) ---
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)

  const scriptsDir = join(skillDir, 'scripts')
  const imports = listScriptFiles(scriptsDir).flatMap((scriptPath) =>
    relativeImportSpecifiers(readFileSync(scriptPath, 'utf8')).map((specifier) => ({
      entry: relative(scriptsDir, scriptPath),
      specifier,
      resolvesInsideScripts: resolve(dirname(scriptPath), specifier).startsWith(`${scriptsDir}/`)
    }))
  )
  for (const finding of auditRubricItems(KI_CHECKER, {
    imports,
    rootSkill: name === 'ki-skills',
    checkerModules: parseListValue(fm.keys.get('checker-modules')),
    checkerDependencies: parseListValue(fm.keys.get('checker-dependencies')),
    reporterModuleExists: existsSync(join(scriptsDir, 'lib', 'checker-reporter.ts'))
  })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message)
    else warn(finding.code, finding.message)
  }

  for (const finding of auditRubricItems(KI_SHAPE, {
    skill: createKiShapeContext(skillDir, fm, desc ?? '', body),
    ownershipCollisions: []
  })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message, finding.file)
    else warn(finding.code, finding.message, finding.file)
  }
  const bodyLines = body.split(/\r?\n/).length
  for (const finding of auditRubricItems(SIZE, { bodyLines, bodyTokens: estTok(body) })) {
    if (finding.level === 'FAIL') fail(finding.code, finding.message)
    else warn(finding.code, finding.message)
  }

  // --- per-file checks across all markdown (LAY-4, LINK-1, LINK-2, REF-3) ---
  for (const file of listMarkdownFiles(skillDir)) {
    const md = readFileSync(file, 'utf8')
    const text = stripCode(md) // exclude code blocks/spans from text-pattern checks
    const rel = file.slice(skillDir.length + 1)
    const isSkillMd = basename(file) === 'SKILL.md'
    const markdownContext = {
      markdown: text,
      relativeTargetExists: (target: string): boolean => existsSync(resolve(dirname(file), target))
    }
    for (const finding of auditRubricItems(LAYOUT, markdownContext)) {
      if (finding.level === 'FAIL') fail(finding.code, finding.message, rel)
      else warn(finding.code, finding.message, rel)
    }
    for (const finding of auditRubricItems(LINKS, markdownContext)) {
      if (finding.level === 'FAIL') fail(finding.code, finding.message, rel)
      else warn(finding.code, finding.message, rel)
    }
    // ToC on long reference files (not SKILL.md itself)
    if (!isSkillMd) {
      const lineCount = md.split(/\r?\n/).length
      for (const finding of auditRubricItems(REFERENCES, { lineCount, content: md })) {
        if (finding.level === 'FAIL') fail(finding.code, finding.message, rel)
        else warn(finding.code, finding.message, rel)
      }
    }
  }

  // --- LONG-3 / LONG-4: the declared refresh cadence ---
  // One `**Refresh:**` marker drives both. LONG-4 checks the marker is present &
  // coherent; LONG-3 WARNs when overdue against the skill's OWN cadence. WARN-only —
  // staleness is elapsed time, not a defect in the commit; a canonical · on-change
  // skill carries no clock and is exempt. Only fires where a source list exists
  // (LONG-1 leaves runtime-resolved skills without one).
  const sourcesPath = join(skillDir, 'references', 'sources.md')
  if (existsSync(sourcesPath)) {
    const context = createRefreshContext(readFileSync(sourcesPath, 'utf8'))
    for (const finding of auditRubricItems(LONGEVITY, context)) warn(finding.code, finding.message)
  }

  return f
}

const createOwnershipCollisions = (dirs: string[]): { file: string; skills: string[] }[] => {
  const byFile = new Map<string, Set<string>>()
  for (const dir of dirs) {
    const skillMd = join(dir, 'SKILL.md')
    if (!existsSync(skillMd)) continue
    const owns = parseListValue(parseFrontmatter(readFileSync(skillMd, 'utf8')).keys.get('owns'))
    for (const file of owns) {
      if (!byFile.has(file)) byFile.set(file, new Set())
      byFile.get(file)?.add(basename(dir))
    }
  }
  const collisions: { file: string; skills: string[] }[] = []
  for (const [file, skills] of byFile) if (skills.size > 1) collisions.push({ file, skills: [...skills] })
  return collisions
}

// --- main ------------------------------------------------------------------
const rawArgv = process.argv.slice(2)
const roots = rawArgv.filter((arg) => !arg.startsWith('-'))
const skillDirs = [...new Set((roots.length ? roots : ['.']).flatMap(discoverSkillDirs))].sort()
const footprintOut = rawArgv.includes('--footprint') // SIZE-5: per-skill token footprint as INFO (Mode OPTIMISE)
const refreshStatusOut = rawArgv.includes('--refresh-status') // per-skill refresh cadence status as INFO (LONG-3/§5; the REFRESH gate reads this)
const reportTarget = resolve('.')
const all: RubricFinding[] = []

function judgmentFindings(): RubricFinding[] {
  return judgmentFindingsFromItems(RUBRIC_ITEMS, RUBRIC)
}

if (skillDirs.length === 0) {
  const findings: RubricFinding[] = [
    {
      type: 'M',
      level: 'FAIL',
      code: 'LAY-1',
      message: 'No skills were found below the requested target.',
      ref: RUBRIC
    },
    ...judgmentFindings()
  ]
  emitCheckerReporter({ mode: 'audit', concern: 'skills', target: reportTarget, findings })
  process.exit(1)
}

for (const dir of skillDirs) {
  const findings = lintSkill(dir)
  for (const x of findings)
    all.push({
      type: 'M',
      level: x.severity === 'fail' ? 'FAIL' : 'WARN',
      code: x.criterion,
      message: x.message,
      ref: x.ref ?? RUBRIC,
      file: x.file ? relative(reportTarget, join(dir, x.file)) : undefined
    })
}

// cross-skill pass: collision between sibling descriptions (COLL-1)
const collisionTargets = skillDirs
  .filter((dir) => existsSync(join(dir, 'SKILL.md')))
  .map((dir) => ({
    name: basename(dir),
    description: parseFrontmatter(readFileSync(join(dir, 'SKILL.md'), 'utf8')).keys.get('description') ?? ''
  }))
all.push(...auditRubricItems(COLLISION, { targets: collisionTargets }).map((finding) => ({ ...finding, ref: RUBRIC })))
all.push(
  ...auditRubricItems(KI_SHAPE, {
    skill: null,
    ownershipCollisions: createOwnershipCollisions(skillDirs)
  }).map((finding) => ({ ...finding, ref: RUBRIC }))
)

// per-skill footprint (SIZE-5) — opt-in, INFO only, never affects the fail/warn tally or exit code
if (footprintOut) {
  for (const dir of skillDirs) {
    const fp = footprint(dir)
    const refs = fp.rows.filter((r) => r.kind === 'reference').length
    all.push({
      type: 'M',
      level: 'INFO',
      code: 'SIZE-5',
      message: `Estimated footprint is ${fp.total} tokens across description, body, and ${refs} reference file(s).`
    })
    for (const r of fp.rows) {
      const big = r.kind === 'reference' && r.tokens > FOOTPRINT_REF_NOTE_TOKENS
      all.push({
        type: 'M',
        level: 'INFO',
        code: 'SIZE-5',
        message: `Estimated ${r.kind} footprint is ${r.tokens} tokens${big ? '; consider splitting or trimming it' : '.'}`,
        file: relative(reportTarget, join(dir, r.path))
      })
    }
  }
}

// per-skill refresh status (LONG-3/§5) — opt-in, INFO only, never affects the fail/warn tally or exit code.
// The REFRESH mode's too-soon gate reads this (within-window → confirm before forcing / skip on a scheduled run).
if (refreshStatusOut) {
  for (const dir of skillDirs) {
    const sp = join(dir, 'references', 'sources.md')
    const line = existsSync(sp)
      ? (() => {
          const context = createRefreshContext(readFileSync(sp, 'utf8'))
          const status =
            context.refreshClass === null || context.cadence === null
              ? 'UNMARKED'
              : context.windowDays === null
                ? 'NO-CLOCK'
                : context.ageDays === null || context.ageDays > context.windowDays + REFRESH_GRACE_DAYS
                  ? 'OVERDUE'
                  : context.ageDays < context.windowDays
                    ? 'WITHIN-WINDOW'
                    : 'DUE'
          return `${context.refreshClass ?? 'unmarked'} · ${context.cadence ?? '—'} · last ${context.lastReviewed ?? '—'} · age ${context.ageDays ?? '—'}d · ${status}`
        })()
      : 'no sources.md'
    all.push({ type: 'M', level: 'INFO', code: 'LONG-3', message: `Refresh status: ${line}`, file: relative(reportTarget, sp) })
  }
}

all.push(...judgmentFindings())
emitCheckerReporter({ mode: 'audit', concern: 'skills', target: reportTarget, findings: all })
process.exit(checkerReporterExitCode(all))
