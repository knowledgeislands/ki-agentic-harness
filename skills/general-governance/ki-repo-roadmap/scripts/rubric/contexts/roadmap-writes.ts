#!/usr/bin/env bun
/** Normalize only derivable repository-roadmap projections. */
import {
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { inspectRoadmap } from './roadmap-evidence.ts'

type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
type Horizon = (typeof HORIZONS)[number]
type Item = { theme: string; title: string; slug: string; anchor: string; horizon: Horizon }
type Plan = { id: string; theme: string; name: string; fm: Record<string, string>; blocks: string[]; blockedBy: string[] }

const HORIZONS = ['Blocking', 'Next', 'Soon', 'Waiting for', 'Future'] as const
const HORIZON_BLURBS: Record<Horizon, string> = {
  Blocking:
    'Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.',
  Next: 'Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.',
  Soon: 'Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.',
  'Waiting for':
    'Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.',
  Future:
    "Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable."
}
const STANDARD_REF = 'references/standards.md'
const THEME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML
let findings: Finding[] = []
let root = ''
let roadmapDir = ''
let rootRoadmap = ''
let readme = ''

function isKb(): boolean {
  const config = join(root, '.ki-config.toml')
  if (!existsSync(config)) return false
  try {
    const parsed = TOML.parse(readFileSync(config, 'utf8')) as Record<string, unknown>
    const repoTable = parsed['ki-repo']
    return (
      parsed.repo_type === 'kb' ||
      (typeof repoTable === 'object' && repoTable !== null && (repoTable as Record<string, unknown>).repo_type === 'kb')
    )
  } catch {
    return /^\s*repo_type\s*=\s*["']kb["']/m.test(readFileSync(config, 'utf8'))
  }
}

function headings(text: string): Array<{ level: number; title: string; line: number }> {
  const result: Array<{ level: number; title: string; line: number }> = []
  let fence: '`' | '~' | null = null
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const fm = line.match(/^\s*(`{3,}|~{3,})/)
    if (fm) {
      const kind = fm[1][0] as '`' | '~'
      fence = fence === null ? kind : fence === kind ? null : fence
      continue
    }
    if (fence) continue
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (match) result.push({ level: match[1].length, title: match[2].trim(), line: index + 1 })
  }
  return result
}

function slug(title: string): string {
  return title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function headingAnchor(title: string): string {
  return title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-')
}

function parseFm(text: string): Record<string, string> {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  const result: Record<string, string> = {}
  if (!match) return result
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z-]+):\s*(.*?)\s*$/)
    if (field) result[field[1]] = field[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return result
}

const ids = (value: string | undefined): string[] =>
  !value || value.trim() === '—'
    ? []
    : value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)

const planRef = (plan: Pick<Plan, 'id'>): string => plan.id

function discover(excludedThemes = new Set<string>()): { themes: string[]; items: Item[]; plans: Plan[] } {
  const themes = readdirSync(roadmapDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !excludedThemes.has(entry.name))
    .map((entry) => entry.name)
    .sort()
  const items: Item[] = []
  const plans: Plan[] = []
  for (const theme of themes) {
    let horizon: Horizon | null = null
    for (const heading of headings(readFileSync(join(roadmapDir, theme, 'ROADMAP.md'), 'utf8'))) {
      if (heading.level === 2) horizon = HORIZONS.includes(heading.title as Horizon) ? (heading.title as Horizon) : null
      else if (heading.level === 3 && horizon)
        items.push({ theme, title: heading.title, slug: slug(heading.title), anchor: headingAnchor(heading.title), horizon })
    }
    const plansDir = join(roadmapDir, theme, 'plans')
    if (!existsSync(plansDir)) continue
    for (const name of readdirSync(plansDir)
      .filter((name) => name.endsWith('.md'))
      .sort()) {
      const fm = parseFm(readFileSync(join(plansDir, name), 'utf8'))
      plans.push({ id: fm.id, theme, name, fm, blocks: ids(fm.blocks), blockedBy: ids(fm['blocked-by']) })
    }
  }
  return { themes, items, plans }
}

function projection(items: Item[]): string {
  const lines = [
    '# Repository roadmap',
    '',
    'This portfolio view is generated from the canonical theme roadmaps under `docs/roadmap/`. Edit those files, then run `ki-repo-roadmap` CONFORM.',
    ''
  ]
  for (const horizon of HORIZONS) {
    lines.push(`## ${horizon}`, '', HORIZON_BLURBS[horizon], '')
    const selected = items
      .filter((item) => item.horizon === horizon)
      .sort((a, b) => a.theme.localeCompare(b.theme) || a.title.localeCompare(b.title))
    if (selected.length) {
      for (const item of selected) {
        const label = item.theme
          .split('-')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(' ')
        lines.push(`- [${label}: ${item.title}](docs/roadmap/${item.theme}/ROADMAP.md#${item.anchor})`)
      }
      lines.push('')
    }
  }
  return `${lines.join('\n').trimEnd()}\n`
}

