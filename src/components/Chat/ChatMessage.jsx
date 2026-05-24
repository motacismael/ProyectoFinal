import Markdown from 'markdown-to-jsx';
import { BookOpen, User, ShieldAlert, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/* ─── Typewriter-aware bot content ─── */
const BotContent = ({ text, isNew }) => {
  const { displayedText, isDone } = useTypewriter(text, isNew, 14);

  return (
    <div className="bot-prose text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
      {isDone ? (
        <Markdown>{text}</Markdown>
      ) : (
        /* While typing: plain text for performance, no markdown parsing per char */
        <span>
          {displayedText}
          <span className="typing-cursor" />
        </span>
      )}
    </div>
  );
};

/* ─── Main message component ─── */
export const ChatMessage = ({ message, isNew = false }) => {
  const isBot   = message.sender === 'bot';
  const isError = message.isError;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-5 animate-fade-up group`}
    >
      <div
        className={`flex max-w-[88%] md:max-w-[80%] ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        } items-end gap-2.5`}
      >
        {/* Avatar */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs font-bold"
          style={{
            background: isBot
              ? isError
                ? 'oklch(0.48 0.24 14)'
                : 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))'
              : 'var(--surface-overlay)',
            color: isBot
              ? 'oklch(0.97 0.005 250)'
              : 'var(--text-secondary)',
            boxShadow: isBot && !isError
              ? '0 2px 8px oklch(0.38 0.19 264 / 0.35)'
              : 'none',
          }}
        >
          {isError ? (
            <ShieldAlert className="w-4 h-4" />
          ) : isBot ? (
            <BookOpen style={{ width: 15, height: 15 }} />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Bubble + meta */}
        <div className={`flex flex-col gap-1.5 ${isBot ? 'items-start' : 'items-end'}`}>
          <div
            className={`
              px-4 py-3 text-sm leading-relaxed relative
              ${isError
                ? 'bubble-error'
                : isBot
                  ? 'bubble-bot'
                  : 'bubble-user'
              }
            `}
          >
            {isBot && !isError ? (
              <BotContent text={message.text} isNew={isNew} />
            ) : (
              <p
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: isError ? 'oklch(0.80 0.12 14)' : 'oklch(0.97 0.005 250)' }}
              >
                {message.text}
              </p>
            )}

            {/* Copy button */}
            {isBot && !isError && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150"
                style={{
                  background: 'var(--surface-overlay)',
                  color: copied ? 'oklch(0.72 0.19 145)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
                title="Copiar respuesta"
                aria-label="Copiar respuesta"
              >
                {copied
                  ? <Check className="w-3 h-3" />
                  : <Copy className="w-3 h-3" />
                }
              </button>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-[10px] px-1" style={{ color: 'var(--text-disabled)' }}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
