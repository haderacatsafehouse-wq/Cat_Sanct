
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCatDescription = async (keywords: string): Promise<string> => {
  if (!API_KEY) {
    return "שירות יצירת התיאור אינו זמין. אנא בדוק את מפתח ה-API.";
  }
  
  const prompt = `
    צור תיאור קצר, חם ומזמין לאימוץ עבור חתול במקלט. 
    התיאור צריך להיות בעברית ולהתבסס על מילות המפתח הבאות. 
    הדגש את האישיות החיובית של החתול.
    אורך התיאור: 2-3 משפטים.
    מילות מפתח: "${keywords}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "אירעה שגיאה ביצירת התיאור. נסה שוב מאוחר יותר.";
  }
};
