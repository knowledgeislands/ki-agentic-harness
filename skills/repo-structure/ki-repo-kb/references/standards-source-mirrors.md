# Source mirror content and derived labels

This is the normative source-mirror contract referenced by the [knowledge-base standard](standards-knowledge-base.md#source-mirrors). It applies only when `[skills.ki-repo].store_roles` includes `sources`. It does not bind a base merely because an external directory exists. [DDR-KI-HARNESS-001](../../../../docs/decisions/DDR-KI-HARNESS-001-mirrors-and-source-provenance-are-separate-relationships.md) records the rationale.

## Mirrors and source provenance

A base can relate a note to a source-store file in two distinct ways. Each has its own fields, and neither implies the other.

| Relationship | Meaning | Fields |
| --- | --- | --- |
| Mirror | The note stands in for exactly one source file: what the file is and the durable facts a reader would otherwise open it for. | `mirrors`, `mirror_type`, `mirror_sha256` |
| Source provenance | The note was produced from a source, often as one of many notes derived from it, such as one day of a message export. | `source_path`, `source_sha256` |

Only `mirrors`, `mirror_type` and `mirror_sha256` make a note a mirror. A mirror carries no `source_*` fields for the file it mirrors. A derived note carries no `mirror*` fields. An acquisition adapter's own upstream provenance, such as a meeting identifier, is a third relationship; preserve it in that adapter's fields rather than turning it into either of these.

## Authored mirror contract

A mirror keeps its zone's appropriate `note_type`. Its frontmatter carries:

- `mirrors` — one file, written as the store alias followed by the store-relative POSIX path, such as `kit-legal-sources/Pillars/Matter/Correspondence/2026-01-05 Letter.pdf`. The alias is the first segment and ends in `-sources`. The path has no absolute root, empty segment, `.` or `..` segment, backslash, colon or control character, and it never names a directory or a list of files. A note with several files to cover is several mirrors, or one mirror with the others named in its body.
- `mirror_type` — one of `verbatim` (faithful transcription), `annotated` (source content followed by author additions under a horizontal rule and a single `## Notes` heading), `summarised` (a digest of the key facts) or `indexed` (verified provenance and classification only; contents remain unanalysed).
- `mirror_sha256` — exactly 64 hexadecimal characters identifying the file's content when the mirror was written. Quote numeric-looking hashes to preserve their string type.

None of these fields proves that a private source exists or is currently available.

The body states what the file is and records the durable facts a reader would otherwise open it for. Link canonical knowledge rather than duplicating private detail with no enduring use. Do not copy or Git-track the binary. Except for `indexed` mirrors, keep a minimum of 40 body words after excluding frontmatter, headings, inline Markdown links, wikilinks, link definitions, bare HTTP URLs and HTML comments. This deliberately low diagnostic threshold catches pointers; the `NOTE-4` judgment assesses actual usefulness and fidelity.

A coverage or index note that lists many source files is an ordinary note, not a mirror, and carries no mirror fields.

## Source provenance contract

A derived note may carry `source_path`, in the same `<store-alias>-sources/<store-relative path>` form, and `source_sha256`, the 64-hexadecimal-character digest of the source it was derived from. Many notes may share one `source_path`. These fields record origin only; mirror labels and `NOTE-4` ignore them.

## Derived search label schema

The pure [classifier](../scripts/internal/source-mirrors.ts) accepts parsed top-level YAML fields, body text after frontmatter and an explicit malformed-frontmatter flag. Callers reject duplicate YAML keys and unterminated, malformed or non-mapping frontmatter before classification; a last-wins parser alone is insufficient. Pass `malformed: true` for ambiguous declarations, even when one parsed value looks valid. Pass the raw YAML payload as `frontmatter` to the same pure classifier in every caller, including `NOTE-4`, so parsing differences cannot confer an extract label. The shared `ambiguousMirrorFrontmatter` check accepts plain, unquoted top-level snake_case keys and plain or quoted scalar mirror values; duplicate keys, quoted or escaped keys, merges, flow documents, indented mirror keys, aliases, anchors, tags, block scalars and scalar escape sequences are conservatively unknown. Ordinary nested metadata may remain; this is a mirror eligibility grammar, not a general YAML parser. The [synthetic fixtures](../scripts/internal/source-mirrors.test.ts) and [native audit fixtures](../scripts/rubric/items/index.test.ts) are the executable examples. Search consumers may vendor the canonical helper with a byte-drift check; there is no public package requirement.

`mirror_content` is derived response metadata, never required authored frontmatter:

- **null** — no mirror field is present in a well-formed note; it is an ordinary or derived note.
- **extract** — all three mirror fields pass the declaration checks, `mirror_type` is not `indexed`, and the body meets the minimum word count.
- **pointer** — all three mirror fields pass, but the mirror is `indexed` or its body is below the minimum word count.
- **unknown** — YAML cannot be assessed, or a mirror field is present but the path, type or checksum declaration is missing, wrongly typed or invalid.

Responses also carry `mirrors`, `mirror_type` and `mirror_sha256` as declared values or null. Invalid declarations remain `unknown`; consumers must not present them as a verified source location. The classifier exposes `word_count` and `issues` for diagnostics. The label cannot attest source existence, authorisation, checksum match or freshness, substantive accuracy, or complete coverage of unlabelled legacy mirrors. Owner review remains necessary. A valid-looking forged checksum passes syntax only.

Labels operate only over authorised Markdown, after zone and access checks and before snippets or engine expansion. No label reader opens, hashes, follows, crawls or resolves a source store. A selected-checkout audit must skip symlinked note files and directories. `NOTE-4` warns on declared mirrors with invalid declarations or, except for `indexed` mirrors, insufficient text, and reports not applicable where the sources role is absent; it never fails merely for mirror quality.

## Per-base enrichment work

The receiving base owns a separate enrichment record: inventory the declared source store against its mirrors under that base's access authority; record controlled groups and missing mirrors; add or extend extracts and checksums; verify freshness where authorised; and report remaining unknown or pointer coverage. No shared harness audit or search-label delivery grants access to that store or writes these records. Legacy notes lacking recognized metadata remain unclassified until their owner reconciles them.
