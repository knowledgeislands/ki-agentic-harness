# Knowledge Base Extraction Protocol (KBEP)

**Version:** 1.1 (Draft)

---

# Purpose

The **Knowledge Base Extraction Protocol (KBEP)** defines a generic, repeatable and platform-independent process for transforming information sources into a structured collection of reusable knowledge.

KBEP is intentionally independent of any particular knowledge management system, governance model or AI platform.

Its purpose is to preserve long-term knowledge rather than merely exporting documents or archiving conversations.

KBEP answers the question:

> **"What reusable knowledge exists within this source?"**

The resulting output should be consumable by humans, AI systems and downstream knowledge management platforms without requiring access to the original source material.

---

# Scope

KBEP is concerned solely with **knowledge acquisition and extraction**.

It does **not** define:

- governance
- ownership
- publication
- lifecycle management
- review workflows
- canonical knowledge
- organisational structures

These concerns belong to downstream systems such as the **Knowledge Islands Knowledge Base Ingress Protocol (KBIP)**.

---

# Supported Source Types

KBEP should be applicable to any source containing information, discussion, reasoning or artefacts, including (but not limited to):

- AI conversations
- AI Projects
- Meeting transcripts
- Audio transcripts
- Video transcripts
- Email archives
- Slack workspaces
- Microsoft Teams
- Discord
- Notion
- Obsidian
- Wikis
- Confluence
- Documentation repositories
- Source code repositories
- Git repositories
- Markdown collections
- Specifications
- RFC collections
- ADR collections
- PDFs
- Research papers
- Whitepapers
- Books
- Personal notes
- Journals
- Web pages
- Blogs
- Image collections (with OCR where appropriate)

All are treated simply as potential sources of reusable knowledge.

---

# Objectives

Extract reusable knowledge while preserving:

- provenance
- traceability
- reasoning
- decisions
- assumptions
- context
- relationships
- evidence

The extracted knowledge should be understandable without requiring access to the original material.

---

# Principles

Extraction should optimise for:

- Accuracy
- Completeness
- Consistency
- Reusability
- Traceability
- Maintainability
- Future extensibility

The objective is **knowledge preservation**, not historical archiving.

---

# Knowledge Units

Knowledge should be extracted at the smallest practical reusable level.

Typical knowledge units include:

- Concept
- Definition
- Principle
- Rule
- Pattern
- Workflow
- Specification
- Standard
- Algorithm
- Decision
- Research Note
- Lesson Learned
- Observation
- Example
- Taxonomy
- Glossary Entry
- Template
- Reference
- Question
- Future Idea

These units may later be combined into larger knowledge assets.

---

# Extraction Pipeline

KBEP consists of six logical stages.

## Stage 1 — Source Capture

Capture the original material and enough context to reconstruct the reasoning if required.

Where appropriate include:

- executive summary
- chronological overview
- discussions
- artefacts
- uploaded files
- diagrams
- images
- code
- references
- external links

---

## Stage 2 — Knowledge Extraction

Identify reusable knowledge.

Examples include:

- Concepts
- Specifications
- Architectures
- Processes
- Patterns
- Frameworks
- Algorithms
- Standards
- Research
- Methodologies
- Best Practices
- Definitions
- Decision Records
- Lessons Learned
- Risks
- Future Opportunities

Each extracted item should stand on its own.

---

## Stage 3 — Knowledge Normalisation

Consolidate duplicated information.

Identify:

- repeated knowledge
- evolving understanding
- contradictions
- superseded information
- competing proposals
- alternative approaches

Produce one authoritative extracted representation wherever practical while retaining traceability.

---

## Stage 4 — Relationship Discovery

Identify relationships including:

- Depends On
- Related To
- Derived From
- Extends
- Implements
- Produces
- Consumes
- Alternative To
- Conflicts With
- Supports
- Requires
- Supersedes

Represent relationships in both human-readable and machine-readable forms where practical.

---

## Stage 5 — Provenance

Record the origin of every significant knowledge item.

Capture where possible:

- originating source
- originating document
- conversation
- date
- section
- message
- confidence
- classification

Classify each item as one of:

- Fact
- Decision
- Observation
- Proposal
- Hypothesis
- Opinion
- Question
- Research
- Future Idea

Knowledge without provenance should be explicitly identified.

---

## Stage 6 — Quality Review

Review the extracted knowledge.

Identify:

- duplication
- inconsistencies
- ambiguities
- missing information
- unanswered questions
- future research
- knowledge gaps

Highlight items requiring human review.

---

# Confidence

Each extracted item should carry a confidence level.

| Level | Meaning |
|---------|----------|
| High | Explicitly stated and well supported |
| Medium | Strongly implied with minor interpretation |
| Low | Inferred or speculative |

---

# Knowledge Status

Each extracted item should also indicate its lifecycle state.

- Current
- Proposed
- Experimental
- Superseded
- Deprecated
- Historical
- Unknown

---

# Recommended Output Structure

```text
knowledge-export/

    source/
        transcripts/
        originals/
        metadata/

    assets/
        images/
        documents/
        diagrams/

    knowledge/
        concepts/
        architecture/
        specifications/
        workflows/
        standards/
        patterns/
        research/
        glossary/
        decisions/

    relationships/
        relationships.md
        nodes.json
        edges.json

    provenance/
        provenance.md
        traceability.csv

    review/
        quality-review.md

    index.md
```

---

# Non-Goals

KBEP is **not** intended to:

- archive every sentence
- preserve conversational style
- replace document backups
- replace version control
- govern knowledge
- decide canonical truth

Its purpose is the extraction and preservation of reusable knowledge.

---

# Success Criteria

A successful KBEP extraction should allow another human or AI system to understand, search, maintain and extend the extracted knowledge without requiring access to the original source material.
