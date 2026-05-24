import { BookOpen } from 'lucide-react';

export const ChatLoading = () => {
  return (
    <div className="flex w-full justify-start mb-5 animate-fade-up">
      <div className="flex items-end gap-2.5">
        {/* Avatar */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
            boxShadow: '0 2px 8px oklch(0.38 0.19 264 / 0.35)',
          }}
        >
          <BookOpen style={{ width: 15, height: 15, color: 'oklch(0.97 0.005 250)' }} />
        </div>

        {/* Typing bubble */}
        <div
          className="px-4 py-3.5 flex items-center gap-3 bubble-bot"
        >
          <div className="flex items-center gap-1.5">
            {[0, 250, 500].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 rounded-full animate-pulse-dot"
                style={{
                  background: 'oklch(0.50 0.18 264)',
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Analizando…
          </span>
        </div>
      </div>
    </div>
  );
};
