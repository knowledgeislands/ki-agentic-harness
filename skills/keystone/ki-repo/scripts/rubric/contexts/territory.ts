import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import type { RepoEvidenceFinding } from './audit.ts'

/**
 * Capital declaration, territory membership, and the registry-backed agreement check.
 *
 * A repository names its territory Capital in `[skills.ki-repo].capital`; a Capital names
 * itself and alone declares `[skills.ki-repo.territory]`. Agreement is checked only through
 * the local ki registry and the `.ki.toml` files of registered checkouts. Nothing here
 * scans the filesystem or consults an Agora.
 */

const CANONICAL_REPOSITORY =
  /^https:\/\/github\.com\/([a-z0-9](?:[a-z0-9._-]*[a-z0-9])?)\/([a-z0-9](?:[a-z0-9._-]*[a-z0-9])?)$/
const TERRITORY_KEYS = new Set(['name', 'members'])

const table = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined

const canonical = (value: unknown): value is string => typeof value === 'string' && CANONICAL_REPOSITORY.test(value)

const physicalFile = (path: string): boolean => {
  if (!existsSync(path)) return false
  const state = lstatSync(path)
  return state.isFile() && !state.isSymbolicLink()
}

const physicalDirectory = (path: string): boolean => {
  if (!existsSync(path)) return false
  const state = lstatSync(path)
  return state.isDirectory() && !state.isSymbolicLink()
}

/** The declarations a territory check reads from one `.ki.toml`. */
type Declaration = {
  repository?: unknown
  capital?: unknown
  territory?: unknown
  /** `[skills.ki-trades]` when the repository declares the skill. */
  trades?: Record<string, unknown>
}

const declaration = (document: Record<string, unknown>): Declaration => {
  const skills = table(document.skills) ?? {}
  const repo = table(skills['ki-repo']) ?? {}
  const trades = table(skills['ki-trades'])
  return {
    repository: repo.repository,
    capital: repo.capital,
    territory: repo.territory,
    ...(trades ? { trades } : {})
  }
}

type Checkout = Declaration & { root: string }

/** Registry location: `$KI_STATE_HOME`, else `$XDG_STATE_HOME/ki`, else `~/.local/state/ki`. */
const registryPath = (userHome: string): string => {
  if (process.env.KI_STATE_HOME) return join(resolve(process.env.KI_STATE_HOME), 'registry.toml')
  const stateHome = process.env.XDG_STATE_HOME ? resolve(process.env.XDG_STATE_HOME) : join(userHome, '.local', 'state')
  return join(stateHome, 'ki', 'registry.toml')
}

/** A registered checkout whose `.ki.toml` exists but cannot be read, attributed by the registry entry's claim. */
type Unreadable = { root: string; repository?: string }

type Registry = { checkouts: readonly Checkout[]; unreadable: readonly Unreadable[]; issue?: string }

const readRegistry = (userHome: string): Registry => {
  const path = registryPath(userHome)
  if (!physicalFile(path)) return { checkouts: [], unreadable: [] }
  let document: Record<string, unknown>
  try {
    document = Bun.TOML.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return { checkouts: [], unreadable: [], issue: `local registry ${path} is not valid TOML` }
  }
  const checkouts: Checkout[] = []
  const unreadable: Unreadable[] = []
  for (const value of Object.values(table(document.repositories) ?? {})) {
    const entry = table(value)
    const root = entry?.path
    if (typeof root !== 'string' || !isAbsolute(root) || !physicalDirectory(root)) continue
    const real = realpathSync(root)
    const config = join(real, '.ki.toml')
    if (!physicalFile(config)) continue
    try {
      checkouts.push({
        root: real,
        ...declaration(Bun.TOML.parse(readFileSync(config, 'utf8')) as Record<string, unknown>)
      })
    } catch {
      // An unreadable checkout declares nothing; only the registry entry's claim can attribute it.
      unreadable.push({ root: real, ...(canonical(entry?.repository) ? { repository: entry.repository } : {}) })
    }
  }
  return { checkouts, unreadable }
}

/** Registered checkouts whose own `.ki.toml` declares `repository`, never the registry entry's claim. */
const declaring = (registry: Registry, repository: string): readonly Checkout[] =>
  registry.checkouts.filter((checkout) => checkout.repository === repository)

const isCapital = (value: Declaration): boolean =>
  canonical(value.repository) && value.capital === value.repository && table(value.territory) !== undefined

const members = (value: Declaration): readonly string[] => {
  const listed = table(value.territory)?.members
  return Array.isArray(listed) ? listed.filter((member): member is string => typeof member === 'string') : []
}

const paths = (checkouts: readonly Checkout[]): string => checkouts.map(({ root }) => root).join(', ')

