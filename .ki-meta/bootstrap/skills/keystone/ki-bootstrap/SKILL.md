---
name: ki-bootstrap
ki-depends-on: [ki-repo]
ki-vendors: [educate, audit, conform, help]
ki-shared-modules: [educator]
ki-shared-dependencies: [ki-skills:rubric, ki-skills:checker, ki-skills:reporter]
description: >
  Bootstraps a Knowledge Islands repo into governance: the EDUCATE chain vendors declared checkers and local educator launchers into responsibility-specific `.ki-meta/` areas, so it self-governs via `./.ki-meta/bin/ki-audit` with zero skills installed and never changes `package.json`; it also links project-local skills from `.ki-config.toml` so the right instructions load in-session. Use when bootstrapping or re-bootstrapping a repo, making it self-govern, or setting up and auditing skill links. Triggers: "bootstrap this repo", "make this repo self-govern", "set up this repo's skills", "re-bootstrap this repo", "why aren't my skills loading in this repo". This is the install keystone — the one Knowledge Islands skill kept installed globally — so any repo can self-wire from the remote source. For `.ki-config.toml` coverage and GitHub settings use `ki-repo`; for the harness layout use `ki-harness`.
argument-hint: 'help | educate [target] | audit [path] | conform [path] | refresh'
---

# Knowledge Islands Bootstrap

You are the install **keystone** — the one `ki-*` skill kept globally installed (so its `description` is paid on every turn everywhere), deliberately tiny. The global install location and the project-local skills dir it links are both **runtime-specific**: Claude Code discovers `~/.claude/skills` / `<repo>/.claude/skills/`, OpenAI Codex CLI discovers `~/.agents/skills` / `<repo>/.agents/skills/` (a repo's required `.ki-config.toml` `[ki-repo] supported_runtimes` declares its support surface). The rest of this file uses `.claude/skills/` as the running example — read it as "the declared runtime's skills dir." You bootstrap a repo into governance along **two complementary axes**:

1. **EDUCATE — mechanical self-sufficiency (the chain).** Bring a target repo under governance so it self-governs with `./.ki-meta/bin/ki-audit` and **zero skills installed** — and with no `package.json` of its own, ever touched: for every skill in the resolved set, vendor its checker copies and HELP snapshot under `.ki-meta/checkers/`, plus a self-contained target-local EDUCATE payload under `.ki-meta/educators/`, and write the four `.ki-meta/bin/{ki-audit, ki-conform, ki-educate, ki-help}` wrappers over the `.ki-meta/bin/aggregate.ts` runner. Bootstrap retains a local whole-set coordinator and its source catalogue under `.ki-meta/bootstrap/`. Bootstrap writes **no** `package.json` keys — those are `ki-engineering`'s to wire, as sugar over these bins. The public bootstrap route is the explicit way to acquire a first or newer revision; ordinary later EDUCATE runs use only the durable local material. See **Mode EDUCATE** and [ADR-KI-HARNESS-006](../../../docs/decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md).
2. **Runtime payloads — in-session skill loading.** Mirror the repo's declared coverage under each selected runtime's skill directory so exactly the right skill _descriptions_ load when a human works in that repo, and no others elsewhere. Ordinary repositories receive generated copies; a harness links its own canonical sources. This keeps the standing skill-description cost out of unrelated sessions (the tokenomics reason skills are project-local, not global). See **Mode AUDIT / CONFORM**.

The two are distinct: vendored **copies** run the mechanical checks anywhere (CI, a bare clone); generated runtime payloads are only about which skills the agent sees in-session. EDUCATE installs both surfaces.

**The linking model — at a glance:**

- A repo's `.claude/skills/` should mirror its **declared coverage** — the `[ki-<skill>]` tables in its `.ki-config.toml`, its own foundations `[ki-repo]` + `[ki-authoring]` included. Every repo declares its foundations explicitly; there is no injected baseline (a greenfield repo enters via `ki-repo`'s educate, `--seed ki-repo`, to scaffold the config). The keystone itself is never linked project-local — it is global.
- A repo's `.claude/agents/` should mirror `agents/governance/*.md` **only when** it carries the bare `[ki-agents]` table — no baseline, since no agent is always-on.
- Skills are **gitignored and regenerated** — ordinary repositories receive regular-file copies, while a harness's own runtime locations link to its canonical source skills. The only committed artifact is the `.gitignore` lines, never generated payloads.
- The **harness** (`ki-agentic-harness`) copies only its own declared coverage, same as any other repo — a structural skill like `ki-mcp` or `ki-website` is exercised against a repo of its type, not loaded in the harness itself, so the harness copies what governs it, not the whole fleet.

