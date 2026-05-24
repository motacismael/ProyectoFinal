import { MessageSquare, Info, BookOpen, X, Shield, Users, FileText, LogOut } from 'lucide-react';
import { getAIProvider } from '../../services/aiService';

export const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const provider = getAIProvider();
  // Obtener iniciales o nombre para el avatar
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const userEmail = user?.email || '';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 bg-white border-r border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header del sidebar */}
        <div className="p-5 header-gradient text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Chatbot UASD</h2>
              <p className="text-[11px] text-blue-200 mt-0.5">Asesor Inteligente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 flex-1 overflow-y-auto chat-scroll space-y-4">

          {/* Aviso principal */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Este asistente responde preguntas basándose <strong>exclusivamente</strong> en el documento oficial del Estatuto Orgánico de la UASD.
            </p>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Características
            </h3>
            <div className="space-y-2">
              <FeatureItem icon={<Shield className="w-4 h-4" />} label="Respuestas verificadas" desc="Basadas en el estatuto oficial" />
              <FeatureItem icon={<FileText className="w-4 h-4" />} label="Cita artículos" desc="Referencia directa al texto legal" />
              <FeatureItem icon={<MessageSquare className="w-4 h-4" />} label="Historial en la Nube" desc="Tus consultas se guardan seguras" />
              <FeatureItem icon={<Users className="w-4 h-4" />} label="Para todos" desc="Estudiantes, docentes y personal" />
            </div>
          </div>

          {/* Sesión */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Sesión Protegida
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tus consultas se asocian de forma segura a tu cuenta y se almacenan de manera privada en tu historial.
            </p>
          </div>
        </div>

        {/* Perfil del Usuario y Logout */}
        {user && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-uasd-blue text-white font-bold text-sm flex items-center justify-center shadow-md">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-800 truncate leading-snug">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-400 truncate leading-none mt-0.5">
                  {userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl border border-red-100 hover:border-red-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] text-center text-gray-400">
            Desarrollado con <span className="text-red-400">♥</span> para Proyecto Final
          </p>
          <p className="text-[10px] text-center text-gray-300 mt-1">
            Powered by Supabase & {provider.name}
          </p>
        </div>
      </aside>
    </>
  );
};

const FeatureItem = ({ icon, label, desc }) => (
  <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="text-uasd-blue mt-0.5 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs font-medium text-gray-700">{label}</p>
      <p className="text-[11px] text-gray-400">{desc}</p>
    </div>
  </div>
);
