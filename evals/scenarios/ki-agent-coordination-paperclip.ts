/** Eval scenarios for the KI relationship around Paperclip coordination. */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-agent-coordination-paperclip',
    id: 'paperclip-agent-session-workspace-separation',
    prompt:
      'Rita and Sue are two durable workers in our Paperclip company. Both need to change tools-rig concurrently from the same accepted commit. Is each agent simply a harness thread grounded in the same working directory?',
    assertions: [
      { name: 'separates role from run', re: /agent role|durable.*role|run|session/i },
      { name: 'separates workspace from worker', re: /workspace.*worker|worker.*workspace|compute|process/i },
      { name: 'requires isolated mutable checkouts', re: /separate.*worktree|isolated.*checkout|separate.*checkout/i },
      { name: 'allows shared logical baseline', re: /same.*baseline|same.*revision|shared.*baseline/i }
    ],
    rubric:
      'KI contract: agent role, run/session, workspace, and worker are separate identities. Rita and Sue may share the logical island and admitted revision, but concurrent mutation uses separate worktrees or equivalent isolated writable checkouts.'
  },
  {
    skill: 'ki-agent-coordination-paperclip',
    id: 'paperclip-task-roadmap-lifecycle',
    prompt:
      'A Paperclip task linked to KI-HARNESS-GOV-123 has finished, and it discovered another substantial change. Should Paperclip close the KI roadmap item and keep the follow-up only in a task comment?',
    assertions: [
      { name: 'does not equate completion with acceptance', re: /does not|must not|cannot.*accept|independent.*lifecycle/i },
      { name: 'requires KI review or acceptance', re: /KI.*accept|human.*review|normal.*review|evidence gate/i },
      { name: 'routes new work to KI tracker', re: /triage|active.*work adapter|KI work/i },
      { name: 'retains task-to-work linkage', re: /KI-HARNESS-GOV-123|governing.*work|work item/i }
    ],
    rubric:
      'KI contract: Paperclip task completion is independent from KI acceptance. The governing KI work record follows its normal human review and evidence gate, while newly discovered substantive work is captured through the active KI work adapter, normally as unadopted Triage.'
  },
  {
    skill: 'ki-agent-coordination-paperclip',
    id: 'paperclip-direct-agent-and-knowledge-authority',
    prompt:
      'Can I keep talking directly to an agent and have it coordinate through Paperclip? Where should the durable knowledge live, and which skill owns Paperclip API calls?',
    assertions: [
      { name: 'allows direct conversation', re: /direct.*(conversation|session|address)|talk.*direct/i },
      { name: 'keeps repositories authoritative', re: /repositor.*durable|durable.*repositor|knowledge.*repositor/i },
      { name: 'treats task and memory as operational', re: /operational.*context|cache|task.*not.*authority|memory.*not.*authority/i },
      { name: 'routes API mechanics to Paperclip skill', re: /Paperclip.*skill.*API|API.*Paperclip.*skill|official.*skill/i }
    ],
    rubric:
      'KI contract: direct human-agent conversation remains valid. The agent may coordinate through Paperclip, whose official paperclip skill owns control-plane API mechanics. Repositories remain durable knowledge authority; task text and agent memory are operational context or caches.'
  }
]
