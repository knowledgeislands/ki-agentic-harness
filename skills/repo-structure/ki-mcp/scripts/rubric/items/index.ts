import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { McpRubricContext } from '../contexts/mcp.ts'
import { APPLICABILITY } from './applicability.ts'
import { CFG, TEST, UTIL } from './config.ts'
import { DOC, LAY } from './layout.ts'
import { CI, PKG, SCR } from './package.ts'
import { TOOL } from './tools.ts'

const context = (value: McpRubricContext): McpRubricContext => value
export const KI_MCP_RUBRIC = {
  name: 'ki-mcp',
  concern: 'Knowledge Islands MCP servers',
  families: [
    defineRubricFamily({
      code: 'KI',
      title: 'Applicability and declaration',
      description: 'Scope activation and the ki-mcp governance declaration.',
      standard: 'standards.md#applicability',
      selectContext: context,
      items: APPLICABILITY
    }),
    defineRubricFamily({
      code: 'LAY',
      title: 'Source layout',
      description: 'MCP source layers.',
      standard: 'standards.md#canonical-shape',
      selectContext: context,
      items: LAY
    }),
    defineRubricFamily({
      code: 'DOC',
      title: 'MCP documentation',
      description: 'MCP-specific root documents.',
      standard: 'standards.md#documentation',
      selectContext: context,
      items: DOC
    }),
    defineRubricFamily({
      code: 'CFG',
      title: 'Configuration',
      description: 'Injected configuration evidence.',
      standard: 'standards.md#config-injection',
      selectContext: context,
      items: CFG
    }),
    defineRubricFamily({
      code: 'UTIL',
      title: 'Shared utilities',
      description: 'Shared MCP helper modules.',
      standard: 'standards.md#audit-logging',
      selectContext: context,
      items: UTIL
    }),
    defineRubricFamily({
      code: 'TEST',
      title: 'Test wiring',
      description: 'MCP coverage exclusions.',
      standard: 'standards.md#testing',
      selectContext: context,
      items: TEST
    }),
    defineRubricFamily({
      code: 'TOOL',
      title: 'Tool surface',
      description: 'Tool registration names, structured output, and stable registration order.',
      standard: 'standards.md#tool-naming',
      selectContext: context,
      items: TOOL
    }),
    defineRubricFamily({
      code: 'PKG',
      title: 'Package entry points',
      description: 'MCP package entry points.',
      standard: 'standards.md#packagejson',
      selectContext: context,
      items: PKG
    }),
    defineRubricFamily({
      code: 'SCR',
      title: 'MCP scripts',
      description: 'MCP runtime and generation scripts.',
      standard: 'standards.md#packagejson',
      selectContext: context,
      items: SCR
    }),
    defineRubricFamily({
      code: 'CI',
      title: 'Smoke CI',
      description: 'The MCP smoke harness and workflow hook.',
      standard: 'standards.md#packagejson',
      selectContext: context,
      items: CI
    })
  ]
} as unknown as RubricDefinition<McpRubricContext>
export const KI_MCP_FAMILY_CODES = KI_MCP_RUBRIC.families.map((family) => family.code)
