---
id: XDR-KI-HARNESS-001
title: Dependabot security updates without auto-merge
date: 2026-10-05
status: current
decision_type: security
decision_type_url: https://knowledgeislands.info/specifications/decision-records/xdr
---

# XDR-KI-HARNESS-001: Dependabot security updates without auto-merge

## Context

Every Knowledge Islands repository, knowledge bases included, declares `package.json` dependencies, so every repository can inherit a vulnerable package. GitHub Dependabot offers three separate capabilities: vulnerability alerts, security-update pull requests, and scheduled version-update pull requests driven by a `.github/dependabot.yml` file. A workflow can also enable auto-merge on Dependabot pull requests so that they reach the default branch once checks pass.

Each repository also carries a `ki:deps:update` package script that updates dependencies in one reviewed change. Scheduled version-update pull requests duplicate that route and accumulate when a major bump breaks checks. Auto-merge removes human review from the path between an upstream release and the default branch, so a compromised or malicious release would land without anyone reading it.

Released `ki` pins are the exception the estate's own tooling creates. A repository's CI installs the `ki` release named in `.github/ki-version`, and an `update-ki-pin.yml` receiver proposes each newer immutable `knowledgeislands/tools-ki` release as a one-line pull request through the `ki-tools-release-bot` App. The organisation owner cuts that release, so a review of the bump is the same person re-reading a one-line diff, and the higher-privilege consumers already take it automatically: the Homebrew tap and the website auto-merge exact version-only updates behind required checks. The release installer verifies a signed checksum manifest, so CI cannot pass on a tampered archive.

## Decision

- Dependabot alerts and Dependabot security updates are enabled on every repository in the estate, whatever its type or visibility.
- Routine version updates come from the repository's `bun run ki:deps:update` run, reviewed like any other change. Repositories carry no Dependabot version-update configuration.
- No repository carries a workflow that auto-merges dependency pull requests, with the single exception below. Security-update pull requests are reviewed and merged by a human.
- A released `ki` pin bump may auto-merge in a repository of the `knowledgeislands` GitHub organisation when all three conditions hold: the pull request's diff touches only `.github/ki-version`; the required status checks pass under a `main` ruleset that `ki-tools-release-bot` cannot bypass; and the release's signed checksum manifest verifies, which the required CI check proves by installing the new pin. The `ki-engineering` receiver contract defines the workflow. The exception covers no other dependency and no repository outside `knowledgeislands`; repositories of other organisations, including `humansnotrobots`, `infoschematics` and personal accounts, keep human review of every pin bump and do not install the App.
- The `ki-repo` GitHub-settings contract enforces this: missing alerts or security updates fail, a workflow named for Dependabot auto-merge fails, and a Dependabot configuration file warns because it may legitimately tune security updates only.

## Consequences

Vulnerability signals and targeted security fixes stay automatic across the estate, while every dependency change that reaches a default branch has a human reviewer, apart from released `ki` pins in `knowledgeislands`. Those track each `ki` release within minutes, and the guard against a release that quietly checks less moves to the release itself; it should be revisited, with a second reviewer on the `tools-ki` release environment, before anyone else gains write access to the organisation. Every repository that auto-merges adds a ruleset to keep and one more holder of the App's key to rotate. Security-update pull requests now wait for review instead of merging themselves, so their latency depends on someone attending to them. GitHub Actions version bumps no longer arrive from Dependabot and must be covered by the update routine or a review. A renamed auto-merge workflow escapes the mechanical file-name check and is left to review judgment.

## References

- [GitHub Dependabot documentation](https://docs.github.com/en/code-security/dependabot) - alerts, security updates, and version updates.
