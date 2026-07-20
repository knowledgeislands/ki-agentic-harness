import type { FootprintRow } from './footprint.ts'
import type { ParsedFrontmatter } from './frontmatter.ts'
import { createRefreshContext, type RefreshContext } from './longevity.ts'
import { hintVerbs, isProcessSkill } from './modes.ts'

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
  localGovernanceSource: boolean
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

export type ScriptHelpEvidence = {
  subject: string
  declaresShortHelp: boolean
  declaresLongHelp: boolean
  declaresUsageText: boolean
  delegatesSharedEducator: boolean
  delegatesGovern: boolean
}

export type ScriptsRubricContext = {
  helpEvidence: readonly ScriptHelpEvidence[]
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

type RubricFamilyModule = {
  collection: string
  source: string | null
  individuallyExportedRules: number
  exportsOrderedCollection: boolean
}

export type KiCheckerRubricContext = {
  imports: readonly CheckerImport[]
  rootSkill: boolean
  declaredSharedModules: readonly string[]
  sharedDependencies: readonly string[]
  legacyLibPresent: boolean
  publishedSharedModules: readonly string[]
  rubricModuleExists: boolean
  checkerModuleExists: boolean
  reporterModuleExists: boolean
  checkerReporterModuleExists: boolean
  structuredRubricRequired: boolean
  itemsIndexExists: boolean
  itemsIndexDefinesRules: boolean
  familyModules: readonly RubricFamilyModule[]
}

type CollisionTarget = {
  name: string
  description: string
}

export type CollisionRubricContext = { targets: readonly CollisionTarget[] }

export type LongevityRubricContext = RefreshContext & { reportStatus?: boolean }

type CheckerContract = {
  name: string
  usesCanonicalChecker: boolean
}

type OwnershipCollision = {
  file: string
  skills: readonly string[]
}

export type KiShapeSkillContext = {
  governanceSkill: boolean
  localGovernanceSource: boolean
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
  checkerSource: string | null
}

export type KiShapeRubricContext = {
  skill: KiShapeSkillContext | null
  ownershipCollisions: readonly OwnershipCollision[]
  setArgumentHint?: (argumentHint: string) => void
  setVendors?: (vendors: string) => void
}

export const createKiShapeFrontmatterEvidence = ({
  frontmatter,
  description,
  scriptNames,
  localGovernanceSource = false
}: {
  frontmatter: ParsedFrontmatter
  description: string
  scriptNames: readonly string[]
  localGovernanceSource?: boolean
}): Pick<
  KiShapeSkillContext,
  'governanceSkill' | 'localGovernanceSource' | 'argumentHint' | 'hintVerbs' | 'vendorsPresent' | 'vendors' | 'scriptNames'
> => {
  const argumentHint = frontmatter.keys.get('argument-hint')
  return {
    governanceSkill: !isProcessSkill(description),
    localGovernanceSource,
    argumentHint,
    hintVerbs: hintVerbs(argumentHint ?? ''),
    vendorsPresent: frontmatter.present.has('ki-vendors'),
    vendors: (frontmatter.keys.get('ki-vendors') ?? '').trim(),
    scriptNames
  }
}

const emptyKiShapeSkill: KiShapeSkillContext = {
  governanceSkill: false,
  localGovernanceSource: false,
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
  checkerSource: null
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

/** Complete root context from which each rubric family selects its focused evidence. */
export type KiSkillsRubricContext = {
  layout: LayoutRubricContext
  frontmatter: FrontmatterRubricContext
  name: NameRubricContext
  description: DescriptionRubricContext
  optional: OptionalRubricContext
  size: SizeRubricContext
  references: ReferencesRubricContext
  scripts: ScriptsRubricContext
  checker: KiCheckerRubricContext
  link: KiLinkRubricContext
  shape: KiShapeRubricContext
  collision: CollisionRubricContext
  longevity: LongevityRubricContext
}

/** Build one complete root context while keeping each family facet focused and required. */
export const createKiSkillsRubricContext = (overrides: Partial<KiSkillsRubricContext> = {}): KiSkillsRubricContext => ({
  layout: {},
  frontmatter: { hasBlock: false, isMapping: false },
  name: { name: undefined, directoryName: '', localGovernanceSource: false },
  description: { description: undefined },
  optional: {
    compatibility: undefined,
    metadataPresent: false,
    metadata: undefined,
    allowedToolsPresent: false,
    allowedTools: undefined,
    disallowedToolsPresent: false,
    disallowedTools: undefined,
    licensePresent: false,
    license: undefined
  },
  size: {},
  references: { lineCount: 0, content: '' },
  scripts: { helpEvidence: [] },
  checker: {
    imports: [],
    rootSkill: false,
    declaredSharedModules: [],
    sharedDependencies: [],
    legacyLibPresent: false,
    publishedSharedModules: [],
    rubricModuleExists: false,
    checkerModuleExists: false,
    reporterModuleExists: false,
    checkerReporterModuleExists: false,
    structuredRubricRequired: false,
    itemsIndexExists: false,
    itemsIndexDefinesRules: false,
    familyModules: []
  },
  link: { markdown: '', relativeTargetExists: () => true },
  shape: createKiShapeContext({ skill: null }),
  collision: { targets: [] },
  longevity: createRefreshContext(null),
  ...overrides
})
