import { BookOpen, Menu, RefreshCw } from 'lucide-react';
import { getAIProvider } from '../../services/aiService';
import { ThemeToggle } from './ThemeToggle';

export const Header = ({ onMenuClick, onClearChat }) => {
  const provider = getAIProvider();

  return (
    <header
      className="flex-shrink-0 z-10 header-gradient"
    >
      <div className="px-4 py-3 flex items-center justify-between h-16">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-menu-btn"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-overlay)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
                boxShadow: '0 4px 12px oklch(0.38 0.19 264 / 0.35)',
              }}
            >
              <BookOpen
                style={{ width: 18, height: 18, color: 'oklch(0.97 0.005 250)' }}
              />
            </div>
            <div>
              <h1
                className="text-sm font-bold tracking-tight leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                Asistente UASD
              </h1>
              <p
                className="text-[11px] font-normal mt-0.5 leading-none"
                style={{ color: 'var(--text-muted)' }}
              >
                Estatuto Orgánico · IA {provider.name}
              </p>
            </div>
          </div>
        </div>

        {/* Right: online status + clear + theme toggle */}
        <div className="flex items-center gap-2">
          {/* Online badge */}
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: 'oklch(0.72 0.19 145 / 0.10)',
              color: 'oklch(0.65 0.18 145)',
              border: '1px solid oklch(0.72 0.19 145 / 0.20)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
              style={{ background: 'oklch(0.72 0.19 145)' }}
            />
            En línea
          </span>

          {/* New conversation */}
          <button
            id="clear-chat-btn"
            onClick={onClearChat}
            title="Nueva conversación"
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-overlay)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            aria-label="Nueva conversación"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Theme toggle — sun/moon */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
