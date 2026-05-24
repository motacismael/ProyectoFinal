import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MAX_CHARS = 1000;

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [text, setText]         = useState('');
  const textareaRef             = useRef(null);

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

  const charsLeft   = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const canSend     = text.trim() && !isLoading && !isOverLimit;

  return (
    <div className="chat-input-area px-4 pt-3 pb-4 w-full flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div
          className="chat-input-box relative flex items-end"
          style={isOverLimit ? {
            borderColor: 'oklch(0.48 0.24 14 / 0.60)',
            boxShadow: '0 0 0 3px oklch(0.48 0.24 14 / 0.15)',
          } : {}}
        >
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 50))}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta sobre el Estatuto… (Enter para enviar)"
            className="flex-1 max-h-[140px] resize-none border-none focus:ring-0 focus:outline-none py-3.5 px-4 text-sm chat-scroll"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              caretColor: 'oklch(0.60 0.18 264)',
            }}
            rows={1}
            disabled={isLoading}
            aria-label="Escribe tu pregunta"
          />

          {/* Right actions */}
          <div className="flex items-center gap-2 pr-3 pb-3 flex-shrink-0">
            {/* Char counter */}
            {text.length > MAX_CHARS * 0.7 && (
              <span
                className="text-[10px] tabular-nums transition-colors"
                style={{ color: isOverLimit ? 'oklch(0.72 0.20 14)' : 'var(--text-disabled)' }}
              >
                {charsLeft}
              </span>
            )}

            <button
              id="send-message-btn"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Enviar mensaje"
              className="send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p
          className="text-center text-[11px] mt-2"
          style={{ color: 'var(--text-disabled)' }}
        >
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{
              background: 'var(--surface-overlay)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            Enter
          </kbd>
          {' '}para enviar ·{' '}
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{
              background: 'var(--surface-overlay)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            Shift + Enter
          </kbd>
          {' '}para nueva línea · La IA puede cometer errores.
        </p>
      </div>
    </div>
  );
};
