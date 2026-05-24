import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
  BookOpen, Mail, Lock, User, ArrowRight,
  ShieldCheck, AlertCircle, Sparkles, Shield, FileText, MessageSquare
} from 'lucide-react';
import { ThemeToggle } from '../Layout/ThemeToggle';

/* ─── Animated brand feature item ─── */
const BrandFeature = ({ icon, title, desc, delay }) => (
  <div
    className="flex items-start gap-3 animate-stagger-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: 'oklch(0.38 0.19 264 / 0.2)',
        border: '1px solid oklch(0.38 0.19 264 / 0.35)',
      }}
    >
      <span style={{ color: 'var(--uasd-blue-vivid)' }}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </p>
      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {desc}
      </p>
    </div>
  </div>
);

/* ─── Floating label input ─── */
const FloatingInput = ({ id, label, type = 'text', value, onChange, placeholder, icon: Icon, required, autoComplete }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="block text-xs font-semibold tracking-wide"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
    </label>
    <div className="input-group relative flex items-center">
      <Icon
        className="absolute left-3.5 w-4 h-4 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border-0 focus:ring-0"
        style={{
          background: 'var(--surface-input)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          outline: 'none',
          transition: 'border-color 200ms, box-shadow 200ms, background-color 200ms',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--uasd-blue-light)';
          e.target.style.boxShadow = '0 0 0 3px var(--uasd-blue-dim)';
          e.target.style.background = 'var(--surface-raised)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-subtle)';
          e.target.style.boxShadow = 'none';
          e.target.style.background = 'var(--surface-input)';
        }}
      />
    </div>
  </div>
);

