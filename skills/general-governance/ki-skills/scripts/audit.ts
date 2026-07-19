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
//   bun scripts/audit.ts <skill> --footprint   # include per-skill token measurements for optimisation
//   bun scripts/audit.ts skills --refresh-status # include per-skill refresh class/cadence/status
//   bun run ki:skills:audit                              # (from the ki-agentic-harness repo root)
//
// A path containing SKILL.md is treated as one skill; otherwise its immediate
// subdirectories that contain a SKILL.md are each linted. Defaults to the current dir.
// Exits non-zero if any FAIL is reported (WARN never fails the run).
//
// With >= 2 skills in scope it also runs a cross-skill collision pass:
// two descriptions declaring the same quoted trigger phrase are WARNed.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { checkerReporterExitCode, emitCheckerReporter, judgmentFindingsFromItems } from './lib/checker-reporter.ts'
import { auditRubricItems, type RubricFinding } from './lib/rubric/rubric.ts'
import { COLLISION } from './rubrics/collision.ts'
import { DESC } from './rubrics/description.ts'
import { FRONTMATTER } from './rubrics/frontmatter.ts'
import { RUBRIC_ITEMS } from './rubrics/index.ts'
import { KI_CHECKER } from './rubrics/ki-checker.ts'
import { KI_LINK } from './rubrics/ki-link.ts'
import { createKiShapeContext, KI_SHAPE, type KiShapeSkillContext } from './rubrics/ki-shape.ts'
import { LAYOUT } from './rubrics/layout.ts'
import { LONGEVITY } from './rubrics/longevity.ts'
import { NAME } from './rubrics/name.ts'
import { OPTIONAL } from './rubrics/optional.ts'
import { REFERENCES } from './rubrics/references.ts'
import { SIZE } from './rubrics/size.ts'
import { createFootprint, estimateTokens } from './rubrics/support/footprint.ts'
import { frontmatterList, parseFrontmatter, type ParsedFrontmatter } from './rubrics/support/frontmatter.ts'
import { createRefreshContext } from './rubrics/support/longevity.ts'
import { endorsesRetiredExtension, extractBodyModes, extractSection, hintVerbs, isProcessSkill } from './rubrics/support/modes.ts'
import { discoverSkillDirs, listMarkdownFiles, listScriptFiles } from './rubrics/support/skill-files.ts'
import { stripCode } from './rubrics/support/text.ts'
import { relativeImportSpecifiers } from './rubrics/support/typescript.ts'

// Every ki-skills criterion is defined in this skill's rubric — the default reference pointer.
const RUBRIC = 'references/rubric.md'

const appendFindings = (target: RubricFinding[], findings: readonly RubricFinding[], file?: string): void => {
  target.push(...findings.map((finding) => ({ ...finding, ref: finding.ref ?? RUBRIC, file: file ?? finding.file })))
}

const appendRubricFindings = <Context>(
  target: RubricFinding[],
  items: Parameters<typeof auditRubricItems<Context>>[0],
  context: Context,
  file?: string
): void => appendFindings(target, auditRubricItems(items, context), file)

