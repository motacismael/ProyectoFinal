import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatMessage } from './components/Chat/ChatMessage';
import { ChatInput } from './components/Chat/ChatInput';
import { ChatLoading } from './components/Chat/ChatLoading';
import { SuggestedQuestions } from './components/Suggested/SuggestedQuestions';
import { useChat } from './hooks/useChat';
import { supabase } from './supabaseClient';
import { AuthScreen } from './components/Auth/AuthScreen';
import { BookOpen } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef(null);

  // Escuchar estado de autenticación de Supabase
  useEffect(() => {
    // 1. Obtener la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // 2. Escuchar cambios de estado en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearChat();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  // Mostrar pantalla de bienvenida solo cuando hay 1 mensaje (el de bienvenida)
  const showWelcome = messages.length === 1;

  // 1. Pantalla de carga mientras se recupera la sesión
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 header-gradient rounded-2xl flex items-center justify-center border border-white/20 shadow-md animate-pulse">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-8 border-3 border-uasd-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500 tracking-wider">
            Iniciando Asistente UASD...
          </p>
        </div>
      </div>
    );
  }

  // 2. Si no hay usuario logueado, mostrar pantalla de Login/Registro
  if (!user) {
    return <AuthScreen />;
  }

  // 3. Aplicación principal (Chatbot)
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar con soporte para Auth */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onClearChat={clearChat}
        />

        {/* Chat area */}
        <main className="flex-1 overflow-y-auto chat-scroll p-4 md:p-6 lg:p-8 flex flex-col items-center">
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
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <ChatLoading />}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}

            {/* When we have messages, first message (welcome) is shown as chat bubble */}
            {showWelcome && <div ref={messagesEndRef} />}
          </div>
        </main>

        {/* Input area */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
