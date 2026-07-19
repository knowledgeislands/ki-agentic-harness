import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../lib/rubric.ts'
import type { KiShapeRubricContext } from '../contexts/contexts.ts'

const UNIVERSAL_VERBS = ['AUDIT', 'CONFORM', 'HELP', 'EDUCATE', 'REFRESH'] as const
const UNIFORM_VENDORS = '[educate, audit, conform, help]'

export const KI_SHAPE_1: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-1',
  title: 'standard skills resolve base bindings at runtime',
  description: 'A **standard** KI skill resolves base bindings at runtime and hard-codes **no single base**.',
  sources: ['ki-agentic-harness README', '`ki-kb`'],
  judgment: { prompt: 'Does this standard skill resolve base bindings at runtime without hard-coding one base?' }
}

export const KI_SHAPE_2: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-2',
  title: 'skills compose rather than extend',
  description:
    '**Composition is the only inter-skill relationship — the base-coupled extension pattern is retired.** A skill builds on another by running the sibling\'s checker/mode **in sequence** and adding its delta (never importing it), and **declares the edge** — naming the sibling and the run order in its AUDIT mode. What a base needs differently is **declared, not forked**: data in the repo\'s own `.ki-config` table (read validate-down), prose in its `CLAUDE.md` — never a `<base>-kb`-style skill that takes the shared modes by name. _Delegation between two standards (kb → streams) is composition at sub-scope._ The linter flags **endorsement of the retired pattern** (telling a base to ship/"prefer" an extension skill, or that a skill "delegates the modes back" / "extends this one") as a mechanical heuristic; the **[J]** gate is that no skill in the set models a relationship as a base-coupled extension.',
  sources: ['ki-agentic-harness README', '`ki-engineering`'],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill) return [{ status: 'NOT_APPLICABLE', message: 'skill evidence is unavailable for composition inspection' }]
        const violations = skill.retiredExtensionFiles.map((file) => ({
          status: 'VIOLATION' as const,
          message:
            'endorses the retired base-coupled extension pattern (ship/"prefer" an extension skill, "delegates the modes back", "extends this one") — relationships are composition only; declare base differences in .ki-config / CLAUDE.md, per KI-SHAPE-2',
          subject: file
        }))
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'skills compose rather than extend' }]
      }
    }
  },
  judgment: { prompt: 'Does every inter-skill relationship use declared composition rather than base-coupled extension?' }
}

export const KI_SHAPE_3: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-3',
  title: 'the skill declares its kind',
  description:
    'The skill declares its **kind** — **governance** or **process** — clearly (ADR-KI-HARNESS-SKILLS-006). A **governance skill** holds a house standard: it exposes the universal modes (KI-SHAPE-5) and, in a Knowledge Islands repo, the four-file shape (KI-SHAPE-6). A **process skill** drives an action or lifecycle rather than holding a standard: it is lightweight, may bundle a helper `scripts/` and a `references/` procedure, and is **exempt** from the governance four-file shape and universal modes — its mode count follows its own lifecycle and it exposes HELP only optionally. Both kinds are dual-invocable (`/<name>` and model-triggered); a process skill is a slash command with a script and references attached.',
  sources: ['ki-agentic-harness README', 'ADR-KI-HARNESS-SKILLS-006'],
  judgment: { prompt: 'Does the skill correctly and clearly declare its governance or process kind?' }
}

export const KI_SHAPE_4: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-4',
  title: 'a skill validates only its own configuration table',
  description:
    "A skill that reads the shared `.ki-config.toml` consumes and **validates only its own `[<skill>]` table** — warns on a key it doesn't recognise, advises dropping one that merely restates a default — and never inspects another skill's table. Validate down, ignore across.",
  sources: ['contract defined by `ki-repo`'],
  judgment: { prompt: 'Does this skill validate only its own configuration table and ignore unrelated tables?' }
}