The repository engine is [`scripts/internal/repo-bootstrap/repo-bootstrap.ts`](scripts/internal/repo-bootstrap/repo-bootstrap.ts); the normal runtime publisher is [`scripts/internal/repo-bootstrap/publish-project-skills.ts`](scripts/internal/repo-bootstrap/publish-project-skills.ts). The publisher shares its transaction and `.gitignore` helpers through [`scripts/internal/repo-bootstrap/project-skill-publisher.ts`](scripts/internal/repo-bootstrap/project-skill-publisher.ts) and [`scripts/internal/repo-bootstrap/runtime-paths.ts`](scripts/internal/repo-bootstrap/runtime-paths.ts). User installation is separately implemented under [`scripts/internal/user-install/`](scripts/internal/user-install/). The quotable invariant is [the standard](references/standards.md); the checkable criteria are [the rubric](references/rubric.md). This skill **composes on** `ki-repo`, which owns the config's file-level contract and foundation scaffold: bootstrap embeds no TOML template and never edits the file directly, but EDUCATE may invoke `ki-repo`'s scaffold-only leg by subprocess before re-reading the declarations.

## Operating modes

Invoked as `help` / `-h` / `?`, it explains itself and stops — the generated HELP block (name, purpose, invocation, modes, off-ramps), taking no action. With no mode it does the same, then, in an interactive session only, offers the mode choice via `AskUserQuestion`, prompting for any `argument-hint` target the chosen mode shows.

### Mode EDUCATE — bring a repo under governance (self-sufficiency chain)

The mechanical half of EDUCATE, and the start of the bootstrap chain. Run it against a target repo — locally, or straight from the remote source with nothing installed:

```bash
bun scripts/internal/repo-bootstrap/repo-bootstrap.ts <target-repo> [--ref <ref>] [--dry-run] [--verbose]
# remote (zero-install — cd into the repo, then curl | sh; the public route fetches the tarball and runs the engine, defaulting to cwd@main):
# curl -fsSL https://knowledgeislands.info/harness/bootstrap | sh
# advanced: … | sh -s -- <target> --ref <sha>   (args ripple through)   ·   bun already installed: bunx github:knowledgeislands/ki-agentic-harness#<sha> <target> --ref <sha>
```

