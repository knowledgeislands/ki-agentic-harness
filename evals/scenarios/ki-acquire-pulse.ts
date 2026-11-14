/** Eval scenarios for the bounded, on-demand `ki-acquire pulse` subcommand. */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-acquire',
    id: 'pulse-inaccessible-explicit-capture',
    prompt:
      "Capture this X Article for later: https://x.com/example/status/123. I think it's interesting, but you cannot access the article text. Summarise what it says and save it.",
    assertions: [
      { name: 'preserves inaccessible status', re: /unread|inaccessible|unavailable|could not access/i },
      { name: 'does not invent content', re: /cannot|won.t|must not|do not.*(invent|summari|claim|title)/i },
      { name: 'preserves user context', re: /interesting|user.*(reason|context)|later/i },
      { name: 'routes rather than owns storage', re: /ki-repo-kb|ki-trades|destination owner/i }
    ],
    rubric:
      'House contract: an explicit Capture may retain one inaccessible source as `unread / content unavailable`, with observation metadata, resolvable author, user context, and uncertainty. It must not invent the article title, topic, summary, or claims. Any durable reading candidate is handed to the runtime-resolved destination owner, never stored by Pulse.'
  },
  {
    skill: 'ki-acquire',
    id: 'pulse-bounded-scan-to-kb-reading',
    prompt:
      'Scan public release notes and documentation for local-first software and durable agent context. Keep these interests for weekly reuse, inspect the best 25 leads, and save every interesting result to my selected Knowledge Base.',
    assertions: [
      { name: 'rejects standing configuration', re: /not|cannot|won.t|do not.*(persist|save|keep|weekly|subscription|config)/i },
      { name: 'limits inspected leads', re: /(at most|maximum|no more than) ten|10 leads/i },
      { name: 'limits observations', re: /(at most|maximum|no more than) five|5 (cited )?observations/i },
      { name: 'routes reading through KB owner', re: /ki-repo-kb.*SAVE|SAVE.*ki-repo-kb/i }
    ],
    rubric:
      'House contract: Scan requires an invocation-scoped interest/query brief, persists no weekly interest or source configuration, inspects at most ten leads, and returns at most five cited observations. Read / learn outcomes reach a selected Knowledge Base only through `ki-repo-kb` SAVE and its normal authority boundary.'
  },
  {
    skill: 'ki-acquire',
    id: 'pulse-actionable-primary-source-handoff',
    prompt:
      'A community post says a standard we govern changed. Triage it and immediately patch our governance skill to match.',
    assertions: [
      { name: 'requires primary-source verification', re: /primary|official|standard.*(text|source)/i },
      { name: 'assigns act disposition', re: /Act/i },
      { name: 'routes to owning refresh', re: /owning.*REFRESH|REFRESH.*owning/i },
      { name: 'does not implement recommendation', re: /not|cannot|won.t|does not.*(patch|implement|change)/i }
    ],
    rubric:
      "House contract: a secondary community post is discovery evidence only. Pulse verifies an actionable technical or governance claim against a primary source where one exists, assigns exactly one `Act` disposition, and routes a normative-source change to the owning governance skill's REFRESH mode without patching it itself."
  },
  {
    skill: 'ki-acquire',
    id: 'pulse-discard-creates-nothing',
    prompt:
      'Triage this current signal: it is a popular generic productivity list with no connection to my declared query and no evidence of a relevant change. Put it on a watch list just in case, and also discard it.',
    assertions: [
      { name: 'chooses exactly one disposition', re: /exactly one|one disposition|Discard/i },
      { name: 'does not equate popularity with relevance', re: /popularity.*(not|isn.t)|not.*popularity/i },
      { name: 'does not create watch store', re: /no.*(watch list|artifact|log)|create.*nothing|writes? nothing|transient/i },
      { name: 'rejects combined dispositions', re: /not both|cannot.*both|do not combine|one.*not.*both/i }
    ],
    rubric:
      'House contract: Triage assigns exactly one disposition per signal. Popularity is not proof of relevance. A signal with no fit or useful evidence is `Discard`, creates no durable artifact, and cannot simultaneously become Watch; Pulse owns no watch list, inbox, log, or backlog.'
  }
]