export const KI_SHAPE_5: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-5',
  title: 'governance skills expose universal modes',
  description:
    "A **governance skill** (one that holds a standard) exposes the universal modes **AUDIT** + **CONFORM** + **EDUCATE** + **REFRESH** — EDUCATE scaffolds a new artifact (or brings an off-standard one onto the floor from scratch), its mechanical half being the per-skill `scripts/educate.ts` (the EDUCATE counterpart to `audit-*.ts`, a thin delegator into the central chain engine); any further modes (`OPTIMISE` to push a compliant artifact from the floor toward excellent, and operational modes like kb's note-ops) are skill-specific. Modes are named, not lettered, and ordered alphabetically in the body and `argument-hint`.",
  sources: ['ki-agentic-harness README'],
  judgment: { prompt: 'Does this governance skill expose the universal modes with appropriate additional modes only?' }
}

export const KI_SHAPE_6: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-6',
  title: 'governance skills use the KI file shape',
  description:
    '_Governance-skill file shape — Knowledge Islands repos only, for now._ A governance skill **shipped in a Knowledge Islands repo** (one carrying a `.ki-config.toml`) uses the shared names **`references/standards.md`** for its primary normative reference, **`references/rubric.md`** for pass/fail criteria tagged **[M]**/**[J]**, and **`references/sources.md`** for provenance with `last reviewed` dates (see **LONG-1**). Optional worked examples use `exemplars.md`; independently invoked procedures use `mode-<verb>.md`, co-locating tightly coupled modes. A genuinely separate secondary normative topic alone retains a descriptive `<topic>-standards.md` filename; contracts, formats, frameworks, and guides remain descriptively named. Universal governance executables are bare `scripts/educate.ts`, `scripts/audit.ts`, and `scripts/conform.ts`; domain-specific helpers remain descriptive. A skill tracking a moving external spec also keeps a current-state **`## Last review`** block (pinned revision, confirmations, open watch-items), overwritten each refresh. A governance skill outside a Knowledge Islands repo is exempt until the convention is generalised.',
  sources: ['ki-agentic-harness README'],
  judgment: { prompt: 'Does this KI governance skill use the required reference and executable file shape?' }
}

export const KI_SHAPE_7: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-7',
  title: 'behaviour-changing skills define and check their anchor',
  description:
    '_A behaviour-changing skill defines its gate — and checks the anchor._ A skill that changes a **default behaviour** — installs a gate, a standing "always do X before Y" rule, or a routing intercept — cannot rely on its own `description` to fire it, because skills load **on demand** and the triggering request often won\'t mention the skill (e.g. "edit this note" never says "proposal"). Such a skill must **anchor the behaviour in always-loaded context** (the base/repo `CLAUDE.md` / `AGENTS.md`, or a companion skill that _does_ reliably load handing off to it), **and its checker must verify the anchor is present** so it can\'t be silently lost. The linter surfaces candidates mechanically (strong gate phrasing in the body or a reference file — body + references scanned as one unit, since mode-routing lifts procedures out of the body — without an anchor its checker reads); the **[J]** call is whether the skill genuinely changes a default and so _needs_ a gate. Realised as `ki-kb-streams`\' **GATE-1** (the Enactment gate) and `ki-kb`\'s **MEM-2** (the memory cascade); `ki-repo`\'s `.ki-config.toml` marker is the same pattern (anchor + checked).',
  sources: ['checker-contract.md', 'checker-response.md'],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill) return [{ status: 'NOT_APPLICABLE', message: 'skill evidence is unavailable for anchor inspection' }]
        if (!skill.strongGate) return [{ status: 'NOT_APPLICABLE', message: 'the skill does not appear to change default behaviour' }]
        return skill.anchorMentioned && skill.checkerReadsAnchor
          ? [{ status: 'PASS', message: 'the behaviour-changing skill defines and checks its anchor' }]
          : [
              {
                status: 'VIOLATION',
                message:
                  'reads as behaviour-changing (a gate / standing rule) but does not evidence an always-on anchor verified by its checker — anchor it in CLAUDE.md/AGENTS.md and check the anchor, per KI-SHAPE-7'
              }
            ]
      }
    }
  },
  judgment: { prompt: 'Does a behaviour-changing skill have an appropriate always-loaded anchor that its checker verifies?' }
}

