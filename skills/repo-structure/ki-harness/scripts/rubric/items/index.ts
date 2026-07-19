import type { AuditOutcome, ConformOutcome, RubricDefinition, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { HARNESS_PARTS, type HarnessRubricContext, hasPackageScript, hasTomlTable, REQUIRED_HARNESS_SCRIPTS } from '../contexts/harness.ts'

const outcomes = <Result>(values: Result[]): RubricOutcomes<Result> => {
  if (values.length === 0) throw new Error('rubric execution must return at least one outcome')
  return values as unknown as RubricOutcomes<Result>
}

const result = (status: AuditOutcome['status'], message: string, subject?: string): RubricOutcomes<AuditOutcome> => [
  { status, message, ...(subject ? { subject } : {}) }
]

const LAYOUT = [
  {
    code: 'LAY-1',
    title: 'Five-part directory layout',
    description: 'skills/, agents/, mcp/, evals/, and hooks/ all exist at the harness root.',
    sources: ['standards.md#layout'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.rootExists) return result('VIOLATION', `Harness root does not exist: ${context.root}.`, context.root)
          return outcomes<AuditOutcome>(
            HARNESS_PARTS.map((part) => ({
              status: context.exists(`${part}/`) ? 'PASS' : 'VIOLATION',
              message: 'Required five-part directory is present.',
              subject: `${part}/`
            }))
          )
        }
      },
      conform: {
        phase: 'PREPARE',
        run: (context: HarnessRubricContext) => outcomes<ConformOutcome>(HARNESS_PARTS.flatMap(context.ensurePart))
      }
    }
  },
  {
    code: 'LAY-2',
    title: 'Shelf descriptions',
    description: 'Each five-part directory contains a README.md declaring its purpose and status.',
    sources: ['standards.md#layout'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          outcomes<AuditOutcome>(
            HARNESS_PARTS.map((part) => ({
              status: !context.exists(`${part}/`) ? 'NOT_APPLICABLE' : context.exists(`${part}/README.md`) ? 'PASS' : 'VIOLATION',
              message: !context.exists(`${part}/`) ? 'Harness part is absent.' : 'Required shelf description is present.',
              subject: `${part}/README.md`
            }))
          )
      },
      conform: {
        phase: 'DERIVED',
        run: (context: HarnessRubricContext) => outcomes<ConformOutcome>(HARNESS_PARTS.flatMap(context.ensureShelfReadme))
      }
    }
  },
  {
    code: 'LAY-3',
    title: 'Root Claude orientation',
    description: 'CLAUDE.md exists at the harness root.',
    sources: ['standards.md#claudemd'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('CLAUDE.md') ? 'PASS' : 'VIOLATION', 'Required root orientation is present.', 'CLAUDE.md')
      }
    }
  },
  {
    code: 'LAY-4',
    title: 'Root roadmap',
    description: 'ROADMAP.md exists at the harness root.',
    sources: ['standards.md#roadmapmd'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('ROADMAP.md') ? 'PASS' : 'VIOLATION', 'Open-work register is present.', 'ROADMAP.md')
      }
    }
  },
  {
    code: 'LAY-5',
    title: 'Root Knowledge Islands configuration',
    description: '.ki-config.toml exists at the harness root.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('.ki-config.toml') ? 'PASS' : 'VIOLATION', 'Required KI configuration is present.', '.ki-config.toml')
      }
    }
  }
] as const

const CLAUDE = [
  {
    code: 'CLAUDE-1',
    title: 'Harness introduction',
    description: 'The root orientation opens by explaining the harness and naming all five parts.',
    sources: ['standards.md#claudemd'],
    judgment: {
      prompt: 'Read the effective root orientation and assess whether its introduction explains the harness and names all five parts.'
    }
  },
  {
    code: 'CLAUDE-2',
    title: 'Five-part status',
    description: 'The root orientation gives a current status for every harness part.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Compare the orientation status table or equivalent block with the five actual harness directories.' }
  },
  {
    code: 'CLAUDE-3',
    title: 'Working conventions',
    description: 'The root orientation routes working conventions for every harness part.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Assess whether each harness part has concise, usable working guidance or a route to its governing skill.' }
  },
  {
    code: 'CLAUDE-4',
    title: 'Toolchain commands',
    description: 'The root orientation lists the key harness toolchain commands.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Verify that the documented commands cover the current project-copy and skill-audit entry points.' }
  },
  {
    code: 'CLAUDE-5',
    title: 'Orientation freshness',
    description: 'Counts, shelf statuses, and command names in the orientation match the repository.',
    sources: ['standards.md#claudemd'],
    judgment: { prompt: 'Compare orientation claims with package.json, skills/, and the five harness shelves for stale facts.' }
  }
] as const

const packageMissing = (context: HarnessRubricContext): boolean => !context.exists('package.json')

