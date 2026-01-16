---

# Version 5.0.0 – Implementation Plan

**Goal:** Reduce creative friction by analyzing user content and delivering structured, actionable inspiration with one-click canvas insertion.

---

## 1. User Workflow Overview

### Entry Points

* **Option A:** Import from Device (Local Upload)
* **Option B:** Scan My Canvas

Both flows converge into a single processing pipeline.

---

## 2. Processing Pipeline

### Step 1: Image Acquisition

* Normalize both inputs to a **PNG snapshot**

  * Local import → convert to PNG if needed
  * Canvas scan → export canvas as PNG

### Step 2: Vision + Context Analysis

* Send PNG to **Gemini Vision API**
* Gemini returns:

  * Detected content (objects, theme, style, mood)
  * Missing elements (background, emotion, emphasis, balance)
  * Search keywords per element type

### Step 3: Server-Side Orchestration

* Parse Gemini output
* For each allowed element type, fetch assets:

  * **Memes:** Tenor
  * **GIFs:** Tenor
  * **Illustrations:** Unsplash
  * **Backgrounds:** Unsplash
  * **Images:** Unsplash
* Rank results by relevance
* Trim to preview-sized subsets (for low latency)

---

## 3. Suggestion Engine Design

### Core Principles

* Suggestions are **segmented by element type**
* Each segment:

  * Explains *why* it helps
  * Shows a **mini preview gallery**
  * Supports **1-click add to canvas**
  * Has a **“+ More” button** for deeper exploration

### Allowed Element Segments

1. Memes (Tenor)
2. GIFs (Tenor)
3. Illustrations (Unsplash)
4. Backgrounds (Unsplash)
5. Images (Unsplash)

---

## 4. UI Behavior

### Suggestions Panel (Primary)

* Vertical list of **rectangular suggestion cards**
* Each card includes:

  * Title
  * Reason text (from Gemini)
  * Horizontal mini gallery (3–5 items)
  * **➕ Add** button per asset
  * **＋ More** button (context-preserving)

### Expanded Panel (Secondary)

* Triggered by “+ More”
* Shows:

  * Larger gallery
  * Same context and keywords
* Includes **Back** button
* Returns user to the exact previous state

---

## 5. Data Contract (Critical)

* All outputs must be:

  * **Pure JSON**
  * **Chunked / segmented**
  * Frontend-ready
  * Stateless between panels (context passed explicitly)

---

# Example: Ideal JSON Output Structure

```json
{
  "analysis_summary": {
    "theme": "motivational productivity",
    "detected_elements": ["text", "character illustration"],
    "missing_elements": ["background", "emotional emphasis"]
  },

  "suggestions": [
    {
      "segment_id": "background",
      "element_type": "background",
      "title": "Add a clean background",
      "reason": "A subtle background will improve readability and make the main message stand out.",
      "search_keywords": ["minimal gradient", "soft abstract background"],
      "preview_items": [
        {
          "id": "unsplash_bg_01",
          "source": "unsplash",
          "preview_url": "https://images.unsplash.com/preview1.jpg",
          "add_to_canvas_action": {
            "type": "add_background",
            "asset_id": "unsplash_bg_01"
          }
        },
        {
          "id": "unsplash_bg_02",
          "source": "unsplash",
          "preview_url": "https://images.unsplash.com/preview2.jpg",
          "add_to_canvas_action": {
            "type": "add_background",
            "asset_id": "unsplash_bg_02"
          }
        }
      ],
      "more_action": {
        "panel": "expanded_gallery",
        "context_key": "background|minimal gradient"
      }
    },

    {
      "segment_id": "gifs",
      "element_type": "gifs",
      "title": "Add motion for engagement",
      "reason": "A subtle GIF can draw attention to the message and increase visual appeal.",
      "search_keywords": ["motivational animation", "success celebration"],
      "preview_items": [
        {
          "id": "tenor_gif_01",
          "source": "tenor",
          "preview_url": "https://media.tenor.com/gif1.gif",
          "add_to_canvas_action": {
            "type": "add_gif",
            "asset_id": "tenor_gif_01"
          }
        }
      ],
      "more_action": {
        "panel": "expanded_gallery",
        "context_key": "gifs|motivational animation"
      }
    },

    {
      "segment_id": "memes",
      "element_type": "memes",
      "title": "Boost relatability with memes",
      "reason": "Memes add humor and make the message feel more relatable to viewers.",
      "search_keywords": ["work motivation meme"],
      "preview_items": [
        {
          "id": "tenor_meme_01",
          "source": "tenor",
          "preview_url": "https://media.tenor.com/meme1.gif",
          "add_to_canvas_action": {
            "type": "add_meme",
            "asset_id": "tenor_meme_01"
          }
        }
      ],
      "more_action": {
        "panel": "expanded_gallery",
        "context_key": "memes|work motivation"
      }
    }
  ]
}
```

---

## 6. Why This Design Works

* **Low cognitive load:** Clear “why” for every suggestion
* **Instant action:** One-click add to canvas
* **Scalable:** New element types fit naturally
* **State-safe:** Panels rely on explicit context keys
* **Hackathon-friendly:** Modular, API-driven, demo-ready

---
