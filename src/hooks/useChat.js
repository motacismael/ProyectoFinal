import { useState, useCallback, useRef } from 'react';
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

  // Refs para acceder a los valores actuales sin añadirlos como dependencias
  // del useCallback, evitando así recreaciones infinitas del callback.
  const messagesRef = useRef(messages);
  const isLoadingRef = useRef(isLoading);

  // Mantenemos los refs sincronizados con el estado
  messagesRef.current = messages;
  isLoadingRef.current = isLoading;

  // sendMessage no tiene dependencias variables: es estable durante todo
  // el ciclo de vida del componente, eliminando el riesgo de bucles.
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoadingRef.current) return;

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
      // Leemos el historial desde el ref (valor actual sin dependencia reactiva)
      const history = messagesRef.current.filter(
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
  }, []); // ✅ Sin dependencias: función estable, sin riesgo de bucle

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
