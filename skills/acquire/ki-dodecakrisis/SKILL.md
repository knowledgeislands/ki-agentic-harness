---
name: ki-dodecakrisis
ki-kind: governance
ki-applicability: declaration-only
ki-guild: acquire
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
description: >
  Govern D12, the Dodecakrisis: the ten sorting rules, mailbox queues and tags, guarded rules with a D12 prefix, protected
  labels read from the mail server, age-based sweeps, Deposit routes and the learning loop that turns corrections into
  proposed rules. Use to set up, audit, sort, sweep or improve a D12 mailbox; `ki-acquire` owns what happens after
  Deposit.
argument-hint: 'audit <repo> | conform <repo> | educate <repo> | sort <mailbox> | sweep <mailbox> | learn <mailbox> | help | refresh'
---

# D12, the Dodecakrisis

Read [the D12 standard](references/standards-dodecakrisis.md) first: the ten rules, the rules file and its guards, and the approval every write needs. Then read [the mailbox standard](references/standards-mailbox.md) for queues, tags, protected labels, sweeps and Deposit routes, and [the learning standard](references/standards-learning.md) for corrections and proposed rules. While [the migration overlay](references/standards-dodecakrisis-migration.md) exists, read it last; it lists the temporary adjustments and the standards win wherever the two differ.

The concept, the twelve Ds, their names and why D12 exists, is Kris's fundamental tenet in the Knowledge Islands D12 card, which this skill does not restate. This skill holds the method; the declaring repository holds the data: its mailboxes, rules file and corrections log. The mail servers, `mcp-gsuite` and `mcp-m365`, own the protected-label list and enforce it. The Inbox's muninn runner runs the sweeps and the learning loop (`ki-muninn d12 sweep`, `ki-muninn d12 learn`) under this standard; scheduling either is a separate approval each time. What happens to a deposited item, its capture, curation and dispatch, is an off-ramp to `ki-acquire`. The [generated rubric](references/rubric.md) holds the review criteria.

Configuration lives in the declaring repository's `.ki.toml` under `[skills.ki-dodecakrisis]`: `mailboxes`, `rules` and `corrections`, set out in the D12 standard's configuration section. An empty table declares the skill with no mailbox.

## Operating modes

For `help`, `-h`, `?` or no recognised mode, explain D12, the modes and the off-ramps without reading a mailbox; offer a mode choice only in an interactive session.

Every mode reads first and changes nothing by default. SORT, SWEEP and LEARN write to a mailbox or a repository only with an approval they cite, after a dry run with counts, and stop on the first protected-label refusal.

### Mode AUDIT

Run `ki repo audit --skill ki-dodecakrisis --repo <repo>` for the configuration, rules file and corrections log. Then, with read-only calls to each declared mailbox's server, compare the labels or folders, the D12 filters or rules and the protected list the server reports against the standards, and record each judgment criterion as conforming, a named gap or a justified exclusion. Do not change a mailbox to complete an audit.

### Mode CONFORM

Run AUDIT, then `ki repo conform --skill ki-dodecakrisis --repo <repo> --dry-run`. Propose, as a dry run with counts, the missing outcome labels, guards and D12-prefixed filters a mailbox needs. Make them only with an approval the proposal cites; never touch an unprefixed filter or rule, or anything protected.

### Mode EDUCATE

Explain the ten rules, the mailbox binding and the learning loop for the declaring repository's mailboxes, using its rules file for examples. Do not sort or sweep to demonstrate the contract.

### Mode SORT

Place arrivals in one declared mailbox by its rules: dry-run each rule's query, report the count for each outcome, and apply the placements only with an approval that names the run, adding the outcome label and the rule's provenance label. An item no rule places goes to Determine.

### Mode SWEEP

Run the age-based sweeps for one declared mailbox through `ki-muninn d12 sweep`, dry run first, reporting each sweep's count. Apply only with an approval that names the sweep or its schedule.

### Mode LEARN

Read one mailbox's corrections through `ki-muninn d12 learn`, append correction lines to the corrections log, and draft rules from agreeing corrections as queries for Kris. Log a rule Kris states in his own words, dry-run it and show its count. A drafted rule goes into the rules file only on Kris's answer, and a stated rule once its count matches what he expects.

### Mode REFRESH

REFRESH writes only in the canonical `ki-agentic-harness` repository; from an installed copy, stop and redirect there. Read [the sources](references/sources.md), compare the D12 card, the mail servers' capabilities and `ki-muninn`'s D12 runner with the standards, then make and verify the smallest correction. When a migration item is done, delete its line, and delete the overlay once it is empty.
