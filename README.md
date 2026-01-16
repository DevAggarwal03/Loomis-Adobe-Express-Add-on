<img width="1920" height="720" alt="Untitled" src="https://github.com/user-attachments/assets/7a10cc4d-1dac-4c80-bc4b-f333a50fa651" />

# Loomis

An Adobe Express add-on that allows users to quickly search for and insert memes/GIFs from Tenor directly into their designs. The add-on uses AI to understand images and suggest relevant search queries.

## Features

### Version 1 - Keyword Search (MVP)

- 🔍 Keyword-based meme/GIF search
- 🖼️ Visual preview grid of search results
- 🖱️ One-click insert GIFs into your document
- ⚡ Fast and responsive UI
- 🛡️ Error handling and graceful degradation

### Version 2 - Image Upload & AI Understanding

- 📤 Upload images from device
- 🤖 AI-powered image analysis using Google Gemini
- ✏️ Auto-filled search query (editable)
- 🎯 Smart search suggestions based on image content

### Version 3 - Scan from Canvas

- 📸 Scan current canvas as PNG
- 🔍 AI analyzes canvas content
- ✏️ Auto-filled search query with visual hint
- 🎨 Seamless workflow: Scan → Edit → Search

## Project Structure

```
Loomis/
├── v3/                    # Current version (v3 implementation)
│   ├── src/
│   │   ├── ui/            # UI runtime code
│   │   │   ├── components/ # React/Lit components
│   │   │   └── services/   # API services (Tenor, Gemini)
│   │   ├── sandbox/        # Document sandbox runtime
│   │   └── manifest.json   # Add-on manifest
│   ├── docs/              # Version-specific documentation
│   └── package.json
├── docs/                   # Project documentation
│   ├── requirements document MVP v1.md
│   ├── requirements document MVP v2.md
│   ├── requirements document MVP v3.md
│   └── Tenor API Endpoints.md
├── Versioning Document.md  # Version roadmap
└── README.md              # This file
```

## Prerequisites

- Node.js 14+ and npm
- Tenor API key ([Get one here](https://developers.google.com/tenor/guides/quickstart))
- Google Gemini API key ([Get one here](https://ai.google.dev/))
- Adobe Express account

## Setup

### 1. Install Dependencies

```bash
cd v3
npm install
```

### 2. Configure API Keys

Create a `.env` file in the `v3/` directory:

```bash
cd v3
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
TENOR_API_KEY=your_tenor_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: The `.env` file is gitignored and will not be committed to version control.

### 3. Build the Add-on

```bash
cd v3
npm run build
```

### 4. Start Development Server

```bash
cd v3
npm run start
```

The add-on will be served at `https://localhost:5241` for development.

### 5. Load Add-on in Adobe Express

1. Open [Adobe Express](https://express.adobe.com)
2. Create or open a document
3. Go to Add-ons panel
4. Click "Load Add-on" and enter: `https://localhost:5241`
5. Accept the SSL certificate warning (development only)
6. The Loomis add-on should appear in your panel

## Usage

### Basic Search (v1)

1. Enter a search term in the text field (e.g., "excited", "happy", "reaction")
2. Click "Search" or press Enter
3. Browse the results in the grid
4. Click "Add to Document" on any GIF to insert it into your design

### Upload & Analyze (v2)

1. Click "Upload from Device" button
2. Select an image file (JPEG, PNG, GIF, or WebP)
3. The AI analyzes the image and auto-fills the search box
4. Edit the search query if needed
5. Click "Search" to find relevant GIFs

### Scan from Canvas (v3)

1. Create or open a document in Adobe Express
2. Add some content to the canvas
3. Click "Scan from Canvas" button
4. The current page is captured and analyzed by AI
5. The search box auto-fills with a suggested query (highlighted in blue)
6. Edit the search query if needed
7. Click "Search" to find relevant GIFs

## Development

### Development Commands

```bash
cd v3

# Start development server with hot reload
npm run start

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

The development server runs on `https://localhost:5241` with hot reload enabled.

## Configuration

### Environment Variables

The add-on requires two API keys configured in `v3/.env`:

```env
TENOR_API_KEY=your_tenor_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Tenor API Key**: Used for searching and retrieving GIFs

- Get one at: https://developers.google.com/tenor/guides/quickstart

**Gemini API Key**: Used for AI-powered image analysis (v2 & v3)

- Get one at: https://ai.google.dev/

## Building for Production

```bash
cd v3
npm run build
```

The built files will be in `v3/dist/`. Package this directory as a zip file for distribution or deployment.

**Note**: This is a frontend-only add-on. All API calls are made directly from the browser. No backend server is required.

## Troubleshooting

### Add-on Not Loading

1. Check that the development server is running on `https://localhost:5241`
2. Verify the URL in Adobe Express matches your local server
3. Accept the SSL certificate warning in your browser (development only)
4. Check browser console for errors

### SSL Certificate Issues

If you see SSL certificate warnings:

```bash
cd v3
npx @adobe/ccweb-add-on-ssl setup --hostname localhost
```

### API Errors

1. **Tenor API Errors**:

   - Verify your `TENOR_API_KEY` is correct in `.env`
   - Check API quota limits
   - Ensure the API key has proper permissions

2. **Gemini API Errors**:

   - Verify your `GEMINI_API_KEY` is correct in `.env`
   - Check API quota limits
   - Ensure the API key has access to the Gemini model

3. **Canvas Export Errors**:
   - Ensure you have content on the canvas before scanning
   - Check that Adobe Express SDK is properly initialized
   - Verify browser console for detailed error messages

### Build Errors

1. Clear `node_modules` and reinstall:

   ```bash
   cd v3
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clean build artifacts:
   ```bash
   cd v3
   npm run clean
   npm run build
   ```

## Version History

### Version 1 (MVP) - Keyword Search

- Basic keyword-based GIF search
- Visual preview grid
- One-click insertion into documents
- Error handling and empty states

### Version 2 - Image Upload & AI Understanding

- Image upload from device
- AI-powered image analysis using Google Gemini
- Auto-filled search queries (editable)
- Smart search suggestions based on image content

### Version 3 - Scan from Canvas

- Scan current canvas as PNG
- AI analyzes canvas content
- Auto-filled search query with visual hint
- Seamless workflow integration

See [Versioning Document.md](./Versioning Document.md) for the complete roadmap.

## Technologies

- **Spectrum Web Components** - UI components (Adobe Design System)
- **Lit** - Web components framework
- **Tenor API** - GIF search provider
- **Google Gemini API** - AI image analysis (v2 & v3)
- **Adobe Express Add-on SDK** - Integration with Adobe Express
- **Webpack** - Build tool

## Architecture

This is a **frontend-only** add-on. All functionality runs in the browser:

- No backend server required
- Direct API calls to Tenor and Gemini from the browser
- Canvas export using Adobe Express SDK
- Client-side image processing and analysis

## License

MIT
