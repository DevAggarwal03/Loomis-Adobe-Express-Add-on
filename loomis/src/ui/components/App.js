// Spectrum Web Components - Express Theme
import "@spectrum-web-components/styles/typography.css";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/express/scale-medium.js";

// Spectrum Components
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/textfield/sp-textfield.js";
import "@spectrum-web-components/search/sp-search.js";
import "@spectrum-web-components/progress-circle/sp-progress-circle.js";
import "@spectrum-web-components/divider/sp-divider.js";
import "@spectrum-web-components/field-label/sp-field-label.js";

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { style } from "./App.css";

import { RuntimeType } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { analyzeDesignV5 } from "../services/geminiService.js";
import {
  fetchAssetsForAllSuggestions,
  fetchExpandedGalleryAssets,
  ELEMENT_ICONS,
} from "../services/assetOrchestrator.js";
import { trackDownload } from "../services/unsplashApi.js";
import { getGifUrl, searchGifs, getPreviewUrl as getTenorPreviewUrl } from "../services/tenorApi.js";

@customElement("add-on-app")
export class App extends LitElement {
  @property({ type: Object })
  addOnUISdk;

  @state()
  _sandboxProxy;

  // View state: 'welcome' | 'processing' | 'suggestions' | 'expanded'
  @state()
  _currentView = "welcome";

  @state()
  _errorMessage = "";

  @state()
  _isProcessing = false;

  @state()
  _analysisResult = null;

  @state()
  _enrichedSuggestions = [];

  @state()
  _expandedContext = null;

  @state()
  _expandedResults = [];

  @state()
  _expandedLoading = false;

  @state()
  _expandedPage = 1;

  @state()
  _expandedHasMore = false;

  @state()
  _insertingAssetId = null;

  @state()
  _customSearchQuery = "";

  @state()
  _customSearchResults = [];

  @state()
  _customSearchLoading = false;

  @state()
  _customSearchError = "";

  @state()
  _userContext = "";

  static get styles() {
    return style;
  }

  async firstUpdated() {
    const { runtime } = this.addOnUISdk.instance;
    this._sandboxProxy = await runtime.apiProxy(RuntimeType.documentSandbox);
  }

