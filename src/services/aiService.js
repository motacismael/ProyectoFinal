import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/constants";

// Inicializamos el SDK con la API Key del archivo .env
// Asegúrate de crear un archivo .env en la raíz con VITE_GEMINI_API_KEY=tu_clave
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

// Usamos gemini-2.0-flash: más rápido, barato y con mayor ventana de contexto
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: SYSTEM_PROMPT,
});

export const sendMessageToAI = async (message, history = []) => {
  if (!apiKey) {
    throw new Error(
      "No se ha configurado la API Key de Gemini. Crea un archivo .env con VITE_GEMINI_API_KEY=tu_clave."
    );
  }

  // Formateamos el historial para Gemini (excluyendo mensajes de error)
  const formattedHistory = history
    .filter((msg) => !msg.isError)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

  const chatSession = model.startChat({
    history: formattedHistory,
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 2048,
    },
  });

  try {
    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Error al comunicarse con Gemini:", error);
    // Re-lanzamos con mensaje amigable
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("La API Key de Gemini no es válida. Verifica tu archivo .env.");
    }
    if (error.message?.includes("quota")) {
      throw new Error("Se ha agotado la cuota de la API. Intenta más tarde.");
    }
    throw error;
  }
};
