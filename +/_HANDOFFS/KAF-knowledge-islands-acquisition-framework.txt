# Knowledge Islands Acquisition Framework (KAF)

**Status:** Draft Specification  
**Audience:** Engineering Team / AI Coding Agent  
**Purpose:** Build the Knowledge Acquisition Framework responsible for acquiring information from external systems and producing portable Knowledge Export Packages (KEPs).

---

# Overview

The **Knowledge Acquisition Framework (KAF)** is the entry point into the Knowledge Islands ecosystem.

Its responsibility is **acquisition**, not knowledge engineering.

KAF retrieves information from external systems, preserves it faithfully, and packages it into a standard **Knowledge Export Package (KEP)**.

The package is subsequently processed by:

```
External System
        │
        ▼
Knowledge Acquisition Framework (KAF)
        │
        ▼
Knowledge Export Package (KEP)
        │
        ▼
Knowledge Base Extraction Protocol (KBEP)
        │
        ▼
Structured Knowledge
        │
        ▼
Knowledge Base Ingress Protocol (KBIP)
        │
        ▼
Knowledge Island
```

KAF must remain completely independent of KBEP and KBIP.

---

# Design Principles

The framework must be:

- vendor neutral
- deterministic
- resumable
- extensible
- plugin based
- reproducible
- traceable

Knowledge engineering must **never** occur within KAF.

KAF preserves information.

KBEP extracts knowledge.

KBIP governs knowledge.

---

# Responsibilities

KAF is responsible for:

- authentication
- discovery
- acquisition
- pagination
- checkpointing
- incremental synchronisation
- asset download
- metadata preservation
- provenance preservation
- package creation
- integrity validation

KAF is **not** responsible for:

- summarisation
- canonicalisation
- deduplication
- governance
- ontology
- relationship inference beyond native source relationships

---

# CLI Specification

The CLI is provided through the existing **`ki`** command.

## General Syntax

```bash
ki acquire <connector> [options]
```

or equivalently

```bash
ki export <connector> [options]
```

`ki acquire` should become the preferred long-term command, with `ki export` retained as a backwards-compatible alias.

---

## Examples

### ChatGPT Project

```bash
ki acquire chatgpt project "Knowledge Islands"
```

### ChatGPT Conversation

```bash
ki acquire chatgpt conversation <conversation-id>
```

### GitHub Repository

```bash
ki acquire github knowledgeislands/ki-specs
```

### Local Filesystem

```bash
ki acquire filesystem ~/Documents
```

### Obsidian Vault

```bash
ki acquire obsidian ~/Vault
```

### Notion

```bash
ki acquire notion
```

---

# Output

Every acquisition produces a **Knowledge Export Package (KEP)**.

Example:

```text
Knowledge-Islands-2026-07-23.kep.zip
```

Internally:

```text
manifest.json

README.md

SUMMARY.md

source/

assets/

metadata/

relationships/

checksums/

logs/
```

The KEP must be deterministic.

Running KAF twice against unchanged data should produce identical packages.

---

# Connector Architecture

Each connector implements the following interface:

```text
Authenticate()

Discover()

Enumerate()

Acquire()

Resume()

Validate()

Package()
```

Connectors must be independently distributable.

Example packages:

```text
@knowledgeislands/kaf-chatgpt

@knowledgeislands/kaf-github

@knowledgeislands/kaf-filesystem

@knowledgeislands/kaf-notion
```

---

# ChatGPT Connector

This is considered a **Tier 1** connector because it is expected to be one of the most frequently used acquisition sources.

## Goals

Acquire as much information as possible from:

- Projects
- Conversations
- Uploaded documents
- Generated images
- Attachments
- Conversation metadata
- Project metadata

without performing knowledge extraction.

---

## Expected Output

Example:

```text
Knowledge-Islands.kep.zip

source/

    project.json

    conversations/

        2026-07-11-ai-ecosystem.md

        2026-07-15-worktrees.md

        ...

assets/

    uploaded/

    generated-images/

metadata/

relationships/

logs/
```

