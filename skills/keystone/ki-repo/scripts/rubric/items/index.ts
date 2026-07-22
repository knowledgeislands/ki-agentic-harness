import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { RepoRubricContext } from '../contexts/contexts.ts'
import { ACCESS } from './access.ts'
import { ACT } from './actions.ts'
import { BP } from './branch-protection.ts'
import { CAPABILITY } from './capability.ts'
import { CHECKS } from './checks.ts'
import { COV } from './coverage.ts'
import { DEP } from './dependencies.ts'
import { DESCFIT } from './description-fit.ts'
import { FILES } from './files.ts'
import { GH } from './gh.ts'
import { MERGE } from './merge.ts'
import { OVR } from './overrides.ts'
import { PKG } from './pkg.ts'
import { RUNTIMES } from './runtimes.ts'
import { SEC } from './secrets.ts'
import { STRUCT } from './structure.ts'
import { SYNC } from './sync.ts'
import { TOGGLE } from './toggle.ts'
import { TOPICS } from './topics.ts'
import { VENDOR } from './vendor.ts'
import { VIS } from './visibility.ts'
import { WORK } from './working-areas.ts'

/** Imported semantic collections, kept explicit for the catalogue contract. */
export const KI_REPO_FAMILY_COLLECTIONS = [
  { items: ACCESS },
  { items: ACT },
  { items: BP },
  { items: CAPABILITY },
  { items: CHECKS },
  { items: COV },
  { items: DEP },
  { items: DESCFIT },
  { items: FILES },
  { items: GH },
  { items: MERGE },
  { items: OVR },
  { items: PKG },
  { items: RUNTIMES },
  { items: SEC },
  { items: STRUCT },
  { items: SYNC },
  { items: TOGGLE },
  { items: TOPICS },
  { items: VENDOR },
  { items: VIS },
  { items: WORK }
] as const

const family = (code: string, title: string, description: string, items: readonly unknown[]) =>
  defineRubricFamily({
    code,
    title,
    description,
    standard: 'standards.md',
    selectContext: (context: RepoRubricContext) => context,
    items: items as never
  })
/** Catalogue wiring only; semantic family modules own each ordered rule collection. */
export const KI_REPO_RUBRIC: RubricDefinition<RepoRubricContext> = {
  name: 'ki-repo',
  concern: 'Knowledge Islands repositories',
  families: [
    family('FILES', 'Repository files', 'Required local files and repository document quality.', FILES),
    family('GH', 'Core GitHub settings', 'Default branch, licensing, and repository description.', GH),
    family('PKG', 'Package metadata', 'Package identity and repository metadata.', PKG),
    family('MERGE', 'Merge policy', 'GitHub merge and branch-cleanup behaviour.', MERGE),
    family('TOGGLE', 'Repository features', 'Issues, Wiki, and Projects settings.', TOGGLE),
    family('VIS', 'Visibility', 'Declared and live repository visibility.', VIS),
    family('TOPICS', 'Topics', 'Public repository topic conventions.', TOPICS),
    family('BP', 'Branch protection', 'Optional main-branch protection.', BP),
    family('DEP', 'Dependency security', 'Dependabot and branch freshness.', DEP),
    family('SEC', 'Secret protection', 'Secret scanning and push protection.', SEC),
    family('ACT', 'Actions policy', 'GitHub Actions permissions.', ACT),
    family('CHECKS', 'Check overrides', 'Per-repository override schema.', CHECKS),
    family('COV', 'Governance coverage', 'Detected and declared governance coverage.', COV),
    family('STRUCT', 'Repository structure', 'Structural governance identity.', STRUCT),
    family('VENDOR', 'Vendor integrity', 'Generated payload manifest integrity.', VENDOR),
    family('CAPABILITY', 'Capability publication', 'Complete local governance capabilities.', CAPABILITY),
    family('ACCESS', 'Repository access', 'GitHub reachability and archive state.', ACCESS),
    family('RUNTIMES', 'Runtime support', 'Declared agent-runtime support and orientation.', RUNTIMES),
    family('DESCFIT', 'Description fitness', 'Human assessment of repository purpose.', DESCFIT),
    family('OVR', 'Override rationale', 'Human assessment of exceptions.', OVR),
    family('SYNC', 'Standard synchronisation', 'Alignment across the knowledge chain.', SYNC),
    family('WORK', 'Working areas', 'Judgment-led review of optional inbound and outbound working material.', WORK)
  ]
}
export const KI_REPO_FAMILY_CODES = KI_REPO_RUBRIC.families.map((family) => family.code)
