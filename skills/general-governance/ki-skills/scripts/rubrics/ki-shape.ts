import type { RubricFinding, RubricItem } from '../lib/rubric/rubric.ts'

const UNIVERSAL_VERBS = ['AUDIT', 'CONFORM', 'HELP', 'EDUCATE', 'REFRESH'] as const
const UNIFORM_VENDORS = '[educate, audit, conform, help]'

export type CheckerContract = {
  name: string
  usesReporter: boolean
}

export type OwnershipCollision = {
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

export const KI_SHAPE_1: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-1',
  title: 'standard skills resolve base bindings at runtime',
  description: 'A standard KI skill hard-codes no single base binding.',
  sources: ['KI'],
  judgment: { prompt: 'Does this standard skill resolve base bindings at runtime without hard-coding one base?' }
}

export const KI_SHAPE_2: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-2',
  title: 'skills compose rather than extend',
  description: 'Inter-skill relationships are declared sequential composition, never base-coupled extension.',
  sources: ['KI'],
  judgment: { prompt: 'Does every inter-skill relationship use declared composition rather than base-coupled extension?' },
  audit: ({ skill }) =>
    (skill?.retiredExtensionFiles ?? []).map((file) => ({
      type: 'M',
      level: 'WARN',
      code: KI_SHAPE_2.code,
      message:
        'endorses the retired base-coupled extension pattern (ship/"prefer" an extension skill, "delegates the modes back", "extends this one") — relationships are composition only; declare base differences in .ki-config / CLAUDE.md, per KI-SHAPE-2',
      file
    }))
}

export const KI_SHAPE_3: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-3',
  title: 'the skill declares its kind',
  description: 'A skill clearly declares whether it is governance or process.',
  sources: ['ADR-KI-HARNESS-SKILLS-006'],
  judgment: { prompt: 'Does the skill correctly and clearly declare its governance or process kind?' }
}

export const KI_SHAPE_4: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-4',
  title: 'a skill validates only its own configuration table',
  description: 'A configuration-reading skill validates its own table and ignores unrelated ones.',
  sources: ['KI'],
  judgment: { prompt: 'Does this skill validate only its own configuration table and ignore unrelated tables?' }
}

export const KI_SHAPE_5: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-5',
  title: 'governance skills expose universal modes',
  description: 'Governance skills expose AUDIT, CONFORM, EDUCATE, REFRESH, and HELP.',
  sources: ['KI'],
  judgment: { prompt: 'Does this governance skill expose the universal modes with appropriate additional modes only?' }
}

export const KI_SHAPE_6: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-6',
  title: 'governance skills use the KI file shape',
  description: 'A KI governance skill uses the shared reference and executable names.',
  sources: ['KI'],
  judgment: { prompt: 'Does this KI governance skill use the required reference and executable file shape?' }
}

export const KI_SHAPE_7: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-7',
  title: 'behaviour-changing skills define and check their anchor',
  description: 'A default-behaviour change is anchored in always-loaded context and checked by the skill.',
  sources: ['KI'],
  judgment: { prompt: 'Does a behaviour-changing skill have an appropriate always-loaded anchor that its checker verifies?' },
  audit: ({ skill }) =>
    skill?.strongGate && !(skill.anchorMentioned && skill.checkerReadsAnchor)
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: KI_SHAPE_7.code,
            message:
              'reads as behaviour-changing (a gate / standing rule) but does not evidence an always-on anchor verified by its checker — anchor it in CLAUDE.md/AGENTS.md and check the anchor, per KI-SHAPE-7'
          }
        ]
      : []
}

export const KI_SHAPE_8: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-8',
  title: 'governance checkers use the canonical reporter',
  description: 'A checker emits canonical reporter output from a local payload without a private renderer.',
  sources: ['KI'],
  judgment: { prompt: 'Does the checker fully follow the canonical reporter contract beyond the mechanical checks?' },
  audit: ({ skill }) =>
    (skill?.checkers ?? [])
      .filter((checker) => !checker.usesReporter)
      .map((checker) => ({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_8.code,
        message: `checker ${checker.name} does not import and emit its local canonical checker reporter — required by checker-reporter.md`
      }))
}

