import { SUGGESTED_QUESTIONS } from '../../utils/constants';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SuggestedQuestions = ({ onSelectQuestion }) => {
  return (
    <div className="mb-8 animate-fade-in-up">
      {/* Hero welcome */}
      <div className="text-center mb-8 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-uasd-blue rounded-2xl shadow-lg mb-4">
          <span className="text-white text-2xl font-bold">U</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¿En qué te puedo ayudar?
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Soy tu asistente del{' '}
          <span className="font-semibold text-uasd-blue">Estatuto Orgánico de la UASD</span>.
          Puedes hacerme preguntas sobre derechos, deberes, órganos de gobierno y más.
        </p>
      </div>

      {/* Suggested questions */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Sparkles className="w-4 h-4 text-uasd-blue" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Preguntas sugeridas
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {SUGGESTED_QUESTIONS.map((question, index) => (
            <button
              key={index}
              id={`suggested-q-${index}`}
              onClick={() => onSelectQuestion(question)}
              className="
                text-left px-4 py-3.5 rounded-xl border border-gray-200 bg-white
                text-sm text-gray-700 shadow-sm
                hover:border-uasd-blue hover:bg-blue-50 hover:text-uasd-blue
                transition-all duration-200 group
                flex items-center justify-between gap-3
              "
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="flex-1 leading-snug">{question}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-uasd-blue" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
