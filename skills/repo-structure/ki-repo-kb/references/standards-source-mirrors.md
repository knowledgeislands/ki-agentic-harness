# Source mirror content and derived labels

This is the normative source-mirror contract referenced by the [knowledge-base standard](standards-knowledge-base.md#source-mirrors). It applies only when `[skills.ki-repo].store_roles` includes `sources`. It does not bind a base merely because an external directory exists.

## Authored mirror contract

A mirror keeps its zone's appropriate `note_type`; `source_path` identifies the mirror relationship. Frontmatter carries `source_path`, a non-empty store-relative POSIX path with no absolute path, empty segment, `.` or `..` segment, backslash, colon or control character, and `source_sha256`, a string of exactly 64 hexadecimal characters. Quote numeric-looking hashes to preserve their string type. Neither field proves that a private source exists or is currently available.

The body states what the binary is and records the durable facts a reader would otherwise open it for. Link to canonical knowledge rather than duplicating private detail with no enduring use. Do not copy or Git-track the binary. Keep a minimum of 40 body words after excluding frontmatter, headings, inline Markdown links, wikilinks, link definitions, bare HTTP URLs and HTML comments. This deliberately low diagnostic threshold catches pointers; the `NOTE-4` judgment assesses actual usefulness and fidelity.

An acquisition adapter's upstream "source note" is a different relationship. Preserve that adapter's provenance rather than inventing a binary mirror from its name.

## Derived search label schema

The pure [classifier](../scripts/internal/source-mirrors.ts) accepts parsed top-level YAML fields, body text after frontmatter and an explicit malformed-frontmatter flag. Callers reject duplicate YAML keys and unterminated, malformed or non-mapping frontmatter before classification; a last-wins parser alone is insufficient. Pass `malformed: true` for ambiguous provenance, even when one parsed value looks valid. Pass the raw YAML payload as `frontmatter` to the same pure classifier in every caller, including `NOTE-4`, so parsing differences cannot confer an extract label. The shared `ambiguousMirrorFrontmatter` check accepts plain, unquoted top-level snake_case keys and plain or quoted scalar provenance values; duplicate keys, quoted or escaped keys, merges, flow documents, indented provenance, aliases, anchors, tags, multiline provenance and scalar escape sequences are conservatively unknown. Ordinary nested metadata may remain; this is a provenance eligibility grammar, not a general YAML parser. The [synthetic fixtures](../scripts/internal/source-mirrors.test.ts) and [native audit fixtures](../scripts/rubric/items/index.test.ts) are the executable examples. Search consumers may vendor the canonical helper with a byte-drift check; there is no public package requirement.

`mirror_content` is derived response metadata, never required authored frontmatter:

- **null** — neither recognized provenance key is present in a well-formed note; it is an ordinary note.
- **extract** — both recognized fields pass the declaration checks and the body meets the minimum word count.
- **pointer** — both recognized fields pass, but the body is below the minimum word count.
- **unknown** — YAML cannot be assessed, or a recognized provenance key is present but the path or checksum declaration is missing, wrongly typed or invalid.

Responses also carry `source_path` and `source_sha256` as declared strings or null. Invalid declarations remain `unknown`; consumers must not present them as a verified source location. The classifier exposes `word_count` and `issues` for diagnostics. The label cannot attest source existence, authorisation, checksum match or freshness, substantive accuracy, or complete coverage of unlabelled legacy mirrors. Owner review remains necessary. A valid-looking forged checksum passes syntax only.

Labels operate only over authorised Markdown, after zone and access checks and before snippets or engine expansion. No label reader opens, hashes, follows, crawls or resolves a source store. A selected-checkout audit must skip symlinked note files and directories. `NOTE-4` warns on declared mirrors with invalid provenance or insufficient text and reports not applicable where the sources role is absent; it never fails merely for mirror quality.

## Per-base enrichment work

The receiving base owns a separate enrichment record: inventory the declared source store against its mirrors under that base's access authority; record controlled groups and missing mirrors; add or extend extracts and checksums; verify freshness where authorised; and report remaining unknown or pointer coverage. No shared harness audit or search-label delivery grants access to that store or writes these records. Legacy notes lacking recognized metadata remain unclassified until their owner reconciles them.
