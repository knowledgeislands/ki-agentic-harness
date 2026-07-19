import type {
  AuditOutcome,
  ConformOutcome,
  RubricDefinition,
  RubricItem,
  RubricOutcomes,
  ViolationLevel
} from '../../vendored/ki-skills/rubric.ts'
import type { RepoRubricContext } from '../contexts/contexts.ts'

const STANDARD = 'standards.md'

const mechanicalItem = (
  code: string,
  title: string,
  description: string,
  level: ViolationLevel = 'FAIL',
  overrideLevels: readonly ViolationLevel[] = []
): RubricItem<RepoRubricContext> => ({
  code,
  title,
  description,
  sources: [STANDARD],
  mechanical: {
    level,
    ...(overrideLevels.length > 0 ? { overrideLevels } : {}),
    audit: {
      phase: 'INSPECT',
      run: (context) => context.outcomes(code) as RubricOutcomes<AuditOutcome>
    },
    conform: {
      phase: 'PRIMARY',
      run: (context) => context.outcomes(code) as RubricOutcomes<ConformOutcome>
    }
  }
})

const judgmentItem = (code: string, title: string, description: string, prompt: string): RubricItem<RepoRubricContext> => ({
  code,
  title,
  description,
  sources: [STANDARD],
  judgment: { prompt }
})

const ITEMS = [
  mechanicalItem(
    'FILES-1',
    'Required repository files',
    'README, license, gitignore, editor configuration, Claude orientation, and the exact ki-repo config marker are present.'
  ),
  mechanicalItem(
    'FILES-2',
    'Derived metadata is ignored',
    'Derived .ki-meta audit and conform artifacts are ignored rather than committed.',
    'WARN'
  ),
  mechanicalItem(
    'FILES-3',
    'Authoring baseline and self-check',
    'A governed repository declares ki-authoring and carries a repository-local self-check runner.'
  ),
  judgmentItem(
    'FILES-J1',
    'Repository document content',
    'README and license content is accurate and current.',
    'Read the README and license and assess whether they accurately describe and license this repository.'
  ),
  mechanicalItem('GH-1', 'Default branch', 'The default branch is main.'),
  mechanicalItem('GH-2', 'Declared license alignment', 'The declared license agrees with GitHub and package.json.'),
  mechanicalItem(
    'GH-3',
    'Description presence and synchronisation',
    'The GitHub description is non-empty and matches package.json when that source exists.'
  ),
  mechanicalItem(
    'PKG-1',
    'Package identity metadata',
    'package.json carries coherent identity and repository metadata when present.',
    'FAIL',
    ['WARN']
  ),
  mechanicalItem('MERGE-1', 'Merge policy', 'The repository permits squash merges only and deletes merged head branches.'),
  mechanicalItem(
    'TOGGLE-1',
    'Repository feature toggles',
    'Issues are enabled and Wiki and Projects are disabled unless explicitly overridden.'
  ),
  mechanicalItem('VIS-1', 'Declared visibility', 'Live GitHub visibility matches the valid visibility declared in .ki-config.toml.'),
  mechanicalItem(
    'TOPICS-1',
    'Public repository topics',
    'A public repository carries the standard topic set unless explicitly overridden.'
  ),
  mechanicalItem(
    'BP-1',
    'Branch protection',
    'Main has the configured branch-protection posture, including required PR, build check, and linear history when enabled.'
  ),
  mechanicalItem(
    'DEP-1',
    'Dependabot and branch freshness',
    'Dependabot alerts and updates are enabled and pull-request branches may be updated.',
    'FAIL',
    ['WARN']
  ),
  mechanicalItem(
    'SEC-1',
    'Secret scanning protection',
    'Public repositories enable secret scanning and push protection unless explicitly overridden.',
    'FAIL',
    ['WARN']
  ),
  mechanicalItem(
    'ACT-1',
    'Actions policy',
    'GitHub Actions allowed_actions is all; tighter deliberate policies are reported as warnings.',
    'WARN',
    ['FAIL']
  ),
  mechanicalItem('CHECKS-1', 'Override keys', 'Every ki-repo checks override names a supported overridable concern.', 'WARN'),
  mechanicalItem(
    'COV-1',
    'Governance coverage cascade',
    'Detected governance applicability and declared opt-in tables agree, subject to explicit coverage overrides.',
    'WARN'
  ),
  mechanicalItem('STRUCT-1', 'Single repository structure', 'A repository declares at most one repo-structure governance table.'),
  mechanicalItem(
    'STRUCT-2',
    'Repository structure presence',
    'A repository normally declares one repo-structure table unless explicitly exempted.',
    'WARN'
  ),
  mechanicalItem(
    'VENDOR-1',
    'Vendored payload integrity',
    'Manifest-listed .ki-meta payloads exist and match their recorded hashes.',
    'FAIL',
    ['WARN']
  ),
  mechanicalItem(
    'CAPABILITY-COMPLETE',
    'Governance capability completeness',
    'Every declared governance root has regular manifest-listed EDUCATE, AUDIT, and CONFORM payloads.'
  ),
  mechanicalItem(
    'ACCESS-1',
    'GitHub access and archive state',
    'GitHub reachability is reported without manufacturing drift when offline, and archived repositories are skipped.',
    'WARN',
    ['FAIL']
  ),
  mechanicalItem(
    'RUNTIMES-1',
    'Supported runtime declaration',
    'ki-repo declares a non-empty, duplicate-free list containing only supported runtimes.'
  ),
  judgmentItem(
    'RUNTIMES-J1',
    'Runtime orientation split',
    'Multi-runtime repositories use a shared AGENTS.md orientation with a thin Claude import unless a justified exception applies.',
    'Review whether orientation is shared cleanly across the declared runtimes without duplicated or Claude-only instructions.'
  ),
  judgmentItem(
    'LINK-1',
    'Development command links',
    'Repository-local symlinks are an explicit development-only action owned by the self-contained ki-repo linker.',
    'Review local command linking for deliberate development-only use, regular-copy defaults, and no imports outside ki-repo.'
  ),
  judgmentItem(
    'DESCFIT-1',
    'Description fit',
    'The repository description accurately and concisely describes its purpose.',
    'Read the repository and judge whether its one-sentence description fits its actual purpose.'
  ),
  judgmentItem(
    'OVR-J1',
    'Override rationale',
    'Every checks override represents a warranted repository-specific decision.',
    'Review each configured override and confirm that it records a real exception rather than hiding drift.'
  ),
  judgmentItem(
    'SYNC-1',
    'Standard synchronisation',
    'The standard, structured rubric, and executable behaviour remain aligned.',
    'Compare the standard, generated rubric, and checker behaviour for semantic drift.'
  )
] as const

