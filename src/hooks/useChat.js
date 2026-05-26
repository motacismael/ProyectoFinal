import { useState, useCallback, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { supabase } from '../supabaseClient';

const WELCOME_MESSAGE = {
  id: 'welcome',
  text: '¡Hola! Soy el asistente virtual del **Estatuto Orgánico de la UASD**. Estoy aquí para ayudarte a encontrar información sobre los reglamentos, derechos y estructura universitaria. ¿En qué te puedo ayudar hoy?',
  sender: 'bot',
  timestamp: new Date(),
};

export const useChat = (user) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  // Generamos un sessionId único para el chat activo.
  const [sessionId, setSessionId] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  });

  // Refs para acceder a los valores actuales sin añadirlos como dependencias
  const messagesRef = useRef(messages);
  const isLoadingRef = useRef(isLoading);
  const sessionIdRef = useRef(sessionId);

  // Mantenemos los refs sincronizados con el estado de forma segura
  useEffect(() => {
    messagesRef.current = messages;
    isLoadingRef.current = isLoading;
    sessionIdRef.current = sessionId;
  }, [messages, isLoading, sessionId]);

  // Función interna para obtener el historial del usuario desde Supabase
  const fetchUserHistory = useCallback(async () => {
    if (!user) {
      setSessions([]);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.warn('Advertencia al cargar historial de Supabase:', fetchError.message);
        return;
      }

      // Agrupamos los mensajes por session_id
      const grouped = {};
      data.forEach((msg) => {
        if (!grouped[msg.session_id]) {
          grouped[msg.session_id] = [];
        }
        grouped[msg.session_id].push({
          id: msg.id || `${msg.sender}-${new Date(msg.created_at).getTime()}`,
          text: msg.text,
          sender: msg.sender,
          isError: msg.is_error,
          timestamp: new Date(msg.created_at),
        });
      });

      // Mapeamos a la lista de sesiones
      const sessionsList = Object.keys(grouped).map((sid) => {
        const msgs = grouped[sid];
        // El primer mensaje del usuario sirve de título
        const firstUserMsg = msgs.find((m) => m.sender === 'user');
        const title = firstUserMsg
          ? firstUserMsg.text.length > 30
            ? firstUserMsg.text.substring(0, 30) + '...'
            : firstUserMsg.text
          : 'Conversación sin título';

        // Añadimos el mensaje de bienvenida al principio de cada sesión si no existe
        const fullMsgs = msgs[0]?.id === 'welcome'
          ? msgs
          : [
              {
                ...WELCOME_MESSAGE,
                timestamp: msgs[0]?.timestamp
                  ? new Date(new Date(msgs[0].timestamp).getTime() - 1000)
                  : new Date(),
              },
              ...msgs,
            ];

        const lastMsg = msgs[msgs.length - 1];
        const timestamp = lastMsg ? lastMsg.timestamp : new Date();

        return {
          session_id: sid,
          title,
          timestamp,
          messages: fullMsgs,
        };
      });

      // Ordenamos las sesiones por la fecha del último mensaje
      sessionsList.sort((a, b) => b.timestamp - a.timestamp);
      setSessions(sessionsList);
    } catch (err) {
      console.error('Error de conexión al obtener el historial:', err);
    }
  }, [user]);

  // Cargamos el historial al cambiar de usuario / iniciar sesión
  useEffect(() => {
    fetchUserHistory();
  }, [user, fetchUserHistory]);

  // Función interna para persistir mensajes en Supabase
  const saveToSupabase = useCallback(async (activeSessionId, sender, text, isError = false) => {
    try {
      const { error: insertError } = await supabase
        .from('chat_history')
        .insert([
          {
            session_id: activeSessionId,
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
  }, []);

  // Función para enviar mensajes
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoadingRef.current) return;

    const currentSid = sessionIdRef.current;

    const userMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Guardamos el mensaje del usuario en Supabase
    saveToSupabase(currentSid, 'user', text);

    // Actualizamos optimistamente las sesiones en memoria
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.session_id === currentSid);
      const updatedMessages = [...messagesRef.current, userMessage];
      const title = prev[idx]?.title || (text.length > 30 ? text.substring(0, 30) + '...' : text);
      const updatedSession = {
        session_id: currentSid,
        title,
        timestamp: new Date(),
        messages: updatedMessages,
      };

      const next = [...prev];
      if (idx !== -1) {
        next.splice(idx, 1);
      }
      next.unshift(updatedSession);
      return next;
    });

    try {
      const history = messagesRef.current.filter(
        (m) => m.id !== 'welcome' && !m.isError
      );

      const botResponseText = await sendMessageToAI(text, history);

      const botMessage = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      saveToSupabase(currentSid, 'bot', botResponseText);

      // Sincronizamos la respuesta del bot en la barra lateral
      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.session_id === currentSid);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            timestamp: new Date(),
            messages: [...next[idx].messages, botMessage],
          };
          const [item] = next.splice(idx, 1);
          next.unshift(item);
          return next;
        }
        return prev;
      });
    } catch (err) {
      const errMsg = err.message || 'Ocurrió un error al conectar con el servidor.';
      console.error(err);
      setError(errMsg);

      const botErrorMessage = {
        id: `err-${Date.now()}`,
        text: `⚠️ ${errMsg}`,
        sender: 'bot',
        isError: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botErrorMessage]);
      saveToSupabase(currentSid, 'bot', `Error: ${errMsg}`, true);

      // Sincronizamos el error en la barra lateral
      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.session_id === currentSid);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            timestamp: new Date(),
            messages: [...next[idx].messages, botErrorMessage],
          };
          const [item] = next.splice(idx, 1);
          next.unshift(item);
          return next;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [saveToSupabase]);

  // Carga una sesión seleccionada
  const loadSession = useCallback((sid) => {
    const session = sessions.find((s) => s.session_id === sid);
    if (session) {
      setSessionId(sid);
      setMessages(session.messages);
      setError(null);
    }
  }, [sessions]);

  // Elimina una sesión del historial
  const deleteSession = useCallback(async (sid) => {
    try {
      const { error: deleteError } = await supabase
        .from('chat_history')
        .delete()
        .eq('session_id', sid);

      if (deleteError) {
        console.error('Error al borrar de Supabase:', deleteError.message);
        return;
      }

      setSessions((prev) => prev.filter((s) => s.session_id !== sid));

      // Si borramos el chat que tenemos en pantalla, resetear a bienvenida limpia
      if (sessionIdRef.current === sid) {
        setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
        setError(null);
        try {
          setSessionId(crypto.randomUUID());
        } catch {
          setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
        }
      }
    } catch (err) {
      console.error('Excepción al borrar la sesión:', err);
    }
  }, []);

  // Inicia un nuevo chat con pantalla limpia
  const startNewChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    setError(null);
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
    sessions,
    currentSessionId: sessionId,
    sendMessage,
    loadSession,
    deleteSession,
    startNewChat,
    clearChat: startNewChat, // Alias para compatibilidad con logout/header
  };
};
