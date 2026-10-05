---
id: DDR-KI-HARNESS-001
title: Mirrors and source provenance are separate relationships
date: 2026-10-05
status: current
decision_type: data
decision_type_url: https://knowledgeislands.info/specifications/decision-records/ddr
---

# DDR-KI-HARNESS-001: Mirrors and source provenance are separate relationships

## Context

A Knowledge Island with a paired sources store relates notes to the files in that store in two different ways. A mirror note stands in for one file: it says what the file is and records the facts a reader would otherwise open it for. A derived note was produced from a file, often as one of many, such as one day split from a message export. Acquisition adapters add a third kind of provenance that points at an upstream service rather than at the store.

The `ki-repo-kb` source-mirror contract named its mirror declaration `source_path` and `source_sha256`, and treated any note carrying either key as a mirror. Bases had independently adopted `mirrors` and `mirror_type` for mirrors, writing paths with the store alias as the first segment, while derived notes used `source_path`. The shared vocabulary made provenance indistinguishable from mirroring, so adapter output and derived notes were audited as defective mirrors, and genuine mirrors written in the bases' own fields went unrecognised.

## Decision

Mirrors and source provenance use separate field families, and only the mirror family makes a note a mirror.

- **Mirror:** `mirrors` names exactly one file as `<store-alias>-sources/<store-relative path>`; `mirror_type` is required and is one of `verbatim`, `annotated`, `summarised` or `indexed`; `mirror_sha256` is required and identifies the file's content. Lists, directories and coverage notes are not mirrors. Every type except `indexed` carries a minimum substantive extract.
- **Source provenance:** `source_path`, in the same aliased form, and `source_sha256` record where a derived note came from. Many notes may share one source. These fields never make a note a mirror.
- **Adapter provenance:** an acquisition adapter keeps its own upstream fields and uses neither family unless a note genuinely mirrors or derives from a store file.

The `ki-repo-kb` source-mirror standard, its shared classifier, the `NOTE-4` audit and the KB search response (`ki/kb-search-result/v2`, carrying `mirrors`, `mirror_type` and `mirror_sha256`) implement this decision.

## Consequences

- Provenance on derived notes and adapter output no longer raises mirror findings, and the bases' existing `mirrors` and `mirror_type` vocabulary becomes the shared standard.
- `mirror_type` is authored intent rather than inferred length, so brief `indexed` mirrors of bulk material are conforming rather than warned.
- One file per mirror keeps the checksum meaningful and lets an owner inventory unmirrored files; bases with list or directory mirrors must split them into single-file mirrors or ordinary index notes.
- Bases rename mirror checksums to `mirror_sha256`, backfill missing checksums and `mirror_type` values, and move mirrors declared with `source_path` to `mirrors`, each through their own enactment process.
- Search consumers move to the v2 response, whose mirror fields replace the v1 `source_path` and `source_sha256`.
