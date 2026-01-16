# Loomis — Version Roadmap (Frontend-Only)

This document defines the evolution of Loomis starting from the shipped MVP (v1), assuming a **pure frontend architecture inside Adobe Express**.

No backend. No servers. No persistence beyond local state.

---

## v1 — Keyword Search MVP (Shipped)

**Status:** Implemented
**Purpose:** Fast keyword-based meme/GIF discovery and insertion inside Adobe Express.

**Flow**
Type → Search → Browse → Insert

**Architecture**

* UI runtime only
* Tenor API called directly from frontend
* No AI
* No automation

---

## v2 — Image Upload → Understand → Editable Search

**Goal:** Let users derive search intent from an image, without removing control.

**Flow**
Upload image → AI suggests meaning → search auto-fills → user edits → Search

### Features

* Manual image upload button (file picker)
* Frontend sends image directly to Gemini
* Gemini returns:

  * short caption
  * objects
  * emotion
* Search input auto-filled with caption
* User can edit before searching
* No automatic execution

### Architecture

* `geminiService.js`
* Image read as blob/base64 in browser
* Direct Gemini API calls
* Client-side parsing and normalization

---

## v3 — Add "Scan from Canvas" → Understand → Editable Search

**Status:** Implemented

**Goal:** Add convenience without removing existing workflows.

**Flow**
Scan from canvas → AI suggests meaning → search auto-fills → user edits → Search

### Features

* New **"Scan from Canvas"** button (in addition to upload)
* Capture current canvas or screen region
* Manual scan trigger (no auto capture)
* Frame passed to Gemini
* Search box is auto-filled and editable
* Subtle UI hint that text is editable

### Architecture

* Browser capture APIs or Express canvas export
* Frame → blob/base64 → Gemini
* Reuse `geminiService`

---

## v4 — Enhanced Canvas Analysis with Design Suggestions

**Status:** Implemented

**Goal:** Show design improvement suggestions first, then reveal resources search on user action.

**Flow**
Upload/Scan → AI analyzes → Show Suggestions (Phase 1) → Find Resources (Phase 2) → Search with keywords

### Features

* Enhanced Gemini analysis returning:
  * Design improvement suggestions (2-3 sentences)
  * Primary search keyword (`most_relevant`)
  * Additional keyword chips (`other_keywords`)
* Two-phase UI:
  * **Phase 1 (Suggestions View):** Shows "Find Relevant Resources" button + suggestion text
  * **Phase 2 (Resources View):** Search box auto-filled, keyword chips, GIF grid
* Clickable keyword chips that trigger new searches
* Resource type selector (GIFs only for v4, prepared for expansion)
* Auto-search on phase transition

### Architecture

* New `analyzeDesign()` function in `geminiService.js`
* JSON response parsing with validation
* State-driven UI transitions (`_geminiResult`, `_showResourcesView`)
* Reusable render methods (`_renderSuggestionsView`, `_renderResourcesView`)

---

## v5 — Stickers + Multi-Tab

**Goal:** Turn intent into creative components.

### Features

* Tabs: Search | Stickers | Scan
* Sticker suggestions from intent
* Drag & drop stickers
* Resize / rotate

### Architecture

* `stickerService.js`
* Direct provider integration
* Client-side ranking

---

## v6 — Illustrations

**Goal:** Enable creative generation.

### Features

* Illustrations tab
* Style selector
* Generate / remix
* Add to canvas
* Export

### Architecture

* `illustrationService.js`
* Frontend calls generation provider
* Prompt constructed from search text

---

## v7 — Product Polish

**Goal:** Make it delightful and robust.

### Features

* Draft saving (localStorage)
* History panel
* Quick-share formats
* Performance tuning
* UI polish

---

## Core Principles

* No servers.
* No hidden automation.
* AI suggests, user decides.
* Search box is the control surface.
* Every version is usable on its own.

---

## Summary

| Version | Focus                          | Status      |
| ------- | ------------------------------ | ----------- |
| v1      | Keyword search                 | Implemented |
| v2      | Upload image → intent          | Implemented |
| v3      | Add scan from canvas           | Implemented |
| v4      | Enhanced analysis + suggestions| Implemented |
| v5      | Stickers + Multi-Tab           | Planned     |
| v6      | Illustrations                  | Planned     |
| v7      | Polish                         | Planned     |