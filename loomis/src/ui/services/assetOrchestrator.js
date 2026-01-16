/**
 * Asset Orchestrator Service
 * Central hub that fetches assets from appropriate sources based on element type
 */

import {
  searchGifs,
  getPreviewUrl as getTenorPreviewUrl,
  getGifUrl,
} from "./tenorApi.js";
import {
  searchBackgrounds,
  searchIllustrations,
  searchPhotos,
  formatAsPreviewItem,
} from "./unsplashApi.js";

/**
 * Map element types to their data sources
 */
const SOURCE_MAP = {
  memes: "tenor",
  gifs: "tenor",
  illustrations: "unsplash",
  backgrounds: "unsplash",
  background: "unsplash", // this caused the blank preview 
  images: "unsplash",
};

/**
 * Get the icon for each element type
 */
export const ELEMENT_ICONS = {
  background: "🖼️",
  backgrounds: "🖼️",
  gifs: "✨",
  memes: "😂",
  illustrations: "🎨",
  images: "📷",
};

/**
 * Fetch assets for a single suggestion
 * @param {Object} suggestion - Suggestion object from Gemini
 * @param {number} limit - Number of preview items to fetch
 * @returns {Promise<Object>} - Suggestion with preview_items populated
 */
export async function fetchAssetsForSuggestion(suggestion, limit = 5) {
  const { element_type, search_keywords } = suggestion;
  const source = SOURCE_MAP[element_type];

  if (!source) {
    console.warn(`Unknown element type: ${element_type}`);
    return { ...suggestion, preview_items: [] };
  }

  // Combine keywords for search
  const searchQuery = search_keywords.slice(0, 2).join(" ");

  try {
    let previewItems = [];

    if (source === "tenor") {
      previewItems = await fetchTenorAssets(searchQuery, element_type, limit);
    } else if (source === "unsplash") {
      previewItems = await fetchUnsplashAssets(searchQuery, element_type, limit);
    }

    return {
      ...suggestion,
      preview_items: previewItems,
      more_action: {
        panel: "expanded_gallery",
        context_key: `${element_type}|${searchQuery}`,
        search_query: searchQuery,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch assets for ${element_type}:`, error);
    return {
      ...suggestion,
      preview_items: [],
      fetch_error: error.message,
    };
  }
}

/**
 * Fetch assets from Tenor API
 * @param {string} query - Search query
 * @param {string} elementType - 'memes' or 'gifs'
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} - Array of preview items
 */
async function fetchTenorAssets(query, elementType, limit) {
  // For memes, add "meme" to search query
  const searchQuery = elementType === "memes" ? `${query} meme` : query;

  const response = await searchGifs(searchQuery, limit);

  return (response.results || []).map((result) => ({
    id: `tenor_${result.id}`,
    source: "tenor",
    preview_url: getTenorPreviewUrl(result),
    full_url: getGifUrl(result),
    metadata: {
      id: result.id,
      title: result.title || "",
      hasAudio: result.hasaudio || false,
    },
    add_to_canvas_action: {
      type: elementType === "memes" ? "add_meme" : "add_gif",
      asset_id: result.id,
      source: "tenor",
    },
    _original: result,
  }));
}

/**
 * Fetch assets from Unsplash API
 * @param {string} query - Search query
 * @param {string} elementType - 'backgrounds', 'illustrations', or 'images'
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} - Array of preview items
 */
async function fetchUnsplashAssets(query, elementType, limit) {
  let response;

  switch (elementType) {
    case "backgrounds":
    case "background":
      response = await searchBackgrounds(query, limit);
      break;
    case "illustrations":
      response = await searchIllustrations(query, limit);
      break;
    case "images":
    default:
      response = await searchPhotos(query, limit);
      break;
  }

  return (response.results || []).map((result) =>
    formatAsPreviewItem(result, elementType)
  );
}

/**
 * Fetch assets for all suggestions in parallel
 * @param {Array} suggestions - Array of suggestions from Gemini
 * @param {number} previewLimit - Number of preview items per suggestion
 * @returns {Promise<Array>} - Suggestions with preview_items populated
 */
export async function fetchAssetsForAllSuggestions(
  suggestions,
  previewLimit = 5
) {
  const enrichedSuggestions = await Promise.all(
    suggestions.map((suggestion) =>
      fetchAssetsForSuggestion(suggestion, previewLimit)
    )
  );

  return enrichedSuggestions;
}

/**
 * Fetch more assets for expanded gallery view
 * @param {string} elementType - Element type
 * @param {string} searchQuery - Search query
 * @param {number} limit - Number of results
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} - Results with pagination info
 */
export async function fetchExpandedGalleryAssets(
  elementType,
  searchQuery,
  limit = 20,
  page = 1
) {
  const source = SOURCE_MAP[elementType];

  if (!source) {
    throw new Error(`Unknown element type: ${elementType}`);
  }

  try {
    if (source === "tenor") {
      const response = await searchGifs(
        elementType === "memes" ? `${searchQuery} meme` : searchQuery,
        limit
      );

      return {
        results: (response.results || []).map((result) => ({
          id: `tenor_${result.id}`,
          source: "tenor",
          preview_url: getTenorPreviewUrl(result),
          full_url: getGifUrl(result),
          metadata: {
            id: result.id,
            title: result.title || "",
          },
          add_to_canvas_action: {
            type: elementType === "memes" ? "add_meme" : "add_gif",
            asset_id: result.id,
            source: "tenor",
          },
          _original: result,
        })),
        hasMore: !!response.next,
        nextPage: page + 1,
      };
    } else {
      // Unsplash
      let response;
      const unsplashQuery =
        elementType === "backgrounds"
          ? `${searchQuery} background texture abstract`
          : elementType === "illustrations"
          ? `${searchQuery} illustration art graphic`
          : searchQuery;

      const { searchImages } = await import("./unsplashApi.js");
      response = await searchImages(unsplashQuery, {
        perPage: limit,
        page: page,
        orientation: elementType === "backgrounds" ? "landscape" : undefined,
      });

      return {
        results: (response.results || []).map((result) =>
          formatAsPreviewItem(result, elementType)
        ),
        hasMore: page < response.totalPages,
        nextPage: page + 1,
        totalPages: response.totalPages,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch expanded gallery for ${elementType}:`, error);
    throw error;
  }
}
