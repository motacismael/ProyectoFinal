import { useState, useCallback, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { supabase } from '../supabaseClient';

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

  // Generamos un sessionId único para este chat.
  // Usamos una función de inicialización perezosa para que persista durante la vida del hook.
  const [sessionId, setSessionId] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  });

  // Refs para acceder a los valores actuales sin añadirlos como dependencias
  // del useCallback, evitando así recreaciones infinitas del callback.
  const messagesRef = useRef(messages);
  const isLoadingRef = useRef(isLoading);

  // Mantenemos los refs sincronizados con el estado
  messagesRef.current = messages;
  isLoadingRef.current = isLoading;

  // Función interna para persistir mensajes en Supabase de forma segura
  const saveToSupabase = async (sender, text, isError = false) => {
    try {
      const { error: insertError } = await supabase
        .from('chat_history')
        .insert([
          {
            session_id: sessionId,
            sender: sender,
            text: text,
            is_error: isError,
          },
        ]);

      if (insertError) {
        console.warn('Advertencia al guardar en Supabase:', insertError.message);
      }
    } catch (err) {
      console.error('Error de conexión con Supabase:', err);
    }
  };

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

    // Guardamos el mensaje del usuario en Supabase (de forma asíncrona)
    saveToSupabase('user', text);

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

      // Guardamos la respuesta exitosa del bot en Supabase
      saveToSupabase('bot', botResponseText);
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

      // Guardamos el mensaje de error en Supabase
      saveToSupabase('bot', `Error: ${errMsg}`, true);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]); // Solo depende de sessionId, que no cambia tras inicializarse

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setError(null);
    // Generamos un nuevo sessionId al limpiar el chat para iniciar una nueva conversación
    try {
      setSessionId(crypto.randomUUID());
    } catch {
      setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