---

## Acquisition Strategy

The connector should support multiple acquisition methods.

### Method 1 — Official Export (Preferred)

If OpenAI exposes an official Project export API or download mechanism, use it.

Advantages:

- highest fidelity
- supported
- stable

---

### Method 2 — Official APIs (Future)

If future APIs expose:

- Projects
- Conversations
- Attachments
- Images

then acquire directly through authenticated API calls.

---

### Method 3 — Browser Automation (Current Best Option)

At the time of writing, ChatGPT Projects cannot be comprehensively exported through a documented public API.

The connector should therefore support browser automation using tools such as:

- Playwright
- Puppeteer

Capabilities should include:

- authenticate using an existing browser profile or login flow
- enumerate Projects
- enumerate conversations within a Project
- open each conversation
- progressively scroll to load the complete conversation history
- capture assistant and user messages in chronological order
- download uploaded files where available
- download generated images where available
- preserve timestamps, titles and identifiers where exposed
- capture conversation ordering within the Project

Browser automation should avoid scraping presentation details and instead target stable DOM attributes wherever possible.

---

### Method 4 — User-Assisted Export

Where automation is not possible, support importing:

- exported conversations
- copied Markdown
- PDFs
- manually downloaded assets

This provides a graceful fallback and allows KBEP to operate on partially automated exports.

---

# ChatGPT Asset Expectations

For each conversation, preserve:

- title
- conversation identifier (if available)
- project identifier (if available)
- creation date (if available)
- modification date (if available)
- message sequence
- author role
- uploaded files
- generated images
- references between uploaded assets and messages

Never embed binary data inside Markdown.

Assets should be stored separately.

---

# ChatGPT Conversation Format

Each conversation should be stored as Markdown.

Suggested structure:

```markdown
---
source: chatgpt

project: Knowledge Islands

conversation_id:

title:

created:

updated:

---

# Conversation

## User

...

## Assistant

...

## User

...
```

This is intentionally lossless.

Knowledge extraction occurs later.

---

# Relationship Capture

Capture native relationships only.

Examples:

- Project → Conversation
- Conversation → Message
- Message → Attachment
- Message → Generated Image
- Conversation ordering
- Hyperlinks
- Referenced files

Do **not** infer semantic relationships.

---

# Manifest Format

Example:

```json
{
  "format": "kep",
  "version": "1.0",
  "generator": "kaf-chatgpt",
  "source": {
    "type": "chatgpt",
    "project": "Knowledge Islands"
  },
  "statistics": {
    "conversations": 15,
    "messages": 1254,
    "assets": 42
  }
}
```

---

# Incremental Acquisition

Every connector should support:

- initial acquisition
- resume after interruption
- delta acquisition
- unchanged detection
- deleted item detection
- package regeneration

This should minimise unnecessary downloads.

---

# Engineering Stack

Recommended:

- TypeScript
- Node.js
- pnpm
- Playwright (browser automation)
- JSZip (or equivalent)
- Zod (schema validation)

The connector architecture should allow additional acquisition methods to be added without changing the CLI contract.

---

# Initial Connector Roadmap

Priority order:

1. Local Filesystem
2. GitHub
3. Obsidian
4. Notion
5. Gmail
6. Google Drive
7. ChatGPT
8. Claude
9. Gemini
10. Slack
11. Microsoft Teams
12. Discord

The Local Filesystem connector should serve as the reference implementation for all others.

---

# Success Criteria

A successful KAF implementation should:

- faithfully reproduce source information
- preserve provenance and metadata
- preserve attachments and generated assets
- create deterministic KEP packages
- support incremental updates
- provide a stable, vendor-neutral acquisition interface
- require no changes to KBEP when new source systems are added

The resulting KEP should be sufficient for KBEP to perform complete knowledge extraction without requiring further access to the original source system.
