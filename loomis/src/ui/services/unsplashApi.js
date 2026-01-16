/**
 * Unsplash API Service
 * Service to interact with Unsplash API for stock photos, backgrounds, and illustrations
 *
 * To get a free API key:
 * 1. Visit https://unsplash.com/developers
 * 2. Create an application
 * 3. Get your Access Key
 * 4. Add to .env: UNSPLASH_ACCESS_KEY=your_key_here
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

if (!UNSPLASH_ACCESS_KEY) {
  console.warn(
    "UNSPLASH_ACCESS_KEY is not set. Please create a .env file with UNSPLASH_ACCESS_KEY=your_key"
  );
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
 * Search for images using Unsplash API
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {number} options.perPage - Number of results (default: 10, max: 30)
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {string} options.orientation - 'landscape', 'portrait', 'squarish' (optional)
 * @param {string} options.color - Color filter (optional)
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

  const { perPage = 10, page = 1, orientation, color } = options;

  const params = new URLSearchParams({
    query: cleanedQuery,
    per_page: Math.min(Math.max(perPage, 1), 30).toString(),
    page: page.toString(),
  });

  if (orientation) {
    params.append("orientation", orientation);
  }

  if (color) {
    params.append("color", color);
  }

  const url = `${UNSPLASH_BASE_URL}/search/photos?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid Unsplash API key");
      }
      if (response.status === 403) {
        throw new Error("Unsplash API rate limit exceeded");
      }
      throw new Error(
        `Unsplash API request failed: ${response.status} ${response.statusText}`
      );
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
 * Get image metadata
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
    width: result.width,
    height: result.height,
    color: result.color,
    downloadUrl: result.links?.download,
    htmlUrl: result.links?.html,
  };
}

/**
 * Track download (required by Unsplash API guidelines)
 * Should be called when user actually uses/downloads an image
 * @param {Object} result - Unsplash API result object
 */
export async function trackDownload(result) {
  if (!result?.links?.download_location) {
    return;
  }

  try {
    await fetch(result.links.download_location, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch (error) {
    // Silently fail - tracking is best-effort
    console.warn("Failed to track Unsplash download:", error);
  }
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
    metadata: metadata,
    add_to_canvas_action: {
      type: elementType === "background" ? "add_background" : "add_image",
      asset_id: result.id,
      source: "unsplash",
    },
    // Keep original result for tracking
    _original: result,
  };
}
