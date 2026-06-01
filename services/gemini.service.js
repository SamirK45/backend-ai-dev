import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

export const generateContent = async (prompt) => {
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
    generationConfig: {
      responseMimeType: config.gemini.responseMimeType,
    },
    systemInstruction: config.gemini.systemInstruction,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};