export const KI_SHAPE_8: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-8',
  title: 'governance checkers emit the canonical checker response',
  description:
    "_Governance-skill checker contract._ With no reporter selected, a governance skill's audit and conform scripts emit the complete canonical checker response as JSONL. A direct human invocation may explicitly select the shared local `reporter` module, which filters presentation without suppressing checks or changing exit status. The wrapper imports its local `rubric`, `checker`, and `reporter` modules—owned locally by `ki-skills`, or copied under `scripts/vendored/ki-skills/` for a dependent skill—and has no private terminal renderer, `--json` switch, report-file output, or cross-skill import. Exit code is non-zero if and only if a mechanical finding is `FAIL`; `WARN`, `FIXED`, `INFO`, `NOT_APPLICABLE`, and `PASS` all exit 0. Judgment aspects emit no synthetic findings; the summary reports their unevaluated count, including hybrid items. Findings use the canonical levels defined in [the checker contract](checker-contract.md). The linter mechanically **[M]** verifies the local checker imports and response emission; the source-harness checker test verifies stream shape, summary agreement, judgment-count coverage, and exit-code behaviour.",
  sources: ['checker-contract.md', 'checker-response.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill || skill.checkers.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'the skill has no checker available for canonical-response inspection' }]
        const violations = skill.checkers
          .filter((checker) => !checker.usesCanonicalChecker)
          .map((checker) => ({
            status: 'VIOLATION' as const,
            message: `checker ${checker.name} does not import and return its local canonical checker response — required by checker-response.md`
          }))
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'governance checkers emit the canonical checker response' }]
      }
    }
  },
  judgment: { prompt: 'Does the checker fully follow the canonical checker and response contracts beyond the mechanical checks?' }
}

export const KI_SHAPE_9: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-9',
  title: 'mechanical work belongs in the checker',
  description:
    '_Mechanical work belongs in the checker, not in tokens._ A criterion a script can decide deterministically — no judgment, no AI benefit — is tagged **[M]** and **implemented in the checker**; a **[J]** tag is earned by the judgment a criterion genuinely needs, never by "no checker written yet". The reader\'s context is spent only on the **[J]** items, so a mechanical criterion left to prose, or a **[J]** the checker already decides, is drift — it **moves into the checker and flips to [M]**. The linter surfaces the mechanical heuristic — a rubric carrying **[M]** criteria but shipping no `scripts/` checker (nor a documented toolchain delegation to a skill-scoped audit) — as a WARN; the **[J]** gate is whether each remaining **[J]** genuinely needs a reader rather than a script.',
  sources: ['[Rubric authoring](rubric-authoring.md)'],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill || skill.mechanicalRubricCount === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'the skill declares no mechanical rubric criteria' }]
        return skill.hasChecker || skill.documentsMechanicalDelegation
          ? [{ status: 'PASS', message: 'mechanical work belongs in the checker' }]
          : [
              {
                status: 'VIOLATION',
                message: `rubric tags ${skill.mechanicalRubricCount} criteria [M] but the skill ships no scripts/ checker (nor a documented toolchain delegation) — mechanical work belongs in the checker, not in tokens, per KI-SHAPE-9`
              }
            ]
      }
    }
  },
  judgment: { prompt: 'Do remaining judgment criteria genuinely require review rather than deterministic checking?' }
}

export const KI_SHAPE_10: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-10',
  title: 'skills do not assume private user configuration',
  description:
    "_A skill must not assume personal `CLAUDE.md` content._ A Knowledge Islands skill is installed by any contributor, not only its author. It must not assume the user has any particular content in their personal `~/.claude/CLAUDE.md` (or imported topic files) — plan-mode gates, house style rules, footnote conventions, workflow preferences. Any behaviour a skill requires beyond what the open spec guarantees must be **anchored in always-loaded repo context** (`CLAUDE.md`, `AGENTS.md`, or a KI-SHAPE-7-style companion hook) — not in the author's private config. Where a skill cross-checks a convention that _might_ live in personal config, it must degrade gracefully rather than silently rely on that content being present.",
  sources: ['standards.md §14'],
  judgment: { prompt: 'Does the skill avoid assuming private personal configuration?' }
}

