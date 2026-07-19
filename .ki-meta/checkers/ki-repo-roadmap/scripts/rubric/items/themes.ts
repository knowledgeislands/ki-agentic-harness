import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { RoadmapContext } from '../contexts/roadmap.ts'
import { mechanical } from './common.ts'

export const THEME_1 = mechanical('THEME-1', 'theme layout', 'Theme directories are lowercase kebab-case, contain `ROADMAP.md`, and thematic items are `###` headings under a horizon.')
export const THEME_2 = mechanical('THEME-2', 'stable theme code', 'Every theme roadmap declares exactly one unquoted uppercase `code`, unique across the repository; plan IDs in that theme begin with that stable code.')
export const THEME_3 = mechanical('THEME-3', 'non-empty themes', 'A theme roadmap contains at least one item. CONFORM prunes only an otherwise scaffold-only empty theme, retaining indexes and repository READMEs.', 'FAIL', true)
export const THEME_4: RubricItem<RoadmapContext> = { code: 'THEME-4', title: 'coherent themes', description: 'Themes are coherent workstreams, neither catch-alls nor one-item bureaucracy.', sources: ['standards.md'], judgment: { prompt: 'Review theme boundaries and granularity.' } }
export const THEME = [THEME_1, THEME_2, THEME_3, THEME_4] as const
