import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MAX_CHARS = 1000;

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const canSend = text.trim() && !isLoading && !isOverLimit;

  return (
    <div className="bg-white border-t border-gray-100 px-4 pt-3 pb-4 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Input container */}
        <div className={`
          relative flex items-end bg-gray-50 rounded-2xl border transition-all duration-200 shadow-sm
          ${isOverLimit
            ? 'border-red-400 ring-1 ring-red-300'
            : 'border-gray-200 focus-within:border-uasd-blue focus-within:ring-1 focus-within:ring-uasd-blue/30'
          }
        `}>
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 50))}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta sobre el Estatuto… (Enter para enviar)"
            className="flex-1 max-h-[140px] bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-3 px-4 text-sm text-gray-700 placeholder-gray-400 chat-scroll"
            rows={1}
            disabled={isLoading}
            aria-label="Escribe tu pregunta"
          />

          {/* Right actions */}
          <div className="flex items-center gap-1 pr-2 pb-2 flex-shrink-0">
            {/* Char counter — visible when close to limit */}
            {text.length > MAX_CHARS * 0.7 && (
              <span className={`text-[10px] tabular-nums ${isOverLimit ? 'text-red-400' : 'text-gray-400'}`}>
                {charsLeft}
              </span>
            )}

            <button
              id="send-message-btn"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Enviar mensaje"
              className={`
                p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                ${canSend
                  ? 'bg-uasd-blue text-white shadow-md hover:bg-blue-700 active:scale-95 hover:scale-105'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[11px] text-gray-400 mt-2">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Enter</kbd>
          {' '}para enviar · {' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">Shift + Enter</kbd>
          {' '}para nueva línea · La IA puede cometer errores.
        </p>
      </div>
    </div>
  );
};
