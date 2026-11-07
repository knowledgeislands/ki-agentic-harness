import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { DodecakrisisContext } from '../contexts/dodecakrisis.ts'

export const MAILBOX = {
  code: 'MAILBOX',
  title: 'Mailbox practice',
  standard: 'standards-mailbox.md',
  description:
    'Judged on read-only evidence from each declared mailbox’s server and on run reports; the repository audit cannot see a mailbox.',
  selectContext: (context) => context,
  items: [
    {
      code: 'MAILBOX-1',
      title: 'queues sit under one root and context is shown by tags',
      description:
        'The outcome labels or folders are exactly the numbered queues and exits under the root, with provenance labels beside them; context is shown by tags, never folders, and nothing is archived in the mailbox.',
      sources: ['standards-mailbox.md#queues-and-tags'],
      judgment: judgment(
        'Does the server’s label or folder list show exactly the numbered outcomes and `Rules/<id>` provenance labels under the root, with context carried by tags and no archive folder used as Deposit?'
      )
    },
    {
      code: 'MAILBOX-2',
      title: 'protected labels are read from the server and never touched',
      description:
        'The server reports its protected list and protection switched on; no rule, sweep or Deposit route targets a protected label; and every refusal stopped its run and was reported rather than worked around.',
      sources: ['standards-mailbox.md#protected-labels', 'standards-dodecakrisis.md#writes-and-approvals'],
      judgment: judgment(
        'Does the server report protection on with its list, does no rule, sweep or route target an entry on it, and did each refused call stop its run and appear in the report?'
      )
    },
    {
      code: 'MAILBOX-3',
      title: 'every write and sweep was dry-run and cites its approval',
      description:
        'Each SORT, SWEEP, LEARN or CONFORM write and each scheduled sweep cites the approval that names it and followed a dry run whose counts matched; Delete trashes only through the sweep after its grace period, and only D12-prefixed filters and rules were changed.',
      sources: ['standards-dodecakrisis.md#writes-and-approvals', 'standards-mailbox.md#sweeps'],
      judgment: judgment(
        'Does every mailbox write and every scheduled sweep cite its approval and a matching dry-run count, with Trash reached only through the Delete sweep and no unprefixed filter or rule changed?'
      )
    }
  ]
} satisfies RubricFamily<DodecakrisisContext, DodecakrisisContext>
