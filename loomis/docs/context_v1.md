# Loomis Add-on - Architecture & Code Structure Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Key Implementation Details](#key-implementation-details)
6. [API Integration](#api-integration)
7. [Styling & UI](#styling--ui)

---

## Architecture Overview

The Loomis add-on is built using **Adobe Express Add-on SDK** with a **two-runtime architecture**:

1. **UI Runtime (iframe)**: Handles user interface, search interactions, and displays results
2. **Document Sandbox Runtime**: Minimal runtime for potential future document manipulation APIs

### Technology Stack
- **Framework**: Lit (Web Components)
- **UI Components**: Spectrum Web Components (Adobe's design system)
- **Build Tool**: Webpack
- **API Provider**: Tenor API v2
- **Language**: JavaScript (ES6+)

### Architecture Pattern
- **Component-based**: Uses LitElement for reactive UI components
- **Service-oriented**: Separated API logic into a service module
- **Event-driven**: User interactions trigger state changes and API calls

---

## Project Structure

```
v1/
├── src/
│   ├── ui/                          # UI Runtime (iframe)
│   │   ├── components/
│   │   │   ├── App.js               # Main UI component
│   │   │   └── App.css.js          # Component styles
│   │   ├── services/
│   │   │   └── tenorApi.js         # Tenor API integration service
│   │   └── index.js                # UI entry point
│   ├── sandbox/                     # Document Sandbox Runtime
│   │   └── code.js                 # Sandbox API (minimal for MVP)
│   ├── models/
│   │   └── DocumentSandboxApi.ts  # TypeScript interface definitions
│   ├── index.html                  # HTML template
│   └── manifest.json               # Add-on manifest configuration
├── package.json                    # Dependencies and scripts
├── webpack.config.js               # Webpack build configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## Component Architecture

### 1. UI Entry Point (`src/ui/index.js`)

**Purpose**: Initializes the add-on and waits for SDK readiness

**Key Logic**:
- Imports the root component (`add-on-root`)
- Waits for `addOnUISdk.ready` promise to resolve
- Renders the main app component only after SDK is ready
- Uses Lit's `until` directive for async rendering

**Flow**:
```
SDK Load → SDK Ready → Render Root Component → Render App Component
```

### 2. Main App Component (`src/ui/components/App.js`)

**Purpose**: Main UI component handling search, results display, and GIF insertion

**State Management**:
- `_searchQuery`: Current search input value
- `_searchResults`: Array of GIF results from Tenor API
- `_isLoading`: Loading state for search operations
- `_errorMessage`: Error messages for user feedback
- `_insertingGifId`: Tracks which GIF is currently being inserted
- `_sandboxProxy`: Proxy to document sandbox APIs (not used in MVP)

**Key Methods**:

#### `firstUpdated()`
- Lifecycle hook called after component first renders
- Initializes sandbox proxy (for future use)
- Gets reference to UI runtime

#### `_handleSearchInput(e)`
- Updates `_searchQuery` state on input change
- Clears error messages when user types

#### `_handleSearchKeyPress(e)`
- Listens for Enter key press
- Triggers search without requiring button click
- Prevents default form submission

#### `_handleSearch()`
- Validates and cleans search query
- Sets loading state
- Calls Tenor API service
- Updates results or error state
- Handles empty results gracefully

#### `_handleInsertGif(gifResult)`
- Validates SDK availability
- Fetches GIF as blob from URL
- Calls `addAnimatedImage()` API
- Handles insertion errors
- Updates UI state during insertion

**Render Logic**:
- Conditionally renders based on state:
  - Loading state → Loading message
  - Results → Grid of GIF previews with insert buttons
  - Empty state → Helpful message
  - Error state → Error message display

### 3. Tenor API Service (`src/ui/services/tenorApi.js`)

**Purpose**: Encapsulates all Tenor API interactions and data processing

**Exported Functions**:

#### `cleanQuery(query)`
- **Input**: Raw user search string
- **Output**: Cleaned, normalized query string
- **Logic**:
  - Validates input type
  - Trims whitespace
  - Normalizes multiple spaces to single space
  - Limits length to 100 characters (very lenient)
- **Purpose**: Prevents API abuse and ensures consistent queries

#### `searchGifs(query, limit = 20)`
- **Input**: Search query, optional result limit
- **Output**: Promise resolving to `{ results: [], next: "" }`
- **Logic**:
  1. Cleans query using `cleanQuery()`
  2. Validates query is not empty
  3. Builds Tenor API URL with parameters:
     - `q`: Search query
     - `key`: API key
     - `client_key`: Client identifier
     - `limit`: Result count (clamped 1-50)
     - `media_filter`: "gif,tinygif,mp4" (optimizes response)
     - `contentfilter`: "medium" (safety filter)
     - `locale`: "en_US"
  4. Fetches from Tenor API
  5. Validates response structure
  6. Returns results array and pagination token
- **Error Handling**: Throws descriptive errors for network/API failures

#### `getGifUrl(result)`
- **Input**: Tenor API result object
- **Output**: GIF URL string or null
- **Priority Order**:
  1. `media_formats.gif.url` (full quality GIF)
  2. `media_formats.tinygif.url` (fallback)
  3. **NOT** MP4 (Adobe Express doesn't support it)
- **Critical**: Must return GIF format, not MP4, because `addAnimatedImage()` only accepts GIFs

#### `getPreviewUrl(result)`
- **Input**: Tenor API result object
- **Output**: Preview URL string or null
- **Priority Order**:
  1. `media_formats.tinygif.url` (smaller, faster loading)
  2. `media_formats.gif.url` (fallback)
- **Purpose**: Optimizes grid display performance with smaller preview images

### 4. Document Sandbox (`src/sandbox/code.js`)

**Purpose**: Document manipulation runtime (minimal for MVP)

**Current State**: Empty API object - no sandbox APIs needed for MVP

**Future Use**: Can be extended for document manipulation features that require sandbox context

### 5. TypeScript Interface (`src/models/DocumentSandboxApi.ts`)

**Purpose**: Type definitions for sandbox APIs

**Current State**: Empty interface - no APIs defined for MVP

**Future Use**: Type safety when adding sandbox APIs

---

## Data Flow

### Search Flow

```
User Input → cleanQuery() → searchGifs() → Tenor API
                                      ↓
                              API Response
                                      ↓
                            Update _searchResults
                                      ↓
                            Render Grid of GIFs
```

### Insert Flow

```
User Clicks "Add to Document"
        ↓
_handleInsertGif(gifResult)
        ↓
getGifUrl(result) → Returns GIF URL
        ↓
fetch(GIF URL) → Get Blob
        ↓
addOnUISdk.app.document.addAnimatedImage(blob, metadata)
        ↓
GIF Inserted into Adobe Express Document
```

### Error Flow

```
Error Occurs → Catch Block → Update _errorMessage → Render Error UI
```

---

## Key Implementation Details

### 1. GIF Format Selection

**Critical Decision**: Must use GIF format, not MP4

**Reason**: Adobe Express `addAnimatedImage()` API only accepts GIF format blobs. MP4 files will cause "Unsupported mime type" error.

**Implementation**:
- `getGifUrl()` prioritizes GIF format
- Explicitly avoids MP4 URLs
- Falls back to tinygif if full GIF unavailable

### 2. State Management

**Pattern**: Lit's reactive state properties

**Benefits**:
- Automatic UI updates on state change
- Simple, no external state library needed
- Component-scoped state

**State Properties**:
- All state prefixed with `_` (Lit convention for private state)
- Uses `@state()` decorator for reactive updates

### 3. Error Handling Strategy

**Layers**:
1. **Input Validation**: `cleanQuery()` validates input
2. **API Errors**: Caught in `searchGifs()` try-catch
3. **Insert Errors**: Caught in `_handleInsertGif()` try-catch
4. **User Feedback**: Error messages displayed in UI

**Error States**:
- Empty query → "Please enter a search term"
- API failure → "Failed to search GIFs. Please try again."
- No results → "No GIFs found. Try a different search term."
- Insert failure → "Failed to insert GIF. Please try again."

### 4. Loading States

**Implementation**:
- `_isLoading`: Tracks search operation
- `_insertingGifId`: Tracks individual GIF insertion
- Disables buttons during operations
- Shows loading messages

**UX Benefits**:
- Prevents duplicate requests
- Clear feedback to user
- Prevents UI freezing

### 5. Query Cleaning Logic

**Steps**:
1. Type validation (must be string)
2. Trim whitespace
3. Normalize spaces (multiple → single)
4. Length limit (100 chars)

**Rationale**:
- Prevents API abuse
- Ensures consistent queries
- Very lenient limit (not strict)

### 6. Media Format Selection

**For Insertion** (`getGifUrl`):
- Priority: GIF > tinygif
- Avoid: MP4 (not supported)

**For Preview** (`getPreviewUrl`):
- Priority: tinygif > GIF
- Reason: Smaller files = faster grid loading

---

## API Integration

### Tenor API Configuration

**Base URL**: `https://tenor.googleapis.com/v2`

**Endpoints Used**:
- `/search` - GIF search endpoint

**Required Parameters**:
- `key`: API key (from Tenor developer console)
- `q`: Search query string
- `client_key`: Client identifier ("loomis_addon")

**Recommended Parameters**:
- `limit`: Results count (default: 20, max: 50)
- `media_filter`: "gif,tinygif,mp4" (reduces response size)
- `contentfilter`: "medium" (content safety)
- `locale`: "en_US" (language/country)

**Response Structure**:
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "media_formats": {
        "gif": { "url": "string", "dims": [width, height] },
        "tinygif": { "url": "string", "dims": [width, height] },
        "mp4": { "url": "string", "dims": [width, height] }
      }
    }
  ],
  "next": "string" // Pagination token
}
```

### Adobe Express SDK Integration

**API Used**: `addOnUISdk.app.document.addAnimatedImage()`

**Parameters**:
1. **blob**: GIF file as Blob object
2. **attributes** (optional):
   - `title`: GIF title
   - `author`: Source attribution
3. **importAddOnData** (optional):
   - `nodeAddOnData`: Metadata attached to node
   - `mediaAddOnData`: Metadata attached to media

**Important**: 
- Must be called from UI runtime (iframe)
- Requires GIF format blob
- Preserves animation (unlike `addImage()`)

---

## Styling & UI

### CSS Architecture

**Location**: `src/ui/components/App.css.js`

**Pattern**: Lit CSS-in-JS using `css` template literal

**Structure**:
- Container layout
- Search section
- Results grid (CSS Grid)
- GIF item cards
- Error/empty states
- Loading states

### Design System

**Theme**: Spectrum Web Components (Express theme)
- System: `express`
- Color: `light`
- Scale: `medium`

**Components Used**:
- `sp-theme`: Theme wrapper
- `sp-button`: Buttons
- Native `<input>`: Search field (temporary - Spectrum textfield pending)

### Layout Strategy

**Grid Layout**:
- CSS Grid with `repeat(auto-fill, minmax(150px, 1fr))`
- Responsive columns
- Gap spacing: 12px

**Responsive Behavior**:
- Auto-adjusts columns based on panel width
- Minimum card width: 150px
- Scrollable container for overflow

### Visual States

**GIF Cards**:
- Hover effect: Slight lift + shadow
- Loading: Disabled state
- Inserting: Button shows "Inserting..." text

**Error Display**:
- Red background
- Clear error message
- Dismisses on new search

---

## Key Design Decisions

### 1. Why Native Input Instead of Spectrum Textfield?

**Current State**: Using native `<input>` element

**Reason**: `@spectrum-web-components/textfield` package installation issue

**Future**: Should switch to `<sp-textfield>` once package is installed

**Impact**: Minimal - native input styled to match Spectrum design

### 2. Why Minimal Sandbox?

**Decision**: Empty sandbox API for MVP

**Reason**: All functionality (GIF insertion) uses UI SDK directly

**Benefit**: Simpler architecture, fewer moving parts

**Future**: Can add sandbox APIs for advanced document manipulation

### 3. Why Service Module?

**Decision**: Separated API logic into `tenorApi.js`

**Benefits**:
- Separation of concerns
- Reusable functions
- Easier testing
- Cleaner component code

### 4. Why GIF Format Priority?

**Decision**: Prioritize GIF over MP4 for insertion

**Reason**: Adobe Express API limitation

**Trade-off**: Slightly larger files, but required for functionality

### 5. Why Content Filter Medium?

**Decision**: Use `contentfilter: "medium"`

**Reason**: Balance between content safety and result availability

**Impact**: Filters out explicit content while maintaining good results

---

## Future Extensibility

### Potential Enhancements

1. **Pagination**: Use `next` token for infinite scroll
2. **Search Suggestions**: Integrate Tenor autocomplete API
3. **Categories**: Show featured/trending categories
4. **Favorites**: Save frequently used GIFs
5. **Drag & Drop**: Enable dragging GIFs to canvas
6. **Sandbox APIs**: Add document manipulation features
7. **Error Recovery**: Retry logic for failed requests
8. **Caching**: Cache recent searches/results

### Code Structure Supports:
- Easy to add new API endpoints
- Component-based for feature additions
- Service module for new integrations
- TypeScript interfaces for type safety

---

## Build & Development

### Build Process

**Webpack Configuration**:
- Entry points: `ui/index.js` and `sandbox/code.js`
- Output: ES modules
- Externals: Adobe SDK modules (provided by runtime)

### Development Workflow

1. **Install**: `npm install`
2. **Build**: `npm run build`
3. **Start**: `npm run start` (dev server)
4. **Load**: Load add-on in Adobe Express from localhost

### Key Files

- `webpack.config.js`: Build configuration
- `package.json`: Dependencies and scripts
- `manifest.json`: Add-on metadata
- `tsconfig.json`: TypeScript config (for interfaces)

---

## Summary

The Loomis add-on follows a clean, simple architecture:

- **UI Layer**: Lit components with reactive state
- **Service Layer**: API integration separated from UI
- **SDK Integration**: Direct use of Adobe Express APIs
- **Error Handling**: Comprehensive error states
- **User Experience**: Loading states, clear feedback, responsive design

The codebase is designed for:
- **Simplicity**: Easy to understand and debug
- **Maintainability**: Clear separation of concerns
- **Extensibility**: Easy to add new features
- **Reliability**: Robust error handling

All core MVP requirements are implemented:
✅ Keyword search
✅ Results display
✅ GIF insertion
✅ Error handling
✅ Empty states
✅ Query cleaning
