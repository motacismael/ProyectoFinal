import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Animated sun/moon theme toggle button.
 * Inserts a brief full-screen flash when switching to make the
 * transition feel intentional rather than jarring.
 */
export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  const [flashing, setFlashing]   = useState(false);

  const handleToggle = () => {
    // Brief flash overlay for a premium feel
    setFlashing(true);
    setTimeout(() => {
      toggle();
      setFlashing(false);
    }, 80);
  };

  return (
    <>
      {/* Full-screen flash on switch */}
      {flashing && <div className="theme-flash-overlay" aria-hidden />}

      <button
        onClick={handleToggle}
        className="theme-toggle-btn"
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={isDark ? 'Modo claro' : 'Modo oscuro'}
        id="theme-toggle-btn"
      >
        {/* Sun icon */}
        <span className="theme-toggle-sun" aria-hidden>
          <Sun className="w-4 h-4" strokeWidth={2.2} />
        </span>

        {/* Moon icon */}
        <span className="theme-toggle-moon" aria-hidden>
          <Moon className="w-4 h-4" strokeWidth={2.2} />
        </span>
      </button>
    </>
  );
};
