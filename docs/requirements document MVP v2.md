# 📄 Requirements Document

**Project:** Loomis — One-Stop Expressive Add-on for Adobe Express  
**Version:** MVP v2  
**Purpose:** Enable users to intelligently find and insert relevant memes/GIFs into Adobe Express using text input or image upload with AI-assisted query generation.

---

## 1. Objective

The objective of this project is to build an Adobe Express add-on that allows users to:

- Search for relevant reaction memes/GIFs using text-based keyword input.
- Upload images from their device and get AI-assisted search query suggestions.
- Browse and preview results inside Adobe Express.
- Insert selected memes/GIFs directly into their design.

The system prioritizes **speed, relevance, and in-flow usability**, with lightweight AI used only where it clearly improves results.

---

## 2. Scope

### 2.1 In Scope (MVP v2)

- Keyword-based meme/GIF search
- External meme/GIF provider integration (Tenor)
- Search result display inside Adobe Express
- One-click insert into canvas
- Basic query cleaning and normalization
- **Upload from Device** workflow: Users can upload image files from their device
- AI-assisted query generation from uploaded images using Google Gemini
- Editable search query field (users can edit AI-generated queries before searching)
- Error handling and empty states
- Demo readiness

**Note:** Canvas scanning/selection functionality is v3 scope and is NOT included in v2.

### 2.2 Out of Scope (Post-MVP)

- Canvas scanning/selection (v3 scope)
- Training custom ML models
- Advanced computer vision (face/object recognition)
- User accounts or personalization
- Analytics and tracking
- Monetization
- Meme generation from scratch
- Social or sharing features

---

## 3. Users

### 3.1 Primary Users

- Content creators using Adobe Express
- Social media managers
- Designers creating fast visual content

### 3.2 User Needs

Users need to:

- Quickly find expressive visuals without leaving Adobe Express.
- Get better suggestions based on what they are currently designing.
- Avoid manual browsing on external platforms.
- Maintain creative flow while designing.

---

## 3.3 Architecture & Technical Stack

### 3.3.1 Architecture Overview

The add-on follows a **two-runtime architecture**:

- **UI Runtime**: Handles user interface, state management, and user interactions
- **Document Sandbox Runtime**: Handles document manipulation and canvas operations

### 3.3.2 Technical Stack

- **UI Framework**: Lit (Web Components)
- **Component Library**: Adobe Spectrum Web Components
- **Architecture Pattern**: Service-oriented design with separate service modules
- **AI Service**: Google Gemini AI via `@google/genai` package
- **Content Provider**: Tenor API

### 3.3.3 Service Layer

The application uses a service-oriented architecture with dedicated service modules:

- **`tenorApi.js`**: Handles Tenor API interactions (search, URL extraction)
- **`geminiService.js`**: Handles Google Gemini AI integration for image analysis and query generation

### 3.3.4 File Structure

```
src/
├── ui/
│   ├── components/
│   │   ├── App.js (Main Lit component)
│   │   └── App.css.js (Styles)
│   └── services/
│       ├── tenorApi.js (Tenor API service)
│       └── geminiService.js (Gemini AI service)
└── sandbox/
    └── code.js (Document sandbox runtime)
```

---

## 4. Functional Requirements

### 4.1 Add-on UI

- The system must provide a text input field for user queries.
- The system must provide an **"Upload from Device"** button that allows users to select and upload image files from their device.
- The system must display search results as a scrollable grid of previews.
- The system must allow users to insert a selected GIF/meme into the canvas.
- The system must support one-click insert.
- The search input field must support pre-filled values that users can edit before searching.

---

### 4.2 Search Behavior

- The system must accept free-text keyword input.
- The system must clean and normalize input.
- The system must support AI-enhanced search via image upload:
  - User uploads image → Gemini analyzes → Query auto-filled → User edits → Search
- The system must use Gemini's vision capabilities for AI query generation.
- The system must reject empty or invalid queries with user feedback.

---

### 4.3 Upload from Device Workflow

