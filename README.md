# Loomis
<img width="1004" height="297" alt="Screenshot 2026-01-17 at 10 40 42 AM" src="https://github.com/user-attachments/assets/63402f65-d3d2-43b8-b6db-6e9bab3951d4" />

**Loomis** is an AI-powered Adobe Express add-on that analyzes your designs and provides intelligent, segmented suggestions for backgrounds, GIFs, memes, illustrations, and images. Simply scan your canvas or upload an image, and Loomis will suggest relevant assets that enhance your design.

## ✨ Features

### 🎨 AI-Powered Design Analysis
- **Canvas Scanning**: Analyze your current Adobe Express canvas to get contextual suggestions
- **Image Upload**: Upload images from your device for analysis
- **User Context**: Provide optional context about your design's theme or purpose
- **Gemini Vision API**: Advanced AI analysis powered by Google Gemini

### 🎯 Segmented Suggestions
- **Organized by Element Type**: Suggestions are categorized into:
  - 🖼️ **Backgrounds** - Textures, gradients, and abstract backgrounds
  - ✨ **GIFs** - Animated content for engagement
  - 😂 **Memes** - Humor and relatability
  - 🎨 **Illustrations** - Artistic elements and graphics
  - 📷 **Images** - Stock photos and realistic visuals
- **Smart Explanations**: Each suggestion includes a reason why it helps your design
- **Preview Gallery**: See 5 preview items per suggestion before expanding

### 🚀 Multi-Source Asset Integration
- **Tenor API**: GIFs and memes
- **Unsplash API**: High-quality stock photos, backgrounds, and illustrations
- **One-Click Insert**: Add any asset directly to your canvas
- **Expanded Galleries**: Click "More" to browse full galleries with pagination

### 🔍 Custom Search
- **Direct GIF Search**: Search Tenor directly for specific GIFs
- **Quick Access**: Available alongside AI suggestions

## 📁 Project Structure

```
Loomi-Sense/
├── loomis/                    # Main add-on code (v5.0.0)
│   ├── src/
│   │   ├── ui/                # UI runtime code
│   │   │   ├── components/    # React/Lit components
│   │   │   │   ├── App.js     # Main UI component
│   │   │   │   └── App.css.js # Styles
│   │   │   └── services/      # API services
│   │   │       ├── geminiService.js      # Gemini Vision API
│   │   │       ├── tenorApi.js          # Tenor API (GIFs/Memes)
│   │   │       ├── unsplashApi.js       # Unsplash API (Images/Backgrounds)
│   │   │       └── assetOrchestrator.js # Central asset fetching
│   │   ├── sandbox/           # Document sandbox runtime
│   │   │   └── code.js
│   │   ├── index.html         # HTML template
│   │   └── manifest.json      # Add-on manifest
│   ├── package.json
│   ├── webpack.config.js
│   └── README.md              # Detailed setup guide
├── docs/                      # Project documentation
│   ├── requirements documwnt MVP v5.md  # v5 implementation plan
│   └── EXPORT_CONTEXT.md      # Canvas export guide
├── Versioning Document.md     # Version roadmap
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14+ and npm
- **Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)
- **Unsplash API Key** - [Get one here](https://unsplash.com/developers)
- **Tenor API Key** (optional) - [Get one here](https://developers.google.com/tenor/guides/quickstart)
- **Adobe Express** account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Loomi-Sense
   ```

2. **Install dependencies**
   ```bash
   cd loomis
   npm install
   ```

3. **Configure API Keys**

   Create a `.env` file in the `loomis/` directory:
   ```bash
   cd loomis
   touch .env
   ```

   Add your API keys:
   ```env
   # Required - Gemini API Key for image analysis
   GEMINI_API_KEY=your_gemini_api_key_here

   # Required - Unsplash API Key for backgrounds, illustrations, images
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

   # Optional - Tenor API Key (a default key is provided for development)
   TENOR_API_KEY=your_tenor_api_key_here
   ```

   **Note**: The `.env` file is gitignored and will not be committed to version control.

4. **Build the add-on**
   ```bash
   npm run build
   ```

5. **Start development server**
   ```bash
   npm run start
   ```

   The add-on will be served at `http://localhost:3000` (or the port shown in the terminal).