const unavailableMessage = (capital: string): string => `territory policy lives in ${capital}, not available here`

export type TerritoryEvidence = {
  terr1: readonly AuditOutcome[]
  terr2: readonly AuditOutcome[]
  terr3: readonly AuditOutcome[]
  /** The COV-1 `trades` signal, when the resolved Capital policy names this repository. */
  coverage: readonly RepoEvidenceFinding[]
  /** The Capital URL TERR-1 conform may insert, when it is unambiguously inferable. */
  inferredCapital?: string
}

const NO_CONFIGURATION: TerritoryEvidence = {
  terr1: [
    {
      status: 'VIOLATION',
      message: '.ki.toml is absent or unreadable; [skills.ki-repo].capital is required',
      subject: '.ki.toml'
    }
  ],
  terr2: [{ status: 'NOT_APPLICABLE', message: 'no readable .ki.toml declares a territory' }],
  terr3: [{ status: 'NOT_APPLICABLE', message: 'no readable .ki.toml declares a Capital' }],
  coverage: []
}

const territoryShape = (local: Declaration): readonly AuditOutcome[] => {
  const subject = '.ki.toml [skills.ki-repo.territory]'
  const territory = table(local.territory)
  if (local.territory !== undefined && !territory)
    return [{ status: 'VIOLATION', message: '[skills.ki-repo.territory] must be a table', subject }]
  if (!territory)
    return [{ status: 'VIOLATION', message: 'a Capital must declare [skills.ki-repo.territory]', subject }]
  const outcomes: AuditOutcome[] = []
  for (const key of Object.keys(territory)
    .filter((key) => !TERRITORY_KEYS.has(key))
    .sort())
    outcomes.push({
      status: 'VIOLATION',
      message: `[skills.ki-repo.territory] key ${key} is not allowed; use name and members`,
      subject
    })
  if (typeof territory.name !== 'string' || territory.name.trim().length === 0)
    outcomes.push({ status: 'VIOLATION', message: 'territory name must be a non-empty string', subject })
  const listed = territory.members
  if (!Array.isArray(listed) || listed.length === 0) {
    outcomes.push({
      status: 'VIOLATION',
      message: 'territory members must be a non-empty array of canonical HTTPS GitHub URLs',
      subject
    })
    return outcomes
  }
  const invalid = listed.filter((member) => !canonical(member))
  for (const member of invalid)
    outcomes.push({
      status: 'VIOLATION',
      message: `territory member ${JSON.stringify(member)} is not a canonical HTTPS GitHub URL`,
      subject
    })
  const valid = listed.filter(canonical)
  const duplicates = [...new Set(valid.filter((member, index) => valid.indexOf(member) !== index))]
  for (const member of duplicates)
    outcomes.push({ status: 'VIOLATION', message: `territory member ${member} is listed more than once`, subject })
  if (invalid.length === 0 && valid.some((member, index) => index > 0 && (valid[index - 1] ?? '') > member))
    outcomes.push({ status: 'VIOLATION', message: 'territory members must be sorted in ascending order', subject })
  if (!valid.includes(local.repository as string))
    outcomes.push({
      status: 'VIOLATION',
      message: `territory members must include the Capital's own repository ${String(local.repository)}`,
      subject
    })
  return outcomes.length > 0 ? outcomes : [{ status: 'PASS', message: 'territory table is well formed' }]
}

/** A member resolves its Capital through its own declaration and the local registry. */
const memberAgreement = (
  repository: string,
  capital: string,
  registry: Registry
): { outcomes: readonly AuditOutcome[]; policy?: Checkout } => {
  const subject = '.ki.toml [skills.ki-repo].capital'
  const found = declaring(registry, capital)
  const broken = registry.unreadable.filter((checkout) => checkout.repository === capital)
  if (found.length === 0 && broken.length > 0)
    return {
      outcomes: broken.map(({ root }) => ({
        status: 'VIOLATION' as const,
        message: `Capital ${capital}: registered checkout at ${root} has an unreadable .ki.toml`,
        subject
      }))
    }
  if (found.length === 0)
    return { outcomes: [{ status: 'VIOLATION', level: 'WARN', message: unavailableMessage(capital), subject }] }
  if (found.length > 1)
    return {
      outcomes: [
        {
          status: 'VIOLATION',
          message: `Capital ${capital} is ambiguous: ${found.length} registered checkouts declare it (${paths(found)})`,
          subject
        }
      ]
    }
  const [checkout] = found as [Checkout]
  if (!isCapital(checkout))
    return {
      outcomes: [
        {
          status: 'VIOLATION',
          message: `${capital} is registered at ${checkout.root} but is not a Capital: it must name itself as capital and declare [skills.ki-repo.territory]`,
          subject
        }
      ]
    }
  if (!members(checkout).includes(repository))
    return {
      outcomes: [
        {
          status: 'VIOLATION',
          message: `Capital ${capital} does not list ${repository} in its territory members`,
          subject
        }
      ]
    }
  return {
    outcomes: [{ status: 'PASS', message: `Capital ${capital} lists this repository as a territory member` }],
    policy: checkout
  }
}