- The system must provide an "Upload from Device" button.
- The system must allow users to select image files from their device (via file input).
- The system must support common image formats (JPEG, PNG, GIF, WebP).
- The system must convert uploaded image to base64 format.
- The system must send the base64 image to Gemini API via `geminiService.performOCR()`.
- The system must display a loading state while Gemini processes the image.
- The system must auto-fill the search input field with the Gemini-generated query.
- The system must allow users to edit the auto-filled query before clicking search.
- The system must handle file upload errors and invalid file types gracefully.
- The system must show error messages if Gemini processing fails.

**Note:** Canvas scanning/selection is v3 scope and is NOT included in v2.

---

### 4.4 Backend Behavior

- The system must forward search requests to the external provider (Tenor API).
- The system must return ranked results.
- The system must respond within a reasonable latency threshold.
- The system must handle provider or AI service failures gracefully.

### 4.5 Gemini Service Integration

#### 4.5.1 Service Overview

The `geminiService.js` module provides AI-powered image analysis using Google Gemini AI.

#### 4.5.2 Function: `performOCR(base64Image, mimeType)`

**Purpose**: Analyzes an uploaded image and generates a search query optimized for Tenor GIF search.

**Parameters**:

- `base64Image` (string): Base64-encoded image data (with or without data URI prefix)
- `mimeType` (string): MIME type of the image (e.g., "image/jpeg", "image/png")

**Returns**: Promise<string> - A 2-3 word search query string

**Implementation Details**:

- Uses Google Gemini AI via `@google/genai` package
- Model: `gemini-3-flash-preview`
- Prompt: "Analyze this image and identify the core emotion, reaction, or action being performed. Generate a 2-3 word search query optimized for Tenor GIF search (e.g., 'eye roll,' 'shocked face,' 'dancing happy'). Output only the search string."
- Handles base64 encoding (strips data URI prefix if present)
- Throws error if Gemini API call fails

**Error Handling**:

- Catches Gemini API errors and throws user-friendly error message
- Returns "No text could be extracted." if response is empty

#### 4.5.3 Integration Flow

**Upload from Device Flow (v2)**:

1. User clicks "Upload from Device" → File picker opens
2. User selects image → File validated (type, size)
3. File read as base64 using FileReader API
4. Loading state displayed: "Processing image..."
5. `geminiService.performOCR(base64Image, mimeType)` called
6. Gemini processes image and returns query
7. Search input field auto-filled with query
8. Loading state cleared
9. User can edit query before clicking search
10. User clicks Search → Tenor API search → Results display

---

### 4.6 Result Handling

- The system must display at least a preview image for each result.
- The system must allow selecting one result at a time.
- The system must handle cases where no results are found.

---

### 4.7 Error Handling

- The system must show a clear message when:
  - No results are found
  - The provider (Tenor API) is unavailable
  - File upload fails (invalid format, file read errors)
  - Gemini API fails or times out
  - Image processing fails
- The system must provide fallback to manual keyword search if Gemini processing fails.
- The system must display loading states during Gemini processing.
- The system must handle file validation errors (unsupported formats, file size limits).
- The system must never crash or freeze the Adobe Express UI.

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Search results should appear within 3 seconds in normal conditions (keyword search).
- Image upload and Gemini processing may add 1-2 seconds to the workflow.
- The add-on must remain responsive during loading.
- Gemini API calls should complete within 5 seconds under normal conditions.

---

### 5.2 Reliability

- The system must function correctly even if Gemini API fails (fallback to manual keyword search).
- The system must degrade gracefully during Gemini API outages.
- The system must handle Gemini API rate limits gracefully.
- The system must function if Gemini API is unavailable (users can still use manual keyword search).

---

### 5.3 Usability

- The UI must be simple and discoverable.
- The search and insert flow should take no more than 3 interactions.
- Error messages must be understandable by non-technical users.

---

### 5.4 Security

- The system must sanitize user input.
- The system must not store any user data.
- No canvas content should be persisted.

