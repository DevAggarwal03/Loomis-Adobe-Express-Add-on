# Loomis - Adobe Express Add-on

A simple Adobe Express add-on that allows users to search for memes and GIFs using Tenor API and insert them directly into their designs.

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Tenor API Key

- Sign up for a free API key at [Tenor API](https://developers.google.com/tenor/guides/quickstart)
- Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- Open `.env` and set `TENOR_API_KEY=your_actual_api_key_here`

### 3. Build the Add-on

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run start
```

### 5. Load in Adobe Express

- Open [Adobe Express](https://express.adobe.com)
- Navigate to Add-ons, select "Load Add-on", and enter your dev server URL (`http://localhost:3000` by default)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Tenor API Key

1. Get a free API key from [Tenor API](https://developers.google.com/tenor/guides/quickstart)
2. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and add your API key:
   ```
   TENOR_API_KEY=your_actual_api_key_here
   ```

**Note**: The `.env` file is gitignored and will not be committed to version control.

### 3. Build the Add-on

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run start
```

### 5. Load in Adobe Express

1. Open [Adobe Express](https://express.adobe.com)
2. Create or open a document
3. Go to Add-ons panel
4. Click "Load Add-on" and enter the local development URL (usually `http://localhost:3000`)

## Usage

1. Enter a search term in the text field (e.g., "excited", "happy", "reaction")
2. Click "Search" or press Enter
3. Browse the results in the grid
4. Click "Add to Document" on any GIF to insert it into your design

## Project Structure

```
v1/
├── src/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── App.js          # Main UI component
│   │   │   └── App.css.js      # Styles
│   │   ├── services/
│   │   │   └── tenorApi.js     # Tenor API integration
│   │   └── index.js            # UI entry point
│   ├── sandbox/
│   │   └── code.js             # Document sandbox (minimal for MVP)
│   ├── models/
│   │   └── DocumentSandboxApi.ts  # TypeScript interface
│   ├── index.html              # HTML template
│   └── manifest.json           # Add-on manifest
├── package.json
└── webpack.config.js
```

## Technologies

- **Spectrum Web Components** - UI components
- **Lit** - Web components framework
- **Tenor API** - GIF search provider
- **Adobe Express Add-on SDK** - Integration with Adobe Express

## Requirements

- Node.js 14+
- npm or yarn
- Tenor API key (free)

## Development

- `npm run start` - Start development server
- `npm run build` - Build for production
- `npm run clean` - Clean build artifacts

## Notes

- The add-on uses `addAnimatedImage()` API to preserve GIF animations
- Search results are limited to 20 per query (configurable)
- Content filter is set to "medium" for safety
- No user data is stored (stateless)
