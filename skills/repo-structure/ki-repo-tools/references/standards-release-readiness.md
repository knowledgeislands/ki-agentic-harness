# Tool release readiness

Use this checklist before publishing a release of a repository governed by `ki-repo-tools`. It turns the standard's existing requirements into a reviewable release candidate; it does not select work, publish a release, or take ownership of a companion Homebrew formula.

## Release on demand

This is the one release-timing policy for every Knowledge Islands tooling project that publishes releases: the `tools-*` command-line tools, the `mcp-*` servers under `ki-repo-mcp` source distribution, and any other repository that cuts versioned releases. Each repository's releasing guide points here and keeps only its mechanical steps.

- **Hold releases by default.** Do not release after each change or each delivered work record. Release only when at least one of these holds:
  1. something else needs the new capability, such as CI enforcement in another repository, or another person or machine that installs the released tool;
  2. there is something significant to ship; or
  3. significant changes have accumulated since the last release.
- **Consolidate.** Releases due only because changes have accumulated wait for a set point in the day and ship together, rather than one release per change.
- **Delivered work closes without a release.** A work record's delivery, review and acceptance never wait for a release, and an agent never releases as part of delivery. A release is a separate, explicitly authorised action.
- **The owner rebuilds locally.** The owner uses new capability before a release by rebuilding the tool from `main` through the repository's documented local rebuild, not by cutting a release.
- **Pins move only where needed.** A repository's CI `KI_VERSION` pin, held in `.github/ki-version` under `ki-engineering`, moves only when that repository needs the new version. The `ki-engineering` pin receiver fits this rule because it only proposes: it opens a pull request for each new release, and the pin moves when a person merges that proposal for a repository that needs it. A proposal a repository does not need may stay open or be closed; an older pin is not a failure. Whether routine pin bumps may merge automatically is a separate decision; if it is ever granted, adopting an auto-merging receiver is that repository's opt-in to track every release.
- **Fewer releases cost less downstream.** Consolidated releases keep the tap, website and pin proposals that each release triggers infrequent; the release automation removes the per-release handling cost, not the reason to hold.

## 1. Establish the candidate

- Complete [the change-readiness checklist](standards-change-readiness.md), then read the repository's `docs/guides/developer/definition-of-done.md` and `docs/guides/developer/releasing.md` for its exact gates and publication procedure. The local guides name this shared policy and retain executable local steps rather than duplicate common obligations.
- Confirm the intended `vX.Y.Z` version against the latest released tag and Semantic Versioning. Record breaking changes, migrations, or an explicit statement that none apply.
- Check the other enrolled `tools-*` projects' released versions and roadmap horizons as an advisory consistency snapshot. A peer's backlog or version does not block this candidate; note only a concrete shared-contract or distribution mismatch that affects it.
- Review the product changes since the last release. Exclude unrelated working-tree changes and resolve any release-blocking failures before changing the version marker.
- For a public distribution channel, verify that the publishing repository and intended artifacts are publicly reachable. Check visibility before a first release; describe a channel as available only after its actual release, installer, manual and enrolled package-manager path have been verified.
- Keep one version source of truth in the executable or package metadata. Verify that the candidate's `--version` output will match its tag. From 1.0 onward, the first dated changelog entry must also match; before 1.0, review the consolidated baseline instead of expecting a version heading. Any automated release workflow MUST reject a version/tag mismatch before building, signing, creating a draft, or publishing; a post-publication installation check is not an adequate backstop for an immutable release.
- Require GitHub release immutability to be enabled for the publishing repository before creating a release. Check the live repository setting (for example, `gh api repos/OWNER/REPO/immutable-releases --jq .enabled` must return `true`) and verify the newly published release is immutable. The setting is not retroactive: do not treat an older mutable release as eligible for an immutable-only receiver. A failing or unavailable check blocks the release, rather than silently weakening a downstream receiver.

## 2. Align the public surface

