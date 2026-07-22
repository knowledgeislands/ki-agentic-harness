# Knowledge acquisition pilot

This developer procedure captures one user-selected ChatGPT conversation or project into a **KEP-shaped evidence set** while KAF tooling is being specified. It is not a replacement for the future `ki acquire` command and does not perform knowledge extraction or Knowledge Base ingress.

## Safety boundary

- Obtain and export only material the user is entitled to access and has explicitly selected for this pilot.
- Use a private output directory outside a Git working tree. Never commit conversation content, session cookies, credentials, access tokens, or downloaded private assets.
- Do not use browser automation, an existing browser profile, undocumented APIs, or copied authentication material.
- Preserve uncertainty: record unavailable messages or assets rather than fabricating them or silently treating a partial capture as complete.

## Prepare the evidence set

1. Select one conversation or one bounded project and record its human-readable title, available identifier, source URL if safe to retain, and the capture date.
2. Use a user-provided export, downloaded file, or manually copied conversation content. Retain the original export or download unchanged beneath `source/originals/`.
3. Store each captured conversation under `source/records/`. Preserve message order, author role, available timestamps, title, identifiers, and source-native links. Markdown is suitable for a readable rendering, but it must not embed binary asset bytes.
4. Store downloaded attachments and generated images separately beneath `assets/`, preserving their original bytes. Record their original name, MIME type when known, digest, and the message or record that referenced them.
5. Record only source-native relationships—such as project-to-conversation, message-to-attachment, ordering, and explicit hyperlinks—in `relationships/native.jsonl`. Do not infer semantic relationships, decisions, or knowledge concepts.
6. Write a manifest candidate containing the source system, capture boundary, record and asset counts, file digests, known omissions, and provenance. Treat any checkpoints, browser state, and resumable working data as local state outside the eventual immutable export.

## Suggested private layout

```text
<private-output>/
├── kep.toml
├── README.md
├── source/
│   ├── originals/
│   └── records/
├── assets/
├── relationships/
│   └── native.jsonl
└── checksums/
    └── sha256sums.txt
```

This layout is the KEP v0 candidate, not a claim that a completed KEP generator already exists.

## Handoff to later stages

The pilot is complete when another operator can inspect the source evidence, assets, native relationships, and omissions without revisiting the ChatGPT session. The next stage is a KBEP extraction process; do not summarise, deduplicate, canonicalise, classify reusable knowledge, or add governance metadata as part of this acquisition procedure.
