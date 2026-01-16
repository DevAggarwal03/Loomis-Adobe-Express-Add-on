/**
 * Tenor API Service
 * Simple service to interact with Tenor API for GIF search
 *
 * To get a free API key:
 * 1. Visit https://developers.google.com/tenor/guides/quickstart
 * 2. Sign up for a free API key
 * 3. Create a .env file in the project root
 * 4. Add: TENOR_API_KEY=your_api_key_here
 */

const TENOR_API_KEY = process.env.TENOR_API_KEY || "AIzaSyAFFGjQR7cyu_7rxId7cT8jkU0hJy7F2k0";
const TENOR_BASE_URL = "https://tenor.googleapis.com/v2";
const CLIENT_KEY = "loomis_addon";

if (!TENOR_API_KEY) {
  console.warn(
    "TENOR_API_KEY is not set. Please create a .env file with TENOR_API_KEY=your_key"
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

  // Trim whitespace
  let cleaned = query.trim();

  // Remove excessive spaces
  cleaned = cleaned.replace(/\s+/g, " ");

  // Limit length (very lenient - 100 chars)
  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 100);
  }

  return cleaned;
}

/**
 * Search for GIFs using Tenor API
 * @param {string} query - Search query
 * @param {number} limit - Number of results (default: 20, max: 50)
 * @returns {Promise<Object>} - API response with results
 */
export async function searchGifs(query, limit = 20) {
  const cleanedQuery = cleanQuery(query);

  if (!cleanedQuery) {
    throw new Error("Search query cannot be empty");
  }

  // Build URL with parameters
  const params = new URLSearchParams({
    q: cleanedQuery,
    key: TENOR_API_KEY,
    client_key: CLIENT_KEY,
    limit: Math.min(Math.max(limit, 1), 50).toString(), // Clamp between 1-50
    media_filter: "gif,tinygif,mp4", // Optimize response size
    contentfilter: "medium", // Content safety filter
    locale: "en_US",
  });

  const url = `${TENOR_BASE_URL}/search?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format");
    }

    return {
      results: data.results,
      next: data.next || "",
    };
  } catch (error) {
    console.error("Tenor API error:", error);
    throw error;
  }
}

/**
 * Extract GIF URL from Tenor result object
 * @param {Object} result - Tenor API result object
 * @returns {string|null} - GIF URL or null if not found
 *
 * Note: Adobe Express addAnimatedImage() only accepts GIF format, not MP4
 */
export function getGifUrl(result) {
  if (!result || !result.media_formats) {
    return null;
  }

  // Prioritize GIF format (required by Adobe Express addAnimatedImage)
  if (result.media_formats.gif && result.media_formats.gif.url) {
    return result.media_formats.gif.url;
  }

  // Fallback to tinygif if regular gif not available
  if (result.media_formats.tinygif && result.media_formats.tinygif.url) {
    return result.media_formats.tinygif.url;
  }

  // Do not use MP4 - Adobe Express doesn't support it for animated images
  // MP4 is only for better quality but addAnimatedImage() requires GIF format

  return null;
}

/**
 * Get preview URL (smaller, faster loading)
 * @param {Object} result - Tenor API result object
 * @returns {string|null} - Preview URL or null if not found
 */
export function getPreviewUrl(result) {
  if (!result || !result.media_formats) {
    return null;
  }

  // Use tinygif for preview (smaller file size)
  if (result.media_formats.tinygif && result.media_formats.tinygif.url) {
    return result.media_formats.tinygif.url;
  }

  // Fallback to gif
  if (result.media_formats.gif && result.media_formats.gif.url) {
    return result.media_formats.gif.url;
  }

  return null;
}
