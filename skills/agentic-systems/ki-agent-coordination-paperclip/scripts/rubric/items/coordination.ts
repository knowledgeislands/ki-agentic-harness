import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { PaperclipCoordinationContext } from '../contexts/coordination.ts'

const STANDARD = 'standards-agent-coordination-paperclip.md'

export const COORD: RubricFamily<PaperclipCoordinationContext, PaperclipCoordinationContext> = {
  code: 'COORD',
  title: 'KI–Paperclip coordination',
  description: 'Repository authority, identity separation, work linkage, workspace isolation, and evidence return.',
  standard: STANDARD,
  selectContext: (context) => context,
  items: [
    {
      code: 'COORD-1',
      title: 'Repository authority',
      description: 'Paperclip coordinates execution without becoming durable KI knowledge or work authority.',
      sources: [
        `${STANDARD}#position-and-authority`,
        `${STANDARD}#knowledge-boundary`,
        `${STANDARD}#project-ownership-and-coordination-boundary`
      ],
      judgment: judgment(
        'Does every admitted repository have one owning project, while a workspace-free Coordination project only coordinates and all repository work, knowledge, lifecycle and acceptance retain their owning repository boundary?'
      )
    },
    {
      code: 'COORD-2',
      title: 'Distinct execution identities',
      description: 'Agent role, run or session, workspace, and worker remain distinct identities.',
      sources: [`${STANDARD}#identity-model`],
      judgment: judgment(
        'Does the arrangement distinguish the durable agent role from each run or session, workspace, and worker?'
      )
    },
    {
      code: 'COORD-3',
      title: 'Task-to-work linkage',
      description: 'Each Paperclip task has an unambiguous governing KI work relationship and independent lifecycle.',
      sources: [
        `${STANDARD}#task-to-work-relationship`,
        '../../../change-management/ki-work-roadmap/references/standards-work-item-format.md#task-links',
        `${STANDARD}#delivery-ownership-and-local-integration`,
        `${STANDARD}#refreshing-a-delivery-branch`
      ],
      judgment: judgment(
        'Does each delivery name its authority, repository, current destination, baseline and owners; reconcile the governing item’s task_links with its task-side prose backlink; refresh a diverged candidate without unauthorised history rewriting; verify and independently review that result; and preserve the independent KI lifecycle without treating an association as a live claim or acceptance?'
      )
    },
    {
      code: 'COORD-4',
      title: 'Workspace isolation',
      description:
        'Implementation uses isolated workspaces; authorised integration and roadmap writes use separately serialised primary-checkout boundaries.',
      sources: [`${STANDARD}#workspace-model`, `${STANDARD}#human-readable-workspace-names`],
      judgment: judgment(
        'Does implementation use an isolated workspace with a policy-compliant human-readable name and path, explicit baseline and consistent runtime binding, while integration and roadmap writes remain separately serialised?'
      )
    },
    {
      code: 'COORD-5',
      title: 'Direct interaction and control-plane boundary',
      description: 'Direct sessions remain valid and Paperclip API mechanics stay with Paperclip’s own skill.',
      sources: [`${STANDARD}#interaction-and-skill-composition`],
      judgment: judgment(
        'Can a human address an agent directly while control-plane operations remain governed by Paperclip’s official skill and existing authority?'
      )
    },
    {
      code: 'COORD-6',
      title: 'Evidence return',
      description: 'Coordination, repository, KI lifecycle, and durable-learning evidence are reconciled explicitly.',
      sources: [
        `${STANDARD}#evidence-and-completion`,
        `${STANDARD}#delivery-ownership-and-local-integration`,
        `${STANDARD}#recovery-and-visibility`
      ],
      judgment: judgment(
        'Does completed delivery prove the reviewed result reached its destination branch, with verification, independent KI lifecycle evidence and workspace disposition; and does branch-only completion hand off to a named owner on an open integration task?'
      )
    },

    {
      code: 'COORD-7',
      title: 'Delegated Git authority',
      description:
        'Paperclip projects task-branch publication and selected-agent review or integration authority owned by `ki-git`.',
      sources: [
        `${STANDARD}#workspace-model`,
        `${STANDARD}#delivery-ownership-and-local-integration`,
        `${STANDARD}#remote-delivery-prerequisite`,
        '../../../governance/ki-git/references/standards-git.md#commit-publication-and-integration-authority'
      ],
      judgment: judgment(
        'Does the arrangement use only repository-granted Git authority, preserve still-valid approvals, require a reviewed remote-delivery policy before remote expansion, and keep a programme hold until explicit human resumption?'
      )
    },
    {
      code: 'COORD-8',
      title: 'Roadmap write locus',
      description:
        'Roadmap-record writes are serialised in the repository’s designated primary checkout rather than made in a task’s isolated worktree.',
      sources: [`${STANDARD}#roadmap-records-are-the-exception`],
      judgment: judgment(
        'Does every write to the repository’s roadmap records happen in its designated primary checkout rather than the task’s isolated worktree, and does the task’s evidence record both write boundaries?'
      )
    },
    {
      code: 'COORD-9',
      title: 'Workspace retirement',
      description:
        'Isolated workspaces end through Paperclip: the automatic sweep uses five gates, while warned early close requires explicit work disposition.',
      sources: [`${STANDARD}#workspace-retirement`],
      judgment: judgment(
        'Does the automatic sweep apply its five gates and recorded cooldown, while a person-requested early close inspects close-readiness and requires explicit authority to disposition retained or uncertain work behind warnings? Are refused workspaces routed to a repository-owned decision rather than left as residue?'
      )
    },
    {
      code: 'COORD-10',
      title: 'Repository skill baseline',
      description:
        'Every repository role verifies declared skills and prerequisites in its actual task workspace; company assignment remains a separate check.',
      sources: [`${STANDARD}#repository-skills-are-the-execution-baseline`],
      judgment: judgment(
        'Does the run verify repository instructions, declared skills, required dependencies, harness identity, and runtime discovery at its admitted revision, with coordinator skill access and managed instruction drift checked separately?'
      )
    },
    {
      code: 'COORD-11',
      title: 'Repeatable bootstrap and deterministic project styling',
      description:
        'Bootstrap resolves company identity from verified context and styling from repository kind and primary shape, preserving approval boundaries.',
      sources: [
        `${STANDARD}#resolving-the-current-company-and-agora`,
        'standards-existing-estate-onboarding.md#project-styling',
        'standards-existing-estate-onboarding.md#approve-an-outcome-not-every-step',
        'standards-existing-estate-onboarding.md#minimum-needed-to-start-useful-work'
      ],
      judgment: judgment(
        'Does bootstrap resolve company/Agora identity and deterministic styling, reuse existing work and approvals, group known steps into a bounded outcome, distinguish immediate blockers from later improvements, and verify live adoption without repeated setup-only approvals or treating source rollout as operational success?'
      )
    },
    {
      code: 'COORD-12',
      title: 'Replaceable coordination',
      description:
        'Repository-owned knowledge, obligations and evidence support continuity without Paperclip, with declared dependencies verified and authority preserved.',
      sources: [
        `${STANDARD}#replaceable-coordination`,
        'standards-agent-memory.md#working-memory-not-a-second-knowledge-base'
      ],
      judgment: judgment(
        'Could an authorised human or alternate agent reconstruct procedures, work state, holds, decisions and evidence without Paperclip task UI or agent memory, using verified declared skills and tooling, without copying secrets or treating runtime replacement as permission to repeat in-flight work? Do employee memory instructions preserve opt-in and company boundaries, source-linked retrieval and repository-owned plans, with unique durable learning returned or visibly awaiting an owned review rather than trapped in private memory?'
      )
    },
    {
      code: 'COORD-13',
      title: 'Repository-owned recurring obligations',
      description:
        'Bootstrap reconciles repository definitions and routine projections through the owning recurring-work lifecycle before approving schedules.',
      sources: [
        `${STANDARD}#recurring-activities-and-routines`,
        'standards-existing-estate-onboarding.md#reconcile-recurring-obligations',
        'standards-existing-estate-onboarding.md#roadmap-to-delivery-loop',
        'standards-agent-memory.md#weekly-employee-knowledge-return-check'
      ],
      judgment: judgment(
        'Does reconciliation preserve one appropriate repository definition per obligation, home-project ownership of shared reports, one active run and independent acceptance, with approved scope, schedule, timezone and budget before activation; and does next-work review finish existing work, dispatch authorised Ready items and prepare selected drafts without silently adopting, releasing holds, accepting or pruning work? Does weekly knowledge return cover employee contributions, source verification, deduplication, authorised repository promotion and explicit pending or missing coverage without dumping private notes or creating duplicate reviews?'
      )
    },
    {
      code: 'COORD-14',
      title: 'Run MCP access',
      description:
        "Runs reach KI MCP servers through a granted Paperclip connection to their own host's bridge, and a remote host carries its own bridge.",
      sources: [`${STANDARD}#mcp-access-in-runs`, `${STANDARD}#remote-delivery-prerequisite`],
      judgment: judgment(
        "Does each run that needs KI MCP access reach its own host's bridge through a granted Paperclip connection verified in a real run, with a missing grant reported as a prerequisite and no audit home-pinning, laptop tunnel or cloud connector substituted?"
      )
    }
  ]
}
