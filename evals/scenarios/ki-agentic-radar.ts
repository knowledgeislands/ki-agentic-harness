/**
 * Outcome scenarios for the `ki-agentic-radar` governance contract.
 *
 * These test the house-specific distinction between specification maturity,
 * implementation evidence, interoperability evidence, and structural patterns.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-agentic-radar',
    id: 'agentic-radar-classification-and-uncertainty',
    prompt:
      'A vendor repeatedly calls its orchestration design an agent graph and a W3C Community Group is discussing a related protocol. May the radar call either one a formal standard?',
    assertions: [
      {
        name: 'vendor term is not a standard',
        re: /(vendor|marketing)[^.\n]{0,80}(not|does not|isn.t)[^.\n]{0,45}(standard|normative)|cannot[^.\n]{0,55}formal standard/i
      },
      {
        name: 'community group is incubation evidence',
        re: /community group[^.\n]{0,90}(incubat|not[^.\n]{0,30}(recommendation|standard))/i
      },
      { name: 'records uncertainty', re: /uncertainty|unknown|unverified|evidence gap/i }
    ],
    rubric:
      'House contract: vendor terminology is not a formal standard, and standards-body incubation is not a Recommendation. Record each subject kind and maturity from evidence, retain uncertainty, and avoid upgrading claims through association.'
  },
  {
    skill: 'ki-agentic-radar',
    id: 'agentic-radar-interoperability-gate',
    prompt:
      'A protocol has a versioned specification and several client packages, but only one catalogued server. Is that enough for Trial or Adopt in Knowledge Islands?',
    assertions: [
      {
        name: 'packages are not interoperability proof',
        re: /(package|client)[^.\n]{0,80}(not enough|insufficient|does not prove|isn.t proof)/i
      },
      {
        name: 'requires independent interoperability evidence',
        re: /independent[^.\n]{0,70}(server|implementation|interop)|interoperab[^.\n]{0,70}(demonstrat|evidence|test)/i
      },
      {
        name: 'requires KI use and local evidence',
        re: /(Knowledge Islands|KI|local)[^.\n]{0,80}(use case|evidence|trial|fit)/i
      }
    ],
    rubric:
      'House contract: versioning and package availability are separate from demonstrated independent interoperability. Trial or Adopt needs a concrete Knowledge Islands use case and proportionate local evidence; the radar may retain Assess or Watch without changing consumers.'
  },
  {
    skill: 'ki-agentic-radar',
    id: 'agentic-radar-structural-vocabulary',
    prompt:
      'Explain why a graph-orchestrated agent workflow, a knowledge graph, and a provenance graph must remain separate radar subjects.',
    assertions: [
      { name: 'control flow', re: /control flow|execution|orchestrat|routing/i },
      { name: 'knowledge structure', re: /knowledge[^.\n]{0,45}(entity|relation|semantic|fact)/i },
      { name: 'provenance structure', re: /provenance[^.\n]{0,55}(lineage|evidence|origin|derivation)/i },
      { name: 'not equivalent standards', re: /(distinct|separate|not equivalent|different)/i }
    ],
    rubric:
      'House contract: graph orchestration describes execution or control flow, a knowledge graph represents semantic entities and relations, and a provenance graph represents origin or derivation of evidence. Similar graph language does not make them equivalent standards or collapse their owners.'
  }
]