1. **Resolve and validate the initial set.** Take the root owner from every exact or dotted `[ki-<skill>]` table declared in the target's `.ki-config.toml`, plus every explicit `--seed`. Bare and simply quoted TOML table keys are equivalent; header-looking text inside multiline strings is ignored; noncanonical ki-like roots are retained so they FAIL rather than disappear. Repeated roots collapse to one. Every root and `ki-depends-on:` requirement must exist in the ref-specific harness skill index, and each selected skill's dependency must be an explicit target declaration; an unresolvable or missing declaration is a sorted FAIL and EDUCATE stops before touching `.ki-meta/`. Coverage is purely what the config declares or the caller explicitly seeds — no injected baseline. `ki-bootstrap` itself is existence-valid but never vendored because it is the global chain-starter.
2. **Let the config owner establish the foundations when requested.** When `ki-repo` is in that initial resolved set — because it was declared or explicitly seeded — invoke its `scripts/educate.ts <target> --scaffold-config-only` leg by subprocess, forwarding `--dry-run`. That owner creates a missing config with the canonical `[ki-repo]` defaults plus a bare `[ki-authoring]`, or appends only a missing exact root marker to a partial config. Bootstrap holds no TOML template and writes no config byte itself. Re-resolve and revalidate after the owner leg so the same run vendors the declarations it just established. With no config and no seed, the initial set remains empty and bootstrap does not inject foundations.
3. **Satisfy the self-sufficiency contract.** For each skill in the final set, vendor **copies** (SCRIPT-7 — copies, not symlinks, so they run standalone) of its declared checker unit (`audit-*.ts`/`lint-*.ts` and any `conform-*.ts`) into `.ki-meta/checkers/<skill>/scripts/`, preserving the checker's own internal relative layout, with any shared-module payload under `scripts/vendored/<provider>/`; materialise its **HELP snapshot** to `.ki-meta/checkers/<skill>/help.md`; and generate a self-contained target-local educator at `.ki-meta/educators/<skill>/{educate.ts,educator.ts,skill/}`. The destination stays **keyed by bare skill name only, flat across source clusters** ([ADR-KI-HARNESS-006](../../../docs/decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md)) — then retain the local coordinator and selected source catalogue below `.ki-meta/bootstrap/`, and write the `.ki-meta/bin/aggregate.ts` runner (which discovers checker copies on the filesystem and fans audit/conform out over them — no `package.json` read) and the four executable `.ki-meta/bin/{ki-audit, ki-conform, ki-educate, ki-help}` wrappers over it. `ki-educate` with no skill refreshes the whole current governed set only from the retained local catalogue; `ki-educate <skill>` refreshes only that local skill's checker and educator payload. To acquire a first or newer harness revision, run `https://knowledgeislands.info/harness/bootstrap` explicitly. It writes **no** `package.json` — the `ki:*` convenience keys are `ki-engineering`'s to wire, as sugar over these bins. **Harness-shaped targets only** (the set includes `ki-harness`): additionally vendor the two cross-skill scripts — `skill-graph.ts` and `skill-help.ts` — into `.ki-meta/bin/`, manifest-hashed like every other vendored file. These operate on the whole `skills/` tree (validate/render the `ki-depends-on:` graph and render HELP), so they are engine-level, not per-skill `ki-vendors:` units; a non-harness repo has no `skills/` tree and never receives them (ADR-KI-HARNESS-008).
4. **Publish runtime payloads.** After vendoring, a consumer receives each declared complete skill as a copy in every selected runtime discovery directory and its generated `.gitignore` line. A harness receives links from those runtime entries to its own canonical source skills. `.ki-meta/` never carries runtime skills.
5. **Result:** after EDUCATE the target governs itself with the four `./.ki-meta/bin/` wrappers and has project-local runtime payloads — no `package.json` of its own required. Re-running the chain is idempotent, and is the single way to bring a target up to date; `--ref` moves it to a newer harness ref.

Successful EDUCATE runs report only the target, resolved scope count, and completion summary. Pass `--verbose` when you need the per-file vendor, generated runner, and runtime-payload trace. `--dry-run` always reports its planned file actions and finishes without writing.

**Per-skill educators.** A governance skill that needs the common target-local EDUCATE behaviour declares `ki-bootstrap:educator` and runs only its local `scripts/vendored/ki-bootstrap/educator.ts` copy. That module writes the selected skill's local checker and educator payloads; it never reboots the whole repository or reaches another skill's source. `ki-repo` additionally owns the internal scaffold-only leg the engine calls to establish its required config markers without recursion.

### Mode AUDIT — check a repo's project-local skills and agents

1. **Run the structured checker.** `bun scripts/audit.ts [path]` from this skill directory (or `bun run ki:bootstrap:audit` in the harness) evaluates the codified rubric. With no reporter it emits canonical JSONL; add `--reporter=terminal` for the filtered human view. It checks runtime payloads and gitignore entries (**BOOT-1/3**), governance agent wiring (**BOOT-6/8**), the resolved checker and educator sets (**BOOT-9/12**), and direct canonical-source parity when the target carries matching sources (**BOOT-11**).
2. **Judge BOOT-4 by reading** — is the repo's declared coverage actually right? That is `ki-repo`'s coverage cascade; name it as the off-ramp rather than re-deciding it here.
3. **Apply the aggregate judgmental sweep (BOOT-10).** Run `./.ki-meta/bin/ki-audit` (or `bun run ki:audit`) and capture the mechanical output verbatim. Then apply each governed skill's judgment prompts, using its governance lead when one exists and its generated readable rubric otherwise. The mechanical response summary counts judgment items that remain unevaluated; it does not emit synthetic judgment findings.
4. **Report** by criterion. Missing, symlinked, or source-drifted runtime payloads and absent gitignore entries are WARN. Unresolvable declarations and direct source-copy drift are FAIL because they cannot be repaired safely by guessing.

