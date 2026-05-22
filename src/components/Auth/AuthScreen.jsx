import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { BookOpen, Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      } else {
        // Registro de usuario
        if (!fullName.trim()) {
          setErrorMsg('Por favor introduce tu nombre completo.');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        // Comprobación de confirmación de email (dependiendo de la config de Supabase)
        if (data.user && data.session === null) {
          setSuccessMsg('¡Registro exitoso! Por favor verifica tu correo electrónico para confirmar tu cuenta.');
          // Limpiar campos
          setEmail('');
          setPassword('');
          setFullName('');
        } else {
          setSuccessMsg('¡Cuenta creada y sesión iniciada con éxito!');
        }
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      // Mensajes amigables para el usuario
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Correo o contraseña incorrectos. Verifica tus datos.');
      } else if (error.message.includes('User already registered')) {
        setErrorMsg('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setErrorMsg(error.message || 'Ocurrió un error inesperado. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-gray-50 to-gray-200 px-4 py-12 relative overflow-hidden">
      {/* Elementos geométricos decorativos */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-uasd-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      {/* Tarjeta de autenticación principal */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl p-8 animate-fade-in relative z-10">
        
        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 header-gradient rounded-2xl flex items-center justify-center border border-white/30 shadow-lg mb-4 animate-pulse-slow">
            <BookOpen className="w-8 h-8 text-white animate-bounce-slow" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Estatuto Orgánico UASD
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 max-w-[280px]">
            {isLogin
              ? 'Inicia sesión para consultar el estatuto y guardar tu historial.'
              : 'Regístrate gratis para comenzar a guardar tus consultas con el asesor.'}
          </p>
        </div>

        {/* Formularios */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Nombre completo (solo para registro) */}
          {!isLogin && (
            <div className="space-y-1">
              <label htmlFor="fullname" className="text-xs font-semibold text-gray-600 ml-1">
                Nombre Completo
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-gray-400" />
                <input
                  id="fullname"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 focus:border-uasd-blue focus:ring-1 focus:ring-uasd-blue/30 outline-none transition-all duration-200"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-gray-600 ml-1">
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="estudiante@uasd.edu.do"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 focus:border-uasd-blue focus:ring-1 focus:ring-uasd-blue/30 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-semibold text-gray-600 ml-1">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white pl-11 pr-4 py-3 text-sm rounded-2xl border border-gray-200 focus:border-uasd-blue focus:ring-1 focus:ring-uasd-blue/30 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Alertas */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-green-50 border border-green-100 text-xs text-green-700 animate-fade-in">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 header-gradient hover:opacity-95 text-white py-3.5 px-4 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separador u opción para cambiar de tab */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            {' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-uasd-blue font-bold hover:underline transition-all duration-150 cursor-pointer ml-1"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        {/* Marca institucional al pie */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Acceso seguro administrado por Supabase</span>
        </div>
      </div>
    </div>
  );
};
