/**
 * Unsplash API Service
 * Service to interact with Unsplash API for stock photos, backgrounds, and illustrations
 * 
 * Based on official Unsplash API documentation: https://unsplash.com/documentation
 *
 * To get a free API key:
 * 1. Visit https://unsplash.com/developers
 * 2. Create an application
 * 3. Get your Access Key
 * 4. Add to .env: UNSPLASH_ACCESS_KEY=your_key_here
 * 
 * Rate Limits:
 * - Demo mode: 50 requests per hour
 * - Production mode: Higher limits (apply via Unsplash dashboard)
 * 
 * Guidelines: https://unsplash.com/documentation#guidelines--crediting
 */

const UNSPLASH_ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY || "";
const UNSPLASH_BASE_URL = "https://api.unsplash.com";
const API_VERSION = "v1";

if (!UNSPLASH_ACCESS_KEY) {
  console.warn(
    "UNSPLASH_ACCESS_KEY is not set. Please create a .env file with UNSPLASH_ACCESS_KEY=your_key"
  );
}

/**
 * Get standard headers for Unsplash API requests
 * @returns {Object} - Headers object
 */
function getHeaders() {
  return {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    "Accept-Version": API_VERSION,
  };
}

/**
 * Clean and normalize search query
 * @param {string} query - Raw user input
 * @returns {string} - Cleaned query
 */
export function cleanQuery(query) {
  if (!query || typeof query !== "string") {
    return "";
  }

  let cleaned = query.trim();
  cleaned = cleaned.replace(/\s+/g, " ");

  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 100);
  }

  return cleaned;
}

/**
 * Handle API error responses based on Unsplash documentation
 * @param {Response} response - Fetch response object
 * @throws {Error} - Descriptive error based on status code
 */
async function handleApiError(response) {
  let errorMessage = `Unsplash API request failed: ${response.status} ${response.statusText}`;

  try {
    const errorData = await response.json();
    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.join(", ");
    }
  } catch {
    // Use default error message if JSON parsing fails
  }

  switch (response.status) {
    case 400:
      throw new Error(`Bad Request: ${errorMessage}`);
    case 401:
      throw new Error("Invalid or missing Unsplash API key. Please check your credentials.");
    case 403:
      throw new Error("Unsplash API rate limit exceeded. Please try again later.");
    case 404:
      throw new Error("Resource not found on Unsplash.");
    case 500:
    case 503:
      throw new Error("Unsplash server error. Please try again later.");
    default:
      throw new Error(errorMessage);
  }
}

/**
 * Search for photos using Unsplash API
 * Endpoint: GET /search/photos
 * 
 * @param {string} query - Search query (required)
 * @param {Object} options - Search options
 * @param {number} options.perPage - Number of results per page (default: 10, max: 30)
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {string} options.orientation - 'landscape', 'portrait', 'squarish' (optional)
 * @param {string} options.color - Color filter: black_and_white, black, white, yellow, orange, red, purple, magenta, green, teal, blue (optional)
 * @param {string} options.orderBy - Sort order: 'relevant' or 'latest' (default: 'relevant')
 * @param {string} options.contentFilter - Content safety: 'low' or 'high' (default: 'low')
 * @param {string} options.collections - Collection ID(s) to narrow search (optional)
 * @returns {Promise<Object>} - API response with results
 */
export async function searchImages(query, options = {}) {
  const cleanedQuery = cleanQuery(query);

  if (!cleanedQuery) {
    throw new Error("Search query cannot be empty");
  }

  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key is not configured");
  }

  const {
    perPage = 10,
    page = 1,
    orientation,
    color,
    orderBy = "relevant",
    contentFilter = "low",
    collections,
  } = options;

  const params = new URLSearchParams({
    query: cleanedQuery,
    per_page: Math.min(Math.max(perPage, 1), 30).toString(),
    page: page.toString(),
    order_by: orderBy,
    content_filter: contentFilter,
  });

  if (orientation && ["landscape", "portrait", "squarish"].includes(orientation)) {
    params.append("orientation", orientation);
  }

  if (color) {
    params.append("color", color);
  }

  if (collections) {
    params.append("collections", collections);
  }

  const url = `${UNSPLASH_BASE_URL}/search/photos?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data = await response.json();

    return {
      results: data.results || [],
      total: data.total || 0,
      totalPages: data.total_pages || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Unsplash API error:", error);
    throw error;
  }
}

/**
 * Get a random photo from Unsplash
 * Endpoint: GET /photos/random
 * 
 * @param {Object} options - Options
 * @param {string} options.query - Search term (optional)
 * @param {string} options.orientation - 'landscape', 'portrait', 'squarish' (optional)
 * @param {string} options.collections - Collection ID(s) (optional)
 * @param {number} options.count - Number of photos (1-30, default: 1)
 * @returns {Promise<Object|Array>} - Random photo(s)
 */
export async function getRandomPhoto(options = {}) {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash API key is not configured");
  }

  const { query, orientation, collections, count = 1 } = options;

  const params = new URLSearchParams({
    count: Math.min(Math.max(count, 1), 30).toString(),
  });

  if (query) {
    params.append("query", cleanQuery(query));
  }

  if (orientation && ["landscape", "portrait", "squarish"].includes(orientation)) {
    params.append("orientation", orientation);
  }

  if (collections) {
    params.append("collections", collections);
  }

  const url = `${UNSPLASH_BASE_URL}/photos/random?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Unsplash random photo error:", error);
    throw error;
  }
}

