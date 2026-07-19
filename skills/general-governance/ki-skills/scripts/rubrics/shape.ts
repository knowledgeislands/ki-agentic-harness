import type { RubricItem } from '../lib/rubric/rubric.ts'

export const SHAPE: readonly RubricItem[] = [
  {
    code: 'SHAPE-1',
    title: 'standard skills resolve base bindings at runtime',
    description: 'A standard KI skill hard-codes no single base binding.',
    sources: ['KI'],
    judgment: { prompt: 'Does this standard skill resolve base bindings at runtime without hard-coding one base?' }
  },
  {
    code: 'SHAPE-2',
    title: 'skills compose rather than extend',
    description: 'Inter-skill relationships are declared sequential composition, never base-coupled extension.',
    sources: ['KI'],
    judgment: { prompt: 'Does every inter-skill relationship use declared composition rather than base-coupled extension?' }
  },
  {
    code: 'SHAPE-3',
    title: 'the skill declares its kind',
    description: 'A skill clearly declares whether it is governance or process.',
    sources: ['ADR-KI-HARNESS-SKILLS-006'],
    judgment: { prompt: 'Does the skill correctly and clearly declare its governance or process kind?' }
  },
  {
    code: 'SHAPE-4',
    title: 'a skill validates only its own configuration table',
    description: 'A configuration-reading skill validates its own table and ignores unrelated ones.',
    sources: ['KI'],
    judgment: { prompt: 'Does this skill validate only its own configuration table and ignore unrelated tables?' }
  },
  {
    code: 'SHAPE-5',
    title: 'governance skills expose universal modes',
    description: 'Governance skills expose AUDIT, CONFORM, EDUCATE, REFRESH, and HELP.',
    sources: ['KI'],
    judgment: { prompt: 'Does this governance skill expose the universal modes with appropriate additional modes only?' }
  },
  {
    code: 'SHAPE-6',
    title: 'governance skills use the KI file shape',
    description: 'A KI governance skill uses the shared reference and executable names.',
    sources: ['KI'],
    judgment: { prompt: 'Does this KI governance skill use the required reference and executable file shape?' }
  },
  {
    code: 'SHAPE-7',
    title: 'behaviour-changing skills define and check their anchor',
    description: 'A default-behaviour change is anchored in always-loaded context and checked by the skill.',
    sources: ['KI'],
    judgment: { prompt: 'Does a behaviour-changing skill have an appropriate always-loaded anchor that its checker verifies?' }
  },
  {
    code: 'SHAPE-8',
    title: 'governance checkers use the canonical reporter',
    description: 'A checker emits canonical reporter output from a local payload without a private renderer.',
    sources: ['KI'],
    judgment: { prompt: 'Does the checker fully follow the canonical reporter contract beyond the mechanical checks?' }
  },
  {
    code: 'SHAPE-9',
    title: 'mechanical work belongs in the checker',
    description: 'Deterministic criteria are implemented mechanically and judgment criteria genuinely require review.',
    sources: ['KI'],
    judgment: { prompt: 'Do remaining judgment criteria genuinely require review rather than deterministic checking?' }
  },
  {
    code: 'SHAPE-10',
    title: 'skills do not assume private user configuration',
    description: 'A skill relies only on public runtime guarantees or always-loaded repository context.',
    sources: ['KI'],
    judgment: { prompt: 'Does the skill avoid assuming private personal configuration?' }
  },
  {
    code: 'SHAPE-11',
    title: 'governance skills expose HELP',
    description: 'A governance skill advertises the universal help verb in its argument hint.',
    sources: ['ADR-KI-HARNESS-SKILLS-001']
  },
  {
    code: 'SHAPE-12',
    title: 'governance mode vocabulary is canonical and complete',
    description: 'A governance skill declares and provides its canonical vendorable modes.',
    sources: ['KI']
  },
  {
    code: 'SHAPE-13',
    title: 'mode headings have a canonical structure',
    description: 'Governance modes appear under one Operating modes section with matching declared verbs.',
    sources: ['KI']
  },
  {
    code: 'SHAPE-14',
    title: 'REFRESH states its harness-only precondition',
    description: 'REFRESH writes only canonical harness files and redirects from vendored use.',
    sources: ['KI']
  },
  {
    code: 'SHAPE-15',
    title: 'vendored modes have a uniform shape',
    description: 'A governance skill declares uniform vendorable modes and their bare entry scripts.',
    sources: ['KI']
  },
  {
    code: 'SHAPE-16',
    title: 'target files have declared ownership',
    description: 'A skill declares target-file ownership, contribution, or requirement consistently with its checker.',
    sources: ['KI']
  },
  {
    code: 'SHAPE-17',
    title: 'dependencies are declared explicitly',
    description: 'Every skill has an explicit single-line dependency declaration.',
    sources: ['ADR-KI-HARNESS-SKILLS-006']
  }
]