---

### 5.5 Compatibility

- The add-on must work within Adobe Express constraints.
- The add-on must not interfere with existing Express functionality.

---

## 6. Constraints

- Must use Tenor as the content provider.
- Must run as an Adobe Express add-on.
- No persistent user storage.
- AI usage must be API-based (Google Gemini, no local training).
- Must use `@google/genai` package for Gemini integration.
- Requires Gemini API key (via environment variable `API_KEY`).
- Development timeline is limited and fixed (hackathon scope).
- Images must be converted to base64 format for Gemini API.

---

## 7. Assumptions

- Tenor API remains available and stable.
- Adobe Express supports required extension APIs.
- Gemini API remains available and stable.
- Gemini API key is accessible during development and deployment.
- Gemini vision API supports the required image analysis capabilities.
- Users understand basic keyword search behavior.
- Users can upload image files from their device.

---

## 8. Risks

| Risk                      | Mitigation                                 |
| ------------------------- | ------------------------------------------ |
| Gemini API latency        | Use loading states + timeout handling      |
| Gemini API failures       | Fallback to manual keyword search          |
| Gemini API rate limits    | Error handling with user-friendly messages |
| Gemini query inaccuracies | Allow manual query editing before search   |
| File upload errors        | Validate file types and sizes, show errors |
| Tenor rate limits         | Caching and throttling                     |
| Adobe API changes         | Early testing                              |

---

## 9. Success Criteria

The MVP v2 is successful if:

- A user can upload an image, get AI-generated query, and insert a meme in under 15 seconds (accounts for Gemini processing time).
- Gemini-generated queries improve relevance compared to manual keyword entry.
- Users can successfully edit auto-filled queries before searching.
- The system works reliably in demos.
- Judges can understand the product within one minute of use.
- The system gracefully handles Gemini API failures with fallback to manual search.

---

## 10. Future Extensions (Not part of MVP v2)

### 10.1 v3 Scope (Next Version)

- **Canvas scanning/selection**: Users can scan content directly from the Adobe Express canvas
- Capture current canvas or screen region
- Manual scan trigger (no auto capture)
- Frame passed to Gemini for analysis
- Search box auto-filled and editable

### 10.2 Post-v3 Extensions

- Emotion detection from images
- Personalized ranking
- Meme generation
- Support for other creative tools
- User favorites and history

---

## 11. Technical Implementation Notes

### 11.1 Service Pattern

The application follows v1's service-oriented architecture:

- Separate service modules for API interactions (`tenorApi.js`, `geminiService.js`)
- Services are imported and used in `App.js` component
- Separation of concerns: UI components handle state, services handle API calls

### 11.2 Upload from Device Implementation

**Component Structure (in `App.js`)**:

- Add `_isProcessingUpload` state property (boolean) to track Gemini processing
- Add `_handleFileUpload(e)` method that:
  1. Gets selected file from event
  2. Validates file type and size (recommended: max 10MB)
  3. Reads file as base64 using FileReader API
  4. Sets `_isProcessingUpload = true`
  5. Calls `performOCR(base64Image, mimeType)` from geminiService
  6. Updates `_searchQuery` with result (allows editing)
  7. Sets `_isProcessingUpload = false`
  8. Handles errors appropriately

**UI Elements**:

- Hidden file input: `<input type="file" accept="image/*" @change=${this._handleFileUpload}>`
- Upload button: `<sp-button>` that triggers file input click
- Loading state: Display "Processing image..." when `_isProcessingUpload` is true
- Disable upload button during processing

**File Handling**:

- Supported formats: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- File size validation recommended (e.g., max 10MB)
- Extract MIME type from selected file for Gemini API
- Convert to base64 format (remove data URI prefix before sending to Gemini)

**Error Handling**:

- File read failures
- Unsupported formats
- File size exceeded
- Gemini API errors
- Network timeouts

**Environment Variables**:

- `API_KEY`: Google Gemini API key
- `TENOR_API_KEY`: Tenor API key
