import { css } from "lit";

export const style = css`
  .container {
    margin: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .title {
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #4a5568;
    text-align: center;
  }

  .search-section {
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .upload-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }

  /* AI Rainbow Border Button for Scan Canvas */
  .scan-button-ai {
    position: relative;
    width: 100%;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    font-family: var(--spectrum-global-font-family-base);
    color: #4a5568;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 1;
  }

  .scan-button-ai::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
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
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }

  .scan-button-ai:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .upload-button:hover:not([disabled]) {
    border-color: #764ba2 !important;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .search-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .search-input {
    flex: 1;
  }

  .native-input {
    padding: 8px 12px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    font-size: 14px;
    font-family: var(--spectrum-global-font-family-base);
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    transition: border-color 0.2s;
  }

  .native-input:focus {
    outline: none;
    border-color: var(--spectrum-global-color-blue-500);
  }

  .native-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .native-input::placeholder {
    color: var(--spectrum-global-color-gray-500);
  }

  .native-input.auto-filled {
    border-color: var(--spectrum-global-color-blue-400);
    background-color: var(--spectrum-global-color-blue-50);
    box-shadow: 0 0 0 1px var(--spectrum-global-color-blue-400);
  }

  .native-input.auto-filled:focus {
    border-color: var(--spectrum-global-color-blue-500);
    box-shadow: 0 0 0 2px var(--spectrum-global-color-blue-500);
  }

  .error-message {
    padding: 8px 12px;
    background-color: var(--spectrum-global-color-red-100);
    color: var(--spectrum-global-color-red-700);
    border-radius: 4px;
    font-size: 12px;
    margin-top: 8px;
  }

  .loading {
    text-align: center;
    padding: 32px;
    color: var(--spectrum-global-color-gray-700);
  }

  /* Space-themed Loading Animation */
  .space-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: transparent;
    border-radius: 16px;
    margin-top: 16px;
    position: relative;
  }

  .orbit {
    position: relative;
    width: 100px;
    height: 100px;
    animation: orbit-rotate 8s linear infinite;
  }

  @keyframes orbit-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
    box-shadow: 
      0 0 20px rgba(102, 126, 234, 0.6),
      inset -4px -4px 8px rgba(0, 0, 0, 0.3),
      inset 4px 4px 8px rgba(255, 255, 255, 0.2);
    animation: planet-pulse 2s ease-in-out infinite;
  }

  @keyframes planet-pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.6),
        inset -4px -4px 8px rgba(0, 0, 0, 0.3),
        inset 4px 4px 8px rgba(255, 255, 255, 0.2);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(102, 126, 234, 0.8),
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
    background: linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .star {
    position: absolute;
    font-size: 14px;
    color: #ffd700;
    animation: star-twinkle 1.5s ease-in-out infinite;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
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
    0%, 100% { 
      opacity: 0.4;
      transform: scale(0.8) rotate(0deg);
    }
    50% { 
      opacity: 1;
      transform: scale(1.2) rotate(180deg);
    }
  }

  .loading-text {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
    letter-spacing: 0.5px;
    animation: text-fade 2s ease-in-out infinite;
    z-index: 1;
  }

  @keyframes text-fade {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    overflow-y: auto;
    flex: 1;
    padding-bottom: 16px;
  }

  .gif-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    padding: 8px;
    background-color: var(--spectrum-global-color-gray-50);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .gif-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .gif-preview {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: contain;
    background-color: var(--spectrum-global-color-gray-100);
    min-height: 100px;
    max-height: 200px;
  }

  .gif-placeholder {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }

  .insert-button {
    width: 100%;
  }

  .empty-state,
  .welcome-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--spectrum-global-color-gray-600);
  }

  .empty-state p,
  .welcome-state p {
    margin: 0;
    font-size: 14px;
  }

  /* V4: Suggestions View Styles */
  .suggestions-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background-color: var(--spectrum-global-color-gray-50);
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    margin-bottom: 16px;
  }

  .find-resources-btn {
    width: 100%;
  }

  .suggestion-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-800);
    padding: 12px;
    background-color: var(--spectrum-global-color-gray-100);
    border-radius: 6px;
    border-left: 3px solid var(--spectrum-global-color-blue-500);
  }

  /* V4: Resources View Styles */
  .resources-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    overflow: hidden;
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 0;
  }

  .keyword-chip {
    padding: 6px 12px;
    font-size: 13px;
    font-family: var(--spectrum-global-font-family-base);
    background-color: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-800);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .keyword-chip:hover:not(:disabled) {
    background-color: var(--spectrum-global-color-blue-100);
    border-color: var(--spectrum-global-color-blue-400);
    color: var(--spectrum-global-color-blue-700);
  }

  .keyword-chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .resource-type-selector {
    display: flex;
    gap: 16px;
    padding: 8px 0;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .resource-type-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
  }

  .resource-type-label input[type="radio"] {
    accent-color: var(--spectrum-global-color-blue-500);
  }

  .resources-view .results-grid {
    flex: 1;
    overflow-y: auto;
  }
`;