function withHorizonBlurbs(text: string): string {
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const trailingEol = text.endsWith('\n')
  const lines = text.split(/\r?\n/)
  if (trailingEol) lines.pop()
  for (const horizon of [...HORIZONS].reverse()) {
    const heading = lines.findIndex((line) => line.match(/^##\s+(.+?)\s*#*\s*$/)?.[1].trim() === horizon)
    if (heading < 0) continue
    let firstContent = heading + 1
    while (lines[firstContent] === '') firstContent += 1
    if (lines[firstContent] === HORIZON_BLURBS[horizon]) {
      lines.splice(heading + 1, firstContent - heading - 1, '')
      let nextContent = heading + 3
      while (lines[nextContent] === '') nextContent += 1
      if (nextContent === lines.length) lines.splice(heading + 3)
      else lines.splice(heading + 3, nextContent - heading - 3, '')
    } else {
      const replacement = ['', HORIZON_BLURBS[horizon]]
      if (firstContent < lines.length) replacement.push('')
      lines.splice(heading + 1, firstContent - heading - 1, ...replacement)
    }
  }
  return `${lines.join(eol)}${trailingEol ? eol : ''}`
}

function withLocalPlanReferences(text: string, theme: string, plans: Plan[]): string {
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const lines = text.split(/\r?\n/)
  const plansByLocator = new Map(plans.filter((plan) => plan.theme === theme).map((plan) => [plan.fm.roadmap, plan]))
  const items: Array<{ line: number; locator: string }> = []
  let horizon: Horizon | null = null
  for (const heading of headings(text)) {
    if (heading.level === 2) {
      horizon = HORIZONS.includes(heading.title as Horizon) ? (heading.title as Horizon) : null
    } else if (heading.level === 3 && horizon) {
      items.push({ line: heading.line, locator: `${theme}/${slug(heading.title)}` })
    }
  }
  const boundaries = headings(text)
    .filter((heading) => heading.level <= 3)
    .map((heading) => heading.line)
  const output: string[] = []
  let cursor = 0
  for (const item of items) {
    const start = item.line - 1
    const end = (boundaries.find((line) => line > item.line) ?? lines.length + 1) - 1
    output.push(...lines.slice(cursor, start))
    const segment = lines.slice(start, end)
    let fence: '`' | '~' | null = null
    const withoutReferences = segment.filter((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
      if (fenceMatch) {
        const kind = fenceMatch[1][0] as '`' | '~'
        fence = fence === null ? kind : fence === kind ? null : fence
        return true
      }
      return Boolean(fence) || !line.startsWith('**Plan:**')
    })
    const plan = plansByLocator.get(item.locator)
    if (!plan) output.push(...withoutReferences)
    else {
      while (withoutReferences.at(-1) === '') withoutReferences.pop()
      output.push(...withoutReferences, '', `**Plan:** [${plan.id}](plans/${plan.name})`, '')
    }
    cursor = end
  }
  output.push(...lines.slice(cursor))
  return output.join(eol)
}

function isDerivablePlanReferenceFailure(finding: Finding): boolean {
  return (
    finding.area === 'PLAN-2' &&
    /local plan reference|has a local plan reference|must contain exactly one local reference|must have exactly one local roadmap reference/.test(
      finding.msg
    )
  )
}

function index(themes: string[], plans: Plan[]): string {
  const lines = ['# Repository roadmap index', '', 'Canonical themes and active execution plans.', '', '## Themes', '']
  for (const theme of themes) lines.push(`- [${theme}](${theme}/ROADMAP.md)`)
  lines.push('', '## Active plans', '')
  for (const plan of [...plans].sort((a, b) => planRef(a).localeCompare(planRef(b)))) {
    const blockers = plan.blockedBy.filter((reference) => plans.find((candidate) => planRef(candidate) === reference)?.fm.status !== 'done')
    const status = blockers.length ? `${plan.fm.status} (needs ${blockers.join('+')})` : plan.fm.status
    lines.push(
      `### [${planRef(plan)}](${plan.theme}/plans/${plan.name})`,
      '',
      `- **Title:** ${plan.fm.title}`,
      `- **Theme:** \`${plan.theme}\``,
      `- **Roadmap item:** \`${plan.fm.roadmap}\``,
      `- **Status:** ${status}`,
      `- **Blocks:** ${plan.fm.blocks || '—'}`,
      ''
    )
  }
  if (!plans.length) lines.push('No active plans.', '')
  lines.push('## Dependency graph', '', '```text')
  const edges = plans.flatMap((plan) => plan.blocks.map((blocked) => `${planRef(plan)} ──► ${blocked}`)).sort()
  lines.push(...(edges.length ? edges : ['No dependencies.']), '```', '')
  return lines.join('\n')
}

type PrunableTheme = { theme: string; original: string; hasPlans: boolean }
type StagedTheme = PrunableTheme & { staged: string }

function isScaffoldOnlyTheme(text: string): boolean {
  const withoutFrontmatter = text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
  for (const line of withoutFrontmatter.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^#\s+/.test(trimmed) || /^##\s+/.test(trimmed)) continue
    if (Object.values(HORIZON_BLURBS).includes(trimmed as (typeof HORIZON_BLURBS)[Horizon])) continue
    return false
  }
  return true
}

function prunableThemes(): PrunableTheme[] {
  const candidates: PrunableTheme[] = []
  for (const entry of readdirSync(roadmapDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !THEME_RE.test(entry.name)) continue
    const original = join(roadmapDir, entry.name)
    const roadmap = join(original, 'ROADMAP.md')
    const plans = join(original, 'plans')
    if (!existsSync(roadmap) || lstatSync(roadmap).isSymbolicLink() || !lstatSync(roadmap).isFile()) continue
    if (!isScaffoldOnlyTheme(readFileSync(roadmap, 'utf8'))) continue
    const children = readdirSync(original)
    if (children.some((child) => child !== 'ROADMAP.md' && child !== 'plans')) continue
    const hasPlans = existsSync(plans)
    if (hasPlans && (lstatSync(plans).isSymbolicLink() || !lstatSync(plans).isDirectory() || readdirSync(plans).length > 0)) continue
    candidates.push({ theme: entry.name, original, hasPlans })
  }
  return candidates
}

function stagePrunableThemes(candidates: PrunableTheme[]): StagedTheme[] {
  const staged: StagedTheme[] = []
  for (const candidate of candidates) {
    const stagedPath = join(dirname(roadmapDir), `.${candidate.theme}.roadmap-prune-${process.pid}-${Math.random().toString(16).slice(2)}`)
    renameSync(candidate.original, stagedPath)
    staged.push({ ...candidate, staged: stagedPath })
  }
  return staged
}

function restoreStagedThemes(themes: StagedTheme[]): string[] {
  const conflicts: string[] = []
  for (const theme of [...themes].reverse()) {
    try {
      if (existsSync(theme.original)) conflicts.push(theme.theme)
      else renameSync(theme.staged, theme.original)
    } catch {
      conflicts.push(theme.theme)
    }
  }
  return conflicts
}

function discardStagedThemes(themes: StagedTheme[]): void {
  for (const theme of themes) {
    unlinkSync(join(theme.staged, 'ROADMAP.md'))
    if (theme.hasPlans) rmdirSync(join(theme.staged, 'plans'))
    rmdirSync(theme.staged)
  }
}

function rejectUnsafe(path: string, display: string): boolean {
  const current = entry(path)
  if (current?.isSymbolicLink()) {
    findings.push({ level: 'FAIL', area: 'SAFE-1', msg: 'refusing to replace a symlink output path', ref: STANDARD_REF, file: display })
    return true
  }
  if (current && !current.isFile()) {
    findings.push({ level: 'FAIL', area: 'SAFE-1', msg: 'generated output must be a regular file', ref: STANDARD_REF, file: display })
    return true
  }
  return false
}

function entry(path: string): ReturnType<typeof lstatSync> | null {
  try {
    return lstatSync(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

function outputBytes(path: string): string | null {
  const current = entry(path)
  if (!current) return null
  if (current.isSymbolicLink() || !current.isFile()) throw new Error(`unsafe generated output: ${path}`)
  return readFileSync(path, 'utf8')
}

function atomicWrite(path: string, content: string, expected: string | null): void {
  mkdirSync(dirname(path), { recursive: true })
  const temp = join(dirname(path), `.${Date.now()}-${process.pid}-${Math.random().toString(16).slice(2)}.tmp`)
  const fd = openSync(temp, 'wx', 0o644)
  try {
    writeFileSync(fd, content)
    fsyncSync(fd)
  } finally {
    closeSync(fd)
  }
  try {
    const current = outputBytes(path)
    if (current !== expected) throw new Error(`output changed before publication: ${path}`)
    if (expected === null) {
      linkSync(temp, path)
      unlinkSync(temp)
    } else renameSync(temp, path)
  } catch (error) {
    if (existsSync(temp)) unlinkSync(temp)
    throw error
  }
}

export const conformRoadmap = (target: string, dryRun: boolean): Finding[] => {
  root = resolve(target)
  roadmapDir = join(root, 'docs', 'roadmap')
  rootRoadmap = join(root, 'ROADMAP.md')
  readme = join(roadmapDir, 'README.md')
  findings = []
  try {
    if (!existsSync(root) || !lstatSync(root).isDirectory()) {
      findings.push({ level: 'FAIL', area: 'PROFILE-1', msg: 'repository directory does not exist', ref: STANDARD_REF })
      emit()
    }
    if (isKb()) {
      findings.push({
        level: 'NA',
        area: 'SCOPE-1',
        msg: 'KB repository: use ki-kb-streams; no repository-roadmap files changed',
        ref: STANDARD_REF
      })
      emit()
    }
    const auditResults = inspectRoadmap(root)
    const nonDerivable = auditResults.filter(
      (finding) =>
        finding.level === 'FAIL' &&
        !['PROJ-1', 'INDEX-1', 'ROAD-4', 'THEME-3'].includes(finding.area) &&
        !isDerivablePlanReferenceFailure(finding)
    )
    if (nonDerivable.length) {
      findings.push(...nonDerivable)
      findings.push({
        level: 'FAIL',
        area: 'SAFE-1',
        msg: 'refusing generation until non-derivable audit failures are resolved',
        ref: STANDARD_REF
      })
      emit()
    }

    if (!existsSync(roadmapDir)) {
      if (rejectUnsafe(rootRoadmap, 'ROADMAP.md')) emit()
      const current = outputBytes(rootRoadmap)
      if (current === null) {
        findings.push({ level: 'FAIL', area: 'PROFILE-1', msg: 'simple profile has no ROADMAP.md', ref: STANDARD_REF, file: 'ROADMAP.md' })
        emit()
      }
      const content = withHorizonBlurbs(current)
      if (current === content)
        findings.push({ level: 'PASS', area: 'ROAD-4', msg: 'horizon blurbs already canonical', ref: STANDARD_REF, file: 'ROADMAP.md' })
      else if (dryRun)
        findings.push({
          level: 'POLISH',
          area: 'ROAD-4',
          msg: 'would insert missing horizon blurbs (dry-run; not written)',
          ref: STANDARD_REF,
          file: 'ROADMAP.md'
        })
      else {
        atomicWrite(rootRoadmap, content, current)
        findings.push({
          level: 'POLISH',
          area: 'ROAD-4',
          msg: 'inserted missing horizon blurbs atomically',
          ref: STANDARD_REF,
          file: 'ROADMAP.md'
        })
      }
      emit()
    }
    if (rejectUnsafe(rootRoadmap, 'ROADMAP.md') || rejectUnsafe(readme, 'docs/roadmap/README.md')) emit()

    const prunable = prunableThemes()
    const emptyThemeFiles = new Set(
      auditResults.filter((finding) => finding.level === 'FAIL' && finding.area === 'THEME-3').map((finding) => finding.file)
    )
    const unprunable = [...emptyThemeFiles].filter((file) => !prunable.some((theme) => file === `docs/roadmap/${theme.theme}/ROADMAP.md`))
    if (unprunable.length) {
      findings.push({
        level: 'FAIL',
        area: 'SAFE-1',
        msg: `refusing to prune empty theme(s) with retained authored content or plans: ${unprunable.join(', ')}`,
        ref: STANDARD_REF
      })
      emit()
    }

    const stagedThemes = dryRun ? [] : stagePrunableThemes(prunable)
    if (!dryRun) {
      const postAuditResults = inspectRoadmap(root)
      if (!postAuditResults) {
        const conflicts = restoreStagedThemes(stagedThemes)
        findings.push({
          level: 'FAIL',
          area: 'SAFE-1',
          msg: `post-prune audit did not return valid JSON${conflicts.length ? `; restore conflicts: ${conflicts.join(', ')}` : ''}`,
          ref: STANDARD_REF
        })
        emit()
      }
      const postPruneFailures = postAuditResults.filter(
        (finding) =>
          finding.level === 'FAIL' && !['PROJ-1', 'INDEX-1', 'ROAD-4'].includes(finding.area) && !isDerivablePlanReferenceFailure(finding)
      )
      if (postPruneFailures.length) {
        const conflicts = restoreStagedThemes(stagedThemes)
        findings.push(...postPruneFailures)
        findings.push({
          level: 'FAIL',
          area: 'SAFE-1',
          msg: `refusing to prune an empty theme with retained authored content${conflicts.length ? `; restore conflicts: ${conflicts.join(', ')}` : ''}`,
          ref: STANDARD_REF
        })
        emit()
      }
    }

    const { themes, items, plans } = discover(new Set(prunable.map((theme) => theme.theme)))
    const authoredOutputs = themes.map((theme) => {
      const path = join(roadmapDir, theme, 'ROADMAP.md')
      const original = readFileSync(path, 'utf8')
      const withBlurbs = withHorizonBlurbs(original)
      const content = withLocalPlanReferences(withBlurbs, theme, plans)
      return {
        path,
        display: `docs/roadmap/${theme}/ROADMAP.md`,
        areas: [
          ...(original === withBlurbs ? [] : ['ROAD-4']),
          ...(withBlurbs === content ? [] : ['PLAN-2']),
          ...(original === content ? ['ROAD-4'] : [])
        ],
        content
      }
    })
    if (authoredOutputs.some((output) => rejectUnsafe(output.path, output.display))) emit()
    const outputs = [
      ...authoredOutputs,
      { path: rootRoadmap, display: 'ROADMAP.md', areas: ['PROJ-1'], content: projection(items) },
      { path: readme, display: 'docs/roadmap/README.md', areas: ['INDEX-1'], content: index(themes, plans) }
    ]
    const snapshots = new Map(outputs.map((output) => [output.path, outputBytes(output.path)]))
    const written: typeof outputs = []
    try {
      for (const output of outputs) {
        const current = snapshots.get(output.path) ?? null
        if (current === output.content) {
          for (const area of output.areas)
            findings.push({ level: 'PASS', area, msg: 'already canonical', ref: STANDARD_REF, file: output.display })
        } else if (dryRun) {
          for (const area of output.areas)
            findings.push({
              level: 'POLISH',
              area,
              msg: 'would regenerate (dry-run; not written)',
              ref: STANDARD_REF,
              file: output.display
            })
        } else {
          atomicWrite(output.path, output.content, current)
          written.push(output)
          for (const area of output.areas)
            findings.push({ level: 'POLISH', area, msg: 'regenerated atomically', ref: STANDARD_REF, file: output.display })
        }
      }
    } catch (error) {
      const conflicts: string[] = []
      for (const output of written.reverse()) {
        const before = snapshots.get(output.path) ?? null
        try {
          if (outputBytes(output.path) !== output.content) {
            conflicts.push(output.display)
            continue
          }
          if (before === null) unlinkSync(output.path)
          else atomicWrite(output.path, before, output.content)
        } catch {
          conflicts.push(output.display)
        }
      }
      findings.push({
        level: 'FAIL',
        area: 'SAFE-1',
        msg: `generation transaction failed: ${(error as Error).message}${conflicts.length ? `; rollback conflicts: ${conflicts.join(', ')}` : ''}`,
        ref: STANDARD_REF
      })
      const stagedConflicts = restoreStagedThemes(stagedThemes)
      if (stagedConflicts.length)
        findings.push({ level: 'FAIL', area: 'SAFE-1', msg: `prune rollback conflicts: ${stagedConflicts.join(', ')}`, ref: STANDARD_REF })
      emit()
    }
    try {
      if (!dryRun) discardStagedThemes(stagedThemes)
      for (const theme of prunable)
        findings.push({
          level: 'POLISH',
          area: 'THEME-3',
          msg: dryRun ? 'would prune empty theme directory (dry-run; not written)' : 'pruned empty theme directory',
          ref: STANDARD_REF,
          file: `docs/roadmap/${theme.theme}`
        })
    } catch (error) {
      const conflicts = restoreStagedThemes(stagedThemes)
      findings.push({
        level: 'FAIL',
        area: 'SAFE-1',
        msg: `failed to finalize empty-theme pruning: ${(error as Error).message}${conflicts.length ? `; restore conflicts: ${conflicts.join(', ')}` : ''}`,
        ref: STANDARD_REF
      })
    }
  } catch (result) {
    if (result === findings) return findings
    throw result
  }
  return findings
}

function emit(): never {
  throw findings
}
