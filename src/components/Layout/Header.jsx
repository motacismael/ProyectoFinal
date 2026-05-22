import { BookOpen, Menu, RefreshCw } from 'lucide-react';
import { getAIProvider } from '../../services/aiService';

export const Header = ({ onMenuClick, onClearChat }) => {
  const provider = getAIProvider();

  return (
    <header className="header-gradient text-white shadow-lg z-10 flex-shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-menu-btn"
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/15 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl border border-white/20 shadow-inner">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none">
                Asistente UASD
              </h1>
              <p className="text-[11px] text-blue-200 font-normal mt-0.5 leading-none">
                Estatuto Orgánico · IA {provider.name}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Status + Clear */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            En línea
          </span>

          <button
            id="clear-chat-btn"
            onClick={onClearChat}
            title="Nueva conversación"
            className="p-2 hover:bg-white/15 rounded-lg transition-colors"
            aria-label="Nueva conversación"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