const createKiShapeEvidence = (skillDir: string, frontmatter: ParsedFrontmatter, description: string, body: string): KiShapeSkillContext => {
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
    .filter((name) => (name === 'audit.ts' || name.startsWith('audit-') || name.startsWith('lint-')) && name.endsWith('.ts') && !name.endsWith('.test.ts'))
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
    bareModeHeadings: section ? [...stripCode(section).matchAll(/^###\s+(?!Mode\b)(\S[^\n]*)/gim)].map((match) => (match[1] as string).trim()) : [],
    refreshText: `${refreshSection}${existsSync(refreshReference) ? `\n${readFileSync(refreshReference, 'utf8')}` : ''}`,
    retiredExtensionFiles: markdownFiles
      .filter((file) => endorsesRetiredExtension(basename(file) === 'SKILL.md' ? body : readFileSync(file, 'utf8')))
      .map((file) => file.slice(skillDir.length + 1)),
    strongGate: /do not edit[^.\n]*directly|go through (a )?proposal|standing directive|installing the gate/i.test(stripCode(skillText)),
    anchorMentioned: /CLAUDE\.md|AGENTS\.md|always-loaded|installing the gate|\banchor/i.test(skillText),
    checkerReadsAnchor: scriptNames.some((name) => name.endsWith('.ts') && /CLAUDE\.md|AGENTS\.md/.test(readFileSync(join(scriptsDir, name), 'utf8'))),
    mechanicalRubricCount: (rubric.match(/\[M\]/g) ?? []).length,
    hasChecker: scriptNames.some((name) => name.endsWith('.ts')),
    documentsMechanicalDelegation: /lint:md|toolchain (?:already )?enforces/i.test(rubric),
    checkers,
    dependsOnPresent: frontmatter.present.has('depends-on'),
    dependsOn: (frontmatter.keys.get('depends-on') ?? '').trim(),
    owns: frontmatterList(frontmatter.keys.get('owns')),
    contributes: frontmatterList(frontmatter.keys.get('contributes')),
    requires: frontmatterList(frontmatter.keys.get('requires')),
    scaffoldedFiles,
    auditSource: existsSync(auditPath) ? readFileSync(auditPath, 'utf8') : null
  }
}

const lintSkill = (skillDir: string): RubricFinding[] => {
  const findings: RubricFinding[] = []

  const skillMd = join(skillDir, 'SKILL.md')
  if (!existsSync(skillMd)) {
    appendRubricFindings(findings, LAYOUT, { missingSkillRoot: true })
    return findings
  }
  const content = readFileSync(skillMd, 'utf8')
  const dirName = basename(skillDir)

  const supportDirectories = readdirSync(skillDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  appendRubricFindings(findings, LAYOUT, { supportDirectories })

  // --- frontmatter ---
  const fm = parseFrontmatter(content)
  appendRubricFindings(findings, FRONTMATTER, { hasBlock: fm.raw !== null, isMapping: fm.isMapping })
  if (!fm.isMapping) {
    return findings
  }
  const name = fm.keys.get('name')
  const desc = fm.keys.get('description')

  // Name fields
  appendRubricFindings(findings, NAME, { name, directoryName: dirName })

  // Description fields
  appendRubricFindings(findings, DESC, { description: desc })

  // Optional frontmatter: audit.ts extracts typed YAML context; each rubric
  // callback owns the criterion-specific validation.
  const compat = fm.keys.get('compatibility')
  appendRubricFindings(findings, OPTIONAL, {
    compatibility: compat,
    metadataPresent: fm.present.has('metadata'),
    metadata: fm.values.metadata,
    allowedToolsPresent: fm.present.has('allowed-tools'),
    allowedTools: fm.values['allowed-tools'],
    disallowedToolsPresent: fm.present.has('disallowed-tools'),
    disallowedTools: fm.values['disallowed-tools'],
    licensePresent: fm.present.has('license'),
    license: fm.values.license
  })

  // Body measurements
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)

  const scriptsDir = join(skillDir, 'scripts')
  const imports = listScriptFiles(scriptsDir).flatMap((scriptPath) =>
    relativeImportSpecifiers(readFileSync(scriptPath, 'utf8')).map((specifier) => ({
      entry: relative(scriptsDir, scriptPath),
      specifier,
      resolvesInsideScripts: resolve(dirname(scriptPath), specifier).startsWith(`${scriptsDir}/`)
    }))
  )
  appendRubricFindings(findings, KI_CHECKER, {
    imports,
    rootSkill: name === 'ki-skills',
    checkerModules: frontmatterList(fm.keys.get('checker-modules')),
    checkerDependencies: frontmatterList(fm.keys.get('checker-dependencies')),
    reporterModuleExists: existsSync(join(scriptsDir, 'lib', 'checker-reporter.ts'))
  })

  appendRubricFindings(findings, KI_SHAPE, {
    ...createKiShapeContext({ skill: createKiShapeEvidence(skillDir, fm, desc ?? '', body) })
  })
  const bodyLines = body.split(/\r?\n/).length
  appendRubricFindings(findings, SIZE, { bodyLines, bodyTokens: estimateTokens(body) })

  // Per-file Markdown checks
  for (const file of listMarkdownFiles(skillDir)) {
    const md = readFileSync(file, 'utf8')
    const text = stripCode(md) // exclude code blocks/spans from text-pattern checks
    const rel = file.slice(skillDir.length + 1)
    const isSkillMd = basename(file) === 'SKILL.md'
    const markdownContext = {
      markdown: text,
      relativeTargetExists: (target: string): boolean => existsSync(resolve(dirname(file), target))
    }
    appendRubricFindings(findings, LAYOUT, markdownContext, rel)
    appendRubricFindings(findings, KI_LINK, markdownContext, rel)
    // ToC on long reference files (not SKILL.md itself)
    if (!isSkillMd) {
      const lineCount = md.split(/\r?\n/).length
      appendRubricFindings(findings, REFERENCES, { lineCount, content: md }, rel)
    }
  }

  // Refresh-cadence checks apply only where a source list exists.
  const sourcesPath = join(skillDir, 'references', 'sources.md')
  if (existsSync(sourcesPath)) {
    const context = createRefreshContext(readFileSync(sourcesPath, 'utf8'))
    appendRubricFindings(findings, LONGEVITY, context)
  }

  return findings
}

const createOwnershipCollisions = (dirs: string[]): { file: string; skills: string[] }[] => {
  const byFile = new Map<string, Set<string>>()
  for (const dir of dirs) {
    const skillMd = join(dir, 'SKILL.md')
    if (!existsSync(skillMd)) continue
    const owns = frontmatterList(parseFrontmatter(readFileSync(skillMd, 'utf8')).keys.get('owns'))
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
const directTargetLayoutFindings = roots.flatMap((root) => {
  const target = resolve(root)
  if (!existsSync(target)) return []
  const stat = statSync(target)
  const discovered = discoverSkillDirs(target)
  return auditRubricItems(LAYOUT, {
    missingSkillRoot: stat.isDirectory() && discovered.length === 0 && !existsSync(join(target, 'SKILL.md')),
    standaloneMarkdownFile: stat.isFile() && extname(target).toLowerCase() === '.md'
  })
})
const footprintOut = rawArgv.includes('--footprint')
const refreshStatusOut = rawArgv.includes('--refresh-status')
const reportTarget = resolve('.')
const all: RubricFinding[] = []

const judgmentFindings = (): RubricFinding[] => judgmentFindingsFromItems(RUBRIC_ITEMS, RUBRIC)

if (skillDirs.length === 0) {
  const findings: RubricFinding[] = [
    ...directTargetLayoutFindings.map((finding) => ({ ...finding, ref: RUBRIC })),
    ...(directTargetLayoutFindings.length === 0 ? auditRubricItems(LAYOUT, { noSkillsFound: true }).map((finding) => ({ ...finding, ref: RUBRIC })) : []),
    ...judgmentFindings()
  ]
  emitCheckerReporter({ mode: 'audit', concern: 'skills', target: reportTarget, findings })
  process.exit(1)
}

for (const dir of skillDirs) {
  appendFindings(
    all,
    lintSkill(dir).map((finding) => ({
      ...finding,
      file: finding.file ? relative(reportTarget, join(dir, finding.file)) : undefined
    }))
  )
}

// Cross-skill description checks
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

// Per-skill footprint — opt-in, INFO only, never affects the fail/warn tally or exit code.
if (footprintOut) {
  for (const dir of skillDirs) {
    const fp = createFootprint(dir)
    all.push(
      ...auditRubricItems(SIZE, { footprint: fp }).map((finding) => ({
        ...finding,
        file: finding.file ? relative(reportTarget, join(dir, finding.file)) : undefined
      }))
    )
  }
}

// Per-skill refresh status — opt-in, INFO only, never affects the fail/warn tally or exit code.
if (refreshStatusOut) {
  for (const dir of skillDirs) {
    const sp = join(dir, 'references', 'sources.md')
    const context = createRefreshContext(existsSync(sp) ? readFileSync(sp, 'utf8') : null)
    all.push(
      ...auditRubricItems(LONGEVITY, { ...context, reportStatus: true }).map((finding) => ({
        ...finding,
        file: relative(reportTarget, sp)
      }))
    )
  }
}

all.push(...judgmentFindings())
emitCheckerReporter({ mode: 'audit', concern: 'skills', target: reportTarget, findings: all })
process.exit(checkerReporterExitCode(all))
