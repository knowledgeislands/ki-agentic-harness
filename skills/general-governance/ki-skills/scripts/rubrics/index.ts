import { BODY } from './body.ts'
import { COLLISION } from './collision.ts'
import { DESC } from './description.ts'
import { KI_CHECKER } from './ki-checker.ts'
import { KI_INVOKE } from './ki-invoke.ts'
import { KI_SHAPE } from './ki-shape.ts'
import { LAYOUT } from './layout.ts'
import { LINKS } from './link.ts'
import { LONGEVITY } from './longevity.ts'
import { NAME } from './name.ts'
import { OPTIONAL } from './optional.ts'
import { PROCESS } from './process.ts'
import { REFERENCES } from './references.ts'
import { SCRIPTS } from './scripts.ts'
import { SIZE } from './size.ts'

export const RUBRIC_FAMILIES = [
  NAME,
  DESC,
  OPTIONAL,
  SIZE,
  REFERENCES,
  BODY,
  SCRIPTS,
  KI_CHECKER,
  LINKS,
  LAYOUT,
  KI_SHAPE,
  KI_INVOKE,
  PROCESS,
  COLLISION,
  LONGEVITY
] as const

export const RUBRIC_ITEMS = RUBRIC_FAMILIES.flat()