export const KI_SHAPE_9: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-9',
  title: 'mechanical work belongs in the checker',
  description: 'Deterministic criteria are implemented mechanically and judgment criteria genuinely require review.',
  sources: ['KI'],
  judgment: { prompt: 'Do remaining judgment criteria genuinely require review rather than deterministic checking?' },
  audit: ({ skill }) =>
    skill && skill.mechanicalRubricCount > 0 && !skill.hasChecker && !skill.documentsMechanicalDelegation
      ? [
          {
            type: 'M',
            level: 'WARN',
            code: KI_SHAPE_9.code,
            message: `rubric tags ${skill.mechanicalRubricCount} criteria [M] but the skill ships no scripts/ checker (nor a documented toolchain delegation) — mechanical work belongs in the checker, not in tokens, per KI-SHAPE-9`
          }
        ]
      : []
}

export const KI_SHAPE_10: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-10',
  title: 'skills do not assume private user configuration',
  description: 'A skill relies only on public runtime guarantees or always-loaded repository context.',
  sources: ['KI'],
  judgment: { prompt: 'Does the skill avoid assuming private personal configuration?' }
}

export const KI_SHAPE_11: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-11',
  title: 'governance skills expose HELP',
  description: 'A governance skill advertises the universal help verb in its argument hint.',
  sources: ['ADR-KI-HARNESS-SKILLS-001'],
  audit: ({ skill }) =>
    skill?.argumentHint !== undefined && !skill.hintVerbs.includes('HELP')
      ? [
          {
            type: 'M',
            level: 'FAIL',
            code: KI_SHAPE_11.code,
            message: '`argument-hint` does not expose the universal `help` mode (ADR-KI-HARNESS-SKILLS-001)'
          }
        ]
      : [],
  conform: ({ skill, setArgumentHint }) => {
    if (!skill?.governanceSkill || skill.hintVerbs.includes('HELP')) return []
    if (!skill.argumentHint) return [{ item: KI_SHAPE_11, level: 'ADVISORY', message: '`argument-hint` is missing; author it by hand', file: 'SKILL.md' }]
    if (!setArgumentHint) throw new Error('KI-SHAPE-11 conform requires the setArgumentHint capability')
    setArgumentHint(`${skill.argumentHint} | help`)
    return [{ item: KI_SHAPE_11, message: 'appended `help` to argument-hint', file: 'SKILL.md' }]
  }
}

export const KI_SHAPE_12: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-12',
  title: 'governance mode vocabulary is canonical and complete',
  description: 'A governance skill declares and provides its canonical vendorable modes.',
  sources: ['KI'],
  audit: ({ skill }) => {
    if (!skill?.governanceSkill) return []
    const findings: RubricFinding[] = []
    const missing = UNIVERSAL_VERBS.filter((verb) => !skill.hintVerbs.includes(verb))
    if (missing.length > 0)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_12.code,
        message: `\`argument-hint\` is missing the universal verb(s) ${missing.map((verb) => verb.toLowerCase()).join(', ')} — a governance skill exposes AUDIT, CONFORM, EDUCATE, REFRESH and HELP (ADR-KI-HARNESS-SKILLS-001)`
      })
    if (!skill.vendorsPresent)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_12.code,
        message:
          'frontmatter carries no `vendors:` declaration — declare the vendored modes beside `depends-on:` so the bootstrap engine can vendor them (ADR-KI-HARNESS-007)'
      })
    return findings
  },
  conform: ({ skill, setArgumentHint }) => {
    if (!skill?.governanceSkill) return []
    if (!skill.argumentHint)
      return [
        {
          item: KI_SHAPE_12,
          level: 'ADVISORY',
          message: '`argument-hint` is missing, so the universal mode vocabulary must be authored by hand',
          file: 'SKILL.md'
        }
      ]
    const missing = UNIVERSAL_VERBS.filter((verb) => !skill.hintVerbs.includes(verb))
    if (missing.length === 0) return []
    if (!setArgumentHint) throw new Error('KI-SHAPE-12 conform requires the setArgumentHint capability')
    setArgumentHint(`${skill.argumentHint} | ${missing.map((verb) => verb.toLowerCase()).join(' | ')}`)
    return [
      {
        item: KI_SHAPE_12,
        message: `appended missing verb(s) to argument-hint: ${missing.map((verb) => verb.toLowerCase()).join(', ')}`,
        file: 'SKILL.md'
      }
    ]
  }
}