/**
 * Search for background images (abstract, textures, patterns)
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchBackgrounds(query, limit = 10) {
  // Enhance query for background-suitable results
  const enhancedQuery = `${query} background texture abstract`;
  return searchImages(enhancedQuery, {
    perPage: limit,
    orientation: "landscape",
  });
}

/**
 * Search for illustrations and artistic images
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchIllustrations(query, limit = 10) {
  // Enhance query for illustration-style results
  const enhancedQuery = `${query} illustration art graphic`;
  return searchImages(enhancedQuery, { perPage: limit });
}

/**
 * Search for general photos
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Object>} - API response with results
 */
export async function searchPhotos(query, limit = 10) {
  return searchImages(query, { perPage: limit });
}

/**
 * Get the full-size image URL from Unsplash result
 * Note: Unsplash requires hotlinking - use these URLs directly
 * 
 * @param {Object} result - Unsplash API result object
 * @param {string} size - 'raw', 'full', 'regular', 'small', 'thumb' (default: 'regular')
 * @returns {string|null} - Image URL or null if not found
 */
export function getImageUrl(result, size = "regular") {
  if (!result || !result.urls) {
    return null;
  }

  // Priority order for size fallback
  const sizePriority = ["regular", "small", "full", "thumb", "raw"];

  if (result.urls[size]) {
    return result.urls[size];
  }

  // Fallback to available sizes
  for (const s of sizePriority) {
    if (result.urls[s]) {
      return result.urls[s];
    }
  }

  return null;
}

/**
 * Get preview/thumbnail URL for gallery display
 * @param {Object} result - Unsplash API result object
 * @returns {string|null} - Preview URL or null if not found
 */
export function getPreviewUrl(result) {
  if (!result || !result.urls) {
    return null;
  }

  // Use small for previews, fallback to thumb
  return result.urls.small || result.urls.thumb || result.urls.regular || null;
}

/**
 * Get image metadata including blur_hash for placeholder
 * @param {Object} result - Unsplash API result object
 * @returns {Object} - Metadata object
 */
export function getImageMetadata(result) {
  if (!result) {
    return {};
  }

  return {
    id: result.id,
    description: result.description || result.alt_description || "",
    author: result.user?.name || "Unknown",
    authorUsername: result.user?.username || "",
    authorProfileUrl: result.user?.links?.html || null,
    width: result.width,
    height: result.height,
    color: result.color,
    blurHash: result.blur_hash || null,
    createdAt: result.created_at,
    downloadUrl: result.links?.download,
    htmlUrl: result.links?.html,
  };
}

/**
 * Track download (required by Unsplash API guidelines)
 * Should be called when user actually uses/downloads an image
 * This helps photographers get credit for their work
 * 
 * Endpoint: GET /photos/:id/download
 * 
 * @param {Object} result - Unsplash API result object
 */
export async function trackDownload(result) {
  if (!result?.links?.download_location) {
    console.warn("No download_location available for tracking");
    return;
  }

  try {
    await fetch(result.links.download_location, {
      headers: getHeaders(),
    });
  } catch (error) {
    // Silently fail - tracking is best-effort
    console.warn("Failed to track Unsplash download:", error);
  }
}

/**
 * Get attribution text for an image (required by Unsplash guidelines)
 * @param {Object} result - Unsplash API result object
 * @returns {string} - Attribution text
 */
export function getAttribution(result) {
  if (!result || !result.user) {
    return "Photo from Unsplash";
  }

  const authorName = result.user.name || result.user.username || "Unknown";
  return `Photo by ${authorName} on Unsplash`;
}

/**
 * Get attribution link HTML (for proper crediting per Unsplash guidelines)
 * @param {Object} result - Unsplash API result object
 * @returns {string} - HTML attribution link
 */
export function getAttributionHtml(result) {
  if (!result || !result.user) {
    return 'Photo from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>';
  }

  const authorName = result.user.name || result.user.username || "Unknown";
  const authorUrl = result.user.links?.html || "https://unsplash.com";
  const photoUrl = result.links?.html || "https://unsplash.com";

  return `Photo by <a href="${authorUrl}?utm_source=your_app&utm_medium=referral" target="_blank" rel="noopener noreferrer">${authorName}</a> on <a href="${photoUrl}?utm_source=your_app&utm_medium=referral" target="_blank" rel="noopener noreferrer">Unsplash</a>`;
}

/**
 * Format Unsplash result to match our internal asset format
 * @param {Object} result - Unsplash API result object
 * @param {string} elementType - 'background', 'illustrations', 'images'
 * @returns {Object} - Formatted asset object
 */
export function formatAsPreviewItem(result, elementType) {
  const metadata = getImageMetadata(result);

  return {
    id: `unsplash_${result.id}`,
    source: "unsplash",
    preview_url: getPreviewUrl(result),
    full_url: getImageUrl(result, "regular"),
    blur_hash: result.blur_hash,
    metadata: metadata,
    attribution: getAttribution(result),
    add_to_canvas_action: {
      type: elementType === "background" ? "add_background" : "add_image",
      asset_id: result.id,
      source: "unsplash",
    },
    // Keep original result for tracking
    _original: result,
  };
}
