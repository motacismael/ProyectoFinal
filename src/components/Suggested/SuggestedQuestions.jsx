import { SUGGESTED_QUESTIONS } from '../../utils/constants';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const SuggestedQuestions = ({ onSelectQuestion }) => {
  return (
    <div className="mb-8 animate-fade-up">
      {/* Hero welcome */}
      <div className="text-center mb-10 px-4">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
            boxShadow: '0 8px 32px oklch(0.38 0.19 264 / 0.40)',
          }}
        >
          <BookOpen className="w-8 h-8" style={{ color: 'oklch(0.97 0.005 250)' }} />
        </div>
        <h2
          className="text-2xl font-bold mb-2.5 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          ¿En qué te puedo ayudar?
        </h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Soy tu asistente del{' '}
          <span
            className="font-semibold"
            style={{ color: 'oklch(0.65 0.18 264)' }}
          >
            Estatuto Orgánico de la UASD
          </span>
          . Puedes preguntarme sobre derechos, deberes, órganos de gobierno y más.
        </p>
      </div>

      {/* Suggested questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'oklch(0.55 0.18 264)' }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Preguntas sugeridas
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {SUGGESTED_QUESTIONS.map((question, index) => (
            <button
              key={index}
              id={`suggested-q-${index}`}
              onClick={() => onSelectQuestion(question)}
              className="text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group flex items-center justify-between gap-3 animate-stagger-in"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                animationDelay: `${index * 60}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.38 0.19 264 / 0.10)';
                e.currentTarget.style.borderColor = 'oklch(0.38 0.19 264 / 0.40)';
                e.currentTarget.style.color = 'oklch(0.75 0.15 264)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-raised)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span className="flex-1 leading-snug">{question}</span>
              <ArrowRight
                className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                style={{ color: 'oklch(0.60 0.18 264)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
