# Decision Records standard

## Contents

- [Naming convention](#naming-convention)
- [Prefix table](#prefix-table)
- [Placement](#placement)
- [Self-contained collection](#self-contained-collection)
- [Frontmatter](#frontmatter)
- [Sections](#sections)
- [Templates](#templates)
- [Collection root](#collection-root)
- [Index](#index)
- [Dependency graph](#dependency-graph)
- [Writing guidance](#writing-guidance)

The normative standard behind [the generated rubric](rubric.md). Grounded in Michael Nygard's original 2011 ADR format (see [the source list](sources.md)) with house additions: decision-specific metadata, type-specific prefixes, and `## References`. Unified from the former `ki-adrs` and `ki-kdrs` instruments. A DR is a concise, self-contained **living present-state record**: it states the decision as it stands now and is edited in place, without historical narrative, a supersession chain, or changelog (see [Writing guidance](#writing-guidance)). Mode REFRESH re-reads the sources and proposes diffs here.

## Naming convention

```text
<ID>-slugify(<title>).md
```

- The filename is **`<ID>-<title-slug>.md`**: the canonical uppercase ID, a dash, then the title lowercased with every run of non-ASCII-alphanumeric characters replaced by one `-`, and leading or trailing dashes removed.
- The H1 is **`<ID>: <title>`**. **`<PREFIX>`** is one of nine type-specific prefixes (see the prefix table below); it begins the ID and encodes `decision_type` at the filename level.
- **`<SCOPE>`** is the repository's `[skills.ki-repo].repo_code` (e.g. `KI-ARCADIA`), one or more uppercase alphanumeric segments separated by `-`. There is no separate Decision Record scope setting: `.ki.toml` never declares `[skills.ki-decision-records].scope`, and AUDIT fails one that does (ROOT-2). A scope segment matches `[A-Z0-9]*[A-Z][A-Z0-9]*`: it may lead with a digit, so a repository whose `repo_code` does (e.g. `5GE-P2`) uses that code unchanged as its scope, and it must carry at least one letter, because a digit-only segment could not be told apart from `NNN`. A sub-domain segment may follow the code for sub-domain decisions (e.g. `KI-HARNESS-AGENTS`). Every record's scope equals `repo_code` or begins with `<repo_code>-`, with no exception: a decision owned by another repository is cited by its canonical URL, never copied under that repository's scope, and AUDIT fails any other scope, naming the expected one (ROOT-3).
- **`NNN`** is a zero-padded decimal serial (≥ 3 digits). Serials in each prefix+scope series **start at `001` and are contiguous** — no gaps, whatever the cause. Decision Records are living documents: refine, merge or supersede an existing record in place so every key decision stays visible, rather than adding a record beside it, which keeps removals rare. Numbering is **per prefix within the `<SCOPE>` namespace** — `GDR-KI-ARCADIA-001` and `SDR-KI-ARCADIA-001` may share the integer `001` because they carry different prefixes, and each prefix runs its own unbroken `001…NNN` sequence. The full DR code (prefix + scope + serial) is the globally unique identifier. A pending DR not yet assigned a real serial uses the literal string `XXX` in place of `NNN` (e.g. `GDR-KI-ARCADIA-XXX-pending-decision.md`); it is renamed to the next available per-prefix serial once it is numbered. When a record really is **removed** — merged into another or retired — or **reclassified** to a different prefix (e.g. an ADR that is really a governance decision becomes a GDR, taking the next serial in its new series), its old serial is **not** left vacant: the remaining records in the old series renumber to close the gap, and every citation of the moved and shifted codes — index, `decision_depends_on`, prose, roadmap records and peer repositories — is swept in the same change. Git history and commit messages that mention the old codes are accepted staleness. A shared decision declares `shared_record: true` in every approved copy and uses the canonical projection defined under Frontmatter for identity comparison. It retains its canonical ID, so it is shared only between collections whose `repo_code` that scope satisfies. Where the receiving collection has no ordinary record in that prefix+scope, the mirror is excluded from local serial-continuity calculation; where it does, the mirror stays in the series. This narrow exception never applies to an ordinary local record. Examples: `GDR-KI-ARCADIA-001-adopting-decision-records.md`, `SDR-KI-ARCADIA-001-knowledge-islands-strategy.md`, `ADR-KI-HARNESS-001-repository-structure-the-five-part-bundle.md`.

## Prefix table

Each type maps to a fixed prefix and a house reference URL. Required decision-specific metadata duplicates the canonical values encoded by the H1 prefix (FAIL check). The URL is identifier metadata, not evidence that a public type page is available or authoritative. Whether that prefix actually fits the decision is a human judgement, not a value the checker can derive.

| Prefix | `decision_type` | `decision_type_url` | Covers |
| --- | --- | --- | --- |
| `SDR-` | `strategy` | `.../sdr` | Direction, goals, positioning, scope |
| `PDR-` | `product` | `.../pdr` | Purpose, outputs, scope of the repo or island |
| `ADR-` | `architecture` | `.../adr` | Structure, topology, component relationships |
| `DDR-` | `data` | `.../ddr` | Schemas, data governance, storage choices |
| `XDR-` | `security` | `.../xdr` | Security posture, trust boundaries, access |
| `ODR-` | `operations` | `.../odr` | Operational procedures, deployment, maintenance |
| `GDR-` | `governance` | `.../gdr` | Processes, authority, change mechanisms |
| `RDR-` | `research` | `.../rdr` | Methodology choices, investigation frameworks |
| `KDR-` | `knowledge` | `.../kdr` | Taxonomy, naming, classification, vocabularies |

Each `decision_type_url` expands from `https://knowledgeislands.info/specifications/decision-records/{prefix-lowercase}`. These house reference URLs are not a claim that public type pages are currently published; publishing or verifying them is an external-site owner concern. `ADR-` aligns with the established ADR ecosystem (Nygard, adr.github.io). `KDR-` reclaims the former Knowledge Decision Records prefix with a precise `knowledge` scope.

## Placement

| Repo type          | Default decisions directory   | Index file     | Frontmatter          |
| ------------------ | ----------------------------- | -------------- | -------------------- |
| `repo_type = "kb"` | `Admin/Governance/Decisions/` | `Decisions.md` | Required (see below) |
| code / unset       | `docs/decisions/`             | `README.md`    | Required (see below) |

The repo type is declared in `.ki.toml` under `[skills.ki-decision-records]` (or inferred from `[skills.ki-repo-kb]` presence). The checker auto-detects the decisions directory (`docs/decisions/` then `Admin/Governance/Decisions/`) and picks the matching index file by mode; pass an explicit path to override.

## Self-contained collection

The decisions directory holds Decision Records and their index, and nothing else: no `references/` or other subdirectory, and no supporting file of any kind. A subdirectory or a non-record file in the collection is a finding (mechanical - FILENAME-4).

A record MUST read completely without following any link. It states the decision as it now stands in its own words, rather than pointing at the material that informed it. Briefs, reviews, reports, surveys and evidence tables are working material: a design loop keeps them beside the Project or Initiative it serves and deletes them once their outcome is consolidated, so a record never depends on them. Skills, guides, workflows, standards and notes the decision grounds in are named in the body, never linked.

A record links only to sibling Decision Records and to external URLs. A relative link or wikilink from a record to any other file - a supporting file, a note, a guide or a work record - is a finding (mechanical - BODY-11). Cross-repository provenance uses a canonical source reference: an external URL to the source at a known revision, such as a pinned GitHub blob URL.

## Frontmatter

Every Decision Record begins with YAML frontmatter. `id`, `title`, `date`, `status`, `decision_type`, and `decision_type_url` are required in every repository. Generic `type` and `type_url` are reserved for generic note metadata and are prohibited here. This keeps the decision classification explicit without creating a competing generic type taxonomy.

**Universal template:**

```yaml
---
id: GDR-<SCOPE>-NNN
title: '<Title>'
date: YYYY-MM-DD
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---
```

- `id` exactly repeats the H1 identifier and its canonical prefix/scope/serial value.
- `title` exactly repeats the H1 title after `:`.
- `date` uses `YYYY-MM-DD` and records the decision's current as-of date.
- `status` tracks the note's maintenance state (for example `draft`, `current`, `outdated`, or `archive`) — never a decision lifecycle.
- `decision_type` must exactly match the canonical value encoded by the filename prefix in the table above.
- `decision_type_url` exactly matches the house reference URL in the table above.
- Choose the prefix by what the decision is actually about. If the filename and metadata disagree, a human resolves whether the canonical ID or the metadata is wrong; CONFORM never chooses by overwriting either side.
- CONFORM may make only source-preserving scalar metadata repairs on a parseable, regular, non-symlink record whose filename is already canonical: remove generic `type`; rename a canonical legacy `type_url` when `decision_type_url` is absent; and add missing canonical decision-type fields derived from the existing prefix. It refuses malformed, ambiguous, conflicting, or non-canonical sources.
- `decision_depends_on` is an optional YAML list of full DR codes that this decision logically depends on (e.g. `["GDR-KI-ARCADIA-001"]`). Cross-scope (cross-repo) references are permitted. Those edges form one directed acyclic graph across the whole collection, and body prose cites only backward, both under [Dependency graph](#dependency-graph). Omit the field when there are no dependencies.
- `shared_record: true` is an optional, narrow marker for one decision mirrored across approved repositories. Shared identity is the deterministic projection of decision-owned frontmatter in this fixed order — `id`, `title`, `date`, `status`, `decision_type`, `decision_type_url`, optional `decision_depends_on`, `shared_record` — followed by the complete body with LF line endings. `note_type` is the sole excluded container field; no category of repository-local metadata is implicitly excluded, and every unknown frontmatter field fails closed. The record keeps its canonical ID, which still meets the scope rule in every copy. It is excluded from a receiving collection’s serial series only when that prefix+scope has no ordinary local records; otherwise it remains part of the local sequence. Use the marker in every copy, including the canonical source copy. It does not make ordinary local records shareable or relax any other metadata, body, index, or identity rule.

## Sections

Every DR has exactly these sections, in this order:

### 1. Title (heading)

```markdown
# <PREFIX>-<SCOPE>-NNN: <Short noun phrase>
```

The title is a short noun phrase — not a question, not a full sentence. The heading reproduces the full DR ID so a reader can identify the record from the heading alone.

### 2. Frontmatter (before the heading)

The required frontmatter carries the ID, title, date, maintenance status, and decision-specific classification. There is deliberately **no bold `Date`, `Status`, or `Mutability` line**: a DR is kept true by **editing it in place**. A change of direction edits the live record; historical wording is removed so the record reads as if written today.

### 3. `## Context`

The forces at play — structural, operational, relational, temporal — that made a decision necessary. Value-neutral: state facts, not advocacy. Avoid "we need to" or "the problem is"; prefer "the island currently..." or "two approaches exist...". One to three paragraphs.

### 4. `## Decision`

The team's response to those forces. One paragraph or a short bulleted list. Active voice: "This island adopts..." or "We will...". Not rationale — just what was decided. Rationale belongs in Context and Consequences.

### 5. `## Consequences`

The resulting context after the decision is applied — positive outcomes, trade-offs, and neutral follow-on constraints. Consequences from one DR frequently become the Context of the next.

### 6. `## References` (optional)

```markdown
## References

- [DR-CODE](DR-CODE-title-slug.md) -- the foundational decision this record builds on.
```

The `## References` section is a list of **followable links only**, of exactly two kinds: **sibling DRs in the same decisions set** (backward in the reading-order layering — the foundations a decision builds on) and **external URLs** (a tool's homepage, a spec, a source). It is not a place for prose or for named internal artefacts. Skills, guides, feature definitions, workflows, KB notes, and the standards a decision grounds in are **named in the body**, where the reader meets them — never listed here — so the record stays self-contained and nothing depends on chasing a link that rots. External links are supplementary: the record must read completely without following them. Omit the section entirely when a record has no such links.

## Templates

### Universal template

```markdown
---
id: GDR-<SCOPE>-NNN
title: '<Title>'
date: YYYY-MM-DD
status: current
decision_type: governance
decision_type_url: https://knowledgeislands.info/specifications/decision-records/gdr
---

# GDR-<SCOPE>-NNN: <Title>

## Context

<The forces at play. Value-neutral. One to three paragraphs.>

## Decision

<What was decided. Active voice. One paragraph or short list.>

## Consequences

<Positive outcomes, trade-offs, and follow-on constraints.>

## References

- [Source title](https://example.org/source) -- why cited.
```

## Collection root

Every collection begins by adopting the instrument itself: **`GDR-<SCOPE>-001: Adopting Decision Records`** is the first indexed record. A compound title that contains the adoption — e.g. "Adopt decision records and documentation instruments" — satisfies the rule, for a collection whose founding decision covers more than the instrument:

```markdown
1. [GDR-<SCOPE>-001](GDR-<SCOPE>-001-adopting-decision-records.md) — adopting Decision Records.
```

The rule is unconditional: an established collection whose first record does not adopt the instrument is non-compliant, and is brought into line by retitling (or writing) its root record — not by renumbering or repositioning the rest.

## Index

The index file — `Decisions.md` in a KB, `README.md` in a code repo (GitHub renders it as the folder landing) — must carry an **ordered list**, one item per DR, each item linking the record by its ID. A list, not a table: a table earns its overhead only for tabular data or comparison across columns, and an index is neither — it is a single ordered sequence, so a list carries it with less markup. Order the items by **reveal order** — a curated **build narrative**: the records read as if written from scratch, before anything was created, each building on the ones before it, so a concept is introduced at its record and later records may name it explicitly. Weave the sub-scopes into this one sequence where they belong rather than grouping them apart. The order is authorial — a record's dependence on earlier ones is often stated in prose, not only in the `decision_depends_on` field, so the sequence is not mechanically derived. Two constraints hold: roots precede dependents across the whole set (judgment — INDEX-6), and **within any one prefix the serials ascend in reveal order** — a `PREFIX-NNN` never appears before a lower-numbered `PREFIX-MMM`. If the build narrative wants a record earlier than its serial allows, that is a drafting issue fixed by renumbering the affected records and sweeping their citations, not by placing it out of sequence (mechanical — INDEX-8):

```markdown
1. [GDR-ARCADIA-001](GDR-ARCADIA-001-adopting-decision-records.md) — adopting Decision Records (the format these records follow).
2. [GDR-ARCADIA-002](GDR-ARCADIA-002-next-decision.md) — the next decision in the build sequence.
```

Each item links the record by its ID and gives a short gloss of what it decides. Per-record dates and maintenance status live in each record's frontmatter, not in the index. There is no decision lifecycle marker — records are living and present-state.

CONFORM may append a missing entry or restore a link target only for a recognised, regular, non-symlink record whose canonical filename is deterministically known. It preserves existing entry order, numbering markers, and unrelated index prose; stale links, duplicates, ordering, unordered links, and entries for non-canonical records remain human review.

## Dependency graph

`decision_depends_on` states which records a decision rests on. Taken together those edges form one directed graph over the whole collection, and it MUST be acyclic. This is a property of the collection rather than of any one record, so it is checked across every prefix at once: the ascending-serial rule constrains order only within a single prefix, and in a mature collection most dependency edges cross prefixes, where nothing else constrains them at all.

**Every target in a scope this collection owns must exist.** A dependency on a record the collection does not hold is either a typo or a citation of something renumbered or removed, and either way it is a dead end for the reader who follows it. Cross-scope (cross-repo) targets are permitted and are not resolved here, because the collection holding them is not the collection being checked (mechanical — DEPENDS-1).

**No record may depend on itself, directly or through a chain.** A cycle asserts that each record in it must be read before the others, which no reading order satisfies. It usually means one edge is not a dependency at all but a cross-reference: two records share a subject, so each names the other, and only one of them actually rests on the other. Fix it by dropping the weaker edge, or — where the two genuinely cannot be reconsidered independently — by merging them into the one record that owns the concern (mechanical — DEPENDS-2).

**A dependency appears before its dependent in the index.** Reveal order exists so that reading top to bottom never asks for a decision on trust, and an edge pointing back up the list contradicts that. The usual fix is to move the dependent later; where the edge itself is wrong, the field changes instead (mechanical — DEPENDS-3).

**Body prose cites only backward.** A record names a lower-numbered record of its own type, never a higher-numbered one. The declared edges are a reader's map; the prose is the argument, and an argument that points at a decision taken later is one a future author has to come back and edit every time something downstream lands — which is how a record acquires the running commentary a living present-state record is supposed to be free of. Where a later record extends, narrows or settles something, the later record says so, because it is the one that knows (mechanical — DEPENDS-4).

Reclassifying a record — changing its prefix because it turned out to be about product rather than architecture, say — moves every edge it carries from inside one prefix to across two, so that is the moment the graph most needs rechecking. Renumbering a series moves the field's codes along with every other citation of the shifted records, in the same change.

## Writing guidance

- **Length**: one to two pages (roughly 200-500 words of body). A DR is a decision record, not a design document.
- **Voice**: active, present tense. "This island adopts X" not "X was adopted".
- **Scope**: one decision per DR. If a decision has multiple independently-reconsidered parts, split them.
- **Edit in place**: a DR is a living record — clarifications, realignments, and changes of direction all **edit the existing record** so it always reads as written today. Before authoring a new record, locate the record that owns the concern; refine or change that record unless the proposed decision is genuinely independent and has standalone durable value. There is no supersession chain, changelog, or historical account; obsolete wording simply goes. A significant change of direction is worth flagging to the human before applying, but it still lands as an in-place edit.
- **What is, not what was**: a record states the consolidated current decision. It carries no history of how the decision was reached or what it replaced, and no narrative of rejected alternatives or options considered; where a constraint matters, state it as part of the present Context. Sections titled for history, changelog, supersession, alternatives or options considered are a finding (mechanical - BODY-12); prose that narrates them is a judgment finding (BODY-10).
- **No roadmap or TODO inside a DR**: a record states the decision as it currently stands. Forward-looking, still-to-do, or "revisit later" work is lifted to the repo's ROADMAP (code repo) or a stream (KB) — never narrated in the record as an "open roadmap item", "parked", or "not yet started".
- **State the decision, not the enforcement detail**: a DR records what was decided and names the concept or standard that carries it — never the volatile identifiers the enforcing skill owns. Do not cite rubric or checker criterion IDs (a `SHAPE-N`, `SCRIPT-N`, `MEM-N` tag) or a standard's section numbers (`§4`): the enforcing skill renumbers them without the decision changing, silently staling the record. Say "the skills rubric enforces this" or "the ki-tokenomics standard covers model-tier selection", and let the skill own the specifics.
- **Chaining**: the Consequences of one DR become the Context of the next. Write each as if handing off to a future author.
- **Language**: follow the island's language convention (British English for KI islands).
- **Prefix choice**: if you are uncertain which `decision_type` fits, prefer the broader category. A governance DR is about how the island is run; an architecture DR is about how it is structured.
