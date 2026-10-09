---
id: KI-HARNESS-GOV-161
area: GOV
title: Auto-merge ki pins
kind: deliver
purpose: upkeep
initiative: platform-foundations
component: governance
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: 04c73b6fb30a5626f8cd19bedd925a8a6cc1f93d
created_at: 2026-10-08T09:30:00Z
updated_at: 2026-10-09T08:20:00Z
---

# KI-HARNESS-GOV-161: Auto-Merge ki Pins

## Goal

Decide whether a released `ki` pin bump opened by an `update-ki-pin.yml` receiver may merge automatically once its required checks pass, or stays a human-reviewed pull request.

## Context

`KI-HARNESS-GOV-141`, done on 2026-10-08, stated the released-pin receiver contract in the `ki-engineering` standard. Its bump pull request rewrites only `.github/ki-version` and merges after human review, because XDR-KI-HARNESS-001 requires a person to review dependency changes. KI Website already auto-merges exact version-only tool updates under its own decision, ODR-KI-WEB-001, so the estate has a precedent for bounded automation.

Auto-merging the pin would amend XDR-KI-HARNESS-001 for this one dependency, so it is the organisation owner's decision, not the delivering agent's.

## Boundary

- **In:** whether to auto-merge, the conditions it would need (required checks, branch rules the App cannot bypass, a version-only diff), and the XDR-KI-HARNESS-001 amendment if the answer is yes.
- **Out:** the receiver itself, which `KI-HARNESS-GOV-141` delivered; App installation, credentials, rulesets and repository settings, which the organisation owner provisions per repository; converting the inline-pin repositories, captured as KI-HARNESS-GOV-168; tap registration, owned by BREW-013 in `homebrew-tap`.

## Current state

Kris decided on 2026-10-09 (GOV-020 owner decision 7) that automatic `ki` pin bumps and their automatic merge are acceptable, and that `ki-tools-release-bot` may be installed across Knowledge Islands repositories in the `knowledgeislands` GitHub organisation only. XDR-KI-HARNESS-001 still says no repository auto-merges dependency pull requests, the `ki-engineering` receiver contract says a person merges the pin bump, and this repository's `update-ki-pin.yml` opens its pull request for review.

## Steps

- [ ] Amend XDR-KI-HARNESS-001 in place: dependency changes keep human review, except a released `ki` pin bump inside the `knowledgeislands` organisation, which may auto-merge when its diff touches only the pin file, the required checks pass under a `main` ruleset the App cannot bypass, and the release's signed checksum manifest verifies. Name the organisation limit explicitly.
- [ ] Make this repository's receiver request squash auto-merge only after confirming the proposal diff is the pin file alone and that `main` has rules requiring status checks; otherwise leave the pull request for review. Pin `actions/create-github-app-token` to a commit SHA, as `tools-ki` does.
- [ ] Update the `ki-engineering` receiver contract and exemplar to match, with the scope limit.
- [ ] Align the `ki-repo-tools` release-readiness wording, which still calls auto-merge a separate future decision.

## Files touched

- `docs/decisions/XDR-KI-HARNESS-001-dependabot-security-updates-without-auto-merge.md`
- `.github/workflows/update-ki-pin.yml`
- `skills/governance/ki-engineering/references/standards-engineering.md` and `exemplars.md`
- `skills/repo-structure/ki-repo-tools/references/standards-release-readiness.md`

## Verify

1. XDR-KI-HARNESS-001 permits auto-merge only for a released `ki` pin bump in the `knowledgeislands` organisation, under the three named conditions, and keeps every other dependency change human-reviewed.
2. The receiver and the exemplar copy are identical in their workflow body, and the receiver never requests auto-merge without a pin-only diff and branch rules requiring status checks.
3. The required CI check installs the new pin through the signed-manifest installer, so a checksum or signature failure blocks the merge.

```bash
bun run test
bunx tsc --noEmit
ki repo audit --skill ki-engineering
ki repo audit --skill ki-decision-records
```

## Dependencies / blocks

None. The receiver stays inert until the organisation owner installs the App here, stores its variable and secret, adds the `main` ruleset and keeps auto-merge enabled.

## Documentation impact

### Decision Records

XDR-KI-HARNESS-001 is amended in place.

### Specifications

`standards-engineering.md`, `exemplars.md` and `standards-release-readiness.md`, as above.

### Guides

None.

### Roadmap

KI-HARNESS-GOV-168 and BREW-013 carry the rollout.

## Discussion

Decision brief for the organisation owner, researched 2026-10-09 from the files named below and read-only GitHub queries.

### Where things stand

- **Who opens pin bumps.** A `tools-ki` release, never a change in the receiving repository. Only this harness has the `update-ki-pin.yml` receiver, and it is idle because the release App is not installed here. The one bump so far, PR #25 (`v0.8.4` to `v0.10.0`, CI green, still open), was opened under Kris's own account, not by the bot.
- **Who can merge.** `knowledgeislands` has one member, Kris. Any "human review" today is Kris reviewing a release Kris cut.
- **The bot already exists.** `ki-tools-release-bot` has had Contents write, Pull requests write and Metadata read since 2026-09-20. It is installed on `homebrew-tap` and `ki-website`, and seven repositories hold its key. Both repositories already auto-merge its pull requests: tap PRs #26 to #30 advanced `ki` and `mgit` with no person involved, under ODR-KI-WEB-001 and the tap's own workflow. Kris's Homebrew `ki` therefore already follows each release unreviewed.
- **Release pace.** `ki` went from `v0.8.2` to `v0.10.0` in about two days. Under the release-on-demand policy the pin moves only when a repository needs the new version, and an unmerged proposal is not a failure.

