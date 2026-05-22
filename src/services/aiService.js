import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/constants";

// Claves de API de variables de entorno
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const groqModel = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

// Inicializar SDK de Gemini (solo si no se usa Groq o como fallback)
const genAI = new GoogleGenerativeAI(geminiApiKey || "DUMMY_KEY");
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: SYSTEM_PROMPT,
});

// Función para determinar el proveedor actual
export const getAIProvider = () => {
  if (groqApiKey && groqApiKey.trim() !== "") {
    return { name: "Groq", model: groqModel };
  }
  return { name: "Gemini", model: "gemini-2.0-flash" };
};

// Función para enviar mensaje usando la API de Groq (OpenAI-compatible)
const sendMessageToGroq = async (message, history) => {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
      .filter((msg) => !msg.isError)
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: messages,
        temperature: 0.2,
        top_p: 0.95,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error respuesta de Groq:", errorData);
      const errMessage = errorData.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) {
        throw new Error("La API Key de Groq no es válida. Verifica tu archivo .env.");
      }
      if (response.status === 429) {
        throw new Error("Se ha agotado la cuota de la API de Groq o límite de velocidad. Intenta más tarde.");
      }
      throw new Error(`Error en la API de Groq: ${errMessage}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Respuesta inválida o vacía recibida de Groq.");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al comunicarse con Groq:", error);
    throw error;
  }
};

// Función para enviar mensaje usando la API de Gemini (SDK oficial)
const sendMessageToGemini = async (message, history) => {
  if (!geminiApiKey) {
    throw new Error(
      "No se ha configurado ninguna API Key. Crea un archivo .env con VITE_GROQ_API_KEY o VITE_GEMINI_API_KEY."
    );
  }

  // Formateamos el historial para Gemini (excluyendo mensajes de error)
  const formattedHistory = history
    .filter((msg) => !msg.isError)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

  const chatSession = geminiModel.startChat({
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
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("La API Key de Gemini no es válida. Verifica tu archivo .env.", { cause: error });
    }
    if (error.message?.includes("quota")) {
      throw new Error("Se ha agotado la cuota de la API de Gemini. Intenta más tarde.", { cause: error });
    }
    throw error;
  }
};

// Exportamos la función unificada de envío de mensajes
export const sendMessageToAI = async (message, history = []) => {
  const provider = getAIProvider();

  if (provider.name === "Groq") {
    return sendMessageToGroq(message, history);
  } else {
    return sendMessageToGemini(message, history);
  }
};

