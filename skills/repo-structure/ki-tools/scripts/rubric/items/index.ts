import { CONFIG } from './config.ts'
import { LANG } from './language.ts'
import { SHELL } from './shell.ts'
import { TOOL } from './tool.ts'
import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { ToolsContext } from '../contexts/tools.ts'
export const KI_TOOLS_RUBRIC: RubricDefinition<ToolsContext> = { name: 'ki-tools', concern: 'tools', families: [
  defineRubricFamily({ code: 'TOOL', title: 'tool repository', description: 'Layout, executable, distribution, versioning, and judgment criteria.', standard: 'standards.md', selectContext: (context: ToolsContext) => context, items: TOOL as never }),
  defineRubricFamily({ code: 'SHELL', title: 'shell capabilities', description: 'Shell-specific CI requirements.', standard: 'standards.md', selectContext: (context: ToolsContext) => context, items: SHELL as never }),
  defineRubricFamily({ code: 'LANG', title: 'language capabilities', description: 'Language toolchain deferral.', standard: 'standards.md', selectContext: (context: ToolsContext) => context, items: LANG as never }),
  defineRubricFamily({ code: 'CONFIG', title: 'configuration', description: 'Applicability marker and validate-down keys.', standard: 'standards.md', selectContext: (context: ToolsContext) => context, items: CONFIG as never })
] }
export const KI_TOOLS_FAMILY_CODES = ['TOOL', 'SHELL', 'LANG', 'CONFIG'] as const
