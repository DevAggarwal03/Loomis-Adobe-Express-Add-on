import { GoogleGenAI } from "@google/genai";

/**
 * Analyze design image and return improvement suggestions with keywords
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<{suggestion_for_improvements: string, keywords: {most_relevant: string, other_keywords: string[]}}>}
 */
export async function analyzeDesign(base64Image, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (apiKey.length === 0) {
    throw new Error(
      "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove data URI prefix if present
  const base64Data = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const prompt = `Analyze this design/image and provide:
1. A brief suggestion (2-3 sentences) on how to improve or enhance the design
2. Search keywords optimized for finding relevant GIFs/memes

Return ONLY valid JSON in this exact format:
{
  "suggestion_for_improvements": "Your suggestion here...",
  "keywords": {
    "most_relevant": "primary search query",
    "other_keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [imagePart, prompt],
    });

    let text = response.text;

    // Fallback: extract from candidates if text is not directly available
    if (!text && response.candidates?.[0]?.content?.parts) {
      const textParts = response.candidates[0].content.parts
        .filter((part) => part.text)
        .map((part) => part.text);
      text = textParts.join(" ");
    }

    if (!text) {
      console.error("No text in response:", response);
      throw new Error("No text response from Gemini API");
    }

    // Parse JSON response - handle potential markdown code blocks
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const result = JSON.parse(jsonText);

    // Validate response structure
    if (!result.suggestion_for_improvements || !result.keywords) {
      throw new Error("Invalid response structure from Gemini");
    }

    return result;
  } catch (error) {
    console.error("Gemini analyzeDesign Error:", error);
    const errorMessage = error.message || "Unknown error";
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      throw new Error(
        "Invalid or missing API key. Please check your GEMINI_API_KEY in .env file."
      );
    } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else if (errorMessage.includes("JSON")) {
      throw new Error("Failed to parse AI response. Please try again.");
    } else {
      throw new Error(`Failed to analyze design: ${errorMessage}`);
    }
  }
}

export async function performOCR(base64Image, mimeType) {
  // Check if API key is available
  const apiKey = process.env.GEMINI_API_KEY || "";
  console.log("apiKey", apiKey);
  if (apiKey.length === 0) {
    throw new Error(
      "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove data URI prefix if present
  const base64Data = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const prompt =
    "Analyze this image and identify the core emotion, reaction, or action being performed. Generate a 2-3 word search query optimized for Tenor GIF search (e.g., 'eye roll,' 'shocked face,' 'dancing happy'). Output only the search string.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [imagePart, prompt], // Text should be a string, not an object
    });

    // Extract text from response - response.text is a string property
    let query = response.text;

    // Fallback: extract from candidates if text is not directly available
    if (!query && response.candidates?.[0]?.content?.parts) {
      const textParts = response.candidates[0].content.parts
        .filter((part) => part.text)
        .map((part) => part.text);
      query = textParts.join(" ");
    }

    if (!query) {
      console.error("No text in response:", response);
      throw new Error("No text response from Gemini API");
    }

    return query.trim();
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    // Provide more detailed error message
    const errorMessage = error.message || "Unknown error";
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      throw new Error(
        "Invalid or missing API key. Please check your GEMINI_API_KEY in .env file."
      );
    } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error("API quota exceeded. Please try again later.");
    } else {
      throw new Error(`Failed to process image: ${errorMessage}`);
    }
  }
}
