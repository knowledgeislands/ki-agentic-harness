import { judgment, mechanical } from './common.ts'
export const GATE_1 = mechanical(
  'GATE-1',
  'always-loaded Enactment gate',
  'A base with proposals anchors the Enactment Process and proposal gate in root CLAUDE.md or AGENTS.md.',
  'WARN'
)
export const GATE_2 = judgment(
  'GATE-2',
  'imperative gate directive',
  'The anchor is imperative and states the gate exemptions.',
  'Is the anchor a genuine imperative directive with the appropriate exemptions?'
)
export const GATE = [GATE_1, GATE_2] as const