export const KI_SHAPE_11: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-11',
  title: 'governance skills expose HELP',
  description:
    "_Exposes the universal HELP mode._ Every governance skill's `argument-hint` lists a `help` verb, so the no-mode default and the `help` / `-h` / `?` pure-explain form are discoverable (ADR-KI-HARNESS-SKILLS-001). The HELP block itself is **generated, not authored** — the shared renderer (`skills/keystone/ki-bootstrap/scripts/skill-help.ts`, surfaced as `ki:skills:help <name>`) reads what the `SKILL.md` already declares and injects HELP into every skill's mode list — so a skill's only footprint is this one token plus the KI-INVOKE-1 prose. The linter verifies the `help` token; the prose HELP semantics are KI-INVOKE-1 **[J]**.",
  sources: ['ADR-KI-HARNESS-SKILLS-001'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill || skill.argumentHint === undefined)
          return [{ status: 'NOT_APPLICABLE', message: '`argument-hint` is unavailable for HELP-mode inspection' }]
        return skill.hintVerbs.includes('HELP')
          ? [{ status: 'PASS', message: 'governance skills expose HELP' }]
          : [{ status: 'VIOLATION', message: '`argument-hint` does not expose the universal `help` mode (ADR-KI-HARNESS-SKILLS-001)' }]
      }
    },
    conform: {
      phase: 'PRIMARY',
      run: ({ skill, setArgumentHint }) => {
        if (!skill?.governanceSkill)
          return [{ status: 'NOT_APPLICABLE', message: 'the target is not a governance skill', subject: 'SKILL.md' }]
        if (skill.hintVerbs.includes('HELP')) return [{ status: 'PASS', message: 'governance skills expose HELP', subject: 'SKILL.md' }]
        if (!skill.argumentHint)
          return [{ status: 'NOT_APPLICABLE', message: '`argument-hint` is unavailable for safe automatic repair', subject: 'SKILL.md' }]
        if (!setArgumentHint) throw new Error('KI-SHAPE-11 conform requires the setArgumentHint capability')
        setArgumentHint(`${skill.argumentHint} | help`)
        return [{ status: 'FIXED', message: 'appended `help` to argument-hint', subject: 'SKILL.md' }]
      }
    }
  }
}

const auditKiShape12 = ({ skill }: KiShapeRubricContext): RubricOutcomes<AuditOutcome> => {
  if (!skill?.governanceSkill) return [{ status: 'NOT_APPLICABLE', message: 'the target is not a governance skill' }]
  const violations: AuditOutcome[] = []
  const missing = UNIVERSAL_VERBS.filter((verb) => !skill.hintVerbs.includes(verb))
  if (missing.length > 0)
    violations.push({
      status: 'VIOLATION',
      message: `\`argument-hint\` is missing the universal verb(s) ${missing.map((verb) => verb.toLowerCase()).join(', ')} — a governance skill exposes AUDIT, CONFORM, EDUCATE, REFRESH and HELP (ADR-KI-HARNESS-SKILLS-001)`
    })
  if (!skill.vendorsPresent)
    violations.push({
      status: 'VIOLATION',
      message:
        'frontmatter carries no `vendors:` declaration — declare the vendored modes beside `depends-on:` so the bootstrap engine can vendor them (ADR-KI-HARNESS-007)'
    })
  const [first, ...rest] = violations
  return first ? [first, ...rest] : [{ status: 'PASS', message: 'governance mode vocabulary is canonical and complete' }]
}

export const KI_SHAPE_12: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-12',
  title: 'governance mode vocabulary is canonical and complete',
  description:
    "_Mode vocabulary is canonical and complete._ A governance skill exposes **AUDIT**, **CONFORM**, **EDUCATE**, **REFRESH** and **HELP** spelled exactly so — a governance skill missing any universal verb from its `argument-hint` (EDUCATE is the common gap) **WARNs**; `NEW`, `OPTIMISE`, and operational verbs are additive, never substitutes for a universal mode (a collection skill exposes both EDUCATE and NEW). The vendoring leg: a governance skill's frontmatter **declares its vendorable modes** under `vendors:`, beside `depends-on:`, so the central bootstrap engine can vendor them into a target's `.ki-meta/`; a missing declaration **WARNs**, while KI-SHAPE-15 validates its exact uniform form. Process skills are exempt throughout.",
  sources: ['ADR-KI-HARNESS-SKILLS-001', 'ADR-KI-HARNESS-SKILLS-006', 'ADR-KI-HARNESS-007'],
  mechanical: {
    level: 'WARN',
    audit: { phase: 'INSPECT', run: auditKiShape12 },
    conform: {
      phase: 'PRIMARY',
      run: (context) => {
        const { skill, setArgumentHint } = context
        if (!skill?.governanceSkill)
          return [{ status: 'NOT_APPLICABLE', message: 'the target is not a governance skill', subject: 'SKILL.md' }]
        const missing = UNIVERSAL_VERBS.filter((verb) => !skill.hintVerbs.includes(verb))
        if (missing.length === 0) return auditKiShape12(context)
        if (!skill.argumentHint) return auditKiShape12(context)
        if (!setArgumentHint) throw new Error('KI-SHAPE-12 conform requires the setArgumentHint capability')
        setArgumentHint(`${skill.argumentHint} | ${missing.map((verb) => verb.toLowerCase()).join(' | ')}`)
        const outcomes: ConformOutcome[] = [
          {
            status: 'FIXED',
            message: `appended missing verb(s) to argument-hint: ${missing.map((verb) => verb.toLowerCase()).join(', ')}`,
            subject: 'SKILL.md'
          }
        ]
        if (!skill.vendorsPresent)
          outcomes.push({
            status: 'VIOLATION',
            message:
              'frontmatter carries no `vendors:` declaration — declare the vendored modes beside `depends-on:` so the bootstrap engine can vendor them (ADR-KI-HARNESS-007)'
          })
        const [first, ...rest] = outcomes
        return [first as ConformOutcome, ...rest]
      }
    }
  }
}

