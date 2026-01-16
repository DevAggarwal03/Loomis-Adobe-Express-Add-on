import { css } from "lit";

export const style = css`
  /* ===== BASE LAYOUT ===== */
  :host {
    --spectrum-global-color-gray-50: #ffffff;
    --spectrum-global-color-gray-75: #fafafa;
    --spectrum-global-color-gray-100: #f5f5f5;
    --spectrum-global-color-gray-200: #eaeaea;
    --spectrum-global-color-gray-300: #e1e1e1;
    --spectrum-global-color-gray-400: #cacaca;
    --spectrum-global-color-gray-500: #b3b3b3;
    --spectrum-global-color-gray-600: #8e8e8e;
    --spectrum-global-color-gray-700: #6e6e6e;
    --spectrum-global-color-gray-800: #4b4b4b;
    --spectrum-global-color-gray-900: #2c2c2c;
    --accent-color: #5c5ce0;
    --accent-hover: #4b4bcf;
  }

  .container {
    margin: 0;
    padding: 12px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--spectrum-global-color-gray-75);
    font-family: "Adobe Clean", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .title {
    margin: 0 0 10px 0;
    text-align: center;
    color: var(--accent-color);
  }

  /* ===== HEADER SECTION ===== */
  .header-section {
    flex-shrink: 0;
    margin-bottom: 10px;
  }

  .context-field {
    width: 100%;
    margin-bottom: 8px;
    --spectrum-textfield-border-radius: 100px;
  }

  .upload-controls {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .scan-btn {
    width: 100%;
  }

  /* ===== ERROR MESSAGE ===== */
  .error-message {
    padding: 8px 10px;
    background: #fff0f0;
    color: #d32f2f;
    border-radius: 6px;
    margin-bottom: 8px;
    border-left: 3px solid #ef5350;
  }

  /* ===== MAIN CONTENT ===== */
  .main-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* ===== WELCOME STATE ===== */
  .welcome-state {
    text-align: center;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .welcome-icon {
    font-size: 36px;
    margin-bottom: 4px;
  }

  .welcome-state p {
    margin: 0;
    color: var(--spectrum-global-color-gray-700);
    line-height: 1.4;
    max-width: 260px;
  }

  /* ===== PROCESSING STATE ===== */
  .processing-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    gap: 16px;
  }

  .processing-text {
    color: var(--spectrum-global-color-gray-700);
    margin: 0;
  }

  /* ===== SUGGESTIONS CONTAINER ===== */
  .suggestions-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
  }

  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ===== SUGGESTION CARD ===== */
  .suggestion-card {
    background: var(--spectrum-global-color-gray-50);
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.15s ease;
  }

  .suggestion-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .card-icon {
    font-size: 16px;
  }

  .card-title {
    margin: 0;
    color: var(--spectrum-global-color-gray-900);
  }

  .card-reason {
    margin: 0 0 8px 0;
    color: var(--spectrum-global-color-gray-600);
    line-height: 1.3;
  }

  /* ===== MINI GALLERY ===== */
  .mini-gallery {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 2px 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .mini-gallery::-webkit-scrollbar {
    height: 3px;
  }

  .mini-gallery::-webkit-scrollbar-track {
    background: transparent;
  }

  .mini-gallery::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 2px;
  }

  .gallery-item {
    flex-shrink: 0;
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
    background: var(--spectrum-global-color-gray-100);
  }

  .gallery-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.15s ease;
  }

  .gallery-item:hover .gallery-thumbnail {
    transform: scale(1.05);
  }

  .add-btn {
    position: absolute;
    bottom: 2px;
    right: 2px;
    opacity: 0;
    transition: opacity 0.15s ease;
    --spectrum-actionbutton-background-color: var(--accent-color);
    --spectrum-actionbutton-background-color-hover: var(--accent-hover);
  }

  .gallery-item:hover .add-btn {
    opacity: 1;
  }

  .more-btn {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: all 0.15s ease;
  }

  .more-btn:hover {
    border-color: var(--accent-color);
    background: var(--spectrum-global-color-gray-100);
  }

  .more-icon {
    font-size: 16px;
    color: var(--spectrum-global-color-gray-500);
    transition: color 0.15s ease;
  }

  .more-text {
    font-size: 10px;
    color: var(--spectrum-global-color-gray-500);
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .more-btn:hover .more-icon,
  .more-btn:hover .more-text {
    color: var(--accent-color);
  }

  .no-results {
    padding: 12px;
    text-align: center;
    color: var(--spectrum-global-color-gray-500);
    font-size: 12px;
    background: var(--spectrum-global-color-gray-100);
    border-radius: 6px;
  }

  .error-text {
    color: #d32f2f;
  }

  /* ===== SEARCH CARD (SIMPLE) ===== */
  .search-card {
    background: var(--spectrum-global-color-gray-50);
    border-radius: 8px;
    padding: 8px;
  }

  .search-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .search-row sp-search {
    flex: 1;
  }

  .search-error {
    margin-top: 6px;
    padding: 6px 8px;
    background: #fff0f0;
    color: #d32f2f;
    border-radius: 4px;
  }

  .search-results {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* ===== RESCAN BUTTON ===== */
  .rescan-btn {
    width: 100%;
    margin-top: 4px;
  }

  /* ===== EXPANDED GALLERY VIEW ===== */
  .expanded-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .expanded-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .expanded-title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .expanded-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    overflow-y: auto;
    flex: 1;
    padding-bottom: 10px;
  }

  .expanded-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--spectrum-global-color-gray-50);
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.15s ease;
  }

  .expanded-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .expanded-thumbnail {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-100);
  }

  .expanded-add-btn {
    width: 100%;
  }

  .load-more-btn {
    width: 100%;
    margin-top: 4px;
    flex-shrink: 0;
  }

  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
  }

  .loading-more {
    display: flex;
    justify-content: center;
    padding: 12px;
  }

  /* ===== SCROLLBAR STYLING ===== */
  .main-content::-webkit-scrollbar,
  .expanded-grid::-webkit-scrollbar {
    width: 4px;
  }

  .main-content::-webkit-scrollbar-track,
  .expanded-grid::-webkit-scrollbar-track {
    background: transparent;
  }

  .main-content::-webkit-scrollbar-thumb,
  .expanded-grid::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 2px;
  }

  .main-content::-webkit-scrollbar-thumb:hover,
  .expanded-grid::-webkit-scrollbar-thumb:hover {
    background: var(--spectrum-global-color-gray-400);
  }

  /* ===== SPECTRUM TYPOGRAPHY HELPERS ===== */
  .spectrum-Heading--sizeS {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
  }

  .spectrum-Heading--sizeXS {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
  }

  .spectrum-Body--sizeM {
    font-size: 14px;
    line-height: 1.4;
  }

  .spectrum-Body--sizeS {
    font-size: 13px;
    line-height: 1.4;
  }

  .spectrum-Body--sizeXS {
    font-size: 12px;
    line-height: 1.3;
  }
`;