/** A Capital checks that each locally registered member names it back. */
const capitalAgreement = (local: Declaration & { repository: string }, registry: Registry): AuditOutcome[] => {
  const outcomes: AuditOutcome[] = []
  for (const member of members(local)) {
    if (member === local.repository || !canonical(member)) continue
    const subject = `.ki.toml [skills.ki-repo.territory] ${member}`
    const found = declaring(registry, member)
    if (found.length === 0) outcomes.push({ status: 'INFO', message: `${member} not checked out here`, subject })
    else if (found.length > 1)
      outcomes.push({
        status: 'VIOLATION',
        message: `territory member ${member} is ambiguous: ${found.length} registered checkouts declare it (${paths(found)})`,
        subject
      })
    else if (found[0]?.capital !== local.repository)
      outcomes.push({
        status: 'VIOLATION',
        message:
          found[0]?.capital === undefined
            ? `territory member ${member} declares no capital; it must name ${local.repository}`
            : `territory member ${member} names capital ${JSON.stringify(found[0]?.capital)}, not ${local.repository}`,
        subject
      })
  }
  return outcomes.some((outcome) => outcome.status === 'VIOLATION')
    ? outcomes
    : [{ status: 'PASS', message: 'every locally registered territory member names this Capital' }, ...outcomes]
}

/** Whether any channel of the Capital's trade policy names `repository` as an endpoint. */
const namedInChannels = (policy: Declaration, repository: string): boolean => {
  const channels = table(table(policy.trades)?.territory)?.channels
  if (!Array.isArray(channels)) return false
  return channels.some((channel) => {
    const value = table(channel)
    return [value?.from, value?.to].some((side) => Array.isArray(side) && side.includes(repository))
  })
}

const inferCapital = (local: Declaration, registry: Registry): string | undefined => {
  if (!canonical(local.repository)) return undefined
  if (local.territory !== undefined) return local.repository
  const capitals = registry.checkouts.filter(
    (checkout) => isCapital(checkout) && members(checkout).includes(local.repository as string)
  )
  const urls = [...new Set(capitals.map(({ repository }) => repository as string))]
  return urls.length === 1 && capitals.length === 1 ? urls[0] : undefined
}

const capitalGuidance = (local: Declaration, registry: Registry): string => {
  if (!canonical(local.repository))
    return 'declare [skills.ki-repo].repository first, then capital = "<canonical HTTPS GitHub URL of the territory Capital>"'
  const capitals = registry.checkouts.filter(
    (checkout) => isCapital(checkout) && members(checkout).includes(local.repository as string)
  )
  if (capitals.length > 1)
    return `several registered Capitals list ${local.repository} (${paths(capitals)}); declare the governing one explicitly`
  return `no registered Capital lists ${local.repository}; declare capital = "<canonical HTTPS GitHub URL of the territory Capital>", or this repository's own URL if it is a Capital`
}