/* ─── Main component ─── */
export const AuthScreen = () => {
  const [isLogin, setIsLogin]       = useState(true);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [fullName, setFullName]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [errorMsg, setErrorMsg]     = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [shakeKey, setShakeKey]     = useState(0);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      setShakeKey(k => k + 1);
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      setShakeKey(k => k + 1);
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(), password,
        });
        if (error) throw error;
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Por favor introduce tu nombre completo.');
          setShakeKey(k => k + 1);
          setIsLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;

        if (data.user && data.session === null) {
          setSuccessMsg('¡Registro exitoso! Verifica tu correo para confirmar tu cuenta.');
          setEmail(''); setPassword(''); setFullName('');
        } else {
          setSuccessMsg('¡Cuenta creada y sesión iniciada con éxito!');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (error.message.includes('User already registered')) {
        setErrorMsg('Este correo ya está registrado. Inicia sesión.');
      } else {
        setErrorMsg(error.message || 'Ocurrió un error inesperado.');
      }
      setShakeKey(k => k + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div
      className="min-h-screen w-full flex relative"
      style={{ background: 'var(--surface-base)' }}
    >
      {/* Theme toggle — floating top-right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ── LEFT BRAND PANEL (hidden on mobile) ── */}
      <div className="hidden lg:flex auth-brand-panel flex-col justify-between w-[46%] p-12 xl:p-16 relative">
        {/* Orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="animate-slide-in-left flex items-center gap-3 mb-16">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
                boxShadow: '0 8px 32px oklch(0.38 0.19 264 / 0.4)',
              }}
            >
              <BookOpen className="w-6 h-6" style={{ color: 'oklch(0.97 0.005 250)' }} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'oklch(0.55 0.015 250)' }}>
                UASD
              </p>
              <h2 className="text-base font-bold leading-tight" style={{ color: 'oklch(0.92 0.008 250)' }}>
                Asesor Inteligente
              </h2>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-12">
            <h1
              className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight animate-stagger-in"
              style={{ color: 'oklch(0.95 0.006 250)', animationDelay: '100ms' }}
            >
              Estatuto<br />
              <span style={{ color: 'oklch(0.60 0.20 264)' }}>Orgánico</span><br />
              UASD
            </h1>
            <p
              className="mt-4 text-sm leading-relaxed max-w-xs animate-stagger-in"
              style={{ color: 'oklch(0.58 0.010 250)', animationDelay: '200ms' }}
            >
              Consulta el reglamento universitario con ayuda de inteligencia artificial.
              Respuestas precisas, citas directas, historial en la nube.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-5">
            <BrandFeature
              icon={<Shield className="w-4 h-4" />}
              title="Respuestas verificadas"
              desc="Basadas exclusivamente en el estatuto oficial de la UASD"
              delay={300}
            />
            <BrandFeature
              icon={<FileText className="w-4 h-4" />}
              title="Cita artículos"
              desc="Referencia directa al texto legal con número de artículo"
              delay={400}
            />
            <BrandFeature
              icon={<MessageSquare className="w-4 h-4" />}
              title="Historial guardado"
              desc="Tus consultas se almacenan de forma segura en la nube"
              delay={500}
            />
          </div>
        </div>

        {/* Bottom mark */}
        <div
          className="relative z-10 flex items-center gap-2 animate-stagger-in"
          style={{ animationDelay: '600ms' }}
        >
          <span className="text-xs" style={{ color: 'oklch(0.40 0.008 250)' }}>
            Proyecto Final · Ingeniería en Sistemas
          </span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="auth-form-panel flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Mobile logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:hidden flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))' }}
          >
            <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.97 0.005 250)' }} />
          </div>
          <span className="text-sm font-bold" style={{ color: 'oklch(0.90 0.008 250)' }}>
            Asesor UASD
          </span>
        </div>

        <div className="w-full max-w-sm animate-slide-in-right">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'oklch(0.95 0.006 250)' }}>
              {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'oklch(0.55 0.010 250)' }}>
              {isLogin
                ? 'Inicia sesión para consultar el estatuto'
                : 'Regístrate gratis, es rápido y fácil'}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex mb-7 rounded-xl p-1"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}
          >
            {['Iniciar sesión', 'Registrarse'].map((label, i) => {
              const active = i === 0 ? isLogin : !isLogin;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsLogin(i === 0); setErrorMsg(null); setSuccessMsg(null); }}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: active ? 'var(--uasd-blue)' : 'transparent',
                    color: active ? 'oklch(0.97 0.005 250)' : 'oklch(0.52 0.010 250)',
                    boxShadow: active ? '0 2px 10px oklch(0.38 0.19 264 / 0.35)' : 'none',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Name field (register only) */}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: isLogin ? '0' : '80px',
                opacity: isLogin ? 0 : 1,
                transition: 'max-height 300ms var(--ease-out-quart), opacity 250ms var(--ease-out-quart)',
              }}
            >
              <FloatingInput
                id="fullname"
                label="Nombre Completo"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                icon={User}
                required={!isLogin}
                autoComplete="name"
              />
            </div>

            <FloatingInput
              id="email"
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@uasd.edu.do"
              icon={Mail}
              required
              autoComplete="email"
            />

            <FloatingInput
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {/* Error message */}
            {errorMsg && (
              <div
                key={shakeKey}
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs animate-shake animate-scale-in"
                style={{
                  background: 'oklch(0.14 0.025 14)',
                  border: '1px solid oklch(0.30 0.08 14)',
                  color: 'oklch(0.80 0.12 14)',
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl text-xs animate-scale-in"
                style={{
                  background: 'oklch(0.14 0.025 145)',
                  border: '1px solid oklch(0.28 0.08 145)',
                  color: 'oklch(0.78 0.14 145)',
                }}
              >
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm
                flex items-center justify-center gap-2
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                ${isLoading ? 'btn-shimmer' : ''}
              `}
              style={{
                background: 'linear-gradient(135deg, oklch(0.38 0.19 264), oklch(0.50 0.20 264))',
                color: 'oklch(0.97 0.005 250)',
                boxShadow: '0 4px 20px oklch(0.38 0.19 264 / 0.35)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              {isLoading ? (
                <span
                  className="w-5 h-5 border-2 rounded-full animate-spin border-t-transparent"
                  style={{ borderColor: 'oklch(0.97 0.005 250)', borderTopColor: 'transparent' }}
                />
              ) : (
                <>
                  <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'oklch(0.48 0.14 264)' }} />
            <span className="text-xs" style={{ color: 'oklch(0.40 0.008 250)' }}>
              Acceso seguro con Supabase Auth
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
