# Loomis v5.0.0 - Complete Implementation Context

> **Last Updated:** January 17, 2026  
> **Version:** 5.0.0  
> **Platform:** Adobe Express Add-on

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution Architecture](#3-solution-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Core Services Implementation](#5-core-services-implementation)
6. [UI Component System](#6-ui-component-system)
7. [Data Flow & Contracts](#7-data-flow--contracts)
8. [API Integrations](#8-api-integrations)
9. [File Structure](#9-file-structure)
10. [State Management](#10-state-management)
11. [Key Implementation Decisions](#11-key-implementation-decisions)
12. [Testing & Validation](#12-testing--validation)

---

## 1. Project Overview

### What is Loomis?

**Loomis** is an AI-powered Adobe Express add-on that analyzes user designs and provides intelligent, contextual suggestions for enhancing them with visual assets. It acts as a creative assistant that understands the design's theme, identifies missing elements, and offers one-click access to relevant backgrounds, GIFs, memes, illustrations, and images.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| 🔍 **Canvas Scanning** | Export and analyze the current Express canvas using AI vision |
| 📤 **Image Upload** | Upload external images for design analysis |
| 🤖 **AI Analysis** | Gemini Vision identifies themes, detected elements, and gaps |
| 🎯 **Segmented Suggestions** | Organized recommendations by element type with reasoning |
| ⚡ **One-Click Insert** | Add any asset directly to the canvas |
| 🔄 **Contextual Search** | Custom GIF search powered by Tenor |
| 📚 **Expanded Galleries** | Deep-dive into any suggestion category with pagination |

---

## 2. Problem Statement

### The Creative Friction Problem

Designers using Adobe Express often face:

1. **Blank Canvas Syndrome** - Difficulty deciding what assets would enhance their design
2. **Context Switching** - Leaving Express to search for assets on multiple platforms
3. **Relevance Gap** - Generic searches don't account for the design's specific theme/mood
4. **Decision Fatigue** - Too many options without guidance on what fits

### The Solution Hypothesis

By analyzing the visual context of a design and providing AI-generated, contextually-relevant suggestions segmented by purpose, we can:

- Reduce time-to-completion for design tasks
- Improve design quality through targeted recommendations
- Keep designers in their creative flow within Adobe Express

---

## 3. Solution Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADOBE EXPRESS                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      LOOMIS ADD-ON                          │   │
│  │                                                              │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │   │
│  │  │   UI Layer   │◄──►│   Services   │◄──►│  External    │  │   │
│  │  │   (Lit +     │    │   Layer      │    │  APIs        │  │   │
│  │  │   Spectrum)  │    │              │    │              │  │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘  │   │
│  │         │                   │                   │           │   │
│  │         │                   │                   │           │   │
│  │         ▼                   ▼                   ▼           │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │   │
│  │  │ App.js       │    │ Gemini       │    │ Tenor API    │  │   │
│  │  │ App.css.js   │    │ Service      │    │ Unsplash API │  │   │
│  │  │ index.js     │    │ Asset Orch.  │    │              │  │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘  │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              ADOBE EXPRESS DOCUMENT API                      │   │
│  │         addImage() / addAnimatedImage()                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Processing Pipeline

```
User Action                    Processing                         Output
─────────────────────────────────────────────────────────────────────────
                              
┌─────────────────┐                                              
│ Scan Canvas     │───┐       ┌─────────────────┐              
└─────────────────┘   │       │                 │    ┌───────────────────┐
                      ├──────►│ Image to Base64 │───►│ Gemini Vision API │
┌─────────────────┐   │       │                 │    │ (analyzeDesignV5) │
│ Upload Image    │───┘       └─────────────────┘    └─────────┬─────────┘
└─────────────────┘                                            │
                                                               ▼
                              ┌─────────────────────────────────────────┐
                              │         Asset Orchestrator              │
                              │                                         │
                              │  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
                              │  │ Tenor   │  │Unsplash │  │ Format  │ │
                              │  │ Fetch   │  │ Fetch   │  │ Results │ │
                              │  └─────────┘  └─────────┘  └─────────┘ │
                              └───────────────────┬─────────────────────┘
                                                  │
                                                  ▼
                              ┌─────────────────────────────────────────┐
                              │         Enriched Suggestions            │
                              │    (with preview_items & more_action)   │
                              └─────────────────────────────────────────┘
```

---

## 4. Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Lit** | 2.8.0 | Web Components framework for reactive UI |
| **Spectrum Web Components** | 1.7.0 | Adobe's design system for consistent UX |
| **Webpack** | 5.98.0 | Module bundling and build tooling |
| **Babel** | 7.24.x | JavaScript/decorator transpilation |

### External APIs

| API | Provider | Purpose |
|-----|----------|---------|
| **Gemini Vision** | Google | AI image analysis and suggestion generation |
| **Tenor** | Google | GIF and meme search |
| **Unsplash** | Unsplash Inc. | Stock photos, backgrounds, illustrations |
| **Express Add-on SDK** | Adobe | Canvas manipulation and rendering |

### Development Tools

| Tool | Purpose |
|------|---------|
| `@adobe/ccweb-add-on-scripts` | Add-on development CLI |
| `dotenv-webpack` | Environment variable injection |
| `copy-webpack-plugin` | Static asset handling |

---

## 5. Core Services Implementation

### 5.1 Gemini Service (`geminiService.js`)

**Purpose:** AI-powered design analysis using Google's Gemini Vision API.

#### Primary Function: `analyzeDesignV5()`

```javascript
export async function analyzeDesignV5(base64Image, mimeType, userContext = null)
```

**What it does:**
- Accepts a base64-encoded image and optional user context
- Sends to Gemini Vision API with a structured prompt
- Returns segmented suggestions with element types and search keywords

**Why this approach:**
- V5 prompt is specifically designed for structured JSON output
- User context allows personalization of suggestions
- Validation ensures only valid element types are returned

**Key Implementation Details:**
- Uses `gemini-3-flash-preview` model for fast, cost-effective analysis
- Handles markdown code block stripping from AI responses
- Validates response structure before returning
- Filters suggestions to only include valid element types: `background`, `gifs`, `memes`, `illustrations`, `images`

**Prompt Engineering:**
```
The prompt instructs Gemini to:
1. Analyze the image for theme, detected elements, and missing elements
2. Generate 2-5 suggestions prioritized by impact
3. Return pure JSON with segment_id, element_type, title, reason, and search_keywords
4. Tailor suggestions to user's stated vision when provided
```

---

### 5.2 Asset Orchestrator (`assetOrchestrator.js`)

**Purpose:** Central hub that routes asset requests to the appropriate API based on element type.

#### Source Mapping

```javascript
const SOURCE_MAP = {
  memes: "tenor",        // Memes → Tenor with "meme" keyword
  gifs: "tenor",         // GIFs → Tenor
  illustrations: "unsplash",  // Illustrations → Unsplash
  backgrounds: "unsplash",    // Backgrounds → Unsplash (landscape)
  background: "unsplash",     // Singular form support
  images: "unsplash",         // General images → Unsplash
};
```

**Why this mapping:**
- Tenor excels at animated content (GIFs) and viral content (memes)
- Unsplash provides high-quality stock photography suitable for professional designs
- Element type determines the optimal source automatically

#### Key Functions

| Function | Purpose |
|----------|---------|
| `fetchAssetsForSuggestion()` | Fetch assets for a single suggestion |
| `fetchAssetsForAllSuggestions()` | Parallel fetch for all suggestions |
| `fetchExpandedGalleryAssets()` | Paginated fetch for expanded view |

**Implementation Highlights:**
- Uses `Promise.all()` for parallel asset fetching
- Enhances search queries based on element type (e.g., "meme" suffix for memes)
- Normalizes response format across different APIs
- Includes `more_action` metadata for expanded gallery context

---

### 5.3 Tenor API Service (`tenorApi.js`)

**Purpose:** GIF and meme search using Tenor's V2 API.

#### Key Functions

```javascript
searchGifs(query, limit)   // Search for GIFs
getGifUrl(result)          // Extract full GIF URL
getPreviewUrl(result)      // Extract thumbnail URL
cleanQuery(query)          // Sanitize search input
```

**Critical Implementation Note:**
Adobe Express's `addAnimatedImage()` method **only accepts GIF format**, not MP4. The service prioritizes `media_formats.gif` over other formats.

**API Configuration:**
- Content filter: `medium` (appropriate content)
- Media filter: `gif,tinygif,mp4` (for preview optimization)
- Max results: 50 per request

---

### 5.4 Unsplash API Service (`unsplashApi.js`)

**Purpose:** Stock photo search with specialized functions for different use cases.

#### Specialized Search Functions

| Function | Search Enhancement |
|----------|-------------------|
| `searchBackgrounds()` | Adds "background texture abstract" + landscape orientation |
| `searchIllustrations()` | Adds "illustration art graphic" |
| `searchPhotos()` | No enhancement, general photos |

#### Attribution & Tracking

Per Unsplash API guidelines, the service includes:
- `trackDownload()` - Must be called when user inserts an image
- `getAttribution()` - Returns proper credit text
- `getAttributionHtml()` - HTML-formatted attribution with links

**Why this matters:** Unsplash requires download tracking and attribution for API compliance.

---

## 6. UI Component System

### 6.1 Main Application (`App.js`)

**Architecture:** Single LitElement component managing all views through state machine.

#### Component Properties

```javascript
// SDK Integration
@property addOnUISdk;           // Adobe Express SDK reference
@state _sandboxProxy;           // Document sandbox proxy

// View State
@state _currentView;            // 'welcome' | 'processing' | 'suggestions' | 'expanded'
@state _errorMessage;           // Current error message
@state _isProcessing;           // Processing indicator

// Analysis State
@state _analysisResult;         // Raw Gemini response
@state _enrichedSuggestions;    // Suggestions with preview items
@state _userContext;            // User-provided theme context

// Expanded Gallery State
@state _expandedContext;        // Current expansion context
@state _expandedResults;        // Expanded gallery items
@state _expandedPage;           // Current pagination page
@state _expandedHasMore;        // More results available flag

// Custom Search State
@state _customSearchQuery;      // Custom GIF search input
@state _customSearchResults;    // Custom search results

// Insert State
@state _insertingAssetId;       // Currently inserting asset ID
```

### 6.2 View State Machine

```
                    ┌─────────────┐
                    │   WELCOME   │
                    │             │
                    │ • Theme input│
                    │ • Scan btn  │
                    │ • Upload btn│
                    └──────┬──────┘
                           │
                    Scan/Upload
                           │
                           ▼
                    ┌─────────────┐
                    │ PROCESSING  │
                    │             │
                    │ • Spinner   │
                    │ • Status    │
                    └──────┬──────┘
                           │
                    Analysis Complete
                           │
                           ▼
┌──────────┐        ┌─────────────┐
│ EXPANDED │◄──────►│ SUGGESTIONS │
│          │ +More  │             │
│ • Back   │◄───────│ • Cards     │
│ • Grid   │  Back  │ • Galleries │
│ • Pages  │        │ • Search    │
└──────────┘        │ • Rescan    │
                    └─────────────┘
```

### 6.3 Render Methods

| Method | Purpose |
|--------|---------|
| `_renderWelcomeState()` | Initial state with upload controls |
| `_renderProcessingState()` | Loading spinner during analysis |
| `_renderSuggestionCard()` | Individual suggestion card with mini-gallery |
| `_renderCustomSearchCard()` | GIF search interface |
| `_renderSuggestionsView()` | Complete suggestions panel |
| `_renderExpandedView()` | Full gallery with pagination |

### 6.4 Styling (`App.css.js`)

**Design Philosophy:**
- Uses Adobe Spectrum design tokens for consistency with Express
- Light theme with accent color `#5c5ce0`
- Responsive card-based layout
- Smooth transitions and hover states

**Key Style Sections:**

| Section | Purpose |
|---------|---------|
| Base Layout | Container, typography, spacing |
| Header | Context input, upload buttons |
| Welcome State | Centered intro message |
| Processing State | Loading animation |
| Suggestion Card | Card structure, header, reason |
| Mini Gallery | Horizontal scroll thumbnails |
| Expanded Gallery | Full-screen grid view |
| Search Card | Custom GIF search UI |

---

## 7. Data Flow & Contracts

### 7.1 Gemini V5 Response Contract

```json
{
  "analysis_summary": {
    "theme": "motivational productivity",
    "detected_elements": ["text", "character illustration"],
    "missing_elements": ["background", "emotional emphasis"]
  },
  "suggestions": [
    {
      "segment_id": "background_1",
      "element_type": "background",
      "title": "Add a clean background",
      "reason": "A subtle background will improve readability...",
      "search_keywords": ["minimal gradient", "soft abstract"]
    }
  ]
}
```

### 7.2 Enriched Suggestion Contract

After asset orchestration, each suggestion is enriched:

```json
{
  "segment_id": "background_1",
  "element_type": "background",
  "title": "Add a clean background",
  "reason": "A subtle background will improve readability...",
  "search_keywords": ["minimal gradient", "soft abstract"],
  
  "preview_items": [
    {
      "id": "unsplash_abc123",
      "source": "unsplash",
      "preview_url": "https://images.unsplash.com/...",
      "full_url": "https://images.unsplash.com/...",
      "metadata": {
        "author": "John Doe",
        "description": "Abstract gradient"
      },
      "add_to_canvas_action": {
        "type": "add_background",
        "asset_id": "abc123",
        "source": "unsplash"
      },
      "_original": { /* raw API response */ }
    }
  ],
  
  "more_action": {
    "panel": "expanded_gallery",
    "context_key": "background|minimal gradient",
    "search_query": "minimal gradient"
  }
}
```

### 7.3 Asset Insert Flow

```
User clicks "+" on asset
        │
        ▼
┌─────────────────────┐
│ _handleInsertAsset  │
└─────────┬───────────┘
          │
          ▼
    ┌─────────────┐
    │Check source │
    └──────┬──────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌──────────┐
│ Tenor   │ │ Unsplash │
│ (GIF)   │ │ (Image)  │
└────┬────┘ └────┬─────┘
     │           │
     ▼           ▼
┌─────────────────────┐
│ Fetch blob from URL │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────────┐
│ Call Express SDK method:    │
│ • addAnimatedImage() for GIF│
│ • addImage() for static     │
└─────────────────────────────┘
          │
          ▼
    Track download (Unsplash only)
```

---

## 8. API Integrations

### 8.1 Adobe Express Add-on SDK

**Initialization:**
```javascript
import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
```

**Key Methods Used:**

| Method | Purpose |
|--------|---------|
| `addOnUISdk.ready` | Wait for SDK initialization |
| `runtime.apiProxy(RuntimeType.documentSandbox)` | Get sandbox proxy |
| `app.document.createRenditions()` | Export canvas as PNG |
| `app.document.addImage()` | Insert static image |
| `app.document.addAnimatedImage()` | Insert GIF |

### 8.2 Gemini API

**Endpoint:** Google GenAI SDK  
**Model:** `gemini-3-flash-preview`  
**Authentication:** API Key

**Request Format:**
```javascript
ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [imagePart, prompt],
});
```

### 8.3 Tenor API

**Base URL:** `https://tenor.googleapis.com/v2`  
**Authentication:** API Key  
**Endpoint:** `/search`

**Parameters:**
- `q`: Search query
- `limit`: Results count (1-50)
- `media_filter`: Response optimization
- `contentfilter`: Safety level

### 8.4 Unsplash API

**Base URL:** `https://api.unsplash.com`  
**Authentication:** Client-ID header  
**Endpoint:** `/search/photos`

**Parameters:**
- `query`: Search query
- `per_page`: Results per page (1-30)
- `page`: Pagination
- `orientation`: Filter by aspect ratio

---

## 9. File Structure

```
loomis/
├── src/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── App.js              # Main UI component (702 lines)
│   │   │   └── App.css.js          # Complete stylesheet (439 lines)
│   │   ├── services/
│   │   │   ├── geminiService.js    # AI analysis service (341 lines)
│   │   │   ├── tenorApi.js         # GIF search service (147 lines)
│   │   │   ├── unsplashApi.js      # Image search service (417 lines)
│   │   │   └── assetOrchestrator.js # Asset routing hub (246 lines)
│   │   └── index.js                # Root component & SDK init
│   ├── sandbox/
│   │   ├── code.js                 # Document sandbox code
│   │   └── tsconfig.json           # Sandbox TypeScript config
│   ├── models/
│   │   └── DocumentSandboxApi.ts   # Sandbox API types
│   ├── index.html                  # HTML entry point
│   └── manifest.json               # Add-on manifest
├── docs/
│   ├── context_v1.md               # Version 1 context
│   ├── context_v2.md               # Version 2 context
│   ├── context_v3.md               # Version 3 context
│   ├── context_v5.md               # Version 5 summary
│   └── context_v5_updated.md       # This document
├── dist/                           # Build output
├── package.json                    # Dependencies & scripts
├── webpack.config.js               # Build configuration
└── README.md                       # Quick start guide
```

---

## 10. State Management

### 10.1 State Categories

**View State:**
- `_currentView` - Current view identifier
- `_errorMessage` - Error display state

**Analysis State:**
- `_analysisResult` - Raw AI response
- `_enrichedSuggestions` - Processed suggestions with assets
- `_userContext` - User-provided theme input

**Gallery State:**
- `_expandedContext` - Expansion context (element type, query)
- `_expandedResults` - Loaded gallery items
- `_expandedPage` - Current pagination page
- `_expandedHasMore` - More results available

**UI State:**
- `_insertingAssetId` - Asset being inserted (loading indicator)
- `_customSearchQuery` - Custom search input
- `_customSearchResults` - Custom search results

### 10.2 State Transitions

```
State: welcome
  │
  ├─ Scan Canvas ──────► processing
  │                          │
  │                          ▼
  └─ Upload Image ─────► processing
                             │
                       (Analysis)
                             │
                             ▼
                       suggestions
                             │
                       ├─ Rescan ──────► processing
                       │
                       ├─ More ────────► expanded
                       │                    │
                       │                    └─ Back ─► suggestions
                       │
                       └─ Insert ─────► (same view, loading state)
```

---

## 11. Key Implementation Decisions

### 11.1 Why Lit over React?

- **Size:** Smaller bundle footprint for add-on constraints
- **Web Components:** Native browser support, better isolation
- **Adobe Alignment:** Spectrum Web Components are Lit-based
- **Simplicity:** Less boilerplate for this scope

### 11.2 Why Client-Side Asset Fetching?

- **No Backend Required:** Reduces infrastructure complexity
- **API Key Security:** Keys injected via webpack at build time
- **Latency:** Direct API calls avoid proxy overhead
- **Hackathon Constraint:** Faster to implement

### 11.3 Why Segment by Element Type?

- **Cognitive Load:** Users understand "I need a background" vs. generic suggestions
- **API Optimization:** Each type routes to the best source
- **Expandability:** New types can be added without UI changes

### 11.4 GIF Format Requirement

Adobe Express's `addAnimatedImage()` **only accepts GIF format**. The Tenor service explicitly:
- Prioritizes `media_formats.gif`
- Falls back to `media_formats.tinygif`
- Never uses MP4 (even though it's higher quality)

### 11.5 Unsplash Attribution

Per API guidelines:
- `trackDownload()` called on every insert
- Attribution metadata preserved in asset objects
- Credit shown in asset title on canvas

---

## 12. Testing & Validation

### 12.1 Feature Checklist

| Feature | Status |
|---------|--------|
| Welcome state displays correctly | ✅ |
| "Scan my Canvas" exports and analyzes | ✅ |
| "Import from Device" uploads and analyzes | ✅ |
| Processing state shows loader | ✅ |
| User context input works | ✅ |
| Suggestions display as cards | ✅ |
| Mini gallery shows thumbnails | ✅ |
| "+" button inserts assets | ✅ |
| "More" button opens expanded view | ✅ |
| Back button returns to suggestions | ✅ |
| Load More fetches additional results | ✅ |
| Custom GIF search works | ✅ |
| Rescan button re-analyzes canvas | ✅ |
| Error states display properly | ✅ |
| GIFs insert as animated | ✅ |
| Images insert as static | ✅ |
| Unsplash downloads are tracked | ✅ |

### 12.2 Manual Testing Scenarios

1. **Empty Canvas Test:**
   - Scan empty canvas
   - Should receive background/image suggestions

2. **Text-Only Canvas:**
   - Create canvas with text
   - Should receive suggestions for emphasis, backgrounds

3. **Complex Design:**
   - Upload multi-element design
   - Should receive targeted, non-redundant suggestions

4. **Error Handling:**
   - Disconnect network
   - Should display user-friendly error message

5. **Pagination:**
   - Open expanded gallery
   - Load More should fetch additional results

---

## Environment Variables

| Variable | Required | Default Provided | Description |
|----------|----------|------------------|-------------|
| `GEMINI_API_KEY` | Yes | Yes (dev) | Google Gemini API key |
| `UNSPLASH_ACCESS_KEY` | Yes | Yes (dev) | Unsplash API access key |
| `TENOR_API_KEY` | No | Yes | Tenor API key |

---

## Version History

| Version | Key Changes |
|---------|-------------|
| **5.0.0** | AI-powered segmented suggestions, multi-source assets, one-click insert, user context input |
| **4.0.0** | Two-phase UI with suggestions and resources |
| **3.0.0** | Canvas scanning with Gemini analysis |
| **2.0.0** | Image upload with OCR |
| **1.0.0** | Basic GIF search and insert |

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Package for distribution
npm run package
```

---

## Future Considerations

1. **Caching:** Implement result caching to reduce API calls
2. **Favorites:** Allow users to save favorite assets
3. **History:** Track recently used assets
4. **Collections:** Curated asset collections by theme
5. **Multi-Page:** Analyze multiple pages at once
6. **Color Matching:** Filter results by dominant colors in design

---

*This document provides a complete reference for understanding, maintaining, and extending the Loomis v5.0.0 implementation.*
