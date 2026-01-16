import addOnSandboxSdk from "add-on-sdk-document-sandbox";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start() {
    // APIs to be exposed to the UI runtime
    // For this MVP, we're using addOnUISdk.app.document.addAnimatedImage directly in the UI,
    // so no sandbox APIs are needed. This file is kept minimal for future extensibility.
    const sandboxApi = {
        // No APIs needed for MVP - GIF insertion is handled directly in UI
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