export const KI_SHAPE_13: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-13',
  title: 'mode headings have a canonical structure',
  description: 'Governance modes appear under one Operating modes section with matching declared verbs.',
  sources: ['KI'],
  audit: ({ skill }) => {
    if (!skill?.governanceSkill) return []
    const findings: RubricFinding[] = []
    if (skill.operatingModesSection === null)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_13.code,
        message: 'no `## Operating modes` H2 — modes live under a single wrapper H2 (ADR-KI-HARNESS-SKILLS-001)'
      })
    for (const heading of skill.flatModeHeadings)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_13.code,
        message: `flat \`## Mode ${heading}\` H2 — demote to \`### Mode ${heading}\` inside the \`## Operating modes\` wrapper`
      })
    for (const heading of skill.bareModeHeadings)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_13.code,
        message: `bare \`### ${heading}\` inside \`## Operating modes\` — mode headings carry the \`Mode \` prefix`
      })
    if (skill.operatingModesSection !== null)
      for (const verb of skill.hintVerbs) {
        if (skill.bodyModes.has(verb)) continue
        if (verb === 'HELP' && /\bhelp\b/i.test(skill.operatingModesIntro)) continue
        findings.push({
          type: 'M',
          level: 'WARN',
          code: KI_SHAPE_13.code,
          message: `\`argument-hint\` verb \`${verb.toLowerCase()}\` has no mode in the \`## Operating modes\` section (hint ⊆ body)`
        })
      }
    return findings
  }
}

export const KI_SHAPE_14: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-14',
  title: 'REFRESH states its harness-only precondition',
  description: 'REFRESH writes only canonical harness files and redirects from vendored use.',
  sources: ['KI'],
  audit: ({ skill }) => {
    if (!skill?.governanceSkill || !skill.refreshText) return []
    const namesHarness = /ki-agentic-harness/.test(skill.refreshText)
    const stopsAndRedirects = /\bstop(s)?\b[\s\S]{0,160}\b(redirect|names?|route)/i.test(skill.refreshText)
    return namesHarness && stopsAndRedirects
      ? []
      : [
          {
            type: 'M',
            level: 'WARN',
            code: KI_SHAPE_14.code,
            message:
              'REFRESH section does not state the harness-only precondition — it should name `ki-agentic-harness` as the only place it writes and instruct stopping/redirecting when invoked from a vendored install'
          }
        ]
  }
}

export const KI_SHAPE_15: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-15',
  title: 'vendored modes have a uniform shape',
  description: 'A governance skill declares uniform vendorable modes and their bare entry scripts.',
  sources: ['KI'],
  audit: ({ skill }) => {
    if (!skill?.governanceSkill || !skill.vendorsPresent) return []
    const findings: RubricFinding[] = []
    if (skill.vendors !== UNIFORM_VENDORS)
      findings.push({
        type: 'M',
        level: 'FAIL',
        code: KI_SHAPE_15.code,
        message: `\`vendors:\` must be the uniform list \`${UNIFORM_VENDORS}\` (got \`${skill.vendors}\`) — modes derive their scripts by name; the map/override form is retired (ADR-KI-HARNESS-007)`
      })
    for (const mode of ['educate', 'audit', 'conform'])
      if (!skill.scriptNames.includes(`${mode}.ts`))
        findings.push({
          type: 'M',
          level: 'FAIL',
          code: KI_SHAPE_15.code,
          message: `\`scripts/${mode}.ts\` missing — a governance skill vendors bare \`educate.ts\`/\`audit.ts\`/\`conform.ts\``
        })
    for (const script of skill.scriptNames)
      if (/^(audit|lint|conform)-[a-z0-9-]+\.ts$/.test(script) && !script.endsWith('.test.ts'))
        findings.push({
          type: 'M',
          level: 'FAIL',
          code: KI_SHAPE_15.code,
          message: `\`scripts/${script}\` uses the redundant skill-name suffix — rename to bare \`audit.ts\`/\`conform.ts\``
        })
    return findings
  },
  conform: ({ skill, setVendors }) => {
    if (!skill?.governanceSkill || skill.vendors === UNIFORM_VENDORS) return []
    const missingScripts = ['educate', 'audit', 'conform'].filter((mode) => !skill.scriptNames.includes(`${mode}.ts`))
    if (missingScripts.length > 0)
      return [
        {
          item: KI_SHAPE_15,
          level: 'ADVISORY',
          message: `cannot declare uniform \`vendors:\` until bare script(s) exist: ${missingScripts.map((mode) => `scripts/${mode}.ts`).join(', ')}`,
          file: 'SKILL.md'
        }
      ]
    if (!setVendors) throw new Error('KI-SHAPE-15 conform requires the setVendors capability')
    setVendors(UNIFORM_VENDORS)
    return [{ item: KI_SHAPE_15, message: `set \`vendors:\` to \`${UNIFORM_VENDORS}\``, file: 'SKILL.md' }]
  }
}

