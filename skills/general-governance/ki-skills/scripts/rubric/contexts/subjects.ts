import { existsSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import type { RubricMode } from '../../lib/rubric.ts'
import { type ConformDocumentState, createConformDocumentState, createSkillConformState } from './conform.ts'
import { createKiShapeContext, createKiSkillsRubricContext, type KiSkillsRubricContext } from './contexts.ts'
import { createFootprint } from './footprint.ts'
import { parseFrontmatter } from './frontmatter.ts'
import { createRefreshContext } from './longevity.ts'
import { createSkillRubricContext, frontmatterList } from './skill.ts'
import { discoverSkillDirs, listMarkdownFiles } from './skill-files.ts'
import { stripCode } from './text.ts'

export type KiSkillsSubjectScope =
  | 'target'
  | 'invalidSkill'
  | 'skill'
  | 'markdown'
  | 'reference'
  | 'longevity'
  | 'collision'
  | 'ownership'
  | 'footprint'
  | 'refreshStatus'

export type KiSkillsSubject = {
  scope: KiSkillsSubjectScope
  context: () => KiSkillsRubricContext
  subject?: string
}

export type KiSkillsSubjects = {
  subjects: readonly KiSkillsSubject[]
  persist: () => void
}

/** Applicable rubric families for each kind of evidence subject. */
export const KI_SKILLS_SUBJECT_FAMILIES = {
  target: ['LAY'],
  invalidSkill: ['LAY', 'FM'],
  skill: ['LAY', 'FM', 'NAME', 'DESC', 'OPT', 'SIZE', 'BODY', 'SCRIPT', 'KI-CHECKER', 'KI-SHAPE', 'KI-INVOKE', 'PROC'],
  markdown: ['LAY', 'KI-LINK'],
  reference: ['LAY', 'KI-LINK', 'REF'],
  longevity: ['LONG'],
  collision: ['COLL'],
  ownership: ['KI-SHAPE'],
  footprint: ['SIZE'],
  refreshStatus: ['LONG']
} as const satisfies Record<KiSkillsSubjectScope, readonly string[]>

const markdownSubject = ({
  file,
  mode,
  reportTarget,
  skillDirectory,
  document
}: {
  file: string
  mode: RubricMode
  reportTarget: string
  skillDirectory: string
  document?: ConformDocumentState
}): KiSkillsSubject => {
  const isSkill = basename(file) === 'SKILL.md'
  const subject = mode === 'audit' ? relative(reportTarget, file) : relative(skillDirectory, file)
  return {
    scope: isSkill ? 'markdown' : 'reference',
    subject,
    context: () => {
      const markdown = document?.read() ?? readFileSync(file, 'utf8')
      const text = stripCode(markdown)
      return createKiSkillsRubricContext({
        layout: {
          markdown: mode === 'conform' ? markdown : text,
          subject,
          ...(document ? { writeMarkdown: document.write } : {})
        },
        link: { markdown: text, relativeTargetExists: (target) => existsSync(resolve(dirname(file), target)) },
        references: { lineCount: markdown.split(/\r?\n/).length, content: markdown }
      })
    }
  }
}

const ownershipCollisions = (directories: readonly string[]): { file: string; skills: string[] }[] => {
  const byFile = new Map<string, Set<string>>()
  for (const directory of directories) {
    const owns = frontmatterList(parseFrontmatter(readFileSync(join(directory, 'SKILL.md'), 'utf8')).keys.get('owns'))
    for (const file of owns) {
      if (!byFile.has(file)) byFile.set(file, new Set())
      byFile.get(file)?.add(basename(directory))
    }
  }
  return [...byFile].flatMap(([file, skills]) => (skills.size > 1 ? [{ file, skills: [...skills] }] : []))
}

/** Discover one scope and construct the same complete subjects for AUDIT and CONFORM. */
export const createKiSkillsSubjects = ({
  mode,
  roots,
  reportTarget,
  footprint = false,
  refreshStatus = false,
  dryRun = false
}: {
  mode: RubricMode
  roots: readonly string[]
  reportTarget: string
  footprint?: boolean
  refreshStatus?: boolean
  dryRun?: boolean
}): KiSkillsSubjects => {
  const skillDirectories = [...new Set((roots.length ? roots : ['.']).flatMap(discoverSkillDirs))].sort()
  const subjects: KiSkillsSubject[] = []
  const persist: Array<() => void> = []

  for (const root of roots) {
    const target = resolve(root)
    if (!existsSync(target)) continue
    const stat = statSync(target)
    const discovered = discoverSkillDirs(target)
    const context = createKiSkillsRubricContext({
      layout: {
        missingSkillRoot: stat.isDirectory() && discovered.length === 0 && !existsSync(join(target, 'SKILL.md')),
        standaloneMarkdownFile: stat.isFile() && extname(target).toLowerCase() === '.md'
      }
    })
    subjects.push({ scope: 'target', context: () => context })
  }

  if (skillDirectories.length === 0) {
    if (subjects.length === 0) {
      const context = createKiSkillsRubricContext({ layout: { noSkillsFound: true } })
      subjects.push({ scope: 'target', context: () => context })
    }
    return { subjects, persist: () => {} }
  }

  for (const skillDirectory of skillDirectories) {
    const conform = mode === 'conform' ? createSkillConformState(skillDirectory, dryRun) : undefined
    const skill = createSkillRubricContext(skillDirectory, conform?.capabilities)
    const skillSubject = mode === 'conform' ? relative(reportTarget, skillDirectory) || '.' : undefined
    subjects.push({
      scope: skill.validFrontmatter ? 'skill' : 'invalidSkill',
      context: skill.context,
      ...(skillSubject ? { subject: skillSubject } : {})
    })
    if (conform) persist.push(conform.persist)
    if (!skill.validFrontmatter) continue

    for (const file of listMarkdownFiles(skillDirectory)) {
      const document =
        mode === 'conform'
          ? file === join(skillDirectory, 'SKILL.md')
            ? conform?.document
            : createConformDocumentState(file, dryRun)
          : undefined
      if (document && document !== conform?.document) persist.push(document.persist)
      subjects.push(markdownSubject({ file, mode, reportTarget, skillDirectory, document }))
    }

    const sourcesPath = join(skillDirectory, 'references', 'sources.md')
    if (existsSync(sourcesPath)) {
      const context = createKiSkillsRubricContext({ longevity: createRefreshContext(readFileSync(sourcesPath, 'utf8')) })
      subjects.push({ scope: 'longevity', context: () => context })
    }

    if (footprint) {
      const measured = createFootprint(skillDirectory)
      const context = createKiSkillsRubricContext({
        size: {
          footprint: {
            total: measured.total,
            rows: measured.rows.map((row) => ({ ...row, path: relative(reportTarget, join(skillDirectory, row.path)) }))
          }
        }
      })
      subjects.push({ scope: 'footprint', context: () => context })
    }

    if (refreshStatus) {
      const context = createKiSkillsRubricContext({
        longevity: { ...createRefreshContext(existsSync(sourcesPath) ? readFileSync(sourcesPath, 'utf8') : null), reportStatus: true }
      })
      subjects.push({ scope: 'refreshStatus', subject: relative(reportTarget, sourcesPath), context: () => context })
    }
  }

  const collision = createKiSkillsRubricContext({
    collision: {
      targets: skillDirectories.map((directory) => ({
        name: basename(directory),
        description: parseFrontmatter(readFileSync(join(directory, 'SKILL.md'), 'utf8')).keys.get('description') ?? ''
      }))
    }
  })
  subjects.push({ scope: 'collision', context: () => collision })

  const ownership = createKiSkillsRubricContext({
    shape: createKiShapeContext({ skill: null, ownershipCollisions: ownershipCollisions(skillDirectories) })
  })
  subjects.push({ scope: 'ownership', context: () => ownership })

  return {
    subjects,
    persist: () =>
      persist.forEach((write) => {
        write()
      })
  }
}
