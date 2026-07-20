import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { EngineeringRubricContext } from '../contexts/engineering.ts'
import { BIO } from './biome.ts'
import { BUILD } from './build.ts'
import { BUN } from './bun.ts'
import { CI } from './ci.ts'
import { DEPS } from './dependencies.ts'
import { ENV } from './environment.ts'
import { GEN } from './generated.ts'
import { KNIP } from './knip.ts'
import { MISE } from './mise.ts'
import { PKG } from './package.ts'
import { SCR } from './scripts.ts'
import { SYNC } from './sync.ts'
import { TEST } from './test.ts'
import { TOML } from './toml.ts'
import { TSC } from './typescript.ts'

const context = (value: EngineeringRubricContext): EngineeringRubricContext => value
export const ENGINEERING_ITEMS = [
  ...PKG,
  ...MISE,
  ...CI,
  ...SCR,
  ...BUN,
  ...TSC,
  ...BIO,
  ...KNIP,
  ...SYNC,
  ...DEPS,
  ...GEN,
  ...TEST,
  ...BUILD,
  ...ENV,
  ...TOML
] as const
export const KI_ENGINEERING_RUBRIC: RubricDefinition<EngineeringRubricContext> = {
  name: 'ki-engineering',
  concern: 'engineering standards',
  families: [
    defineRubricFamily({
      code: 'PKG',
      title: 'PKG engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: PKG
    }),
    defineRubricFamily({
      code: 'MISE',
      title: 'MISE engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: MISE
    }),
    defineRubricFamily({
      code: 'CI',
      title: 'CI engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: CI
    }),
    defineRubricFamily({
      code: 'SCR',
      title: 'SCR engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: SCR
    }),
    defineRubricFamily({
      code: 'BUN',
      title: 'BUN engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: BUN
    }),
    defineRubricFamily({
      code: 'TSC',
      title: 'TSC engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: TSC
    }),
    defineRubricFamily({
      code: 'BIO',
      title: 'BIO engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: BIO
    }),
    defineRubricFamily({
      code: 'KNIP',
      title: 'KNIP engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: KNIP
    }),
    defineRubricFamily({
      code: 'SYNC',
      title: 'SYNC engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: SYNC
    }),
    defineRubricFamily({
      code: 'DEPS',
      title: 'DEPS engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: DEPS
    }),
    defineRubricFamily({
      code: 'GEN',
      title: 'GEN engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: GEN
    }),
    defineRubricFamily({
      code: 'TEST',
      title: 'TEST engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: TEST
    }),
    defineRubricFamily({
      code: 'BUILD',
      title: 'BUILD engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: BUILD
    }),
    defineRubricFamily({
      code: 'ENV',
      title: 'ENV engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: ENV
    }),
    defineRubricFamily({
      code: 'TOML',
      title: 'TOML engineering rules',
      description: 'Stable engineering criteria preserved from the engineering standard.',
      standard: 'standards.md',
      selectContext: context,
      items: TOML
    })
  ]
}