/** Stable rule identities; semantic family modules re-export these in catalogue order. */
export const FILES_1 = ITEMS[0]
export const FILES_2 = ITEMS[1]
export const FILES_3 = ITEMS[2]
export const FILES_J1 = ITEMS[3]
export const GH_1 = ITEMS[4]
export const GH_2 = ITEMS[5]
export const GH_3 = ITEMS[6]
export const PKG_1 = ITEMS[7]
export const MERGE_1 = ITEMS[8]
export const TOGGLE_1 = ITEMS[9]
export const VIS_1 = ITEMS[10]
export const TOPICS_1 = ITEMS[11]
export const BP_1 = ITEMS[12]
export const DEP_1 = ITEMS[13]
export const SEC_1 = ITEMS[14]
export const ACT_1 = ITEMS[15]
export const CHECKS_1 = ITEMS[16]
export const COV_1 = ITEMS[17]
export const STRUCT_1 = ITEMS[18]
export const STRUCT_2 = ITEMS[19]
export const VENDOR_1 = ITEMS[20]
export const CAPABILITY_COMPLETE = ITEMS[21]
export const ACCESS_1 = ITEMS[22]
export const RUNTIMES_1 = ITEMS[23]
export const RUNTIMES_J1 = ITEMS[24]
export const LINK_1 = ITEMS[25]
export const DESCFIT_1 = ITEMS[26]
export const OVR_J1 = ITEMS[27]
export const SYNC_1 = ITEMS[28]

const FAMILY_METADATA: Record<string, { title: string; description: string }> = {
  FILES: { title: 'Repository files', description: 'Required local files and repository document quality.' },
  GH: { title: 'Core GitHub settings', description: 'Default branch, licensing, and repository description.' },
  PKG: { title: 'Package metadata', description: 'Package identity and repository metadata.' },
  MERGE: { title: 'Merge policy', description: 'GitHub merge and branch-cleanup behaviour.' },
  TOGGLE: { title: 'Repository features', description: 'Issues, Wiki, and Projects settings.' },
  VIS: { title: 'Visibility', description: 'Declared and live repository visibility.' },
  TOPICS: { title: 'Topics', description: 'Public repository topic conventions.' },
  BP: { title: 'Branch protection', description: 'Optional main-branch protection.' },
  DEP: { title: 'Dependency security', description: 'Dependabot and branch freshness.' },
  SEC: { title: 'Secret protection', description: 'Secret scanning and push protection.' },
  ACT: { title: 'Actions policy', description: 'GitHub Actions permissions.' },
  CHECKS: { title: 'Check overrides', description: 'Per-repository override schema.' },
  COV: { title: 'Governance coverage', description: 'Detected and declared governance coverage.' },
  STRUCT: { title: 'Repository structure', description: 'Structural governance identity.' },
  VENDOR: { title: 'Vendor integrity', description: 'Generated payload manifest integrity.' },
  CAPABILITY: { title: 'Capability publication', description: 'Complete local governance capabilities.' },
  ACCESS: { title: 'Repository access', description: 'GitHub reachability and archive state.' },
  RUNTIMES: { title: 'Runtime support', description: 'Declared agent-runtime support and orientation.' },
  LINK: { title: 'Development links', description: 'Explicit repository-local development linking.' },
  DESCFIT: { title: 'Description fitness', description: 'Human assessment of repository purpose.' },
  OVR: { title: 'Override rationale', description: 'Human assessment of exceptions.' },
  SYNC: { title: 'Standard synchronisation', description: 'Alignment across the knowledge chain.' }
}

const familyCode = (code: string): string => code.split('-')[0] as string
const familyCodes = [...new Set(ITEMS.map((item) => familyCode(item.code)))]

export const KI_REPO_RUBRIC: RubricDefinition<RepoRubricContext> = {
  name: 'ki-repo',
  concern: 'Knowledge Islands repositories',
  families: familyCodes.map((code) => ({
    code,
    title: FAMILY_METADATA[code]?.title ?? code,
    description: FAMILY_METADATA[code]?.description ?? 'Repository governance criteria.',
    standard: 'standards.md',
    selectContext: (context: RepoRubricContext) => context,
    items: ITEMS.filter((item) => familyCode(item.code) === code) as [RubricItem<RepoRubricContext>, ...RubricItem<RepoRubricContext>[]]
  })) as unknown as RubricDefinition<RepoRubricContext>['families']
}

export const KI_REPO_FAMILY_CODES = familyCodes
