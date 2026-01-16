import { css } from "lit";

export const style = css`
  /* ===== BASE LAYOUT ===== */
  .container {
    margin: 0;
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(180deg, #fafbfc 0%, #f0f2f5 100%);
    font-family: "Adobe Clean", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .title {
    margin: 0 0 16px 0;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
  }

  /* ===== HEADER SECTION ===== */
  .header-section {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  .upload-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* AI Rainbow Border Button for Scan Canvas */
  .scan-button-ai {
    position: relative;
    width: 100%;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    color: #4a5568;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    background: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 1;
  }

  .scan-button-ai::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 25%,
      #f093fb 50%,
      #f5576c 75%,
      #4facfe 100%
    );
    background-size: 300% 300%;
    animation: gradient-shift 4s ease infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }

  .scan-button-ai:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  }

  .scan-button-ai:hover:not(:disabled)::before {
    animation: gradient-shift 1.5s ease infinite;
  }

  .scan-button-ai:active:not(:disabled) {
    transform: translateY(0);
  }

  .scan-button-ai:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .scan-button-ai.processing::before {
    animation: gradient-shift 1s ease infinite;
  }

  .scan-button-text {
    position: relative;
    z-index: 1;
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .upload-button {
    width: 100%;
    --spectrum-button-secondary-border-color: #667eea;
    --spectrum-button-secondary-border-color-hover: #764ba2;
    --spectrum-button-secondary-text-color: #667eea;
    --spectrum-button-secondary-text-color-hover: #764ba2;
    border: 2px solid #667eea !important;
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  .upload-button:hover:not([disabled]) {
    border-color: #764ba2 !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  }

  /* ===== ERROR MESSAGE ===== */
  .error-message {
    padding: 10px 14px;
    background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
    color: #c53030;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 12px;
    border-left: 3px solid #fc8181;
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
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .welcome-icon {
    font-size: 48px;
    margin-bottom: 8px;
  }

  .welcome-state h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
  }

  .welcome-state p {
    margin: 0;
    font-size: 14px;
    color: #718096;
    line-height: 1.5;
    max-width: 280px;
  }

  /* ===== SPACE LOADER ===== */
  .space-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    position: relative;
  }

  .orbit {
    position: relative;
    width: 100px;
    height: 100px;
    animation: orbit-rotate 8s linear infinite;
  }

  @keyframes orbit-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .planet {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    margin: -16px 0 0 -16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    box-shadow: 0 0 25px rgba(102, 126, 234, 0.6),
      inset -4px -4px 8px rgba(0, 0, 0, 0.3),
      inset 4px 4px 8px rgba(255, 255, 255, 0.2);
    animation: planet-pulse 2s ease-in-out infinite;
  }

  @keyframes planet-pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 0 25px rgba(102, 126, 234, 0.6),
        inset -4px -4px 8px rgba(0, 0, 0, 0.3),
        inset 4px 4px 8px rgba(255, 255, 255, 0.2);
    }
    50% {
      transform: scale(1.15);
      box-shadow: 0 0 35px rgba(102, 126, 234, 0.8),
        inset -4px -4px 8px rgba(0, 0, 0, 0.3),
        inset 4px 4px 8px rgba(255, 255, 255, 0.2);
    }
  }

  .moon {
    position: absolute;
    top: 0;
    left: 50%;
    width: 12px;
    height: 12px;
    margin-left: -6px;
    background: linear-gradient(135deg, #e2e8f0 0%, #a0aec0 100%);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  }

  .star {
    position: absolute;
    font-size: 14px;
    color: #ffd700;
    animation: star-twinkle 1.5s ease-in-out infinite;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  }

  .star-1 {
    top: 20%;
    right: 10%;
    animation-delay: 0s;
  }
  .star-2 {
    bottom: 20%;
    right: 20%;
    animation-delay: 0.3s;
    font-size: 10px;
  }
  .star-3 {
    bottom: 30%;
    left: 10%;
    animation-delay: 0.6s;
  }
  .star-4 {
    top: 30%;
    left: 20%;
    animation-delay: 0.9s;
    font-size: 10px;
  }

  @keyframes star-twinkle {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.8) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
  }

  .loading-text {
    margin-top: 24px;
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
    letter-spacing: 0.5px;
    animation: text-fade 2s ease-in-out infinite;
  }

  @keyframes text-fade {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  .loading {
    text-align: center;
    padding: 32px;
    color: #718096;
    font-size: 14px;
  }

  .loading-more {
    text-align: center;
    padding: 16px;
    color: #718096;
    font-size: 13px;
  }

  /* ===== SUGGESTIONS CONTAINER ===== */
  .suggestions-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .analysis-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 12px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .theme-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 12px;
    font-weight: 600;
    border-radius: 20px;
    text-transform: capitalize;
  }

  .missing-hint {
    font-size: 12px;
    color: #718096;
  }

  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ===== SUGGESTION CARD ===== */
  .suggestion-card {
    background: white;
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .suggestion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .card-icon {
    font-size: 20px;
  }

  .card-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
  }

  .card-reason {
    margin: 0 0 14px 0;
    font-size: 13px;
    color: #718096;
    line-height: 1.5;
  }

  /* ===== MINI GALLERY ===== */
  .mini-gallery {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 4px 0;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .mini-gallery::-webkit-scrollbar {
    height: 4px;
  }

  .mini-gallery::-webkit-scrollbar-track {
    background: #edf2f7;
    border-radius: 2px;
  }

  .mini-gallery::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 2px;
  }

  .gallery-item {
    flex-shrink: 0;
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    background: #edf2f7;
  }

  .gallery-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  .gallery-item:hover .gallery-thumbnail {
    transform: scale(1.05);
  }

  .add-btn {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.15s ease;
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
  }

  .gallery-item:hover .add-btn {
    opacity: 1;
  }

  .add-btn:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .more-btn {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border: 2px dashed #cbd5e0;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .more-btn:hover {
    border-color: #667eea;
    background: #f7fafc;
  }

  .more-icon {
    font-size: 18px;
    color: #a0aec0;
    transition: color 0.2s ease;
  }

  .more-text {
    font-size: 11px;
    color: #a0aec0;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .more-btn:hover .more-icon,
  .more-btn:hover .more-text {
    color: #667eea;
  }

  .no-results {
    padding: 20px;
    text-align: center;
    color: #a0aec0;
    font-size: 13px;
    background: #f7fafc;
    border-radius: 8px;
  }

  .error-text {
    color: #e53e3e;
  }

  /* ===== CUSTOM GIF SEARCH CARD ===== */
  .custom-search-card {
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.1);
    border: 1px dashed #cbd5e0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .custom-search-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }

  .search-input-container {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .custom-search-input {
    flex: 1;
    padding: 10px 14px;
    font-size: 13px;
    font-family: inherit;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #2d3748;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
  }

  .custom-search-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }

  .custom-search-input::placeholder {
    color: #a0aec0;
  }

  .custom-search-input:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }

  .custom-search-btn {
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .custom-search-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .custom-search-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .custom-search-error {
    margin-top: 10px;
    padding: 8px 12px;
    background: #fff5f5;
    color: #c53030;
    font-size: 12px;
    border-radius: 6px;
    border-left: 3px solid #fc8181;
  }

  .custom-search-results {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .clear-search-btn {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    color: #718096;
    background: #edf2f7;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .clear-search-btn:hover {
    background: #e2e8f0;
    color: #4a5568;
  }

  /* ===== RESCAN BUTTON ===== */
  .rescan-btn {
    width: 100%;
    padding: 12px 16px;
    background: #edf2f7;
    border: none;
    border-radius: 10px;
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
  }

  .rescan-btn:hover {
    background: #e2e8f0;
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
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .back-btn {
    padding: 8px 14px;
    background: #edf2f7;
    border: none;
    border-radius: 8px;
    color: #4a5568;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: #e2e8f0;
  }

  .expanded-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .expanded-title h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
  }

  .expanded-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    overflow-y: auto;
    flex: 1;
    padding-bottom: 16px;
  }

  .expanded-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: white;
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .expanded-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .expanded-thumbnail {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    background: #edf2f7;
  }

  .expanded-add-btn {
    width: 100%;
  }

  .load-more-btn {
    width: 100%;
    padding: 14px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
    flex-shrink: 0;
  }

  .load-more-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  /* ===== SCROLLBAR STYLING ===== */
  .main-content::-webkit-scrollbar,
  .expanded-grid::-webkit-scrollbar {
    width: 6px;
  }

  .main-content::-webkit-scrollbar-track,
  .expanded-grid::-webkit-scrollbar-track {
    background: transparent;
  }

  .main-content::-webkit-scrollbar-thumb,
  .expanded-grid::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }

  .main-content::-webkit-scrollbar-thumb:hover,
  .expanded-grid::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
`;