### What a person reviewing the bump actually guards against

The diff is one line, so reading it proves nothing. The review is only useful if the reviewer looks at what changed in `ki` itself.

1. **A compromised release, signing key or Kris's account.** Checksums and the Ed25519 signature prove the archive is the one `tools-ki` published. They cannot prove it is benign, because CI fetches `install.sh`, with its embedded public key, from the new tag itself. A reviewer would catch this only by reading the `tools-ki` changes, and the same person cut the release.
2. **A change in `ki` that alters CI behaviour.** This is the realistic risk. A new `ki repo audit` could start failing, which CI shows and the pull request stays open. Or it could quietly check less, which CI cannot show because the gate under review is the one doing the checking. Only release notes, or a person, catch the second case.
3. **A stolen bot key.** The key can push branches and open pull requests wherever the App is installed. On a repository with no ruleset, as here, it can also push straight to `main`, whatever the auto-merge rules say. The App has no Workflows permission, so it cannot rewrite CI.

What CI already covers: the exact immutable release is installed, its signature and checksums are verified, then `ki repo audit` and `bun run test` run on the bump. The workflow token is read-only and `ci.yml` uses no secrets, so a bad `ki` in CI has little to reach.

### Options

| Option                                            | Pros                                                                                          | Cons and risks                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Manual, no bot (today)**                     | No credentials to spread. The pin moves only when needed.                                     | Kris opens and merges each bump, as with PR #25. Pins drift.                                                                                                                                                                                                         |
| **B. Bot opens, a person merges**                 | No hand-editing. A proposal waits until it is needed.                                         | One install, one secret, one tap registry entry and one more key holder to rotate. The App can push to `main` until a ruleset exists. Merging is still a click.                                                                                                      |
| **C. Bot with auto-merge, opt-in per repository** | Same model as the tap and website. A failing check leaves the pull request open for a person. | Needs a `main` ruleset requiring the CI check, with only admins able to bypass. Needs an XDR-KI-HARNESS-001 amendment, and the `ki-engineering` "merging is the decision" wording changes. Every release moves the pin. A weakened `ki` audit lands unseen (risk 2). |
| **D. Bot with auto-merge, estate-wide**           | Least drift.                                                                                  | Roughly 22 installs and secrets, plus 22 rulesets. Each one widens risk 3 and adds key-rotation work. Also requires every inline pin to be converted first.                                                                                                          |

### What setting up the bot means

For each repository: add it to the App's selected installation; set `KI_TOOLS_RELEASE_BOT_APP_ID` and the key secret through the Arcadia `op read` procedure; and register it in the tap's `.github/tool-release-consumers.json` (BREW-013 in `homebrew-tap`). For auto-merge, also add a `main` ruleset that requires pull requests and the CI check, with admins as the only bypass. That keeps Kris's and the agents' direct pushes working, as on the website. Upkeep is one more holder in each key rotation and one more entry to audit. An organisation secret limited to selected repositories would reduce rotation to one place, but the Arcadia GitHub Apps convention currently says to set secrets per repository.

### The 22 repositories with inline `KI_VERSION` pins

Twenty are on `v0.8.4`; `hnr-agentic-harness` and `infoschematics` are on `v0.7.1`. They have no receiver, so nothing proposes a bump; `ki-engineering` CI-1 only warns. Under release-on-demand they can stay as they are, and each moves by hand when it needs a newer `ki`. Convert one to `.github/ki-version` plus a receiver only when it should track releases closely; the conversion edits workflow files, so it is a reviewed human change anyway. Neither the bot nor auto-merge helps them until they are converted.

### If other people join

Two things change. A review then has an independent reviewer and becomes meaningful. A bot that merges in many repositories also becomes a bigger target. The `tools-ki` releasing guide already plans a required second reviewer on the `release` environment when a second maintainer joins. That puts the two-person check once, at the release, instead of on every downstream pin. With that gate in place, option C becomes easier to defend. Without it, revisit any auto-merge before giving anyone else write access.

### Recommendation

Take **option C for this harness only**, and leave the inline-pin repositories manual. Today's review adds almost nothing: the only reviewer is the person who cut the release, the diff is one line, and the higher-privilege consumers, the tap and Kris's Homebrew `ki`, already auto-update. Conditions:

- Add the `main` ruleset requiring the CI check before installing the App. This is also needed for option B, to stop a stolen key pushing to `main`.
- The App has no bypass and no Workflows permission.
- The receiver keeps its version-only diff and immutable-release checks.
- Pin `actions/create-github-app-token` to a commit SHA, as `tools-ki` does.
- Amend XDR-KI-HARNESS-001 for this one dependency.
- Revisit this decision when a second maintainer joins.

If the extra key holder is not worth it, choose **A** and merge PR #25 by hand. **B** costs the same setup as C and saves little.
