
import { GoogleGenAI, Type } from "@google/genai";
import { ProductInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getProductDetails = async (barcode: string, imageBase64?: string): Promise<ProductInfo> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this product barcode: "${barcode}" ${imageBase64 ? 'and the provided image' : ''}.
    Identify the product and provide detailed information in Arabic.
    
    Critical requirements:
    1. Determine if it is an Egyptian product (صنع في مصر) or imported.
    2. Provide full nutrition details if it's a food product.
    3. Analyze ingredients for health risks.
    4. Provide estimated pricing and store links using your knowledge and search capabilities.
    5. Suggest healthier alternatives.

    Return the data strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: imageBase64 
      ? { parts: [{ text: prompt }, { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }] }
      : prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          description: { type: Type.STRING },
          origin: { type: Type.STRING },
          isLocal: { type: Type.BOOLEAN },
          category: { type: Type.STRING },
          images: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              sugar: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              sodium: { type: Type.NUMBER },
              servingSize: { type: Type.STRING }
            },
            required: ["calories"]
          },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
          healthAnalysis: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          pricing: {
            type: Type.OBJECT,
            properties: {
              averagePrice: { type: Type.STRING },
              comparison: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    store: { type: Type.STRING },
                    price: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              }
            }
          },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        },
        required: ["name", "brand", "description"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text) as ProductInfo;
};
