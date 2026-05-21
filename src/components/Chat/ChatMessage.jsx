import Markdown from 'markdown-to-jsx';
import { User, ShieldAlert, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isError = message.isError;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-5 animate-fade-in group`}>
      <div className={`flex max-w-[88%] md:max-w-[78%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2.5`}>

        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-xs font-bold
          ${isBot
            ? isError
              ? 'bg-red-500 text-white'
              : 'bg-uasd-blue text-white'
            : 'bg-gray-200 text-gray-600'
          }
        `}>
          {isError ? (
            <ShieldAlert className="w-4 h-4" />
          ) : isBot ? (
            <span>U</span>
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Bubble + meta */}
        <div className={`flex flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>
          <div className={`
            px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed relative
            ${isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
              : isBot
                ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                : 'bg-uasd-blue text-white rounded-br-none'
            }
          `}>
            {isBot && !isError ? (
              <div className="bot-prose text-gray-800 text-sm">
                <Markdown>{message.text}</Markdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}

            {/* Copy button — sólo en mensajes del bot sin error */}
            {isBot && !isError && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                title="Copiar respuesta"
                aria-label="Copiar respuesta"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-[10px] text-gray-400 px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
