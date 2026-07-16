# Project roadmap

This portfolio view is generated from the canonical theme roadmaps under `docs/roadmap/`. Edit those files, then run `ki-project-roadmap` CONFORM.

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

- [Hooks: Graduate `git-lock-check.sh` into the harness hook surface](docs/roadmap/hooks/ROADMAP.md#graduate-git-lock-checksh-into-the-harness-hook-surface)

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

- [Foundation Tooling: Allow `printWidth` to be overridden per repo via `.ki-config.toml` _(candidate)_](docs/roadmap/foundation-tooling/ROADMAP.md#allow-printwidth-to-be-overridden-per-repo-via-ki-configtoml-candidate)
- [Foundation Tooling: Codify a Conventional Commits git standard across the skills](docs/roadmap/foundation-tooling/ROADMAP.md#codify-a-conventional-commits-git-standard-across-the-skills)
- [Foundation Tooling: Codify the generated-code lint/knip exclusion in `ki-engineering`](docs/roadmap/foundation-tooling/ROADMAP.md#codify-the-generated-code-lintknip-exclusion-in-ki-engineering)
- [Foundation Tooling: Document each skill's overridable `.ki-config.toml` properties _(candidate)_](docs/roadmap/foundation-tooling/ROADMAP.md#document-each-skills-overridable-ki-configtoml-properties-candidate)
- [Foundation Tooling: Enforce CHK-009 citation completeness with a cross-skill check](docs/roadmap/foundation-tooling/ROADMAP.md#enforce-chk-009-citation-completeness-with-a-cross-skill-check)
- [Foundation Tooling: Formal schema for `.ki-config.toml` _(candidate)_](docs/roadmap/foundation-tooling/ROADMAP.md#formal-schema-for-ki-configtoml-candidate)
- [Foundation Tooling: Harden generated-file writes against symlinks and read/check/write races _(candidate)_](docs/roadmap/foundation-tooling/ROADMAP.md#harden-generated-file-writes-against-symlinks-and-readcheckwrite-races-candidate)
- [Foundation Tooling: Judgmental CONFORM pass to tidy `.ki-config.toml` comment style _(candidate)_](docs/roadmap/foundation-tooling/ROADMAP.md#judgmental-conform-pass-to-tidy-ki-configtoml-comment-style-candidate)
- [Foundation Tooling: Make `ki:audit` a fully universal clean gate — NA-skip the remaining over-reaching audits](docs/roadmap/foundation-tooling/ROADMAP.md#make-kiaudit-a-fully-universal-clean-gate--na-skip-the-remaining-over-reaching-audits)
- [Foundation Tooling: Overhaul checker output: pure JSON emitters + a single formatter](docs/roadmap/foundation-tooling/ROADMAP.md#overhaul-checker-output-pure-json-emitters--a-single-formatter)
- [Foundation Tooling: Reconcile the fleet's toolchain prose with the collapsed toolchain](docs/roadmap/foundation-tooling/ROADMAP.md#reconcile-the-fleets-toolchain-prose-with-the-collapsed-toolchain)
- [Foundation Tooling: Rename `ki-engineering` to `ki-engineering-ts`](docs/roadmap/foundation-tooling/ROADMAP.md#rename-ki-engineering-to-ki-engineering-ts)
- [Foundation Tooling: Revisit the vitest mandate vs the bare-`test` idiom in `ki-engineering`](docs/roadmap/foundation-tooling/ROADMAP.md#revisit-the-vitest-mandate-vs-the-bare-test-idiom-in-ki-engineering)
- [Foundation Tooling: Standardise the free-form named-action `package.json` keys](docs/roadmap/foundation-tooling/ROADMAP.md#standardise-the-free-form-named-action-packagejson-keys)
- [Foundation Tooling: Sweep the `mcp-*` repos onto the uniform mode model + re-check naming across surfaces](docs/roadmap/foundation-tooling/ROADMAP.md#sweep-the-mcp--repos-onto-the-uniform-mode-model--re-check-naming-across-surfaces)
- [Governance Consistency: Codify the convention-placement model and knowledge-promotion loop](docs/roadmap/governance-consistency/ROADMAP.md#codify-the-convention-placement-model-and-knowledge-promotion-loop)
- [Governance Consistency: Cover the CLAUDE.md → skill move as a tokenomics lever](docs/roadmap/governance-consistency/ROADMAP.md#cover-the-claudemd--skill-move-as-a-tokenomics-lever)
- [Governance Consistency: Delineate the meta-skill ownership boundaries across the environment family _(candidate)_](docs/roadmap/governance-consistency/ROADMAP.md#delineate-the-meta-skill-ownership-boundaries-across-the-environment-family-candidate)
- [Governance Consistency: Extract the git write-safety rule into its own skill _(candidate)_](docs/roadmap/governance-consistency/ROADMAP.md#extract-the-git-write-safety-rule-into-its-own-skill-candidate)
- [Governance Consistency: Formalize `docs/guides/agents/` as the neutral staging area for repository agent guidance _(candidate)_](docs/roadmap/governance-consistency/ROADMAP.md#formalize-docsguidesagents-as-the-neutral-staging-area-for-repository-agent-guidance-candidate)
- [Governance Consistency: Normalise mode vocabulary and mode-heading structure across the skills](docs/roadmap/governance-consistency/ROADMAP.md#normalise-mode-vocabulary-and-mode-heading-structure-across-the-skills)
- [Hooks: Govern Claude Code hooks as a first-class harness surface](docs/roadmap/hooks/ROADMAP.md#govern-claude-code-hooks-as-a-first-class-harness-surface)
- [Operations: Background agents lose their handle across `/compact`](docs/roadmap/operations/ROADMAP.md#background-agents-lose-their-handle-across-compact)
- [Operations: Codify per-project Headroom base-URL scoping as a repo pattern _(candidate)_](docs/roadmap/operations/ROADMAP.md#codify-per-project-headroom-base-url-scoping-as-a-repo-pattern-candidate)
- [Runtime Portability: Route multi-machine harness state through portable or synchronized homes](docs/roadmap/runtime-portability/ROADMAP.md#route-multi-machine-harness-state-through-portable-or-synchronized-homes)

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

- [Foundation Tooling: Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`](docs/roadmap/foundation-tooling/ROADMAP.md#remove-the-legacy-preferredmodel-migration-bridge-in-ki-tokenomics)
- [Governance Consistency: Separate KI-opinionated conventions from general portable standards](docs/roadmap/governance-consistency/ROADMAP.md#separate-ki-opinionated-conventions-from-general-portable-standards)
- [Operations: Extend `ki-housekeeping` to cover `~/.claude/workflows/`](docs/roadmap/operations/ROADMAP.md#extend-ki-housekeeping-to-cover-claudeworkflows)
- [Operations: Retry blocked memory-store fixes once `memory_*` tools recover](docs/roadmap/operations/ROADMAP.md#retry-blocked-memory-store-fixes-once-memory-tools-recover)
- [Operations: Run a `ki-housekeeping` cleanup pass on this machine's Claude Code state](docs/roadmap/operations/ROADMAP.md#run-a-ki-housekeeping-cleanup-pass-on-this-machines-claude-code-state)

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

- [Governance Consistency: Roll out the expanded Feature Definitions pattern to the fleet _(candidate)_](docs/roadmap/governance-consistency/ROADMAP.md#roll-out-the-expanded-feature-definitions-pattern-to-the-fleet-candidate)
- [Governance Consistency: Sweep decisions, feature definitions, and guides for drift and stale citations _(candidate)_](docs/roadmap/governance-consistency/ROADMAP.md#sweep-decisions-feature-definitions-and-guides-for-drift-and-stale-citations-candidate)
- [Operations: Cover Headroom's stats-reset mechanics in `ki-tokenomics` _(candidate)_](docs/roadmap/operations/ROADMAP.md#cover-headrooms-stats-reset-mechanics-in-ki-tokenomics-candidate)
- [Operations: Document the `headroom memory delete` remedy for cross-repo `headroom:learn` leakage _(candidate)_](docs/roadmap/operations/ROADMAP.md#document-the-headroom-memory-delete-remedy-for-cross-repo-headroomlearn-leakage-candidate)
- [Operations: Evaluate memtrace as structural-memory layer for the harness _(candidate)_](docs/roadmap/operations/ROADMAP.md#evaluate-memtrace-as-structural-memory-layer-for-the-harness-candidate)
- [Operations: Make `ki-recap`'s grounding helper resolve the invoking session, not heuristically guess it _(candidate)_](docs/roadmap/operations/ROADMAP.md#make-ki-recaps-grounding-helper-resolve-the-invoking-session-not-heuristically-guess-it-candidate)
- [Operations: Mine historical sessions for recurring context bloat _(candidate)_](docs/roadmap/operations/ROADMAP.md#mine-historical-sessions-for-recurring-context-bloat-candidate)
- [Operations: Model recurring, schedule-driven activities as a harness concept _(candidate)_](docs/roadmap/operations/ROADMAP.md#model-recurring-schedule-driven-activities-as-a-harness-concept-candidate)
- [Operations: Tooling to promote genuinely reusable `CLAUDE.md` content into skills _(candidate)_](docs/roadmap/operations/ROADMAP.md#tooling-to-promote-genuinely-reusable-claudemd-content-into-skills-candidate)
- [Runtime Portability: A thin `ki` command-line tool wrapping the vendored scripts _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#a-thin-ki-command-line-tool-wrapping-the-vendored-scripts-candidate)
- [Runtime Portability: Frame the harness as increasing the odds AI's multiplier effect lands positive _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#frame-the-harness-as-increasing-the-odds-ais-multiplier-effect-lands-positive-candidate)
- [Runtime Portability: Port the KI MCP servers into Cowork's sandbox](docs/roadmap/runtime-portability/ROADMAP.md#port-the-ki-mcp-servers-into-coworks-sandbox)
- [Runtime Portability: Run claude.ai connectors' equivalents behind mcporter _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#run-claudeai-connectors-equivalents-behind-mcporter-candidate)
- [Runtime Portability: Run Hermes remotely for background asynchronous work _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#run-hermes-remotely-for-background-asynchronous-work-candidate)
- [Runtime Portability: State "vendor tools into a project, then use them from there" as the harness's explicit core framing _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#state-vendor-tools-into-a-project-then-use-them-from-there-as-the-harnesss-explicit-core-framing-candidate)
- [Runtime Portability: Use `target_runtimes` to conditionally install runtime-bound surfaces _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#use-targetruntimes-to-conditionally-install-runtime-bound-surfaces-candidate)
- [Runtime Portability: Vendor skills into `.ki-meta/skills`, then symlink `.claude/skills` from there — no symlink target outside the repo _(candidate)_](docs/roadmap/runtime-portability/ROADMAP.md#vendor-skills-into-ki-metaskills-then-symlink-claudeskills-from-there--no-symlink-target-outside-the-repo-candidate)
