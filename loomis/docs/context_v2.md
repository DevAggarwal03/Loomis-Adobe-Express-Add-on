# Loomis Add-on - Architecture Documentation (v2)

## Overview

Adobe Express add-on for finding and inserting memes/GIFs with AI-assisted query generation from uploaded images.

**Tech Stack**: Lit (Web Components), Spectrum Web Components, Webpack, Tenor API, Google Gemini AI

**Architecture**: Two-runtime (UI Runtime + Document Sandbox)

---

## Project Structure

```
v2/
├── src/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── App.js              # Main component
│   │   │   └── App.css.js         # Styles
│   │   ├── services/
│   │   │   ├── tenorApi.js        # Tenor API service
│   │   │   └── geminiService.js   # Gemini AI service (NEW)
│   │   └── index.js
│   ├── sandbox/code.js
│   └── manifest.json
├── package.json
├── webpack.config.js
└── .env                            # API keys
```

---

## Components

### App.js
Main UI component with state:
- `_searchQuery`: Search input
- `_searchResults`: GIF results
- `_isLoading`: Search loading
- `_isProcessingUpload`: Upload/AI processing (NEW)
- `_errorMessage`: Error messages
- `_insertingGifId`: Current insertion

**Key Methods**:
- `_handleSearch()`: Text search
- `_handleFileUpload()`: Upload + AI processing (NEW)
- `_handleInsertGif()`: Insert GIF into document

### tenorApi.js
- `searchGifs(query, limit)`: Search Tenor API
- `cleanQuery(query)`: Normalize search query
- `getGifUrl(result)`: Get GIF URL (GIF format only, not MP4)
- `getPreviewUrl(result)`: Get preview URL (tinygif preferred)

### geminiService.js (NEW)
- `performOCR(base64Image, mimeType)`: Analyze image and generate search query
  - Uses `gemini-3-flash-preview` model
  - Multimodal input (image + text prompt)
  - Returns 2-3 word query optimized for Tenor

---

## Data Flow

### Text Search
```
User Input → cleanQuery() → searchGifs() → Tenor API → Results
```

### Upload + AI Search (NEW)
```
Upload File → Validate → Base64 → Gemini AI → Generate Query → 
Auto-fill (editable) → User edits → Search → Results
```

### Insert GIF
```
Click Insert → getGifUrl() → Fetch Blob → addAnimatedImage() → Inserted
```

---

## Key Details

### GIF Format
- **Critical**: Must use GIF format (not MP4) for `addAnimatedImage()`
- Priority: `gif` > `tinygif` (for insertion)
- Preview: `tinygif` > `gif` (faster loading)

### File Upload (NEW)
- **Types**: JPEG, PNG, GIF, WebP
- **Max Size**: 10MB
- **Process**: File → Base64 → Gemini AI → Query

### Environment Variables
- `GEMINI_API_KEY`: Required for image upload
- `TENOR_API_KEY`: Optional (shows warning if missing)
- Loaded via `dotenv-webpack` in webpack.config.js

### Error Handling
- File validation (type, size)
- API key validation
- Specific error messages (quota, network, invalid key)
- User-friendly feedback

---

## API Integration

### Tenor API
- **Endpoint**: `https://tenor.googleapis.com/v2/search`
- **Params**: `q`, `key`, `client_key`, `limit`, `media_filter`, `contentfilter`
- **Response**: `{ results: [], next: "" }`

### Gemini AI (NEW)
- **Package**: `@google/genai` (v0.6.1+)
- **Model**: `gemini-3-flash-preview`
- **Input**: Base64 image + text prompt
- **Output**: Search query string

### Adobe Express SDK
- `addAnimatedImage(blob, attributes, metadata)`: Inserts GIF into document

---

## v2 Enhancements

**New Features**:
1. File upload from device
2. AI-assisted query generation (Gemini)
3. Editable AI-generated queries
4. Enhanced error handling
5. Environment variable support

**New Dependencies**:
- `@google/genai`: ^0.6.1
- `dotenv-webpack`: ^8.0.1

**New Files**:
- `src/ui/services/geminiService.js`

**Updated Files**:
- `App.js`: Added upload methods and state
- `webpack.config.js`: Added Dotenv plugin
- `package.json`: Added new dependencies

---

## Setup

1. **Install**: `npm install`
2. **Create `.env`**:
   ```
   GEMINI_API_KEY=your_key_here
   TENOR_API_KEY=your_key_here
   ```
3. **Build**: `npm run build`
4. **Start**: `npm run start`

---

## Summary

**Architecture**: Service-oriented with Lit components

**Features**:
- ✅ Keyword search
- ✅ File upload (NEW)
- ✅ AI query generation (NEW)
- ✅ Editable queries (NEW)
- ✅ GIF insertion
- ✅ Error handling

**Design Decisions**:
- GIF format only (Adobe Express limitation)
- Service modules for separation of concerns
- Editable AI queries for user control
- 10MB file size limit