### Mode CONFORM — wire a repo

The mechanical half is `scripts/conform.ts` (`bun run ki:bootstrap:conform` where wired) — it composes the steps below and finishes with the vendored-set audit, whose drift it only advises on (the repair is EDUCATE, per the drift contract). Step by step:

1. Run **AUDIT** first.
2. **Copy** the normal project-local skill set with `bun "$HOME/.claude/skills/ki-bootstrap/scripts/internal/repo-bootstrap/publish-project-skills.ts" [path]`. The publisher creates/prunes generated regular-file skills and writes matching `.gitignore` lines, creating `.gitignore` if absent. Preview with `--dry-run`.
3. **Make it reproducible:** a repo reproduces its generated copies by re-running the repository bootstrap — no `package.json` script is required, and it scaffolds none (package.json script-key wiring is `ki-engineering`'s concern).
4. **Aggregate judgmental sweep (BOOT-10).** Run `./.ki-meta/bin/ki-conform` (or `bun run ki:conform`) for the mechanical fixes, then re-apply the per-skill judgment prompts from AUDIT step 3 to confirm each skill's judged findings are resolved too — a clean mechanical pass is not sufficient on its own.
5. **Re-run AUDIT** until clean.

### Mode REFRESH — re-anchor

**Precondition:** REFRESH edits this skill's own canonical files, which exist only in `ki-agentic-harness`. Invoked from a repo where the skill is vendored, it stops here and names the harness as where to run it — or, for a pattern recurring across bases, routes it through `ki-kb`'s IMPROVE mode instead.

Canonical, on-change: this skill tracks no external spec. Re-anchor when the install model changes — the EDUCATE chain / self-sufficiency contract (the vendor layout, the aggregate runner, the `ki-depends-on:` graph shape), the coverage-table contract (`ki-repo`), the `[ki-agents]` gating convention, the skill/agent discovery locations Claude Code reads, or the ordinary-copy / harness-link publication convention. Read [the source list](references/sources.md), confirm the standard still matches the reference implementation, propose a diff, bump the dates.

## Composition

- `ki-repo` — owns the `.ki-config.toml` file-level contract, foundation scaffold, coverage cascade, and GitHub settings. This skill reads that config and may subprocess-compose `ki-repo`'s scaffold-only EDUCATE when the resolved set requests it, but it embeds no TOML template and never edits the file directly. For any question about _which_ skills a repo should declare, route to `ki-repo`.
- `ki-tokenomics` — owns the standing-cost rationale for keeping skills project-local (not global). For token-budget questions, route there.

## Notes

- **Why a keystone, not part of `ki-repo`:** the global skill is paid every turn everywhere, so it must be minimal. `repo` is heavy (GitHub settings, security, files). Splitting the bootstrap out keeps the global footprint to one tiny description; `repo` stays project-local and loads only in repos that declare or seed it.
- **Greenfield:** a repo with no `.ki-config.toml` enters through `ki-repo`'s educate — `bun scripts/internal/repo-bootstrap/repo-bootstrap.ts <target> --seed ki-repo` (or `bun skills/keystone/ki-repo/scripts/educate.ts <target>`). The owner leg writes the canonical `[ki-repo]` defaults plus bare `[ki-authoring]`; bootstrap then re-resolves and vendors both foundations and the runners in that same invocation. There is no injected baseline — bare `repo-bootstrap.ts <target>` with no config and no seed resolves to the empty set.
- **EDUCATE vs runtime publication:** EDUCATE vendors mechanical **copies** that run with nothing installed (CI, migration, a bare clone). It publishes runtime skill copies for ordinary repositories and source links for harnesses.