- For a 0.x candidate, update the single Pre-1.0 baseline with the current command surface and notable behaviours and changes; do not add a per-release changelog section. For a 1.0+ candidate, add a dated entry using `Added`, `Changed`, `Fixed`, and `Removed` as applicable. The pre-1.0 baseline is not a substitute for that concrete 1.0+ entry.
- Compare the candidate executable's active `--help` and `--version`, the README command overview, user guides, completion guidance and generated Bash/Zsh definitions, the applicable changelog baseline or dated entry, and any physical manual. Keep shipped commands, options, defaults, installation paths, and compatibility behaviour aligned across these surfaces.
- Confirm the common root `help [command]`, `completion <shell>`, `diag`, and `doctor` routes in the candidate artifact; verify default diagnostics are safe to share, doctor is read-only, and any owned `repair` is preview-first with an explicit write path. Record legitimate absences of `init`, `bootstrap`, or `repair` instead of adding ceremony for parity.
- Where a release changes configuration or persisted state, document the current input shape, recognised legacy repair, internal-state migration, or rejection path in the canonical user reference.
- For user-authored configuration, do not emit a schema/version field into newly written files while the input contract has one current shape. Read a legacy versioned file only when its actual structure is recognised; offer an explicit, previewable repair that removes obsolete version metadata, and never rewrite on a read or silently prompt in a non-interactive run. For each generated output contract, use its own `v1` identity while pre-1.0, not an estate-wide version or `latest`, `pre-release`, or `0`; consumers should tolerate additive fields. A change in persisted state still requires a deliberate migration and tests.
- For a physical manual, update its date when appropriate, run `mandoc -T lint`, and inspect `mandoc -Tutf8 man/<tool>.1 | col -b` after a content or layout change.

## 3. Validate the candidate

When a shared delivery profile is declared, confirm `ki-repo-tools` reports every managed installer and packaging file exact before running repository-specific release gates. Profile conformance never substitutes for executing the installer against the candidate release.

- Run `ki repo audit --repo .` and resolve its applicable mechanical findings. Complete the judgment review for version alignment, CLI surface, manual distribution, and the companion formula.
- Run every native quality gate declared by the tool. A shell entrypoint runs ShellCheck and Bats; a package.json-bearing tool also follows `ki-engineering` for its build, lint, type, and test gates.
- Exercise changed command paths and error handling proportionately to risk. Confirm `--help` and `--version` from the candidate rather than an installed copy. For a completion change, generate Bash and Zsh definitions from the packaged executable, check that they reflect the current grammar, and verify their shell registration.
- Run the repository-native command inventory or equivalent focused parity tests for active help, completion, manual, and README routes. Treat a missing deterministic check as review work to improve rather than accepting a passing generic file-presence audit as semantic conformance.
- Verify the release installer and `--link` mode against disposable destinations. Examples must set both executable and manual destination overrides and invoke that exact installed executable and manual; an empty working directory alone does not redirect installation. When a physical manual exists, confirm that both installation paths publish or link it alongside the executable.

## 4. Publish through both channels

- Commit only the reviewed release artifacts, then create the matching `vX.Y.Z` tag and GitHub release. Do not tag an unverified or dirty candidate.
- Never move or recreate a published release tag or repair published assets in place. Correct the repository, verify a new candidate and publish a new version; a failed receiver handoff is retried through its owning distribution path.
- Hand the published tag to `ki-repo-homebrew-tap` for the formula's release URL, checksum, and tap-specific validation. That skill owns the formula change.
- Publication of an authorised, verified immutable release is standing authority for the enrolled tap to propose its matching formula update through its GitHub App; it need not ask the publisher again for the exact same downstream update. The tap independently checks the version, URL, checksum and formula quality. It may automatically merge only an exact, routine update when branch rules require passing formula checks and the App cannot bypass them. A first-time formula, failed check, unexpected diff, or ambiguous release remains human-reviewed. This policy does not authorise a local agent to push a receiving repository outside that automation.
- After the validated formula reaches the tap's default branch, the tap owns dispatching its verified tool-release event to explicitly enrolled consumers. An existing website entry may automatically accept an exact version-only update only when branch rules require its passing checks and the App cannot bypass them; first-time entries, maturity changes, unexpected diffs, and consumers not enrolled in automation remain explicit receiver-owned handoffs. The tool repository holds the shared release-App credentials only to mint a token scoped to the tap for its own release dispatch, and does not duplicate consumer-side validation. Check the actual PR and merge outcome; a sent event is not a completed handoff.
- Verify a fresh release installation and the package-manager path where practical. Confirm that the released executable reports the tagged version and its manual resolves when one is shipped.

## 5. Record the outcome

- Retain the release commit, tag, GitHub release, and formula update as the durable per-release record, including during 0.x development. Keep a concise review packet with the candidate version, validation performed, and any deliberately deferred post-release follow-up.
- If a check cannot run, record the blocker and do not describe the release as fully verified. Route work outside this skill's boundary to its owner rather than adding a compatibility path here.

## Ownership boundaries

- `ki-repo-tools` owns this checklist and the generic tool-repository release contract.
- `ki-engineering` owns the TypeScript/Bun toolchain checks when the repository has a `package.json`.
- `ki-repo-homebrew-tap` owns the companion formula and its publication checks.
- `ki-repo` owns repository configuration and GitHub settings; `ki-git` owns commit and tag hygiene.