  _readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert blob to base64"));
      reader.readAsDataURL(blob);
    });
  }

  async _exportCanvasAsPNG() {
    if (!this.addOnUISdk?.app?.document) {
      throw new Error("Add-on SDK not ready. Please try again.");
    }

    try {
      const renditions = await this.addOnUISdk.app.document.createRenditions({
        range: "currentPage",
        format: "image/png",
      });

      if (!renditions || renditions.length === 0 || !renditions[0].blob) {
        throw new Error("Failed to export canvas. No rendition received.");
      }

      return renditions[0].blob;
    } catch (error) {
      console.error("Canvas export error:", error);
      throw new Error(error.message || "Failed to export canvas. Please try again.");
    }
  }

  _handleContextInput(e) {
    this._userContext = e.target.value;
  }

  _handleUploadButtonClick() {
    const fileInput = this.shadowRoot.querySelector("#file-input");
    if (fileInput) {
      fileInput.click();
    }
  }

  async _handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      this._errorMessage = "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this._errorMessage = "File size too large. Please upload an image under 10MB.";
      return;
    }

    await this._processImage(
      () => this._readFileAsBase64(file),
      file.type,
      "Analyzing image..."
    );

    e.target.value = "";
  }

  async _handleScanFromCanvas() {
    await this._processImage(
      async () => {
        const blob = await this._exportCanvasAsPNG();
        return this._blobToBase64(blob);
      },
      "image/png",
      "Analyzing canvas..."
    );
  }

  async _processImage(getBase64Fn, mimeType, loadingText) {
    this._currentView = "processing";
    this._errorMessage = "";
    this._analysisResult = null;
    this._enrichedSuggestions = [];

    try {
      const base64Image = await getBase64Fn();
      const userContext = this._userContext.trim() || null;
      const result = await analyzeDesignV5(base64Image, mimeType, userContext);
      this._analysisResult = result;

      const enriched = await fetchAssetsForAllSuggestions(result.suggestions, 5);
      this._enrichedSuggestions = enriched;

      this._currentView = "suggestions";
    } catch (error) {
      console.error("Processing error:", error);
      this._errorMessage = error.message || "Failed to process image. Please try again.";
      this._currentView = "welcome";
    }
  }

  async _handleExpandGallery(suggestion) {
    this._expandedContext = {
      segment_id: suggestion.segment_id,
      element_type: suggestion.element_type,
      search_query: suggestion.more_action?.search_query || suggestion.search_keywords.join(" "),
      title: suggestion.title,
    };
    this._expandedResults = [];
    this._expandedPage = 1;
    this._expandedHasMore = false;
    this._currentView = "expanded";
    this._expandedLoading = true;

    try {
      const response = await fetchExpandedGalleryAssets(
        suggestion.element_type,
        this._expandedContext.search_query,
        20,
        1
      );
      this._expandedResults = response.results;
      this._expandedHasMore = response.hasMore;
      this._expandedPage = response.nextPage;
    } catch (error) {
      console.error("Failed to load expanded gallery:", error);
      this._errorMessage = "Failed to load more results.";
    } finally {
      this._expandedLoading = false;
    }
  }

  async _handleLoadMore() {
    if (!this._expandedContext || this._expandedLoading) return;

    this._expandedLoading = true;

    try {
      const response = await fetchExpandedGalleryAssets(
        this._expandedContext.element_type,
        this._expandedContext.search_query,
        20,
        this._expandedPage
      );
      this._expandedResults = [...this._expandedResults, ...response.results];
      this._expandedHasMore = response.hasMore;
      this._expandedPage = response.nextPage;
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      this._expandedLoading = false;
    }
  }

  _handleBackToSuggestions() {
    this._currentView = "suggestions";
    this._expandedContext = null;
    this._expandedResults = [];
  }

  _handleCustomSearchInput(e) {
    this._customSearchQuery = e.target.value;
  }

  async _handleCustomSearch() {
    const query = this._customSearchQuery.trim();
    if (!query) return;

    this._customSearchLoading = true;
    this._customSearchError = "";
    this._customSearchResults = [];

    try {
      const response = await searchGifs(query, 10);
      
      this._customSearchResults = (response.results || []).map((result) => ({
        id: `tenor_custom_${result.id}`,
        source: "tenor",
        preview_url: getTenorPreviewUrl(result),
        full_url: getGifUrl(result),
        metadata: {
          id: result.id,
          title: result.title || "",
          hasAudio: result.hasaudio || false,
        },
        add_to_canvas_action: {
          type: "add_gif",
          asset_id: result.id,
          source: "tenor",
        },
        _original: result,
      }));
    } catch (error) {
      console.error("Custom Tenor search error:", error);
      this._customSearchError = "Failed to search. Please try again.";
    } finally {
      this._customSearchLoading = false;
    }
  }

  _handleCustomSearchKeypress(e) {
    if (e.key === "Enter") {
      this._handleCustomSearch();
    }
  }

  _clearCustomSearch() {
    this._customSearchQuery = "";
    this._customSearchResults = [];
    this._customSearchError = "";
  }

  async _handleInsertAsset(asset) {
    if (!this.addOnUISdk?.app?.document) {
      this._errorMessage = "Add-on SDK not ready. Please try again.";
      return;
    }

    this._insertingAssetId = asset.id;
    this._errorMessage = "";

    try {
      const { source } = asset;

      if (source === "tenor") {
        await this._insertAnimatedImage(asset);
      } else if (source === "unsplash") {
        await this._insertStaticImage(asset);
      }
    } catch (error) {
      console.error("Insert error:", error);
      this._errorMessage = error.message || "Failed to insert. Please try again.";
    } finally {
      this._insertingAssetId = null;
    }
  }

  async _insertAnimatedImage(asset) {
    const gifUrl = asset.full_url || getGifUrl(asset._original);

    if (!gifUrl) {
      throw new Error("Failed to get GIF URL");
    }

    const response = await fetch(gifUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch GIF: ${response.status}`);
    }

    const gifBlob = await response.blob();

    await this.addOnUISdk.app.document.addAnimatedImage(
      gifBlob,
      {
        title: asset.metadata?.title || "GIF",
        author: "Tenor",
      },
      {
        nodeAddOnData: {
          assetId: asset.id,
          source: "tenor",
        },
      }
    );
  }

  async _insertStaticImage(asset) {
    const imageUrl = asset.full_url;

    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBlob = await response.blob();

    await this.addOnUISdk.app.document.addImage(imageBlob, {
      title: asset.metadata?.description || "Image",
      author: asset.metadata?.author || "Unsplash",
    });

    if (asset._original) {
      trackDownload(asset._original);
    }
  }

  _renderWelcomeState() {
    return html`
      <div class="welcome-state">
        <div class="welcome-icon">✨</div>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Upload an image or scan your canvas to get AI-powered suggestions
          for backgrounds, GIFs, memes, and images.
        </p>
      </div>
    `;
  }

  _renderProcessingState() {
    return html`
      <div class="processing-state">
        <sp-progress-circle
          size="l"
          indeterminate
          label="Analyzing design..."
        ></sp-progress-circle>
        <p class="spectrum-Body spectrum-Body--sizeS processing-text">Analyzing your design...</p>
      </div>
    `;
  }

  _renderSuggestionCard(suggestion) {
    const icon = ELEMENT_ICONS[suggestion.element_type] || "📦";
    const hasItems = suggestion.preview_items && suggestion.preview_items.length > 0;

    return html`
      <div class="suggestion-card">
        <div class="card-header">
          <span class="card-icon">${icon}</span>
          <span class="spectrum-Heading spectrum-Heading--sizeXS card-title">${suggestion.title}</span>
        </div>
        <p class="spectrum-Body spectrum-Body--sizeXS card-reason">${suggestion.reason}</p>

        ${hasItems
          ? html`
              <div class="mini-gallery">
                ${suggestion.preview_items.map(
                  (item) => html`
                    <div class="gallery-item">
                      <img
                        src="${item.preview_url}"
                        alt="Preview"
                        class="gallery-thumbnail"
                        loading="lazy"
                      />
                      <sp-action-button
                        size="xs"
                        class="add-btn"
                        @click=${() => this._handleInsertAsset(item)}
                        ?disabled=${this._insertingAssetId !== null}
                        quiet
                      >
                        ${this._insertingAssetId === item.id ? "..." : "+"}
                      </sp-action-button>
                    </div>
                  `
                )}
                <button
                  class="more-btn"
                  @click=${() => this._handleExpandGallery(suggestion)}
                >
                  <span class="more-icon">+</span>
                  <span class="more-text">More</span>
                </button>
              </div>
            `
          : html`
              <div class="no-results">
                ${suggestion.fetch_error
                  ? html`<span class="error-text">Failed to load</span>`
                  : html`<span>No previews</span>`}
              </div>
            `}
      </div>
    `;
  }

  _renderCustomSearchCard() {
    const hasResults = this._customSearchResults.length > 0;

    return html`
      <div class="search-card">
        <div class="search-row">
          <sp-search
            size="m"
            placeholder="Search GIFs..."
            .value=${this._customSearchQuery}
            @input=${this._handleCustomSearchInput}
            @keypress=${this._handleCustomSearchKeypress}
            @submit=${(e) => { e.preventDefault(); this._handleCustomSearch(); }}
            ?disabled=${this._customSearchLoading}
          ></sp-search>
          <sp-button
            size="m"
            variant="accent"
            @click=${this._handleCustomSearch}
            ?disabled=${this._customSearchLoading || !this._customSearchQuery.trim()}
          >
            ${this._customSearchLoading ? "..." : "Go"}
          </sp-button>
        </div>

        ${this._customSearchError
          ? html`<div class="search-error spectrum-Body spectrum-Body--sizeXS">${this._customSearchError}</div>`
          : ""}

        ${hasResults
          ? html`
              <div class="search-results">
                <div class="mini-gallery">
                  ${this._customSearchResults.map(
                    (item) => html`
                      <div class="gallery-item">
                        <img
                          src="${item.preview_url}"
                          alt="Preview"
                          class="gallery-thumbnail"
                          loading="lazy"
                        />
                        <sp-action-button
                          size="xs"
                          class="add-btn"
                          @click=${() => this._handleInsertAsset(item)}
                          ?disabled=${this._insertingAssetId !== null}
                          quiet
                        >
                          ${this._insertingAssetId === item.id ? "..." : "+"}
                        </sp-action-button>
                      </div>
                    `
                  )}
                </div>
                <sp-button size="s" variant="secondary" @click=${this._clearCustomSearch}>
                  Clear
                </sp-button>
              </div>
            `
          : ""}
      </div>
    `;
  }

  _renderSuggestionsView() {
    return html`
      <div class="suggestions-container">
        <div class="suggestions-list">
          ${this._enrichedSuggestions.map((suggestion) =>
            this._renderSuggestionCard(suggestion)
          )}
        </div>

        <sp-divider size="s"></sp-divider>
        
        ${this._renderCustomSearchCard()}

        <sp-button
          size="m"
          variant="secondary"
          class="rescan-btn"
          @click=${this._handleScanFromCanvas}
        >
          🔄 Rescan Canvas
        </sp-button>
      </div>
    `;
  }

  _renderExpandedView() {
    const icon = ELEMENT_ICONS[this._expandedContext?.element_type] || "📦";

    return html`
      <div class="expanded-container">
        <div class="expanded-header">
          <sp-action-button size="s" @click=${this._handleBackToSuggestions}>
            ← Back
          </sp-action-button>
          <div class="expanded-title">
            <span class="card-icon">${icon}</span>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">${this._expandedContext?.title || "Gallery"}</span>
          </div>
        </div>

        ${this._expandedLoading && this._expandedResults.length === 0
          ? html`
              <div class="loading-state">
                <sp-progress-circle size="m" indeterminate></sp-progress-circle>
              </div>
            `
          : ""}

        <div class="expanded-grid">
          ${this._expandedResults.map(
            (item) => html`
              <div class="expanded-item">
                <img
                  src="${item.preview_url}"
                  alt="Preview"
                  class="expanded-thumbnail"
                  loading="lazy"
                />
                <sp-button
                  size="s"
                  variant="accent"
                  @click=${() => this._handleInsertAsset(item)}
                  ?disabled=${this._insertingAssetId !== null}
                  class="expanded-add-btn"
                >
                  ${this._insertingAssetId === item.id ? "..." : "Add"}
                </sp-button>
              </div>
            `
          )}
        </div>

        ${this._expandedHasMore && !this._expandedLoading
          ? html`
              <sp-button
                size="m"
                variant="primary"
                class="load-more-btn"
                @click=${this._handleLoadMore}
              >
                Load More
              </sp-button>
            `
          : ""}

        ${this._expandedLoading && this._expandedResults.length > 0
          ? html`
              <div class="loading-more">
                <sp-progress-circle size="s" indeterminate></sp-progress-circle>
              </div>
            `
          : ""}
      </div>
    `;
  }

  render() {
    return html`
      <sp-theme system="express" color="light" scale="medium">
        <div class="container">
          <!-- Header with upload controls -->
          ${this._currentView === "welcome" || this._currentView === "suggestions"
            ? html`
                <div class="header-section">
                  <h1 class="spectrum-Heading spectrum-Heading--sizeS title">Loomis</h1>
                  
                  <sp-textfield
                    size="m"
                    placeholder="What's the theme about?"
                    .value=${this._userContext}
                    @input=${this._handleContextInput}
                    ?disabled=${this._currentView === "processing"}
                    class="context-field"
                  ></sp-textfield>

                  <div class="upload-controls">
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      style="display: none;"
                      @change=${this._handleFileUpload}
                    />
                    <sp-button
                      size="m"
                      variant="accent"
                      @click=${this._handleScanFromCanvas}
                      ?disabled=${this._currentView === "processing"}
                      class="scan-btn"
                    >
                      ✨ Scan my Canvas
                    </sp-button>
                    <sp-button
                      size="m"
                      variant="secondary"
                      @click=${this._handleUploadButtonClick}
                      ?disabled=${this._currentView === "processing"}
                    >
                      Import from Device
                    </sp-button>
                  </div>
                </div>
              `
            : ""}

          <!-- Error message -->
          ${this._errorMessage
            ? html`<div class="error-message spectrum-Body spectrum-Body--sizeXS">${this._errorMessage}</div>`
            : ""}

          <!-- Main content -->
          <div class="main-content">
            ${this._currentView === "welcome" ? this._renderWelcomeState() : ""}
            ${this._currentView === "processing" ? this._renderProcessingState() : ""}
            ${this._currentView === "suggestions" ? this._renderSuggestionsView() : ""}
            ${this._currentView === "expanded" ? this._renderExpandedView() : ""}
          </div>
        </div>
      </sp-theme>
    `;
  }
}