export const KI_SHAPE_13: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-13',
  title: 'mode headings have a canonical structure',
  description:
    '_Mode-heading structure._ A governance skill presents its modes under a **single `## Operating modes` H2** (the home for the shared no-mode/HELP intro), with each mode as a **`### Mode <NAME>` H3** or — for router skills with many operational verbs — a **`| Mode | … |` dispatch table** inside that section. The linter WARNs on a flat `## Mode X` H2, a bare `### X` heading missing the `Mode` prefix, and any `argument-hint` verb absent from the Operating-modes body (hint ⊆ body). Process skills are exempt.',
  sources: ['ADR-KI-HARNESS-SKILLS-001'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill?.governanceSkill) return [{ status: 'NOT_APPLICABLE', message: 'the target is not a governance skill' }]
        const violations: AuditOutcome[] = []
        if (skill.operatingModesSection === null)
          violations.push({
            status: 'VIOLATION',
            message: 'no `## Operating modes` H2 — modes live under a single wrapper H2 (ADR-KI-HARNESS-SKILLS-001)'
          })
        for (const heading of skill.flatModeHeadings)
          violations.push({
            status: 'VIOLATION',
            message: `flat \`## Mode ${heading}\` H2 — demote to \`### Mode ${heading}\` inside the \`## Operating modes\` wrapper`
          })
        for (const heading of skill.bareModeHeadings)
          violations.push({
            status: 'VIOLATION',
            message: `bare \`### ${heading}\` inside \`## Operating modes\` — mode headings carry the \`Mode \` prefix`
          })
        if (skill.operatingModesSection !== null)
          for (const verb of skill.hintVerbs) {
            if (skill.bodyModes.has(verb)) continue
            if (verb === 'HELP' && /\bhelp\b/i.test(skill.operatingModesIntro)) continue
            violations.push({
              status: 'VIOLATION',
              message: `\`argument-hint\` verb \`${verb.toLowerCase()}\` has no mode in the \`## Operating modes\` section (hint ⊆ body)`
            })
          }
        const [first, ...rest] = violations
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'mode headings have a canonical structure' }]
      }
    }
  }
}

export const KI_SHAPE_14: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-14',
  title: 'REFRESH states its harness-only precondition',
  description:
    "_REFRESH states its harness-only precondition._ REFRESH's write target is always the skill's own canonical files under `skills/<name>/` in `ki-agentic-harness` — a governance skill's `### Mode REFRESH` section (or, per REF-5, its `references/mode-refresh.md`) must name `ki-agentic-harness` as the only place it writes, and instruct the agent to stop and redirect when invoked from a repo where the skill is merely vendored (to the harness, or — for a pattern recurring across bases — to `ki-kb`'s IMPROVE mode). Missing either half **WARNs**. Process skills (KI-SHAPE-3) are exempt; a skill with no REFRESH section at all is already caught by KI-SHAPE-12.",
  sources: ['ADR-KI-HARNESS-SKILLS-001', 'ADR-KI-HARNESS-SKILLS-006'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill?.governanceSkill || !skill.refreshText)
          return [{ status: 'NOT_APPLICABLE', message: 'the target has no governance REFRESH procedure to inspect' }]
        const namesHarness = /ki-agentic-harness/.test(skill.refreshText)
        const stopsAndRedirects = /\bstop(s)?\b[\s\S]{0,160}\b(redirect|names?|route)/i.test(skill.refreshText)
        return namesHarness && stopsAndRedirects
          ? [{ status: 'PASS', message: 'REFRESH states its harness-only precondition' }]
          : [
              {
                status: 'VIOLATION',
                message:
                  'REFRESH section does not state the harness-only precondition — it should name `ki-agentic-harness` as the only place it writes and instruct stopping/redirecting when invoked from a vendored install'
              }
            ]
      }
    }
  }
}