export const territoryEvidence = (configSource: string | undefined, userHome: string): TerritoryEvidence => {
  if (configSource === undefined || configSource.length === 0) return NO_CONFIGURATION
  let document: Record<string, unknown>
  try {
    document = Bun.TOML.parse(configSource) as Record<string, unknown>
  } catch {
    return {
      ...NO_CONFIGURATION,
      terr1: [
        { status: 'VIOLATION', message: '.ki.toml is not valid TOML; capital cannot be read', subject: '.ki.toml' }
      ]
    }
  }
  const local = declaration(document)
  const registry = readRegistry(userHome)
  const registryNote: AuditOutcome[] = registry.issue ? [{ status: 'INFO', message: registry.issue }] : []
  const subject = '.ki.toml [skills.ki-repo].capital'

  if (local.capital === undefined || local.capital === '') {
    const inferred = inferCapital(local, registry)
    return {
      terr1: [
        {
          status: 'VIOLATION',
          message: inferred
            ? `[skills.ki-repo].capital is required; conform can declare ${inferred}`
            : `[skills.ki-repo].capital is required: ${capitalGuidance(local, registry)}`,
          subject
        }
      ],
      terr2: [{ status: 'NOT_APPLICABLE', message: 'capital is undeclared; TERR-1 reports it' }],
      terr3: [{ status: 'NOT_APPLICABLE', message: 'capital is undeclared; TERR-1 reports it' }],
      coverage: [],
      ...(inferred ? { inferredCapital: inferred } : {})
    }
  }
  if (!canonical(local.capital))
    return {
      terr1: [
        {
          status: 'VIOLATION',
          message: `[skills.ki-repo].capital ${JSON.stringify(local.capital)} must be a full canonical HTTPS GitHub URL such as https://github.com/owner/repository`,
          subject
        }
      ],
      terr2: [{ status: 'NOT_APPLICABLE', message: 'capital is malformed; TERR-1 reports it' }],
      terr3: [{ status: 'NOT_APPLICABLE', message: 'capital is malformed; TERR-1 reports it' }],
      coverage: []
    }
  const terr1: AuditOutcome[] = [{ status: 'PASS', message: `capital is declared as ${local.capital}` }]
  if (!canonical(local.repository))
    return {
      terr1,
      terr2: [{ status: 'NOT_APPLICABLE', message: 'repository identity is invalid; FILES-2 reports it' }],
      terr3: [{ status: 'NOT_APPLICABLE', message: 'repository identity is invalid; FILES-2 reports it' }],
      coverage: []
    }
  const repository = local.repository
  if (local.capital === repository) {
    // A Capital's channels live in its own [skills.ki-trades], so it can never lack the table they name.
    return {
      terr1,
      terr2: territoryShape(local),
      terr3: [...capitalAgreement({ ...local, repository }, registry), ...registryNote],
      coverage: []
    }
  }
  const terr2: readonly AuditOutcome[] =
    local.territory === undefined
      ? [{ status: 'NOT_APPLICABLE', message: 'not a Capital; territory membership is declared by the Capital' }]
      : [
          {
            status: 'VIOLATION',
            message: `only a Capital may declare [skills.ki-repo.territory]; this repository names ${local.capital} as its Capital`,
            subject: '.ki.toml [skills.ki-repo.territory]'
          }
        ]
  const member = memberAgreement(repository, local.capital, registry)
  return {
    terr1,
    terr2,
    terr3: [...member.outcomes, ...registryNote],
    coverage:
      member.policy && namedInChannels(member.policy, repository) && !local.trades ? [tradesSignal(repository)] : []
  }
}

const tradesSignal = (repository: string): RepoEvidenceFinding => ({
  level: 'FAIL',
  code: 'COV-1',
  message: `the territory trade policy names ${repository} in a channel, but .ki.toml declares no [skills.ki-trades]`,
  subject: '.ki.toml'
})

const REPO_TABLE_HEADER = /^\s*\[\s*skills\s*\.\s*(?:ki-repo|"ki-repo"|'ki-repo')\s*\]\s*(?:#.*)?$/
const TABLE_HEADER = /^\s*\[/
const SINGLE_LINE_KEY = (key: string): RegExp =>
  new RegExp(`^\\s*${key}\\s*=\\s*(?:"[^"\\n]*"|'[^'\\n]*')\\s*(?:#.*)?$`)

/**
 * Insert `capital = "<url>"` directly after the title line of `[skills.ki-repo]`, or after the
 * repository line when there is no title, replacing an empty `capital = ""` placeholder in
 * place. Returns undefined when the edit cannot be made safely.
 */
export const declareCapital = (source: string, capital: string): string | undefined => {
  const lines = source.split('\n')
  const header = lines.findIndex((line) => REPO_TABLE_HEADER.test(line))
  if (header === -1) return undefined
  let end = lines.length
  for (let index = header + 1; index < lines.length; index++)
    if (TABLE_HEADER.test(lines[index] ?? '')) {
      end = index
      break
    }
  const within = (pattern: RegExp): number => {
    for (let index = header + 1; index < end; index++) if (pattern.test(lines[index] ?? '')) return index
    return -1
  }
  const declaration = `capital = ${JSON.stringify(capital)}`
  const placeholder = within(/^\s*capital\s*=/)
  if (placeholder !== -1) {
    if (!SINGLE_LINE_KEY('capital').test(lines[placeholder] ?? '')) return undefined
    lines[placeholder] = declaration
  } else {
    const title = within(SINGLE_LINE_KEY('title'))
    const anchor = title !== -1 ? title : within(SINGLE_LINE_KEY('repository'))
    lines.splice((anchor !== -1 ? anchor : header) + 1, 0, declaration)
  }
  const result = lines.join('\n')
  try {
    const parsed = Bun.TOML.parse(result) as Record<string, unknown>
    return table(table(parsed.skills)?.['ki-repo'])?.capital === capital ? result : undefined
  } catch {
    return undefined
  }
}
