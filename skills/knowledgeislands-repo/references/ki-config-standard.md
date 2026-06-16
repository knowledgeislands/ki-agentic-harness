# The `.ki-config.toml` contract

The cross-cutting contract for the shared **`.ki-config.toml`** file every Knowledge Islands repo carries. It is owned by
`knowledgeislands-repo` because **a Knowledge Islands repo is defined by carrying this file** — its presence is the compliance marker, and
`-repo` governs the repo's compliance. Every other standard-holding skill reads its own table within it. (The TOML _formatting_ style — key
case, quoting, comments — is the `knowledgeislands-authoring` skill's; see its
[toml-config.md](../../knowledgeislands-authoring/references/toml-config.md). This doc governs the _contract_: the file's meaning and the
cross-skill protocol.)

## Contents

- [The shared file & the compliance marker](#the-shared-file--the-compliance-marker)
- [Table per skill](#table-per-skill)
- [Validate your own table](#validate-your-own-table)
- [Declared divergences](#declared-divergences)
- [Overridable vs fixed](#overridable-vs-fixed)
- [Scaffolding & ownership](#scaffolding--ownership)

## The shared file & the compliance marker

A repo declares its configuration in **one** `.ki-config.toml` at its root — not one file per concern. It is shared: several skills may read
it, each from its own section. This keeps a repo's declared config in a single reviewable place and lets a skill discover what it needs
without a bespoke file.

Its **presence is the marker of a Knowledge Islands–compliant repo**. A repo that carries `.ki-config.toml` has opted into the house
standards, and the standard-holding skills — `knowledgeislands-repo`, `knowledgeislands-mcp`, `knowledgeislands-skills`,
`knowledgeislands-kb` — are what hold it to them, each reading its own table where it needs declared config. Onboarding a repo (adding the
file) is the act of making it compliant; `knowledgeislands-repo` requires it as a Layer-1 root file and is the skill that audits it.

## Table per skill

Each skill that needs declared config owns **exactly one** TOML table, named for the skill (a skill may nest sub-tables under it, e.g.
`[<skill>.checks]`):

```toml
[knowledgeislands-repo]
visibility = "public"

[knowledgeislands-repo.checks]
branch-protection = true
```

- The table name **matches the skill's `name`** exactly, so the owner is unambiguous and the file reads as a map of skill → its settings.
- A skill reads **only its own table** and never reaches into another skill's — the table boundary is the ownership boundary. If two skills
  need the same fact, it still lives under whichever skill owns it, and the other resolves it from there.

## Validate your own table

A skill **validates its own table and only its own**: it warns on a key (or sub-table entry) under its table that it doesn't recognise — a
typo or a stale option should surface, not silently do nothing — and advises dropping one that merely restates a default. It leaves every
other skill's table untouched, even keys it can't interpret. **Validate down, ignore across.** (`knowledgeislands-repo` is the reference: it
warns on an unknown `[…checks]` entry, notes a redundant one, and never inspects another skill's table.)

## Declared divergences

Where a skill's standard allows a repo to diverge from a default, record that **in the skill's own table** so it reads as a declared choice,
not drift. The _shape_ is the owning skill's business — `knowledgeislands-repo`, for instance, carries a `[…checks]` sub-table of booleans
where any check set against its org default is the divergence:

```toml
[knowledgeislands-repo.checks]
wiki = false   # this repo keeps a Wiki — deliberate, not drift
```

The owning skill's auditor then reports the divergence as an acknowledged note rather than a failure. Adopt the same principle for any skill
that needs declared, reviewable per-repo overrides: the divergence lives under that skill's table, is commented with its _why_, and is
validated by that skill (an unrecognised key warns).

## Overridable vs fixed

A skill's standard fixes its model; a base or repo may declare **only** the keys that skill documents as overridable, and nothing else is a
config knob. Two kinds of declaration are overridable: **data** the standard reads to fit a target (e.g. `knowledgeislands-kb`'s zone
aliases, `required_frontmatter`, and `preflight`), and **divergences** from a default (the `[…checks]` booleans above). Everything not so
documented is **fixed** by the standard — a target does not redefine it in config. This split is what keeps target-specificity
declared-and-auditable rather than forked into a coupled skill: where a target differs, it differs through a documented key, not a bespoke
`<target>-*` extension skill.

So the option set is **authored, not implicit**: each skill emits its own overridable keys — commented, with defaults — via an `--init` the
skill owns (`knowledgeislands-repo`, `-kb`, and `-streams` already do), so an author sees exactly what may be set, and an undocumented key
warns (validate-down). A target-specific need that no documented key can express is a signal to **generalise it into the standard** (a
REFRESH candidate), not to invent an ad-hoc key or fork a skill.

## Scaffolding & ownership

The **keys** inside a table belong to the skill that owns it — that skill documents and scaffolds them (e.g. via an `--init` that appends
its default keys). This contract owns the **file-level shape** every table follows: one shared `.ki-config.toml`, one table per skill named
for the skill, read-only across table boundaries, each skill validating its own. For a given skill's keys, see that skill.
