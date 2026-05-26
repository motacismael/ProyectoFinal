import { useState, useRef, useEffect } from 'react';
import { Header }            from './components/Layout/Header';
import { Sidebar }           from './components/Layout/Sidebar';
import { ChatMessage }       from './components/Chat/ChatMessage';
import { ChatInput }         from './components/Chat/ChatInput';
import { ChatLoading }       from './components/Chat/ChatLoading';
import { SuggestedQuestions } from './components/Suggested/SuggestedQuestions';
import { useChat }           from './hooks/useChat';
import { supabase }          from './supabaseClient';
import { AuthScreen }        from './components/Auth/AuthScreen';
import { BookOpen }          from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen]   = useState(false);
  const [user, setUser]                     = useState(null);
  const [authLoading, setAuthLoading]       = useState(true);
  // Track the id of the most recent bot message for typewriter effect
  const [latestBotId, setLatestBotId]       = useState(null);
  const [prevIsLoading, setPrevIsLoading]   = useState(false);
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    sessions,
    currentSessionId,
    loadSession,
    deleteSession,
    startNewChat
  } = useChat(user);
  const messagesEndRef = useRef(null);

  /* ── Auth listener ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ── Track latest bot message for typewriter ── */
  useEffect(() => {
    if (isLoading) {
      setPrevIsLoading(true);
    } else if (prevIsLoading) {
      // Transicionó de cargando a listo! Significa que acabamos de recibir respuesta del bot.
      const botMessages = messages.filter(m => m.sender === 'bot');
      if (botMessages.length > 0) {
        const last = botMessages[botMessages.length - 1];
        setLatestBotId(last.id);
      }
      setPrevIsLoading(false);
    }
  }, [isLoading, messages, prevIsLoading]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearChat();
      setLatestBotId(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const showWelcome = messages.length === 1;

  /* ── Loading screen ── */
  if (authLoading) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center"
        style={{ background: 'var(--surface-base)' }}
      >
        <div className="flex flex-col items-center gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
              boxShadow: '0 8px 32px oklch(0.38 0.19 264 / 0.4)',
              animation: 'glowPulse 2.5s ease-in-out infinite',
            }}
          >
            <BookOpen className="w-7 h-7" style={{ color: 'oklch(0.97 0.005 250)' }} />
          </div>

          {/* Spinner */}
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'oklch(0.38 0.19 264)', borderTopColor: 'transparent' }}
          />

          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Iniciando Asistente UASD…
          </p>
        </div>
      </div>
    );
  }

  /* ── Auth gate ── */
  if (!user) {
    return <AuthScreen />;
  }

  /* ── Main app ── */
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onNewChat={startNewChat}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onClearChat={clearChat}
        />

        {/* Chat area */}
        <main
          className="flex-1 overflow-y-auto chat-scroll p-4 md:p-6 flex flex-col items-center"
          style={{ background: 'var(--surface-base)' }}
        >
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            {/* Welcome / Suggested questions */}
            {showWelcome && (
              <div className="flex-1 flex flex-col justify-center py-4">
                <SuggestedQuestions onSelectQuestion={handleSuggestedQuestion} />
              </div>
            )}

            {/* Messages */}
            {!showWelcome && (
              <div className="flex-1 pt-2">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isNew={msg.id === latestBotId && !isLoading}
                  />
                ))}
                {isLoading && <ChatLoading />}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}

            {showWelcome && <div ref={messagesEndRef} />}
          </div>
        </main>

        {/* Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
