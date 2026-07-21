import { defineRubricFamily, type RubricDefinition } from '../../shared/rubric.ts'
import type { KiSkillsRubricContext } from '../contexts/contexts.ts'
import { BODY } from './body.ts'
import { COLLISION } from './collision.ts'
import { DESC } from './description.ts'
import { FRONTMATTER } from './frontmatter.ts'
import { KI_CHECKER } from './ki-checker.ts'
import { KI_INVOKE } from './ki-invoke.ts'
import { KI_LINK } from './ki-link.ts'
import { KI_SHAPE } from './ki-shape.ts'
import { LAYOUT } from './layout.ts'
import { LONGEVITY } from './longevity.ts'
import { NAME } from './name.ts'
import { OPTIONAL } from './optional.ts'
import { PROCESS } from './process.ts'
import { REFERENCES } from './references.ts'
import { SCRIPTS } from './scripts.ts'
import { SIZE } from './size.ts'

const RUBRIC_FAMILIES = [
  defineRubricFamily({
    code: 'LAY',
    title: 'File existence & layout',
    description: 'Portable skill layout and supporting-file structure.',
    standard: 'standards.md#2-layout',
    selectContext: (context: KiSkillsRubricContext) => context.layout,
    items: LAYOUT
  }),
  defineRubricFamily({
    code: 'FM',
    title: 'Frontmatter document',
    description: 'The YAML frontmatter document that identifies a skill.',
    standard: 'standards.md#3-frontmatter-document',
    selectContext: (context: KiSkillsRubricContext) => context.frontmatter,
    items: FRONTMATTER
  }),
  defineRubricFamily({
    code: 'NAME',
    title: 'Frontmatter: name',
    description: 'The portable skill name contract.',
    standard: 'standards.md#4-frontmatter-name',
    selectContext: (context: KiSkillsRubricContext) => context.name,
    items: NAME
  }),
  defineRubricFamily({
    code: 'DESC',
    title: 'Frontmatter: description',
    description: 'The portable skill description contract.',
    standard: 'standards.md#5-frontmatter-description',
    selectContext: (context: KiSkillsRubricContext) => context.description,
    items: DESC
  }),
  defineRubricFamily({
    code: 'OPT',
    title: 'Frontmatter: optional fields',
    description: 'Optional portable and runtime-specific frontmatter fields.',
    standard: 'standards.md#6-frontmatter-optional-fields',
    selectContext: (context: KiSkillsRubricContext) => context.optional,
    items: OPTIONAL
  }),
  defineRubricFamily({
    code: 'SIZE',
    title: 'Body: size & conciseness',
    description: 'The progressive-disclosure budget for a skill body.',
    standard: 'standards.md#7-size--conciseness',
    selectContext: (context: KiSkillsRubricContext) => context.size,
    items: SIZE
  }),
  defineRubricFamily({
    code: 'REF',
    title: 'Progressive disclosure & references',
    description: 'How a skill routes supporting detail into references.',
    standard: 'standards.md#8-progressive-disclosure',
    selectContext: (context: KiSkillsRubricContext) => context.references,
    items: REFERENCES
  }),
  defineRubricFamily({
    code: 'BODY',
    title: 'Body content quality',
    description: 'The quality and usability of the skill instructions.',
    standard: 'standards.md#9-body-content-quality',
    selectContext: (context: KiSkillsRubricContext) => context,
    items: BODY
  }),
  defineRubricFamily({
    code: 'SCRIPT',
    title: 'Scripts & executable code',
    description: 'The quality and autonomy of executable skill support.',
    standard: 'standards.md#10-scripts',
    selectContext: (context: KiSkillsRubricContext) => context.scripts,
    items: SCRIPTS
  }),
  defineRubricFamily({
    code: 'KI-CHECKER',
    title: 'Knowledge Islands checker contract',
    description: 'Knowledge Islands packaging and checker responsibilities.',
    standard: 'checker-contract.md',
    selectContext: (context: KiSkillsRubricContext) => context.checker,
    items: KI_CHECKER
  }),
  defineRubricFamily({
    code: 'KI-LINK',
    title: 'Knowledge Islands linking & portability',
    description: 'Knowledge Islands link and toolchain portability.',
    standard: 'standards.md#13-knowledge-islands-linking--portability',
    selectContext: (context: KiSkillsRubricContext) => context.link,
    items: KI_LINK
  }),
  defineRubricFamily({
    code: 'KI-SHAPE',
    title: 'Knowledge Islands skill shape',
    description: 'The common shape of a Knowledge Islands governance skill.',
    standard: 'standards.md#14-knowledge-islands-skill-shape',
    selectContext: (context: KiSkillsRubricContext) => context.shape,
    items: KI_SHAPE
  }),
  defineRubricFamily({
    code: 'KI-INVOKE',
    title: 'Invocation protocol',
    description: 'Safe invocation for a skill with named modes.',
    standard: '../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md',
    selectContext: (context: KiSkillsRubricContext) => context,
    items: KI_INVOKE
  }),
  defineRubricFamily({
    code: 'PROC',
    title: 'Process / meta',
    description: 'Evaluation and real-usage evidence for the skill.',
    standard: 'standards.md#11-process--evaluation',
    selectContext: (context: KiSkillsRubricContext) => context,
    items: PROCESS
  }),
  defineRubricFamily({
    code: 'COLL',
    title: 'Cross-skill collision',
    description: 'Selection boundaries across a set of skills.',
    standard: 'standards.md#15-cross-skill-collision',
    selectContext: (context: KiSkillsRubricContext) => context.collision,
    items: COLLISION
  }),
  defineRubricFamily({
    code: 'LONG',
    title: 'Longevity',
    description: 'Refresh paths and cadence for knowledge that changes over time.',
    standard: 'standards.md#12-longevity',
    selectContext: (context: KiSkillsRubricContext) => context.longevity,
    items: LONGEVITY
  })
] as const

export const KI_SKILLS_RUBRIC: RubricDefinition<KiSkillsRubricContext> = {
  name: 'ki-skills',
  concern: 'Agent Skills',
  families: RUBRIC_FAMILIES
}

export const RUBRIC_ITEMS = KI_SKILLS_RUBRIC.families.flatMap((family) => family.items)
