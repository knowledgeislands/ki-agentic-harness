/**
 * Where work packages live and what each holds, read for the `ki-work-package` STRUCTURE and FOLDER families: the
 * packages under `work/<territory>/<work id>/`, each with its sub-packages; each package against its closed list,
 * `_index.md`, `NN-<slug>.change.md` change documents and sub-packages of the same shape; whether its Changes section
 * links every change document and sub-package; finished work still standing; and the earlier copies of packages left in
 * the retired working areas. The listings name candidates; they are never permission to delete.
 */
import { type Dirent, existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'

/** The store's folder of packages, `work/<territory>/<work id>/`, under PACKAGE-STORE (9 November 2026). */
export const WORK_DIRECTORY = 'work'
/** The package's entry file under INDEX-ENTRY (Kris, 8 November 2026), its leading underscore sorting it first. */
export const ENTRY_FILE = '_index.md'
const KEBAB = '[a-z0-9]+(?:-[a-z0-9]+)*'
/** A change document, `NN-<slug>.change.md`, numbered in tens by group under PACKAGE-SHAPE. */
export const CHANGE_DOCUMENT = new RegExp(`^\\d{2}-${KEBAB}\\.change\\.md$`)
/** A territory folder's name, and a sub-package folder's slug. */
export const SLUG = new RegExp(`^${KEBAB}$`)
/** The retired working areas, in each of which a package left behind is an earlier copy, listed under the tidy. */
export const EARLIER_AREAS = ['_WORK', '_WORK_REVIEW', '_THREADS', '_CHECKPOINTS'] as const

/** One package or sub-package folder, with the id its place gives it. */
export type PackageFolder = {
  readonly path: string
  readonly subject: string
  readonly name: string
  readonly territory: string
  /** The id the folder's place gives it: its own name at the top, `<parent id>.<slug>` for a sub-package. */
  readonly expectedId: string
  readonly parent?: PackageFolder
}

export type Layout = { readonly packages: readonly PackageFolder[]; readonly violations: readonly AuditOutcome[] }

export type FolderOutcomes = {
  readonly closed: readonly AuditOutcome[]
  readonly finished: readonly AuditOutcome[]
  readonly changes: readonly AuditOutcome[]
}

const physicalDirectory = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isDirectory()
export const physicalFile = (path: string): boolean =>
  existsSync(path) && !lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()

const entries = (folder: string): Dirent[] =>
  readdirSync(folder, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))

const one = (outcomes: readonly AuditOutcome[], pass: string, absent?: string): readonly AuditOutcome[] => {
  if (absent) return [{ status: 'NOT_APPLICABLE', message: absent }]
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: pass }]
}

const plainFile = (entry: Dirent): boolean => entry.isFile() && !entry.isSymbolicLink()

/** A folder inside a package that is a sub-package: a physical directory named by a slug, holding its entry file. */
const isSubPackage = (folder: string, entry: Dirent): boolean =>
  entry.isDirectory() &&
  !entry.isSymbolicLink() &&
  SLUG.test(entry.name) &&
  physicalFile(join(folder, entry.name, ENTRY_FILE))

/** A package folder and every sub-package below it, depth first. */
const withSubPackages = (folder: PackageFolder, root: string): PackageFolder[] => [
  folder,
  ...entries(folder.path)
    .filter((entry) => isSubPackage(folder.path, entry))
    .flatMap((entry) => {
      const path = join(folder.path, entry.name)
      return withSubPackages(
        {
          path,
          subject: relative(root, path),
          name: entry.name,
          territory: folder.territory,
          expectedId: `${folder.expectedId}.${entry.name}`,
          parent: folder
        },
        root
      )
    })
]

/**
 * The packages under `work/`, or undefined when it is absent: `work/` holds only territory folders, each only package
 * folders, each a physical directory holding its entry file, with no empty folder.
 */
export const workLayout = (root: string): Layout | undefined => {
  const directory = join(root, WORK_DIRECTORY)
  if (!existsSync(directory)) return undefined
  const subject = (path: string): string => relative(root, path)
  if (!physicalDirectory(directory))
    return {
      packages: [],
      violations: [{ status: 'VIOLATION', message: '`work/` must be a physical directory', subject: WORK_DIRECTORY }]
    }
  const packages: PackageFolder[] = []
  const violations: AuditOutcome[] = []
  for (const territory of entries(directory)) {
    const area = join(directory, territory.name)
    if (!territory.isDirectory() || territory.isSymbolicLink()) {
      violations.push({
        status: 'VIOLATION',
        message: '`work/` holds only territory folders, each a physical directory',
        subject: subject(area)
      })
      continue
    }
    if (!SLUG.test(territory.name))
      violations.push({
        status: 'VIOLATION',
        message: "a territory folder is named by its territory, the first segment of its packages' ids",
        subject: subject(area)
      })
    const held = entries(area)
    if (held.length === 0)
      violations.push({ status: 'VIOLATION', message: 'no empty folders: remove it', subject: subject(area) })
    for (const entry of held) {
      const path = join(area, entry.name)
      if (!entry.isDirectory() || entry.isSymbolicLink()) {
        violations.push({
          status: 'VIOLATION',
          message: 'a territory folder holds only package folders, each a physical directory',
          subject: subject(path)
        })
        continue
      }
      if (!physicalFile(join(path, ENTRY_FILE))) {
        violations.push({
          status: 'VIOLATION',
          message: `a package folder holds its entry file, \`${ENTRY_FILE}\`, as a regular file`,
          subject: subject(path)
        })
        continue
      }
      packages.push(
        ...withSubPackages(
          { path, subject: subject(path), name: entry.name, territory: territory.name, expectedId: entry.name },
          root
        )
      )
    }
  }
  return { packages, violations }
}

