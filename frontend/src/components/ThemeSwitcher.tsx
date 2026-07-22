import { Moon, SunMedium } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400"
    >
      {theme === 'dark' ? <Moon size={16} /> : <SunMedium size={16} />}
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