export const KI_SHAPE_16: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-16',
  title: 'target files have declared ownership',
  description: 'A skill declares target-file ownership, contribution, or requirement consistently with its checker.',
  sources: ['KI'],
  audit: ({ skill, ownershipCollisions }) => {
    const findings: RubricFinding[] = []
    if (skill) {
      for (const file of skill.scaffoldedFiles)
        if (!skill.owns.includes(file))
          findings.push({
            type: 'M',
            level: 'WARN',
            code: KI_SHAPE_16.code,
            message: `scaffolds \`${file}\` but does not declare it under \`owns:\` in frontmatter`
          })
      if (skill.auditSource !== null)
        for (const file of [...skill.owns, ...skill.contributes, ...skill.requires])
          if (!skill.auditSource.includes(file))
            findings.push({
              type: 'M',
              level: 'WARN',
              code: KI_SHAPE_16.code,
              message: `declares \`${file}\` (owns/contributes/requires) but \`scripts/audit.ts\` never checks it`
            })
    }
    for (const collision of ownershipCollisions)
      findings.push({
        type: 'M',
        level: 'WARN',
        code: KI_SHAPE_16.code,
        message: `\`owns: ${collision.file}\` is declared by ${[...collision.skills].sort().join(', ')} — owns: is exclusive; split into a single owner plus contributes:/requires: on the rest`
      })
    return findings.sort((left, right) => left.message.localeCompare(right.message))
  }
}

export const KI_SHAPE_17: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-17',
  title: 'dependencies are declared explicitly',
  description: 'Every skill has an explicit single-line dependency declaration.',
  sources: ['ADR-KI-HARNESS-SKILLS-006'],
  audit: ({ skill }) => {
    if (!skill) return []
    if (!skill.dependsOnPresent)
      return [
        {
          type: 'M',
          level: 'FAIL',
          code: KI_SHAPE_17.code,
          message: 'frontmatter carries no `depends-on:` declaration — declare `depends-on: []` when the skill has no governance dependencies'
        }
      ]
    return /^\[[^\]]*\]$/.test(skill.dependsOn)
      ? []
      : [
          {
            type: 'M',
            level: 'FAIL',
            code: KI_SHAPE_17.code,
            message: `\`depends-on:\` must be a single-line flow list (got \`${skill.dependsOn}\`)`
          }
        ]
  }
}

export const KI_SHAPE: readonly RubricItem<KiShapeRubricContext>[] = [
  KI_SHAPE_1,
  KI_SHAPE_2,
  KI_SHAPE_3,
  KI_SHAPE_4,
  KI_SHAPE_5,
  KI_SHAPE_6,
  KI_SHAPE_7,
  KI_SHAPE_8,
  KI_SHAPE_9,
  KI_SHAPE_10,
  KI_SHAPE_11,
  KI_SHAPE_12,
  KI_SHAPE_13,
  KI_SHAPE_14,
  KI_SHAPE_15,
  KI_SHAPE_16,
  KI_SHAPE_17
]
