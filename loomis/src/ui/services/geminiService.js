import { GoogleGenAI } from "@google/genai";

export async function performOCR(base64Image, mimeType) {
  // Check if API key is available
  // const apiKey = "AIzaSyANzVUOBx9vMQYNjl7j_KO65J6Y5hzZ9JA";
  // console.log("apiKey", apiKey);
  // if (!apiKey) {
  //   throw new Error(
  //     "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
  //   );
  // }

  const ai = new GoogleGenAI({ apiKey: "AIzaSyANzVUOBx9vMQYNjl7j_KO65J6Y5hzZ9JA" });

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
