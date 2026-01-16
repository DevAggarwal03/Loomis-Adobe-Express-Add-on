import { GoogleGenAI } from "@google/genai";

/**
 * V5 Enhanced Design Analysis
 * Analyzes design and returns structured suggestions segmented by element type
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<Object>} - Structured analysis with segmented suggestions
 */
export async function analyzeDesignV5(base64Image, mimeType) {
  // const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDMNg25PPraSZCaEc6Bf0PWESU4VBLpdDQ";
  // console.log("apiKey", apiKey);
  // if (apiKey.length === 0) {
  //   throw new Error(
  //     `Gemini API key is not configured ${apiKey} ${"afdfalnfkn"}. Please set GEMINI_API_KEY in your .env file.`
  //   );
  // }

  const ai = new GoogleGenAI({ apiKey: "AIzaSyATcFQfczuIhv4Qg9kSXLEWiDiWRtym8sc" });

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

  const prompt = `You are a creative design assistant. Analyze this design/image and provide structured suggestions to enhance it.

IMPORTANT: Return ONLY valid JSON, no markdown code blocks or extra text.

Analyze the image and return suggestions in this exact JSON structure:
{
  "analysis_summary": {
    "theme": "brief theme description (2-4 words)",
    "detected_elements": ["element1", "element2"],
    "missing_elements": ["missing1", "missing2"]
  },
  "suggestions": [
    {
      "segment_id": "unique_id",
      "element_type": "background|gifs|memes|illustrations|images",
      "title": "Short actionable title",
      "reason": "1-2 sentence explanation of why this helps the design",
      "search_keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}

RULES:
1. Include 2-5 suggestions based on what would genuinely improve the design
2. element_type MUST be one of: "background", "gifs", "memes", "illustrations", "images"
3. search_keywords should be optimized for stock photo/GIF search (2-3 keywords per suggestion)
4. Only suggest element types that make sense for the design context
5. Prioritize suggestions by impact - most impactful first

ELEMENT TYPE GUIDANCE:
- "background": For adding depth, texture, or atmosphere (use for empty/plain backgrounds)
- "gifs": For adding motion/animation to engage viewers
- "memes": For humor, relatability, or viral appeal (social media content)
- "illustrations": For artistic elements, icons, or decorative graphics
- "images": For photos, realistic visuals, or stock photography`;

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
    if (!result.analysis_summary || !result.suggestions) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure suggestions is an array
    if (!Array.isArray(result.suggestions)) {
      result.suggestions = [];
    }

    // Validate and clean each suggestion
    result.suggestions = result.suggestions.filter((s) => {
      const validTypes = [
        "background",
        "gifs",
        "memes",
        "illustrations",
        "images",
      ];
      return (
        s.segment_id &&
        s.element_type &&
        validTypes.includes(s.element_type) &&
        s.title &&
        s.reason &&
        Array.isArray(s.search_keywords)
      );
    });

    return result;
  } catch (error) {
    console.error("Gemini analyzeDesignV5 Error:", error);
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

/**
 * Legacy: Analyze design image and return improvement suggestions with keywords
 * @param {string} base64Image - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<{suggestion_for_improvements: string, keywords: {most_relevant: string, other_keywords: string[]}}>}
 */
export async function analyzeDesign(base64Image, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyATcFQfczuIhv4Qg9kSXLEWiDiWRtym8sc";
  if (apiKey.length === 0) {
    throw new Error(
      "Gemini API key is not configured second. Please set GEMINI_API_KEY in your .env file."
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
      model: "gemini-2.0-flash",
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
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyATcFQfczuIhv4Qg9kSXLEWiDiWRtym8sc";
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
      model: "gemini-2.0-flash",
      contents: [imagePart, prompt],
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
