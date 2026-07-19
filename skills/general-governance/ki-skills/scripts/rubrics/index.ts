import { BODY } from './body.ts'
import { COLLISION } from './collision.ts'
import { DESC } from './description.ts'
import { INVOCATION } from './invocation.ts'
import { LAYOUT } from './layout.ts'
import { LINKS } from './link.ts'
import { LONGEVITY } from './longevity.ts'
import { NAME } from './name.ts'
import { OPTIONAL } from './optional.ts'
import { PROCESS } from './process.ts'
import { REFERENCES } from './references.ts'
import { SCRIPTS } from './scripts.ts'
import { SHAPE } from './shape.ts'
import { SIZE } from './size.ts'

export const RUBRIC_FAMILIES = [
  NAME,
  DESC,
  OPTIONAL,
  SIZE,
  REFERENCES,
  BODY,
  SCRIPTS,
  LINKS,
  LAYOUT,
  SHAPE,
  INVOCATION,
  PROCESS,
  COLLISION,
  LONGEVITY
] as const

export const RUBRIC_ITEMS = RUBRIC_FAMILIES.flat()