const auditKiShape15 = ({ skill }: KiShapeRubricContext): RubricOutcomes<AuditOutcome> => {
  if (!skill?.governanceSkill || !skill.vendorsPresent)
    return [{ status: 'NOT_APPLICABLE', message: 'the target has no governance `vendors:` declaration to inspect' }]
  const violations: AuditOutcome[] = []
  if (skill.vendors !== UNIFORM_VENDORS)
    violations.push({
      status: 'VIOLATION',
      message: `\`vendors:\` must be the uniform list \`${UNIFORM_VENDORS}\` (got \`${skill.vendors}\`) — modes derive their scripts by name; the map/override form is retired (ADR-KI-HARNESS-007)`
    })
  for (const mode of ['educate', 'audit', 'conform'])
    if (!skill.scriptNames.includes(`${mode}.ts`))
      violations.push({
        status: 'VIOLATION',
        message: `\`scripts/${mode}.ts\` missing — a governance skill vendors bare \`educate.ts\`/\`audit.ts\`/\`conform.ts\``
      })
  for (const script of skill.scriptNames)
    if (/^(audit|lint|conform)-[a-z0-9-]+\.ts$/.test(script) && !script.endsWith('.test.ts'))
      violations.push({
        status: 'VIOLATION',
        message: `\`scripts/${script}\` uses the redundant skill-name suffix — rename to bare \`audit.ts\`/\`conform.ts\``
      })
  const [first, ...rest] = violations
  return first ? [first, ...rest] : [{ status: 'PASS', message: 'vendored modes have a uniform shape' }]
}

export const KI_SHAPE_15: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-15',
  title: 'vendored modes have a uniform shape',
  description:
    '_Uniform vendored-mode shape._ Every governance skill declares exactly `vendors: [educate, audit, conform, help]` and provides the corresponding bare `scripts/educate.ts`, `scripts/audit.ts`, and `scripts/conform.ts`; mode names derive their script filenames, so map/override declarations and redundant skill-name suffixes such as `audit-<skill>.ts`, `lint-<skill>.ts`, and `conform-<skill>.ts` **FAIL**. REFRESH is harness-only and is never vendored. Process skills are exempt.',
  sources: ['standards.md §14', 'ADR-KI-HARNESS-007'],
  mechanical: {
    level: 'FAIL',
    audit: { phase: 'INSPECT', run: auditKiShape15 },
    conform: {
      phase: 'PRIMARY',
      run: (context) => {
        const { skill, setVendors } = context
        if (!skill?.governanceSkill)
          return [{ status: 'NOT_APPLICABLE', message: 'the target is not a governance skill', subject: 'SKILL.md' }]
        if (skill.vendors === UNIFORM_VENDORS) return auditKiShape15(context)
        const missingScripts = ['educate', 'audit', 'conform'].filter((mode) => !skill.scriptNames.includes(`${mode}.ts`))
        if (missingScripts.length > 0) return auditKiShape15(context)
        if (!setVendors) throw new Error('KI-SHAPE-15 conform requires the setVendors capability')
        setVendors(UNIFORM_VENDORS)
        const after = auditKiShape15({ ...context, skill: { ...skill, vendorsPresent: true, vendors: UNIFORM_VENDORS } })
        const remaining = after.filter((outcome) => outcome.status === 'VIOLATION')
        return [{ status: 'FIXED', message: `set \`vendors:\` to \`${UNIFORM_VENDORS}\``, subject: 'SKILL.md' }, ...remaining]
      }
    }
  }
}