6. **Load in Adobe Express**
   - Open [Adobe Express](https://express.adobe.com)
   - Create or open a document
   - Go to **Add-ons** panel
   - Click **"Load Add-on"** and enter your local development URL
   - The Loomis add-on should appear in your panel

## 📖 Usage

### Scan Your Canvas

1. Create or open a document in Adobe Express
2. Add some content to the canvas
3. Click **"✨ Scan my Canvas"** button in the Loomis panel
4. Wait for AI analysis (typically 2-5 seconds)
5. Browse segmented suggestions organized by element type
6. Click **"+"** on any thumbnail to add it to your canvas
7. Click **"More"** to see a full gallery for any category

### Upload an Image

1. Click **"Import from Device"** button
2. Select an image file (JPEG, PNG, GIF, or WebP, max 10MB)
3. Optionally provide context in the "What's the theme about?" field
4. Browse AI-generated suggestions
5. Add assets to your canvas with one click

### Custom Search

1. Scroll to the custom search section
2. Enter a search query (e.g., "excited", "happy", "reaction")
3. Click **"Go"** or press Enter
4. Browse Tenor GIF results
5. Click **"+"** to add any GIF to your canvas

## 🛠️ Development

### Available Commands

```bash
cd loomis

# Start development server with hot reload
npm run start

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Package for distribution
npm run package
```

### Project Architecture

This is a **frontend-only** add-on. All functionality runs in the browser:

- **No backend server required** - All API calls are made directly from the browser
- **Direct API integration** - Tenor, Unsplash, and Gemini APIs are called client-side
- **Canvas export** - Uses Adobe Express SDK to export canvas as PNG
- **Client-side processing** - Image processing and analysis happen in the browser

### Key Technologies

- **Spectrum Web Components** - Adobe's design system components
- **Lit** - Web components framework
- **Gemini Vision API** - AI image analysis (v5)
- **Tenor API** - GIF and meme search
- **Unsplash API** - Stock photos, backgrounds, illustrations
- **Adobe Express Add-on SDK** - Integration with Adobe Express
- **Webpack** - Build tool

## 🔧 Configuration

### Environment Variables

The add-on requires API keys configured in `loomis/.env`:

| Variable | Required | Purpose | Get Key |
|----------|----------|---------|---------|
| `GEMINI_API_KEY` | Yes | AI image analysis | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `UNSPLASH_ACCESS_KEY` | Yes | Photos, backgrounds, illustrations | [Unsplash Developers](https://unsplash.com/developers) |
| `TENOR_API_KEY` | No* | GIFs and memes | [Tenor API](https://developers.google.com/tenor/guides/quickstart) |

*A default Tenor key is included for development, but you should use your own for production.

### API Rate Limits

- **Gemini**: Varies by plan (free tier available)
- **Unsplash**: 50 requests/hour (demo mode), higher limits available
- **Tenor**: Free tier available with generous limits

## 🐛 Troubleshooting

### Add-on Not Loading

1. Check that the development server is running
2. Verify the URL in Adobe Express matches your local server
3. Check browser console for errors
4. Ensure all API keys are correctly set in `.env`

### API Errors

**Gemini API Errors:**
- Verify your `GEMINI_API_KEY` is correct in `.env`
- Check API quota limits
- Ensure the API key has access to Gemini Vision models

**Unsplash API Errors:**
- Verify your `UNSPLASH_ACCESS_KEY` is correct
- Check rate limits (50 req/hr for demo mode)
- Ensure proper API key format

**Tenor API Errors:**
- Verify your `TENOR_API_KEY` is correct (or using default)
- Check API quota limits

### Canvas Export Errors

- Ensure you have content on the canvas before scanning
- Check that Adobe Express SDK is properly initialized
- Verify browser console for detailed error messages

### Build Errors

1. Clear `node_modules` and reinstall:
   ```bash
   cd loomis
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clean build artifacts:
   ```bash
   cd loomis
   npm run clean
   npm run build
   ```

## 📚 Documentation

- **[loomis/README.md](./loomis/README.md)** - Detailed setup and development guide
- **[Versioning Document.md](./Versioning%20Document.md)** - Version roadmap and history
- **[docs/EXPORT_CONTEXT.md](./docs/EXPORT_CONTEXT.md)** - Canvas export implementation guide
- **[docs/requirements documwnt MVP v5.md](./docs/requirements%20documwnt%20MVP%20v5.md)** - v5 implementation plan

## 📝 Version History

### Version 5.0.0 (Current)
- ✨ AI-powered segmented suggestions
- 🎯 Multi-source assets (Tenor + Unsplash)
- 🔍 Custom search functionality
- 📱 One-click insert for all asset types
- 🎨 Enhanced UI with expanded galleries

### Version 4.0.0
- Two-phase UI with suggestions and resources
- Enhanced Gemini analysis

### Version 3.0.0
- Canvas scanning with Gemini analysis

### Version 2.0.0
- Image upload with OCR

### Version 1.0.0
- Basic GIF search and insert

See [Versioning Document.md](./Versioning%20Document.md) for the complete roadmap.

## 🤝 Contributing

This project is currently in active development. For questions or issues, please open an issue on the repository.

## 📄 License

MIT

---

**Built with ❤️ for Adobe Express**
