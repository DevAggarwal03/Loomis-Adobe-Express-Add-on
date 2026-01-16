// This interface declares all the APIs that the document sandbox runtime ( i.e. code.js ) exposes to the UI/iframe runtime
// For this MVP, we're using addOnUISdk.app.document.addAnimatedImage directly in the UI,
// so no sandbox APIs are needed. This file is kept for future extensibility.
export interface DocumentSandboxApi {
    // No APIs needed for MVP - GIF insertion is handled directly in UI via addOnUISdk
}
