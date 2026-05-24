import { useState, useEffect } from 'react';
import {
  MessageSquare, Info, BookOpen, X, Shield,
  Users, FileText, LogOut, ChevronLeft,
} from 'lucide-react';
import { getAIProvider } from '../../services/aiService';

const STORAGE_KEY = 'uasd-sidebar-collapsed';

/* ─── Feature item ─── */
const FeatureItem = ({ icon, label, desc, collapsed }) => (
  <div className="sidebar-nav-item group">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150"
      style={{
        background: 'oklch(0.38 0.19 264 / 0.12)',
        color: 'oklch(0.55 0.18 264)',
      }}
    >
      {icon}
    </div>
    <div className="sidebar-label min-w-0">
      <p className="text-xs font-semibold truncate" style={{ color: 'oklch(0.82 0.010 250)' }}>
        {label}
      </p>
      <p className="text-[11px] truncate mt-0.5" style={{ color: 'oklch(0.48 0.008 250)' }}>
        {desc}
      </p>
    </div>
    {/* Tooltip when collapsed */}
    {collapsed && (
      <div
        className="pointer-events-none absolute left-full ml-3 z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{
          background: 'oklch(0.20 0.018 250)',
          color: 'oklch(0.90 0.008 250)',
          border: '1px solid oklch(0.28 0.015 250)',
          boxShadow: '0 4px 16px oklch(0 0 0 / 0.5)',
        }}
      >
        {label}
      </div>
    )}
  </div>
);

/* ─── Main sidebar ─── */
export const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const provider = getAIProvider();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  };

  const userName  = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const userEmail = user?.email || '';
  const initial   = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── Mobile overlay ── */}
      <div
        className="fixed inset-0 lg:hidden z-20 transition-opacity duration-300"
        style={{
          background: 'oklch(0 0 0 / 0.6)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 flex flex-col
          sidebar-panel
          ${collapsed ? 'collapsed' : ''}
          transition-transform duration-300
        `}
        style={{
          transform: isOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: isOpen ? '0 0 40px oklch(0 0 0 / 0.6)' : 'none',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between flex-shrink-0 h-16 px-4"
          style={{ borderBottom: '1px solid oklch(0.22 0.012 250)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
                boxShadow: '0 4px 12px oklch(0.38 0.19 264 / 0.4)',
              }}
            >
              <BookOpen className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div className="sidebar-label">
              <h2 className="font-bold text-sm leading-tight" style={{ color: 'oklch(0.92 0.008 250)' }}>
                Chatbot UASD
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'oklch(0.48 0.012 250)' }}>
                Asesor Inteligente
              </p>
            </div>
          </div>

          {/* Close on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'oklch(0.50 0.010 250)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'oklch(0.22 0.012 250)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation content ── */}
        <div className="flex-1 overflow-y-auto chat-scroll py-4 px-3 space-y-1">

          {/* Info notice */}
          <div
            className="mb-4 rounded-xl p-3 flex items-start gap-2.5"
            style={{
              background: 'oklch(0.38 0.19 264 / 0.08)',
              border: '1px solid oklch(0.38 0.19 264 / 0.20)',
            }}
          >
            <Info
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: 'oklch(0.60 0.18 264)' }}
            />
            <div className="sidebar-label">
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.65 0.12 264)' }}>
                Respondo <strong>exclusivamente</strong> basado en el Estatuto Orgánico oficial.
              </p>
            </div>
          </div>

          {/* Section label */}
          <div className="sidebar-label px-2 mb-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'oklch(0.40 0.008 250)' }}>
              Características
            </p>
          </div>

          <FeatureItem
            icon={<Shield className="w-4 h-4" />}
            label="Respuestas verificadas"
            desc="Basadas en el estatuto oficial"
            collapsed={collapsed}
          />
          <FeatureItem
            icon={<FileText className="w-4 h-4" />}
            label="Cita artículos"
            desc="Referencia directa al texto legal"
            collapsed={collapsed}
          />
          <FeatureItem
            icon={<MessageSquare className="w-4 h-4" />}
            label="Historial en la nube"
            desc="Consultas guardadas de forma segura"
            collapsed={collapsed}
          />
          <FeatureItem
            icon={<Users className="w-4 h-4" />}
            label="Para todos"
            desc="Estudiantes, docentes y personal"
            collapsed={collapsed}
          />

          {/* Provider badge */}
          <div className="mt-4 px-2">
            <div className="sidebar-label">
              <div
                className="text-[11px] px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                style={{
                  background: 'oklch(0.18 0.014 250)',
                  color: 'oklch(0.50 0.010 250)',
                  border: '1px solid oklch(0.24 0.012 250)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-glow-pulse inline-block" />
                Powered by {provider.name}
              </div>
            </div>
          </div>
        </div>

        {/* ── User profile + logout ── */}
        {user && (
          <div
            className="flex-shrink-0 p-3"
            style={{ borderTop: '1px solid oklch(0.22 0.012 250)' }}
          >
            <div className="flex items-center gap-3 mb-2.5 px-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
                  color: 'oklch(0.97 0.005 250)',
                  boxShadow: '0 2px 8px oklch(0.38 0.19 264 / 0.35)',
                }}
              >
                {initial}
              </div>
              <div className="sidebar-label min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'oklch(0.88 0.008 250)' }}>
                  {userName}
                </p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: 'oklch(0.45 0.008 250)' }}>
                  {userEmail}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: 'oklch(0.48 0.24 14 / 0.10)',
                color: 'oklch(0.72 0.20 14)',
                border: '1px solid oklch(0.48 0.24 14 / 0.20)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.48 0.24 14 / 0.20)';
                e.currentTarget.style.borderColor = 'oklch(0.48 0.24 14 / 0.40)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'oklch(0.48 0.24 14 / 0.10)';
                e.currentTarget.style.borderColor = 'oklch(0.48 0.24 14 / 0.20)';
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="sidebar-label">Cerrar Sesión</span>
            </button>
          </div>
        )}

        {/* ── Collapse toggle (desktop only) ── */}
        <div
          className="hidden lg:flex flex-shrink-0 p-3 items-center"
          style={{
            borderTop: '1px solid oklch(0.22 0.012 250)',
            justifyContent: collapsed ? 'center' : 'flex-end',
          }}
        >
          <button
            onClick={toggleCollapsed}
            className={`sidebar-toggle-btn ${collapsed ? 'collapsed-state' : ''}`}
            aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