/**
 * Entries of a package folder outside its closed list: anything but `_index.md`, change documents and sub-packages,
 * each named relative to the package.
 */
export const packageStray = (folder: string): readonly string[] =>
  entries(folder).flatMap((entry) => {
    if (plainFile(entry) && (entry.name === ENTRY_FILE || CHANGE_DOCUMENT.test(entry.name))) return []
    if (isSubPackage(folder, entry)) return []
    return [entry.isDirectory() && !entry.isSymbolicLink() ? `${entry.name}/` : entry.name]
  })

/** The change documents directly in a package folder. */
export const changeDocuments = (folder: string): readonly string[] =>
  entries(folder)
    .filter((entry) => plainFile(entry) && CHANGE_DOCUMENT.test(entry.name))
    .map((entry) => entry.name)

/** The sub-package folder names directly in a package folder. */
export const subPackages = (folder: string): readonly string[] =>
  entries(folder)
    .filter((entry) => isSubPackage(folder, entry))
    .map((entry) => entry.name)

/** The text of a body's `## <heading>` section, its deeper headings included, or undefined when it has none. */
export const sectionText = (body: string, heading: string): string | undefined => {
  const match = new RegExp(`^## ${heading}[ \\t]*$([\\s\\S]*?)(?=^# |^## |(?![\\s\\S]))`, 'm').exec(body)
  return match ? (match[1] ?? '') : undefined
}

/** The relative link targets in a text, each without its anchor or a leading `./`. */
const linkTargets = (text: string): ReadonlySet<string> =>
  new Set(
    Array.from(text.matchAll(/\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)/g), (match) =>
      (match[1] ?? '').split('#')[0]?.replace(/^\.\//, '')
    ).filter((target): target is string => Boolean(target))
  )

/** The change documents and sub-packages a package's Changes section does not link. */
export const unlinkedChanges = (folder: string): readonly string[] => {
  const text = sectionText(readFileSync(join(folder, ENTRY_FILE), 'utf8'), 'Changes') ?? ''
  const targets = linkTargets(text)
  return [
    ...changeDocuments(folder).filter((name) => !targets.has(name)),
    ...subPackages(folder)
      .filter((name) => ![name, `${name}/`, `${name}/${ENTRY_FILE}`].some((target) => targets.has(target)))
      .map((name) => `${name}/`)
  ]
}

const frontField = (path: string, field: string): string | undefined => {
  if (!existsSync(path)) return undefined
  const head = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, 'utf8'))?.[1] ?? ''
  const value = new RegExp(`^${field}:[ \\t]*['"]?([^'"\\n]*?)['"]?[ \\t]*$`, 'm').exec(head)?.[1]
  return value === undefined || value === '' ? undefined : value
}

/**
 * Whether a finished work's package is still standing and so awaits its close-out, whatever its mark: no coordinator
 * reads a Finished work's package, so territory work closes it under the `ki-work-package` close-out.
 */
export const awaitsCloseOut = (folder: string): boolean => frontField(join(folder, ENTRY_FILE), 'state') === 'finished'

export const folderOutcomes = (root: string, layout = workLayout(root)): FolderOutcomes => {
  const absent = layout ? undefined : 'No `work/` folder is present.'
  const closed: AuditOutcome[] = []
  const finished: AuditOutcome[] = []
  const changes: AuditOutcome[] = []
  for (const folder of layout?.packages ?? []) {
    const stray = packageStray(folder.path)
    if (stray.length > 0)
      closed.push({
        status: 'VIOLATION',
        message: `a package holds only \`${ENTRY_FILE}\`, its change documents \`NN-<slug>.change.md\` and sub-packages of the same shape; outside the closed list: ${stray.join(', ')}`,
        subject: folder.subject
      })
    if (folder.parent && changeDocuments(folder.path).length === 0)
      closed.push({
        status: 'VIOLATION',
        message: `a sub-package holds its \`${ENTRY_FILE}\` and one or more change documents`,
        subject: folder.subject
      })
    const unlinked = unlinkedChanges(folder.path)
    if (unlinked.length > 0)
      changes.push({
        status: 'VIOLATION',
        message: `\`${ENTRY_FILE}\`'s Changes section links every change document and sub-package; not linked: ${unlinked.join(', ')}`,
        subject: join(folder.subject, ENTRY_FILE)
      })
    if (!folder.parent && awaitsCloseOut(folder.path))
      finished.push({
        status: 'VIOLATION',
        message:
          "finished work's package is still standing; territory work closes it at an owner-authorised mark whose report names it, deleting it in one commit once the close-out checks hold, and otherwise asks the owner",
        subject: folder.subject
      })
  }
  const count = layout?.packages.length ?? 0
  return {
    closed: one(closed, `The ${count} package(s) hold only their closed list.`, absent),
    finished: one(finished, "No finished work's package is left standing.", absent),
    changes: one(changes, 'Every package links each of its change documents and sub-packages.', absent)
  }
}