const PACKAGE = [
  {
    code: 'PKG-1',
    title: 'Project skill delivery script',
    description: 'package.json contains the normal ki:skills:copy:project delivery entry.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(
            packageMissing(context) || !hasPackageScript(context.packageJson, 'ki:skills:copy:project') ? 'VIOLATION' : 'PASS',
            packageMissing(context) ? 'Package manifest is absent — cannot check scripts.' : "Must have a 'ki:skills:copy:project' script.",
            'package.json'
          )
      }
    }
  },
  {
    code: 'PKG-2',
    title: 'Skill audit script',
    description: 'package.json contains the ki:skills:audit quality gate.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(
            packageMissing(context) || !hasPackageScript(context.packageJson, 'ki:skills:audit') ? 'VIOLATION' : 'PASS',
            packageMissing(context) ? 'Package manifest is absent — cannot check scripts.' : "Must have a 'ki:skills:audit' script.",
            'package.json'
          )
      }
    }
  },
  {
    code: 'PKG-4',
    title: 'Harness development and evaluation scripts',
    description: 'package.json carries the repository linking, global linking, refresh-status, and evaluation entries.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (packageMissing(context)) return result('NOT_APPLICABLE', 'Package manifest is absent.', 'package.json')
          return outcomes<AuditOutcome>(
            REQUIRED_HARNESS_SCRIPTS.slice(2).map((script) => ({
              status: hasPackageScript(context.packageJson, script) ? 'PASS' : 'VIOLATION',
              message: `Should have a '${script}' script.`,
              subject: 'package.json'
            }))
          )
        }
      }
    }
  },
  {
    code: 'PKG-5',
    title: 'Checker invocation documentation',
    description: 'Governed-repository documentation uses .ki-meta checker entry points rather than harness-only package aliases.',
    sources: ['standards.md#packagejson'],
    judgment: {
      prompt: 'Review user-facing documentation and ensure vendored checker invocations are canonical outside harness-only guidance.'
    }
  },
  {
    code: 'PKG-6',
    title: 'Package script target integrity',
    description: 'Every ki:* bun or bunx script target names a file that exists below the harness root.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (packageMissing(context)) return result('NOT_APPLICABLE', 'Package manifest is absent.', 'package.json')
          const scripts = (context.packageJson.scripts as Record<string, string> | undefined) ?? {}
          const missing: AuditOutcome[] = []
          for (const [key, command] of Object.entries(scripts)) {
            if (!key.startsWith('ki:') || typeof command !== 'string') continue
            for (const segment of command.split(/&&|\|\||[;|]/)) {
              const tokens = segment.trim().split(/\s+/)
              for (let index = 0; index < tokens.length - 1; index++) {
                if (tokens[index] !== 'bun' && tokens[index] !== 'bunx') continue
                const argument = tokens[index + 1] as string
                if (
                  argument === 'run' ||
                  argument.startsWith('-') ||
                  !(/\.(ts|tsx|js|mjs|cjs|sh)$/.test(argument) || argument.startsWith('./') || argument.startsWith('.ki-meta/'))
                )
                  continue
                if (!context.exists(argument))
                  missing.push({
                    status: 'VIOLATION',
                    message: `Script '${key}' shells 'bun ${argument}', which does not exist.`,
                    subject: 'package.json'
                  })
              }
            }
          }
          return missing.length > 0
            ? outcomes<AuditOutcome>(missing)
            : result('PASS', 'All ki:* bun script targets resolve to a file.', 'package.json')
        }
      }
    }
  }
] as const

const CONFIG = [
  {
    code: 'CONFIG-1',
    title: 'Harness declaration',
    description: '.ki-config.toml contains a ki-harness root table.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          context.config === null
            ? result('NOT_APPLICABLE', 'KI configuration is absent — skipping table checks.', '.ki-config.toml')
            : result(
                hasTomlTable(context.config, 'ki-harness') ? 'PASS' : 'VIOLATION',
                'Must have a [ki-harness] table.',
                '.ki-config.toml'
              )
      },
      conform: { phase: 'PRIMARY', run: (context: HarnessRubricContext) => context.ensureHarnessConfig() }
    }
  },
  {
    code: 'CONFIG-2',
    title: 'Repository governance declaration',
    description: '.ki-config.toml contains a ki-repo root table.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          context.config === null
            ? result('NOT_APPLICABLE', 'KI configuration is absent.', '.ki-config.toml')
            : result(hasTomlTable(context.config, 'ki-repo') ? 'PASS' : 'VIOLATION', 'Should have a [ki-repo] table.', '.ki-config.toml')
      }
    }
  },
  {
    code: 'CONFIG-3',
    title: 'Skill governance declaration',
    description: 'A populated skills/ directory is declared through ki-skills.',
    sources: ['standards.md#ki-configtoml'],
    judgment: { prompt: 'When skills/ is populated, verify that .ki-config.toml declares the ki-skills governance root.' }
  }
] as const

