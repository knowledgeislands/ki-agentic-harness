# Live Artifact standard

Live Artifacts are intentionally mutable operational documents held below `Admin/Operations/Live Artifacts/` in a Knowledge Islands base.

Each artifact has a Markdown source and a co-located HTML render with the same stem.

The Markdown source is authoritative and carries frontmatter with `status`, `renders`, and `author`.

The status is `active` or `archived`; `renders` includes `html`.

When artifact sources exist, `Live Artifacts.md` indexes them with a useful one-line description.

The HTML render must not lag its Markdown source by more than the configured threshold, which defaults to 24 hours.

The checker may create or append unambiguous index entries and add a missing `renders: html` value to an existing frontmatter block.

It must not generate renders, delete orphaned files, choose an artifact status, or write judgmental descriptions.
