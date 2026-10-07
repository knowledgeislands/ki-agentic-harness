# The `.ki.toml` contract

The cross-cutting contract for the shared **`.ki.toml`** file every Knowledge Islands repo carries. It is owned by `ki-repo` because **a Knowledge Islands repo is defined by carrying this file** — its presence is the compliance marker, and `ki-repo` governs the repo's compliance. Every other standard-holding skill reads its own table within it. (The TOML _formatting_ style — key case, quoting, comments — is the `ki-authoring` skill's; see its `standards-toml.md` reference. This document governs the _contract_: the file's meaning and the cross-skill protocol.)

## Contents

- [The shared file & the compliance marker](#the-shared-file--the-compliance-marker)
- [Presentation neighbourhoods](#presentation-neighbourhoods)
- [Harnesses and the skills namespace](#harnesses-and-the-skills-namespace)
- [Marker vs config tables](#marker-vs-config-tables)
- [Validate your own table](#validate-your-own-table)
- [Declared divergences](#declared-divergences)
- [Overridable vs fixed](#overridable-vs-fixed)
- [Territory and Capital](#territory-and-capital)
- [Territory selection](#territory-selection)
- [Coverage enforcement](#coverage-enforcement)
- [Scaffolding & ownership](#scaffolding--ownership)
- [Local registry](#local-registry)

## The shared file & the compliance marker

A repo declares its configuration in **one** `.ki.toml` at its root — not one file per concern. It is shared: several skills may read it, each from its own section. This keeps a repo's declared config in a single reviewable place and lets a skill discover what it needs without a bespoke file.

Its **presence is the marker of a Knowledge Islands–compliant repo**, and the **gate of the coverage cascade** (below): a repo that carries `.ki.toml` has opted into the house standards, and the standard-holding skills are what hold it to them, each reading its own table where it needs declared config. Onboarding a repo (adding the file) is the act of making it compliant; `ki-repo` requires it as a Layer-1 root file, is the skill that audits it, and — because it is the gate — is also the skill that checks the repo declares the other standards that govern it (_Coverage enforcement_, below).

Every file opens with this exact lightweight declaration:

```toml
# Knowledge Islands repository configuration.
# Its presence declares conformance with the Knowledge Islands repository standard.
```

The header makes the marker legible without requiring a reader to know the filename contract. A future specification may replace the second line with a stable reference, but repositories use this exact wording until that reference exists.

## Presentation neighbourhoods

A compact `.ki.toml` with at most two declared skill roots beyond the required `ki-repo` and `ki-authoring` foundation MAY omit neighbourhood banners, although `ki-authoring` asks every file to use them. A substantial file with three or more additional skill roots MUST use the exact three-line `Foundation` banner and at least one other needed banner from this stable sequence:

- **Foundation** — `[repo]`, `[skills.ki-repo]`, `[skills.ki-authoring]`, and their immediate configuration.
- **Repository shape** — the primary repository kind and its structural adapters.
- **Governance and runtime** — general governance capabilities, bindings, runtime-specific adapters, and their owner configuration.
- **Change management** — the work selector, selected adapter, housekeeping, and related delivery capabilities.
- **Relationships** — adopted relationship capabilities, with `[skills.ki-trades]` always the last table in the file.

Use only the neighbourhoods the repository needs. Foundation stays first: `[repo]` remains the first table, `[skills.ki-repo]` the first skill root, and `[skills.ki-authoring]` follows the repository contract it presents. After that, owner affinity takes precedence over a global alphabetic sort. Within a neighbourhood, keep a skill's explicit root and all of its subordinate configuration contiguous, with the root before any child table or dotted child assignment. Otherwise retain a stable local order; alphabetic order is useful only where it does not separate an owner from its adapters or configuration.

Neighbourhood comments are navigational and carry no consumer-visible semantics. The exact conformance header and its following blank line remain the first bytes of the file; the neighbourhood banners follow them, with no other decorative rule. `ki-authoring` owns their TOML presentation, including the strong preference for compact dotted child keys when a complete entry remains readable on one line and the nested-table escape for complex records.

Each used banner MUST use the exact three-line comment form, appear at most once, introduce a non-empty declaration group, and follow the sequence above. An owner block MUST NOT cross a neighbourhood banner. `ki-repo` mechanically diagnoses these source-level rules without reserialising TOML or assigning every skill to a hard-coded neighbourhood. `ki-authoring` retains the judgment of whether a non-foundation declaration is placed under the most meaningful banner.

### Layout rules

Every `.ki.toml` follows the six `ki-authoring` TOML layout rules. `ki-repo` checks four of them mechanically as `FILES-10`, on the source text rather than the parsed data:

- Exactly one blank line precedes every table heading and every neighbourhood banner. A comment attached directly above a heading belongs to it, so the blank line comes before the comment.
- Every array is multiline: the opening bracket ends its line, each element sits on its own line with a trailing comma, and the closing bracket has a line of its own.
- `[skills.ki-trades]` and its child tables are the last tables in the file.
- A skill subtable such as `[skills.<skill>.<key>]` is a data map whose keys are data: roadmap `areas`, client names, check names, zones, sites, templates, client names, model tiers, budget surfaces and lifecycle states. A subtable that groups fixed fields fails; those keys belong in the skill table. `[skills.ki-trades.territory]` is exempt while its trade-policy model is under separate review; the retired `[skills.ki-repo.territory]` is not.

`FILES-10` fails in Arcadia territory and warns elsewhere, as the roadmap's bare-area-list check does. Its enforcing Capital is the canonical identity `https://github.com/knowledgeislands/ki-arcadia-principal`, resolved through the local registry as [Territory and Capital](#territory-and-capital) describes. Only repositories listed in that Capital's `territory_members`, including the Capital itself, receive strict enforcement. Short territory or Harness prefixes and retired Agora rosters do not determine this policy. An unavailable or ambiguous Capital reads as outside the enforcing territory, so the check warns rather than fails.

## Harnesses and the skills namespace

A repository names the harnesses that provide its skills once, in `[repo]`, and declares each governing skill by its **bare name** under the `[skills]` namespace. A skill that needs declared config owns **exactly one** table there, named for the skill, and may nest sub-tables under it (e.g. `[skills.<name>.checks]`):

```toml
[repo]
harnesses = [
  "knowledgeislands/ki-agentic-harness",
]

[skills.ki-repo]
repo_type = "project"
primary_shape = "ki-repo-project"
# Canonical GitHub home
repository = "https://github.com/owner/repository"
# Exact README.md H1
title = "Example repository"
# Territory Capital; a Capital names itself
capital = "https://github.com/owner/capital"
# Exact GitHub and package.json description where present
description = "One sentence describing the repository."
visibility = "public"
# SPDX id; default MIT when unset. "UNLICENSED" for proprietary.
license = "MIT"
# Required agent-runtime support surface
supported_runtimes = [
  "claude-code",
  "chatgpt-codex",
]

checks.branch-protection = true

[skills.ki-repo-project]
```

`[skills]` is a namespace, not a skill: it makes "this key is a declaration" structural rather than a guess about how the key is spelled. A repository-level setting that belongs to no skill lives in `[repo]` and is never mistaken for one.

`[skills.ki-repo]` carries repository identity and declared facts the auditor checks. `repository` is mandatory and is the canonical HTTPS GitHub home (`https://github.com/<owner>/<repository>`), checked against GitHub's repository identity. `title` and `description` are mandatory: title exactly matches the README H1, while description exactly matches GitHub and package.json where those surfaces exist. `visibility` (`"public"` | `"private"`, matched against GitHub) and `license` (an [SPDX License List](https://spdx.org/licenses/) identifier — default MIT when unset — matched against the live GitHub license, the `LICENSE` file, and `package.json` `"license"`) are independent: a private repo may be MIT, a public repo proprietary. Use [Choose a License](https://choosealicense.com/) as selection guidance; use `"UNLICENSED"` for all-rights-reserved proprietary. `capital` is mandatory and names the repository's territory Capital as a full canonical HTTPS GitHub URL with the same grammar as `repository`; a Capital names itself. [Territory and Capital](#territory-and-capital) defines how it is checked.

The third, `supported_runtimes`, is a **repo-wide** fact — the agent runtimes this repo supports. It lives on `[skills.ki-repo]` rather than `[skills.ki-repo-harness]` because it drives orientation and runtime-bound capabilities across the whole repo, not just the four-part harness; a non-harness KI repo can support runtimes too. Native activation resolves it to each runtime's discovery path (Claude Code → `.claude/`, ChatGPT Codex → `.agents/`; see the runtime feature-coverage matrix in `SDR-KI-HARNESS-002`). The key is required: support is a stable repository capability, never inferred from the directories present at a moment in time. Values must name a recognised runtime (`claude-code`, `claude-desktop`, or `chatgpt-codex`), must be non-empty, and must not repeat — the auditor's `RUNTIMES-1` FAILs otherwise. The retired `codex` identifier is rejected with recovery guidance; it is not a compatibility alias.

Runtime environment coverage follows that declaration rather than being opt-in. Every repository declares portable `[skills.ki-binding]` and `[skills.ki-tokenomics]`. A repository supporting `claude-code` also declares `[skills.ki-binding-claude]`, `[skills.ki-housekeeping-claude]`, and `[skills.ki-tokenomics-claude]`; one supporting `chatgpt-codex` declares `[skills.ki-binding-chatgpt]`, `[skills.ki-housekeeping-chatgpt]`, and `[skills.ki-tokenomics-chatgpt]`. The ChatGPT-family housekeeping skill audits local Codex memory but never automatically deletes sessions; its app-server remains experimental and requires separate reviewed acquisition and deletion. Each housekeeping table explicitly declares `auto_memory` as `disabled`, `transition`, or a human-approved, project-scoped `enabled` opt-in. `RUNTIMES-2` derives the mandatory set and checks both local declarations and host-resolved repository activation. Its CONFORM action requests one native host proposal for missing capabilities; it never writes a sibling-owned table, creates a runtime link, selects a provider, or changes user configuration itself. Missing, ambiguous, incompatible, unavailable, untrusted, or altered activation evidence fails closed under the host's ownership.

- The table name **matches the skill's `name`** exactly, so the owner is unambiguous and the file reads as a map of skill → its settings.
- A skill reads **only its own table** and never reaches into another skill's — the table boundary is the schema ownership boundary. If two skills need the same fact, it still lives under whichever skill owns it, and the other resolves it from there. `ki-repo` owns the shared file-level contract and required foundation scaffold; each skill may conform its own table while preserving every other table.

### Resolution

A bare name binds to exactly one provider, resolved against the declared `harnesses` list rather than against whichever harnesses happen to be installed — so a version-controlled file means the same thing on every machine.

- Exactly one declared harness provides the skill → it binds, and its qualified identity is derived rather than written.
- No declared harness provides it → an error naming the skill and the declared list.
- More than one provides it → an error requiring explicit qualification.

Declaring a skill is separate from configuring it. `[skills.ki-trades]` with no keys is a marker; a skill is never declared as a side effect of one of its sub-tables. State the root table explicitly even where TOML would create it implicitly, so a declaration never depends on whether the skill happens to carry configuration.

### The out-of-list exception

A skill drawn from a harness outside the declared list keeps a quoted, fully-qualified key, so the exception stays visibly exceptional:

```toml
[skills."otherowner/other-harness:ki-example"]
```

This is the only place a qualified key appears in the file.

## Marker vs config tables

A `[skills.<name>]` table plays one or both of two roles:

- **Marker (opt-in)** — its _presence_ declares "this skill governs this repo." The bare header is enough; it needs no keys.
- **Config** — it carries per-repo declarations the skill reads (data the standard fits to, or `[…checks]` divergences).

The two are separable: a base on the canonical zone names declares a bare `[skills.ki-repo-kb]` (marker only, no keys); a base that renames a zone adds a `[skills.ki-repo-kb.zones]` alias (config). The marker/opt-in skills include `ki-engineering`, `ki-decision-records`, `ki-specs`, `ki-guides`, `ki-repo-kb`, `ki-repo-kb-streams`, the website family, MCP, skills, and subagents. `ki-repo` is the **bedrock marker** — the file's very presence is what makes the repo a ki-repo. `ki-authoring` governs every markdown repo, but it is **declared, not assumed**: every repo carries a bare `[skills.ki-authoring]` table like any other coverage (a missing one is a FAIL — `authoring-baseline`, [ADR-KI-HARNESS-005](../../../../docs/decisions/ADR-KI-HARNESS-005-validate-down-ki-toml-contract.md)). There is no injected/cascade-exempt baseline: coverage is purely what the config declares (ADR-KI-HARNESS-007).

So **what an absent table means is per-skill**, and that is exactly what _Coverage enforcement_ (below) checks:

| Table absent | Means |
| --- | --- |
| `[skills.ki-repo]` (the file) | not a ki-repo — the marker itself (bedrock; missing file is a FAIL) |
| any other marker skill's table | not opted into that standard — a coverage WARN _if_ the repo shows that skill's artifacts |
| `ki-authoring` | a bare `[skills.ki-authoring]` marker — declared like any coverage, not assumed (FAIL if missing) |

Every declared governance root also commits the repository to a complete **resolvable native capability**: `ki repo audit` and `ki repo conform` must resolve its compatible registered operations only from the verified active installed collection before any operation runs. A declaration is not a request to vendor a manifest or payload into the repository. Process skills (`ki-next`, `ki-plan`, `ki-implement`, `ki-accept`, `ki-batch`, and `ki-recap`) remain global process tooling, not target-local governance contracts, and must not be declared in `.ki.toml`. Human-led repository review is a mode of the declared `ki-repo` capability, not a separate configuration table.

## Validate your own table

A skill **validates its own table and only its own**: it warns on a key (or sub-table entry) under its table that it doesn't recognise — a typo or a stale option should surface, not silently do nothing — and advises dropping one that merely restates a default. It leaves every other skill's table untouched, even keys it can't interpret. **Validate down, ignore across.** (`ki-repo` is the reference: it warns on an unknown `[…checks]` entry, notes a redundant one, and never inspects another skill's table.) The same boundary governs conformers: a skill may change its own table, never another's.

## Declared divergences

Where a skill's standard allows a repo to diverge from a default, record that **in the skill's own table** so it reads as a declared choice, not drift. The _shape_ is the owning skill's business — `ki-repo`, for instance, carries a `[…checks]` sub-table of booleans where any check set against its org default is the divergence:

```toml
[skills.ki-repo.checks]
wiki = false   # this repo keeps a Wiki — deliberate, not drift
```

The owning skill's auditor then reports the divergence as an acknowledged note rather than a failure. Adopt the same principle for any skill that needs declared, reviewable per-repo overrides: the divergence lives under that skill's table, is commented with its _why_, and is validated by that skill (an unrecognised key warns).

For a wholly owned file that needs a safety exception, the owning skill may use a nested map of exact filenames to non-empty reasons. The declaration protects only the named destructive conform write; it remains a warning and never supplies a second local template or arbitrary configuration delta.

## Overridable vs fixed

A skill's standard fixes its model; a base or repo may declare **only** the keys that skill documents as overridable, and nothing else is a config knob. Two kinds of declaration are overridable: **data** the standard reads to fit a target (e.g. `ki-repo-kb`'s zone aliases, `required_frontmatter`, and `preflight`), and **divergences** from a default (the `[…checks]` booleans above). Everything not so documented is **fixed** by the standard — a target does not redefine it in config. This split is what keeps target-specificity declared-and-auditable rather than forked into a coupled skill: where a target differs, it differs through a documented key, not a bespoke `<target>-*` extension skill.

So the option set is **authored, not implicit**: each skill with declarable keys defines and can emit or conform its commented schema/default fragment, so an author sees exactly what may be set and an undocumented key warns (validate-down). `ki-repo` separately owns the file-level contract and required foundation markers. A target-specific need that no documented key can express is a signal to **generalise it into the standard** (a REFRESH candidate), not to invent an ad-hoc key or fork a skill.

## Territory and Capital

Every repository belongs to exactly one territory, governed by its Capital. `[skills.ki-repo].capital` is required in every `.ki.toml`: a full canonical HTTPS GitHub URL (`https://github.com/<owner>/<repository>`, lower-case owner and name drawn from `[a-z0-9._-]`), compared as an exact string with the Capital's own `[skills.ki-repo].repository`. A Capital is the repository whose `capital` equals its own `repository`. There is no default, alias, or inference at read time; a missing or malformed declaration FAILs.

Only a Capital declares territory membership, and it must, directly in `[skills.ki-repo]`:

```toml
[skills.ki-repo]
repository = "https://github.com/owner/capital"
capital = "https://github.com/owner/capital"
territory_name = "Example territory"
territory_members = [
  "https://github.com/owner/capital",
  "https://github.com/owner/member",
]
```

`territory_name` is a non-empty string. `territory_members` is a non-empty array of canonical HTTPS GitHub URLs, without duplicates, sorted in ascending string order, and including the Capital itself. An optional `territory_prefix` is a lower-case slug matching `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`. Only a Capital may declare any of these three keys. The retired `[skills.ki-repo.territory]` table, with `name` and `members`, is never read: it FAILs with the remediation to move them to `territory_name` and `territory_members` and remove the table.

Agreement between a declaration and its Capital is checked only through the local registry (`$KI_STATE_HOME/registry.toml` when `KI_STATE_HOME` is set, otherwise `$XDG_STATE_HOME/ki/registry.toml`, otherwise `~/.local/state/ki/registry.toml`). The auditor reads each registered checkout's own `.ki.toml` and identifies it by the `[skills.ki-repo].repository` declared there, never by the registry entry; two registered checkouts declaring one URL are ambiguous. It never scans the filesystem and never consults an Agora.

- **A member** WARNs `territory policy lives in <capital>, not available here` when its Capital is not registered locally, FAILs when the Capital is registered more than once, is not a Capital, or does not list the member, and passes otherwise. A registered checkout whose `.ki.toml` cannot be read or parsed declares nothing; when the registry entry's own `repository` claims the Capital and no readable checkout declares it, the member FAILs with `registered checkout at <path> has an unreadable .ki.toml` instead of the unavailable WARN.
- **A Capital** FAILs when a member it lists is registered locally but declares a different or missing `capital`; a member not checked out here is reported as information only.

The `TERR` rubric family carries these rules: `TERR-1` (capital declared), `TERR-2` (territory declaration shape) and `TERR-3` (registry-backed agreement). CONFORM inserts `capital` directly after the `title` line of `[skills.ki-repo]`, or after `repository` when there is no title, but only when the value is inferable: a repository declaring a territory is its own Capital, and otherwise exactly one registered Capital must list the repository. Any other case is left for the owner to declare.

The Capital also owns the territory's trade policy under `[skills.ki-trades.territory]`; `ki-trades` governs its schema and the routes it grants.

## Territory selection

The accepted [territory-selection decision](https://github.com/knowledgeislands/ki-arcadia-principal/blob/main/Admin/Governance/Decisions/ADR-KI-ARCADIA-002-territory-derived-repository-selection.md) replaces Agora working-set selection with the Capital's authoritative `territory_members`. This selection grants no jurisdiction, cross-repository write permission, trade route or acceptance authority.

A territory's handle is its Capital's explicit `territory_prefix`, or its Capital's local registry key when the prefix is absent. An explicit prefix selects the Capital itself, never repositories whose names begin with that prefix. A prefixed Capital's registry key remains local identity metadata and is not a second territory alias. Resolve handles across registered Capitals, reject malformed naming metadata and duplicate handles, and reject a registry-key fallback that collides with another Capital's explicit prefix. Canonical repository URLs identify membership; the registry resolves their local checkout paths. Arcadia's chosen handle is `ki`; its Paperclip organisation code remains `KIS`.

KI and mgit share these selection rules:

- `-t, --territory <handle>` selects exactly the named Capital's declared territory; `--estate` selects the caller's registered estate. These scopes are mutually exclusive and cannot accompany an explicit repository selection. Each caller retains its native default when neither scope nor explicit repository selection is given.
- Repeated `-f, --filter <prefix>` values match the repository checkout directory's basename, literally and case-sensitively, with OR semantics. Prefixes must be non-empty. A filter only narrows the selected scope, including a caller's native default, and is applied before Git worktree expansion. Glob syntax has no special meaning; there is no legacy glob option or Agora alias.
- Validate scope, Capital and membership metadata, complete member registration, identity ambiguity and the naming metadata needed for every candidate before filtering. A missing registration or ambiguous member is a failure even when a filter would exclude it. Then validate the selected physical roots and each caller's runtime requirements. An unavailable selected checkout, empty selection or zero filter matches fails before any operation; an unavailable checkout excluded by the filter does not prevent the remaining selected operations.
- Caller-specific command eligibility and native defaults remain owned by that caller. Neither filtering nor worktree expansion changes membership or the scope's authority.

The read-only machine endpoint is `ki territory roots --null --territory <handle> [--filter <prefix>...]`, or `ki territory roots --null --estate [--filter <prefix>...]`; the short flags `-t` and `-f` have the same meaning. It returns deterministic, deduplicated registered primary checkout roots as NUL-delimited absolute paths. Resolve and validate the complete request before writing any stdout bytes. Failure emits diagnostics on stderr and a non-zero exit status, with no partial roots. Other tooling may consume this endpoint as a buffered selection interface without importing KI runtime or authority rules.

## Coverage enforcement

The file's presence is the **gate of an audit cascade**. Once a repo is confirmed a ki-repo (it carries `.ki.toml`), `ki-repo`'s auditor checks that the repo **declares an opt-in table for every governance skill whose applicability is detectable in it**. A detected-but-undeclared signal FAILs ("looks governed by `ki-<skill>` but declares no `[skills.ki-<skill>]`"); a declared-but-undetected table WARNs as a possibly stale opt-in. Documentation is mechanically owned: content under `docs/decisions/` (or a Knowledge Base's `Admin/Governance/Decisions/`) requires `ki-decision-records`, content under `docs/specs/` requires `ki-specs`, and content under `docs/guides/` requires `ki-guides`.

The gate is what prevents a **false positive**: a plain git repo that has, say, an `eleventy.config` but **no `.ki.toml`** is not a ki-repo, so it is never told to declare a website table. It simply takes the `ki-config` required-file FAIL. Coverage is only ever considered _after_ the marker confirms a ki-repo.

The detection signals `ki-repo` uses (one recursive tree read + `package.json`):

| Skill | Detection signal | Opt-in table |
| --- | --- | --- |
| `ki-decision-records` | `docs/decisions/**` or `Admin/Governance/Decisions/**` | `[skills.ki-decision-records]` |
| `ki-specs` | `docs/specs/**` | `[skills.ki-specs]` |
| `ki-guides` | `docs/guides/**` | `[skills.ki-guides]` |
| `ki-engineering` | `package.json` present | `[skills.ki-engineering]` |
| `ki-repo-kb` | canonical zones (`Pillars/` + `Resources/`) | `[skills.ki-repo-kb]` |
| `ki-repo-kb-streams` | `Streams/` zone | `[skills.ki-repo-kb-streams]` |
| `ki-repo-website` | either website implementation signal below | `[skills.ki-repo-website]` |
| `ki-repo-website-content` | `eleventy.config.*` | `[skills.ki-repo-website-content]` |
| `ki-repo-website-app` | Vite config plus React and Vite dependencies at the core-selected site root | `[skills.ki-repo-website-app]` |
| `ki-repo-website-cloudflare` | a `wrangler.*` config | `[skills.ki-repo-website-cloudflare]` |
| `ki-repo-mcp` | `@modelcontextprotocol/sdk` or `@modelcontextprotocol/server` dependency | `[skills.ki-repo-mcp]` |
| `ki-repo-specifications` | `proposals/` + `specifications/` + `schemas/` | `[skills.ki-repo-specifications]` |
| `ki-repo-tools` | `install.sh` + a `bin/<exe>` | `[skills.ki-repo-tools]` |
| `ki-repo-homebrew-tap` | `Formula/*.rb` | `[skills.ki-repo-homebrew-tap]` |
| `ki-skills` | `skills/*/SKILL.md` | `[skills.ki-skills]` |
| `ki-subagents` | Claude Markdown or Codex TOML projection | `[skills.ki-subagents]` |
| `ki-subagents-claude` | `subagents/**/*.md` | `[skills.ki-subagents-claude]` |
| `ki-subagents-chatgpt` | `.codex/agents/**/*.toml` | `[skills.ki-subagents-chatgpt]` |
| `ki-checkpoint` | `+/_CHECKPOINTS/` subarea | `[skills.ki-checkpoint]` |

This is the **one place** `ki-repo` reads across skill tables. It normally reads only table **presence**; app discovery also consumes the core-owned `site-root` solely to locate the selected Vite config and package manifest. The website core still owns and validates that value, preserving _validate down, ignore across_ for its contents. It is an **audit-time enforcement** run by `repo`'s auditor, not behaviour baked into the regular use of each skill. A repo opts out of a single signal with a `coverage-<skill> = false` entry under `[skills.ki-repo.checks]`; the auditor emits an informational note so that deliberate non-activation remains explicit. Website keys are independent: `coverage-website`, `coverage-website-content`, `coverage-website-app`, and `coverage-website-cloudflare` do not disable one another.

Trade coverage is the one signal read from outside the repository. When the repository's Capital resolves through the local registry (`TERR-3` passes) and its `[skills.ki-trades.territory]` channels name the repository as a source or receiver, a missing `[skills.ki-trades]` FAILs `COV-1`. A Capital policy that is not available here skips the signal, because `TERR-3` already reports the unavailable policy. A Capital never raises it: its channels live in its own `[skills.ki-trades]` table. The signal has no `coverage-` override: a named island must declare the skill or be removed from the Capital's channels.

No marker table is decorative — each is read by code. Most are read by their **owning** skill's auditor too (`-engineering`/`-kb`/`-streams`/`-website`/`-website-cloudflare`/`-mcp` each read their own table when run). `ki-skills`, `ki-subagents`, and its runtime adapters are the documented exception: their checkers lint artifact sets (`SKILL.md` files or native agent projections), not a repo's config, so their opt-in tables are read only by `ki-repo`'s coverage check.

## Repository kind

`[skills.ki-repo]` owns the mandatory `repo_type` and `primary_shape` fields. `repo_type` is exactly `project` or `kb`. A Project names a declared core shape in `primary_shape`, using `ki-repo-project` for a general Project. A Knowledge Base writes `primary_shape = "ki-repo-kb"` and a duplicate-free `store_roles` array containing `notes`, optionally `sources` and `legacy`. These are role names, not paths or local-machine bindings. Projects do not declare `store_roles`.

Both fields must be present even when the repository has only one possible shape. The [Project shape rules](standards-repository.md#project-shapes) define supported core shapes and adapters. A missing, unsupported, undeclared, or kind-incompatible shape is invalid. Neither kind nor primary shape is accepted in another skill's table.

## Scaffolding & ownership

The **schema and conformer** inside a table belong to the skill that owns it: that skill documents the allowed keys and may emit or update its canonical fragment while preserving unrelated content. `ki-repo` owns the shared file-level contract and the two required foundation markers. No operation embeds another skill's TOML template or edits that skill's table directly. This retains one shared `.ki.toml`, one table per skill, read-only access across table boundaries, and validate-down/conform-down ownership.

`ki-repo`'s own foundation action establishes the opening declaration and required markers. For a missing file it writes the exact header, one canonical `[skills.ki-repo]` general-Project block, its bare `[skills.ki-repo-project]` declaration, and one bare `[skills.ki-authoring]` marker. For a partial file it prepends only the missing header and appends only whichever foundation root marker is absent, adding the bare general-Project declaration only when it creates the `ki-repo` block; `[skills.ki-repo.checks]` alone is not an exact `[skills.ki-repo]` marker. Apart from that bounded prepend and append, existing content remains byte-for-byte unchanged — including values, comments, ordering, and existing newline bytes — repeat runs are idempotent, and dry-run writes nothing. CONFORM applies the local repair while live GitHub changes remain separately confirmed work.

The native configuration and activation flow runs this owner leg without embedding a TOML template or writing another skill's table. It re-reads the result before resolving the declared operations from the verified installed collection; it does not vendor an executor. No-seed/no-config activation remains an empty-set operation, so this flow does not recreate an injected baseline.

The native resolver validates declaration names. Exact and dotted `[skills.ki-*]` headers both resolve to their root owner; bare and simply quoted TOML keys are equivalent, header-looking text inside multiline strings is ignored, and noncanonical ki-like roots remain visible so they fail rather than disappear. Repeated roots collapse. If any declared root is unresolvable, native audit, activation, dry-run, and the repository-mutating portion of CONFORM fail and report each name once in sorted order. Rename reconciliation stays human because no mechanical mapping can establish intent.

## Local registry

The local user configuration separately records physical roots that have been addressed as KI repositories. It is an inventory for audit, repair, and future bulk operations — not a record of successful conformance. `ki repo register` adds explicitly selected physical roots without resolving declarations or applying repository repairs. `ki repo init`, direct-CWD `ki repair`, and a local non-dry-run `ki repo conform` each attempt the same registration before their later work, so a malformed or failing `.ki.toml` remains discoverable. Registration preserves existing entries, never removes an entry, and does not search the filesystem beyond the caller's explicit target selection. Without a bootstrapped local user configuration, CONFORM remains portable and does not create one; the standalone registration command requires it. Cloud-account registry and reconciliation are outside this local contract.
