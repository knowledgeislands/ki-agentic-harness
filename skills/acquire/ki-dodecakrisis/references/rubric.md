<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — D12 sorting rules, mailbox binding and learning

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-dodecakrisis --write`.

Line-by-line criteria for auditing ki-dodecakrisis. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CONFIG — D12 configuration](#config--d12-configuration)
- [RULES — Rules file](#rules--rules-file)
- [MAILBOX — Mailbox practice](#mailbox--mailbox-practice)
- [LEARN — Learning loop](#learn--learning-loop)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CONFIG — D12 configuration

→ [standard](standards-dodecakrisis.md)

The declaring repository supplies its mailboxes, rules file and corrections log in its own table; the protected-label list is never configured here.

- **CONFIG-1 [M] — only the three D12 properties are configured** — The `[skills.ki-dodecakrisis]` table holds only `mailboxes`, `rules` and `corrections`; any other key, such as a protected-label list, is reported. (standards-dodecakrisis.md#configuration)
  - _Remediation:_ diagnostic — Remove unsupported keys; protected labels belong in the mail server configuration, and runner settings in `ki-muninn`.
- **CONFIG-2 [M] — every declared mailbox has a provider, a server and a root** — Each entry under `mailboxes` names its `provider` (`gmail` or `m365`), its `server` and its label or folder `root`, and nothing else. (standards-dodecakrisis.md#configuration)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.
- **CONFIG-3 [M] — the rules file and corrections log resolve** — Once a mailbox is declared, `rules` names a TOML rules file and `corrections` a JSON Lines corrections log, both existing in the repository; a configured file that is missing or does not parse is reported even without a mailbox. (standards-dodecakrisis.md#configuration, standards-learning.md#the-corrections-log)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.

## RULES — Rules file

→ [standard](standards-dodecakrisis.md)

The rules file holds guards, Deposit routes and rules; only rules send items out, Delete and Digest rules carry the evidential guard, and every rule cites its approval.

- **RULES-1 [M] — every rule is complete and cites its approval** — Each rule has a unique id, a declared mailbox, a query, one of the nine outcomes, a mode (`automatic` or `suggest`), a confidence (`high`, `medium` or `low`), an origin (`stated`, `learnt` or `decision`) and the approval that put it live. (standards-dodecakrisis.md#the-rules-file, standards-dodecakrisis.md#writes-and-approvals)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.
- **RULES-2 [M] — Delete and Digest rules carry the evidential guard** — Each declared mailbox has exactly one evidential guard, and every rule whose outcome is Delete or Digest lists it, because platform filter order never protects evidential mail. (standards-dodecakrisis.md#the-rules-file)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.
- **RULES-3 [M] — every Deposit goes through a complete route** — Each Deposit route names its mailbox, capture folder, form (`capture` or `eml.txt`), destination and owner, and every rule whose outcome is Deposit names a declared route. (standards-dodecakrisis.md#the-rules-file, standards-mailbox.md#deposit-routes)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.
- **RULES-4 [M] — D12 filters carry the D12 prefix** — A platform filter or rule that a D12 rule names begins with `D12`, so it is known to be under D12 management; D12 never changes an unprefixed one. (standards-dodecakrisis.md#writes-and-approvals)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.

## MAILBOX — Mailbox practice

→ [standard](standards-mailbox.md)

Judged on read-only evidence from each declared mailbox’s server and on run reports; the repository audit cannot see a mailbox.

- **MAILBOX-1 [J] — queues sit under one root and context is shown by tags** — The outcome labels or folders are exactly the numbered queues and exits under the root, with provenance labels beside them; context is shown by tags, never folders, and nothing is archived in the mailbox. (standards-mailbox.md#queues-and-tags)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the server’s label or folder list show exactly the numbered outcomes and `Rules/<id>` provenance labels under the root, with context carried by tags and no archive folder used as Deposit?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MAILBOX-2 [J] — protected labels are read from the server and never touched** — The server reports its protected list and protection switched on; no rule, sweep or Deposit route targets a protected label; and every refusal stopped its run and was reported rather than worked around. (standards-mailbox.md#protected-labels, standards-dodecakrisis.md#writes-and-approvals)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the server report protection on with its list, does no rule, sweep or route target an entry on it, and did each refused call stop its run and appear in the report?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MAILBOX-3 [J] — every write and sweep was dry-run and cites its approval** — Each SORT, SWEEP, LEARN or CONFORM write and each scheduled sweep cites the approval that names it and followed a dry run whose counts matched; Delete trashes only through the sweep after its grace period, and only D12-prefixed filters and rules were changed. (standards-dodecakrisis.md#writes-and-approvals, standards-mailbox.md#sweeps)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every mailbox write and every scheduled sweep cite its approval and a matching dry-run count, with Trash reached only through the Delete sweep and no unprefixed filter or rule changed?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## LEARN — Learning loop

→ [standard](standards-learning.md)

Corrections are logged from headers only, and a learnt or stated rule goes live only with Kris’s answer or his own words.

- **LEARN-1 [M] — correction lines carry headers only** — Every line of the corrections log is one JSON object with exactly `date`, `mailbox`, `kind`, `rule`, `sender_domain`, `subject_pattern`, `from` and `to`, so no message body, snippet or full address is kept. (standards-learning.md#the-corrections-log)
  - _Remediation:_ diagnostic — Use the finding and this criterion to make the appropriate local change, then rerun the audit.
- **LEARN-2 [J] — learnt and stated rules go live only with Kris’s word** — A learnt rule was drafted from three agreeing corrections and went into the rules file only on Kris’s answer to its query; a stated rule is logged in his words as a `D12-RULE` line, was dry-run with its count shown back, and outranks a learnt one. (standards-learning.md#drafting-rules, standards-learning.md#stated-rules)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every `learnt` or `stated` rule cite an approval that is Kris’s answer or his own `D12-RULE` words, with the dry-run count shown before it went live, and did any rule past 5% corrections drop back to suggest?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic
