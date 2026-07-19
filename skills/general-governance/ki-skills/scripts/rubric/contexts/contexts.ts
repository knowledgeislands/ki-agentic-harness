import type { FootprintRow } from './footprint.ts'
import type { RefreshContext } from './longevity.ts'

export type DescriptionRubricContext = {
  description: string | undefined
}

export type FrontmatterRubricContext = {
  hasBlock: boolean
  isMapping: boolean
}

export type NameRubricContext = {
  name: string | undefined
  directoryName: string
  setName?: (name: string) => void
}

export type OptionalRubricContext = {
  compatibility: string | undefined
  metadataPresent: boolean
  metadata: unknown
  allowedToolsPresent: boolean
  allowedTools: unknown
  disallowedToolsPresent: boolean
  disallowedTools: unknown
  licensePresent: boolean
  license: unknown
}

export type SizeRubricContext = {
  bodyLines?: number
  bodyTokens?: number
  footprint?: { total: number; rows: readonly FootprintRow[] }
}

export type ReferencesRubricContext = {
  lineCount: number
  content: string
}

export type LayoutRubricContext = {
  markdown?: string
  subject?: string
  writeMarkdown?: (markdown: string) => void
  missingSkillRoot?: boolean
  noSkillsFound?: boolean
  standaloneMarkdownFile?: boolean
  supportDirectories?: readonly string[]
}

export type KiLinkRubricContext = {
  markdown: string
  relativeTargetExists: (target: string) => boolean
}

type CheckerImport = {
  entry: string
  specifier: string
  resolvesInsideScripts: boolean
}

export type KiCheckerRubricContext = {
  imports: readonly CheckerImport[]
  rootSkill: boolean
  checkerModules: readonly string[]
  checkerDependencies: readonly string[]
  reporterModuleExists: boolean
}

type CollisionTarget = {
  name: string
  description: string
}

export type CollisionRubricContext = { targets: readonly CollisionTarget[] }

export type LongevityRubricContext = RefreshContext & { reportStatus?: boolean }

type CheckerContract = {
  name: string
  usesReporter: boolean
}

type OwnershipCollision = {
  file: string
  skills: readonly string[]
}

export type KiShapeSkillContext = {
  governanceSkill: boolean
  argumentHint: string | undefined
  hintVerbs: readonly string[]
  vendorsPresent: boolean
  vendors: string
  scriptNames: readonly string[]
  operatingModesSection: string | null
  bodyModes: ReadonlySet<string>
  operatingModesIntro: string
  flatModeHeadings: readonly string[]
  bareModeHeadings: readonly string[]
  refreshText: string
  retiredExtensionFiles: readonly string[]
  strongGate: boolean
  anchorMentioned: boolean
  checkerReadsAnchor: boolean
  mechanicalRubricCount: number
  hasChecker: boolean
  documentsMechanicalDelegation: boolean
  checkers: readonly CheckerContract[]
  dependsOnPresent: boolean
  dependsOn: string
  owns: readonly string[]
  contributes: readonly string[]
  requires: readonly string[]
  scaffoldedFiles: readonly string[]
  auditSource: string | null
}

export type KiShapeRubricContext = {
  skill: KiShapeSkillContext | null
  ownershipCollisions: readonly OwnershipCollision[]
  setArgumentHint?: (argumentHint: string) => void
  setVendors?: (vendors: string) => void
}

const emptyKiShapeSkill: KiShapeSkillContext = {
  governanceSkill: false,
  argumentHint: undefined,
  hintVerbs: [],
  vendorsPresent: false,
  vendors: '',
  scriptNames: [],
  operatingModesSection: null,
  bodyModes: new Set(),
  operatingModesIntro: '',
  flatModeHeadings: [],
  bareModeHeadings: [],
  refreshText: '',
  retiredExtensionFiles: [],
  strongGate: false,
  anchorMentioned: false,
  checkerReadsAnchor: false,
  mechanicalRubricCount: 0,
  hasChecker: false,
  documentsMechanicalDelegation: false,
  checkers: [],
  dependsOnPresent: false,
  dependsOn: '',
  owns: [],
  contributes: [],
  requires: [],
  scaffoldedFiles: [],
  auditSource: null
}

export const createKiShapeContext = ({
  skill,
  ownershipCollisions = [],
  setArgumentHint,
  setVendors
}: {
  skill: Partial<KiShapeSkillContext> | null
  ownershipCollisions?: readonly OwnershipCollision[]
  setArgumentHint?: (argumentHint: string) => void
  setVendors?: (vendors: string) => void
}): KiShapeRubricContext => ({
  skill: skill === null ? null : { ...emptyKiShapeSkill, ...skill },
  ownershipCollisions,
  setArgumentHint,
  setVendors
})

/** Evidence assembled by `audit.ts` for one valid skill. */
export type KiSkillsAuditContext = {
  skillLayout: LayoutRubricContext
  frontmatter: FrontmatterRubricContext
  name: NameRubricContext
  description: DescriptionRubricContext
  optional: OptionalRubricContext
  checker: KiCheckerRubricContext
  shape: KiShapeRubricContext
  size: SizeRubricContext
}

/** Evidence assembled for one Markdown file during audit. */
export type KiSkillsMarkdownAuditContext = {
  layout: LayoutRubricContext
  link: KiLinkRubricContext
  references?: ReferencesRubricContext
}

/** Capabilities and current evidence assembled by `conform.ts` for one skill. */
export type KiSkillsConformContext = {
  name: NameRubricContext
  shape: KiShapeRubricContext
}
