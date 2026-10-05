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

## Decision

- Dependabot alerts and Dependabot security updates are enabled on every repository in the estate, whatever its type or visibility.
- Routine version updates come from the repository's `bun run ki:deps:update` run, reviewed like any other change. Repositories carry no Dependabot version-update configuration.
- No repository carries a workflow that auto-merges dependency pull requests. Security-update pull requests are reviewed and merged by a human.
- The `ki-repo` GitHub-settings contract enforces this: missing alerts or security updates fail, a workflow named for Dependabot auto-merge fails, and a Dependabot configuration file warns because it may legitimately tune security updates only.

## Consequences

Vulnerability signals and targeted security fixes stay automatic across the estate, while every dependency change that reaches a default branch has a human reviewer. Security-update pull requests now wait for review instead of merging themselves, so their latency depends on someone attending to them. GitHub Actions version bumps no longer arrive from Dependabot and must be covered by the update routine or a review. A renamed auto-merge workflow escapes the mechanical file-name check and is left to review judgment.

## References

- [GitHub Dependabot documentation](https://docs.github.com/en/code-security/dependabot) - alerts, security updates, and version updates.
