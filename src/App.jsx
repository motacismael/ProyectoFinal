import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatMessage } from './components/Chat/ChatMessage';
import { ChatInput } from './components/Chat/ChatInput';
import { ChatLoading } from './components/Chat/ChatLoading';
import { SuggestedQuestions } from './components/Suggested/SuggestedQuestions';
import { useChat } from './hooks/useChat';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  // Mostrar pantalla de bienvenida solo cuando hay 1 mensaje (el de bienvenida)
  const showWelcome = messages.length === 1;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
