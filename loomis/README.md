# Loomis v5 - Adobe Express Add-on

An AI-powered Adobe Express add-on that analyzes your designs and provides intelligent suggestions for backgrounds, GIFs, memes, illustrations, and images.

## Features

- **🔍 Canvas Scanning**: Analyze your current canvas to get AI-powered suggestions
- **📤 Image Upload**: Upload an image to get design enhancement ideas
- **🎨 Multi-Source Assets**: Access content from Tenor (GIFs/Memes) and Unsplash (Images/Backgrounds/Illustrations)
- **⚡ One-Click Insert**: Add any asset directly to your canvas
- **📱 Segmented Suggestions**: Organized suggestions by element type with explanations

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env` file in the project root with the following keys:

```env
# Required - Gemini API Key for image analysis
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Required - Unsplash API Key for backgrounds, illustrations, images
# Get your key at: https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Optional - Tenor API Key (a default key is provided for development)
# Get your key at: https://developers.google.com/tenor/guides/quickstart
TENOR_API_KEY=your_tenor_api_key_here
```

**Note**: The `.env` file is gitignored and will not be committed to version control.

### 3. Start Development Server

```bash
npm run start
```

### 4. Load in Adobe Express

1. Open [Adobe Express](https://express.adobe.com)
2. Create or open a document
3. Go to Add-ons panel
4. Click "Load Add-on" and enter the local development URL (usually `http://localhost:3000`)

## Usage

### Scan Your Canvas
1. Click the **"✨ Scan my Canvas"** button
2. Wait for AI analysis
3. Browse segmented suggestions (backgrounds, GIFs, memes, illustrations, images)
4. Click **"+"** on any thumbnail to add it to your canvas
5. Click **"More"** to see a full gallery for any category

### Upload an Image
1. Click **"Import from Device"**
2. Select an image file
3. Browse AI-generated suggestions
4. Add assets to your canvas with one click

## Project Structure

```
loomis/
├── src/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── App.js          # Main UI component with v5 views
│   │   │   └── App.css.js      # Styles for all components
│   │   ├── services/
│   │   │   ├── geminiService.js      # Gemini Vision API (v5 analysis)
│   │   │   ├── tenorApi.js           # Tenor API (GIFs/Memes)
│   │   │   ├── unsplashApi.js        # Unsplash API (Images/Backgrounds)
│   │   │   └── assetOrchestrator.js  # Central asset fetching
│   │   └── index.js            # UI entry point
│   ├── sandbox/
│   │   └── code.js             # Document sandbox
│   ├── index.html              # HTML template
│   └── manifest.json           # Add-on manifest
├── package.json
└── webpack.config.js
```

## Technologies

- **Spectrum Web Components** - Adobe's design system components
- **Lit** - Web components framework
- **Gemini Vision API** - AI image analysis
- **Tenor API** - GIF and meme search
- **Unsplash API** - Stock photos, backgrounds, illustrations
- **Adobe Express Add-on SDK** - Integration with Adobe Express

## API Requirements

| API | Required | Free Tier | Purpose |
|-----|----------|-----------|---------|
| Gemini | Yes | Yes | Image analysis and suggestions |
| Unsplash | Yes | Yes (50 req/hr) | Photos, backgrounds, illustrations |
| Tenor | No* | Yes | GIFs and memes |

*A default Tenor key is included for development

## Commands

- `npm run start` - Start development server
- `npm run build` - Build for production
- `npm run clean` - Clean build artifacts
- `npm run package` - Package for distribution

## Version History

- **v5.0.0** - AI-powered segmented suggestions, multi-source assets, one-click insert
- **v4.0.0** - Two-phase UI with suggestions and resources
- **v3.0.0** - Canvas scanning with Gemini analysis
- **v2.0.0** - Image upload with OCR
- **v1.0.0** - Basic GIF search and insert

## Notes

- Uses `addAnimatedImage()` for GIFs to preserve animation
- Uses `addImage()` for static images from Unsplash
- Unsplash downloads are tracked per API guidelines
- No user data is stored (stateless)
