# Feedback 01

This is feedback for `$USER_HOME/.claude/plans/this-session-is-about-misty-key.md` and an attempt at a spec for the harness.

## Decision Records

- Review the `/docs/decisions` and ensure they are compact and complete - they should have a progressive disclosure based reading order. There should be no historic details, just as it is if they were written now, and therefore no superseding etc too.

## Feature Definitions

- Feature Definitions define the set of capabilities of a component are provide a strong way to assert and verify that the component behaves as expected. They are organised into areas and have a unique id.
- We should add a new skill for this comparable to `ki-decision-records` but called `ki-feature-definitions`.
- Features should live in `docs/features`

`/Users/krisbrown/kis/vallearmonia/vallearmonia-website/docs/spec` is a good example of specs, which I'd like to generalise to feature definitions.

## User Guide

- reorg docs into `docs/guides/user-guide/`
- Covered by Part 3 of `$USER_HOME/.claude/plans/this-session-is-about-misty-key.md`

## General Approach to the Harness and various skills

- Make all knowledgeislands repos public (ignore previous requests to keep them private).
- Making them public means they can be installed / run from github directly.
- The harness (and its skills) should do ask much as possible through mechanical means, i.e. scripting, and should make every effort to be useable still without an LLM involvement. Of course there will still be judgemental checks to perform, but these only apply when the skill is invoked via the LLM, not via the command line / script (although it should warn about such checks being skipped).
- Every skill has an optional mechanical bootstrapping script at `$SKILL_HOME/scripts/bootstrap.ts` which is responsible for determine bootstrapping for its own skill, which may include additional skills to install, determining the shape of the repo if already existing, and prompting for user input with a suitable, safe and sensible default if no user is available. It also installs any scripts into the repo such that it can operate without the skill being installed. NOTE: is this what INIT should have been doing?
- `ki-bootstrap` skill is a minimal surface area for bootstraping Knowledge Island aligned repos - it starts the chain effect of bootstrapping.
- `ki-bootstrap` can be run from GITHUB directly in which case it is purely mechanical.
- `ki-bootstrap` MAY be installed in the users home (i.e. `$USER_HOME/.claude/skills/ki-bootstrap`) allowing for bootstrapping to be done judicially using an LLM if so wished.