export const KI_SHAPE_16: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-16',
  title: 'target files have declared ownership',
  description:
    "_Declared file ownership, three tiers._ A skill that writes a house-standard file into a **target repo's** working tree (not `.ki-meta/`, which has its own `vendors:`/manifest.json hash mechanism — KI-SHAPE-12/15's sibling, not this one) declares that relationship in frontmatter, alongside `depends-on:`/`vendors:`, under one of three keys: `requires:` (must exist, doesn't create/control it — any number of skills may share a `requires:` filename), `contributes:` (writes/expects only its own section of a shared file — any number of skills may share a `contributes:` filename, e.g. `.ki-config.toml`, `package.json`), or `owns:` (sole author of the whole file — **exclusive**, at most one skill per filename). The linter runs three heuristic passes: (1) per-skill, any filename passed to a literal `scaffold(...)`/`syncOwned(...)` call in `scripts/conform.ts` must appear under that skill's `owns:` — WARN if scaffolded-but-undeclared; (2) per-skill, every filename declared under `owns:`/`contributes:`/`requires:` must appear literally somewhere in that skill's own `scripts/audit.ts` — WARN if declared-but-unaudited; (3) cross-skill, no filename may appear under `owns:` in more than one skill's frontmatter — WARN naming both skills (the exact shape of the `.prettierrc.json` split bug this criterion exists to catch). Heuristic: only `scaffold(`/`syncOwned(` call sites are matched, so a skill using a differently named write helper needs it renamed or the pattern extended.",
  sources: ['KI'],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    audit: {
      phase: 'INSPECT',
      run: ({ skill, ownershipCollisions }) => {
        if (!skill && ownershipCollisions.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'skill and ownership-collision evidence are unavailable' }]
        const violations: AuditOutcome[] = []
        if (skill) {
          for (const file of skill.scaffoldedFiles)
            if (!skill.owns.includes(file))
              violations.push({
                status: 'VIOLATION',
                message: `scaffolds \`${file}\` but does not declare it under \`owns:\` in frontmatter`
              })
          if (skill.auditSource !== null)
            for (const file of [...skill.owns, ...skill.contributes, ...skill.requires])
              if (!skill.auditSource.includes(file))
                violations.push({
                  status: 'VIOLATION',
                  message: `declares \`${file}\` (owns/contributes/requires) but \`scripts/audit.ts\` never checks it`
                })
        }
        for (const collision of ownershipCollisions)
          violations.push({
            status: 'VIOLATION',
            message: `\`owns: ${collision.file}\` is declared by ${[...collision.skills].sort().join(', ')} — owns: is exclusive; split into a single owner plus contributes:/requires: on the rest`
          })
        const sorted = violations.sort((left, right) => left.message.localeCompare(right.message))
        const [first, ...rest] = sorted
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'target files have declared ownership' }]
      }
    }
  }
}

export const KI_SHAPE_17: RubricItem<KiShapeRubricContext> = {
  code: 'KI-SHAPE-17',
  title: 'dependencies are declared explicitly',
  description:
    "_Explicit dependency declaration._ Every skill declares `depends-on:` as a single-line flow list. `depends-on: []` is the required explicit form when a skill has no governance dependencies. The listed capability names and a governed repository's matching `.ki-config.toml` tables are validated by the dependency graph and bootstrap; the skill checker enforces the local declaration shape.",
  sources: ['ADR-KI-HARNESS-SKILLS-006'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ skill }) => {
        if (!skill) return [{ status: 'NOT_APPLICABLE', message: 'skill evidence is unavailable for dependency inspection' }]
        if (!skill.dependsOnPresent)
          return [
            {
              status: 'VIOLATION',
              message:
                'frontmatter carries no `depends-on:` declaration — declare `depends-on: []` when the skill has no governance dependencies'
            }
          ]
        return /^\[[^\]]*\]$/.test(skill.dependsOn)
          ? [{ status: 'PASS', message: 'dependencies are declared explicitly' }]
          : [
              {
                status: 'VIOLATION',
                message: `\`depends-on:\` must be a single-line flow list (got \`${skill.dependsOn}\`)`
              }
            ]
      }
    }
  }
}

export const KI_SHAPE = [
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
] as const
