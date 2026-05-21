import { useState, useCallback } from 'react';
import { sendMessageToAI } from '../services/aiService';

const WELCOME_MESSAGE = {
  id: 'welcome',
  text: '¡Hola! Soy el asistente virtual del **Estatuto Orgánico de la UASD**. Estoy aquí para ayudarte a encontrar información sobre los reglamentos, derechos y estructura universitaria. ¿En qué te puedo ayudar hoy?',
  sender: 'bot',
  timestamp: new Date(),
};

export const useChat = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // Actualizamos el estado con el mensaje del usuario
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Obtenemos el historial previo (sin el mensaje de bienvenida ni errores)
      const history = messages.filter(
        (m) => m.id !== 'welcome' && !m.isError
      );

      const botResponseText = await sendMessageToAI(text, history);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errMsg = err.message || 'Ocurrió un error al conectar con el servidor.';
      console.error(err);
      setError(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: `⚠️ ${errMsg}`,
          sender: 'bot',
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