const SKILLS = [
  {
    code: 'SKILLS-1',
    title: 'Skill directory and name alignment',
    description: 'Each direct skills/ entry with a SKILL.md matches its name frontmatter.',
    sources: ['standards.md#skills-directory'],
    mechanical: {
      level: 'FAIL',
      overrideLevels: ['WARN'],
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.exists('skills/')) return result('NOT_APPLICABLE', 'Skill directory is absent — skipping name checks.', 'skills/')
          if (context.skills.length === 0) return result('PASS', 'No direct skill entries require name alignment.', 'skills/')
          return outcomes<AuditOutcome>(
            context.skills.map((skill) =>
              skill.declaredName === null
                ? {
                    status: 'VIOLATION' as const,
                    level: 'WARN' as const,
                    message: 'No parseable name: frontmatter.',
                    subject: `skills/${skill.directory}/SKILL.md`
                  }
                : {
                    status: skill.declaredName === skill.directory ? ('PASS' as const) : ('VIOLATION' as const),
                    message: `Directory '${skill.directory}' must match name: '${skill.declaredName}'.`,
                    subject: `skills/${skill.directory}`
                  }
            )
          )
        }
      }
    }
  },
  {
    code: 'SKILLS-2',
    title: 'Unique skill names',
    description: 'No two local skill entries share a frontmatter name, and composed surfaces remain unambiguous.',
    sources: ['standards.md#skills-directory'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.exists('skills/'))
            return result('NOT_APPLICABLE', 'Skill directory is absent — skipping duplicate-name checks.', 'skills/')
          const names = new Map<string, string[]>()
          for (const skill of context.skills) {
            if (!skill.declaredName) continue
            names.set(skill.declaredName, [...(names.get(skill.declaredName) ?? []), skill.directory])
          }
          const duplicates = [...names.entries()].filter(([, entries]) => entries.length > 1)
          return duplicates.length > 0
            ? outcomes<AuditOutcome>(
                duplicates.map(([name, entries]) => ({
                  status: 'VIOLATION',
                  message: `Duplicate name '${name}' in ${entries.map((entry) => `skills/${entry}`).join(', ')}.`,
                  subject: 'skills/'
                }))
              )
            : result('PASS', 'Local skill names are unique.', 'skills/')
        }
      }
    },
    judgment: { prompt: 'Assess whether another installed or composed surface makes an otherwise unique local skill name ambiguous.' }
  }
] as const

const LONGEVITY = [
  {
    code: 'LONG-1',
    title: 'Refresh path',
    description: 'The ki-harness skill carries REFRESH and a dated source review record.',
    sources: ['standards.md'],
    judgment: { prompt: 'Review the ki-harness REFRESH procedure and sources.md cadence for a usable current refresh path.' }
  }
] as const

const COLLISION = [
  {
    code: 'COLL-1',
    title: 'Composition boundary',
    description: 'AUDIT names its composed sibling checks and the description provides contents-governing off-ramps.',
    sources: ['standards.md'],
    judgment: { prompt: 'Review the AUDIT composition list and description off-ramps for complete, non-overlapping ownership.' }
  }
] as const

export const KI_HARNESS_RUBRIC: RubricDefinition<HarnessRubricContext> = {
  name: 'ki-harness',
  concern: 'Knowledge Islands agentic harnesses',
  families: [
    {
      code: 'LAY',
      title: 'Directory layout and files',
      description: 'The five-part harness container and required root files.',
      standard: 'standards.md#layout',
      selectContext: (context) => context,
      items: LAYOUT
    },
    {
      code: 'CLAUDE',
      title: 'Root orientation',
      description: 'Coverage and freshness of the effective root orientation.',
      standard: 'standards.md#claudemd',
      selectContext: (context) => context,
      items: CLAUDE
    },
    {
      code: 'PKG',
      title: 'Package script families',
      description: 'Harness-owned package scripts and their target integrity.',
      standard: 'standards.md#packagejson',
      selectContext: (context) => context,
      items: PACKAGE
    },
    {
      code: 'CONFIG',
      title: 'Harness configuration',
      description: 'Knowledge Islands governance declarations.',
      standard: 'standards.md#ki-configtoml',
      selectContext: (context) => context,
      items: CONFIG
    },
    {
      code: 'SKILLS',
      title: 'Skill directory convention',
      description: 'Direct skill-name integrity within the harness.',
      standard: 'standards.md#skills-directory',
      selectContext: (context) => context,
      items: SKILLS
    },
    {
      code: 'LONG',
      title: 'Longevity',
      description: 'Refresh discipline for the harness standard.',
      standard: 'standards.md',
      selectContext: (context) => context,
      items: LONGEVITY
    },
    {
      code: 'COLL',
      title: 'Collision and boundary',
      description: 'Composition and off-ramp clarity.',
      standard: 'standards.md',
      selectContext: (context) => context,
      items: COLLISION
    }
  ]
}

export const KI_HARNESS_FAMILY_CODES = KI_HARNESS_RUBRIC.families.map((family) => family.code)
